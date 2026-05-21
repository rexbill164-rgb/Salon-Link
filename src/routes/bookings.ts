import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { sendEmail, bookingConfirmEmail, providerNewBookingEmail, bookingReminderEmail } from '../utils/email'
import { sendPushToUser } from '../utils/push'

type Bindings = { DB: D1Database; JWT_SECRET?: string; RESEND_API_KEY?: string; SENDGRID_KEY?: string; VAPID_PRIVATE_KEY?: string; VAPID_PUBLIC_KEY?: string }

const bookings = new Hono<{ Bindings: Bindings }>()

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

// POST /api/bookings — create new booking
bookings.post('/', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Please login to book' }, 401)

    const { provider_id, service_id, booking_date, booking_time, notes } = await c.req.json()

    if (!provider_id || !service_id || !booking_date || !booking_time) {
      return c.json({ success: false, error: 'Missing required booking details' }, 400)
    }

    // Check provider accepts bookings AND is approved by admin
    const provider = await c.env.DB.prepare(
      'SELECT * FROM providers WHERE id = ? AND is_accepting_bookings = 1'
    ).bind(provider_id).first()
    if (!provider) return c.json({ success: false, error: 'Provider is not accepting bookings right now.' }, 400)
    if (!(provider as any).is_verified) {
      return c.json({ success: false, error: 'This provider is pending admin approval and cannot receive bookings yet.' }, 403)
    }

    // Check service belongs to provider
    const service = await c.env.DB.prepare(
      'SELECT * FROM services WHERE id = ? AND provider_id = ? AND is_active = 1'
    ).bind(service_id, provider_id).first() as any
    if (!service) return c.json({ success: false, error: 'Service not found' }, 404)

    // ── Duration-aware double-booking protection ──
    // Parse booking_time (e.g. "9:30 AM") to minutes from midnight
    function timeToMins(t: string): number {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!match) return -1
      let h = parseInt(match[1])
      const m = parseInt(match[2])
      const isPM = match[3].toUpperCase() === 'PM'
      if (isPM && h !== 12) h += 12
      if (!isPM && h === 12) h = 0
      return h * 60 + m
    }

    const newStart = timeToMins(booking_time)
    const newEnd   = newStart + (service.duration_minutes || 30)

    // Fetch all active bookings for this provider on this date (with their durations)
    const existingBookings = await c.env.DB.prepare(`
      SELECT b.booking_time, COALESCE(s.duration_minutes, 30) as duration_minutes
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.provider_id = ? AND b.booking_date = ? AND b.status NOT IN ('cancelled')
    `).bind(provider_id, booking_date).all()

    for (const eb of (existingBookings.results as any[])) {
      const eStart = timeToMins(eb.booking_time)
      const eEnd   = eStart + (eb.duration_minutes || 30)
      if (newStart < eEnd && newEnd > eStart) {
        return c.json({ success: false, error: 'That time slot overlaps an existing booking. Please choose another time.' }, 409)
      }
    }

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
      'SELECT first_name, last_name, email FROM users WHERE id = ?'
    ).bind(user.sub).first() as any
    const provUser = await c.env.DB.prepare(
      'SELECT u.id, u.email, u.first_name, u.last_name, p.address FROM users u JOIN providers p ON p.user_id = u.id WHERE p.id = ?'
    ).bind(provider_id).first() as any

    const customerName = `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim()
    const providerName = (provider as any).business_name
    const totalGhs = totalWithFee / 100

    // ── DB notifications ──
    await c.env.DB.prepare(`
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (?, 'Booking Submitted! ✦', ?, 'booking', '/dashboard')
    `).bind(user.sub, `Your booking at ${providerName} on ${booking_date} at ${booking_time} is pending confirmation.`).run()

    if (provUser) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, 'New Booking Request! 🎉', ?, 'booking', '/provider/dashboard')
      `).bind(provUser.id, `${customerName} booked ${service.name} for ${booking_date} at ${booking_time}.`).run()
    }

    // ── Push notifications (fire & forget) ──
    c.executionCtx?.waitUntil(Promise.allSettled([
      sendPushToUser(c.env.DB, user.sub, {
        title: 'Booking Confirmed! ✦',
        body: `${providerName} · ${booking_date} at ${booking_time}`,
        url: '/dashboard',
        tag: `booking-${bookingId}`
      }, c.env),
      provUser ? sendPushToUser(c.env.DB, provUser.id, {
        title: 'New Booking! 🎉',
        body: `${customerName} booked ${service.name} · ${booking_date} at ${booking_time}`,
        url: '/provider/dashboard',
        tag: `newbooking-${bookingId}`,
        requireInteraction: true
      }, c.env) : Promise.resolve()
    ]))

    // ── Emails (fire & forget) ──
    c.executionCtx?.waitUntil(Promise.allSettled([
      // Customer booking confirmation
      customer?.email ? sendEmail(c.env, customer.email, `Booking Confirmed — ${providerName}`,
        bookingConfirmEmail({
          customerName, providerName, serviceName: service.name,
          date: booking_date, time: booking_time,
          totalGhs, bookingId
        })
      ) : Promise.resolve(),
      // Provider new booking email
      provUser?.email ? sendEmail(c.env, provUser.email, `New Booking from ${customerName}`,
        providerNewBookingEmail({
          providerName: `${provUser.first_name || ''} ${provUser.last_name || ''}`.trim() || providerName,
          customerName, serviceName: service.name,
          date: booking_date, time: booking_time,
          totalGhs, bookingId
        })
      ) : Promise.resolve()
    ]))

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
      SELECT b.*, p.business_name, p.avatar_url as provider_avatar, p.service_category as category,
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

