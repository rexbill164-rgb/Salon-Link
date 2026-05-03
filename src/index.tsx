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
import { withPremiumTheme } from './utils/premiumTheme'

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

type Bindings = {
  DB: D1Database
  [key: string]: any
}

const app = new Hono<{ Bindings: Bindings }>()

function withInteractionFixes(html: string): string {
  const script = '<script src="/admin-provider-fix.js?v=1" defer></script>'
  return html.includes('</body>') ? html.replace('</body>', script + '</body>') : html + script
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

// Frontend pages
app.get('/', (c) => c.html(withPremiumTheme(homePage(), 'home')))
app.get('/login', (c) => c.html(withPremiumTheme(loginPage(), 'login')))
app.get('/register', (c) => c.html(withPremiumTheme(registerPage(), 'register')))
app.get('/dashboard', (c) => c.html(withPremiumTheme(dashboardPage(), 'dashboard')))
app.get('/provider/dashboard', (c) => c.html(withInteractionFixes(withPremiumTheme(providerDashboardPage(), 'provider-dashboard'))))
app.get('/provider/onboarding', (c) => c.html(withPremiumTheme(onboardingPage(), 'provider-onboarding')))
app.get('/discover', (c) => c.html(withPremiumTheme(discoveryPage(), 'discover')))
app.get('/provider/:id', (c) => c.html(withInteractionFixes(withPremiumTheme(providerProfilePage(c.req.param('id')), 'provider-profile'))))
app.get('/book/:id', (c) => c.html(withPremiumTheme(bookingPage(c.req.param('id')), 'booking')))
app.get('/admin', (c) => c.html(withInteractionFixes(withPremiumTheme(adminPanelPage(), 'admin'))))
app.get('/hairstyle-history', (c) => c.html(withPremiumTheme(hairstyleHistoryPage(), 'hairstyle-history')))
app.get('/settings', (c) => c.html(withPremiumTheme(settingsPage(), 'settings')))
app.get('/notifications', (c) => c.html(withPremiumTheme(notificationsPage(), 'notifications')))
app.get('/payment/pay', (c) => c.html(withPremiumTheme(paymentPage(), 'payment')))
app.get('/payment/success', (c) => c.html(withPremiumTheme(paymentSuccessPage(), 'payment-success')))

// Health check
app.get('/api/health', (c) => c.json({
  status: 'ok',
  app: 'SalonLink',
  version: '2.0.2-interaction-fix',
  db: 'D1 Connected',
  timestamp: new Date().toISOString()
}))

// 404 fallback
app.notFound((c) => c.html(withPremiumTheme(homePage(), 'home')))

export default app
