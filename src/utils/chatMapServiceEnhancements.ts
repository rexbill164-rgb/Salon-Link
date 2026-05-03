export function withProviderProfileServiceUi(html: string): string {
  const style = `
<style id="chat-map-service-provider-profile-ui">
  @media(max-width:640px){
    body { padding-bottom:0 !important; }
    .container { padding-bottom:130px !important; }
    #services-grid { padding-bottom:120px !important; }
    .service-item {
      gap:12px !important;
      align-items:flex-start !important;
      padding:14px 0 !important;
      min-height:72px !important;
      border-radius:14px !important;
      touch-action:manipulation !important;
    }
    .service-item:active { transform:scale(0.99); background:var(--g-dim); }
    .service-item > div:first-child { min-width:0 !important; flex:1 !important; align-items:flex-start !important; gap:12px !important; }
    .service-item > div:first-child > div:first-child { width:34px !important; height:34px !important; flex-shrink:0 !important; }
    .service-item > div:first-child > div:last-child { min-width:0 !important; flex:1 !important; }
    .service-item span[style*="font-size:14px"],
    .service-item span[style*="font-size: 14px"]{
      display:-webkit-box !important;
      -webkit-line-clamp:2 !important;
      -webkit-box-orient:vertical !important;
      overflow:hidden !important;
      text-overflow:ellipsis !important;
      line-height:1.3 !important;
      max-width:100% !important;
      white-space:normal !important;
      word-break:normal !important;
    }
    .service-item > div:last-child { flex-shrink:0 !important; min-width:92px !important; justify-content:flex-end !important; gap:7px !important; align-self:flex-start !important; }
    .service-item > div:last-child span { font-size:16px !important; white-space:nowrap !important; }
    .service-item > div:last-child svg { flex-shrink:0 !important; }
  }
</style>`

  const script = `
<script id="provider-message-provider-link">
(function(){
  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function wireMessageButtons(){
    if (!location.pathname.startsWith('/provider/')) return;
    Array.prototype.slice.call(document.querySelectorAll('button,a')).forEach(function(el){
      var text = (el.textContent || '').trim().toLowerCase();
      if (text.indexOf('message provider') >= 0 || text === 'message') {
        if (el.dataset.salonlinkMessageWired === '1') return;
        el.dataset.salonlinkMessageWired = '1';
        el.style.cursor = 'pointer';
        el.addEventListener('click', function(event){
          event.preventDefault();
          location.href = '/messages?provider_id=' + encodeURIComponent(providerId());
        });
      }
    });
  }
  document.addEventListener('DOMContentLoaded', wireMessageButtons);
  document.addEventListener('click', function(){ setTimeout(wireMessageButtons, 250); }, true);
  if (window.MutationObserver) new MutationObserver(wireMessageButtons).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`

  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}

