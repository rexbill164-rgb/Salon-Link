import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET?: string
  PAYSTACK_SECRET_KEY?: string
  PAYSTACK_PUBLIC_KEY?: string
}

const subscriptions = new Hono<{ Bindings: Bindings }>()

// GHS 10.00 monthly, in pesewas
const AMOUNT_PESEWAS = 1000
const PLAN_NAME = 'SalonLink Provider Monthly'
const PLAN_SETTING_KEY = 'paystack_plan_code'

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

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

// An active, non-lapsed subscription (grandfather/card never lapse here; momo respects expires_at)
async function activeSub(c: any, providerId: number) {
  return await c.env.DB.prepare(
    `SELECT * FROM provider_subscriptions
     WHERE provider_id = ? AND status = 'active'
       AND (billing_channel IN ('grandfather','card') OR expires_at IS NULL OR expires_at > datetime('now'))
     ORDER BY id DESC LIMIT 1`
  ).bind(providerId).first() as any
}

function paystackHeaders(secret: string) {
  return { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' }
}

// Create the monthly plan once, cache its code in app_settings
async function ensurePlan(c: any): Promise<string | null> {
  const secret = c.env.PAYSTACK_SECRET_KEY
  if (!secret) return null
  try {
    const row = await c.env.DB.prepare('SELECT value FROM app_settings WHERE key = ?')
      .bind(PLAN_SETTING_KEY).first() as any
    if (row?.value) return row.value
  } catch { /* table may not exist yet */ }

  try {
    const r = await fetch('https://api.paystack.co/plan', {
      method: 'POST',
      headers: paystackHeaders(secret),
      body: JSON.stringify({ name: PLAN_NAME, interval: 'monthly', amount: AMOUNT_PESEWAS, currency: 'GHS' })
    })
    const j: any = await r.json()
    const code = j?.data?.plan_code
    if (code) {
      await c.env.DB.prepare(
        `INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`
      ).bind(PLAN_SETTING_KEY, code).run()
      return code
    }
  } catch { /* fall through */ }
  return null
}

// ── GET /api/subscriptions/config ──
subscriptions.get('/config', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

  const publicKey = c.env.PAYSTACK_PUBLIC_KEY || null
  let email: string | null = null
  let providerId: number | null = null
  let sub: any = null
  try {
    const u = await c.env.DB.prepare('SELECT email FROM users WHERE id = ?').bind(Number(user.sub)).first() as any
    email = u?.email || user.email || null
    const prov = await getProviderForUser(c, Number(user.sub))
    if (prov) { providerId = prov.id; sub = await activeSub(c, prov.id) }
  } catch { /* defaults */ }

  const planCode = publicKey ? await ensurePlan(c) : null

  return c.json({
    success: true,
    public_key: publicKey,
    configured: !!publicKey,
    plan_code: planCode,
    amount: AMOUNT_PESEWAS,
    amount_ghs: AMOUNT_PESEWAS / 100,
    currency: 'GHS',
    email,
    provider_id: providerId,
    subscribed: !!sub,
    billing_channel: sub?.billing_channel || null,
    expires_at: sub?.expires_at || null
  })
})

