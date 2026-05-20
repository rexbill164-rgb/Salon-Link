import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }

const serviceProtection = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
  } catch {
    return null
  }
}

async function getProviderId(c: any, userId: any) {
  const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(userId).first() as any
  return provider?.id
}

serviceProtection.delete('/me/services/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const providerId = await getProviderId(c, user.sub)
    if (!providerId) return c.json({ success: false, error: 'Provider not found' }, 404)

    const serviceId = c.req.param('id')
    const active = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM bookings WHERE service_id = ? AND provider_id = ? AND status IN ('pending','confirmed')"
    ).bind(serviceId, providerId).first() as any

    if ((active?.count || 0) > 0) {
      return c.json({ success: false, error: 'This service has active bookings and cannot be deleted now.' }, 409)
    }

    await c.env.DB.prepare(
      'UPDATE services SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND provider_id = ?'
    ).bind(serviceId, providerId).run()

    return c.json({ success: true, message: 'Service deleted' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default serviceProtection