export function withDiscoveryNearbyUi(html: string): string {
  const style = `
<style id="nearby-map-panel-styles">
  .nearby-map-panel { background:#fff; border:1px solid #eee; border-radius:22px; padding:18px; margin:0 0 18px; box-shadow:0 8px 24px rgba(0,0,0,.06); }
  .nearby-map-top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .nearby-map-placeholder { margin-top:14px; min-height:112px; border-radius:18px; border:1px dashed #d9d9d9; background:linear-gradient(135deg,#f6f6f6,#ededed); display:flex; align-items:center; justify-content:center; text-align:center; color:#777; font-size:12px; }
  .nearby-provider-list { display:none; margin-top:14px; gap:10px; overflow-x:auto; padding-bottom:2px; }
  .nearby-provider-card { min-width:232px; text-align:left; border:1px solid #eee; background:#fafafa; border-radius:18px; padding:14px; cursor:pointer; transition:transform .2s, box-shadow .2s, border-color .2s; }
  .nearby-provider-card:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,0,0,.08); border-color:#ddd; }
  .nearby-provider-card:active { transform:scale(.99); }
  @media(max-width:640px){ .nearby-map-panel { margin-bottom:14px; padding:16px; } .nearby-map-top { align-items:flex-start; } .nearby-provider-card { min-width:218px; } }
</style>`

  const script = `
<script id="nearby-map-panel-script">
(function(){
  if (location.pathname !== '/discover') return;
  function esc(value){
    return String(value || '').replace(/[&<>"']/g, function(ch){
      if (ch === '&') return '&amp;';
      if (ch === '<') return '&lt;';
      if (ch === '>') return '&gt;';
      if (ch === '"') return '&quot;';
      return '&#39;';
    });
  }
  function category(value){ return String(value || 'Beauty').replace(/_/g, ' ').replace(/\b\w/g, function(letter){ return letter.toUpperCase(); }); }
  function money(value){ return value ? 'GHS ' + Math.round(Number(value) / 100) : 'Price varies'; }
  function distanceLabel(provider){
    var km = Number(provider.distance_km || 9999);
    if (km < 9999) return km < 1 ? Math.round(km * 1000) + 'm away' : km.toFixed(1) + 'km away';
    return provider.city ? provider.city + ' - location not pinned' : 'Location not pinned';
  }
  function buildCard(provider){
    return '<button class="nearby-provider-card" type="button" data-provider-id="' + esc(provider.id) + '">' +
      '<div style="font-weight:900;font-size:13px;color:#111;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(provider.business_name || 'Provider') + '</div>' +
      '<div style="font-size:11px;color:#777;margin-bottom:8px;line-height:1.5;">' + esc(category(provider.service_category)) + ' - ' + esc(distanceLabel(provider)) + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
        '<span style="font-size:12px;font-weight:800;color:#111;">' + esc(money(provider.price_from)) + '</span>' +
        '<span style="font-size:11px;color:#777;">Rating ' + esc(provider.rating ? Number(provider.rating).toFixed(1) : 'New') + '</span>' +
      '</div>' +
      '<div style="margin-top:10px;font-size:12px;font-weight:800;color:#111;">View profile</div>' +
    '</button>';
  }
  function insertPanel(){
    var grid = document.getElementById('providers-grid');
    if (!grid || document.getElementById('nearby-map-panel')) return;
    var panel = document.createElement('section');
    panel.id = 'nearby-map-panel';
    panel.className = 'nearby-map-panel';
    panel.innerHTML = '<div class="nearby-map-top"><div><div style="font-weight:900;font-size:16px;color:#111;">Near You</div><div id="nearby-map-sub" style="font-size:12px;color:#777;margin-top:3px;">Allow location to see providers near you.</div></div><button id="nearby-map-btn" type="button" style="border:none;background:#111;color:#fff;border-radius:999px;padding:10px 14px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap;">Use location</button></div><div class="nearby-map-placeholder"><div><div style="font-weight:800;color:#333;margin-bottom:3px;">Map view coming soon</div><div>Nearby list appears here after location permission.</div></div></div><div id="nearby-provider-list" class="nearby-provider-list"></div>';
    grid.parentNode.insertBefore(panel, grid);
    document.getElementById('nearby-map-btn').addEventListener('click', loadNearbyProviders);
  }
  function renderProviders(providers){
    var list = document.getElementById('nearby-provider-list');
    if (!list) return;
    list.style.display = 'flex';
    if (!providers.length) {
      list.innerHTML = '<div style="font-size:12px;color:#777;padding:10px 0;">No nearby providers found yet.</div>';
      return;
    }
    list.innerHTML = providers.map(buildCard).join('');
    list.querySelectorAll('.nearby-provider-card').forEach(function(card){
      card.addEventListener('click', function(){ location.href = '/provider/' + encodeURIComponent(card.getAttribute('data-provider-id')); });
    });
  }
  function loadNearbyProviders(){
    var btn = document.getElementById('nearby-map-btn');
    var sub = document.getElementById('nearby-map-sub');
    if (!navigator.geolocation) { if (sub) sub.textContent = 'Location is not supported on this device.'; return; }
    if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }
    navigator.geolocation.getCurrentPosition(function(pos){
      fetch('/api/providers/nearby?lat=' + encodeURIComponent(pos.coords.latitude) + '&lng=' + encodeURIComponent(pos.coords.longitude) + '&limit=20')
        .then(function(response){ return response.json(); })
        .then(function(data){
          var providers = data.providers || [];
          if (sub) sub.textContent = providers.length ? 'Showing providers around your current location.' : 'No nearby providers found yet.';
          renderProviders(providers);
          if (btn) { btn.textContent = 'Refresh'; btn.disabled = false; }
        })
        .catch(function(){
          if (sub) sub.textContent = 'Could not load nearby providers. Please try again.';
          if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
        });
    }, function(){
      if (sub) sub.textContent = 'Allow location to see providers near you.';
      if (btn) { btn.textContent = 'Use location'; btn.disabled = false; }
    });
  }
  document.addEventListener('DOMContentLoaded', insertPanel);
})();
</script>`

  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}

export function withProviderDashboardMessagesButton(html: string): string {
  const script = `
<script id="provider-dashboard-messages-button">
(function(){
  if (location.pathname !== '/provider/dashboard') return;
  function addMessagesButton(){
    if (!document.getElementById('nav-messages-link')) {
      var appts = document.getElementById('nav-appts');
      if (appts && appts.parentNode) {
        var btn = document.createElement('button');
        btn.id = 'nav-messages-link';
        btn.className = 'sidebar-item';
        btn.type = 'button';
        btn.innerHTML = '<span class="icon">MSG</span><span>Messages</span>';
        btn.addEventListener('click', function(){ location.href = '/messages'; });
        appts.parentNode.insertBefore(btn, appts.nextSibling);
      }
    }
    if (!document.getElementById('topbar-messages-link')) {
      var topbarActions = document.querySelector('.topbar > div:last-child');
      if (topbarActions) {
        var topBtn = document.createElement('button');
        topBtn.id = 'topbar-messages-link';
        topBtn.type = 'button';
        topBtn.className = 'btn-ghost';
        topBtn.style.cssText = 'height:36px;border-radius:10px;padding:0 12px;font-size:11px;font-weight:800;';
        topBtn.textContent = 'Messages';
        topBtn.addEventListener('click', function(){ location.href = '/messages'; });
        topbarActions.insertBefore(topBtn, topbarActions.firstChild);
      }
    }
  }
  document.addEventListener('DOMContentLoaded', addMessagesButton);
  if (window.MutationObserver) new MutationObserver(addMessagesButton).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`

  return html.replace('</body>', script + '</body>')
}
