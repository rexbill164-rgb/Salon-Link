export function withDiscoverReferenceLayout(html: string): string {
  const style = `
<style id="discover-reference-layout">
  body { background:#FFFFFF !important; }
  #nav-main { background:rgba(255,255,255,.96)!important; border-bottom:1px solid rgba(0,0,0,.06)!important; box-shadow:0 2px 18px rgba(0,0,0,.04)!important; }
  #nav-main a span, #nav-main a, #nav-main i { color:#111!important; }
  #nav-main div[style*="background:rgba(255,255,255,0.15)"] { background:#111!important; border-color:#111!important; }
  #nav-main div[style*="background:rgba(255,255,255,0.15)"] i { color:#fff!important; }
  .disc-header { background:#FFFFFF!important; padding:88px 0 32px!important; overflow:visible!important; }
  .disc-header::before,.disc-header::after { display:none!important; }
  .disc-header h1 { color:#111!important; font-size:44px!important; line-height:1.05!important; letter-spacing:-.045em!important; max-width:420px; }
  .disc-header h1::after { content:'For You'; display:block; font-size:0; }
  .disc-header .container { padding-top:20px!important; }
  .disc-header .container > div:first-child { margin-bottom:24px!important; }
  .disc-header .container > div:first-child h1 { font-size:0!important; }
  .disc-header .container > div:first-child h1::before { content:'For You'; font-size:42px; font-weight:900; color:#111; letter-spacing:-.04em; }
  .disc-header div[style*="background:rgba(255,255,255,0.12)"] { background:#F6F6F6!important; border:1px solid #E9E9E9!important; box-shadow:none!important; color:#111!important; }
  .disc-header div[style*="background:rgba(255,255,255,0.12)"] input { color:#111!important; }
  .disc-header div[style*="background:rgba(255,255,255,0.12)"] input::placeholder { color:#777!important; }
  .disc-header div[style*="background:rgba(255,255,255,0.12)"] i { color:#777!important; }
  #location-btn,#filter-btn { background:#F6F6F6!important; border:1px solid #E6E6E6!important; color:#111!important; border-radius:22px!important; box-shadow:none!important; }
  .filter-chip-row { margin-top:24px!important; padding-bottom:8px!important; }
  .fchip { background:#F4F4F4!important; border:1px solid #E5E5E5!important; color:#555!important; box-shadow:none!important; font-size:13px!important; padding:10px 18px!important; }
  .fchip.active { background:#111!important; color:#fff!important; border-color:#111!important; }
  .container { max-width:1180px!important; }
  div[style*="padding:20px 0 140px"] { padding-top:14px!important; background:#fff!important; }
  div[style*="padding:20px 0 140px"] .container::before { content:'Recommended'; display:block; font-size:30px; font-weight:900; color:#111; letter-spacing:-.03em; margin:10px 0 18px; }
  .prov-grid { grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:22px!important; }
  .pcard { border:none!important; box-shadow:none!important; border-radius:0!important; background:transparent!important; overflow:visible!important; }
  .pcard:hover { transform:none!important; box-shadow:none!important; }
  .pcard-img { height:220px!important; border-radius:18px!important; box-shadow:none!important; object-fit:cover!important; }
  .pcard > div:first-child { border-radius:18px!important; overflow:hidden!important; background:#eee!important; }
  .pcard > div:first-child div[style*="position:absolute;inset:0"] { display:none!important; }
  .pcard > div:nth-child(2) { padding:14px 0 0!important; background:transparent!important; }
  .pcard h3, .pcard div[style*="font-weight:800"], .pcard div[style*="font-size:15px"] { color:#111!important; font-size:18px!important; line-height:1.25!important; font-weight:900!important; letter-spacing:-.02em!important; }
  .pcard span, .pcard p, .pcard div { color:inherit; }
  .map-btn { display:none!important; }
  .mobile-nav { background:rgba(255,255,255,.90)!important; border:1px solid rgba(0,0,0,.08)!important; border-radius:32px!important; box-shadow:0 8px 34px rgba(0,0,0,.14)!important; }
  @media(max-width:640px){
    #nav-main { position:sticky!important; top:0!important; }
    #nav-main .hide-mob { display:none!important; }
    .disc-header { padding:28px 0 24px!important; }
    .disc-header .container { padding:0 22px!important; }
    .disc-header .container > div:first-child h1::before { font-size:34px!important; }
    .disc-header div[style*="display:flex;gap:10px"] { gap:10px!important; }
    .disc-header div[style*="background:#F6F6F6"] { min-height:54px!important; border-radius:28px!important; }
    #location-btn,#filter-btn { width:54px!important; height:54px!important; padding:0!important; justify-content:center!important; }
    .fchip { font-size:13px!important; padding:10px 17px!important; }
    div[style*="padding:20px 0 140px"] { padding:8px 0 140px!important; }
    div[style*="padding:20px 0 140px"] .container { padding:0 22px!important; }
    div[style*="padding:20px 0 140px"] .container::before { font-size:29px!important; margin:8px 0 18px!important; }
    .prov-grid { gap:18px 14px!important; }
    .pcard-img { height:170px!important; border-radius:18px!important; }
    .pcard div[style*="font-size:15px"], .pcard div[style*="font-weight:800"] { font-size:16px!important; }
    .pcard div[style*="padding:14px"] { padding:12px 0 0!important; }
    #load-more-wrap { margin-top:34px!important; }
  }
</style>`
  const script = `
<script id="discover-reference-layout-script">
(function(){
  if (location.pathname !== '/discover') return;
  function tune(){
    var count = document.getElementById('count');
    if (count && count.parentElement) count.parentElement.style.fontSize = '18px';
    document.querySelectorAll('.pcard').forEach(function(card){
      if (card.dataset.refined === '1') return;
      card.dataset.refined = '1';
      var book = card.querySelector('button, a');
      if (book && /book/i.test(book.textContent || '')) book.style.borderRadius = '999px';
    });
  }
  document.addEventListener('DOMContentLoaded', tune);
  if (window.MutationObserver) new MutationObserver(tune).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`
  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}

