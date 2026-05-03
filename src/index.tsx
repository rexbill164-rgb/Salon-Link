import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Route imports
import authRoutes from './routes/auth'
import providerRoutes from './routes/providers'
import bookingRoutes from './routes/bookings'
import paymentRoutes from './routes/payments'
import reviewRoutes from './routes/reviews'
import adminRoutes from './routes/admin'
import uploadRoutes from './routes/uploads'
import notificationRoutes from './routes/notifications'
import smsRoutes from './routes/sms'
import analyticsRoutes from './routes/analytics'

// Page imports
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
import { repairInlineScriptText } from './utils/generatedScriptRepairs'
import { withAdminKycDocumentViewer } from './utils/adminKycDocumentViewer'

type Bindings = {
  DB: D1Database
  [key: string]: any
}

const app = new Hono<{ Bindings: Bindings }>()

function loginPageWithSmsAndAnalytics() {
  const afterLoginScript = `function salonLinkAfterLogin(token, user, method) {
  if (!token || !window.axios) return;
  var headers = { Authorization: 'Bearer ' + token };
  axios.post('/api/sms/welcome', {}, { headers: headers }).catch(function(){});
  axios.post('/api/analytics/track', {
    event_name: 'user_login',
    event_source: 'web',
    page_path: '/login',
    metadata: { method: method, role: user && user.role }
  }, { headers: headers }).catch(function(){});
}`

  return loginPage()
    .replace('/api/auth/otp/send', '/api/sms/otp/send')
    .replace('/api/auth/otp/verify', '/api/sms/otp/verify')
    .replace('Phone / WhatsApp', 'Phone / SMS')
    .replace('OTP sent to your WhatsApp', 'OTP sent to your phone')
    .replace('Send OTP via WhatsApp', 'Send OTP via SMS')
    .replace('Check your WhatsApp', 'Check your SMS')
    .replace('OTP sent to WhatsApp \\u2726', 'OTP sent by SMS \\u2726')
    .replace('Send OTP via WhatsApp', 'Send OTP via SMS')
    .replace(
      '<script>\n// Try to play video background, fallback to image',
      `<script>\n${afterLoginScript}\n\n// Try to play video background, fallback to image`
    )
    .replace(
      "localStorage.setItem('sl_user', JSON.stringify(u));\n      showToast('Welcome back, ' + u.name + ' \\u2726', 'success');",
      "localStorage.setItem('sl_user', JSON.stringify(u));\n      salonLinkAfterLogin(res.data.token, u, 'email');\n      showToast('Welcome back, ' + u.name + ' \\u2726', 'success');"
    )
    .replace(
      "localStorage.setItem('sl_user', JSON.stringify(u));\n      showToast('Welcome to SalonLink \\u2726', 'success');",
      "localStorage.setItem('sl_user', JSON.stringify(u));\n      salonLinkAfterLogin(res.data.token, u, 'phone');\n      showToast('Welcome to SalonLink \\u2726', 'success');"
    )
}

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
// Do not enable strict secureHeaders yet. This build relies on inline scripts, inline click handlers,
// CDN scripts, dynamic client-side UI, and maps. A strict default CSP blocks those scripts and makes
// admin/provider pages feel static.

// API routes
app.route('/api/auth', authRoutes)
app.route('/api/providers', providerRoutes)
app.route('/api/bookings', bookingRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/reviews', reviewRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/uploads', uploadRoutes)
app.route('/api/notifications', notificationRoutes)
app.route('/api/sms', smsRoutes)
app.route('/api/analytics', analyticsRoutes)

// Frontend pages
app.get('/', (c) => c.html(homePage()))
app.get('/login', (c) => c.html(loginPageWithSmsAndAnalytics()))
app.get('/register', (c) => c.html(registerPage()))
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/provider/dashboard', (c) => c.html(repairInlineScriptText(providerDashboardPage())))
app.get('/provider/onboarding', (c) => c.html(onboardingPage()))
app.get('/discover', (c) => c.html(discoveryPage()))
app.get('/provider/:id', (c) => c.html(providerProfilePage(c.req.param('id'))))
app.get('/book/:id', (c) => c.html(bookingPage(c.req.param('id'))))
app.get('/admin', (c) => c.html(withAdminKycDocumentViewer(repairInlineScriptText(adminPanelPage()))))
app.get('/hairstyle-history', (c) => c.html(hairstyleHistoryPage()))
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/notifications', (c) => c.html(notificationsPage()))
app.get('/payment/pay', (c) => c.html(paymentPage()))
app.get('/payment/success', (c) => c.html(paymentSuccessPage()))

// Health check
app.get('/api/health', (c) => c.json({
  status: 'ok',
  app: 'SalonLink',
  version: '2.0.3-kyc-viewer',
  db: 'D1 Connected',
  timestamp: new Date().toISOString()
}))

// 404 fallback
app.notFound((c) => c.html(homePage()))

export default app
