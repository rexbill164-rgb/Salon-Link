import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }

const providers = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
    return payload
  } catch { return null }
}

async function safeFirst(c: any, label: string, sql: string, params: any[] = []) {
  try {
    const stmt = c.env.DB.prepare(sql)
    return params.length ? await stmt.bind(...params).first() : await stmt.first()
  } catch (error) {
    console.error(`PROVIDER ${label} ERROR:`, error)
    return null
  }
}

async function safeAll(c: any, label: string, sql: string, params: any[] = []) {
  try {
    const stmt = c.env.DB.prepare(sql)
    return params.length ? await stmt.bind(...params).all() : await stmt.all()
  } catch (error) {
    console.error(`PROVIDER ${label} ERROR:`, error)
    return { results: [] }
  }
}

// GET /api/providers — list all providers with filters
providers.get('/', async (c) => {
  try {
    const { category, city, min_rating, max_price, search, limit = '20', offset = '0' } = c.req.query()

    let query = `
      SELECT p.id, p.user_id, p.business_name, p.service_category, p.bio, p.address, p.city,
        p.location_lat, p.location_lng, p.price_from, p.price_to, p.rating, p.total_reviews,
        p.total_bookings, p.is_verified, p.is_accepting_bookings, p.kyc_status, p.logo_url,
        p.has_pro_gallery, p.created_at,
        COALESCE(cov.image_url, CASE WHEN p.cover_url NOT IN ('gallery','') THEN p.cover_url ELSE NULL END, p.logo_url) as cover_url,
        u.first_name, u.last_name, u.avatar_url as user_avatar,
        (SELECT COUNT(*) FROM services s WHERE s.provider_id = p.id AND s.is_active = 1) as service_count
      FROM providers p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN provider_gallery cov ON cov.provider_id = p.id AND cov.is_logo = 2
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

    const [todayBookings, weekRevenue, totalClients, pendingBookings, recentReviews] = await Promise.all([
      safeAll(c, 'TODAY BOOKINGS', `
        SELECT b.*, u.first_name, u.last_name, u.phone, u.avatar_url, s.name as service_name, s.duration_minutes
        FROM bookings b JOIN users u ON b.customer_id = u.id JOIN services s ON b.service_id = s.id
        WHERE b.provider_id = ? AND b.booking_date = ? ORDER BY b.booking_time ASC
      `, [provider.id, today]),
      safeFirst(c, 'WEEK REVENUE', `
        SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings
        WHERE provider_id = ? AND payment_status = 'paid'
        AND booking_date >= date('now', '-7 days')
      `, [provider.id]),
      safeFirst(c, 'TOTAL CLIENTS', "SELECT COUNT(DISTINCT customer_id) as count FROM bookings WHERE provider_id = ? AND status = 'completed'", [provider.id]),
      safeAll(c, 'PENDING BOOKINGS', `
        SELECT b.*, u.first_name, u.last_name, u.avatar_url, s.name as service_name
        FROM bookings b JOIN users u ON b.customer_id = u.id JOIN services s ON b.service_id = s.id
        WHERE b.provider_id = ? AND b.status = 'pending' ORDER BY b.booking_date ASC, b.booking_time ASC LIMIT 10
      `, [provider.id]),
      safeAll(c, 'RECENT REVIEWS', `
        SELECT r.rating, r.comment, r.created_at, u.first_name, u.last_name
        FROM reviews r JOIN bookings b ON r.booking_id = b.id JOIN users u ON b.customer_id = u.id
        WHERE b.provider_id = ? ORDER BY r.created_at DESC LIMIT 5
      `, [provider.id])
    ]) as any[]

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
    console.error('PROVIDER DASHBOARD ERROR:', e)
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
    console.error('PROVIDER FEES ERROR:', e)
    return c.json({
      success: true,
      fees: [],
      summary: { total_bookings: 0, pending_amount: 0, paid_amount: 0, total_earned: 0, month_earned: 0 },
      note: 'Provider fees are unavailable right now'
    })
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
      kyc_status, kyc_card_number,
      // NOTE: kyc_front_url/back/selfie are handled by POST /me/kyc to avoid D1 row size limits
      location_lat, location_lng, cover_url, logo_url
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
        location_lat = COALESCE(?, location_lat),
        location_lng = COALESCE(?, location_lng),
        cover_url = COALESCE(?, cover_url),
        logo_url = COALESCE(?, logo_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      bio||null, business_name||null, address||null, city||null,
      price_from||null, price_to||null,
      is_accepting_bookings !== undefined ? (is_accepting_bookings ? 1 : 0) : null,
      kyc_status||null, kyc_card_number||null,
      location_lat !== undefined ? location_lat : null,
      location_lng !== undefined ? location_lng : null,
      cover_url||null, logo_url||null,
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

// POST /api/providers/me/kyc — upload KYC images separately (avoids D1 row size issues)
providers.post('/me/kyc', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { kyc_card_number, kyc_front_url, kyc_back_url, kyc_selfie_url } = await c.req.json()

    // Validate sizes (max ~200KB each as base64 ~ 150KB raw)
    const MAX_LEN = 270000
    if (kyc_front_url && kyc_front_url.length > MAX_LEN) return c.json({ success: false, error: 'Front image too large. Please use a smaller photo.' }, 400)
    if (kyc_back_url  && kyc_back_url.length  > MAX_LEN) return c.json({ success: false, error: 'Back image too large. Please use a smaller photo.' }, 400)
    if (kyc_selfie_url && kyc_selfie_url.length > MAX_LEN) return c.json({ success: false, error: 'Selfie too large. Please retake.' }, 400)

    const fields: string[] = []
    const vals: any[] = []

    if (kyc_card_number) { fields.push('kyc_card_number = ?'); vals.push(kyc_card_number) }
    if (kyc_front_url)   { fields.push('kyc_front_url = ?');   vals.push(kyc_front_url) }
    if (kyc_back_url)    { fields.push('kyc_back_url = ?');    vals.push(kyc_back_url) }
    if (kyc_selfie_url)  { fields.push('kyc_selfie_url = ?');  vals.push(kyc_selfie_url) }

    const allPresent = !!(kyc_front_url && kyc_back_url && kyc_selfie_url)
    if (allPresent) { fields.push("kyc_status = 'submitted'") }
    fields.push('updated_at = CURRENT_TIMESTAMP')

    vals.push(user.sub)
    await c.env.DB.prepare(
      `UPDATE providers SET ${fields.join(', ')} WHERE user_id = ?`
    ).bind(...vals).run()

    return c.json({ success: true, submitted: allPresent })
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

// PUT /api/providers/me/services/:id — edit a service
providers.put('/me/services/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ error: 'Provider not found' }, 404)
    const { name, price, duration_minutes, description } = await c.req.json()
    await c.env.DB.prepare(
      'UPDATE services SET name=?, price=?, duration_minutes=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND provider_id=?'
    ).bind(name, price, duration_minutes || 60, description || null, c.req.param('id'), provider.id).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/me/points — provider's own points balance, history, available rewards
providers.get('/me/points', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ error: 'Unauthorized' }, 401)
    const provider = await c.env.DB.prepare('SELECT id, loyalty_points FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ error: 'Provider not found' }, 404)
    let history: any[] = []
    let rewards: any[] = []
    try {
      const histResult = await c.env.DB.prepare(
        'SELECT id, points, type, description, created_at FROM point_transactions WHERE provider_id = ? ORDER BY created_at DESC LIMIT 20'
      ).bind(provider.id).all()
      history = histResult.results || []
    } catch (e) { /* table may not exist yet */ }
    try {
      const rewResult = await c.env.DB.prepare(
        'SELECT id, name, description, image_url, points_required, category FROM reward_items WHERE is_active = 1 ORDER BY points_required ASC'
      ).all()
      rewards = rewResult.results || []
    } catch (e) { /* table may not exist yet */ }
    return c.json({
      points: provider.loyalty_points || 0,
      history,
      available_rewards: rewards
    })
  } catch (e: any) {
    return c.json({ points: 0, history: [], available_rewards: [] })
  }
})

// POST /api/providers/me/claim-reward
providers.post('/me/claim-reward', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ error: 'Unauthorized' }, 401)
    const { reward_item_id } = await c.req.json()
    const provider = await c.env.DB.prepare('SELECT id, user_id, loyalty_points FROM providers WHERE user_id = ?').bind(user.sub).first() as any
    if (!provider) return c.json({ error: 'Provider not found' }, 404)
    const reward = await c.env.DB.prepare('SELECT * FROM reward_items WHERE id = ? AND is_active = 1').bind(reward_item_id).first() as any
    if (!reward) return c.json({ error: 'Reward not found or inactive' }, 404)
    const balance = provider.loyalty_points || 0
    if (balance < reward.points_required) return c.json({ error: 'Insufficient points' }, 400)
    await c.env.DB.prepare('UPDATE providers SET loyalty_points = loyalty_points - ? WHERE id = ?').bind(reward.points_required, provider.id).run()
    await c.env.DB.prepare(
      'INSERT INTO point_transactions (user_id, provider_id, points, type, description) VALUES (?, ?, ?, ?, ?)'
    ).bind(provider.user_id, provider.id, -reward.points_required, 'claim', 'Claimed: ' + reward.name).run()
    await c.env.DB.prepare(
      'INSERT INTO reward_claims (provider_id, reward_item_id, points_spent) VALUES (?, ?, ?)'
    ).bind(provider.id, reward_item_id, reward.points_required).run()
    return c.json({ success: true, message: 'Reward claimed successfully' })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /api/providers/nearby — providers sorted by distance from lat/lng
providers.get('/nearby', async (c) => {
  try {
    const { lat, lng, limit = '20' } = c.req.query()
    // Fetch all providers and compute distance in JS (D1 has no geo functions)
    const result = await c.env.DB.prepare(`
      SELECT p.id, p.user_id, p.business_name, p.service_category, p.bio, p.city,
        p.location_lat, p.location_lng, p.price_from, p.price_to, p.rating, p.total_reviews,
        p.is_verified, p.is_accepting_bookings, p.logo_url,
        COALESCE(cov.image_url, CASE WHEN p.cover_url NOT IN ('gallery','') THEN p.cover_url ELSE NULL END, p.logo_url) as cover_url,
        u.first_name, u.last_name,
        (SELECT COUNT(*) FROM services s WHERE s.provider_id = p.id AND s.is_active = 1) as service_count
      FROM providers p JOIN users u ON p.user_id = u.id
      LEFT JOIN provider_gallery cov ON cov.provider_id = p.id AND cov.is_logo = 2
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
      SELECT p.id, p.user_id, p.business_name, p.service_category, p.bio, p.address, p.city,
        p.location_lat, p.location_lng, p.price_from, p.price_to, p.rating, p.total_reviews,
        p.total_bookings, p.is_verified, p.is_accepting_bookings, p.kyc_status, p.logo_url,
        p.has_pro_gallery, p.working_hours, p.kyc_card_number, p.created_at,
        COALESCE(cov.image_url, CASE WHEN p.cover_url NOT IN ('gallery','') THEN p.cover_url ELSE NULL END, p.logo_url) as cover_url,
        u.first_name, u.last_name, u.email, u.phone
      FROM providers p JOIN users u ON p.user_id = u.id
      LEFT JOIN provider_gallery cov ON cov.provider_id = p.id AND cov.is_logo = 2
      WHERE p.id = ?
    `).bind(id).first()

    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const services = await c.env.DB.prepare(
      'SELECT * FROM services WHERE provider_id = ? AND is_active = 1 ORDER BY price ASC'
    ).bind(id).all()

    const reviews = await safeAll(c, 'PUBLIC REVIEWS', `
      SELECT r.*, u.first_name, u.last_name, u.avatar_url
      FROM reviews r JOIN users u ON r.customer_id = u.id
      WHERE r.provider_id = ? ORDER BY r.created_at DESC LIMIT 10
    `, [id])

    return c.json({ success: true, provider, services: services.results, reviews: reviews.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/providers/:id/availability — available slots for a given provider
// Accepts optional ?service_id= to account for service duration when blocking slots
providers.get('/:id/availability', async (c) => {
  try {
    const id = c.req.param('id')
    const { date, service_id } = c.req.query()
    if (!date) return c.json({ success: false, error: 'Date required' }, 400)

    // Get duration of requested service (default 30 min slot if not provided)
    let serviceDuration = 30
    if (service_id) {
      const svc = await c.env.DB.prepare(
        'SELECT duration_minutes FROM services WHERE id = ? AND provider_id = ?'
      ).bind(service_id, id).first() as any
      if (svc && svc.duration_minutes) serviceDuration = svc.duration_minutes
    }

    // Get all active bookings for this provider on this date (with their durations)
    const booked = await c.env.DB.prepare(`
      SELECT b.booking_time, COALESCE(s.duration_minutes, 30) as duration_minutes
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.booking_date = ? AND b.status NOT IN ('cancelled')
    `).bind(id, date).all()

    // Convert booking times to minutes-from-midnight and block out their duration ranges
    const blockedRanges: Array<{start: number, end: number}> = []
    for (const b of (booked.results as any[])) {
      const t = b.booking_time // e.g. "9:30 AM"
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!match) continue
      let h = parseInt(match[1])
      const m = parseInt(match[2])
      const isPM = match[3].toUpperCase() === 'PM'
      if (isPM && h !== 12) h += 12
      if (!isPM && h === 12) h = 0
      const startMin = h * 60 + m
      const endMin = startMin + (b.duration_minutes || 30)
      blockedRanges.push({ start: startMin, end: endMin })
    }

    // Helper: convert minutes-from-midnight to 12hr time string
    function minToTime(totalMin: number): string {
      const h24 = Math.floor(totalMin / 60)
      const m = totalMin % 60
      const period = h24 < 12 ? 'AM' : 'PM'
      const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
      return `${h12}:${String(m).padStart(2, '0')} ${period}`
    }

    // Generate slots from 9am to 6pm in 30-min increments
    // A slot is available only if [slotStart, slotStart + serviceDuration) doesn't overlap any blocked range
    const slots = []
    for (let totalMin = 9 * 60; totalMin < 18 * 60; totalMin += 30) {
      const slotEnd = totalMin + serviceDuration
      // Don't show slots that would run past 7 PM (19:00)
      if (slotEnd > 19 * 60) break
      const time = minToTime(totalMin)
      // Check overlap with any booked slot
      const isBlocked = blockedRanges.some(r => totalMin < r.end && slotEnd > r.start)
      slots.push({ time, available: !isBlocked })
    }

    return c.json({ success: true, date, slots, service_duration: serviceDuration })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default providers
