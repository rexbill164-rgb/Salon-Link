import { verifyToken } from './auth'
import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string; VAPID_PRIVATE_KEY?: string; VAPID_PUBLIC_KEY?: string }

const notifications = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
  } catch { return null }
}

// GET /api/notifications — get user notifications
notifications.get('/', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const result = await c.env.DB.prepare(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(user.sub).all()

    const unread = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).bind(user.sub).first() as any

    return c.json({ success: true, notifications: result.results, unread_count: unread?.count || 0 })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/notifications/read-all — mark all as read
notifications.patch('/read-all', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    await c.env.DB.prepare(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?'
    ).bind(user.sub).run()

    return c.json({ success: true, message: 'All notifications marked as read' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/notifications/:id/read — mark one as read
notifications.patch('/:id/read', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    await c.env.DB.prepare(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?'
    ).bind(c.req.param('id'), user.sub).run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// DELETE /api/notifications/:id
notifications.delete('/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    await c.env.DB.prepare(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?'
    ).bind(c.req.param('id'), user.sub).run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/notifications/push-subscribe — save push subscription
notifications.post('/push-subscribe', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { endpoint, p256dh, auth } = await c.req.json()
    if (!endpoint || !p256dh || !auth) return c.json({ success: false, error: 'Missing subscription data' }, 400)

    await c.env.DB.prepare(`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET user_id=excluded.user_id, p256dh=excluded.p256dh, auth=excluded.auth
    `).bind(user.sub, endpoint, p256dh, auth).run()

    return c.json({ success: true, message: 'Push subscription saved' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// DELETE /api/notifications/push-subscribe — remove push subscription
notifications.delete('/push-subscribe', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { endpoint } = await c.req.json()
    await c.env.DB.prepare('DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?')
      .bind(user.sub, endpoint).run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/notifications/vapid-public-key — expose VAPID public key to frontend
notifications.get('/vapid-public-key', (c) => {
  const key = c.env.VAPID_PUBLIC_KEY || ''
  return c.json({ key })
})

export default notifications

// POST /api/notifications/subscribe — save push subscription
notifications.post('/subscribe', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ success: false, error: 'Auth required' }, 401)
    const payload = await import('hono/jwt').then(m => m.verifyToken(auth.split(' ')[1], c.env)) as any
    const { endpoint, keys } = await c.req.json()
    if (!endpoint || !keys?.p256dh || !keys?.auth) return c.json({ success: false, error: 'Invalid subscription' }, 400)
    await c.env.DB.prepare(`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET user_id=excluded.user_id, p256dh=excluded.p256dh, auth=excluded.auth, updated_at=CURRENT_TIMESTAMP
    `).bind(payload.sub, endpoint, keys.p256dh, keys.auth).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// DELETE /api/notifications/subscribe — remove subscription
notifications.delete('/subscribe', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ success: false, error: 'Auth required' }, 401)
    const payload = await import('hono/jwt').then(m => m.verifyToken(auth.split(' ')[1], c.env)) as any
    await c.env.DB.prepare('DELETE FROM push_subscriptions WHERE user_id = ?').bind(payload.sub).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false, error: e.message }, 500) }
})

// GET /api/notifications/unread — get unread notifications for polling
notifications.get('/unread', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ items: [] })
    const payload = await import('hono/jwt').then(m => m.verifyToken(auth.split(' ')[1], c.env)) as any
    const result = await c.env.DB.prepare(`
      SELECT id, type, title, body, url, is_read, created_at
      FROM notifications WHERE user_id = ? AND is_read = 0
      ORDER BY created_at DESC LIMIT 10
    `).bind(payload.sub).all()
    return c.json({ items: result.results || [] })
  } catch (e: any) { return c.json({ items: [] }) }
})

// POST /api/notifications/mark-read — mark notifications as read
notifications.post('/mark-read', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ success: false })
    const payload = await import('hono/jwt').then(m => m.verifyToken(auth.split(' ')[1], c.env)) as any
    await c.env.DB.prepare('UPDATE notifications SET is_read=1 WHERE user_id=?').bind(payload.sub).run()
    return c.json({ success: true })
  } catch (e: any) { return c.json({ success: false }) }
})
