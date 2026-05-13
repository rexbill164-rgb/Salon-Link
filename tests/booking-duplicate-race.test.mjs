import test from 'node:test'
import assert from 'node:assert/strict'

const SLOT_CONFLICT_MESSAGE = 'This time slot is no longer available. Please select another time.'

const requiredEnv = [
  'SALONLINK_BASE_URL',
  'SALONLINK_CUSTOMER_TOKENS',
  'SALONLINK_ADMIN_TOKEN',
  'SALONLINK_PROVIDER_ID',
  'SALONLINK_SERVICE_ID',
  'SALONLINK_BOOKING_DATE',
  'SALONLINK_BOOKING_TIME'
]

const missingEnv = requiredEnv.filter((name) => !process.env[name])
const customerTokens = (process.env.SALONLINK_CUSTOMER_TOKENS || '')
  .split(',')
  .map((token) => token.trim())
  .filter(Boolean)

const skipReason = missingEnv.length
  ? `Missing required env vars: ${missingEnv.join(', ')}`
  : customerTokens.length < 10
    ? 'SALONLINK_CUSTOMER_TOKENS must contain at least 10 comma-separated customer JWTs'
    : false

function apiUrl(path) {
  return new URL(path, process.env.SALONLINK_BASE_URL).toString()
}

async function jsonOrText(response) {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { raw: text }
  }
}

test('only one concurrent booking can reserve the same provider service time slot', { skip: skipReason }, async () => {
  const providerId = process.env.SALONLINK_PROVIDER_ID
  const serviceId = process.env.SALONLINK_SERVICE_ID
  const bookingDate = process.env.SALONLINK_BOOKING_DATE
  const bookingTime = process.env.SALONLINK_BOOKING_TIME
  const payload = {
    provider_id: Number(providerId),
    service_id: Number(serviceId),
    booking_date: bookingDate,
    booking_time: bookingTime,
    notes: `QA duplicate slot race test ${Date.now()}`
  }

  const attempts = customerTokens.slice(0, 10).map((token) => fetch(apiUrl('/api/bookings'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }))

  const responses = await Promise.all(attempts)
  const bodies = await Promise.all(responses.map(jsonOrText))

  const successes = responses.filter((response, index) => response.ok && bodies[index]?.success === true)
  const conflicts = responses.filter((response, index) => {
    const message = bodies[index]?.error || bodies[index]?.message
    return response.status === 409 && message === SLOT_CONFLICT_MESSAGE
  })

  assert.equal(successes.length, 1, JSON.stringify({ statuses: responses.map((response) => response.status), bodies }, null, 2))
  assert.equal(conflicts.length, 9, JSON.stringify({ statuses: responses.map((response) => response.status), bodies }, null, 2))

  const adminResponse = await fetch(apiUrl('/api/admin/bookings'), {
    headers: { Authorization: `Bearer ${process.env.SALONLINK_ADMIN_TOKEN}` }
  })
  const adminBody = await jsonOrText(adminResponse)

  assert.equal(adminResponse.status, 200, JSON.stringify(adminBody, null, 2))
  assert.equal(adminBody.success, true, JSON.stringify(adminBody, null, 2))

  const duplicateRows = (adminBody.bookings || []).filter((booking) => (
    String(booking.provider_id) === String(providerId) &&
    String(booking.service_id) === String(serviceId) &&
    booking.booking_date === bookingDate &&
    booking.booking_time === bookingTime &&
    !['cancelled', 'rejected'].includes(String(booking.status || 'pending'))
  ))

  assert.equal(duplicateRows.length, 1, JSON.stringify(duplicateRows, null, 2))
})
