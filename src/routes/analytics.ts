import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }
type AnalyticsMigrationTable = 'sms_logs' | 'otp_codes' | 'customer_profiles' | 'automation_rules' | 'analytics_events'

const analytics = new Hono<{ Bindings: Bindings }>()
const REQUIRED_SMS_ANALYTICS_TABLES: AnalyticsMigrationTable[] = ['sms_logs', 'otp_codes', 'customer_profiles', 'automation_rules', 'analytics_events']

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

async function requireTables(c: any, tables: AnalyticsMigrationTable[]): Promise<void> {
  for (const table of tables) {
    await c.env.DB.prepare(`SELECT 1 FROM ${table} LIMIT 1`).first()
  }
}

async function getAuthPayload(c: any): Promise<any | null> {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
  } catch {
    return null
  }
}

async function requireAdmin(c: any): Promise<any | null> {
  const payload = await getAuthPayload(c)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

async function hashIp(value: string | null): Promise<string | null> {
  if (!value) return null
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}

function asNumber(value: any): number | null {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function metadataString(value: any): string | null {
  if (value === undefined || value === null) return null
  try {
    const raw = typeof value === 'string' ? value : JSON.stringify(value)
    return raw.length > 4000 ? raw.slice(0, 4000) : raw
  } catch {
    return null
  }
}

async function countFirst(c: any, sql: string): Promise<number> {
  const row = await c.env.DB.prepare(sql).first() as any
  return Number(row?.count || row?.total || 0)
}

// POST /api/analytics/track
analytics.post('/track', async (c) => {
  try {
    await requireTables(c, REQUIRED_SMS_ANALYTICS_TABLES)

    const body = await c.req.json()
    const eventName = String(body.event_name || '').trim()

    if (!eventName) return c.json({ success: false, error: 'event_name is required' }, 400)
    if (eventName.length > 120) return c.json({ success: false, error: 'event_name is too long' }, 400)

    const payload = await getAuthPayload(c)
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || null
    const ipHash = await hashIp(ip ? ip.split(',')[0].trim() : null)

    await c.env.DB.prepare(`
      INSERT INTO analytics_events (
        user_id, session_id, event_name, event_source, page_path, service_category,
        provider_id, booking_id, metadata, city, user_agent, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      payload?.sub || body.user_id || null,
      body.session_id || null,
      eventName,
      body.event_source || 'web',
      body.page_path || null,
      body.service_category || null,
      asNumber(body.provider_id),
      asNumber(body.booking_id),
      metadataString(body.metadata),
      body.city || null,
      c.req.header('User-Agent') || null,
      ipHash
    ).run()

    return c.json({ success: true })
  } catch (e: any) {
    if (isMigrationError(e)) return migrationRequired(c)
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/analytics/summary
analytics.get('/summary', async (c) => {
  try {
    const admin = await requireAdmin(c)
    if (!admin) return c.json({ success: false, error: 'Admin access required' }, 403)

    await requireTables(c, REQUIRED_SMS_ANALYTICS_TABLES)

    const customers = await countFirst(c, "SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
    const providers = await countFirst(c, 'SELECT COUNT(*) as count FROM providers')
    const bookings = await countFirst(c, 'SELECT COUNT(*) as count FROM bookings')
    const successfulPayments = await countFirst(c, "SELECT COUNT(*) as count FROM payments WHERE status = 'success'")
    const smsSent = await countFirst(c, "SELECT COUNT(*) as count FROM sms_logs WHERE status IN ('sent', 'success', 'delivered')")

    const topEvents = await c.env.DB.prepare(`
      SELECT event_name, COUNT(*) as count
      FROM analytics_events
      GROUP BY event_name
      ORDER BY count DESC, event_name ASC
      LIMIT 10
    `).all()

    const topServices = await c.env.DB.prepare(`
      SELECT
        s.id,
        s.name,
        p.service_category,
        COUNT(b.id) as bookings,
        COALESCE(SUM(b.total_amount), 0) as total_amount
      FROM bookings b
      JOIN services s ON s.id = b.service_id
      LEFT JOIN providers p ON p.id = b.provider_id
      GROUP BY s.id, s.name, p.service_category
      ORDER BY bookings DESC, total_amount DESC
      LIMIT 10
    `).all()

    const dailyActivity = await c.env.DB.prepare(`
      SELECT
        day,
        SUM(events) as events,
        SUM(bookings) as bookings,
        SUM(sms_sent) as sms_sent
      FROM (
        SELECT date(created_at) as day, COUNT(*) as events, 0 as bookings, 0 as sms_sent
        FROM analytics_events
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)

        UNION ALL

        SELECT date(created_at) as day, 0 as events, COUNT(*) as bookings, 0 as sms_sent
        FROM bookings
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)

        UNION ALL

        SELECT date(created_at) as day, 0 as events, 0 as bookings, COUNT(*) as sms_sent
        FROM sms_logs
        WHERE created_at >= datetime('now', '-30 days')
          AND status IN ('sent', 'success', 'delivered')
        GROUP BY date(created_at)
      ) activity
      WHERE day IS NOT NULL
      GROUP BY day
      ORDER BY day ASC
    `).all()

    return c.json({
      success: true,
      summary: {
        totals: {
          customers,
          providers,
          bookings,
          successful_payments: successfulPayments,
          sms_sent: smsSent
        },
        top_events: topEvents.results || [],
        top_services: topServices.results || [],
        daily_activity: dailyActivity.results || []
      }
    })
  } catch (e: any) {
    if (isMigrationError(e)) return migrationRequired(c)
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default analytics
