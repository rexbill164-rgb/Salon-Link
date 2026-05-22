export function withProviderHeroIconActions(html: string): string {
  const patch = `
<style id="provider-hero-icon-actions-style">
  /* Keep Fav and Share under Hair Salon - Accra, but show icons only */
  .sl-hero-actions-row,
  #sl-hero-actions-row {
    display:flex !important;
    align-items:center !important;
    gap:8px !important;
    margin-top:10px !important;
    flex-wrap:wrap !important;
  }

  #sl-fav-btn,
  #sl-share-btn,
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
    line-height:1 !important;
    cursor:pointer !important;
    backdrop-filter:blur(12px) !important;
    -webkit-backdrop-filter:blur(12px) !important;
    box-shadow:0 8px 24px rgba(0,0,0,.14) !important;
  }

  #sl-fav-btn svg,
  #sl-share-btn svg,
  .sl-hero-pill svg {
    width:17px !important;
    height:17px !important;
    display:block !important;
    flex-shrink:0 !important;
  }

  /* Hide the old text verified badge beside the name */
  #profile-verified-badge {
    display:none !important;
  }

  /* Put verified under the logo/avatar */
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

  function iconizeHeroActions(){
    var fav = document.getElementById('sl-fav-btn');
    var share = document.getElementById('sl-share-btn');

    // Guard: skip if already iconized (prevents re-mutation)
    if (fav && !fav.getAttribute('data-iconized')) {
      fav.setAttribute('data-iconized', '1');
      fav.style.display = 'inline-flex';
      fav.setAttribute('aria-label', 'Add to favourites');
      fav.setAttribute('title', 'Add to favourites');
      fav.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    }

    if (share && !share.getAttribute('data-iconized')) {
      share.setAttribute('data-iconized', '1');
      share.style.display = 'inline-flex';
      share.setAttribute('aria-label', 'Share profile');
      share.setAttribute('title', 'Share profile');
      share.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
      share.onclick = window.shareProviderProfile;
    }
  }

  function moveVerifiedUnderLogo(){
    var ring = document.querySelector('.avatar-ring');
    if (!ring) return;

    // Guard: if badge already inside ring, don't remove and re-add (causes infinite loop)
    if (document.getElementById('sl-logo-verified-badge')) return;

    var openBadge = document.getElementById('sl-logo-open-badge');
    if (openBadge && openBadge.parentNode) openBadge.parentNode.removeChild(openBadge);

    var badge = document.createElement('span');
    badge.id = 'sl-logo-verified-badge';
    badge.className = 'sl-logo-verified-badge';
    badge.innerHTML = '✓ Verified';
    ring.appendChild(badge);
  }

  function apply(){
    iconizeHeroActions();
    moveVerifiedUnderLogo();
  }

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(apply, 150);
    setTimeout(apply, 700);
    setTimeout(apply, 1500);
  });

  // NOTE: No MutationObserver here — apply() mutates the DOM (innerHTML, appendChild)
  // which would re-trigger the observer causing an infinite freeze loop.
  // The DOMContentLoaded + timeout chain is sufficient.
})();
</script>`
  if (html.includes('provider-hero-icon-actions-style')) return html
  return html.replace('</head>', patch + '</head>')
}
