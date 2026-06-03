export function withProviderBlueUi(html: string): string {
  if (html.includes('provider-blue-ui-style')) return html

  const patch = `
<style id="provider-blue-ui-style">
  :root { --sl-blue:#2563eb; --sl-blue-soft:#eef4ff; --sl-blue-border:#dbeafe; }

  @supports (padding-top: env(safe-area-inset-top)) {
    .topbar {
      padding-top: calc(env(safe-area-inset-top) + 12px) !important;
      min-height: calc(env(safe-area-inset-top) + 62px) !important;
      align-items:flex-end !important;
      padding-bottom:12px !important;
    }
  }
  .topbar {
    background:rgba(255,255,255,.98) !important;
    border-bottom:1px solid #eef2f7 !important;
    box-shadow:0 4px 18px rgba(15,23,42,.04) !important;
  }
  .main-wrap { background:#fafafa !important; }

  .sidebar > div:first-child {
    background:#ffffff !important;
    border-bottom:1px solid #eef2f7 !important;
    padding:18px 16px !important;
  }
  .sidebar > div:first-child a > div:first-child {
    width:42px !important;
    height:42px !important;
    border-radius:14px !important;
    background:linear-gradient(135deg,#2563eb,#60a5fa) !important;
    box-shadow:0 10px 24px rgba(37,99,235,.22) !important;
  }
  .sidebar > div:first-child a > span {
    font-family:Inter,Arial,sans-serif !important;
    font-size:20px !important;
    font-weight:900 !important;
    letter-spacing:-.04em !important;
    color:#111827 !important;
    background:none !important;
    -webkit-text-fill-color:#111827 !important;
  }

  .sidebar .sidebar-item {
    display:flex !important;
    align-items:center !important;
    gap:12px !important;
    width:100% !important;
    padding:12px 12px !important;
    border-radius:16px !important;
    border:1px solid transparent !important;
    background:transparent !important;
    color:#334155 !important;
    font-size:13px !important;
    font-weight:700 !important;
    line-height:1.2 !important;
    text-align:left !important;
    margin-bottom:6px !important;
    white-space:normal !important;
  }
  .sidebar .sidebar-item:hover,
  .sidebar .sidebar-item.active {
    background:#eff6ff !important;
    border-color:#dbeafe !important;
    color:#1d4ed8 !important;
  }
  .sidebar .sidebar-item .icon {
    width:38px !important;
    height:38px !important;
    min-width:38px !important;
    border-radius:13px !important;
    background:#eef4ff !important;
    color:#2563eb !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size:0 !important;
    box-shadow:none !important;
  }
  .sidebar .sidebar-item .icon svg,
  .sl-clean-icon svg { width:18px !important; height:18px !important; stroke:currentColor !important; }
  .sidebar .sidebar-item.active .icon {
    background:#2563eb !important;
    color:#ffffff !important;
  }
  .sidebar nav { padding:12px 10px !important; }

  #sb-avatar {
    background:#f8fafc !important;
    border:1px solid #dbeafe !important;
    color:#2563eb !important;
    overflow:hidden !important;
  }
  #sb-avatar img { width:100% !important; height:100% !important; object-fit:cover !important; display:block !important; }

  .sl-clean-icon,
  .kpi-card > div:first-child,
  .card button > div:first-child {
    width:42px !important;
    height:42px !important;
    border-radius:14px !important;
    background:#eef4ff !important;
    color:#2563eb !important;
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size:0 !important;
    margin-bottom:10px !important;
  }
  .kpi-card > div:first-child svg,
  .sl-clean-icon svg { width:20px !important; height:20px !important; stroke:currentColor !important; }
  /* Mobile bottom nav icon sizing */
  .mob-nav-item span:first-child { display:flex !important; align-items:center !important; justify-content:center !important; font-size:0 !important; }
  .mob-nav-item span:first-child svg { width:20px !important; height:20px !important; stroke:currentColor !important; display:block !important; }
  .mob-nav-item.active span:first-child svg { stroke:var(--g-main) !important; }
  .card button:not(.sl-gallery-delete-btn):not(.sl-svc-action-btn) {
    border-radius:18px !important;
    border:1px solid #eef2f7 !important;
    background:#fff !important;
  }
  .card button:not(.sl-gallery-delete-btn):not(.sl-svc-action-btn):hover { background:#f8fafc !important; border-color:#dbeafe !important; }
  .sl-gallery-delete-btn {
    background:rgba(220,38,38,0.85) !important;
    border:2px solid rgba(255,255,255,0.7) !important;
    color:#fff !important;
    border-radius:50% !important;
  }

  /* Keep the Leaflet map (zoom control z-index ~1000) from painting over the side drawer */
  #location-picker-map { isolation:isolate !important; position:relative !important; z-index:0 !important; }
  .sidebar { z-index:1200 !important; }
  .sidebar-overlay { z-index:1199 !important; }

  @media(max-width:768px){
    body { padding-top:0 !important; }
    .sidebar { width:260px !important; }
    .sidebar .sidebar-item { font-size:13px !important; }
    .sidebar .sidebar-item .icon { width:36px !important; height:36px !important; min-width:36px !important; }
    .content-pad { padding-top:16px !important; }
  }
</style>
<script id="provider-blue-ui-script">
(function(){
  if(location.pathname !== '/provider/dashboard') return;
  var icons = {
    overview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 13h6v7H4zM14 4h6v16h-6zM4 4h6v5H4z"/></svg>',
    appts:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
    services:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20l16-16M9 4l11 11M4 9l11 11"/></svg>',
    gallery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
    location:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2"/></svg>',
    reviews:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 7 .9-5 4.8 1.2 6.8L12 17l-6.2 3.5L7 13.7 2 8.9 9 8z"/></svg>',
    earnings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
    kyc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 17h4"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V22h-4v-.4a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3v-4h.4A1.7 1.7 0 0 0 5 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1A1.7 1.7 0 0 0 8.7 4a1.7 1.7 0 0 0 1-1.6V2h4v.4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19 9c.3.6.9 1 1.6 1H21v4h-.4a1.7 1.7 0 0 0-1.2 1z"/></svg>'
  };
  function token(){return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''}
  function applyLogo(p){
    var box = document.getElementById('sb-avatar');
    if(!box) return;
    var logo = p && p.logo_url;
    if(logo){ box.innerHTML = '<img src="' + logo + '" alt="Provider logo" />'; }
    else { box.innerHTML = ''; }
  }
  function loadLogo(){
    if(!token()) return;
    fetch('/api/providers/me/dashboard?ts=' + Date.now(), {headers:{Authorization:'Bearer '+token()}, cache:'no-store'})
      .then(function(r){return r.json()})
      .then(function(data){applyLogo(data && data.provider)}).catch(function(){});
  }
  function replaceNavIcons(){
    Object.keys(icons).forEach(function(key){
      var nav = document.getElementById('nav-' + key);
      if(!nav) return;
      var icon = nav.querySelector('.icon');
      if(icon) icon.innerHTML = icons[key];
      var mob = document.getElementById('mob-' + key);
      if(mob){ var mIcon = mob.querySelector('span:first-child'); if(mIcon) mIcon.innerHTML = icons[key]; }
    });
  }
  var kpiIcons = {
    'today':   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>',
    'revenue': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'clients': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'rating':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
  };
  function replaceKpiIcons(){
    var cards = document.querySelectorAll('.kpi-card');
    Array.prototype.forEach.call(cards, function(card){
      var iconDiv = card.querySelector('div:first-child');
      var lblDiv  = card.querySelector('.kpi-lbl');
      if (!iconDiv || !lblDiv) return;
      if (iconDiv.getAttribute('data-icon-set')) return; // already done
      iconDiv.setAttribute('data-icon-set', '1');
      var lbl = (lblDiv.textContent || '').toLowerCase();
      if      (lbl.indexOf('booking') >= 0 || lbl.indexOf('today')   >= 0) iconDiv.innerHTML = kpiIcons.today;
      else if (lbl.indexOf('revenue') >= 0 || lbl.indexOf('earned')  >= 0 || lbl.indexOf('month') >= 0) iconDiv.innerHTML = kpiIcons.revenue;
      else if (lbl.indexOf('client')  >= 0)                                 iconDiv.innerHTML = kpiIcons.clients;
      else if (lbl.indexOf('rating')  >= 0)                                 iconDiv.innerHTML = kpiIcons.rating;
    });
  }

  function replaceQuickActionIcons(){
    Array.prototype.slice.call(document.querySelectorAll('.card button')).forEach(function(btn){
      var text = (btn.textContent || '').toLowerCase();
      var first = btn.querySelector('div:first-child');
      if(!first) return;
      first.classList.add('sl-clean-icon');
      if(text.indexOf('service') >= 0) first.innerHTML = icons.services;
      else if(text.indexOf('photo') >= 0) first.innerHTML = icons.gallery;
      else if(text.indexOf('location') >= 0) first.innerHTML = icons.location;
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    replaceNavIcons();
    replaceQuickActionIcons();
    replaceKpiIcons();
    setTimeout(loadLogo, 500);
    setTimeout(function(){ replaceNavIcons(); replaceQuickActionIcons(); replaceKpiIcons(); loadLogo(); }, 1800);
  });
})();
</script>`

  return html.replace('</head>', patch + '</head>')
}
