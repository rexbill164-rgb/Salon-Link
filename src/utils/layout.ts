export const COLORS = {
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#EDE9FE',
  secondary: '#F59E0B',
  accent: '#EC4899',
  dark: '#0F0A1E',
  darkCard: '#1A1033',
  darkBorder: '#2D2250',
  text: '#E2D9F3',
  textMuted: '#9D8EC0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
}

export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | SalonLink</title>
  <meta name="description" content="SalonLink – Book beauty services near you. Discover salons, barbers, nail techs and more."/>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✂️</text></svg>"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { DEFAULT: '#7C3AED', dark: '#5B21B6', light: '#EDE9FE' },
            salon: { dark: '#0F0A1E', card: '#1A1033', border: '#2D2250', text: '#E2D9F3', muted: '#9D8EC0' }
          },
          fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Poppins', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0F0A1E; color: #E2D9F3; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #1A1033; }
    ::-webkit-scrollbar-thumb { background: #7C3AED; border-radius: 3px; }
    .glass { background: rgba(124,58,237,0.08); backdrop-filter: blur(20px); border: 1px solid rgba(124,58,237,0.2); }
    .glass-dark { background: rgba(26,16,51,0.9); backdrop-filter: blur(20px); border: 1px solid rgba(45,34,80,0.8); }
    .gradient-text { background: linear-gradient(135deg, #7C3AED, #EC4899, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .gradient-btn { background: linear-gradient(135deg, #7C3AED, #5B21B6); transition: all 0.3s; }
    .gradient-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,58,237,0.4); }
    .card-hover { transition: all 0.3s; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(124,58,237,0.2); }
    .pulse-dot { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .slide-up { animation: slideUp 0.5s ease-out; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .star-rating span { color: #F59E0B; }
    .nav-link { transition: all 0.2s; }
    .nav-link:hover { color: #7C3AED; }
    .nav-link.active { color: #7C3AED; }
    input, select, textarea { background: #1A1033 !important; border-color: #2D2250 !important; color: #E2D9F3 !important; }
    input::placeholder, textarea::placeholder { color: #9D8EC0 !important; }
    input:focus, select:focus, textarea:focus { border-color: #7C3AED !important; outline: none !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.2) !important; }
    .badge-verified { background: linear-gradient(135deg, #10B981, #059669); }
    .badge-pending { background: linear-gradient(135deg, #F59E0B, #D97706); }
    .sidebar { width: 260px; min-height: 100vh; background: #1A1033; border-right: 1px solid #2D2250; }
    .main-content { flex: 1; min-height: 100vh; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .modal-box { background: #1A1033; border: 1px solid #2D2250; border-radius: 20px; max-width: 500px; width: 90%; padding: 32px; position: relative; }
    .toast { position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 280px; padding: 16px 20px; border-radius: 12px; font-weight: 500; animation: slideInRight 0.3s ease; }
    @keyframes slideInRight { from{opacity:0;transform:translateX(100px)} to{opacity:1;transform:translateX(0)} }
    .booking-step { display: none; }
    .booking-step.active { display: block; }
    .step-indicator.active { background: #7C3AED; color: white; }
    .step-indicator.done { background: #10B981; color: white; }
    .provider-card { background: #1A1033; border: 1px solid #2D2250; border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; }
    .provider-card:hover { border-color: #7C3AED; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(124,58,237,0.15); }
    .stat-card { background: linear-gradient(135deg, #1A1033, #2D2250); border: 1px solid #2D2250; border-radius: 16px; }
    .tag { display: inline-block; background: rgba(124,58,237,0.2); color: #C4B5FD; border: 1px solid rgba(124,58,237,0.3); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 500; }
    @media (max-width: 768px) { .sidebar { display: none; } .mobile-nav { display: flex !important; } }
  </style>
  ${extra}
`

export const navbar = (activePage = '') => `
<nav class="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-salon-border" style="border-color:#2D2250">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center text-lg">✂️</div>
        <span class="font-display font-bold text-xl gradient-text">SalonLink</span>
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="/discover" class="nav-link text-sm font-medium ${activePage==='discover'?'text-primary-DEFAULT':'text-salon-muted'}">
          <i class="fas fa-compass mr-1"></i> Discover
        </a>
        <a href="/dashboard" class="nav-link text-sm font-medium ${activePage==='dashboard'?'text-primary-DEFAULT':'text-salon-muted'}">
          <i class="fas fa-calendar mr-1"></i> Bookings
        </a>
        <a href="/notifications" class="nav-link text-sm font-medium ${activePage==='notifications'?'text-primary-DEFAULT':'text-salon-muted'} relative">
          <i class="fas fa-bell mr-1"></i> Alerts
          <span class="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white" id="notif-badge">3</span>
        </a>
      </div>
      <div class="flex items-center gap-3" id="nav-auth-section">
        <a href="/login" class="text-sm font-medium text-salon-muted hover:text-white transition">Login</a>
        <a href="/register" class="gradient-btn px-4 py-2 rounded-xl text-sm font-semibold text-white">Get Started</a>
      </div>
    </div>
  </div>
</nav>
<div class="h-16"></div>
`

export const mobileNav = (activePage = '') => `
<div class="mobile-nav fixed bottom-0 left-0 right-0 z-50 hidden" style="background:#1A1033;border-top:1px solid #2D2250">
  <div class="flex items-center justify-around py-2">
    <a href="/" class="flex flex-col items-center gap-1 p-2 ${activePage==='home'?'text-primary-DEFAULT':'text-salon-muted'}">
      <i class="fas fa-home text-lg"></i><span class="text-xs">Home</span>
    </a>
    <a href="/discover" class="flex flex-col items-center gap-1 p-2 ${activePage==='discover'?'text-primary-DEFAULT':'text-salon-muted'}">
      <i class="fas fa-search text-lg"></i><span class="text-xs">Discover</span>
    </a>
    <a href="/book" class="flex flex-col items-center gap-1 p-2">
      <div class="w-12 h-12 gradient-btn rounded-full flex items-center justify-center -mt-4 shadow-lg">
        <i class="fas fa-plus text-white text-xl"></i>
      </div>
    </a>
    <a href="/dashboard" class="flex flex-col items-center gap-1 p-2 ${activePage==='dashboard'?'text-primary-DEFAULT':'text-salon-muted'}">
      <i class="fas fa-calendar text-lg"></i><span class="text-xs">Bookings</span>
    </a>
    <a href="/settings" class="flex flex-col items-center gap-1 p-2 ${activePage==='settings'?'text-primary-DEFAULT':'text-salon-muted'}">
      <i class="fas fa-user text-lg"></i><span class="text-xs">Profile</span>
    </a>
  </div>
</div>
`

export const toastScript = () => `
<script>
function showToast(msg, type='success') {
  const colors = { success:'#10B981', error:'#EF4444', info:'#3B82F6', warning:'#F59E0B' };
  const icons = { success:'check-circle', error:'times-circle', info:'info-circle', warning:'exclamation-triangle' };
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.background = colors[type]+'22';
  t.style.border = '1px solid '+colors[type]+'44';
  t.style.color = '#fff';
  t.innerHTML = '<i class="fas fa-'+icons[type]+'" style="color:'+colors[type]+';margin-right:8px"></i>'+msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(100px)'; setTimeout(()=>t.remove(),300); }, 3500);
}
function getToken() { return localStorage.getItem('salonlink_token'); }
function getUser() { try { return JSON.parse(localStorage.getItem('salonlink_user')||'{}'); } catch(e){return{};} }
function isLoggedIn() { return !!getToken(); }
function logout() { localStorage.removeItem('salonlink_token'); localStorage.removeItem('salonlink_user'); window.location.href='/login'; }
// Update nav based on auth state
document.addEventListener('DOMContentLoaded', function() {
  const user = getUser();
  const token = getToken();
  const authSection = document.getElementById('nav-auth-section');
  if (token && user && user.name && authSection) {
    const role = user.role;
    authSection.innerHTML = \`
      <a href="/notifications" class="relative p-2 text-salon-muted hover:text-white">
        <i class="fas fa-bell text-lg"></i>
        <span class="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
      </a>
      <div class="relative group">
        <button class="flex items-center gap-2 p-1">
          <div class="w-9 h-9 rounded-full gradient-btn flex items-center justify-center text-white font-bold text-sm">\${user.name[0].toUpperCase()}</div>
          <span class="text-sm font-medium hidden md:block">\${user.name.split(' ')[0]}</span>
          <i class="fas fa-chevron-down text-xs text-salon-muted hidden md:block"></i>
        </button>
        <div class="absolute right-0 top-12 w-48 glass-dark rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto" style="border:1px solid #2D2250">
          <div class="p-2">
            \${role==='provider'?'<a href="/provider/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-900 text-sm"><i class="fas fa-store w-4"></i> Provider Dashboard</a>':''}
            \${role==='admin'?'<a href="/admin" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-900 text-sm"><i class="fas fa-shield-alt w-4"></i> Admin Panel</a>':''}
            <a href="/dashboard" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-900 text-sm"><i class="fas fa-calendar w-4"></i> My Bookings</a>
            <a href="/hairstyle-history" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-900 text-sm"><i class="fas fa-images w-4"></i> Style History</a>
            <a href="/settings" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-900 text-sm"><i class="fas fa-cog w-4"></i> Settings</a>
            <hr style="border-color:#2D2250;margin:4px 0"/>
            <button onclick="logout()" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900 text-sm text-red-400 w-full"><i class="fas fa-sign-out-alt w-4"></i> Logout</button>
          </div>
        </div>
      </div>
    \`;
  }
});
</script>
`
