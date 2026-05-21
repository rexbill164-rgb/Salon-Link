import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }

const admin = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

function emptyAdminStats() {
  return {
    total_users: 0,
    total_providers: 0,
    total_bookings: 0,
    total_revenue: 0,
    pending_kyc: 0,
    today_bookings: 0
  }
}

async function safeFirst(c: any, label: string, sql: string, params: any[] = []) {
  try {
    const stmt = c.env.DB.prepare(sql)
    return params.length ? await stmt.bind(...params).first() : await stmt.first()
  } catch (error) {
    console.error(`ADMIN ${label} ERROR:`, error)
    return null
  }
}

async function getAdmin(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
    if (payload.role !== 'admin') return null
    return payload
  } catch { return null }
}

// GET /api/admin/stats — platform overview
admin.get('/stats', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const [totalUsers, totalProviders, totalBookings, totalRevenue, pendingKyc, todayBookings] = await Promise.all([
      safeFirst(c, 'STATS USERS', "SELECT COUNT(*) as count FROM users WHERE role = 'customer'"),
      safeFirst(c, 'STATS PROVIDERS', 'SELECT COUNT(*) as count FROM providers'),
      safeFirst(c, 'STATS BOOKINGS', 'SELECT COUNT(*) as count FROM bookings'),
      safeFirst(c, 'STATS REVENUE', "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success'"),
      safeFirst(c, 'STATS KYC', "SELECT COUNT(*) as count FROM providers WHERE kyc_status = 'pending'"),
      safeFirst(c, 'STATS TODAY', "SELECT COUNT(*) as count FROM bookings WHERE booking_date = date('now')")
    ]) as any[]

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
    console.error('ADMIN STATS ERROR:', e)
    return c.json({ success: true, stats: emptyAdminStats(), note: 'Admin stats are unavailable right now' })
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
    console.error('ADMIN USERS ERROR:', e)
    return c.json({ success: true, users: [], note: 'Users are unavailable right now' })
  }
})

// GET /api/admin/providers — all providers
admin.get('/providers', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { kyc_status, search } = c.req.query()
    // Explicitly exclude large base64 image columns (cover_url, logo_url, kyc_*_url)
    // to prevent the response from becoming several MB and freezing the admin panel
    let query = `
      SELECT p.id, p.user_id, p.business_name, p.service_category, p.city, p.address,
        p.bio, p.rating, p.total_reviews, p.total_bookings, p.is_verified, p.is_accepting_bookings,
        p.kyc_status, p.kyc_card_number,
        p.gallery_count, p.created_at, p.updated_at,
        u.email, u.first_name, u.last_name, u.phone
      FROM providers p JOIN users u ON p.user_id = u.id WHERE 1=1
    `
    const params: any[] = []

    if (kyc_status) { query += ' AND p.kyc_status = ?'; params.push(kyc_status) }
    if (search) { query += ' AND (p.business_name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    query += ' ORDER BY p.created_at DESC'

    const result = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ success: true, providers: result.results })
  } catch (e: any) {
    console.error('ADMIN PROVIDERS ERROR:', e)
    return c.json({ success: true, providers: [], note: 'Providers are unavailable right now' })
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

      // Auto-award points for KYC approval (one-time, idempotent)
      if (kyc_status === 'approved') {
        try {
          const provRecord = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(provUser.id).first() as any
          if (provRecord) {
            const alreadyAwarded = await c.env.DB.prepare(
              "SELECT id FROM point_transactions WHERE provider_id = ? AND type = 'kyc_approved' LIMIT 1"
            ).bind(provRecord.id).first()
            if (!alreadyAwarded) {
              const pts = 20 // 20 points for KYC approval
              await c.env.DB.prepare('UPDATE providers SET loyalty_points = COALESCE(loyalty_points,0) + ? WHERE id = ?').bind(pts, provRecord.id).run()
              await c.env.DB.prepare(
                'INSERT INTO point_transactions (user_id, provider_id, points, type, description) VALUES (?, ?, ?, ?, ?)'
              ).bind(provUser.id, provRecord.id, pts, 'kyc_approved', 'KYC approved — identity verified bonus').run()
            }
          }
        } catch (pointErr) { /* non-blocking */ }
      }
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
    console.error('ADMIN BOOKINGS ERROR:', e)
    return c.json({ success: true, bookings: [], note: 'Bookings are unavailable right now' })
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
    console.error('ADMIN SERVICE FEES ERROR:', e)
    return c.json({
      success: true,
      fees: [],
      summary: { total_pending_amount: 0, total_pending_count: 0, overdue_count: 0 },
      note: 'Platform fees are unavailable right now'
    })
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
    console.error('ADMIN PROVIDER FEES ERROR:', e)
    return c.json({ success: true, fees: [], summary: { total_bookings: 0, pending_amount: 0, paid_amount: 0 }, note: 'Provider fees are unavailable right now' })
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
  const { days = '30' } = c.req.query()
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

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
    console.error('ADMIN REGISTRANTS ERROR:', e)
    return c.json({ success: true, registrants: [], counts: [], period_days: parseInt(days), note: 'Registrants are unavailable right now' })
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
  const { date } = c.req.query()
  const targetDate = date || new Date().toISOString().split('T')[0]
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

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
    console.error('ADMIN DAILY RECONCILIATION ERROR:', e)
    return c.json({
      success: true,
      date: targetDate,
      fees: [],
      summary: { total_fees: 0, total_amount: 0, pending_amount: 0, paid_amount: 0, pending_count: 0, paid_count: 0 },
      note: 'Daily reconciliation is unavailable right now'
    })
  }
})