export function withBookingReferenceLayout(html: string): string {
  const style = `
<style id="booking-reference-layout">
  body { background:#FFFFFF!important; }
  .booking-layout { gap:28px!important; }
  .step-panel { background:#fff!important; }
  #step-progress { background:#fff!important; border:1px solid #eee; border-radius:24px; padding:16px!important; box-shadow:0 8px 26px rgba(0,0,0,.05); }
  .service-select-item, .pay-method { border-radius:22px!important; background:#fff!important; border:1px solid #eee!important; box-shadow:0 6px 22px rgba(0,0,0,.05)!important; }
  .service-select-item.selected, .pay-method.selected { border-color:#111!important; background:#F8F8F8!important; }
  .time-chip,.cal-day { border-radius:999px!important; }
  .btn-primary { border-radius:999px!important; min-height:50px!important; }
  .btn-ghost,.btn-outline { border-radius:999px!important; }
  textarea,input,select,.input { border-radius:18px!important; }
  [style*="position:sticky;top:92px"] > div { border-radius:28px!important; box-shadow:0 16px 44px rgba(0,0,0,.08)!important; }
  @media(max-width:900px){
    .container { padding-left:22px!important; padding-right:22px!important; }
    .booking-layout { grid-template-columns:1fr!important; }
    #step-progress { overflow-x:auto!important; }
    #step4 { padding-bottom:120px!important; }
    .step-panel { padding-bottom:100px!important; }
    .service-select-item { align-items:flex-start!important; gap:12px!important; }
    .service-select-item > div:first-child { min-width:0!important; }
    .service-select-item span, .service-select-item div { line-height:1.35!important; }
  }
</style>`
  const script = `
<script id="booking-reference-layout-script">
(function(){
  if (!location.pathname.startsWith('/book/')) return;
  function tune(){
    var title = document.querySelector('h1.display-lg');
    if (title) { title.style.fontSize = 'clamp(28px,6vw,42px)'; title.style.letterSpacing = '-.04em'; title.style.fontWeight = '900'; }
    document.querySelectorAll('.service-select-item').forEach(function(row){
      if (row.dataset.tuned === '1') return;
      row.dataset.tuned = '1';
      row.style.touchAction = 'manipulation';
    });
  }
  document.addEventListener('DOMContentLoaded', tune);
  if (window.MutationObserver) new MutationObserver(tune).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`
  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}
