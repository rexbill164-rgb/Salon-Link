export function withProviderLocationActions(html: string): string {
  if (html.includes('provider-location-actions-script')) return html

  const patch = `
<style id="provider-location-actions-style">
  .sl-location-actions{display:block;margin-top:10px}
  .sl-location-share{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(0,0,0,.08);background:#111;color:#fff;text-decoration:none;border-radius:999px;padding:11px 14px;font-size:12px;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,.14);cursor:pointer;white-space:nowrap}
  .sl-location-share:active{transform:scale(.98)}
  @media(max-width:480px){.sl-location-share{font-size:11.5px;padding:10px 12px}}
</style>
<script id="provider-location-actions-script">
(function(){
  function buildShare(p){
    var wrap = document.getElementById('provider-map-wrap');
    if(!wrap) return;
    var existing = document.getElementById('sl-location-actions');
    if(existing) existing.remove();
    var lat = Number(p.location_lat), lng = Number(p.location_lng);
    if(!lat || !lng) return;
    var name = p.business_name || 'SalonLink provider';
    var address = [p.address, p.city].filter(Boolean).join(', ') || name;
    var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
    var shareText = name + '\n' + address + '\n' + mapsUrl;
    var box = document.createElement('div');
    box.id = 'sl-location-actions';
    box.className = 'sl-location-actions';
    box.innerHTML = '<button type="button" class="sl-location-share" id="sl-share-location">↗ Share location</button>';
    var dist = document.getElementById('map-distance');
    if(dist && dist.parentNode === wrap) wrap.insertBefore(box, dist.nextSibling);
    else wrap.appendChild(box);
    var btn = document.getElementById('sl-share-location');
    if(btn) btn.onclick = function(){
      if(navigator.share){
        navigator.share({ title:name, text:shareText, url:mapsUrl }).catch(function(){});
      } else {
        if(navigator.clipboard) navigator.clipboard.writeText(shareText);
        if(window.showToast) showToast('Location copied', 'success');
      }
    };
  }
  function loadProvider(){
    var id = location.pathname.split('/').pop();
    if(!id || location.pathname.indexOf('/provider/') !== 0) return;
    fetch('/api/providers/' + id).then(function(r){ return r.json(); }).then(function(data){
      if(data && data.provider) {
        setTimeout(function(){ buildShare(data.provider); }, 600);
        setTimeout(function(){ buildShare(data.provider); }, 1600);
        setTimeout(function(){ buildShare(data.provider); }, 3000);
      }
    }).catch(function(){});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadProvider); else loadProvider();
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
