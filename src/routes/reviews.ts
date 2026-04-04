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