// GET /api/admin/providers/:id/kyc-images — load KYC images on demand only
admin.get('/providers/:id/kyc-images', async (c) => {
  try {
    const user = await getAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const row = await c.env.DB.prepare(
      'SELECT id, kyc_front_url, kyc_back_url, kyc_selfie_url, kyc_card_number FROM providers WHERE id = ?'
    ).bind(c.req.param('id')).first() as any

    if (!row) return c.json({ success: false, error: 'Provider not found' }, 404)
    return c.json({ success: true, images: row })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/admin/users/:id/reset-password — admin resets any user's password
admin.post('/users/:id/reset-password', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ success: false, error: 'Admin access required' }, 403)

    const { new_password } = await c.req.json()
    if (!new_password || new_password.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    }

    // Hash using same SHA-256 approach
    const encoder = new TextEncoder()
    const data = encoder.encode(new_password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const password_hash = btoa(String.fromCharCode(...new Uint8Array(hash)))

    const result = await c.env.DB.prepare(
      'UPDATE users SET password_hash = ? WHERE id = ?'
    ).bind(password_hash, c.req.param('id')).run()

    if (!result.meta.changes) return c.json({ success: false, error: 'User not found' }, 404)
    return c.json({ success: true, message: 'Password reset successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/admin/users — list all users
admin.get('/users', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ success: false, error: 'Admin access required' }, 403)

    const users = await c.env.DB.prepare(
      "SELECT id, email, first_name, last_name, role, phone, is_active, is_verified, created_at FROM users ORDER BY id DESC"
    ).all()

    return c.json({ success: true, users: users.results || [] })
  } catch (e: any) {
    console.error('ADMIN USERS ERROR:', e)
    return c.json({ success: true, users: [], note: 'Users are unavailable right now' })
  }
})

// ─── POINTS & REWARDS ENDPOINTS ─────────────────────────────────────────────

// POST /api/admin/points/award — assign points to a provider
admin.post('/points/award', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const { provider_id, points, description } = await c.req.json()
    if (!provider_id || !points) return c.json({ error: 'provider_id and points are required' }, 400)
    const provider = await c.env.DB.prepare('SELECT id, user_id, loyalty_points FROM providers WHERE id = ?').bind(provider_id).first() as any
    if (!provider) return c.json({ error: 'Provider not found' }, 404)
    await c.env.DB.prepare('UPDATE providers SET loyalty_points = COALESCE(loyalty_points, 0) + ? WHERE id = ?').bind(points, provider_id).run()
    await c.env.DB.prepare(
      'INSERT INTO point_transactions (user_id, provider_id, points, type, description, admin_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(provider.user_id, provider_id, points, 'award', description || 'Admin award', adminUser.id || adminUser.sub).run()
    return c.json({ success: true, message: `Awarded ${points} points to provider #${provider_id}` })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /api/admin/points/history — full transaction log
admin.get('/points/history', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const result = await c.env.DB.prepare(`
      SELECT pt.id, pt.points, pt.type, pt.description, pt.created_at,
        p.business_name, u.first_name, u.last_name, u.email
      FROM point_transactions pt
      JOIN providers p ON pt.provider_id = p.id
      JOIN users u ON pt.user_id = u.id
      ORDER BY pt.created_at DESC LIMIT 100
    `).all()
    return c.json({ success: true, transactions: result.results || [] })
  } catch (e: any) {
    return c.json({ success: true, transactions: [], error: e.message })
  }
})

// GET /api/admin/points/providers — all providers with balances
admin.get('/points/providers', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const result = await c.env.DB.prepare(`
      SELECT p.id, p.business_name, COALESCE(p.loyalty_points, 0) as loyalty_points,
        u.first_name, u.last_name, u.email
      FROM providers p JOIN users u ON p.user_id = u.id
      ORDER BY p.loyalty_points DESC
    `).all()
    return c.json({ success: true, providers: result.results || [] })
  } catch (e: any) {
    return c.json({ success: true, providers: [], error: e.message })
  }
})