// GET /api/bookings/provider — provider's own bookings list
bookings.get('/provider', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const provider = await c.env.DB.prepare(
      'SELECT id FROM providers WHERE user_id = ?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Not a provider' }, 403)

    const result = await c.env.DB.prepare(`
      SELECT b.*, s.name as service_name, s.duration_minutes,
        u.first_name, u.last_name, u.phone as customer_phone,
        b.customer_id
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.provider_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `).bind(provider.id).all()

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

    // ── Auto-award loyalty points on booking completed ──
    if (status === 'completed') {
      try {
        const provider = await c.env.DB.prepare('SELECT id, user_id, loyalty_points FROM providers WHERE id = ?').bind(booking.provider_id).first() as any
        if (provider) {
          // Check not already awarded for this booking to prevent duplicates
          const existing = await c.env.DB.prepare(
            "SELECT id FROM point_transactions WHERE provider_id = ? AND description LIKE ? LIMIT 1"
          ).bind(provider.id, `%booking #${booking.id}%`).first()
          if (!existing) {
            const pts = 5 // 5 points per completed booking
            await c.env.DB.prepare('UPDATE providers SET loyalty_points = COALESCE(loyalty_points,0) + ? WHERE id = ?').bind(pts, provider.id).run()
            await c.env.DB.prepare(
              'INSERT INTO point_transactions (user_id, provider_id, points, type, description) VALUES (?, ?, ?, ?, ?)'
            ).bind(provider.user_id, provider.id, pts, 'booking', `Completed booking #${booking.id}`).run()
          }
        }
      } catch (pointErr) { /* never block booking update for point errors */ }
    }

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

// POST /api/bookings/send-reminders — called by customer dashboard on load, sends reminder emails
// for bookings happening tomorrow that haven't been reminded yet
bookings.post('/send-reminders', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    // Find tomorrow's confirmed bookings for this customer that haven't had reminder sent
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const upcoming = await c.env.DB.prepare(`
      SELECT b.*, s.name as service_name, p.business_name, p.address,
        cu.email as customer_email, cu.first_name as customer_first, cu.last_name as customer_last
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN providers p ON b.provider_id = p.id
      JOIN users cu ON b.customer_id = cu.id
      WHERE b.customer_id = ? AND b.booking_date = ? AND b.status IN ('confirmed','pending')
        AND b.reminder_sent = 0
    `).bind(user.sub, tomorrowStr).all()

    let sent = 0
    for (const b of (upcoming.results as any[])) {
      if (!b.customer_email) continue
      const customerName = `${b.customer_first||''} ${b.customer_last||''}`.trim()
      await sendEmail(c.env, b.customer_email, `Reminder: Appointment Tomorrow — ${b.business_name}`,
        bookingReminderEmail({
          customerName, providerName: b.business_name, serviceName: b.service_name,
          date: b.booking_date, time: b.booking_time, address: b.address || ''
        })
      )
      // Push reminder
      await sendPushToUser(c.env.DB, user.sub, {
        title: '⏰ Appointment Tomorrow!',
        body: `${b.business_name} · ${b.booking_time}`,
        url: '/dashboard',
        tag: `reminder-${b.id}`
      }, c.env)
      // Mark reminder sent
      await c.env.DB.prepare('UPDATE bookings SET reminder_sent=1 WHERE id=?').bind(b.id).run()
      sent++
    }

    return c.json({ success: true, reminders_sent: sent })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default bookings
