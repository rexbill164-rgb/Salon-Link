import { Hono } from 'hono'

const auth = new Hono()

// In-memory store for demo (replace with Supabase in production)
const users: any[] = [
  { id: 1, name: 'Demo Customer', email: 'customer@demo.com', password: 'Demo1234!', role: 'customer', phone: '+233201234567', createdAt: new Date().toISOString() },
  { id: 2, name: 'Glam Studio GH', email: 'provider@demo.com', password: 'Demo1234!', role: 'provider', phone: '+233209876543', businessName: 'Glam Studio GH', verified: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Admin User', email: 'admin@demo.com', password: 'Demo1234!', role: 'admin', phone: '+233200000000', createdAt: new Date().toISOString() },
]
let nextId = 4

function makeToken(user: any) {
  // Simple base64 JWT-like token for demo
  const payload = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 * 7 }))
  return `sl.${payload}.demo`
}

function safeUser(u: any) {
  const { password, ...rest } = u
  return rest
}

auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, password, phone, role, businessName, serviceType } = body
    if (!name || !email || !password) return c.json({ error: 'Name, email and password are required' }, 400)
    if (users.find(u => u.email === email)) return c.json({ error: 'Email already registered' }, 409)
    if (password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400)
    const user: any = { id: nextId++, name, email, password, phone, role: role || 'customer', createdAt: new Date().toISOString(), verified: false }
    if (role === 'provider') { user.businessName = businessName || name; user.serviceType = serviceType || 'Hair Salon'; user.kycStatus = 'pending' }
    users.push(user)
    const token = makeToken(user)
    return c.json({ token, user: safeUser(user) }, 201)
  } catch (e) {
    return c.json({ error: 'Registration failed' }, 500)
  }
})

auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return c.json({ error: 'Invalid email or password' }, 401)
    const token = makeToken(user)
    return c.json({ token, user: safeUser(user) })
  } catch (e) {
    return c.json({ error: 'Login failed' }, 500)
  }
})

auth.get('/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const token = auth.replace('Bearer ', '')
    const payload = JSON.parse(atob(token.split('.')[1]))
    const user = users.find(u => u.id === payload.id)
    if (!user) return c.json({ error: 'User not found' }, 404)
    return c.json(safeUser(user))
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

auth.post('/logout', (c) => c.json({ message: 'Logged out' }))

export default auth
