import { Hono } from 'hono'
const notifications = new Hono()
const store = [
  { id: 1, type: 'booking', title: 'Booking Confirmed!', message: 'Your appointment at Glam Studio GH is confirmed for tomorrow 2:00 PM.', read: false, createdAt: new Date(Date.now()-3600000).toISOString() },
  { id: 2, type: 'reminder', title: 'Appointment Tomorrow', message: 'Come early and get 5% discount! Your appointment is at 2:00 PM.', read: false, createdAt: new Date(Date.now()-7200000).toISOString() },
  { id: 3, type: 'promo', title: 'Special Offer 🎉', message: 'KutzByKofi is offering 20% off this weekend only!', read: true, createdAt: new Date(Date.now()-86400000).toISOString() },
]
notifications.get('/', (c) => c.json(store))
notifications.patch('/:id/read', (c) => {
  const n = store.find(n => n.id === parseInt(c.req.param('id')))
  if (n) n.read = true
  return c.json({ message: 'Marked as read' })
})
notifications.post('/mark-all-read', (c) => {
  store.forEach(n => n.read = true)
  return c.json({ message: 'All marked as read' })
})
export default notifications
