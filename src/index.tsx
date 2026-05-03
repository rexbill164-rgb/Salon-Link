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
import { repairInlineScriptText } from './utils/generatedScriptRepairs'

type Bindings = {
  DB: D1Database
  [key: string]: any
}

const app = new Hono<{ Bindings: Bindings }>()

function withAdminKycViewer(html: string): string {
  const script = `
<script id="admin-kyc-viewer-now">
(function(){
  if (location.pathname !== '/admin') return;

  function getToken(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || localStorage.getItem('auth_token') || ''; }
  function showToastSafe(msg, type){ if (typeof window.showToast === 'function') window.showToast(msg, type || 'info'); else console.log('[SalonLink]', msg); }
  function esc(s){ return String(s || '').replace(/[&<>\"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[c]; }); }

  function imageBlock(title, value){
    var img = value && String(value).trim();
    if (!img) {
      return '<div style="border:1px dashed #ddd;border-radius:16px;padding:18px;background:#fafafa;min-height:120px;display:flex;align-items:center;justify-content:center;text-align:center;color:#777;font-size:12px;"><div><strong>'+title+'</strong><br/>Not uploaded</div></div>';
    }
    return '<div style="border:1px solid #eee;border-radius:16px;padding:12px;background:#fff;overflow:hidden;">'+
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#777;margin-bottom:10px;">'+title+'</div>'+
      '<img src="'+esc(img)+'" alt="'+title+'" style="width:100%;max-height:340px;object-fit:contain;border-radius:12px;background:#f7f7f7;display:block;"/>'+
      '<a href="'+esc(img)+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;font-size:12px;color:#111;font-weight:700;">Open full image</a>'+
    '</div>';
  }

  window.openKycDocuments = async function(providerId){
    if (!providerId) { showToastSafe('Provider ID missing', 'error'); return; }
    var token = getToken();
    if (!token) { showToastSafe('Admin login required', 'error'); return; }

    var modal = document.getElementById('kyc-doc-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kyc-doc-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:999999;display:none;align-items:center;justify-content:center;padding:20px;';
      modal.innerHTML = '<div style="background:#fff;border-radius:24px;max-width:980px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 30px 90px rgba(0,0,0,.35);"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 24px;border-bottom:1px solid #eee;"><div><div style="font-size:18px;font-weight:900;color:#111;">KYC Documents</div><div id="kyc-doc-sub" style="font-size:12px;color:#777;margin-top:2px;">Loading...</div></div><button onclick="document.getElementById(\'kyc-doc-modal\').style.display=\'none\'" style="width:38px;height:38px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:20px;">×</button></div><div id="kyc-doc-body" style="padding:22px;">Loading...</div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function(e){ if (e.target === modal) modal.style.display = 'none'; });
    }

    modal.style.display = 'flex';
    document.getElementById('kyc-doc-sub').textContent = 'Provider #' + providerId;
    document.getElementById('kyc-doc-body').innerHTML = '<div style="padding:30px;text-align:center;color:#777;">Loading documents...</div>';

    try {
      var res = await fetch('/api/admin/providers/' + encodeURIComponent(providerId) + '/kyc-images', { headers: { Authorization: 'Bearer ' + token } });
      var data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not load KYC documents');
      var img = data.images || {};
      document.getElementById('kyc-doc-sub').textContent = 'Ghana Card: ' + (img.kyc_card_number ? img.kyc_card_number : 'Not provided');
      document.getElementById('kyc-doc-body').innerHTML =
        '<div style="background:#f8f8f8;border:1px solid #eee;border-radius:16px;padding:14px;margin-bottom:18px;font-size:13px;color:#333;"><strong>Ghana Card Number:</strong> '+esc(img.kyc_card_number || 'Not provided')+'</div>'+
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">'+
          imageBlock('Ghana Card Front', img.kyc_front_url)+
          imageBlock('Ghana Card Back', img.kyc_back_url)+
          imageBlock('Selfie / Face Photo', img.kyc_selfie_url)+
        '</div>';
    } catch(err) {
      document.getElementById('kyc-doc-body').innerHTML = '<div style="padding:24px;border:1px solid #f2caca;background:#fff5f5;border-radius:16px;color:#9b1c1c;">'+esc(err.message || err)+'</div>';
    }
  };

  function providerIdFromRow(row){
    var btn = row.querySelector('[onclick*="kyc"], [onclick*="Provider"], [onclick*="provider"]');
    var text = btn ? btn.getAttribute('onclick') || '' : row.innerHTML;
    var match = text.match(/(?:provider|kyc|approve|reject)[^0-9]*(\d+)/i) || text.match(/\b(\d{1,8})\b/);
    return match ? match[1] : '';
  }

  function addButtons(){
    var tbody = document.getElementById('kyc-tbody');
    if (!tbody) return;
    Array.prototype.slice.call(tbody.querySelectorAll('tr')).forEach(function(row){
      if (row.dataset.kycViewerAdded === '1') return;
      if ((row.textContent || '').toLowerCase().includes('loading')) return;
      var providerId = row.getAttribute('data-provider-id') || providerIdFromRow(row);
      if (!providerId) return;
      row.dataset.kycViewerAdded = '1';
      var cell = row.querySelector('td:last-child') || row.insertCell(-1);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'View Documents';
      btn.style.cssText = 'margin:4px;padding:8px 12px;border-radius:999px;border:1px solid #111;background:#111;color:#fff;font-size:11px;font-weight:800;cursor:pointer;';
      btn.onclick = function(){ window.openKycDocuments(providerId); };
      cell.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    addButtons();
    var tbody = document.getElementById('kyc-tbody');
    if (tbody) new MutationObserver(addButtons).observe(tbody, { childList:true, subtree:true });
    document.addEventListener('click', function(e){ setTimeout(addButtons, 500); }, true);
  });
})();
</script>`;
  return html.includes('</body>') ? html.replace('</body>', script + '</body>') : html + script;
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
app.get('/', (c) => c.html(homePage()))
app.get('/login', (c) => c.html(loginPage()))
app.get('/register', (c) => c.html(registerPage()))
app.get('/dashboard', (c) => c.html(dashboardPage()))
app.get('/provider/dashboard', (c) => c.html(repairInlineScriptText(providerDashboardPage())))
app.get('/provider/onboarding', (c) => c.html(onboardingPage()))
app.get('/discover', (c) => c.html(discoveryPage()))
app.get('/provider/:id', (c) => c.html(providerProfilePage(c.req.param('id'))))
app.get('/book/:id', (c) => c.html(bookingPage(c.req.param('id'))))
app.get('/admin', (c) => c.html(withAdminKycViewer(repairInlineScriptText(adminPanelPage()))))
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