// GET /api/admin/rewards — list reward items
admin.get('/rewards', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const result = await c.env.DB.prepare('SELECT * FROM reward_items ORDER BY points_required ASC').all()
    return c.json({ success: true, rewards: result.results || [] })
  } catch (e: any) {
    return c.json({ success: true, rewards: [], error: e.message })
  }
})

// POST /api/admin/rewards — create reward item
admin.post('/rewards', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const { name, description, image_url, points_required, quantity_available, category } = await c.req.json()
    if (!name || !points_required) return c.json({ error: 'name and points_required are required' }, 400)
    const result = await c.env.DB.prepare(
      'INSERT INTO reward_items (name, description, image_url, points_required, quantity_available, category) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(name, description || null, image_url || null, points_required, quantity_available || null, category || 'general').run()
    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// PUT /api/admin/rewards/:id — update reward item
admin.put('/rewards/:id', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const { name, description, image_url, points_required, quantity_available, is_active, category } = await c.req.json()
    await c.env.DB.prepare(
      'UPDATE reward_items SET name=?, description=?, image_url=?, points_required=?, quantity_available=?, is_active=?, category=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
    ).bind(name, description || null, image_url || null, points_required, quantity_available || null, is_active !== undefined ? is_active : 1, category || 'general', c.req.param('id')).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// DELETE /api/admin/rewards/:id — delete reward item
admin.delete('/rewards/:id', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    await c.env.DB.prepare('DELETE FROM reward_items WHERE id = ?').bind(c.req.param('id')).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// GET /api/admin/rewards/claims — list all reward claims
admin.get('/rewards/claims', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const result = await c.env.DB.prepare(`
      SELECT rc.id, rc.points_spent, rc.status, rc.notes, rc.created_at,
        p.business_name, ri.name as reward_name, ri.category,
        u.first_name, u.last_name, u.email
      FROM reward_claims rc
      JOIN providers p ON rc.provider_id = p.id
      JOIN reward_items ri ON rc.reward_item_id = ri.id
      JOIN users u ON p.user_id = u.id
      ORDER BY rc.created_at DESC
    `).all()
    return c.json({ success: true, claims: result.results || [] })
  } catch (e: any) {
    return c.json({ success: true, claims: [], error: e.message })
  }
})

// PATCH /api/admin/rewards/claims/:id — approve or reject a claim
admin.patch('/rewards/claims/:id', async (c) => {
  try {
    const adminUser = await getAdmin(c)
    if (!adminUser) return c.json({ error: 'Admin access required' }, 403)
    const { status, notes } = await c.req.json()
    if (!['approved', 'rejected'].includes(status)) return c.json({ error: 'status must be approved or rejected' }, 400)
    await c.env.DB.prepare(
      'UPDATE reward_claims SET status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
    ).bind(status, notes || null, c.req.param('id')).run()
    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export default admin
