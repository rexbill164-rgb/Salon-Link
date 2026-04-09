import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

type Bindings = { DB: D1Database; ADMIN_EMAIL?: string; SENDGRID_KEY?: string }

const auth = new Hono<{ Bindings: Bindings }>()

// Send email via SendGrid (if key configured) or store as notification
async function sendAdminEmail(c: any, subject: string, body: string) {
  try {
    const ADMIN_EMAIL = c.env.ADMIN_EMAIL || 'admin@salonlink.it.com'
    const SENDGRID_KEY = c.env.SENDGRID_KEY

    if (SENDGRID_KEY) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
          from: { email: 'noreply@salonlink.it.com', name: 'SalonLink' },
          subject,
          content: [{ type: 'text/html', value: body }]
        })
      })
    }

    // Always store as admin notification in DB
    const adminUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    ).first() as any
    if (adminUser) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (?, ?, ?, 'system', '/admin')
      `).bind(adminUser.id, subject, body.replace(/<[^>]+>/g, '').substring(0, 200)).run()
    }
  } catch (_) {
    // Email is best-effort, don't block registration
  }
}

// Helper: hash password using Web Crypto (no bcrypt needed in Workers)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password)
  return newHash === hash
}

function generateRef(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// POST /api/auth/register
auth.post('/register', async (c) => {
  try {
    const { email, phone, password, first_name, last_name, role, business_name, service_category } = await c.req.json()

    if (!email || !password || !first_name || !last_name) {
      return c.json({ success: false, error: 'Missing required fields' }, 400)
    }
    if (password.length < 8) {
      return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    }

    // Check existing user
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) {
      return c.json({ success: false, error: 'Email already registered' }, 409)
    }

    const password_hash = await hashPassword(password)
    const userRole = role === 'provider' ? 'provider' : 'customer'

    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, phone, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(email, phone || null, password_hash, first_name, last_name, userRole).run()

    const userId = result.meta.last_row_id

    // If provider, always create provider profile (business_name can be set later in onboarding)
    if (userRole === 'provider') {
      await c.env.DB.prepare(
        'INSERT INTO providers (user_id, business_name, service_category) VALUES (?, ?, ?)'
      ).bind(userId, business_name || (first_name + ' Salon'), service_category || 'hair_salon').run()
    }

    // Generate JWT
    const token = await sign(
      { sub: String(userId), role: userRole, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      'salonlink_jwt_secret_2026'
    )

    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(userId).first() as any

    // Attach provider_id if provider
    if (userRole === 'provider') {
      const prow = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(userId).first() as any
      if (prow && user) (user as any).provider_id = prow.id
    }

    // Notify admin of new registration
    const roleLabel = userRole === 'provider' ? '🔴 SERVICE PROVIDER' : '🟢 CUSTOMER'
    const emailSubject = `New ${roleLabel} Registration - ${first_name} ${last_name}`
    const emailBody = `
      <h2>New Registration on SalonLink</h2>
      <p><strong>Type:</strong> ${roleLabel}</p>
      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      ${userRole === 'provider' ? `<p><strong>Business:</strong> ${business_name}</p><p><strong>Service:</strong> ${service_category}</p>` : ''}
      <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
      ${userRole === 'provider' ? '<p><a href="https://salonlink.it.com/admin">👉 Approve this provider in Admin Panel</a></p>' : ''}
    `
    await sendAdminEmail(c, emailSubject, emailBody)

    return c.json({ success: true, token, user })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password required' }, 400)
    }

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND is_active = 1'
    ).bind(email).first() as any

    if (!user) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return c.json({ success: false, error: 'Invalid email or password' }, 401)
    }

    const token = await sign(
      { sub: String(user.id), role: user.role, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      'salonlink_jwt_secret_2026'
    )

    // Get provider id if provider
    let provider_id = null
    if (user.role === 'provider') {
      const prov = await c.env.DB.prepare('SELECT id FROM providers WHERE user_id = ?').bind(user.id).first() as any
      if (prov) provider_id = prov.id
    }

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
        provider_id
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// GET /api/auth/me
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }
    const token = authHeader.split(' ')[1]
    const payload = await verify(token, 'salonlink_jwt_secret_2026', 'HS256') as any

    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(payload.sub).first()

    if (!user) return c.json({ success: false, error: 'User not found' }, 404)

    return c.json({ success: true, user })
  } catch (e: any) {
    return c.json({ success: false, error: 'Invalid token' }, 401)
  }
})

// PUT /api/auth/profile — update user profile
auth.put('/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const payload = await verify(authHeader.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    const { first_name, last_name, phone } = await c.req.json()
    await c.env.DB.prepare(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?'
    ).bind(first_name, last_name, phone, payload.sub).run()
    const user = await c.env.DB.prepare(
      'SELECT id, email, phone, first_name, last_name, role, avatar_url, is_verified FROM users WHERE id = ?'
    ).bind(payload.sub).first()
    return c.json({ success: true, user })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// PUT /api/auth/password — change password
auth.put('/password', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const payload = await verify(authHeader.split(' ')[1], 'salonlink_jwt_secret_2026', 'HS256') as any
    const { current_password, new_password } = await c.req.json()
    if (!current_password || !new_password) return c.json({ success: false, error: 'Both passwords required' }, 400)
    if (new_password.length < 8) return c.json({ success: false, error: 'Password must be at least 8 characters' }, 400)
    const user = await c.env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.sub).first() as any
    const valid = await verifyPassword(current_password, user.password_hash)
    if (!valid) return c.json({ success: false, error: 'Current password is incorrect' }, 401)
    const newHash = await hashPassword(new_password)
    await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(newHash, payload.sub).run()
    return c.json({ success: true, message: 'Password updated successfully' })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// POST /api/auth/logout
auth.post('/logout', async (c) => {
  return c.json({ success: true, message: 'Logged out successfully' })
})

export default auth
