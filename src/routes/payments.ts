import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { sendEmail, paymentReceiptEmail } from '../utils/email'
import { sendPushToUser } from '../utils/push'

type Bindings = {
  DB: D1Database
  JWT_SECRET?: string
  RESEND_API_KEY?: string
  SENDGRID_KEY?: string
  VAPID_PRIVATE_KEY?: string
  VAPID_PUBLIC_KEY?: string
}

const payments = new Hono<{ Bindings: Bindings }>()

const PLATFORM_FEE_PESEWAS = 200 // GHS 2 in pesewas
const PAYMENT_DISABLED_MESSAGE = 'Online payments are temporarily unavailable. Payment will be handled manually/offline at the salon.'

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
  const message = error instanceof Error
    ? `${error.message} ${String((error as any).cause || '')}`.toLowerCase()
    : String(error).toLowerCase()

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

// ── POST /api/payments/initialize — online payments disabled for launch ──
payments.post('/initialize', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
  return c.json({ success: false, disabled: true, error: PAYMENT_DISABLED_MESSAGE }, 503)
})

// ── GET /api/payments/verify/:reference — online payments disabled for launch ──
payments.get('/verify/:reference', async (c) => {
  return c.json({ success: false, disabled: true, status: 'disabled', error: PAYMENT_DISABLED_MESSAGE }, 503)
})

// ── POST /api/payments/webhook — online payments disabled for launch ──
payments.post('/webhook', async (c) => {
  return c.json({ received: false, disabled: true, error: PAYMENT_DISABLED_MESSAGE }, 503)
})

