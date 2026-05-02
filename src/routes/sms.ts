import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { normalizeGhanaPhone, renderTemplate, sendHubtelSms } from '../utils/hubtel'

type Bindings = {
  DB: D1Database
  HUBTEL_CLIENT_ID?: string
  HUBTEL_CLIENT_SECRET?: string
  HUBTEL_SENDER_ID?: string
  HUBTEL_SMS_FROM?: string
  JWT_SECRET?: string
}

type SmsMigrationTable = 'sms_logs' | 'otp_codes' | 'customer_profiles' | 'automation_rules'

const sms = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

function migrationRequired(c: any) {
  return c.json({
    success: false,
    error: 'Database migration required',
    migration: 'migrations/0004_hubtel_sms_analytics.sql'
  }, 503)
}

function isMigrationError(error: any): boolean {
  const message = String(error?.message || error || '').toLowerCase()
  return message.includes('no such table') || message.includes('no such column') || message.includes('database migration required')
}

async function requireTables(c: any, tables: SmsMigrationTable[]): Promise<void> {
  for (const table of tables) {
    await c.env.DB.prepare(`SELECT 1 FROM ${table} LIMIT 1`).first()
  }
}

function truncate(value: string | null | undefined, max: number): string | null {
  if (value === undefined || value === null) return null
  const text = String(value)
  return text.length > max ? text.slice(0, max) : text
}

function redactOtpCodes(value: string | null | undefined): string | null {
  const text = truncate(value, 4000)
  return text ? text.replace(/\b\d{6}\b/g, '[code]') : text
}

function safeLoggedMessage(message: string, messageType: string): string {
  const text = messageType === 'otp' ? (redactOtpCodes(message) || '') : message
  return truncate(text, 500) || ''
}

function safeProviderResponse(response: any): string | null {
  if (!response) return null
  const raw = typeof response === 'string' ? response : JSON.stringify(response)
  return truncate(redactOtpCodes(raw), 2000)
}

function safeErrorMessage(error: string | null | undefined): string | null {
  return truncate(redactOtpCodes(error), 500)
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function hashText(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

async function hashOtp(c: any, phone: string, otp: string): Promise<string> {
  return hashText(`${normalizeGhanaPhone(phone)}:${otp}:${getJwtSecret(c)}`)
}

async function getAuthUser(c: any): Promise<any | null> {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
    return c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ? AND is_active = 1'
    ).bind(payload.sub).first()
  } catch {
    return null
  }
}

function phoneCandidates(phone: string): string[] {
  const normalized = normalizeGhanaPhone(phone)
  const local = normalized.startsWith('233') ? '0' + normalized.slice(3) : normalized
  const national = normalized.startsWith('233') ? normalized.slice(3) : normalized
  return [normalized, '+' + normalized, local, national]
}

async function findUserByPhone(c: any, phone: string): Promise<any | null> {
  const candidates = phoneCandidates(phone)
  return c.env.DB.prepare(`
    SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified
    FROM users
    WHERE phone IN (?, ?, ?, ?)
      OR REPLACE(REPLACE(REPLACE(COALESCE(phone, ''), '+', ''), ' ', ''), '-', '') = ?
    LIMIT 1
  `).bind(candidates[0], candidates[1], candidates[2], candidates[3], normalizeGhanaPhone(phone)).first()
}

