export function withProviderLocationActions(html: string): string {
  if (html.includes('provider-location-actions-script')) return html

  const patch = `
<style id="provider-location-actions-style">
  .sl-location-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
  .sl-location-action{display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(0,0,0,.08);background:#fff;color:#111;text-decoration:none;border-radius:999px;padding:10px 12px;font-size:12px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.04);cursor:pointer;white-space:nowrap}
  .sl-location-action.primary{background:#111;color:#fff;border-color:#111}
  .sl-location-action.soft{background:#f7f7f7}
  @media(max-width:480px){.sl-location-actions{grid-template-columns:1fr 1fr;gap:7px}.sl-location-action{font-size:11px;padding:9px 10px}}
</style>
<script id="provider-location-actions-script">
(function(){
  function enc(v){ return encodeURIComponent(String(v || '')); }
  function openWithFallback(appUrl, fallbackUrl){
    var didHide = false;
    var onHide = function(){ didHide = true; };
    document.addEventListener('visibilitychange', onHide, { once:true });
    window.location.href = appUrl;
    setTimeout(function(){ if(!didHide) window.open(fallbackUrl, '_blank'); }, 900);
  }
  function buildActions(p){
    var wrap = document.getElementById('provider-map-wrap');
    if(!wrap || document.getElementById('sl-location-actions')) return;
    var lat = Number(p.location_lat), lng = Number(p.location_lng);
    if(!lat || !lng) return;
    var name = p.business_name || 'SalonLink provider';
    var address = [p.address, p.city].filter(Boolean).join(', ') || name;
    var label = name + ' - ' + address;
    var mapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '&destination_place_id=&travelmode=driving';
    var searchUrl = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
    var boltApp = 'bolt://action/ride?destination[latitude]=' + lat + '&destination[longitude]=' + lng + '&destination[address]=' + enc(label);
    var yangoApp = 'yango://route?end-lat=' + lat + '&end-lon=' + lng;
    var box = document.createElement('div');
    box.id = 'sl-location-actions';
    box.className = 'sl-location-actions';
    box.innerHTML =
      '<a class="sl-location-action primary" href="' + mapsUrl + '" target="_blank" rel="noopener">📍 Maps</a>' +
      '<button type="button" class="sl-location-action soft" id="sl-share-location">↗ Share</button>' +
      '<button type="button" class="sl-location-action" id="sl-open-bolt">⚡ Bolt</button>' +
      '<button type="button" class="sl-location-action" id="sl-open-yango">🚕 Yango</button>';
    var dist = document.getElementById('map-distance');
    if(dist && dist.parentNode === wrap) wrap.insertBefore(box, dist.nextSibling);
    else wrap.appendChild(box);
    var shareBtn = document.getElementById('sl-share-location');
    if(shareBtn) shareBtn.onclick = function(){
      var shareText = label + '\n' + searchUrl;
      if(navigator.share){ navigator.share({ title:name, text:shareText, url:searchUrl }).catch(function(){}); }
      else { navigator.clipboard && navigator.clipboard.writeText(shareText); if(window.showToast) showToast('Location copied', 'success'); }
    };
    var boltBtn = document.getElementById('sl-open-bolt');
    if(boltBtn) boltBtn.onclick = function(){ openWithFallback(boltApp, mapsUrl); };
    var yangoBtn = document.getElementById('sl-open-yango');
    if(yangoBtn) yangoBtn.onclick = function(){ openWithFallback(yangoApp, mapsUrl); };
  }
  function init(){
    var id = location.pathname.split('/').pop();
    if(!id || location.pathname.indexOf('/provider/') !== 0) return;
    fetch('/api/providers/' + id).then(function(r){ return r.json(); }).then(function(data){
      if(data && data.provider) {
        setTimeout(function(){ buildActions(data.provider); }, 500);
        setTimeout(function(){ buildActions(data.provider); }, 1500);
      }
    }).catch(function(){});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
