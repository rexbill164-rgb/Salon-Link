const PREMIUM_CUSTOMER_STYLES = `
<style id="premium-customer-discover-booking-ui">
  body { background:#F7F7F5 !important; }
  .mobile-nav { border-radius:30px !important; box-shadow:0 18px 54px rgba(22,20,18,.18) !important; }

  body:has(#providers-grid) { background:#F7F7F5 !important; }
  #nav-main { background:rgba(255,255,255,.94) !important; border-bottom:1px solid rgba(20,18,16,.08) !important; box-shadow:0 12px 34px rgba(30,25,20,.06) !important; backdrop-filter:blur(20px) !important; }
  #nav-main a, #nav-main span { color:#111 !important; }
  #nav-main [style*="rgba(255,255,255,0.15)"] { background:#111 !important; }
  .disc-header { background:#F7F7F5 !important; padding:88px 0 30px !important; }
  .disc-header::before, .disc-header::after { display:none !important; }
  .disc-header h1 { color:#101010 !important; font-size:clamp(42px,10vw,78px) !important; line-height:.92 !important; letter-spacing:-.075em !important; max-width:760px; }
  .disc-header .container::before { content:'Beauty around you'; display:block; color:#8a8177; font-size:12px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; margin-bottom:10px; }
  .disc-header .container::after { content:'Browse trusted stylists, barbers, nail techs, makeup artists, and wellness pros with a softer mobile-first experience.'; display:block; color:#6f6a64; font-size:15px; line-height:1.55; max-width:540px; margin-top:-16px; }
  .disc-header input { color:#111 !important; }
  .disc-header input::placeholder { color:#9a948c !important; }
  .disc-header [onclick*="search-input-hidden"], .disc-header #location-btn, .disc-header #filter-btn { background:#fff !important; color:#111 !important; border:1px solid #e6e2dc !important; box-shadow:0 12px 30px rgba(30,25,20,.07) !important; }
  .filter-chip-row { gap:10px !important; padding:4px 0 10px !important; }
  .fchip { background:#fff !important; color:#302b26 !important; border:1px solid #e4dfd8 !important; border-radius:999px !important; padding:10px 15px !important; font-size:12px !important; font-weight:800 !important; box-shadow:0 8px 22px rgba(25,22,18,.045) !important; }
  .fchip.active { background:#111 !important; border-color:#111 !important; color:#fff !important; }
  .filter-panel { border-radius:28px !important; border:1px solid #e8e4df !important; box-shadow:0 18px 46px rgba(25,22,18,.08) !important; }
  .premium-discover-section { margin:28px 0 8px; }
  .premium-section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:14px; }
  .premium-section-title { font-size:clamp(24px,5vw,34px); line-height:1; letter-spacing:-.055em; font-weight:900; color:#111; margin:0; }
  .premium-section-meta { font-size:12px; font-weight:700; color:#8d867e; white-space:nowrap; }
  .premium-section-rail { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(220px,260px); gap:16px; overflow-x:auto; padding:2px 2px 12px; scroll-snap-type:x proximity; scrollbar-width:none; }
  .premium-section-rail::-webkit-scrollbar { display:none; }
  .pcard, .prov-card, .card-provider { border-radius:28px !important; border:1px solid #e9e5df !important; box-shadow:0 16px 38px rgba(28,24,19,.07) !important; background:#fff !important; overflow:hidden !important; }
  .pcard:hover, .prov-card:hover { transform:translateY(-4px) !important; box-shadow:0 22px 50px rgba(28,24,19,.11) !important; }
  .pcard-img { height:170px !important; border-radius:0 !important; }
  #providers-grid, .prov-grid { gap:16px !important; }
  .map-btn { bottom:112px !important; background:#111 !important; border-radius:999px !important; box-shadow:0 18px 44px rgba(0,0,0,.22) !important; }

  body:has(#step-progress) { background:#F7F7F5 !important; }
  body:has(#step-progress) > div[style*="padding:28px"] { background:#F7F7F5 !important; padding:22px 0 160px !important; }
  body:has(#step-progress) h1 { font-size:clamp(38px,9vw,72px) !important; line-height:.95 !important; letter-spacing:-.075em !important; font-weight:900 !important; color:#101010 !important; }
  #step-progress { background:#fff !important; border:1px solid #e8e4df !important; border-radius:999px !important; padding:12px 14px !important; box-shadow:0 14px 36px rgba(25,22,18,.06) !important; }
  .step-node { border-radius:50% !important; font-weight:900 !important; }
  .step-node.active, .step-node.done { background:#111 !important; color:#fff !important; }
  .step-line.done { background:#111 !important; }
  .premium-booking-provider-card { background:#fff; border:1px solid #e8e4df; border-radius:30px; padding:16px; display:flex; align-items:center; gap:14px; margin:-12px 0 24px; box-shadow:0 16px 42px rgba(25,22,18,.065); }
  .premium-booking-provider-avatar { width:56px; height:56px; border-radius:20px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .premium-booking-provider-name { font-size:18px; line-height:1.1; font-weight:900; letter-spacing:-.045em; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .premium-booking-provider-meta { font-size:12px; color:#746d65; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .step-panel { animation:fadeUp .35s var(--ease-luxury) both !important; }
  #step1, #step2, #step3, #step4 { background:#fff !important; border:1px solid #e8e4df !important; border-radius:32px !important; padding:24px !important; box-shadow:0 18px 46px rgba(25,22,18,.075) !important; }
  .service-select-item { display:grid !important; grid-template-columns:44px minmax(0,1fr) auto 28px !important; align-items:center !important; gap:14px !important; padding:16px !important; background:#fff !important; border:1.5px solid #ebe6df !important; border-radius:24px !important; box-shadow:0 10px 28px rgba(25,22,18,.045) !important; }
  .service-select-item:hover { border-color:#cfc7bd !important; transform:translateY(-2px); }
  .service-select-item.selected { border-color:#111 !important; background:#fbfaf8 !important; box-shadow:0 0 0 4px rgba(17,17,17,.05),0 16px 36px rgba(25,22,18,.08) !important; }
  .bk-section-card, .summary-sidebar, .pay-method { background:#fff !important; border-color:#e8e4df !important; border-radius:28px !important; box-shadow:0 12px 32px rgba(25,22,18,.055) !important; }
  .summary-sidebar { border-radius:32px !important; box-shadow:0 18px 46px rgba(25,22,18,.075) !important; }
  .time-chip { padding:12px 16px !important; border-radius:999px !important; background:#fff !important; border:1.5px solid #e4dfd8 !important; color:#111 !important; font-weight:900 !important; box-shadow:0 8px 20px rgba(25,22,18,.045) !important; }
  .time-chip:hover, .time-chip.selected { border-color:#111 !important; background:#111 !important; color:#fff !important; }
  .cal-day { border-radius:15px !important; font-weight:900 !important; color:#111; }
  .cal-day.selected { background:#111 !important; color:#fff !important; }
  .btn-primary { background:#111 !important; border-radius:999px !important; box-shadow:0 16px 34px rgba(0,0,0,.16) !important; }
  .btn-ghost { background:#fff !important; border-color:#e4dfd8 !important; color:#111 !important; }
  .input { background:#f7f6f3 !important; border-color:#e5dfd7 !important; border-radius:20px !important; }
  @media(max-width:720px){
    .premium-section-rail { grid-auto-columns:minmax(226px,72vw); }
    .pcard, .prov-card { border-radius:24px !important; }
    #step1, #step2, #step3, #step4 { padding:18px !important; border-radius:28px !important; }
    .summary-sidebar { position:relative !important; top:auto !important; }
    .service-select-item { grid-template-columns:40px minmax(0,1fr) 28px !important; gap:12px !important; padding:14px !important; }
    .service-select-item > div:nth-child(3), .service-select-item [style*="font-size:18px"] { grid-column:2 / 4; font-size:15px !important; }
  }
</style>`