async function ensureCustomerProfile(c: any, userId: number | string, login = false): Promise<void> {
  await c.env.DB.prepare(`
    INSERT OR IGNORE INTO customer_profiles (user_id, preferred_channel, first_seen_at, last_seen_at)
    VALUES (?, 'sms', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(userId).run()

  if (login) {
    await c.env.DB.prepare(`
      UPDATE customer_profiles
      SET last_seen_at = CURRENT_TIMESTAMP, last_login_at = CURRENT_TIMESTAMP, preferred_channel = 'sms'
      WHERE user_id = ?
    `).bind(userId).run()
  } else {
    await c.env.DB.prepare(`
      UPDATE customer_profiles SET last_seen_at = CURRENT_TIMESTAMP WHERE user_id = ?
    `).bind(userId).run()
  }
}

function smsProviderMessageId(response: any): string | null {
  if (!response || typeof response === 'string') return null
  return response.messageId || response.MessageId || response.message_id || response.id ||
    response.data?.messageId || response.Data?.MessageId || null
}

async function writeSmsLog(c: any, input: {
  userId?: number | string | null
  phone: string
  messageType: string
  message: string
  status: string
  response?: any
  error?: string | null
}) {
  await c.env.DB.prepare(`
    INSERT INTO sms_logs (
      user_id, phone, provider, message_type, message, status,
      provider_message_id, provider_response, error_message, sent_at
    ) VALUES (?, ?, 'hubtel', ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    input.userId || null,
    normalizeGhanaPhone(input.phone),
    input.messageType,
    safeLoggedMessage(input.message, input.messageType),
    input.status,
    smsProviderMessageId(input.response),
    safeProviderResponse(input.response),
    safeErrorMessage(input.error),
    input.status === 'sent' ? new Date().toISOString() : null
  ).run()
}

function publicUser(user: any, providerId: number | null = null) {
  return {
    id: user.id,
    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
    email: user.email,
    phone: user.phone,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    avatar_url: user.avatar_url,
    is_verified: user.is_verified,
    provider_id: providerId
  }
}

async function providerIdForUser(c: any, user: any): Promise<number | null> {
  if (user.role !== 'provider') return null
  const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.id).first() as any
  return provider?.id || null
}

