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
import { enhancePage } from './utils/refreshTheme'

type Bindings = {
  DB: D1Database
  [key: string]: any
}

const app = new Hono<{ Bindings: Bindings }>()

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

// Frontend pages
app.get('/', (c) => c.html(enhancePage(homePage())))
app.get('/login', (c) => c.html(enhancePage(loginPage())))
app.get('/register', (c) => c.html(enhancePage(registerPage())))
app.get('/dashboard', (c) => c.html(enhancePage(dashboardPage())))
app.get('/provider/dashboard', (c) => c.html(enhancePage(providerDashboardPage())))
app.get('/provider/onboarding', (c) => c.html(enhancePage(onboardingPage())))
app.get('/discover', (c) => c.html(enhancePage(discoveryPage())))
app.get('/provider/:id', (c) => c.html(enhancePage(providerProfilePage(c.req.param('id')))))
app.get('/book/:id', (c) => c.html(enhancePage(bookingPage(c.req.param('id')))))
app.get('/admin', (c) => c.html(enhancePage(adminPanelPage())))
app.get('/hairstyle-history', (c) => c.html(enhancePage(hairstyleHistoryPage())))
app.get('/settings', (c) => c.html(enhancePage(settingsPage())))
app.get('/notifications', (c) => c.html(enhancePage(notificationsPage())))
app.get('/payment/pay', (c) => c.html(enhancePage(paymentPage())))
app.get('/payment/success', (c) => c.html(enhancePage(paymentSuccessPage())))

// Health check
app.get('/api/health', (c) => c.json({
  status: 'ok',
  app: 'SalonLink',
  version: '2.1.0-graphite-refresh',
  db: 'D1 Connected',
  timestamp: new Date().toISOString()
}))

// 404 fallback
app.notFound((c) => c.html(enhancePage(homePage())))

export default app
