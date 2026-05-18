export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <title>${title} | SalonLink</title>
  <meta name="description" content="SalonLink — Ghana's beauty booking app. Find, book and manage salon appointments."/>
  <link rel="manifest" href="/manifest.json?v=2"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2"/>
  <meta name="theme-color" content="#111111"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--c-void:#fff;--c-deep:#f8f8f8;--c-dark:#f2f2f2;--c-mid:#ebebeb;--c-surface:#fff;--c-raise:#fafafa;--g-main:#111;--g-deep:#000;--g-light:#444;--g-dim:rgba(0,0,0,.05);--g-border:rgba(0,0,0,.14);--i-faint:rgba(26,26,26,.08);--i-ghost:rgba(26,26,26,.04);--t-primary:#1a1a1a;--t-secondary:#4a4a4a;--t-muted:#8a8a8a;--s-green:#00c853;--s-red:#ff3b30;--s-amber:#ff9500;--r-md:14px;--r-lg:20px;--r-xl:28px;--ease-luxury:cubic-bezier(.16,1,.3,1)}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;touch-action:manipulation}input,textarea,select{font-size:16px!important}
    body{font-family:'Poppins','Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--c-void);color:var(--t-primary);min-height:100vh;overflow-x:hidden;width:100%;max-width:100vw;-webkit-font-smoothing:antialiased;font-size:15px}
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 20px}@media(max-width:900px){body{font-size:13px;padding-bottom:100px}.container{padding:0 16px}.hide-mob{display:none!important}}@media(min-width:901px){.hide-desk{display:none!important}}
    .display-hero{font-size:clamp(30px,5.3vw,52px);font-weight:800;line-height:1.08}.display-xl{font-size:clamp(26px,4.2vw,40px);font-weight:700}.display-lg{font-size:clamp(21px,3vw,30px);font-weight:700}.display-md{font-size:clamp(17px,2.2vw,23px);font-weight:600}.display-sm{font-size:17px;font-weight:600}.font-display{font-family:'Poppins',sans-serif}.gold,.gold-gradient{color:var(--g-main)}.eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--g-main)}
    .card,.surface,.surface-raise,.surface-gold{background:var(--c-surface);border:1px solid var(--i-faint)}.card{border-radius:var(--r-xl);overflow:hidden}.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--g-main);color:#fff;font-size:12px;font-weight:700;border:none;border-radius:100px;padding:12px 24px;cursor:pointer;text-decoration:none}.btn-ghost,.btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--i-ghost);color:var(--t-secondary);font-size:12px;font-weight:500;border:1px solid var(--i-faint);border-radius:100px;padding:10px 20px;cursor:pointer;text-decoration:none}.btn-icon{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;background:var(--i-ghost);border:1px solid var(--i-faint);border-radius:50%;color:var(--t-secondary);cursor:pointer;text-decoration:none;flex-shrink:0}
    .input{width:100%;background:var(--c-raise);border:1.5px solid var(--i-faint);border-radius:var(--r-md);padding:13px 15px;color:var(--t-primary);font-family:'Poppins',sans-serif;font-size:14px;outline:none}.input-search{background:var(--c-raise);border:1.5px solid transparent;border-radius:100px;padding:13px 20px 13px 46px;font-size:13px;width:100%}.badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;font-size:10px;font-weight:600;white-space:nowrap}.badge-verified{background:rgba(0,200,83,.10);color:var(--s-green);border:1px solid rgba(0,200,83,.20)}.badge-pending{background:rgba(255,149,0,.10);color:var(--s-amber);border:1px solid rgba(255,149,0,.20)}.badge-gold{background:var(--g-dim);color:var(--g-main);border:1px solid var(--g-border)}
    .nav-main{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,.94);backdrop-filter:blur(28px);border-bottom:1px solid var(--i-faint)}.nav-link{color:var(--t-secondary);text-decoration:none;font-size:13px;font-weight:500;padding:8px 14px;border-radius:100px}.nav-link:hover,.nav-link.active{color:var(--g-main);background:var(--g-dim)}.mobile-nav{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:420px;background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.6);border-radius:28px;padding:8px;display:flex;justify-content:space-around;gap:4px;z-index:900;box-shadow:0 8px 40px rgba(0,0,0,.16)}.mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 3px;border-radius:20px;color:var(--t-muted);text-decoration:none;font-size:8px;font-weight:600;letter-spacing:.02em}.mobile-nav-item i{font-size:14px}.mobile-nav-item.active{color:var(--g-main);background:var(--g-dim)}.mobile-nav-item.primary{background:var(--g-main);color:#fff;margin-top:-28px;width:64px;height:64px;flex:0 0 64px;border-radius:50%;justify-content:center}.mobile-nav-item.primary i{font-size:15px}.mobile-nav-item.primary span{font-size:10px}@media(min-width:901px){.mobile-nav{display:none}}
    @media(max-width:900px){h1{font-size:clamp(28px,8vw,42px)!important;line-height:1.1!important}h2{font-size:clamp(24px,6.8vw,36px)!important;line-height:1.15!important}h3{font-size:clamp(18px,5vw,24px)!important}.card-provider h3,.provider-card h3{font-size:18px!important}.card-provider,.provider-card{font-size:13px!important}.search-title,.hero-title{font-size:clamp(30px,8.4vw,44px)!important}}
    .step-node{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;background:var(--c-dark);color:var(--t-muted)}.step-node.active,.step-node.done{background:var(--g-main);color:#fff}.step-line{height:2px;background:var(--i-faint)}.divider{height:1px;background:var(--i-faint);width:100%}
  </style>
  ${extra}
`

export const navbar = (active = '') => {
  const navItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'discover', label: 'Discover', href: '/discover' },
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  ]
  return `<nav class="nav-main" aria-label="Primary navigation"><div class="container" style="height:72px;display:flex;align-items:center;justify-content:space-between;gap:18px;"><a href="/" aria-label="SalonLink home" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--t-primary);font-weight:900;font-size:20px;letter-spacing:-0.04em;"><span style="width:34px;height:34px;border-radius:12px;background:#111;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;box-shadow:0 6px 18px rgba(0,0,0,0.18);">SL</span><span>Salon<em style="font-style:italic;font-weight:700;">Link</em></span></a><div class="hide-mob" style="display:flex;align-items:center;gap:4px;">${navItems.map(item => `<a class="nav-link ${active === item.key ? 'active' : ''}" href="${item.href}">${item.label}</a>`).join('')}</div><div id="nav-auth" style="display:flex;align-items:center;gap:10px;"><a href="/login" class="btn-ghost" style="font-size:12px;padding:9px 18px;">Sign in</a><a href="/register" class="btn-primary hide-mob" style="font-size:12px;padding:10px 20px;">Join</a></div></div></nav><div style="height:72px;"></div>`
}