const PREMIUM_CUSTOMER_SCRIPT = `
<script id="premium-customer-discover-booking-script">
(function(){
  function esc(value){ return String(value || '').replace(/[&<>\"']/g, function(ch){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[ch]; }); }
  function category(value){ return String(value || 'Beauty service').replace(/_/g,' ').replace(/\b\w/g,function(l){return l.toUpperCase();}); }
  function providerImage(p){ return p.cover_url || p.logo_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=520&q=78'; }
  function price(p){ return p.price_from ? 'from GHS ' + Math.round(Number(p.price_from)/100) : 'from GHS 40'; }
  function distance(p){ return p.distance_km && p.distance_km < 9999 ? (p.distance_km < 1 ? Math.round(p.distance_km*1000)+'m' : Number(p.distance_km).toFixed(1)+'km') : (p.city || 'Accra'); }
  function railCard(p){
    var rating = parseFloat(p.rating) || 4.8;
    var reviews = p.total_reviews || 0;
    return '<div class="pcard" onclick="location.href=\'/provider/' + esc(p.id) + '\'">' +
      '<div style="position:relative;overflow:hidden;"><img class="pcard-img" src="' + esc(providerImage(p)) + '" alt="' + esc(p.business_name || 'Provider') + '" loading="lazy" />' +
      (p.is_verified ? '<span style="position:absolute;top:12px;left:12px;background:rgba(255,255,255,.92);border-radius:999px;padding:6px 10px;font-size:10px;font-weight:800;color:#111;">Verified</span>' : '') +
      '<span style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,.92);border-radius:999px;padding:6px 10px;font-size:10px;font-weight:800;color:#111;">' + (p.is_accepting_bookings ? 'Open' : 'Closed') + '</span></div>' +
      '<div style="padding:14px 14px 16px;"><div style="font-size:16px;line-height:1.15;font-weight:900;color:#111;letter-spacing:-.035em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:8px;">' + esc(p.business_name || 'SalonLink provider') + '</div>' +
      '<div style="font-size:12px;color:#746d65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(p.city || 'Accra') + ' · ' + esc(distance(p)) + '</div>' +
      '<div style="font-size:12px;color:#746d65;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(category(p.service_category)) + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;"><div style="font-size:12px;font-weight:800;color:#111;">★ ' + rating.toFixed(1) + ' <span style="color:#8d867e;">(' + reviews + ')</span></div><div style="font-size:12px;font-weight:900;color:#111;white-space:nowrap;">' + esc(price(p)) + '</div></div>' +
      '<a href="/book/' + esc(p.id) + '" onclick="event.stopPropagation()" style="display:flex;align-items:center;justify-content:center;margin-top:13px;background:#111;color:#fff;border-radius:999px;padding:11px;font-size:12px;font-weight:800;text-decoration:none;">Book now</a></div></div>';
  }
  function section(id,title,meta){
    if (document.getElementById(id)) return document.getElementById(id).querySelector('.premium-section-rail');
    var grid = document.getElementById('providers-grid'); if (!grid || !grid.parentNode) return null;
    var sec = document.createElement('section'); sec.className='premium-discover-section'; sec.id=id;
    sec.innerHTML='<div class="premium-section-head"><h2 class="premium-section-title">'+title+'</h2><span class="premium-section-meta">'+meta+'</span></div><div class="premium-section-rail"></div>';
    grid.parentNode.insertBefore(sec, grid);
    return sec.querySelector('.premium-section-rail');
  }
  function renderRails(){
    if (location.pathname !== '/discover') return;
    var providers = Array.isArray(window.allProviders) ? window.allProviders : [];
    if (!providers.length) return;
    var top = providers.slice().sort(function(a,b){ return (Number(b.rating)||0)-(Number(a.rating)||0); });
    var verified = providers.slice().sort(function(a,b){ return (b.is_verified===true)-(a.is_verified===true) || (Number(b.rating)||0)-(Number(a.rating)||0); });
    var newest = providers.slice().reverse();
    var nearby = providers.slice().sort(function(a,b){ return (a.distance_km||9999)-(b.distance_km||9999); });
    var recentIds=[]; try { recentIds=JSON.parse(localStorage.getItem('sl_recent_provider_ids')||'[]'); } catch(e) {}
    var recent=recentIds.map(function(id){ return providers.find(function(p){ return String(p.id)===String(id); }); }).filter(Boolean);
    if (!recent.length) recent = providers.slice(0,6);
    [[section('premium-for-you','For You','Curated beauty picks'), verified], [section('premium-recent','Recently viewed', recentIds.length?'Based on your browsing':'Popular starting points'), recent], [section('premium-recommended','Recommended','Top rated picks'), top], [section('premium-new','New to SalonLink','Fresh profiles'), newest], [section('premium-nearby','Around you','Nearest first'), nearby]].forEach(function(pair){ if(pair[0]) pair[0].innerHTML = pair[1].slice(0,8).map(railCard).join(''); });
  }
  if (location.pathname === '/discover') {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(renderRails, 700); setTimeout(renderRails, 1500); });
    var oldRender = window.renderGrid; if (typeof oldRender === 'function') window.renderGrid = function(){ oldRender.apply(this, arguments); setTimeout(renderRails, 0); };
  }
  if (location.pathname.startsWith('/book/')) {
    document.addEventListener('DOMContentLoaded', function(){
      var progress = document.getElementById('step-progress');
      if (progress && !document.getElementById('premium-booking-provider-card')) {
        var card = document.createElement('section'); card.id='premium-booking-provider-card'; card.className='premium-booking-provider-card';
        card.innerHTML='<div class="premium-booking-provider-avatar">💇‍♀️</div><div style="min-width:0;flex:1;"><div class="premium-booking-provider-name" id="premium-booking-provider-name">Loading provider...</div><div class="premium-booking-provider-meta" id="premium-booking-provider-meta">Choose a service, then select your preferred date and time.</div></div>';
        progress.parentNode.insertBefore(card, progress.nextSibling);
      }
      function syncProvider(){
        var n=document.getElementById('sum-provider-name'); var l=document.getElementById('sum-provider-loc');
        var pn=document.getElementById('premium-booking-provider-name'); var pm=document.getElementById('premium-booking-provider-meta');
        if (pn && n && n.textContent && n.textContent !== 'Loading...') pn.textContent=n.textContent;
        if (pm && l && l.textContent) pm.textContent=l.textContent + ' · Select service and time';
      }
      setInterval(syncProvider, 600);
      var oldGo = window.goStep; if (typeof oldGo === 'function') window.goStep = function(n){ oldGo.apply(this, arguments); };
    });
  }
})();
</script>`

export function withPremiumCustomerRedesign(html: string): string {
  let next = html
  if (!next.includes('premium-customer-discover-booking-ui')) next = next.replace('</head>', PREMIUM_CUSTOMER_STYLES + '</head>')
  if (!next.includes('premium-customer-discover-booking-script')) next = next.replace('</body>', PREMIUM_CUSTOMER_SCRIPT + '</body>')
  return next
}
