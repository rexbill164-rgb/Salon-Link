import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET?: string
  PAYSTACK_SECRET_KEY?: string
  PAYSTACK_PUBLIC_KEY?: string
}

const subscriptions = new Hono<{ Bindings: Bindings }>()

// GHS 10.00 one-time provider activation fee, in pesewas
const SUBSCRIPTION_AMOUNT_PESEWAS = 1000
const SUBSCRIPTION_PLAN = 'provider'

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

// Dual-secret tolerant verification (tokens minted before JWT_SECRET was set)
async function getUser(c: any) {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const tok = auth.split(' ')[1]
  const secrets = [getJwtSecret(c), ['salonlink', 'jwt', 'secret', '2026'].join('_')]
  for (const s of secrets) {
    try { return await verify(tok, s, 'HS256') as any } catch { /* try next */ }
  }
  return null
}

async function getProviderForUser(c: any, userId: number) {
  return await c.env.DB.prepare(
    'SELECT id, user_id, has_pro_gallery FROM providers WHERE user_id = ?'
  ).bind(userId).first() as any
}

async function isSubscribed(c: any, providerId: number): Promise<boolean> {
  const row = await c.env.DB.prepare(
    "SELECT id FROM provider_subscriptions WHERE provider_id = ? AND status = 'active' LIMIT 1"
  ).bind(providerId).first()
  return !!row
}

// ── GET /api/subscriptions/config — public key + amount + current status ──
subscriptions.get('/config', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

  const publicKey = c.env.PAYSTACK_PUBLIC_KEY || null
  let subscribed = false
  let email: string | null = null
  let providerId: number | null = null

  try {
    const u = await c.env.DB.prepare('SELECT id, email FROM users WHERE id = ?')
      .bind(Number(user.sub)).first() as any
    email = u?.email || user.email || null
    const prov = await getProviderForUser(c, Number(user.sub))
    if (prov) {
      providerId = prov.id
      subscribed = await isSubscribed(c, prov.id)
    }
  } catch { /* fall through with defaults */ }

  return c.json({
    success: true,
    public_key: publicKey,
    configured: !!publicKey,
    amount: SUBSCRIPTION_AMOUNT_PESEWAS,
    amount_ghs: SUBSCRIPTION_AMOUNT_PESEWAS / 100,
    currency: 'GHS',
    email,
    provider_id: providerId,
    subscribed
  })
})

// ── GET /api/subscriptions/status — is the current provider activated? ──
subscriptions.get('/status', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const prov = await getProviderForUser(c, Number(user.sub))
    if (!prov) return c.json({ success: true, subscribed: false, is_provider: false })
    const subscribed = await isSubscribed(c, prov.id)
    return c.json({ success: true, subscribed, is_provider: true, provider_id: prov.id })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/subscriptions/verify — verify a Paystack reference, activate ──
subscriptions.post('/verify', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

  const secretKey = c.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return c.json({ success: false, error: 'Payments are not configured. Contact support.' }, 503)
  }

  let body: any = {}
  try { body = await c.req.json() } catch { /* empty */ }
  const reference = (body.reference || '').toString().trim()
  if (!reference) return c.json({ success: false, error: 'Missing payment reference' }, 400)

  const prov = await getProviderForUser(c, Number(user.sub))
  if (!prov) return c.json({ success: false, error: 'Provider profile not found' }, 404)

  // Already active? Idempotent success.
  if (await isSubscribed(c, prov.id)) {
    return c.json({ success: true, subscribed: true, message: 'Already activated' })
  }

  // Verify with Paystack
  let pres: any
  try {
    const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + secretKey }
    })
    pres = await r.json()
  } catch (e: any) {
    return c.json({ success: false, error: 'Could not reach payment provider. Try again.' }, 502)
  }

  const data = pres?.data
  if (!pres?.status || !data || data.status !== 'success') {
    return c.json({ success: false, error: 'Payment not successful', paystack_status: data?.status || 'unknown' }, 402)
  }
  if (Number(data.amount) < SUBSCRIPTION_AMOUNT_PESEWAS) {
    return c.json({ success: false, error: 'Amount paid is less than the GHS 10 activation fee' }, 402)
  }

  // Prevent the same reference being reused across providers
  const dupe = await c.env.DB.prepare(
    'SELECT id FROM provider_subscriptions WHERE payment_reference = ? LIMIT 1'
  ).bind(reference).first()
  if (dupe) return c.json({ success: false, error: 'This payment reference was already used' }, 409)

  // Record subscription + unlock pro gallery
  await c.env.DB.prepare(
    `INSERT INTO provider_subscriptions (provider_id, plan, status, amount_paid, payment_reference, started_at)
     VALUES (?, ?, 'active', ?, ?, CURRENT_TIMESTAMP)`
  ).bind(prov.id, SUBSCRIPTION_PLAN, SUBSCRIPTION_AMOUNT_PESEWAS, reference).run()

  await c.env.DB.prepare('UPDATE providers SET has_pro_gallery = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(prov.id).run()

  return c.json({ success: true, subscribed: true, message: 'Account activated. Welcome to SalonLink!' })
})

export default subscriptions
