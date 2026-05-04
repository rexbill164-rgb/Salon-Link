export function withProviderMapLinks(html: string): string {
  const style = `
<style id="provider-map-link-styles">
  .provider-map-actions {
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-top:10px;
  }
  .provider-map-action {
    flex:1;
    min-width:120px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:7px;
    padding:10px 12px;
    border-radius:999px;
    border:1px solid rgba(0,0,0,.12);
    background:#fff;
    color:#111;
    font-size:11px;
    font-weight:800;
    text-decoration:none;
    cursor:pointer;
    box-shadow:0 4px 12px rgba(0,0,0,.05);
  }
  .provider-map-action.primary {
    background:#111;
    color:#fff;
    border-color:#111;
  }
  .provider-map-action:active { transform:scale(.98); }
  @media(max-width:480px){ .provider-map-action { min-width:100%; } }
</style>`

  const script = `
<script id="provider-google-map-links">
(function(){
  if (!location.pathname.startsWith('/provider/')) return;

  function esc(value){
    return String(value || '').replace(/[&<>"']/g, function(ch){
      if (ch === '&') return '&amp;';
      if (ch === '<') return '&lt;';
      if (ch === '>') return '&gt;';
      if (ch === '"') return '&quot;';
      return '&#39;';
    });
  }
  function showToastSafe(message, type){
    if (typeof window.showToast === 'function') window.showToast(message, type || 'info');
    else console.log('[SalonLink]', message);
  }
  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function googleSearchUrl(lat, lng, name){
    var query = lat && lng ? (lat + ',' + lng) : (name || '');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  }
  function googleDirectionsUrl(lat, lng, name){
    var destination = lat && lng ? (lat + ',' + lng) : (name || '');
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination);
  }
  async function copyText(value){
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    var input = document.createElement('textarea');
    input.value = value;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    var ok = document.execCommand('copy');
    input.remove();
    return ok;
  }
  function createActions(provider){
    var lat = provider.location_lat ? String(provider.location_lat) : '';
    var lng = provider.location_lng ? String(provider.location_lng) : '';
    var name = provider.business_name || 'SalonLink provider';
    var address = [provider.address, provider.city].filter(Boolean).join(', ');
    var searchUrl = googleSearchUrl(lat, lng, address || name);
    var directionsUrl = googleDirectionsUrl(lat, lng, address || name);

    var wrap = document.createElement('div');
    wrap.id = 'provider-map-actions';
    wrap.className = 'provider-map-actions';
    wrap.innerHTML =
      '<a class="provider-map-action primary" href="' + esc(directionsUrl) + '" target="_blank" rel="noopener">🧭 Get Directions</a>' +
      '<a class="provider-map-action" href="' + esc(searchUrl) + '" target="_blank" rel="noopener">📍 Open in Google Maps</a>' +
      '<button type="button" class="provider-map-action" id="provider-share-location-btn">🔗 Share Location</button>';

    setTimeout(function(){
      var shareBtn = document.getElementById('provider-share-location-btn');
      if (!shareBtn) return;
      shareBtn.addEventListener('click', async function(){
        var shareData = {
          title: name,
          text: address ? (name + ' - ' + address) : name,
          url: searchUrl
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
            return;
          }
          await copyText(searchUrl);
          showToastSafe('Location link copied', 'success');
        } catch (err) {
          try {
            await copyText(searchUrl);
            showToastSafe('Location link copied', 'success');
          } catch (_) {
            showToastSafe('Could not share location', 'error');
          }
        }
      });
    }, 50);

    return wrap;
  }
  function insertActions(provider){
    if (!provider || !provider.location_lat || !provider.location_lng) return;
    if (document.getElementById('provider-map-actions')) return;
    var mapWrap = document.getElementById('provider-map-wrap');
    if (!mapWrap) return;
    mapWrap.appendChild(createActions(provider));
  }
  function loadProviderForMapLinks(){
    var id = providerId();
    if (!id) return;
    fetch('/api/providers/' + encodeURIComponent(id))
      .then(function(res){ return res.json(); })
      .then(function(data){ insertActions(data.provider || {}); })
      .catch(function(err){ console.warn('Provider map links failed:', err); });
  }
  document.addEventListener('DOMContentLoaded', function(){
    loadProviderForMapLinks();
    if (window.MutationObserver) {
      new MutationObserver(function(){ loadProviderForMapLinks(); }).observe(document.documentElement, { childList:true, subtree:true });
    }
  });
})();
</script>`

  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}
