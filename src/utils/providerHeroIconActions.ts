export function withProviderHeroIconActions(html: string): string {
  const patch = `
<style id="provider-hero-icon-actions-style">
  .sl-hero-actions-row {
    display:flex !important;
    align-items:center !important;
    gap:8px !important;
    margin-top:10px !important;
    flex-wrap:wrap !important;
  }
  .sl-hero-pill {
    width:38px !important;
    height:38px !important;
    min-width:38px !important;
    padding:0 !important;
    border-radius:50% !important;
    border:1px solid rgba(255,255,255,.42) !important;
    background:rgba(255,255,255,.16) !important;
    color:#fff !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size:0 !important;
    font-weight:800 !important;
    line-height:1 !important;
    cursor:pointer !important;
    backdrop-filter:blur(12px) !important;
    -webkit-backdrop-filter:blur(12px) !important;
    box-shadow:0 8px 24px rgba(0,0,0,.14) !important;
  }
  .sl-hero-pill svg {
    width:17px !important;
    height:17px !important;
    display:block !important;
    flex-shrink:0 !important;
  }
</style>
<script id="provider-hero-icon-actions-script">
(function(){
  if (!/^\/provider\/[^/]+$/.test(location.pathname)) return;
  function iconize(){
    var fav=document.getElementById('sl-fav-btn');
    var share=document.getElementById('sl-share-btn');
    if(fav){
      fav.setAttribute('aria-label','Add to favourites');
      fav.setAttribute('title','Add to favourites');
      fav.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    }
    if(share){
      share.setAttribute('aria-label','Share profile');
      share.setAttribute('title','Share profile');
      share.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
      share.onclick=window.shareProviderProfile;
    }
  }
  document.addEventListener('DOMContentLoaded',function(){ setTimeout(iconize,250); setTimeout(iconize,1000); });
  if(window.MutationObserver){ new MutationObserver(iconize).observe(document.documentElement,{childList:true,subtree:true}); }
})();
</script>`
  if (html.includes('provider-hero-icon-actions-style')) return html
  return html.replace('</head>', patch + '</head>')
}
