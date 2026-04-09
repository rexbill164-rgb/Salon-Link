import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database }

const bookings = new Hono<{ Bindings: Bindings }>()

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026') as any
  } catch { return null }
}

// POST /api/bookings — create new booking
bookings.post('/', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Please login to book' }, 401)

    const { provider_id, service_id, booking_date, booking_time, notes } = await c.req.json()

    if (!provider_id || !service_id || !booking_date || !booking_time) {
      return c.json({ success: false, error: 'Missing required booking details' }, 400)
    }

    // Check provider accepts bookings
    const provider = await c.env.DB.prepare(
      'SELECT * FROM providers WHERE id = ? AND is_accepting_bookings = 1'
    ).bind(provider_id).first()
    if (!provider) return c.json({ success: false, error: 'Provider not available' }, 400)

    // Check service belongs to provider
    const service = await c.env.DB.prepare(
      'SELECT * FROM services WHERE id = ? AND provider_id = ? AND is_active = 1'
    ).bind(service_id, provider_id).first() as any
    if (!service) return c.json({ success: false, error: 'Service not found' }, 404)

    // Double-booking protection
    const conflict = await c.env.DB.prepare(
      "SELECT id FROM bookings WHERE provider_id = ? AND booking_date = ? AND booking_time = ? AND status NOT IN ('cancelled')"
    ).bind(provider_id, booking_date, booking_time).first()
    if (conflict) return c.json({ success: false, error: 'That time slot is already booked. Please choose another time.' }, 409)

    // Check customer doesn't have conflicting booking
    const customerConflict = await c.env.DB.prepare(
      "SELECT id FROM bookings WHERE customer_id = ? AND booking_date = ? AND booking_time = ? AND status NOT IN ('cancelled')"
    ).bind(user.sub, booking_date, booking_time).first()
    if (customerConflict) return c.json({ success: false, error: 'You already have a booking at this time.' }, 409)

    // 3 GHS platform service fee (in pesewas)
    const SERVICE_FEE = 300
    const totalWithFee = (service.price || 0) + SERVICE_FEE

    // Create booking (total_amount includes 3 GHS service fee)
    const result = await c.env.DB.prepare(`
      INSERT INTO bookings (customer_id, provider_id, service_id, booking_date, booking_time, total_amount, service_fee, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(user.sub, provider_id, service_id, booking_date, booking_time, totalWithFee, SERVICE_FEE, notes || null).run()

    const bookingId = result.meta.last_row_id

    // Record the service fee owed by provider (due by midnight of booking date)
    await c.env.DB.prepare(`
      INSERT OR IGNORE INTO service_fees (booking_id, provider_id, fee_amount, status, due_date)
      VALUES (?, ?, ?, 'pending', ?)
    `).bind(bookingId, provider_id, SERVICE_FEE, booking_date).run()

    // Get customer and provider info for notifications
    const customer = await c.env.DB.prepare(
      'SELECT first_name, last_name FROM users WHERE id = ?'
    ).bind(user.sub).first() as any
    const provUser = await c.env.DB.prepare(
      'SELECT u.id FROM users u JOIN providers p ON p.user_id = u.id WHERE p.id = ?'
    ).bind(provider_id).first() as any

    // Notify customer
    await c.env.DB.prepare(`
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (?, 'Booking Submitted!', ?, 'booking', '/dashboard')
    `).bind(user.sub, `Your booking at ${(provider as any).business_name} on ${booking_date} at ${booking_time} is pending confirmation.`).run()

    // Notify provider
    if (provUser) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, 'New Booking Request!', ?, 'booking', '/provider/dashboard')
      `).bind(provUser.id, `${customer?.first_name} ${customer?.last_name} booked ${service.name} for ${booking_date} at ${booking_time}.`).run()
    }

    return c.json({ success: true, booking_id: bookingId, message: 'Booking created successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/bookings/my — customer's bookings
bookings.get('/my', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const result = await c.env.DB.prepare(`
      SELECT b.*, p.business_name, p.avatar_url as provider_avatar,
        s.name as service_name, s.duration_minutes,
        u.first_name as provider_first_name, u.last_name as provider_last_name
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN services s ON b.service_id = s.id
      JOIN users u ON p.user_id = u.id
      WHERE b.customer_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `).bind(user.sub).all()

    return c.json({ success: true, bookings: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/bookings/:id — single booking details
bookings.get('/:id', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const booking = await c.env.DB.prepare(`
      SELECT b.*, p.business_name, p.address, p.city, p.avatar_url as provider_avatar,
        s.name as service_name, s.duration_minutes, s.price as service_price,
        u.first_name as customer_first_name, u.last_name as customer_last_name, u.phone as customer_phone
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.id = ?
    `).bind(c.req.param('id')).first()

    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404)

    return c.json({ success: true, booking })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/bookings/:id/status — update booking status (provider/admin)
bookings.patch('/:id/status', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { status, cancellation_reason } = await c.req.json()
    const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show']
    if (!validStatuses.includes(status)) {
      return c.json({ success: false, error: 'Invalid status' }, 400)
    }

    const booking = await c.env.DB.prepare(`
      SELECT b.*, p.user_id as provider_user_id FROM bookings b
      JOIN providers p ON b.provider_id = p.id WHERE b.id = ?
    `).bind(c.req.param('id')).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404)

    // Only provider, customer (cancel only), or admin can update
    const canUpdate = user.role === 'admin' ||
      String(booking.provider_user_id) === String(user.sub) ||
      (String(booking.customer_id) === String(user.sub) && status === 'cancelled')

    if (!canUpdate) return c.json({ success: false, error: 'Not authorized' }, 403)

    await c.env.DB.prepare(`
      UPDATE bookings SET status = ?, cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(status, cancellation_reason || null, c.req.param('id')).run()

    // Notify customer of status change
    const messages: Record<string, string> = {
      confirmed: `Your booking on ${booking.booking_date} at ${booking.booking_time} has been confirmed!`,
      completed: `Your appointment is complete. Please leave a review!`,
      cancelled: `Your booking on ${booking.booking_date} has been cancelled.`,
      no_show: `You were marked as no-show for your booking on ${booking.booking_date}.`
    }

    await c.env.DB.prepare(`
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (?, ?, ?, 'booking', '/dashboard')
    `).bind(booking.customer_id, `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`, messages[status]).run()

    return c.json({ success: true, message: `Booking ${status}` })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/bookings/:id/review — leave a review
bookings.post('/:id/review', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { rating, comment } = await c.req.json()
    if (!rating || rating < 1 || rating > 5) {
      return c.json({ success: false, error: 'Rating must be between 1 and 5' }, 400)
    }

    const booking = await c.env.DB.prepare(
      "SELECT * FROM bookings WHERE id = ? AND customer_id = ? AND status = 'completed'"
    ).bind(c.req.param('id'), user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found or not completed' }, 404)

    // Insert review
    await c.env.DB.prepare(
      'INSERT OR REPLACE INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
    ).bind(booking.id, user.sub, booking.provider_id, rating, comment || null).run()

    // Update provider average rating
    const avgResult = await c.env.DB.prepare(
      'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE provider_id = ?'
    ).bind(booking.provider_id).first() as any

    await c.env.DB.prepare(
      'UPDATE providers SET rating = ?, total_reviews = ? WHERE id = ?'
    ).bind(Math.round(avgResult.avg * 10) / 10, avgResult.count, booking.provider_id).run()

    return c.json({ success: true, message: 'Review submitted successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default bookings
