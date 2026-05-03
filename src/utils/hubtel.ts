type HubtelEnv = {
  HUBTEL_CLIENT_ID?: string
  HUBTEL_CLIENT_SECRET?: string
  HUBTEL_SENDER_ID?: string
  HUBTEL_SMS_FROM?: string
}

export function normalizeGhanaPhone(input: string): string {
  const digits = String(input || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('233')) return digits
  if (digits.startsWith('0')) return '233' + digits.slice(1)
  if (digits.length === 9) return '233' + digits
  return digits
}

function maskPhone(phone: string): string {
  const p = normalizeGhanaPhone(phone)
  if (p.length < 6) return p
  return p.slice(0, 5) + '***' + p.slice(-3)
}

function getHubtelAuth(env: HubtelEnv): string | null {
  const clientId = env.HUBTEL_CLIENT_ID?.trim()
  const clientSecret = env.HUBTEL_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) return null
  return 'Basic ' + btoa(`${clientId}:${clientSecret}`)
}

export async function sendHubtelSms(env: HubtelEnv, phone: string, message: string): Promise<{ ok: boolean; provider: string; response?: any; error?: string }> {
  const normalized = normalizeGhanaPhone(phone)
  const to = normalized.startsWith('+') ? normalized : '+' + normalized
  const from = env.HUBTEL_SMS_FROM || env.HUBTEL_SENDER_ID || 'SalonLink'
  const auth = getHubtelAuth(env)

  if (!auth) {
    return { ok: false, provider: 'hubtel', error: 'Hubtel credentials not configured' }
  }
  if (!normalized || normalized.length < 12) {
    return { ok: false, provider: 'hubtel', error: `Invalid phone number: ${maskPhone(phone)}` }
  }

  const payload = {
    from,
    to,
    content: message
  }

  const endpoints = [
    'https://smsc.hubtel.com/v1/messages/send',
    'https://api.hubtel.com/v1/messages/send'
  ]

  let lastError = ''
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const text = await res.text()
      let data: any = text
      try { data = JSON.parse(text) } catch (_) {}

      if (res.ok) return { ok: true, provider: 'hubtel', response: data }
      lastError = typeof data === 'string' ? data : JSON.stringify(data)
    } catch (err: any) {
      lastError = err.message || 'Hubtel request failed'
    }
  }

  return { ok: false, provider: 'hubtel', error: lastError || 'Hubtel SMS failed' }
}

export function renderTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => String(data[key] ?? ''))
}
