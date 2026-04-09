import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; R2: R2Bucket }

const uploads = new Hono<{ Bindings: Bindings }>()

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026') as any
  } catch { return null }
}

// POST /api/uploads/image — upload image to R2
uploads.post('/image', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const formData = await c.req.formData()
    const file = formData.get('file') as File
    if (!file) return c.json({ success: false, error: 'No file provided' }, 400)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, error: 'Only JPG, PNG, WebP, GIF allowed' }, 400)
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ success: false, error: 'File too large. Max 5MB' }, 400)
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const key = `uploads/${user.sub}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    await c.env.R2.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type }
    })

    const imageUrl = `/api/uploads/file/${key}`
    return c.json({ success: true, url: imageUrl, key })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/uploads/file/* — serve image from R2
uploads.get('/file/*', async (c) => {
  try {
    const key = c.req.path.replace('/api/uploads/file/', '')
    const object = await c.env.R2.get(key)
    if (!object) return c.json({ error: 'File not found' }, 404)

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000'
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/uploads/hairstyle — save hairstyle history entry
uploads.post('/hairstyle', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { image_url, style_name, notes, provider_id, booking_id } = await c.req.json()
    if (!image_url) return c.json({ success: false, error: 'Image URL required' }, 400)

    const result = await c.env.DB.prepare(
      'INSERT INTO hairstyle_history (customer_id, provider_id, booking_id, style_name, image_url, notes) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(user.sub, provider_id || null, booking_id || null, style_name || null, image_url, notes || null).run()

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/uploads/hairstyle — get customer's hairstyle history
uploads.get('/hairstyle', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const result = await c.env.DB.prepare(`
      SELECT h.*, p.business_name FROM hairstyle_history h
      LEFT JOIN providers p ON h.provider_id = p.id
      WHERE h.customer_id = ? ORDER BY h.created_at DESC
    `).bind(user.sub).all()

    return c.json({ success: true, history: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// DELETE /api/uploads/hairstyle/:id
uploads.delete('/hairstyle/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    await c.env.DB.prepare(
      'DELETE FROM hairstyle_history WHERE id = ? AND customer_id = ?'
    ).bind(c.req.param('id'), user.sub).run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default uploads
