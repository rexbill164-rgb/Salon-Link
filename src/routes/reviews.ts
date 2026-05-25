import { verifyToken } from './auth'
import { Hono } from 'hono'

type Bindings = { DB: D1Database }

const reviews = new Hono<{ Bindings: Bindings }>()

// GET /api/reviews/provider/:id
reviews.get('/provider/:id', async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT r.*, u.first_name, u.last_name, u.avatar_url
      FROM reviews r JOIN users u ON r.customer_id = u.id
      WHERE r.provider_id = ? ORDER BY r.created_at DESC
    `).bind(c.req.param('id')).all()

    return c.json({ success: true, reviews: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default reviews

// POST /api/reviews — customer submits a review after completed booking
reviews.post('/', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return c.json({ success: false, error: 'Login required' }, 401)
    const payload = await import('hono/jwt').then(m => m.verifyToken(auth.split(' ')[1], c.env)) as any

    const { provider_id, booking_id, rating, comment } = await c.req.json()
    if (!provider_id || !rating) return c.json({ success: false, error: 'provider_id and rating are required' }, 400)
    if (rating < 1 || rating > 5) return c.json({ success: false, error: 'Rating must be 1-5' }, 400)

    // Check customer has a completed booking with this provider
    const booking = await c.env.DB.prepare(
      "SELECT id FROM bookings WHERE customer_id=? AND provider_id=? AND status='completed' LIMIT 1"
    ).bind(payload.sub, provider_id).first()
    if (!booking) return c.json({ success: false, error: 'You can only review providers after a completed booking' }, 403)

    // Prevent duplicate review per booking
    if (booking_id) {
      const existing = await c.env.DB.prepare('SELECT id FROM reviews WHERE booking_id=? LIMIT 1').bind(booking_id).first()
      if (existing) return c.json({ success: false, error: 'You have already reviewed this booking' }, 409)
    }

    await c.env.DB.prepare(
      'INSERT INTO reviews (customer_id, provider_id, booking_id, rating, comment) VALUES (?,?,?,?,?)'
    ).bind(payload.sub, provider_id, booking_id || null, rating, comment || null).run()

    // Update provider average rating
    const avg = await c.env.DB.prepare(
      'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE provider_id=?'
    ).bind(provider_id).first() as any
    await c.env.DB.prepare(
      'UPDATE providers SET rating=?, total_reviews=? WHERE id=?'
    ).bind(avg?.avg || rating, avg?.cnt || 1, provider_id).run()

    return c.json({ success: true, message: 'Review submitted! Thank you.' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})
