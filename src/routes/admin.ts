import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database }

const admin = new Hono<{ Bindings: Bindings }>()

async function getAdmin(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    if (payload.role !== 'admin') return null
    return payload
  } catch { return null }
}

// GET /api/admin/stats — platform overview
admin.get('/stats', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const totalUsers = await c.env.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").first() as any
    const totalProviders = await c.env.DB.prepare("SELECT COUNT(*) as count FROM providers").first() as any
    const totalBookings = await c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings").first() as any
    const totalRevenue = await c.env.DB.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success'").first() as any
    const pendingKyc = await c.env.DB.prepare("SELECT COUNT(*) as count FROM providers WHERE kyc_status = 'pending'").first() as any
    const todayBookings = await c.env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE booking_date = date('now')").first() as any

    return c.json({
      success: true,
      stats: {
        total_users: totalUsers?.count || 0,
        total_providers: totalProviders?.count || 0,
        total_bookings: totalBookings?.count || 0,
        total_revenue: totalRevenue?.total || 0,
        pending_kyc: pendingKyc?.count || 0,
        today_bookings: todayBookings?.count || 0
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/users — all users
admin.get('/users', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { role, search, limit = '50', offset = '0' } = c.req.query()
    let query = 'SELECT id, email, phone, first_name, last_name, role, is_verified, is_active, created_at FROM users WHERE 1=1'
    const params: any[] = []

    if (role) { query += ' AND role = ?'; params.push(role) }
    if (search) { query += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, users: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/providers — all providers
admin.get('/providers', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { kyc_status, search } = c.req.query()
    let query = `
      SELECT p.*, u.email, u.first_name, u.last_name, u.phone
      FROM providers p JOIN users u ON p.user_id = u.id WHERE 1=1
    `
    const params: any[] = []

    if (kyc_status) { query += ' AND p.kyc_status = ?'; params.push(kyc_status) }
    if (search) { query += ' AND (p.business_name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    query += ' ORDER BY p.created_at DESC'

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, providers: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/admin/providers/:id/kyc — approve/reject KYC
admin.patch('/providers/:id/kyc', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { kyc_status, is_verified } = await c.req.json()

    await c.env.DB.prepare(
      'UPDATE providers SET kyc_status = ?, is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(kyc_status, is_verified ? 1 : 0, c.req.param('id')).run()

    // Notify provider
    const provUser = await c.env.DB.prepare(
      'SELECT u.id FROM users u JOIN providers p ON p.user_id = u.id WHERE p.id = ?'
    ).bind(c.req.param('id')).first() as any

    if (provUser) {
      const msg = kyc_status === 'approved'
        ? 'Congratulations! Your KYC has been approved. You are now a verified provider!'
        : 'Your KYC submission was reviewed. Please contact support for more information.'
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, ?, ?, 'system', '/provider/dashboard')
      `).bind(provUser.id, `KYC ${kyc_status.charAt(0).toUpperCase() + kyc_status.slice(1)}`, msg).run()
    }

    return c.json({ success: true, message: `Provider KYC ${kyc_status}` })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/admin/users/:id/toggle — activate/deactivate user
admin.patch('/users/:id/toggle', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const target = await c.env.DB.prepare('SELECT id, is_active FROM users WHERE id = ?').bind(c.req.param('id')).first() as any
    if (!target) return c.json({ success: false, error: 'User not found' }, 404)

    await c.env.DB.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(target.is_active ? 0 : 1, c.req.param('id')).run()

    return c.json({ success: true, message: `User ${target.is_active ? 'deactivated' : 'activated'}` })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/bookings — all bookings
admin.get('/bookings', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const result = await c.env.DB.prepare(`
      SELECT b.*, p.business_name,
        cu.first_name as customer_first_name, cu.last_name as customer_last_name,
        s.name as service_name
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      JOIN users cu ON b.customer_id = cu.id
      JOIN services s ON b.service_id = s.id
      ORDER BY b.created_at DESC LIMIT 100
    `).all()

    return c.json({ success: true, bookings: result.results })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/service-fees — view all pending service fees (3 GHS per booking)
admin.get('/service-fees', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { status, date } = c.req.query()
    let query = `
      SELECT sf.*, p.business_name, u.email as provider_email,
        b.booking_date, b.booking_time, b.total_amount
      FROM service_fees sf
      JOIN providers p ON sf.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN bookings b ON sf.booking_id = b.id
      WHERE 1=1
    `
    const params: any[] = []
    if (status) { query += ' AND sf.status = ?'; params.push(status) }
    if (date) { query += ' AND sf.due_date = ?'; params.push(date) }
    query += ' ORDER BY sf.due_date ASC, sf.created_at DESC LIMIT 200'

    const result = await c.env.DB.prepare(query).bind(...params).all()

    // Calculate totals
    const totalPending = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(fee_amount), 0) as total, COUNT(*) as count FROM service_fees WHERE status = 'pending'"
    ).first() as any

    const overdueCount = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM service_fees WHERE status = 'pending' AND due_date < date('now')"
    ).first() as any

    return c.json({
      success: true,
      fees: result.results,
      summary: {
        total_pending_amount: totalPending?.total || 0,
        total_pending_count: totalPending?.count || 0,
        overdue_count: overdueCount?.count || 0
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/provider-fees/:provider_id — fees for specific provider
admin.get('/provider-fees/:provider_id', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const providerId = c.req.param('provider_id')
    const fees = await c.env.DB.prepare(`
      SELECT sf.*, b.booking_date, b.booking_time
      FROM service_fees sf
      JOIN bookings b ON sf.booking_id = b.id
      WHERE sf.provider_id = ?
      ORDER BY sf.due_date DESC
    `).bind(providerId).all()

    const summary = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_bookings,
        COALESCE(SUM(CASE WHEN status='pending' THEN fee_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status='paid' THEN fee_amount ELSE 0 END), 0) as paid_amount
      FROM service_fees WHERE provider_id = ?
    `).bind(providerId).first() as any

    return c.json({ success: true, fees: fees.results, summary })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/admin/service-fees/:id/pay — mark service fee as paid
admin.patch('/service-fees/:id/pay', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    await c.env.DB.prepare(
      "UPDATE service_fees SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(c.req.param('id')).run()

    return c.json({ success: true, message: 'Fee marked as paid' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/registrants — track all registrants with details
admin.get('/registrants', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { days = '30' } = c.req.query()
    const result = await c.env.DB.prepare(`
      SELECT
        u.id, u.email, u.phone, u.first_name, u.last_name, u.role,
        u.is_verified, u.is_active, u.created_at,
        p.business_name, p.service_category, p.kyc_status, p.is_verified as provider_verified
      FROM users u
      LEFT JOIN providers p ON p.user_id = u.id
      WHERE u.created_at >= datetime('now', '-${parseInt(days)} days')
      ORDER BY u.created_at DESC
    `).all()

    const counts = await c.env.DB.prepare(`
      SELECT role, COUNT(*) as count FROM users
      WHERE created_at >= datetime('now', '-${parseInt(days)} days')
      GROUP BY role
    `).all()

    return c.json({
      success: true,
      registrants: result.results,
      counts: counts.results,
      period_days: parseInt(days)
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PATCH /api/admin/providers/:id/approve — approve provider registration
admin.patch('/providers/:id/approve', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    await c.env.DB.prepare(
      "UPDATE providers SET kyc_status = 'approved', is_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(c.req.param('id')).run()

    // Notify provider
    const provUser = await c.env.DB.prepare(
      'SELECT u.id FROM users u JOIN providers p ON p.user_id = u.id WHERE p.id = ?'
    ).bind(c.req.param('id')).first() as any

    if (provUser) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, '✅ Account Approved!', 'Your SalonLink provider account has been approved! You can now receive bookings.', 'system', '/provider/dashboard')
      `).bind(provUser.id).run()
    }

    return c.json({ success: true, message: 'Provider approved successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/daily-reconciliation — today's fee reconciliation report
admin.get('/daily-reconciliation', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { date } = c.req.query()
    const targetDate = date || new Date().toISOString().split('T')[0]

    const fees = await c.env.DB.prepare(`
      SELECT sf.*, p.business_name, u.email, u.phone
      FROM service_fees sf
      JOIN providers p ON sf.provider_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE sf.due_date = ?
      ORDER BY sf.status ASC, p.business_name ASC
    `).bind(targetDate).all()

    const summary = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_fees,
        COALESCE(SUM(fee_amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status='pending' THEN fee_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status='paid' THEN fee_amount ELSE 0 END), 0) as paid_amount,
        COUNT(CASE WHEN status='pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status='paid' THEN 1 END) as paid_count
      FROM service_fees WHERE due_date = ?
    `).bind(targetDate).first()

    return c.json({
      success: true,
      date: targetDate,
      fees: fees.results,
      summary
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

export default admin