async function issueJwt(c: any, user: any): Promise<string> {
  return sign(
    { sub: String(user.id), role: user.role, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    getJwtSecret(c),
    'HS256'
  )
}

// POST /api/sms/otp/send
sms.post('/otp/send', async (c) => {
  try {
    await requireTables(c, ['otp_codes', 'sms_logs'])

    const { phone, purpose = 'login' } = await c.req.json()
    const normalized = normalizeGhanaPhone(phone)

    if (!normalized || normalized.length < 12) {
      return c.json({ success: false, error: 'Enter a valid Ghana phone number' }, 400)
    }

    const otp = generateOtp()
    const otpHash = await hashOtp(c, normalized, otp)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await c.env.DB.prepare(
      'UPDATE otp_codes SET is_used = 1 WHERE phone = ? AND purpose = ? AND is_used = 0'
    ).bind(normalized, purpose).run()

    const inserted = await c.env.DB.prepare(`
      INSERT INTO otp_codes (phone, channel, purpose, otp_hash, expires_at, attempts, is_used)
      VALUES (?, 'sms', ?, ?, ?, 0, 0)
    `).bind(normalized, purpose, otpHash, expiresAt).run()

    const message = `Your SalonLink login code is ${otp}. It expires in 10 minutes. Do not share it.`
    const result = await sendHubtelSms(c.env, normalized, message)
    const status = result.ok ? 'sent' : 'failed'

    await writeSmsLog(c, {
      phone: normalized,
      messageType: 'otp',
      message,
      status,
      response: result.response,
      error: result.error
    })

    if (!result.ok) {
      const otpId = inserted.meta?.last_row_id
      if (otpId) {
        await c.env.DB.prepare('UPDATE otp_codes SET is_used = 1 WHERE id = ?').bind(otpId).run()
      }
      return c.json({ success: false, error: result.error || 'Failed to send OTP' }, 502)
    }

    return c.json({ success: true, message: 'OTP sent by SMS', via: 'sms', expires_in: 600 })
  } catch (e: any) {
    if (isMigrationError(e)) return migrationRequired(c)
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/sms/otp/verify
sms.post('/otp/verify', async (c) => {
  try {
    await requireTables(c, ['otp_codes', 'customer_profiles'])

    const { phone, otp, purpose = 'login' } = await c.req.json()
    const normalized = normalizeGhanaPhone(phone)
    const code = String(otp || '').trim()

    if (!normalized || !code) return c.json({ success: false, error: 'Phone and OTP required' }, 400)
    if (code.length !== 6) return c.json({ success: false, error: 'Enter the 6-digit code' }, 400)

    const row = await c.env.DB.prepare(`
      SELECT id, otp_hash, expires_at, attempts
      FROM otp_codes
      WHERE phone = ? AND purpose = ? AND is_used = 0
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `).bind(normalized, purpose).first() as any

    if (!row) return c.json({ success: false, error: 'No OTP found for this number. Please request a new one.' }, 400)
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await c.env.DB.prepare('UPDATE otp_codes SET is_used = 1 WHERE id = ?').bind(row.id).run()
      return c.json({ success: false, error: 'OTP has expired. Please request a new one.' }, 400)
    }
    if ((row.attempts || 0) >= 5) {
      await c.env.DB.prepare('UPDATE otp_codes SET is_used = 1 WHERE id = ?').bind(row.id).run()
      return c.json({ success: false, error: 'Too many attempts. Please request a new OTP.' }, 429)
    }

    const valid = await hashOtp(c, normalized, code) === row.otp_hash
    if (!valid) {
      await c.env.DB.prepare(`
        UPDATE otp_codes
        SET attempts = attempts + 1,
            is_used = CASE WHEN attempts + 1 >= 5 THEN 1 ELSE is_used END
        WHERE id = ?
      `).bind(row.id).run()
      return c.json({ success: false, error: 'Incorrect OTP. Please try again.' }, 400)
    }

    await c.env.DB.prepare('UPDATE otp_codes SET is_used = 1, attempts = attempts + 1 WHERE id = ?').bind(row.id).run()

    let user = await findUserByPhone(c, normalized)
    let isNewUser = false

    if (!user) {
      const email = `phone-${normalized}@salonlink.local`
      const passwordHash = await hashText(crypto.randomUUID())
      const created = await c.env.DB.prepare(`
        INSERT INTO users (email, phone, password_hash, first_name, last_name, role, is_verified, is_active)
        VALUES (?, ?, ?, 'SalonLink', 'Customer', 'customer', 1, 1)
      `).bind(email, normalized, passwordHash).run()

      user = await c.env.DB.prepare(
        'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
      ).bind(created.meta.last_row_id).first() as any
      isNewUser = true
    }

    if (user.role === 'customer') await ensureCustomerProfile(c, user.id, true)

    const token = await issueJwt(c, user)
    const providerId = await providerIdForUser(c, user)

    return c.json({ success: true, token, user: publicUser(user, providerId), is_new_user: isNewUser })
  } catch (e: any) {
    if (isMigrationError(e)) return migrationRequired(c)
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/sms/welcome
sms.post('/welcome', async (c) => {
  try {
    await requireTables(c, ['customer_profiles', 'sms_logs', 'automation_rules'])

    const body = await c.req.json().catch(() => ({})) as any
    let user = await getAuthUser(c)

    if (!user && body.phone) user = await findUserByPhone(c, body.phone)
    if (!user) return c.json({ success: false, error: 'User or phone required' }, 400)
    if (user.role !== 'customer') return c.json({ success: true, skipped: true, reason: 'Welcome SMS is only sent to customer accounts' })
    if (!user.phone && !body.phone) return c.json({ success: true, skipped: true, reason: 'No phone number on this account' })

    const phone = normalizeGhanaPhone(body.phone || user.phone)
    await ensureCustomerProfile(c, user.id)

    const profile = await c.env.DB.prepare(
      'SELECT welcome_sms_sent_at FROM customer_profiles WHERE user_id = ?'
    ).bind(user.id).first() as any

    if (profile?.welcome_sms_sent_at) {
      return c.json({ success: true, skipped: true, reason: 'Welcome SMS already sent' })
    }

    const rule = await c.env.DB.prepare(`
      SELECT message_template FROM automation_rules
      WHERE rule_key = 'welcome_sms_on_login' AND is_active = 1
      LIMIT 1
    `).first() as any

    const template = rule?.message_template || 'Welcome to SalonLink, {{first_name}}. Find trusted beauty providers and book your next appointment with ease.'
    const message = renderTemplate(template, {
      first_name: user.first_name || 'there',
      last_name: user.last_name || '',
      phone
    })

    const result = await sendHubtelSms(c.env, phone, message)
    const status = result.ok ? 'sent' : 'failed'

    await writeSmsLog(c, {
      userId: user.id,
      phone,
      messageType: 'welcome',
      message,
      status,
      response: result.response,
      error: result.error
    })

    if (!result.ok) return c.json({ success: false, error: result.error || 'Failed to send welcome SMS' }, 502)

    await c.env.DB.prepare(`
      UPDATE customer_profiles
      SET welcome_sms_sent_at = CURRENT_TIMESTAMP, last_seen_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(user.id).run()

    return c.json({ success: true, message: 'Welcome SMS sent' })
  } catch (e: any) {
    if (isMigrationError(e)) return migrationRequired(c)
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default sms
