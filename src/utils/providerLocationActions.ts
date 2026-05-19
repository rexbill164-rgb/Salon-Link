export function withProviderLocationActions(html: string): string {
  if (html.includes('provider-location-actions-script')) return html

  const patch = `
<style id="provider-location-actions-style">
  .sl-location-actions{display:block!important;margin-top:12px!important;margin-bottom:4px!important;width:100%!important;clear:both!important}
  .sl-location-share{width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;border:1px solid rgba(0,0,0,.08)!important;background:#111!important;color:#fff!important;text-decoration:none!important;border-radius:999px!important;padding:12px 14px!important;font-size:12px!important;font-weight:800!important;box-shadow:0 4px 14px rgba(0,0,0,.14)!important;cursor:pointer!important;white-space:nowrap!important}
  .sl-location-share:active{transform:scale(.98)}
  @media(max-width:480px){.sl-location-share{font-size:11.5px!important;padding:11px 12px!important}}
</style>
<script id="provider-location-actions-script">
(function(){
  var providerData = null;
  var inserted = false;

  function getProviderId(){ return location.pathname.split('/').pop(); }
  function getMapsUrl(p){ return 'https://www.google.com/maps/search/?api=1&query=' + Number(p.location_lat) + ',' + Number(p.location_lng); }
  function getShareText(p){
    var name = p.business_name || 'SalonLink provider';
    var address = [p.address, p.city].filter(Boolean).join(', ') || name;
    return name + '\n' + address + '\n' + getMapsUrl(p);
  }
  function tryInsert(){
    var p = providerData;
    if(!p) return;
    var lat = Number(p.location_lat), lng = Number(p.location_lng);
    if(!lat || !lng) return;
    var wrap = document.getElementById('provider-map-wrap');
    var map = document.getElementById('provider-map');
    if(!wrap || !map) return;
    var old = document.getElementById('sl-location-actions');
    if(old) old.remove();

    var box = document.createElement('div');
    box.id = 'sl-location-actions';
    box.className = 'sl-location-actions';
    box.innerHTML = '<button type="button" class="sl-location-share" id="sl-share-location">↗ Share location</button>';

    var dist = document.getElementById('map-distance');
    if(dist && dist.parentNode === wrap) wrap.insertBefore(box, dist.nextSibling);
    else wrap.appendChild(box);

    var btn = document.getElementById('sl-share-location');
    if(btn) btn.onclick = function(){
      var mapsUrl = getMapsUrl(p);
      var text = getShareText(p);
      if(navigator.share){ navigator.share({ title:p.business_name || 'SalonLink location', text:text, url:mapsUrl }).catch(function(){}); }
      else { if(navigator.clipboard) navigator.clipboard.writeText(text); if(window.showToast) showToast('Location copied', 'success'); }
    };
    inserted = true;
  }
  function loadProvider(){
    var id = getProviderId();
    if(!id || location.pathname.indexOf('/provider/') !== 0) return;
    fetch('/api/providers/' + id).then(function(r){ return r.json(); }).then(function(data){
      if(data && data.provider){ providerData = data.provider; tryInsert(); }
    }).catch(function(){});
  }
  function startWatch(){
    loadProvider();
    var tries = 0;
    var timer = setInterval(function(){
      tries++;
      if(!providerData) loadProvider();
      tryInsert();
      if(inserted || tries > 30) clearInterval(timer);
    }, 500);
    if(window.MutationObserver){
      new MutationObserver(function(){ tryInsert(); }).observe(document.documentElement, { childList:true, subtree:true });
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startWatch); else startWatch();
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
