import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

type Bindings = { DB: D1Database; ADMIN_EMAIL?: string; SENDGRID_KEY?: string; ULTRAMSG_TOKEN?: string; ULTRAMSG_INSTANCE?: string }

const auth = new Hono<{ Bindings: Bindings }>()

// Send email via SendGrid (if key configured) or store as notification
async function sendAdminEmail(c: any, subject: string, body: string) {
  try {
    const ADMIN_EMAIL = c.env.ADMIN_EMAIL || 'admin@salonlink.it.com'
    const SENDGRID_KEY = c.env.SENDGRID_KEY

    if (SENDGRID_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
          from: { email: 'noreply@salonlink.it.com', name: 'SalonLink' },
          subject,
          content: [{ type: 'text/html', value: body }]
        })
      })
    }

    // Always store as admin notification in DB
    const adminUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    ).first() as any
    if (adminUser) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, ?, ?, 'system', '/admin')
      `).bind(adminUser.id, subject, body.replace(/<[^>]+>/g, '').substring(0, 200)).run()
    }
  } catch (_) {
    // Email is best-effort, don't block registration
  }
}

// Helper: hash password using Web Crypto (no bcrypt needed in Workers)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password)
  return newHash === hash
}

function generateRef(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// POST /api/auth/register
auth.post('/register', async (c) => {
  try {
    const { email, phone, password, first_name, last_name, role, business_name, service_category } = await c.req.json()

    if (!email || !password || !first_name || !last_name) {
      return c.json({ success: false, error: 'Missing required fields' }, 400)
    }
    if (password.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    }

    // Check existing user
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) {
      return c.json({ success: false, error: 'Email already registered' }, 409)
    }

    const password_hash = await hashPassword(password)
    const userRole = role === 'provider' ? 'provider' : 'customer'

    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, phone, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(email, phone || null, password_hash, first_name, last_name, userRole).run()

    const userId = result.meta.last_row_id

    // If provider, always create provider profile (business_name can be set later in onboarding)
    if (userRole === 'provider') {
      await c.env.DB.prepare(
        'INSERT INTO providers (user_id, business_name, service_category) VALUES (?, ?, ?)'
      ).bind(userId, business_name || (first_name + ' Salon'), service_category || 'hair_salon').run()
    }

    // Generate JWT
    const token = await sign(
      { sub: String(userId), role: userRole, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      'salonlink_jwt_secret_2026'
    )

    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(userId).first() as any

    // Attach provider_id if provider
    if (userRole === 'provider') {
      const prow = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(userId).first() as any
      if (prow && user) (user as any).provider_id = prow.id
    }

    // Notify admin of new registration
    const roleLabel = userRole === 'provider' ? '🔴 SERVICE PROVIDER' : '🟢 CUSTOMER'
    const emailSubject = `New ${roleLabel} Registration - ${first_name} ${last_name}`
    const emailBody = `
      <h2>New Registration on SalonLink</h2>
      <p><strong>Type:</strong> ${roleLabel}</p>
      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      ${userRole === 'provider' ? `<p><strong>Business:</strong> ${business_name}</p><p><strong>Service:</strong> ${service_category}</p>` : ''}
      <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
      ${userRole === 'provider' ? '<p><a href="https://salonlink.it.com/admin">👉 Approve this provider in Admin Panel</a></p>' : ''}
    `
    await sendAdminEmail(c, emailSubject, emailBody)

    // Ensure name field always present
    if (user) (user as any).name = (((user as any).first_name || '') + ' ' + ((user as any).last_name || '')).trim()
    return c.json({ success: true, token, user })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password required' }, 400)
    }

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND is_active = 1'
    ).bind(email).first() as any

    if (!user) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    const token = await sign(
      { sub: String(user.id), role: user.role, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      'salonlink_jwt_secret_2026'
    )

    // Get provider id if provider
    let provider_id = null
    if (user.role === 'provider') {
      const prov = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.id).first() as any
      if (prov) provider_id = prov.id
    }

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: ((user.first_name || '') + ' ' + (user.last_name || '')).trim(),
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
        provider_id
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/auth/me
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }
    const token = authHeader.split(' ')[1]
    const payload = await verify(token, 'salonlink_jwt_secret_2026', 'HS256') as any

    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(payload.sub).first()

    if (!user) return c.json({ success: false, error: 'User not found' }, 404)

    // Always include name field
    const userWithName = { ...user, name: (((user as any).first_name || '') + ' ' + ((user as any).last_name || '')).trim() }
    return c.json({ success: true, user: userWithName })
  } catch (e: any) {
    return c.json({ success: false, error: 'Invalid token' }, 401)
  }
})

// PUT /api/auth/profile — update user profile
auth.put('/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const payload = await verify(authHeader.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    const { first_name, last_name, phone } = await c.req.json()
    await c.env.DB.prepare(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?'
    ).bind(first_name, last_name, phone, payload.sub).run()
    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(payload.sub).first()
    return c.json({ success: true, user })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PUT /api/auth/password — change password
auth.put('/password', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const payload = await verify(authHeader.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    const { current_password, new_password } = await c.req.json()
    if (!current_password || !new_password) return c.json({ success: false, error: 'Both passwords required' }, 400)
    if (new_password.length < 8) return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    const user = await c.env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.sub).first() as any
    const valid = await verifyPassword(current_password, user.password_hash)
    if (!valid) return c.json({ success: false, error: 'Current password is incorrect' }, 401)
    const newHash = await hashPassword(new_password)
    await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(newHash, payload.sub).run()
    return c.json({ success: true, message: 'Password updated successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/logout
auth.post('/logout', async (c) => {
  return c.json({ success: true, message: 'Logged out successfully' })
})

// POST /api/auth/reset-password
// Self-service: user provides email + new password. Generates a 6-digit code, 
// stores it and returns it (in demo mode since no email service configured).
// Two-step: step 1 = send code, step 2 = verify code + set new password.
auth.post('/reset-password/request', async (c) => {
  try {
    const { email } = await c.req.json()
    if (!email) return c.json({ success: false, error: 'Email is required' }, 400)

    const user = await c.env.DB.prepare(
      'SELECT id, email, first_name FROM users WHERE email = ? AND is_active = 1'
    ).bind(email.toLowerCase().trim()).first() as any

    if (!user) {
      // Don't reveal whether email exists
      return c.json({ success: true, message: 'If that email is registered, a reset code has been sent.' })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const codeHash = await hashPassword(code)
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS password_resets (
        email TEXT PRIMARY KEY,
        code_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        attempts INTEGER DEFAULT 0
      )
    `).run()

    await c.env.DB.prepare(
      'INSERT INTO password_resets (email, code_hash, expires_at, attempts) VALUES (?,?,?,0) ON CONFLICT(email) DO UPDATE SET code_hash=excluded.code_hash, expires_at=excluded.expires_at, attempts=0'
    ).bind(email.toLowerCase().trim(), codeHash, expires).run()

    // Try SendGrid if configured
    const SENDGRID_KEY = c.env.SENDGRID_KEY
    let sent = false
    if (SENDGRID_KEY) {
      try {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${SENDGRID_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: 'noreply@salonlink.it.com', name: 'SalonLink' },
            subject: 'SalonLink — Password Reset Code',
            content: [{ type: 'text/html', value: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
                <h2 style="color:#111;">Password Reset</h2>
                <p>Hi ${user.first_name || 'there'},</p>
                <p>Your SalonLink password reset code is:</p>
                <div style="background:#f5f5f5;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
                  <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#111;">${code}</span>
                </div>
                <p style="color:#888;font-size:13px;">This code expires in 15 minutes. If you didn't request this, ignore this email.</p>
              </div>
            `}]
          })
        })
        sent = res.ok
      } catch (_) {}
    }

    return c.json({ 
      success: true, 
      message: sent ? 'Reset code sent to your email' : 'Reset code generated',
      // In demo mode (no email), return code so user can reset
      ...(sent ? {} : { demo_code: code, demo_note: 'Email service not configured — use this code' })
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/reset-password/confirm
auth.post('/reset-password/confirm', async (c) => {
  try {
    const { email, code, new_password } = await c.req.json()
    if (!email || !code || !new_password) {
      return c.json({ success: false, error: 'Email, code and new password are required' }, 400)
    }
    if (new_password.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    }

    const row = await c.env.DB.prepare(
      'SELECT code_hash, expires_at, attempts FROM password_resets WHERE email = ?'
    ).bind(email.toLowerCase().trim()).first() as any

    if (!row) return c.json({ success: false, error: 'No reset code found. Please request a new one.' }, 400)
    if (new Date(row.expires_at) < new Date()) return c.json({ success: false, error: 'Reset code has expired. Please request a new one.' }, 400)
    if (row.attempts >= 5) return c.json({ success: false, error: 'Too many attempts. Please request a new code.' }, 429)

    const valid = await verifyPassword(code, row.code_hash)
    if (!valid) {
      await c.env.DB.prepare('UPDATE password_resets SET attempts = attempts + 1 WHERE email = ?').bind(email.toLowerCase().trim()).run()
      return c.json({ success: false, error: 'Incorrect code. Please try again.' }, 400)
    }

    // Update password
    const newHash = await hashPassword(new_password)
    await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE email = ?').bind(newHash, email.toLowerCase().trim()).run()
    await c.env.DB.prepare('DELETE FROM password_resets WHERE email = ?').bind(email.toLowerCase().trim()).run()

    return c.json({ success: true, message: 'Password updated successfully. You can now sign in.' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── WhatsApp OTP via UltraMsg ──────────────────────────────
// Generates a 6-digit OTP, stores it in the sessions table (reused as otp store),
// and sends it to the user's WhatsApp number.

async function sendWhatsAppOtp(c: any, phone: string, otp: string): Promise<boolean> {
  const token    = c.env.ULTRAMSG_TOKEN
  const instance = c.env.ULTRAMSG_INSTANCE
  if (!token || !instance) return false          // no credentials configured

  const ghPhone = '233' + phone.replace(/^0/, '').replace(/\D/g, '')
  const msg = `Your SalonLink verification code is: *${otp}*\n\nDo not share this code with anyone. It expires in 10 minutes.`

  try {
    const res = await fetch(`https://api.ultramsg.com/${instance}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, to: ghPhone, body: msg })
    })
    const data: any = await res.json()
    return data.sent === 'true' || data.sent === true
  } catch { return false }
}

