import { Hono } from 'hono'

const bookings = new Hono()

const bookingStore: any[] = [
  { id: 'SL-10001', customerId: 1, providerId: 1, providerName: 'Glam Studio GH', service: 'Natural Hair Twist', date: 'Tomorrow', time: '2:00 PM', price: 80, fee: 2, total: 82, status: 'confirmed', paymentMethod: 'momo', paymentStatus: 'paid', createdAt: new Date().toISOString(), notes: '' },
  { id: 'SL-10002', customerId: 1, providerId: 2, providerName: 'KutzByKofi', service: 'Fade Cut', date: 'Apr 10, 2025', time: '10:00 AM', price: 40, fee: 2, total: 42, status: 'pending', paymentMethod: 'pay_later', paymentStatus: 'unpaid', createdAt: new Date().toISOString(), notes: '' },
  { id: 'SL-10003', customerId: 1, providerId: 3, providerName: 'Nails by Abena', service: 'Gel Manicure', date: 'Mar 28, 2025', time: '11:00 AM', price: 60, fee: 2, total: 62, status: 'completed', paymentMethod: 'card', paymentStatus: 'paid', createdAt: new Date().toISOString(), notes: '', hairstylePhoto: '' },
]
let nextId = 10004

bookings.get('/', (c) => {
  const auth = c.req.header('Authorization')
  let userId = 1
  if (auth) {
    try { const p = JSON.parse(atob(auth.replace('Bearer sl.', '').split('.')[0])); userId = p.id } catch {}
  }
  const userBookings = bookingStore.filter(b => b.customerId === userId || b.providerId === userId)
  return c.json(userBookings)
})

bookings.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { providerId, service, date, time, price, paymentMethod, notes } = body
    const booking = {
      id: 'SL-' + nextId++,
      customerId: 1,
      providerId: providerId || 1,
      providerName: 'Glam Studio GH',
      service: service || 'Hair Service',
      date: date || 'Tomorrow',
      time: time || '2:00 PM',
      price: price || 0,
      fee: 2,
      total: (price || 0) + 2,
      status: 'pending',
      paymentMethod: paymentMethod || 'pay_later',
      paymentStatus: paymentMethod === 'pay_later' ? 'unpaid' : 'paid',
      createdAt: new Date().toISOString(),
      notes: notes || '',
    }
    bookingStore.push(booking)
    return c.json(booking, 201)
  } catch (e) {
    return c.json({ error: 'Booking failed' }, 500)
  }
})

bookings.get('/:id', (c) => {
  const b = bookingStore.find(b => b.id === c.req.param('id'))
  if (!b) return c.json({ error: 'Booking not found' }, 404)
  return c.json(b)
})

bookings.patch('/:id/status', async (c) => {
  const b = bookingStore.find(b => b.id === c.req.param('id'))
  if (!b) return c.json({ error: 'Not found' }, 404)
  const { status } = await c.req.json()
  b.status = status
  return c.json(b)
})

bookings.post('/:id/cancel', async (c) => {
  const b = bookingStore.find(b => b.id === c.req.param('id'))
  if (!b) return c.json({ error: 'Not found' }, 404)
  b.status = 'cancelled'
  return c.json({ message: 'Booking cancelled', booking: b })
})

bookings.post('/:id/hairstyle-photo', async (c) => {
  const b = bookingStore.find(b => b.id === c.req.param('id'))
  if (!b) return c.json({ error: 'Not found' }, 404)
  const { photoUrl } = await c.req.json()
  b.hairstylePhoto = photoUrl
  return c.json({ message: 'Photo uploaded', booking: b })
})

// Provider: get their bookings
bookings.get('/provider/:providerId', (c) => {
  const pid = parseInt(c.req.param('providerId'))
  return c.json(bookingStore.filter(b => b.providerId === pid))
})

export default bookings
