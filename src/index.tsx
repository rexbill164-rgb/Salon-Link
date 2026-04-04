import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

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
import { adminPanelPage } from './pages/admin'
import { onboardingPage } from './pages/onboarding'
import { hairstyleHistoryPage } from './pages/hairstyleHistory'
import { settingsPage } from './pages/settings'
import { notificationsPage } from './pages/notifications'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', secureHeaders())

// Static files
app.use('/static/*', async (c, next) => {
  await next()
})

// ─── API ROUTES ──────────────────────────────────────────
app.route('/api/auth', authRoutes)
app.route('/api/providers', providerRoutes)
app.route('/api/bookings', bookingRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/reviews', reviewRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/uploads', uploadRoutes)
app.route('/api/notifications', notificationRoutes)

// ─── FRONTEND PAGES ───────────────────────────────────────
app.get('/', (c) => c.html(homePage()))
app.get('/login', (c) => c.html(loginPage()))
app.get('/register', (c) => c.html(registerPage()))
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/provider/dashboard', (c) => c.html(providerDashboardPage()))
app.get('/provider/onboarding', (c) => c.html(onboardingPage()))
app.get('/discover', (c) => c.html(discoveryPage()))
app.get('/provider/:id', (c) => c.html(providerProfilePage()))
app.get('/book/:id', (c) => c.html(bookingPage()))
app.get('/admin', (c) => c.html(adminPanelPage()))
app.get('/hairstyle-history', (c) => c.html(hairstyleHistoryPage()))
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/notifications', (c) => c.html(notificationsPage()))

// Health check
app.get('/api/health', (c) => c.json({ 
  status: 'ok', 
  app: 'SalonLink', 
  version: '1.0.0',
  timestamp: new Date().toISOString()
}))

// 404 fallback
app.notFound((c) => c.html(homePage()))

export default app
