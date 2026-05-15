import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
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
import { withDiscoveryNearbyUi, withProviderDashboardMessagesButton, withProviderProfileServiceUi } from './utils/chatMapServiceEnhancements'
import { withProviderDashboardStaticFix } from './utils/providerDashboardStaticFix'

type Bindings = { DB: D1Database; [key: string]: any }
const app = new Hono<{ Bindings: Bindings }>()
app.use('*', logger())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }))
app.route('/api/auth', authRoutes)
app.route('/api/providers', providerRoutes)
app.route('/api/bookings', bookingRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/reviews', reviewRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/uploads', uploadRoutes)
app.route('/api/notifications', notificationRoutes)
app.route('/api/messages', messageRoutes)
app.get('/', (c) => c.html(homePage()))
app.get('/login', (c) => c.html(loginPage()))
app.get('/register', (c) => c.html(registerPage()))
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/provider/dashboard', (c) => c.html(withProviderDashboardStaticFix(withProviderDashboardMessagesButton(repairInlineScriptText(providerDashboardPage())))))
app.get('/provider/onboarding', (c) => c.html(onboardingPage()))
app.get('/discover', (c) => c.html(withDiscoveryNearbyUi(discoveryPage())))
app.get('/provider/:id', (c) => c.html(withProviderProfileServiceUi(providerProfilePage(c.req.param('id')))))
app.get('/book/:id', (c) => c.html(bookingPage(c.req.param('id'))))
app.get('/admin', (c) => c.html(repairInlineScriptText(adminPanelPage())))
app.get('/messages', (c) => c.html(messagesPage()))
app.get('/messages/:conversation_id', (c) => c.html(messagesPage(c.req.param('conversation_id'))))
app.get('/hairstyle-history', (c) => c.html(hairstyleHistoryPage()))
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/notifications', (c) => c.html(notificationsPage()))
app.get('/payment/pay', (c) => c.html(paymentPage()))
app.get('/payment/success', (c) => c.html(paymentSuccessPage()))
app.get('/api/health', (c) => c.json({ status: 'ok', app: 'SalonLink', version: '2.1.1-provider-dashboard-static-fix', db: 'D1 Connected', timestamp: new Date().toISOString() }))
app.notFound((c) => c.html(homePage()))
export default app