export const mobileNav = (active = '') => {
  const items = [
    { key: 'home', label: 'Home', href: '/', icon: 'fa-house' },
    { key: 'discover', label: 'Discover', href: '/discover', icon: 'fa-magnifying-glass' },
    { key: 'dashboard', label: 'Book', href: '/dashboard', icon: 'fa-calendar-plus', primary: true },
    { key: 'messages', label: 'Messages', href: '/messages', icon: 'fa-message' },
    { key: 'settings', label: 'Settings', href: '/settings', icon: 'fa-gear' },
  ]
  return `<nav class="mobile-nav" aria-label="Mobile navigation">${items.map(item => `<a class="mobile-nav-item ${item.primary ? 'primary' : ''} ${active === item.key ? 'active' : ''}" href="${item.href}" aria-label="${item.label}"><i class="fas ${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`).join('')}</nav>`
}

export const globalScripts = () => `
<script id="salonlink-global-scripts">
(function(){
  function s(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function h(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c})}
  window.showToast=window.showToast||function(m,t){var d=document.createElement('div');d.textContent=String(m||'');d.style.cssText='position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:99999;max-width:92vw;padding:12px 16px;border-radius:999px;background:'+(t==='error'?'#B42318':'#111')+';color:white;font:600 13px Poppins,Arial;box-shadow:0 12px 30px rgba(0,0,0,.2)';document.body.appendChild(d);setTimeout(function(){d.remove()},3200)};
  window.logout=window.logout||function(){try{['sl_token','sl_user','token','user'].forEach(function(k){localStorage.removeItem(k)})}catch(e){} location.href='/login'};
  function token(){return s('sl_token')||s('token')||''} window.getSalonLinkToken=window.getSalonLinkToken||token;
  function user(){var r=s('sl_user')||s('user');if(!r)return null;try{return JSON.parse(r)}catch(e){return null}}
  function nav(){var n=document.getElementById('nav-auth'),u=user();if(!n||!u||!token())return;var r=u.role||'customer',d=r==='admin'?'/admin':(r==='provider'?'/provider/dashboard':'/dashboard'),name=u.first_name||u.firstName||u.business_name||u.email||'Account';n.innerHTML='<a href="'+d+'" class="btn-ghost" style="font-size:12px;padding:9px 16px;text-decoration:none;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+h(name)+'</a><button onclick="logout()" class="btn-primary" style="font-size:12px;padding:10px 18px;">Sign out</button>'}
  function launchCopy(){var map={'Pay Now':'Pay at salon','Pay with Paystack':'Payment Unavailable','Confirm & Pay':'Confirm Cash Booking','Send MoMo Prompt':'Payment Unavailable','Payments secured by Paystack':'Manual/offline payment at salon','Powered by Paystack':'Payment handled at salon','Secure your slot instantly with MoMo or Card':'Payment is handled manually/offline at the salon','Secure card payment':'Online payment temporarily unavailable'};var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);var a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(function(n){var v=n.nodeValue||'';Object.keys(map).forEach(function(k){v=v.split(k).join(map[k])});n.nodeValue=v});['payment-methods','momo-input'].forEach(function(id){var e=document.getElementById(id);if(e)e.style.display='none'});var b=document.getElementById('pm-momo-btn');if(b){b.disabled=true;b.textContent='Payment Unavailable'}}
  if(window.axios&&window.axios.interceptors){window.axios.interceptors.request.use(function(c){var t=token();if(t){c.headers=c.headers||{};if(!c.headers.Authorization)c.headers.Authorization='Bearer '+t}return c})}
  function init(){nav();launchCopy();setTimeout(launchCopy,350)} if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
</script>`