// ── GET /api/subscriptions/status ──
subscriptions.get('/status', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
  try {
    const prov = await getProviderForUser(c, Number(user.sub))
    if (!prov) return c.json({ success: true, subscribed: false, is_provider: false })
    const sub = await activeSub(c, prov.id)
    return c.json({
      success: true, is_provider: true, provider_id: prov.id,
      subscribed: !!sub, billing_channel: sub?.billing_channel || null, expires_at: sub?.expires_at || null
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── POST /api/subscriptions/verify — confirm a payment, activate, set channel ──
subscriptions.post('/verify', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)

  const secret = c.env.PAYSTACK_SECRET_KEY
  if (!secret) return c.json({ success: false, error: 'Payments are not configured.' }, 503)

  let body: any = {}
  try { body = await c.req.json() } catch { /* empty */ }
  const reference = (body.reference || '').toString().trim()
  if (!reference) return c.json({ success: false, error: 'Missing payment reference' }, 400)

  const prov = await getProviderForUser(c, Number(user.sub))
  if (!prov) return c.json({ success: false, error: 'Provider profile not found' }, 404)

  let pres: any
  try {
    const r = await fetch('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      method: 'GET', headers: paystackHeaders(secret)
    })
    pres = await r.json()
  } catch { return c.json({ success: false, error: 'Could not reach payment provider. Try again.' }, 502) }

  const data = pres?.data
  if (!pres?.status || !data || data.status !== 'success') {
    return c.json({ success: false, error: 'Payment not successful', paystack_status: data?.status || 'unknown' }, 402)
  }
  if (Number(data.amount) < AMOUNT_PESEWAS) {
    return c.json({ success: false, error: 'Amount paid is less than the GHS 10 fee' }, 402)
  }

  const dupe = await c.env.DB.prepare('SELECT id FROM provider_subscriptions WHERE payment_reference = ? LIMIT 1')
    .bind(reference).first()
  if (dupe) return c.json({ success: true, subscribed: true, message: 'Already recorded' })

  // Detect channel. Card payments carry a reusable authorization; MoMo does not.
  const channelRaw = (data.channel || '').toString().toLowerCase()
  const auth = data.authorization || {}
  const reusableCard = channelRaw === 'card' && auth.reusable === true && auth.authorization_code
  const billingChannel = reusableCard ? 'card' : 'momo'
  const customerEmail = data.customer?.email || null
  const customerCode = data.customer?.customer_code || null
  // Card → Paystack Plan runs the recurring cycle; period informational. MoMo → 30-day window.
  const expires = "datetime('now','+30 days')"

  await c.env.DB.prepare(
    `INSERT INTO provider_subscriptions
       (provider_id, plan, status, amount_paid, payment_reference, billing_channel,
        authorization_code, customer_email, paystack_customer_code, started_at, last_charge_at, expires_at)
     VALUES (?, 'provider', 'active', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ${expires})`
  ).bind(
    prov.id, AMOUNT_PESEWAS, reference, billingChannel,
    reusableCard ? auth.authorization_code : null, customerEmail, customerCode
  ).run()

  await c.env.DB.prepare('UPDATE providers SET has_pro_gallery = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(prov.id).run()

  return c.json({
    success: true, subscribed: true, billing_channel: billingChannel,
    message: billingChannel === 'card'
      ? 'Activated. Your card will auto-renew GHS 10 monthly.'
      : 'Activated. Renew GHS 10 each month from your dashboard to stay listed.'
  })
})

// ── POST /api/subscriptions/webhook — Paystack recurring events (card renewals) ──
async function validSignature(secret: string, raw: string, signature: string | null): Promise<boolean> {
  if (!signature) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw))
  const hex = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
  return hex === signature
}

subscriptions.post('/webhook', async (c) => {
  const secret = c.env.PAYSTACK_SECRET_KEY
  const raw = await c.req.text()
  const sig = c.req.header('x-paystack-signature') || null
  if (!secret || !(await validSignature(secret, raw, sig))) {
    return c.json({ received: false, error: 'invalid signature' }, 401)
  }

  let evt: any = {}
  try { evt = JSON.parse(raw) } catch { return c.json({ received: false }, 400) }
  const type = evt?.event
  const d = evt?.data || {}

  try {
    if (type === 'charge.success') {
      // Recurring card renewal: extend the matching subscription by a month.
      const custCode = d.customer?.customer_code || null
      const email = d.customer?.email || null
      const subCode = d.subscription_code || d.plan?.subscription_code || null
      if (custCode || email || subCode) {
        await c.env.DB.prepare(
          `UPDATE provider_subscriptions
             SET status='active', last_charge_at=CURRENT_TIMESTAMP,
                 expires_at=datetime('now','+1 month'),
                 paystack_subscription_code=COALESCE(?, paystack_subscription_code)
           WHERE billing_channel='card'
             AND (paystack_customer_code = ? OR customer_email = ? OR paystack_subscription_code = ?)`
        ).bind(subCode, custCode, email, subCode).run()
      }
    } else if (type === 'subscription.create') {
      const subCode = d.subscription_code || null
      const custCode = d.customer?.customer_code || null
      const email = d.customer?.email || null
      if (subCode && (custCode || email)) {
        await c.env.DB.prepare(
          `UPDATE provider_subscriptions SET paystack_subscription_code=?
           WHERE billing_channel='card' AND (paystack_customer_code=? OR customer_email=?)`
        ).bind(subCode, custCode, email).run()
      }
    } else if (type === 'subscription.disable' || type === 'subscription.not_renew' || type === 'invoice.payment_failed') {
      const subCode = d.subscription_code || d.subscription?.subscription_code || null
      const custCode = d.customer?.customer_code || null
      const email = d.customer?.email || null
      if (subCode || custCode || email) {
        // Lapse the card subscription so the provider is re-gated and hidden until they re-pay.
        await c.env.DB.prepare(
          `UPDATE provider_subscriptions SET status='past_due', expires_at=datetime('now')
           WHERE billing_channel='card'
             AND (paystack_subscription_code=? OR paystack_customer_code=? OR customer_email=?)`
        ).bind(subCode, custCode, email).run()
      }
    }
  } catch { /* swallow — always 200 so Paystack doesn't retry-storm */ }

  return c.json({ received: true })
})

export default subscriptions
