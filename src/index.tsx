import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { verify } from 'hono/jwt'

import authRoutes from './routes/auth'
import providerRoutes from './routes/providers'
import bookingRoutes from './routes/bookings'
import paymentRoutes from './routes/payments'
import reviewRoutes from './routes/reviews'
import adminRoutes from './routes/admin'
import uploadRoutes from './routes/uploads'
import notificationRoutes from './routes/notifications'
import messageRoutes from './routes/messages'

import { homePage } from './pages/home'
import { loginPage } from './pages/login'
import { registerPage } from './pages/register'
import { dashboardPage } from './pages/dashboard'
import { providerDashboardPage } from './pages/providerDashboard'
import { discoveryPage } from './pages/discovery'
import { providerProfilePage } from './pages/providerProfile'
import { bookingPage } from './pages/booking'
import { adminPage as adminPanelPage } from './pages/admin'
import { onboardingPage } from './pages/onboarding'
import { hairstyleHistoryPage } from './pages/hairstyleHistory'
import { settingsPage } from './pages/settings'
import { notificationsPage } from './pages/notifications'
import { paymentPage, paymentSuccessPage } from './pages/paymentPage'
import { messagesPage } from './pages/messages'
import { repairInlineScriptText } from './utils/generatedScriptRepairs'
import { withoutTemporaryPasswordNotice } from './utils/loginNoticeCleanup'
import { withAccountSecurityPatch } from './utils/accountSecurityPatch'
import { withPasswordLabelPatch } from './utils/passwordLabelPatch'
import { withNotificationPreferencesPatch } from './utils/notificationPreferencesPatch'
import { OFFLINE_PAYMENT_MESSAGE, withOfflinePaymentLaunchPatch } from './utils/offlinePaymentLaunchPatch'

type Bindings = { DB: D1Database; [key: string]: any }

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', logger())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }))

const onlinePaymentDisabledPayload = () => ({
  success: false,
  error: OFFLINE_PAYMENT_MESSAGE,
  message: OFFLINE_PAYMENT_MESSAGE,
  payment_disabled: true
})

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

async function getMigrationAdmin(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    const payload = await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
    return payload.role === 'admin' ? payload : null
  } catch {
    return null
  }
}

app.all('/api/payments/initialize', (c) => c.json(onlinePaymentDisabledPayload(), 503))
app.all('/api/payments/mock-success', (c) => c.json(onlinePaymentDisabledPayload(), 503))
app.all('/api/payments/verify/:reference', (c) => c.json(onlinePaymentDisabledPayload(), 503))
app.all('/api/payments/public-key', (c) => c.json({ ...onlinePaymentDisabledPayload(), public_key: null }, 503))
app.all('/api/payments/webhook', (c) => c.json({ received: true, processed: false, payment_disabled: true, message: OFFLINE_PAYMENT_MESSAGE }))

app.route('/api/auth', authRoutes)
app.route('/api/providers', providerRoutes)
app.route('/api/bookings', bookingRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/reviews', reviewRoutes)

app.post('/api/admin/migrations/0008-unique-active-booking-slot', async (c) => {
  try {
    const user = await getMigrationAdmin(c)
    if (!user) return c.json({ success: false, error: 'Admin access required' }, 403)

    const duplicates = await c.env.DB.prepare(`
      SELECT provider_id, service_id, booking_date, booking_time, COUNT(*) AS duplicate_count
      FROM bookings
      WHERE COALESCE(status, 'pending') NOT IN ('cancelled', 'rejected')
      GROUP BY provider_id, service_id, booking_date, booking_time
      HAVING COUNT(*) > 1
      LIMIT 20
    `).all()

    if ((duplicates.results || []).length) {
      return c.json({
        success: false,
        error: 'Duplicate active bookings must be resolved before migration 0008 can be applied',
        duplicates: duplicates.results
      }, 409)
    }

    await c.env.DB.prepare(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking_slot
      ON bookings (provider_id, service_id, booking_date, booking_time)
      WHERE COALESCE(status, 'pending') NOT IN ('cancelled', 'rejected')
    `).run()

    const index = await c.env.DB.prepare(`
      SELECT name, sql
      FROM sqlite_master
      WHERE type = 'index'
        AND tbl_name = 'bookings'
        AND name = 'idx_unique_active_booking_slot'
    `).first()

    if (!index) {
      return c.json({ success: false, error: 'Migration attempted but unique index was not found' }, 500)
    }

    return c.json({ success: true, applied: true, index })
  } catch (error) {
    console.error('MIGRATION 0008 ERROR:', error)
    return c.json({ success: false, error: 'Migration 0008 failed', details: String(error) }, 500)
  }
})

app.route('/api/admin', adminRoutes)
app.route('/api/uploads', uploadRoutes)
app.route('/api/notifications', notificationRoutes)
app.route('/api/messages', messageRoutes)

const accountPage = (html: string) => withNotificationPreferencesPatch(withPasswordLabelPatch(withAccountSecurityPatch(html)))
const offlinePaymentPage = (html: string) => withOfflinePaymentLaunchPatch(html)

app.get('/', (c) => c.html(homePage()))
app.get('/login', (c) => c.html(withoutTemporaryPasswordNotice(loginPage())))
app.get('/register', (c) => c.html(registerPage()))
app.get('/dashboard', (c) => c.html(offlinePaymentPage(dashboardPage())))
app.get('/provider/dashboard', (c) => c.html(accountPage(repairInlineScriptText(providerDashboardPage()))))
app.get('/provider/onboarding', (c) => c.html(onboardingPage()))
app.get('/discover', (c) => c.html(discoveryPage()))
app.get('/provider/:id', (c) => c.html(providerProfilePage(c.req.param('id'))))
app.get('/book/:id', (c) => c.html(offlinePaymentPage(bookingPage(c.req.param('id')))))
app.get('/admin', (c) => c.html(accountPage(repairInlineScriptText(adminPanelPage()))))
app.get('/messages', (c) => c.html(messagesPage()))
app.get('/messages/:conversation_id', (c) => c.html(messagesPage(c.req.param('conversation_id'))))
app.get('/hairstyle-history', (c) => c.html(hairstyleHistoryPage()))
app.get('/settings', (c) => c.html(accountPage(settingsPage())))
app.get('/notifications', (c) => c.html(notificationsPage()))
app.get('/payment/pay', (c) => c.html(offlinePaymentPage(paymentPage())))
app.get('/payment/success', (c) => c.html(offlinePaymentPage(paymentSuccessPage())))

app.get('/api/health', (c) => c.json({ status: 'ok', app: 'SalonLink', version: '2.1.4-notification-prefs', db: 'D1 Connected', timestamp: new Date().toISOString() }))

app.notFound((c) => c.html(homePage()))

export default app
