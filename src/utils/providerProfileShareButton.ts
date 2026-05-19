export function withProviderProfileShareButton(html: string): string {
  if (html.includes('provider-profile-share-location-script')) return html

  const patch = `
<style id="provider-profile-share-location-style">
  .sl-provider-share-location{
    width:100%!important;
    margin-top:12px!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    gap:8px!important;
    border-radius:14px!important;
    border:1px solid rgba(0,0,0,.08)!important;
    background:#fff!important;
    color:#111827!important;
    padding:12px 14px!important;
    font-size:13px!important;
    font-weight:800!important;
    cursor:pointer!important;
  }
  .sl-provider-share-location:hover{background:#f8fafc!important;}
</style>
<script id="provider-profile-share-location-script">
(function(){
  if(location.pathname.indexOf('/provider/') !== 0) return;

  var providerData = null;
  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function addressOf(p){ return [p && p.address, p && p.city].filter(Boolean).join(', ') || 'Accra, Ghana'; }
  function mapLinkOf(p){
    var lat = Number(p && p.location_lat);
    var lng = Number(p && p.location_lng);
    if(lat && lng) return 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng);
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addressOf(p));
  }
  function shareText(p){
    var profile = location.origin + location.pathname;
    return 'Check out ' + ((p && p.business_name) || 'this provider') + ' on SalonLink.\nLocation: ' + addressOf(p) + '\nMap: ' + mapLinkOf(p) + '\nProfile: ' + profile;
  }
  function shareLocation(){
    var p = providerData || {};
    var text = shareText(p);
    var map = mapLinkOf(p);
    if(navigator.share){
      navigator.share({title:(p.business_name || 'SalonLink provider'), text:text, url:map}).catch(function(){});
      return;
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ if(window.showToast) showToast('Location link copied','success'); });
    } else if(window.showToast) showToast('Location link copied','success');
  }
  function insertShareButton(){
    if(document.getElementById('sl-provider-share-location')) return;
    var mapWrap = document.getElementById('provider-map-wrap');
    var target = mapWrap || document.querySelector('.details-card') || document.querySelector('[id="info-location"]');
    if(!target) return;
    var btn = document.createElement('button');
    btn.id = 'sl-provider-share-location';
    btn.type = 'button';
    btn.className = 'sl-provider-share-location';
    btn.innerHTML = '↗ Share Location';
    btn.onclick = shareLocation;
    if(mapWrap) mapWrap.appendChild(btn);
    else if(target.classList && target.classList.contains('details-card')) target.appendChild(btn);
    else target.parentNode && target.parentNode.appendChild(btn);
  }
  function loadProvider(){
    var id = providerId();
    if(!id) return;
    fetch('/api/providers/' + encodeURIComponent(id) + '?ts=' + Date.now(), {cache:'no-store'})
      .then(function(r){return r.json();})
      .then(function(data){ providerData = data && data.provider ? data.provider : null; insertShareButton(); })
      .catch(function(){ insertShareButton(); });
  }
  document.addEventListener('DOMContentLoaded', function(){ loadProvider(); setTimeout(insertShareButton, 800); setTimeout(insertShareButton, 1800); });
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
