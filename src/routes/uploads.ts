import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }

const uploads = new Hono<{ Bindings: Bindings }>()

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

// Convert base64 data URL to simulated stored URL (since R2 may not be enabled)
// Images stored as base64 in DB for now (up to 10MB)
function getImageSize(base64: string): number {
  const base64Data = base64.split(',')[1] || base64
  return Math.ceil((base64Data.length * 3) / 4)
}

// POST /api/uploads/provider-logo — upload provider logo (stored as URL/base64)
uploads.post('/provider-logo', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    if (user.role !== 'provider') return c.json({ success: false, error: 'Only providers can upload logos' }, 403)

    const provider = await c.env.DB.prepare(
      'SELECT id FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider profile not found' }, 404)

    const body = await c.req.json()
    const { image_url } = body

    if (!image_url) return c.json({ success: false, error: 'Image URL or base64 required' }, 400)

    // Check size if base64
    if (image_url.startsWith('data:')) {
      const size = getImageSize(image_url)
      if (size > 10 * 1024 * 1024) {
        return c.json({ success: false, error: 'Logo too large. Max 10MB' }, 400)
      }
    }

    // Update provider logo
    await c.env.DB.prepare(
      'UPDATE providers SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(image_url, provider.id).run()

    // Also save to gallery as logo
    await c.env.DB.prepare(
      'INSERT OR REPLACE INTO provider_gallery (provider_id, image_url, is_logo, caption) VALUES (?, ?, 1, ?)'
    ).bind(provider.id, image_url, 'Business Logo').run()

    return c.json({ success: true, message: 'Logo uploaded successfully', url: image_url })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/uploads/provider-gallery — upload gallery image
uploads.post('/provider-gallery', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    if (user.role !== 'provider') return c.json({ success: false, error: 'Only providers can upload gallery' }, 403)

    const provider = await c.env.DB.prepare(
      'SELECT id, gallery_count, has_pro_gallery FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider profile not found' }, 404)

    // Check gallery limits: free = 5 images, pro = 10 images
    const galleryCount = provider.gallery_count || 0
    const maxImages = provider.has_pro_gallery ? 10 : 5

    if (galleryCount >= maxImages) {
      const msg = provider.has_pro_gallery
        ? 'Gallery limit reached (10 images max)'
        : 'Gallery limit reached (5 images). Complete your account activation to unlock up to 10 photos.'
      return c.json({ success: false, error: msg, upgrade_required: !provider.has_pro_gallery }, 403)
    }

    const body = await c.req.json()
    const { image_url, caption } = body

    if (!image_url) return c.json({ success: false, error: 'Image required' }, 400)

    // Validate size (max 10MB)
    if (image_url.startsWith('data:')) {
      const size = getImageSize(image_url)
      if (size > 10 * 1024 * 1024) {
        return c.json({ success: false, error: 'Image too large. Max 10MB per image' }, 400)
      }
    }

    // Insert gallery image
    const result = await c.env.DB.prepare(
      'INSERT INTO provider_gallery (provider_id, image_url, caption, is_logo) VALUES (?, ?, ?, 0)'
    ).bind(provider.id, image_url, caption || null).run()

    // Update gallery count
    await c.env.DB.prepare(
      'UPDATE providers SET gallery_count = gallery_count + 1 WHERE id = ?'
    ).bind(provider.id).run()

    // Auto-award +10 pts on first gallery upload (idempotent)
    if (galleryCount === 0) {
      try {
        const alreadyAwarded = await c.env.DB.prepare(
          "SELECT id FROM point_transactions WHERE provider_id = ? AND type = 'first_gallery' LIMIT 1"
        ).bind(provider.id).first()
        if (!alreadyAwarded) {
          const provFull = await c.env.DB.prepare('SELECT user_id FROM providers WHERE id = ?').bind(provider.id).first() as any
          await c.env.DB.prepare(
            'UPDATE providers SET loyalty_points = COALESCE(loyalty_points,0) + 10 WHERE id = ?'
          ).bind(provider.id).run()
          await c.env.DB.prepare(
            'INSERT INTO point_transactions (provider_id, user_id, points, type, description) VALUES (?,?,?,?,?)'
          ).bind(provider.id, provFull?.user_id || null, 10, 'first_gallery', 'First gallery photo uploaded').run()
        }
      } catch(ptErr) { /* non-blocking */ }
    }

    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: `Image uploaded (${galleryCount + 1}/${maxImages})`,
      count: galleryCount + 1,
      max: maxImages
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/uploads/provider-cover — upload provider cover/background photo
uploads.post('/provider-cover', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    if (user.role !== 'provider') return c.json({ success: false, error: 'Only providers can upload cover' }, 403)

    const provider = await c.env.DB.prepare(
      'SELECT id FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider profile not found' }, 404)

    const body = await c.req.json()
    const { image_url } = body
    if (!image_url) return c.json({ success: false, error: 'Image required' }, 400)

    if (image_url.startsWith('data:')) {
      const size = getImageSize(image_url)
      if (size > 10 * 1024 * 1024) return c.json({ success: false, error: 'Image too large. Max 10MB' }, 400)
    }

    // Remove old cover entry from gallery (is_logo=2)
    await c.env.DB.prepare(
      'DELETE FROM provider_gallery WHERE provider_id = ? AND is_logo = 2'
    ).bind(provider.id).run()

    // Insert new cover into gallery with is_logo=2 marker
    await c.env.DB.prepare(
      'INSERT INTO provider_gallery (provider_id, image_url, caption, is_logo) VALUES (?, ?, ?, 2)'
    ).bind(provider.id, image_url, 'Cover Photo').run()

    // Mark providers.cover_url as 'gallery' (the actual image is in provider_gallery)
    await c.env.DB.prepare(
      'UPDATE providers SET cover_url = ? WHERE id = ?'
    ).bind('gallery', provider.id).run()

    return c.json({ success: true, message: 'Cover photo updated' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/uploads/photo/:id — serve a single image by ID (avoids huge JSON responses)
uploads.get('/photo/:id', async (c) => {
  try {
    const row = await c.env.DB.prepare(
      'SELECT image_url FROM provider_gallery WHERE id = ?'
    ).bind(c.req.param('id')).first() as any
    if (!row || !row.image_url) return c.notFound()

    const dataUrl: string = row.image_url
    if (dataUrl.startsWith('data:')) {
      const [header, base64] = dataUrl.split(',')
      const mimeMatch = header.match(/data:([^;]+)/)
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      return new Response(bytes, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=86400',
        }
      })
    }
    // If it's a plain URL, redirect
    return Response.redirect(dataUrl, 302)
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/uploads/provider-gallery/:provider_id — get provider gallery (lightweight — no base64)
uploads.get('/provider-gallery/:provider_id', async (c) => {
  try {
    const providerId = c.req.param('provider_id')
    const gallery = await c.env.DB.prepare(
      'SELECT id, caption, is_logo, created_at FROM provider_gallery WHERE provider_id = ? ORDER BY is_logo DESC, created_at DESC'
    ).bind(providerId).all()

    // Get pro status
    const provider = await c.env.DB.prepare(
      'SELECT has_pro_gallery, gallery_count FROM providers WHERE id = ?'
    ).bind(providerId).first() as any

    const is_pro = !!(provider?.has_pro_gallery)
    // Return lightweight photo list - use /api/uploads/photo/:id for actual images
    const photos = (gallery.results || []).map((p: any) => ({
      id: p.id,
      caption: p.caption,
      is_logo: p.is_logo,
      created_at: p.created_at,
      image_url: `/api/uploads/photo/${p.id}`
    }))

    return c.json({ success: true, photos, gallery: photos, is_pro, photo_count: photos.length })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// DELETE /api/uploads/provider-gallery/:id — delete gallery image
uploads.delete('/provider-gallery/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const provider = await c.env.DB.prepare(
      'SELECT id FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const image = await c.env.DB.prepare(
      'SELECT id, is_logo FROM provider_gallery WHERE id = ? AND provider_id = ?'
    ).bind(c.req.param('id'), provider.id).first() as any
    if (!image) return c.json({ success: false, error: 'Image not found' }, 404)

    await c.env.DB.prepare('DELETE FROM provider_gallery WHERE id = ?').bind(c.req.param('id')).run()
    if (!image.is_logo) {
      await c.env.DB.prepare('UPDATE providers SET gallery_count = MAX(0, gallery_count - 1) WHERE id = ?').bind(provider.id).run()
    }

    return c.json({ success: true, message: 'Image deleted' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/uploads/subscribe-gallery — upgrade to gallery pro (GHS 10/month)
uploads.post('/subscribe-gallery', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    if (user.role !== 'provider') return c.json({ success: false, error: 'Providers only' }, 403)

    const provider = await c.env.DB.prepare(
      'SELECT id FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider profile not found' }, 404)

    const { payment_reference } = await c.req.json()

    // Set expiry to 30 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await c.env.DB.prepare(`
      INSERT INTO provider_subscriptions (provider_id, plan, status, expires_at, amount_paid, payment_reference)
      VALUES (?, 'gallery_pro', 'active', ?, 1000, ?)
    `).bind(provider.id, expiresAt.toISOString(), payment_reference || 'manual').run()

    await c.env.DB.prepare(
      'UPDATE providers SET has_pro_gallery = 1 WHERE id = ?'
    ).bind(provider.id).run()

    return c.json({
      success: true,
      message: 'Gallery Pro activated! You can now upload up to 10 images.',
      expires_at: expiresAt.toISOString()
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
