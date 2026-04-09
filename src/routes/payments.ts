import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; PAYSTACK_SECRET_KEY: string }

const payments = new Hono<{ Bindings: Bindings }>()

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
  } catch { return null }
}

function generateRef(): string {
  return 'SL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
}

// POST /api/payments/initialize — start Paystack payment
payments.post('/initialize', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { booking_id } = await c.req.json()

    const booking = await c.env.DB.prepare(`
      SELECT b.*, p.business_name, s.name as service_name,
        u.email as customer_email, u.first_name, u.last_name
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.id = ? AND b.customer_id = ? AND b.payment_status = 'unpaid'
    `).bind(booking_id, user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found or already paid' }, 404)

    const reference = generateRef()
    const paystackKey = c.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder'

    // Initialize Paystack transaction
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: booking.customer_email,
        amount: booking.total_amount, // already in kobo/pesewas
        reference,
        currency: 'GHS',
        metadata: {
          booking_id: booking.id,
          service_name: booking.service_name,
          business_name: booking.business_name,
          customer_name: `${booking.first_name} ${booking.last_name}`
        },
        callback_url: `${c.req.header('origin') || 'https://webapp.pages.dev'}/api/payments/callback`
      })
    })

    const paystackData = await paystackRes.json() as any

    if (!paystackData.status) {
      // If Paystack fails (test mode/no key), return a mock response
      const mockRef = generateRef()
      await c.env.DB.prepare(
        'INSERT INTO payments (booking_id, customer_id, provider_id, amount, reference, status) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(booking.id, user.sub, booking.provider_id, booking.total_amount, mockRef, 'pending').run()

      return c.json({
        success: true,
        authorization_url: `${c.req.header('origin') || ''}/payment/mock?ref=${mockRef}&booking=${booking_id}`,
        reference: mockRef,
        mock: true
      })
    }

    // Save payment record
    await c.env.DB.prepare(
      'INSERT INTO payments (booking_id, customer_id, provider_id, amount, reference, status, paystack_data) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(booking.id, user.sub, booking.provider_id, booking.total_amount, reference, 'pending', JSON.stringify(paystackData.data)).run()

    return c.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/payments/verify/:reference — verify payment after callback
payments.get('/verify/:reference', async (c) => {
  try {
    const reference = c.req.param('reference')
    const paystackKey = c.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder'

    // Verify with Paystack
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { 'Authorization': `Bearer ${paystackKey}` }
    })
    const data = await res.json() as any

    const payment = await c.env.DB.prepare(
      'SELECT * FROM payments WHERE reference = ?'
    ).bind(reference).first() as any

    if (!payment) return c.json({ success: false, error: 'Payment not found' }, 404)

    if (data.status && data.data?.status === 'success') {
      // Mark payment success
      await c.env.DB.prepare(
        "UPDATE payments SET status = 'success', updated_at = CURRENT_TIMESTAMP WHERE reference = ?"
      ).bind(reference).run()

      // Update booking payment status
      await c.env.DB.prepare(
        "UPDATE bookings SET payment_status = 'paid', payment_reference = ?, status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(reference, payment.booking_id).run()

      // Notify customer
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, 'Payment Successful!', 'Your payment has been confirmed. Your booking is now confirmed!', 'payment', '/dashboard')
      `).bind(payment.customer_id).run()

      return c.json({ success: true, status: 'success', message: 'Payment verified' })
    }

    return c.json({ success: false, status: 'failed', message: 'Payment not successful' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/payments/mock-success — simulate payment success (dev/testing)
payments.post('/mock-success', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { booking_id } = await c.req.json()

    const booking = await c.env.DB.prepare(
      "SELECT * FROM bookings WHERE id = ? AND customer_id = ? AND payment_status = 'unpaid'"
    ).bind(booking_id, user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404)

    const reference = 'MOCK-' + Date.now()
    await c.env.DB.prepare(
      "UPDATE bookings SET payment_status = 'paid', payment_reference = ?, status = 'confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(reference, booking_id).run()

    await c.env.DB.prepare(`
      INSERT INTO notifications (user_id, title, message, type, action_url)
      VALUES (?, 'Payment Confirmed!', 'Your booking has been paid and confirmed!', 'payment', '/dashboard')
    `).bind(user.sub).run()

    return c.json({ success: true, message: 'Mock payment successful', reference })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default payments
