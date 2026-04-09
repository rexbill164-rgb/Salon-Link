import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database }

const providers = new Hono<{ Bindings: Bindings }>()

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    return payload
  } catch { return null }
}

// GET /api/providers — list all providers with filters
providers.get('/', async (c) => {
  try {
    const { category, city, min_rating, max_price, search, limit = '20', offset = '0' } = c.req.query()

    let query = `
      SELECT p.*, u.first_name, u.last_name, u.avatar_url as user_avatar,
        (SELECT COUNT(*) FROM services s WHERE s.provider_id = p.id AND s.is_active = 1) as service_count
      FROM providers p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (category) { query += ' AND p.service_category = ?'; params.push(category) }
    if (city) { query += ' AND p.city = ?'; params.push(city) }
    if (min_rating) { query += ' AND p.rating >= ?'; params.push(parseFloat(min_rating)) }
    if (max_price) { query += ' AND p.price_from <= ?'; params.push(parseInt(max_price) * 100) }
    if (search) { query += ' AND (p.business_name LIKE ? OR p.bio LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }

    query += ' ORDER BY p.rating DESC, p.total_reviews DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, providers: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── SPECIFIC "me" routes MUST come before /:id ──

// GET /api/providers/me/dashboard — provider dashboard stats
providers.get('/me/dashboard', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const provider = await c.env.DB.prepare(
      `SELECT p.*, u.phone, u.email, u.first_name, u.last_name FROM providers p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?`
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const today = new Date().toISOString().split('T')[0]

    const todayBookings = await c.env.DB.prepare(`
      SELECT b.*, u.first_name, u.last_name, u.phone, u.avatar_url, s.name as service_name, s.duration_minutes
      FROM bookings b JOIN users u ON b.customer_id = u.id JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.booking_date = ? ORDER BY b.booking_time ASC
    `).bind(provider.id, today).all()

    const weekRevenue = await c.env.DB.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings
      WHERE provider_id = ? AND payment_status = 'paid'
      AND booking_date >= date('now', '-7 days')
    `).bind(provider.id).first() as any

    const totalClients = await c.env.DB.prepare(
      "SELECT COUNT(DISTINCT customer_id) as count FROM bookings WHERE provider_id = ? AND status = 'completed'"
    ).bind(provider.id).first() as any

    const pendingBookings = await c.env.DB.prepare(`
      SELECT b.*, u.first_name, u.last_name, u.avatar_url, s.name as service_name
      FROM bookings b JOIN users u ON b.customer_id = u.id JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.status = 'pending' ORDER BY b.booking_date ASC, b.booking_time ASC LIMIT 10
    `).bind(provider.id).all()

    const recentReviews = await c.env.DB.prepare(`
      SELECT r.rating, r.comment, r.created_at, u.first_name, u.last_name
      FROM reviews r JOIN bookings b ON r.booking_id = b.id JOIN users u ON b.customer_id = u.id
      WHERE b.provider_id = ? ORDER BY r.created_at DESC LIMIT 5
    `).bind(provider.id).all()

    return c.json({
      success: true,
      provider,
      stats: {
        today_bookings: todayBookings.results.length,
        week_revenue: weekRevenue?.total || 0,
        total_clients: totalClients?.count || 0,
        rating: provider.rating,
        total_reviews: provider.total_reviews
      },
      today_appointments: todayBookings.results,
      pending_bookings: pendingBookings.results,
      recent_reviews: recentReviews.results
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/me/fees — provider's own service fees
providers.get('/me/fees', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const fees = await c.env.DB.prepare(`
      SELECT sf.*, b.booking_date, b.booking_time
      FROM service_fees sf JOIN bookings b ON sf.booking_id = b.id
      WHERE sf.provider_id = ? ORDER BY sf.due_date DESC
    `).bind(provider.id).all()

    const summary = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_bookings,
        COALESCE(SUM(CASE WHEN sf.status='pending' THEN sf.fee_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN sf.status='paid' THEN sf.fee_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(b.total_amount - sf.fee_amount), 0) as total_earned,
        COALESCE(SUM(CASE WHEN b.booking_date >= date('now', 'start of month') THEN b.total_amount - sf.fee_amount ELSE 0 END), 0) as month_earned
      FROM service_fees sf JOIN bookings b ON sf.booking_id = b.id
      WHERE sf.provider_id = ?
    `).bind(provider.id).first() as any

    return c.json({ success: true, fees: fees.results, summary })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/me/services — list provider's own services
providers.get('/me/services', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)
    const services = await c.env.DB.prepare(
      'SELECT * FROM services WHERE provider_id = ? ORDER BY created_at ASC'
    ).bind(provider.id).all()
    return c.json({ success: true, services: services.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/me/availability — available slots for the logged-in provider
providers.get('/me/availability', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const { date } = c.req.query()
    if (!date) return c.json({ success: false, error: 'Date required' }, 400)

    const booked = await c.env.DB.prepare(
      "SELECT booking_time FROM bookings WHERE provider_id = ? AND booking_date = ? AND status NOT IN ('cancelled')"
    ).bind(provider.id, date).all()
    const bookedTimes = booked.results.map((b: any) => b.booking_time)

    const slots = []
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const period = h < 12 ? 'AM' : 'PM'
        const h12 = h > 12 ? h - 12 : h
        const time = `${h12}:${String(m).padStart(2, '0')} ${period}`
        slots.push({ time, available: !bookedTimes.includes(time) })
      }
    }
    return c.json({ success: true, date, slots })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PUT /api/providers/me — update provider profile (authenticated)
providers.put('/me', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const {
      bio, address, city, price_from, price_to, is_accepting_bookings, business_name, phone,
      kyc_status, kyc_card_number, kyc_front_url, kyc_back_url, kyc_selfie_url,
      location_lat, location_lng
    } = body

    await c.env.DB.prepare(`
      UPDATE providers SET
        bio = COALESCE(?, bio),
        business_name = COALESCE(?, business_name),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        price_from = COALESCE(?, price_from),
        price_to = COALESCE(?, price_to),
        is_accepting_bookings = COALESCE(?, is_accepting_bookings),
        kyc_status = COALESCE(?, kyc_status),
        kyc_card_number = COALESCE(?, kyc_card_number),
        kyc_front_url = COALESCE(?, kyc_front_url),
        kyc_back_url = COALESCE(?, kyc_back_url),
        kyc_selfie_url = COALESCE(?, kyc_selfie_url),
        location_lat = COALESCE(?, location_lat),
        location_lng = COALESCE(?, location_lng),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      bio||null, business_name||null, address||null, city||null,
      price_from||null, price_to||null,
      is_accepting_bookings !== undefined ? (is_accepting_bookings ? 1 : 0) : null,
      kyc_status||null, kyc_card_number||null,
      kyc_front_url||null, kyc_back_url||null, kyc_selfie_url||null,
      location_lat !== undefined ? location_lat : null,
      location_lng !== undefined ? location_lng : null,
      user.sub
    ).run()

    // Update phone on users table if provided
    if (phone) {
      await c.env.DB.prepare('UPDATE users SET phone = ? WHERE id = ?').bind(phone, user.sub).run()
    }

    return c.json({ success: true, message: 'Profile updated' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/providers/me/services — add a service
providers.post('/me/services', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)
    const { name, price, duration, description } = await c.req.json()
    if (!name) return c.json({ success: false, error: 'Service name required' }, 400)
    // Parse duration: accept "60", "2hr", "1.5hrs", "90 min" etc → store as integer minutes
    let durationMins = 60
    if (duration) {
      const d = String(duration)
      if (/^\d+$/.test(d.trim())) {
        durationMins = parseInt(d)
      } else {
        const hrMatch = d.match(/(\d+\.?\d*)\s*hr/i)
        const minMatch = d.match(/(\d+)\s*min/i)
        if (hrMatch) durationMins = Math.round(parseFloat(hrMatch[1]) * 60)
        else if (minMatch) durationMins = parseInt(minMatch[1])
      }
    }
    const result = await c.env.DB.prepare(
      'INSERT INTO services (provider_id, name, description, price, duration_minutes, is_active) VALUES (?, ?, ?, ?, ?, 1)'
    ).bind(provider.id, name, description || null, price || 0, durationMins).run()
    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// DELETE /api/providers/me/services/:id — delete a service
providers.delete('/me/services/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)
    await c.env.DB.prepare(
      'DELETE FROM services WHERE id = ? AND provider_id = ?'
    ).bind(c.req.param('id'), provider.id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/nearby — providers sorted by distance from lat/lng
providers.get('/nearby', async (c) => {
  try {
    const { lat, lng, limit = '20' } = c.req.query()
    // Fetch all providers and compute distance in JS (D1 has no geo functions)
    const result = await c.env.DB.prepare(`
      SELECT p.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM services s WHERE s.provider_id = p.id AND s.is_active = 1) as service_count
      FROM providers p JOIN users u ON p.user_id = u.id
    `).all()

    let providersList = result.results as any[]

    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      // Haversine distance formula
      providersList = providersList.map((p: any) => {
        if (p.location_lat && p.location_lng) {
          const R = 6371 // km
          const dLat = (p.location_lat - userLat) * Math.PI / 180
          const dLng = (p.location_lng - userLng) * Math.PI / 180
          const a = Math.sin(dLat/2)**2 + Math.cos(userLat*Math.PI/180)*Math.cos(p.location_lat*Math.PI/180)*Math.sin(dLng/2)**2
          p.distance_km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        } else {
          p.distance_km = 9999
        }
        return p
      })
      providersList.sort((a: any, b: any) => a.distance_km - b.distance_km)
    }

    return c.json({ success: true, providers: providersList.slice(0, parseInt(limit)) })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── Parameterized routes AFTER specific routes ──

// GET /api/providers/:id — single provider with services and reviews
providers.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    const provider = await c.env.DB.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.phone
      FROM providers p JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).bind(id).first()

    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const services = await c.env.DB.prepare(
      'SELECT * FROM services WHERE provider_id = ? AND is_active = 1 ORDER BY price ASC'
    ).bind(id).all()

    const reviews = await c.env.DB.prepare(`
      SELECT r.*, u.first_name, u.last_name, u.avatar_url
      FROM reviews r JOIN users u ON r.customer_id = u.id
      WHERE r.provider_id = ? ORDER BY r.created_at DESC LIMIT 10
    `).bind(id).all()

    return c.json({ success: true, provider, services: services.results, reviews: reviews.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/:id/availability — available slots for a given provider
providers.get('/:id/availability', async (c) => {
  try {
    const id = c.req.param('id')
    const { date } = c.req.query()
    if (!date) return c.json({ success: false, error: 'Date required' }, 400)

    // Get all booked slots for this provider on this date
    const booked = await c.env.DB.prepare(
      "SELECT booking_time FROM bookings WHERE provider_id = ? AND booking_date = ? AND status NOT IN ('cancelled')"
    ).bind(id, date).all()

    const bookedTimes = booked.results.map((b: any) => b.booking_time)

    // Generate time slots 9am-6pm in 30min increments (12hr format to match bookings)
    const slots = []
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const period = h < 12 ? 'AM' : 'PM'
        const h12 = h > 12 ? h - 12 : h
        const time = `${h12}:${String(m).padStart(2, '0')} ${period}`
        slots.push({ time, available: !bookedTimes.includes(time) })
      }
    }

    return c.json({ success: true, date, slots })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default providers
