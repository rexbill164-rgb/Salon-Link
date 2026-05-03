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
  .nearby-map-box { margin-top:14px; height:220px; min-height:220px; border-radius:18px; border:1px solid #e3e3e3; background:#f2f2f2; overflow:hidden; position:relative; }
  #nearby-map { width:100%; height:100%; min-height:220px; }
  .nearby-map-message { position:absolute; inset:0; z-index:2; display:flex; align-items:center; justify-content:center; padding:18px; text-align:center; color:#666; font-size:12px; line-height:1.5; background:linear-gradient(135deg,rgba(255,255,255,.88),rgba(246,246,246,.8)); pointer-events:none; }
  .nearby-map-message.is-hidden { display:none; }
  .nearby-provider-list { display:none; margin-top:14px; gap:10px; overflow-x:auto; padding-bottom:2px; }
  .nearby-provider-card { min-width:232px; text-align:left; border:1px solid #eee; background:#fafafa; border-radius:18px; padding:14px; cursor:pointer; transition:transform .2s, box-shadow .2s, border-color .2s; }
  .nearby-provider-card:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,0,0,.08); border-color:#ddd; }
  .nearby-provider-card:active { transform:scale(.99); }
  .nearby-map-box .leaflet-container { font-family:inherit; }
  .nearby-map-box .leaflet-popup-content-wrapper { border-radius:14px; }
  @media(max-width:640px){ .nearby-map-panel { margin-bottom:14px; padding:16px; } .nearby-map-top { align-items:flex-start; } .nearby-provider-card { min-width:218px; } .nearby-map-box { height:210px; min-height:210px; } #nearby-map { min-height:210px; } }
</style>`

  const script = `
<script id="nearby-map-panel-script">
(function(){
  if (location.pathname !== '/discover') return;

  var nearbyMap = null;
  var nearbyMapLayers = [];
  var leafletLoadPromise = null;

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
  function providerNumber(provider, keys){
    for (var i = 0; i < keys.length; i++) {
      var raw = provider[keys[i]];
      if (raw === null || raw === undefined || raw === '') continue;
      var value = Number(raw);
      if (isFinite(value)) return value;
    }
    return null;
  }
  function providerLat(provider){ return providerNumber(provider, ['location_lat', 'lat', 'latitude']); }
  function providerLng(provider){ return providerNumber(provider, ['location_lng', 'lng', 'longitude']); }
  function setMapMessage(message){
    var el = document.getElementById('nearby-map-message');
    if (!el) return;
    if (!message) {
      el.className = 'nearby-map-message is-hidden';
      el.textContent = '';
      return;
    }
    el.className = 'nearby-map-message';
    el.textContent = message;
  }
  function ensureLeafletCss(){
    if (document.querySelector('link[href*="leaflet.css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIINfQnDTL7Kkdl0r7vdZc4w2NrI7Z5oN2M=';
    link.crossOrigin = '';
    document.head.appendChild(link);
  }
  function ensureLeaflet(){
    ensureLeafletCss();
    if (window.L) return Promise.resolve(true);
    if (leafletLoadPromise) return leafletLoadPromise;
    leafletLoadPromise = new Promise(function(resolve){
      var existing = document.getElementById('nearby-map-leaflet-js');
      if (existing) {
        existing.addEventListener('load', function(){ resolve(!!window.L); });
        existing.addEventListener('error', function(){ resolve(false); });
        setTimeout(function(){ resolve(!!window.L); }, 3500);
        return;
      }
      var script = document.createElement('script');
      script.id = 'nearby-map-leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = function(){ resolve(!!window.L); };
      script.onerror = function(){ resolve(false); };
      document.head.appendChild(script);
    });
    return leafletLoadPromise;
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
    panel.innerHTML = '<div class="nearby-map-top"><div><div style="font-weight:900;font-size:16px;color:#111;">Near You</div><div id="nearby-map-sub" style="font-size:12px;color:#777;margin-top:3px;">Allow location to see providers near you.</div></div><button id="nearby-map-btn" type="button" style="border:none;background:#111;color:#fff;border-radius:999px;padding:10px 14px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap;">Use location</button></div><div class="nearby-map-box"><div id="nearby-map"></div><div id="nearby-map-message" class="nearby-map-message">Use your location to load the nearby map.</div></div><div id="nearby-provider-list" class="nearby-provider-list"></div>';
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
  function clearMapLayers(){
    if (!nearbyMap) return;
    nearbyMapLayers.forEach(function(layer){ nearbyMap.removeLayer(layer); });
    nearbyMapLayers = [];
  }
  function addLayer(layer){
    nearbyMapLayers.push(layer);
    return layer;
  }
  function renderMap(customerLat, customerLng, providers){
    var lat = Number(customerLat);
    var lng = Number(customerLng);
    if (!isFinite(lat) || !isFinite(lng)) return;

    ensureLeaflet().then(function(loaded){
      if (!loaded || !window.L) {
        setMapMessage('Nearby providers loaded, but the map could not load. The list below still works.');
        return;
      }

      var L = window.L;
      setMapMessage('');
      if (!nearbyMap) {
        nearbyMap = L.map('nearby-map', { zoomControl:true, scrollWheelZoom:false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(nearbyMap);
      }

      clearMapLayers();
      var bounds = L.latLngBounds([[lat, lng]]);
      var customer = addLayer(L.circleMarker([lat, lng], {
        radius: 9,
        color: '#111',
        weight: 3,
        fillColor: '#111',
        fillOpacity: 0.9
      }).addTo(nearbyMap));
      customer.bindPopup('You are here');

      var markerCount = 0;
      providers.forEach(function(provider){
        var pLat = providerLat(provider);
        var pLng = providerLng(provider);
        if (pLat === null || pLng === null) return;
        markerCount++;
        bounds.extend([pLat, pLng]);
        var marker = addLayer(L.circleMarker([pLat, pLng], {
          radius: 8,
          color: '#111',
          weight: 2,
          fillColor: '#fff',
          fillOpacity: 1
        }).addTo(nearbyMap));
        marker.bindPopup('<strong>' + esc(provider.business_name || 'Provider') + '</strong><br>' + esc(category(provider.service_category)) + '<br>' + esc(distanceLabel(provider)));
        marker.on('click', function(){ marker.openPopup(); });
      });

      setTimeout(function(){
        nearbyMap.invalidateSize();
        if (markerCount > 0) nearbyMap.fitBounds(bounds, { padding:[26, 26], maxZoom:15 });
        else nearbyMap.setView([lat, lng], 13);
      }, 80);
    });
  }
  function loadNearbyProviders(){
    var btn = document.getElementById('nearby-map-btn');
    var sub = document.getElementById('nearby-map-sub');
    if (!navigator.geolocation) { if (sub) sub.textContent = 'Location is not supported on this device.'; setMapMessage('Location is not supported on this device.'); return; }
    if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }
    setMapMessage('Getting your location...');
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      fetch('/api/providers/nearby?lat=' + encodeURIComponent(lat) + '&lng=' + encodeURIComponent(lng) + '&limit=20')
        .then(function(response){ return response.json(); })
        .then(function(data){
          var providers = data.providers || [];
          if (sub) sub.textContent = providers.length ? 'Showing providers around your current location.' : 'No nearby providers found yet.';
          renderProviders(providers);
          renderMap(lat, lng, providers);
          if (btn) { btn.textContent = 'Refresh'; btn.disabled = false; }
        })
        .catch(function(){
          renderMap(lat, lng, []);
          if (sub) sub.textContent = 'Could not load nearby providers. Please try again.';
          if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
        });
    }, function(){
      if (sub) sub.textContent = 'Allow location to see providers near you.';
      setMapMessage('Allow location to show your nearby map.');
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
