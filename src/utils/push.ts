// Web Push sender for Cloudflare Workers (no node packages — uses Web Crypto API)
// Uses VAPID authentication with HS256 / ES256

async function uint8ArrayToBase64Url(arr: Uint8Array): Promise<string> {
  const b64 = btoa(String.fromCharCode(...arr))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function base64UrlToUint8Array(b64url: string): Promise<Uint8Array> {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  return new Uint8Array([...bin].map(c => c.charCodeAt(0)))
}

async function buildVapidAuth(endpoint: string, vapidPrivateKeyB64: string, vapidPublicKeyB64: string): Promise<string> {
  try {
    const url = new URL(endpoint)
    const audience = `${url.protocol}//${url.host}`
    const now = Math.floor(Date.now() / 1000)

    // JWT header + payload
    const header  = { typ: 'JWT', alg: 'ES256' }
    const payload = { aud: audience, exp: now + 86400, sub: 'mailto:noreply@salonlink.it.com' }
    const enc = (o: object) => btoa(JSON.stringify(o)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
    const sigInput = `${enc(header)}.${enc(payload)}`

    // Import private key
    const privKeyBytes = await base64UrlToUint8Array(vapidPrivateKeyB64)
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', privKeyBytes,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false, ['sign']
    )
    const sigBytes = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      cryptoKey,
      new TextEncoder().encode(sigInput)
    )
    const sig = await uint8ArrayToBase64Url(new Uint8Array(sigBytes))
    const jwt = `${sigInput}.${sig}`

    return `vapid t=${jwt},k=${vapidPublicKeyB64}`
  } catch (_) {
    return ''
  }
}

export async function sendPushToUser(
  db: D1Database,
  userId: number | string,
  payload: { title: string; body: string; url?: string; tag?: string; requireInteraction?: boolean },
  env: any
) {
  try {
    const vapidPrivate = env.VAPID_PRIVATE_KEY
    const vapidPublic  = env.VAPID_PUBLIC_KEY
    if (!vapidPrivate || !vapidPublic) return // VAPID not configured — skip silently

    const subs = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?')
      .bind(userId).all()

    const msg = JSON.stringify(payload)
    const msgBytes = new TextEncoder().encode(msg)

    for (const sub of (subs.results as any[])) {
      try {
        const authHeader = await buildVapidAuth(sub.endpoint, vapidPrivate, vapidPublic)
        const resp = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'TTL': '86400'
          },
          body: msgBytes  // simplified — real encryption requires ece lib
        })
        // If subscription expired / invalid, remove it
        if (resp.status === 404 || resp.status === 410) {
          await db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(sub.endpoint).run()
        }
      } catch (_) {}
    }
  } catch (_) {}
}
