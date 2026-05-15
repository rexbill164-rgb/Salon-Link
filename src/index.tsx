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
import { withProviderGalleryDeleteFix } from './utils/providerGalleryDeleteFix'
import { withPaymentDisabledUi } from './utils/paymentDisabledUi'
import { withProviderKycLogoutFix } from './utils/providerKycLogoutFix'
import { withMessagesKeyboardFix } from './utils/messagesKeyboardFix'
import { withZoomLock } from './utils/zoomLock'
import { withCustomerMessagesShortcut } from './utils/customerMessagesShortcut'

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

const page = (html: string) => withZoomLock(withCustomerMessagesShortcut(html))
const providerDash = () => withZoomLock(withProviderKycLogoutFix(withProviderGalleryDeleteFix(withProviderDashboardStaticFix(withProviderDashboardMessagesButton(repairInlineScriptText(providerDashboardPage()))))))
const noPay = (html: string) => page(withPaymentDisabledUi(html))
const msgPage = (conversationId = '') => withZoomLock(withMessagesKeyboardFix(messagesPage(conversationId)))

app.get('/', (c) => c.html(page(homePage())))
app.get('/login', (c) => c.html(page(loginPage())))
app.get('/register', (c) => c.html(page(registerPage())))
app.get('/dashboard', (c) => c.html(noPay(dashboardPage())))
app.get('/provider/dashboard', (c) => c.html(providerDash()))
app.get('/provider/onboarding', (c) => c.html(page(onboardingPage())))
app.get('/discover', (c) => c.html(page(withDiscoveryNearbyUi(discoveryPage()))))
app.get('/provider/:id', (c) => c.html(page(withProviderProfileServiceUi(providerProfilePage(c.req.param('id'))))))
app.get('/book/:id', (c) => c.html(noPay(bookingPage(c.req.param('id')))))
app.get('/admin', (c) => c.html(withZoomLock(repairInlineScriptText(adminPanelPage()))))
app.get('/messages', (c) => c.html(msgPage()))
app.get('/messages/:conversation_id', (c) => c.html(msgPage(c.req.param('conversation_id'))))
app.get('/hairstyle-history', (c) => c.html(page(hairstyleHistoryPage())))
app.get('/settings', (c) => c.html(page(settingsPage())))
app.get('/notifications', (c) => c.html(page(notificationsPage())))
app.get('/payment/pay', (c) => c.html(noPay(paymentPage())))
app.get('/payment/success', (c) => c.html(noPay(paymentSuccessPage())))
app.get('/api/health', (c) => c.json({ status: 'ok', app: 'SalonLink', version: '2.1.7-customer-messages-shortcut', db: 'D1 Connected', timestamp: new Date().toISOString() }))
app.notFound((c) => c.html(page(homePage())))
export default app
