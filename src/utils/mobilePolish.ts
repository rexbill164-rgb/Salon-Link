export function withMobilePolish(html: string): string {
  if (html.includes('salonlink-mobile-polish')) return html

  const patch = `
<style id="salonlink-mobile-polish">
  @media (max-width: 900px) {
    :root { --sl-hero-bg: #fbf1fa; }

    body { font-size: 12.5px !important; }

    .nav-main {
      background: rgba(251, 241, 250, 0.97) !important;
      border-bottom-color: rgba(0,0,0,0.04) !important;
      padding-top: calc(env(safe-area-inset-top) + 8px) !important;
      transition: background .22s ease, box-shadow .22s ease, border-color .22s ease !important;
    }
    .nav-main.scrolled {
      background: rgba(255,255,255,0.97) !important;
      border-bottom-color: rgba(0,0,0,0.07) !important;
      box-shadow: 0 4px 18px rgba(0,0,0,0.05) !important;
    }
    .sl-nav-spacer,
    .nav-main + div[style*="height"] {
      height: calc(64px + env(safe-area-inset-top)) !important;
    }
    .nav-main .container {
      height: 48px !important;
      padding: 0 12px !important;
      gap: 7px !important;
      max-width: none !important;
    }
    .nav-main a[aria-label="SalonLink home"] {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      max-width: 132px !important;
      overflow: hidden !important;
      gap: 2px !important;
      font-size: 15px !important;
      line-height: 1 !important;
    }
    .nav-main a[aria-label="SalonLink home"] span {
      line-height: 1 !important;
      white-space: nowrap !important;
    }
    .nav-main a[aria-label="SalonLink home"] span:first-child {
      max-width: 54px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      font-size: 15px !important;
    }
    .nav-main a[aria-label="SalonLink home"] span:last-child {
      max-width: 58px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      font-size: 17px !important;
    }
    #nav-auth {
      flex: 0 1 auto !important;
      min-width: 0 !important;
      gap: 6px !important;
    }
    #nav-auth .btn-ghost,
    #nav-auth a.btn-ghost {
      font-size: 11px !important;
      padding: 7px 10px !important;
      min-width: 62px !important;
      max-width: 120px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    #nav-auth .btn-primary,
    #nav-auth button {
      font-size: 11px !important;
      padding: 8px 11px !important;
      min-width: 70px !important;
      white-space: nowrap !important;
      flex: 0 0 auto !important;
    }

    main > section:first-child,
    body > section:first-of-type,
    .hero,
    .hero-section,
    [class*="hero"],
    [class*="Hero"] {
      background: var(--sl-hero-bg) !important;
    }

    h1 { font-size: clamp(26px, 7vw, 38px) !important; line-height: 1.08 !important; }
    h2 { font-size: clamp(22px, 5.8vw, 32px) !important; line-height: 1.12 !important; }
    h3 { font-size: clamp(17px, 4.5vw, 22px) !important; }
    .hero-title,
    .search-title,
    [class*="hero"] h1,
    [class*="Hero"] h1 {
      font-size: clamp(27px, 7.4vw, 38px) !important;
      line-height: 1.08 !important;
      letter-spacing: -0.03em !important;
    }
    .hero p,
    .hero-section p,
    [class*="hero"] p,
    [class*="Hero"] p {
      font-size: 16px !important;
      line-height: 1.55 !important;
    }

    .fresha-search,
    form[class*="search"],
    div[class*="search"]:has(input) {
      border-radius: 24px !important;
      box-shadow: 0 2px 12px rgba(0,0,0,.07) !important;
    }
    .fresha-search input,
    .fresha-search .input,
    .fresha-search .input-search,
    form[class*="search"] input,
    div[class*="search"] input {
      min-height: 48px !important;
      font-size: 13px !important;
      padding-top: 11px !important;
      padding-bottom: 11px !important;
    }
    .fresha-search button,
    form[class*="search"] button,
    div[class*="search"] button {
      min-height: 48px !important;
      font-size: 13px !important;
      padding: 11px 18px !important;
    }

    .badge-verified,
    .fresha-card .badge-verified,
    .card-provider .badge-verified,
    .provider-card .badge-verified,
    span[class*="verified"],
    span[class*="Verified"] {
      font-size: 10px !important;
      padding: 4px 8px !important;
      line-height: 1.1 !important;
      border-radius: 999px !important;
      max-width: max-content !important;
      gap: 3px !important;
      background: rgba(0,168,98,.08) !important;
      color: #008f55 !important;
      white-space: nowrap !important;
    }

    .fresha-card h3,
    .card-provider h3,
    .provider-card h3 {
      font-size: 16px !important;
      line-height: 1.18 !important;
    }
    .fresha-card,
    .card-provider,
    .provider-card {
      font-size: 12px !important;
    }
    .fresha-card [style*="font-size"],
    .card-provider [style*="font-size"],
    .provider-card [style*="font-size"] {
      font-size: 12px !important;
    }
  }
</style>
<script id="salonlink-mobile-polish-script">
(function(){
  function updateNav(){
    var nav = document.querySelector('.nav-main');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateNav);
  else updateNav();
})();
</script>`

  return html.replace('</head>', patch + '</head>')
}
