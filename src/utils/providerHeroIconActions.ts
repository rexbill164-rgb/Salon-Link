export function withProviderHeroIconActions(html: string): string {
  const patch = `
<style id="provider-hero-icon-actions-style">
  /* Remove Fav and Share from the hero intro area */
  .sl-hero-actions-row,
  #sl-hero-actions-row,
  #sl-fav-btn,
  #sl-share-btn {
    display:none !important;
  }

  /* Hide the old text verified badge beside the name */
  #profile-verified-badge {
    display:none !important;
  }

  /* Replace any old Open/Closed badge under logo with a Verified badge */
  #sl-logo-open-badge {
    display:none !important;
  }

  .sl-logo-verified-badge {
    position:absolute !important;
    left:50% !important;
    bottom:-25px !important;
    transform:translateX(-50%) !important;
    height:23px !important;
    padding:0 10px !important;
    border-radius:999px !important;
    background:rgba(255,255,255,.96) !important;
    color:#0f7a3d !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:4px !important;
    font-size:10px !important;
    font-weight:900 !important;
    white-space:nowrap !important;
    box-shadow:0 6px 16px rgba(0,0,0,.16) !important;
    z-index:20 !important;
  }
</style>
<script id="provider-hero-icon-actions-script">
(function(){
  var parts = location.pathname.split('/').filter(Boolean);
  if (!(parts.length === 2 && parts[0] === 'provider')) return;

  function cleanHeroActions(){
    var row = document.getElementById('sl-hero-actions-row');
    if (row && row.parentNode) row.parentNode.removeChild(row);

    var fav = document.getElementById('sl-fav-btn');
    if (fav && fav.parentNode) fav.parentNode.removeChild(fav);

    var share = document.getElementById('sl-share-btn');
    if (share && share.parentNode) share.parentNode.removeChild(share);

    Array.prototype.slice.call(document.querySelectorAll('button')).forEach(function(btn){
      var text = (btn.textContent || '').toLowerCase();
      if (text.indexOf('fav') >= 0 || text.indexOf('share') >= 0 || text.indexOf('share profile') >= 0) {
        if (!btn.closest('.sl-portfolio-controls')) btn.style.display = 'none';
      }
    });
  }

  function moveVerifiedUnderLogo(){
    var ring = document.querySelector('.avatar-ring');
    if (!ring) return;

    var openBadge = document.getElementById('sl-logo-open-badge');
    if (openBadge && openBadge.parentNode) openBadge.parentNode.removeChild(openBadge);

    var old = document.getElementById('sl-logo-verified-badge');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var badge = document.createElement('span');
    badge.id = 'sl-logo-verified-badge';
    badge.className = 'sl-logo-verified-badge';
    badge.innerHTML = '✓ Verified';
    ring.appendChild(badge);
  }

  function apply(){
    cleanHeroActions();
    moveVerifiedUnderLogo();
  }

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(apply, 150);
    setTimeout(apply, 700);
    setTimeout(apply, 1500);
  });

  if (window.MutationObserver) {
    new MutationObserver(function(){ apply(); }).observe(document.documentElement, { childList:true, subtree:true });
  }
})();
</script>`
  if (html.includes('provider-hero-icon-actions-style')) return html
  return html.replace('</head>', patch + '</head>')
}