// POST /api/auth/otp/send
auth.post('/otp/send', async (c) => {
  try {
    const { phone } = await c.req.json()
    if (!phone) return c.json({ success: false, error: 'Phone number required' }, 400)

    const clean = phone.replace(/\D/g, '')
    if (clean.length < 9) return c.json({ success: false, error: 'Enter a valid Ghana phone number' }, 400)

    // Generate 6-digit OTP
    const otp  = String(Math.floor(100000 + Math.random() * 900000))
    const hash = await hashPassword(otp)  // store hashed so plaintext isn't in DB
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Upsert OTP into a small otp_codes table (created on first use)
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        phone TEXT PRIMARY KEY,
        otp_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        attempts INTEGER DEFAULT 0
      )
    `).run()
    await c.env.DB.prepare(
      'INSERT INTO otp_codes (phone, otp_hash, expires_at, attempts) VALUES (?,?,?,0) ON CONFLICT(phone) DO UPDATE SET otp_hash=excluded.otp_hash, expires_at=excluded.expires_at, attempts=0'
    ).bind(clean, hash, expires).run()

    // Try to send via WhatsApp
    const sent = await sendWhatsAppOtp(c, clean, otp)

    if (sent) {
      return c.json({ success: true, message: 'OTP sent to your WhatsApp', via: 'whatsapp' })
    } else {
      // No WhatsApp credentials — return OTP in response for dev/demo (remove in prod)
      return c.json({ success: true, message: 'OTP generated (WhatsApp not configured)', otp_demo: otp, via: 'demo' })
    }
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/otp/verify
auth.post('/otp/verify', async (c) => {
  try {
    const { phone, otp } = await c.req.json()
    if (!phone || !otp) return c.json({ success: false, error: 'Phone and OTP required' }, 400)

    const clean = phone.replace(/\D/g, '')

    const row = await c.env.DB.prepare(
      'SELECT otp_hash, expires_at, attempts FROM otp_codes WHERE phone = ?'
    ).bind(clean).first() as any

    if (!row) return c.json({ success: false, error: 'No OTP found for this number. Please request a new one.' }, 400)
    if (new Date(row.expires_at) < new Date()) return c.json({ success: false, error: 'OTP has expired. Please request a new one.' }, 400)
    if (row.attempts >= 5) return c.json({ success: false, error: 'Too many attempts. Please request a new OTP.' }, 429)

    const valid = await verifyPassword(otp, row.otp_hash)
    if (!valid) {
      await c.env.DB.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = ?').bind(clean).run()
      return c.json({ success: false, error: 'Incorrect OTP. Please try again.' }, 400)
    }

    // OTP correct — delete it and find or create user
    await c.env.DB.prepare('DELETE FROM otp_codes WHERE phone = ?').bind(clean).run()

    let user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE phone = ?'
    ).bind(clean).first() as any

    if (!user) {
      // Auto-create account from phone number
      const result = await c.env.DB.prepare(
        "INSERT INTO users (phone, first_name, last_name, role, password_hash) VALUES (?,?,?,'customer',?) RETURNING id"
      ).bind(clean, 'User', clean.slice(-4), await hashPassword(crypto.randomUUID())).first() as any

      user = await c.env.DB.prepare(
        'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
      ).bind(result.id).first() as any
    }

    const token = await sign(
      { sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
      'salonlink_jwt_secret_2026', 'HS256'
    )

    return c.json({
      success: true,
      token,
      user: { id: user.id, name: (user.first_name + ' ' + user.last_name).trim(), email: user.email, phone: user.phone, role: user.role, is_verified: user.is_verified }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default auth
