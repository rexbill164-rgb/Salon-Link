import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database }

const notifications = new Hono<{ Bindings: Bindings }>()

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026') as any
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

export default notifications
