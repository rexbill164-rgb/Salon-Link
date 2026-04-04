import { Hono } from 'hono'
const admin = new Hono()
admin.get('/stats', (c) => c.json({ totalUsers: 1248, totalProviders: 312, totalBookings: 8942, totalRevenue: 284600, activeToday: 87, pendingKYC: 23, flaggedAccounts: 5, completionRate: 94 }))
admin.get('/users', (c) => c.json([
  { id: 1, name: 'Demo Customer', email: 'customer@demo.com', role: 'customer', status: 'active', joinedAt: new Date().toISOString() },
  { id: 2, name: 'Glam Studio GH', email: 'provider@demo.com', role: 'provider', status: 'active', verified: true, joinedAt: new Date().toISOString() },
  { id: 3, name: 'Admin User', email: 'admin@demo.com', role: 'admin', status: 'active', joinedAt: new Date().toISOString() },
]))
admin.get('/bookings', (c) => c.json([
  { id: 'SL-10001', customer: 'Demo Customer', provider: 'Glam Studio GH', service: 'Natural Hair Twist', status: 'confirmed', total: 82, date: new Date().toISOString() },
]))
admin.patch('/users/:id/suspend', async (c) => c.json({ message: 'User suspended' }))
admin.patch('/providers/:id/verify', async (c) => c.json({ message: 'Provider verified' }))
admin.get('/kyc-pending', (c) => c.json([
  { id: 1, name: 'Jane Stylist', businessName: 'Jane Hair Studio', submittedAt: new Date().toISOString(), status: 'pending' },
  { id: 2, name: 'Kofi Barber', businessName: 'Kofi Kutz', submittedAt: new Date().toISOString(), status: 'pending' },
]))
export default admin