// ── GET /api/payments/public-key — online payments disabled for launch ──
payments.get('/public-key', (c) => {
  return c.json({ success: true, disabled: true, public_key: null, message: PAYMENT_DISABLED_MESSAGE })
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
    if (isPaymentSummarySetupError(e)) {
      return c.json({ success: true, transactions: [], note: 'No payment transactions available yet' })
    }
    return c.json({ success: false, error: e.message }, 500)
  }
})

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

    const summary = {
      total_transactions: Number((totals as any)?.total_transactions || 0),
      total_gross: Number((totals as any)?.total_gross || 0),
      total_platform_revenue: Number((totals as any)?.total_platform_revenue || 0),
      total_provider_earnings: Number((totals as any)?.total_provider_earnings || 0),
      pending_payouts: Number((totals as any)?.pending_payouts || 0),
      paid_out: Number((totals as any)?.paid_out || 0)
    }

    if (summary.total_transactions === 0) {
      return c.json(emptyPaymentSummaryResponse())
    }

    return c.json({
      success: true,
      summary,
      by_provider: byProvider.results,
      recent_transactions: recent.results
    })
  } catch (err) {
    console.error('PAYMENTS SUMMARY ERROR:', err)
    if (isPaymentSummarySetupError(err)) {
      return c.json(emptyPaymentSummaryResponse())
    }
    return c.json({ success: false, error: 'Failed to load payment data', details: String(err) }, 500)
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
    if (isPaymentSummarySetupError(e)) {
      return c.json({ success: true, transactions: [], note: 'No payment transactions available yet' })
    }
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/admin/payout — mark transaction(s) as paid out ──
payments.post('/admin/payout', async (c) => {
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'admin') return c.json({ success: false, error: 'Unauthorized' }, 401)

    const { transaction_ids, provider_id, notes } = await c.req.json()

    if (transaction_ids && Array.isArray(transaction_ids) && transaction_ids.length > 0) {
      const placeholders = transaction_ids.map(() => '?').join(',')
      await c.env.DB.prepare(
        `UPDATE transactions SET payout_status='paid', paid_out_at=CURRENT_TIMESTAMP, paid_out_by=?, notes=?, updated_at=CURRENT_TIMESTAMP
         WHERE id IN (${placeholders}) AND payout_status='pending'`
      ).bind(user.sub, notes || null, ...transaction_ids).run()

      return c.json({ success: true, message: `${transaction_ids.length} transaction(s) marked as paid` })
    }

    if (provider_id) {
      const result = await c.env.DB.prepare(
        `UPDATE transactions SET payout_status='paid', paid_out_at=CURRENT_TIMESTAMP, paid_out_by=?, notes=?, updated_at=CURRENT_TIMESTAMP
         WHERE provider_id=? AND payout_status='pending'`
      ).bind(user.sub, notes || null, provider_id).run()

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
    if (isPaymentSummarySetupError(e)) {
      return c.json({ success: false, error: 'Payment transaction tables are not ready yet' }, 503)
    }
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
        COALESCE(SUM(t.provider_earning), 0) as total_owed,
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
    if (isPaymentSummarySetupError(e)) {
      return c.json({ success: true, payouts: [], note: 'No payment transactions available yet' })
    }
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
  let provider: any = null
  try {
    const user = await getUser(c)
    if (!user || user.role !== 'provider') return c.json({ success: false, error: 'Unauthorized' }, 401)

    provider = await c.env.DB.prepare(
      'SELECT id, momo_number, momo_name FROM providers WHERE user_id=?'
    ).bind(user.sub).first() as any
    if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)

    const [summary, recent] = await Promise.all([
      c.env.DB.prepare(`
        SELECT
          COUNT(*) as total_bookings_paid,
          COALESCE(SUM(amount_paid), 0) as gross_received,
          COALESCE(SUM(provider_earning), 0) as total_earned,
          COALESCE(SUM(CASE WHEN payout_status='pending' THEN provider_earning ELSE 0 END), 0) as pending_payout,
          COALESCE(SUM(CASE WHEN payout_status='paid' THEN provider_earning ELSE 0 END), 0) as total_paid_out
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
    if (isPaymentSummarySetupError(e)) {
      return c.json({
        success: true,
        momo_number: provider?.momo_number || null,
        momo_name: provider?.momo_name || null,
        summary: {
          total_bookings_paid: 0,
          gross_received: 0,
          total_earned: 0,
          pending_payout: 0,
          total_paid_out: 0
        },
        transactions: [],
        note: 'No payment transactions available yet'
      })
    }
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/payments/cash-book — customer books with cash/pay-on-site (no online payment) ──
// Booking is confirmed immediately; payment_status stays 'unpaid' until provider collects.
// Provider owes GHS 2 platform charge regardless (already recorded in service_fees at booking creation).
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

    await c.env.DB.prepare(
      `UPDATE bookings SET status='confirmed', payment_reference=?, payment_method='cash', updated_at=CURRENT_TIMESTAMP WHERE id=?`
    ).bind(reference, booking.id).run()

    await c.env.DB.prepare(
      `INSERT INTO notifications (user_id, title, message, type, action_url)
       VALUES (?, '✅ Booking Confirmed (Pay On-Site)', ?, 'booking', '/dashboard')`
    ).bind(user.sub, `Your booking at ${booking.business_name} on ${booking.booking_date} at ${booking.booking_time} is confirmed. Pay on arrival.`).run()

    const customerName = `${booking.customer_first || ''} ${booking.customer_last || ''}`.trim()
    if (booking.provider_user_id) {
      await c.env.DB.prepare(
        `INSERT INTO notifications (user_id, title, message, type, action_url)
         VALUES (?, '💵 Cash Booking Confirmed', ?, 'booking', '/provider/dashboard')`
      ).bind(booking.provider_user_id, `${customerName} will pay cash on arrival for ${booking.service_name} on ${booking.booking_date} at ${booking.booking_time}. Remember to settle the platform fee with SalonLink.`).run()
    }

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

// ── POST /api/payments/mock-success — online/mock payments disabled for launch ──
payments.post('/mock-success', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
  return c.json({ success: false, disabled: true, error: PAYMENT_DISABLED_MESSAGE }, 503)
})

export default payments
