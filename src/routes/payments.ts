import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { sendEmail, paymentReceiptEmail } from '../utils/email'
import { sendPushToUser } from '../utils/push'

type Bindings = { DB: D1Database; PAYSTACK_SECRET_KEY: string; RESEND_API_KEY?: string; SENDGRID_KEY?: string; VAPID_PRIVATE_KEY?: string; VAPID_PUBLIC_KEY?: string }

const payments = new Hono<{ Bindings: Bindings }>()

const PLATFORM_FEE_PESEWAS = 300 // GHS 3 in pesewas
const PAYSTACK_SECRET = 'sk_test_03a2349f55a00878b9f1abca4a2569fa10cbd913'
const PAYSTACK_PUBLIC = 'pk_test_5a2c08ecb6b5701fe66f455b9fb705a7f7b0a448'

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
  } catch { return null }
}

function generateRef(): string {
  return 'SL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase()
}

// ── Verify Paystack webhook HMAC-SHA512 signature ──
async function verifyPaystackSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const msgData = encoder.encode(body)
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
    const hashBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex === signature
  } catch { return false }
}

// ── POST /api/payments/initialize — customer initiates Paystack payment ──
payments.post('/initialize', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { booking_id } = await c.req.json()
    if (!booking_id) return c.json({ success: false, error: 'booking_id required' }, 400)

    // Load booking with full details
    const booking = await c.env.DB.prepare(`
      SELECT b.*, p.business_name, p.id as pid,
        s.name as service_name, s.id as sid,
        u.email as customer_email, u.first_name, u.last_name
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN services s ON b.service_id = s.id
      JOIN users u ON b.customer_id = u.id
      WHERE b.id = ? AND b.customer_id = ? AND b.payment_status = 'unpaid'
    `).bind(booking_id, user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found or already paid' }, 404)

    // booking.total_amount already includes the 3 GHS platform fee (added at booking creation)
    const totalCharge = booking.total_amount  // pesewas — service price + 300 (3 GHS fee)
    const serviceAmount = totalCharge - PLATFORM_FEE_PESEWAS
    const reference = generateRef()
    const paystackKey = c.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET

    // Initialize with Paystack
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: booking.customer_email,
        amount: totalCharge,
        reference,
        currency: 'GHS',
        metadata: {
          booking_id: String(booking.id),
          provider_id: String(booking.provider_id),
          service_id: String(booking.service_id),
          platform_fee: PLATFORM_FEE_PESEWAS,
          service_amount: serviceAmount,
          customer_name: `${booking.first_name} ${booking.last_name}`,
          business_name: booking.business_name,
          service_name: booking.service_name
        },
        callback_url: `https://project-ba6e9ce4.pages.dev/payment/success?ref=${reference}`
      })
    })

    const psData = await paystackRes.json() as any

    if (!psData.status) {
      return c.json({ success: false, error: psData.message || 'Paystack initialization failed' }, 502)
    }

    // Save pending payment record
    await c.env.DB.prepare(
      `INSERT INTO payments (booking_id, customer_id, provider_id, amount, reference, status, paystack_data)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`
    ).bind(booking.id, user.sub, booking.provider_id, totalCharge, reference, JSON.stringify(psData.data)).run()

    return c.json({
      success: true,
      authorization_url: psData.data.authorization_url,
      access_code: psData.data.access_code,
      reference,
      amount: totalCharge,
      service_amount: serviceAmount,
      platform_fee: PLATFORM_FEE_PESEWAS,
      public_key: PAYSTACK_PUBLIC
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── GET /api/payments/verify/:reference — verify after redirect ──
payments.get('/verify/:reference', async (c) => {
  try {
    const reference = c.req.param('reference')
    const paystackKey = c.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET

    // Call Paystack verify API
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { 'Authorization': `Bearer ${paystackKey}` }
    })
    const data = await res.json() as any

    if (!data.status || !data.data) {
      return c.json({ success: false, status: 'failed', message: data.message || 'Paystack verification failed', debug: data })
    }

    const txStatus = data.data.status
    if (txStatus !== 'success') {
      return c.json({ success: false, status: txStatus || 'failed', message: `Payment status: ${txStatus}`, debug: { gateway: data.data.gateway_response, channel: data.data.channel } })
    }

    const txData = data.data
    const meta = txData.metadata || {}
    const amountPaid = txData.amount // pesewas
    const providerEarning = amountPaid - PLATFORM_FEE_PESEWAS
    const bookingId = meta.booking_id ? parseInt(String(meta.booking_id)) : null
    const providerId = meta.provider_id ? parseInt(String(meta.provider_id)) : null

    // Already processed? Return success immediately
    const existing = await c.env.DB.prepare(
      'SELECT id FROM transactions WHERE payment_reference = ?'
    ).bind(reference).first()
    if (existing) {
      return c.json({ success: true, status: 'success', reference, amount: amountPaid })
    }

    // Look up payment record (may exist from initialize step)
    let payment = await c.env.DB.prepare(
      'SELECT * FROM payments WHERE reference = ?'
    ).bind(reference).first() as any

    // If no payment record (race condition or direct Paystack), look up booking from metadata
    if (!payment && bookingId) {
      const booking = await c.env.DB.prepare(
        'SELECT * FROM bookings WHERE id = ?'
      ).bind(bookingId).first() as any

      if (booking) {
        // Create payment record on the fly
        await c.env.DB.prepare(
          `INSERT OR IGNORE INTO payments (booking_id, customer_id, provider_id, amount, reference, status)
           VALUES (?, ?, ?, ?, ?, 'success')`
        ).bind(booking.id, booking.customer_id, booking.provider_id, amountPaid, reference).run()

        payment = { booking_id: booking.id, customer_id: booking.customer_id, provider_id: booking.provider_id }
      }
    }

    if (!payment) {
      // Paystack confirmed success but we can't find the booking — still return success to user
      return c.json({ success: true, status: 'success', reference, amount: amountPaid, note: 'booking_lookup_failed' })
    }

    // Create transaction record
    await c.env.DB.prepare(
      `INSERT OR IGNORE INTO transactions (booking_id, provider_id, customer_id, amount_paid, platform_fee, provider_earning, payout_status, payment_reference, paystack_event_id)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).bind(
      payment.booking_id, payment.provider_id, payment.customer_id,
      amountPaid, PLATFORM_FEE_PESEWAS, providerEarning,
      reference, String(txData.id)
    ).run()

    // Mark payment + booking confirmed
    await c.env.DB.prepare(
      "UPDATE payments SET status='success', updated_at=CURRENT_TIMESTAMP WHERE reference=?"
    ).bind(reference).run()

    await c.env.DB.prepare(
      "UPDATE bookings SET payment_status='paid', payment_reference=?, status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(reference, payment.booking_id).run()

    // Notify customer
    await c.env.DB.prepare(
      `INSERT INTO notifications (user_id, title, message, type, action_url)
       VALUES (?, '💳 Payment Confirmed!', 'GHS ${(amountPaid/100).toFixed(2)} paid. Your booking is confirmed!', 'payment', '/dashboard')`
    ).bind(payment.customer_id).run()

    return c.json({ success: true, status: 'success', reference, amount: amountPaid })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/webhook — Paystack webhook (secure) ──
payments.post('/webhook', async (c) => {
  try {
    const rawBody = await c.req.text()
    const signature = c.req.header('x-paystack-signature') || ''
    const paystackKey = c.env.PAYSTACK_SECRET_KEY || PAYSTACK_SECRET

    // 1. Verify HMAC-SHA512 signature
    const isValid = await verifyPaystackSignature(rawBody, signature, paystackKey)
    if (!isValid) {
      return c.json({ error: 'Invalid signature' }, 401)
    }

    const event = JSON.parse(rawBody) as any

    // 2. Only process charge.success
    if (event.event !== 'charge.success') {
      return c.json({ received: true, processed: false })
    }

    const txData = event.data
    const reference = txData.reference
    const amountPaid = txData.amount // pesewas
    const meta = txData.metadata || {}
    const bookingId = meta.booking_id
    const providerId = meta.provider_id
    const platformFee = PLATFORM_FEE_PESEWAS
    const providerEarning = amountPaid - platformFee

    // 3. Idempotency — skip if already processed
    const existing = await c.env.DB.prepare(
      'SELECT id FROM transactions WHERE payment_reference = ? OR paystack_event_id = ?'
    ).bind(reference, String(txData.id)).first()

    if (existing) {
      return c.json({ received: true, processed: false, reason: 'duplicate' })
    }

    // 4. Look up payment record
    const payment = await c.env.DB.prepare(
      'SELECT * FROM payments WHERE reference = ?'
    ).bind(reference).first() as any

    if (!payment) {
      // Auto-create if webhook arrives before verify (race condition)
      const booking = bookingId ? await c.env.DB.prepare(
        'SELECT * FROM bookings WHERE id = ?'
      ).bind(bookingId).first() as any : null

      if (booking) {
        await c.env.DB.prepare(
          `INSERT OR IGNORE INTO payments (booking_id, customer_id, provider_id, amount, reference, status)
           VALUES (?, ?, ?, ?, ?, 'success')`
        ).bind(booking.id, booking.customer_id, booking.provider_id, amountPaid, reference).run()

        await c.env.DB.prepare(
          `INSERT INTO transactions (booking_id, provider_id, customer_id, amount_paid, platform_fee, provider_earning, payout_status, payment_reference, paystack_event_id)
           VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
        ).bind(booking.id, booking.provider_id, booking.customer_id, amountPaid, platformFee, providerEarning, reference, String(txData.id)).run()

        await c.env.DB.prepare(
          "UPDATE bookings SET payment_status='paid', payment_reference=?, status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE id=?"
        ).bind(reference, booking.id).run()
      }

      return c.json({ received: true, processed: true })
    }

    // 5. Create canonical transaction record
    await c.env.DB.prepare(
      `INSERT INTO transactions (booking_id, provider_id, customer_id, amount_paid, platform_fee, provider_earning, payout_status, payment_reference, paystack_event_id)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).bind(payment.booking_id, payment.provider_id, payment.customer_id, amountPaid, platformFee, providerEarning, reference, String(txData.id)).run()

    // 6. Update payment + booking status
    await c.env.DB.prepare(
      "UPDATE payments SET status='success', updated_at=CURRENT_TIMESTAMP WHERE reference=?"
    ).bind(reference).run()

    await c.env.DB.prepare(
      "UPDATE bookings SET payment_status='paid', payment_reference=?, status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(reference, payment.booking_id).run()

    // 7. Notify customer
    await c.env.DB.prepare(
      `INSERT INTO notifications (user_id, title, message, type, action_url)
       VALUES (?, '💳 Payment Confirmed!', 'GHS ${(amountPaid/100).toFixed(2)} received. Your booking is confirmed!', 'payment', '/dashboard')`
    ).bind(payment.customer_id).run()

    return c.json({ received: true, processed: true, provider_earning: providerEarning, platform_fee: platformFee })
  } catch (e: any) {
    console.error('Webhook error:', e)
    return c.json({ error: 'Internal error' }, 500)
  }
})

// ── GET /api/payments/public-key — return public key safely ──
payments.get('/public-key', (c) => {
  return c.json({ public_key: PAYSTACK_PUBLIC })
})

// ── GET /api/payments/my — customer's own payment history ──
payments.get('/my', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const txns = await c.env.DB.prepare(`
      SELECT t.*, p.business_name, s.name as service_name, b.booking_date, b.booking_time
      FROM transactions t
      JOIN providers p ON t.provider_id = p.id
      JOIN bookings b ON t.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE t.customer_id = ?
      ORDER BY t.created_at DESC
    `).bind(user.sub).all()

    return c.json({ success: true, transactions: txns.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

function emptyPaymentSummaryResponse() {
  return {
    success: true,
    summary: {
      total_transactions: 0,
      total_gross: 0,
      total_platform_revenue: 0,
      total_provider_earnings: 0,
      pending_payouts: 0,
      paid_out: 0
    },
    by_provider: [],
    recent_transactions: [],
    note: 'No payment transactions available yet'
  }
}

function isPaymentSummarySetupError(error: unknown): boolean {
  const message = String(error).toLowerCase()
  return message.includes('no such table: transactions') ||
    message.includes('no such column') ||
    (message.includes('no such table') && (
      message.includes('transactions') ||
      message.includes('providers') ||
      message.includes('bookings') ||
      message.includes('services') ||
      message.includes('users')
    )) ||
    message.includes('amount_paid') ||
    message.includes('platform_fee') ||
    message.includes('provider_earning') ||
    message.includes('payout_status') ||
    message.includes('payment_reference')
}

// ── GET /api/payments/admin/summary — admin earnings overview ──
payments.get('/admin/summary', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'admin') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const [totals, byProvider, recent] = await Promise.all([
      c.env.DB.prepare(`
        SELECT
          COUNT(*) as total_transactions,
          COALESCE(SUM(amount_paid), 0) as total_gross,
          COALESCE(SUM(platform_fee), 0) as total_platform_revenue,
          COALESCE(SUM(provider_earning), 0) as total_provider_earnings,
          COALESCE(SUM(CASE WHEN payout_status='pending' THEN provider_earning ELSE 0 END), 0) as pending_payouts,
          COALESCE(SUM(CASE WHEN payout_status='paid' THEN provider_earning ELSE 0 END), 0) as paid_out
        FROM transactions
      `).first(),

      c.env.DB.prepare(`
        SELECT
          p.id as provider_id, p.business_name, p.momo_number, p.momo_name,
          COUNT(t.id) as transaction_count,
          COALESCE(SUM(t.amount_paid), 0) as gross_received,
          COALESCE(SUM(t.provider_earning), 0) as total_earnings,
          COALESCE(SUM(CASE WHEN t.payout_status='pending' THEN t.provider_earning ELSE 0 END), 0) as pending_amount,
          COALESCE(SUM(CASE WHEN t.payout_status='paid' THEN t.provider_earning ELSE 0 END), 0) as paid_amount
        FROM transactions t
        JOIN providers p ON t.provider_id = p.id
        GROUP BY p.id, p.business_name, p.momo_number, p.momo_name
        ORDER BY pending_amount DESC
      `).all(),

      c.env.DB.prepare(`
        SELECT t.*, p.business_name, u.first_name, u.last_name, u.email,
          b.booking_date, b.booking_time, s.name as service_name
        FROM transactions t
        JOIN providers p ON t.provider_id = p.id
        JOIN users u ON t.customer_id = u.id
        JOIN bookings b ON t.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        ORDER BY t.created_at DESC
        LIMIT 50
      `).all()
    ])

    if (!totals || Number((totals as any).total_transactions || 0) === 0) {
      return c.json(emptyPaymentSummaryResponse())
    }

    return c.json({
      success: true,
      summary: totals,
      by_provider: byProvider.results,
      recent_transactions: recent.results
    })
  } catch (err) {
    console.error('PAYMENTS SUMMARY ERROR:', err)
    if (isPaymentSummarySetupError(err)) {
      return c.json(emptyPaymentSummaryResponse())
    }
    return c.json({ error: 'Failed to load payment data', details: String(err) }, 500)
  }
})

// ── GET /api/payments/admin/transactions — paginated transactions with filter ──
payments.get('/admin/transactions', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'admin') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { provider_id, payout_status, limit = '50', offset = '0' } = c.req.query()

    let query = `
      SELECT t.*, p.business_name, p.momo_number, p.momo_name,
        u.first_name, u.last_name, u.email as customer_email,
        b.booking_date, b.booking_time, s.name as service_name
      FROM transactions t
      JOIN providers p ON t.provider_id = p.id
      JOIN users u ON t.customer_id = u.id
      JOIN bookings b ON t.booking_id = b.id
      JOIN services s ON b.service_id = s.id
      WHERE 1=1
    `
    const params: any[] = []

    if (provider_id) { query += ' AND t.provider_id = ?'; params.push(parseInt(provider_id)) }
    if (payout_status) { query += ' AND t.payout_status = ?'; params.push(payout_status) }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, transactions: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/admin/payout — mark transaction(s) as paid out ──
payments.post('/admin/payout', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'admin') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { transaction_ids, provider_id, notes } = await c.req.json()

    // Can mark individual transactions OR all pending for a provider
    if (transaction_ids && Array.isArray(transaction_ids) && transaction_ids.length > 0) {
      const placeholders = transaction_ids.map(() => '?').join(',')
      await c.env.DB.prepare(
        `UPDATE transactions SET payout_status='paid', paid_out_at=CURRENT_TIMESTAMP, paid_out_by=?, notes=?, updated_at=CURRENT_TIMESTAMP
         WHERE id IN (${placeholders}) AND payout_status='pending'`
      ).bind(user.sub, notes || null, ...transaction_ids).run()

      return c.json({ success: true, message: `${transaction_ids.length} transaction(s) marked as paid` })
    }

    if (provider_id) {
      // Mark ALL pending for this provider
      const result = await c.env.DB.prepare(
        `UPDATE transactions SET payout_status='paid', paid_out_at=CURRENT_TIMESTAMP, paid_out_by=?, notes=?, updated_at=CURRENT_TIMESTAMP
         WHERE provider_id=? AND payout_status='pending'`
      ).bind(user.sub, notes || null, provider_id).run()

      // Notify provider
      const prov = await c.env.DB.prepare(
        'SELECT user_id, business_name FROM providers WHERE id=?'
      ).bind(provider_id).first() as any

      if (prov) {
        await c.env.DB.prepare(
          `INSERT INTO notifications (user_id, title, message, type, action_url)
           VALUES (?, '💰 Payout Sent!', 'Your pending earnings have been paid to your MoMo account.', 'payment', '/provider/dashboard')`
        ).bind(prov.user_id).run()
      }

      return c.json({ success: true, message: `All pending transactions for provider marked as paid`, rows: result.meta.changes })
    }

    return c.json({ success: false, error: 'Provide transaction_ids or provider_id' }, 400)
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── GET /api/payments/admin/payout-list — providers with amounts owed ──
payments.get('/admin/payout-list', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'admin') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const result = await c.env.DB.prepare(`
      SELECT
        p.id, p.business_name, p.momo_number, p.momo_name,
        u.phone, u.email,
        COUNT(t.id) as pending_count,
        SUM(t.provider_earning) as total_owed,
        MIN(t.created_at) as oldest_pending
      FROM transactions t
      JOIN providers p ON t.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE t.payout_status = 'pending'
      GROUP BY p.id, p.business_name, p.momo_number, p.momo_name, u.phone, u.email
      ORDER BY total_owed DESC
    `).all()

    return c.json({ success: true, payouts: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── PUT /api/payments/provider/momo — provider updates MoMo details ──
payments.put('/provider/momo', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { momo_number, momo_name } = await c.req.json()
    if (!momo_number) return c.json({ success: false, error: 'MoMo number required' }, 400)

    await c.env.DB.prepare(
      'UPDATE providers SET momo_number=?, momo_name=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?'
    ).bind(momo_number.trim(), momo_name?.trim() || null, user.sub).run()

    return c.json({ success: true, message: 'MoMo details updated' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── GET /api/payments/provider/earnings — provider's own earnings ──
payments.get('/provider/earnings', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const provider = await c.env.DB.prepare(
      'SELECT id, momo_number, momo_name FROM providers WHERE user_id=?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const [summary, recent] = await Promise.all([
      c.env.DB.prepare(`
        SELECT
          COUNT(*) as total_bookings_paid,
          SUM(amount_paid) as gross_received,
          SUM(provider_earning) as total_earned,
          SUM(CASE WHEN payout_status='pending' THEN provider_earning ELSE 0 END) as pending_payout,
          SUM(CASE WHEN payout_status='paid' THEN provider_earning ELSE 0 END) as total_paid_out
        FROM transactions WHERE provider_id=?
      `).bind(provider.id).first(),

      c.env.DB.prepare(`
        SELECT t.*, b.booking_date, s.name as service_name, u.first_name, u.last_name
        FROM transactions t
        JOIN bookings b ON t.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        JOIN users u ON t.customer_id = u.id
        WHERE t.provider_id = ?
        ORDER BY t.created_at DESC LIMIT 20
      `).bind(provider.id).all()
    ])

    return c.json({
      success: true,
      momo_number: provider.momo_number,
      momo_name: provider.momo_name,
      summary,
      transactions: recent.results
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/cash-book — customer books with cash/pay-on-site (no Paystack) ──
// Booking is confirmed immediately; payment_status stays 'unpaid' until provider collects.
// Provider owes GHS 3 platform fee regardless (already recorded in service_fees at booking creation).
payments.post('/cash-book', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { booking_id } = await c.req.json()
    if (!booking_id) return c.json({ success: false, error: 'booking_id required' }, 400)

    const booking = await c.env.DB.prepare(`
      SELECT b.*, s.name as service_name, p.business_name,
        cu.email as customer_email, cu.first_name as customer_first, cu.last_name as customer_last,
        pu.id as provider_user_id, pu.email as provider_email, pu.first_name as prov_first
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN providers p ON b.provider_id = p.id
      JOIN users cu ON b.customer_id = cu.id
      JOIN users pu ON p.user_id = pu.id
      WHERE b.id = ? AND b.customer_id = ?
    `).bind(booking_id, user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404)

    const reference = `SL-CASH-${Date.now()}`

    // Confirm booking but keep payment_status = 'unpaid' (cash collected on site)
    await c.env.DB.prepare(
      `UPDATE bookings SET status='confirmed', payment_reference=?, payment_method='cash', updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(reference, booking.id).run()

    // Notify customer
    await c.env.DB.prepare(
      `INSERT INTO notifications (user_id, title, message, type, action_url)
       VALUES (?, '✅ Booking Confirmed (Pay On-Site)', ?, 'booking', '/dashboard')`
    ).bind(user.sub, `Your booking at ${booking.business_name} on ${booking.booking_date} at ${booking.booking_time} is confirmed. Pay on arrival.`).run()

    // Notify provider
    const customerName = `${booking.customer_first || ''} ${booking.customer_last || ''}`.trim()
    if (booking.provider_user_id) {
      await c.env.DB.prepare(
        `INSERT INTO notifications (user_id, title, message, type, action_url)
         VALUES (?, '💵 Cash Booking Confirmed', ?, 'booking', '/provider/dashboard')`
      ).bind(booking.provider_user_id, `${customerName} will pay cash on arrival for ${booking.service_name} on ${booking.booking_date} at ${booking.booking_time}. Remember to send GHS 3 platform fee to 0533 675 960.`).run()
    }

    // Push + email (fire & forget)
    const totalGhs = (booking.total_amount || 0) / 100
    c.executionCtx?.waitUntil(Promise.allSettled([
      sendPushToUser(c.env.DB, user.sub, {
        title: '✅ Booking Confirmed!',
        body: `${booking.business_name} · Pay cash on arrival · ${booking.booking_date}`,
        url: '/dashboard',
        tag: `cash-booking-${booking.id}`
      }, c.env),
      booking.customer_email ? sendEmail(
        c.env, booking.customer_email,
        `Booking Confirmed (Pay On-Site) — ${booking.business_name}`,
        paymentReceiptEmail({
          customerName, providerName: booking.business_name,
          serviceName: booking.service_name,
          date: booking.booking_date, time: booking.booking_time,
          totalGhs, bookingId: booking.id,
          paymentMethod: 'cash', reference,
          isCash: true
        })
      ) : Promise.resolve()
    ]))

    return c.json({ success: true, reference, payment_method: 'cash', message: 'Booking confirmed! Pay on arrival.' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/mock-success — handles MoMo simulation payments ──
payments.post('/mock-success', async (c) => {
  try {
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { booking_id, method } = await c.req.json()
    const paymentMethod = method || 'momo'

    const booking = await c.env.DB.prepare(`
      SELECT b.*, s.name as service_name, p.business_name, p.address as provider_address,
        cu.email as customer_email, cu.first_name as customer_first, cu.last_name as customer_last
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN providers p ON b.provider_id = p.id
      JOIN users cu ON b.customer_id = cu.id
      WHERE b.id=? AND b.customer_id=?
    `).bind(booking_id, user.sub).first() as any

    if (!booking) return c.json({ success: false, error: 'Booking not found' }, 404)

    const amountPaid = booking.total_amount || 0
    const providerEarning = amountPaid - PLATFORM_FEE_PESEWAS
    const reference = `SL-${paymentMethod.toUpperCase()}-${Date.now()}`

    await c.env.DB.prepare(
      `INSERT OR IGNORE INTO payments (booking_id, customer_id, provider_id, amount, reference, status)
       VALUES (?, ?, ?, ?, ?, 'success')`
    ).bind(booking.id, user.sub, booking.provider_id, amountPaid, reference).run()

    await c.env.DB.prepare(
      `INSERT OR IGNORE INTO transactions (booking_id, provider_id, customer_id, amount_paid, platform_fee, provider_earning, payout_status, payment_reference, paystack_event_id)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, 'mock')`
    ).bind(booking.id, booking.provider_id, user.sub, amountPaid, PLATFORM_FEE_PESEWAS, providerEarning, reference).run()

    await c.env.DB.prepare(
      `UPDATE bookings SET payment_status='paid', payment_method=?, payment_reference=?, status='confirmed', updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(paymentMethod, reference, booking.id).run()

    // DB notification
    await c.env.DB.prepare(
      `INSERT INTO notifications (user_id, title, message, type, action_url)
       VALUES (?, '✅ Payment Confirmed!', ?, 'payment', '/dashboard')`
    ).bind(user.sub, `Your booking at ${booking.business_name} is confirmed. Ref: ${reference}`).run()

    // Push + Email receipt (fire & forget)
    const customerName = `${booking.customer_first || ''} ${booking.customer_last || ''}`.trim()
    const totalGhs = amountPaid / 100
    c.executionCtx?.waitUntil(Promise.allSettled([
      sendPushToUser(c.env.DB, user.sub, {
        title: '✅ Payment Confirmed!',
        body: `${booking.business_name} · ${booking.booking_date} at ${booking.booking_time}`,
        url: '/dashboard',
        tag: `payment-${booking.id}`
      }, c.env),
      booking.customer_email ? sendEmail(
        c.env, booking.customer_email,
        `Payment Receipt — ${booking.business_name}`,
        paymentReceiptEmail({
          customerName, providerName: booking.business_name,
          serviceName: booking.service_name,
          date: booking.booking_date, time: booking.booking_time,
          totalGhs, bookingId: booking.id,
          paymentMethod, reference
        })
      ) : Promise.resolve()
    ]))

    return c.json({
      success: true, reference,
      amount_paid: amountPaid,
      platform_fee: PLATFORM_FEE_PESEWAS,
      provider_earning: providerEarning
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default payments
