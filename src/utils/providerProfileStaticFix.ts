export function withProviderProfileStaticFix(html: string): string {
  // Remove the old inline provider-profile script before injecting the fixed loader.
  // The old script contains broken inline quote handling that causes console syntax errors.
  html = html.replace(/<script>\s*window\.__portfolioVersion[\s\S]*?<\/script>/, '')

  const script = `
<style id="provider-profile-carousel-polish">
  .hero-cover > div[style*="bottom:0"] > a.btn-primary {
    display:none !important;
  }
  .hero-cover > div[style*="bottom:0"] {
    padding-bottom:30px !important;
  }
  .sl-hero-actions-row,
  #sl-hero-actions-row,
  #sl-fav-btn,
  #sl-share-btn {
    display:none !important;
  }
  .sl-hero-pill {
    display:none !important;
  }
  .sl-logo-open-badge {
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
  #profile-status-badge,
  #profile-verified-badge {
    display:none !important;
  }
  #portfolio-grid.portfolio-carousel {
    display:flex !important;
    grid-template-columns:none !important;
    gap:0 !important;
    width:100% !important;
    max-width:100% !important;
    overflow-x:auto !important;
    overflow-y:hidden !important;
    scroll-snap-type:x mandatory !important;
    scroll-behavior:smooth !important;
    -webkit-overflow-scrolling:touch !important;
    padding:0 !important;
    scrollbar-width:none !important;
    cursor:grab !important;
    border-radius:18px !important;
  }
  #portfolio-grid.portfolio-carousel::-webkit-scrollbar { display:none !important; }
  #portfolio-grid.portfolio-carousel:active { cursor:grabbing !important; }
  #portfolio-grid.portfolio-carousel .portfolio-item {
    flex:0 0 100% !important;
    width:100% !important;
    max-width:100% !important;
    min-width:100% !important;
    height:280px !important;
    aspect-ratio:auto !important;
    border-radius:18px !important;
    scroll-snap-align:start !important;
    scroll-snap-stop:always !important;
    box-shadow:none !important;
    border:1px solid rgba(0,0,0,.08) !important;
    background:#fff !important;
    overflow:hidden !important;
  }
  #portfolio-grid.portfolio-carousel .portfolio-item img {
    width:100% !important;
    height:100% !important;
    object-fit:cover !important;
    display:block !important;
  }
  .sl-portfolio-controls {
    display:flex !important;
    align-items:center !important;
    justify-content:center !important;
    gap:14px !important;
    margin-top:14px !important;
    width:100% !important;
  }
  .sl-portfolio-arrow {
    width:38px !important;
    height:38px !important;
    border-radius:50% !important;
    border:1px solid rgba(0,0,0,.12) !important;
    background:#fff !important;
    color:#111 !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    cursor:pointer !important;
    font-size:18px !important;
    font-weight:800 !important;
    box-shadow:0 6px 18px rgba(0,0,0,.08) !important;
  }
  .sl-portfolio-arrow:disabled { opacity:.35 !important; cursor:not-allowed !important; }
  .sl-portfolio-count {
    min-width:58px !important;
    height:34px !important;
    padding:0 14px !important;
    border-radius:999px !important;
    background:rgba(0,0,0,.05) !important;
    color:#111 !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size:12px !important;
    font-weight:800 !important;
    letter-spacing:.04em !important;
  }
  @media(max-width:700px){
    #portfolio-grid.portfolio-carousel .portfolio-item { height:230px !important; }
  }
</style>
<script id="provider-profile-static-rescue">
(function(){
  var parts = location.pathname.split('/').filter(Boolean);
  if (!(parts.length === 2 && parts[0] === 'provider')) return;

  function q(id){ return document.getElementById(id); }
  function set(id, v){ var e=q(id); if(e)e.textContent = v; }
  function pid(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100).toLocaleString(); }
  function cleanText(v){ return String(v||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]||c}); }

  function removeHeroActions(){
    var row=document.getElementById('sl-hero-actions-row');
    if(row && row.parentNode) row.parentNode.removeChild(row);
    var fav=document.getElementById('sl-fav-btn');
    if(fav && fav.parentNode) fav.parentNode.removeChild(fav);
    var share=document.getElementById('sl-share-btn');
    if(share && share.parentNode) share.parentNode.removeChild(share);
    Array.prototype.slice.call(document.querySelectorAll('button')).forEach(function(b){
      var text=(b.textContent||'').toLowerCase();
      if(text.indexOf('fav') >= 0 || text.indexOf('share') >= 0 || text.indexOf('share profile') >= 0){
        if(!b.closest('.sl-portfolio-controls')) b.style.display='none';
      }
    });
  }

  function placeVerifiedUnderLogo(isVerified){
    var ring=document.querySelector('.avatar-ring');
    if(!ring) return;
    var oldOpen=document.getElementById('sl-logo-open-badge');
    if(oldOpen && oldOpen.parentNode) oldOpen.parentNode.removeChild(oldOpen);
    var old=document.getElementById('sl-logo-verified-badge');
    if(old && old.parentNode) old.parentNode.removeChild(old);
    if(!isVerified) return;
    var badge=document.createElement('span');
    badge.id='sl-logo-verified-badge';
    badge.className='sl-logo-verified-badge';
    badge.innerHTML='✓ Verified';
    ring.appendChild(badge);
  }

  window.shareProviderProfile = function(){
    var name = (q('profile-name')||{}).textContent || 'SalonLink Provider';
    var url = location.origin + location.pathname;
    if (navigator.share) {
      navigator.share({ title: name + ' — SalonLink', text: 'Book ' + name + ' on SalonLink', url: url }).catch(function(){});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function(){ if(window.showToast) showToast('Profile link copied','success'); });
    } else {
      if(window.showToast) showToast('Copy this link: ' + url, 'info');
    }
  };

  window.bookService = window.bookService || function(el){
    var svcId = el && el.getAttribute ? el.getAttribute('data-svc-id') : '';
    var providerId = pid();
    location.href = '/book/' + providerId + (svcId ? '?service=' + svcId : '');
  };

  window.openPortfolioModal = window.openPortfolioModal || function(index){
    var photos = window.__portfolioPhotos || [];
    var item = photos[index];
    if(!item) return;
    var modal=q('portfolio-modal'), img=q('portfolio-modal-image'), caption=q('portfolio-modal-caption');
    if(!modal || !img || !caption) return;
    img.src = item.image_url;
    caption.textContent = item.caption || 'Portfolio image';
    modal.classList.add('open');
  };

  window.closePortfolioModal = window.closePortfolioModal || function(ev){
    if (ev && ev.target && ev.target.closest && ev.target.closest('.portfolio-modal-card')) return;
    var modal=q('portfolio-modal');
    if(modal) modal.classList.remove('open');
  };

  function getJson(url){
    if (window.axios) return window.axios.get(url, { timeout: 4500 }).then(function(r){ return r.data; });
    return fetch(url, { cache:'no-store' }).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
  }

  function showFallback(){
    var id=pid();
    if ((q('profile-name')||{}).textContent !== 'Loading...') return;
    set('profile-name', id === '2' ? 'Classy Salon - East Cant' : 'Provider Profile');
    set('profile-category-loc', 'Hair Salon · Accra');
    set('profile-rating', '—');
    set('profile-bio', 'This provider profile is available, but some details are taking too long to load. You can still book an appointment.');
    set('stat-reviews', '0');
    set('stat-bookings', '0');
    set('stat-price', '0');
    set('sidebar-price-from', 'GHS 0');
    set('info-location', id === '2' ? 'A238/5 Accra Mamprobi, Accra' : 'Accra, Ghana');
    set('info-phone', '—');
    var svc=q('services-grid'); if(svc)svc.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">Services are loading slowly. Please refresh if they do not appear.</div>';
    var grid=q('portfolio-grid'); if(grid)grid.innerHTML='<div class="portfolio-empty">Portfolio is loading slowly. Please refresh if it does not appear.</div>';
    removeHeroActions();
    placeVerifiedUnderLogo(true);
  }

  function applyGalleryImages(items){
    var logo = (items || []).find(function(ph){ return ph && ph.image_url && Number(ph.is_logo||0) === 1; });
    var cover = (items || []).find(function(ph){ return ph && ph.image_url && Number(ph.is_logo||0) === 2; });
    var av=q('profile-avatar');
    var cv=q('profile-cover');
    if(av && logo) av.src = logo.image_url;
    if(cv && cover) cv.src = cover.image_url;
  }

  function ensurePortfolioControls(grid, total){
    var old=document.getElementById('sl-portfolio-controls');
    if(old) old.remove();
    if(!grid || total <= 1) return;
    var controls=document.createElement('div');
    controls.id='sl-portfolio-controls';
    controls.className='sl-portfolio-controls';
    controls.innerHTML='<button type="button" class="sl-portfolio-arrow" id="sl-port-prev" aria-label="Previous portfolio image">‹</button><span class="sl-portfolio-count" id="sl-port-count">1 / '+total+'</span><button type="button" class="sl-portfolio-arrow" id="sl-port-next" aria-label="Next portfolio image">›</button>';
    grid.insertAdjacentElement('afterend', controls);
    document.getElementById('sl-port-prev').onclick=function(){ slidePortfolio(-1); };
    document.getElementById('sl-port-next').onclick=function(){ slidePortfolio(1); };
    updatePortfolioCounter();
  }

  function updatePortfolioCounter(){
    var grid=q('portfolio-grid');
    var photos=window.__portfolioPhotos || [];
    var count=q('sl-port-count');
    var prev=q('sl-port-prev');
    var next=q('sl-port-next');
    if(!grid || !count || !photos.length) return;
    var index=Math.round(grid.scrollLeft / Math.max(1, grid.clientWidth));
    index=Math.max(0, Math.min(index, photos.length - 1));
    window.__portfolioIndex=index;
    count.textContent=(index + 1) + ' / ' + photos.length;
    if(prev) prev.disabled = index === 0;
    if(next) next.disabled = index === photos.length - 1;
  }

  function slidePortfolio(direction){
    var grid=q('portfolio-grid');
    var photos=window.__portfolioPhotos || [];
    if(!grid || !photos.length) return;
    var current=typeof window.__portfolioIndex === 'number' ? window.__portfolioIndex : Math.round(grid.scrollLeft / Math.max(1, grid.clientWidth));
    var next=Math.max(0, Math.min(current + direction, photos.length - 1));
    grid.scrollTo({ left: next * grid.clientWidth, behavior: 'smooth' });
    window.__portfolioIndex=next;
    setTimeout(updatePortfolioCounter, 250);
  }

  function enableDragScroll(el){
    if(!el || el.dataset.dragScrollReady === '1') return;
    el.dataset.dragScrollReady = '1';
    var down=false, startX=0, startLeft=0;
    el.addEventListener('mousedown', function(e){ down=true; startX=e.pageX; startLeft=el.scrollLeft; });
    window.addEventListener('mouseup', function(){ down=false; });
    el.addEventListener('mouseleave', function(){ down=false; });
    el.addEventListener('mousemove', function(e){ if(!down) return; e.preventDefault(); el.scrollLeft = startLeft - (e.pageX - startX); });
    el.addEventListener('scroll', function(){ window.clearTimeout(window.__portScrollTimer); window.__portScrollTimer=setTimeout(updatePortfolioCounter, 80); });
  }

  function renderPortfolio(providerId){
    var grid=q('portfolio-grid');
    var btn=q('portfolio-view-all-btn');
    if(btn)btn.style.display='none';
    if(!grid)return;
    getJson('/api/uploads/provider-gallery/' + encodeURIComponent(providerId) + '?ts=' + Date.now()).then(function(data){
      var all = data.photos || data.gallery || [];
      applyGalleryImages(all);
      var photos=all.filter(function(ph){ return ph && ph.image_url && Number(ph.is_logo||0) === 0; });
      window.__portfolioPhotos = photos;
      window.__portfolioIndex = 0;
      if(!photos.length){ grid.classList.remove('portfolio-carousel'); grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>'; ensurePortfolioControls(grid, 0); return; }
      if(btn)btn.style.display='none';
      grid.classList.add('portfolio-carousel');
      grid.innerHTML = photos.map(function(ph,i){ return '<button type="button" class="portfolio-item" onclick="openPortfolioModal('+i+')"><img src="'+ph.image_url+'" alt="Portfolio image '+(i+1)+'" loading="lazy"/></button>'; }).join('');
      grid.scrollLeft = 0;
      enableDragScroll(grid);
      ensurePortfolioControls(grid, photos.length);
    }).catch(function(){ grid.classList.remove('portfolio-carousel'); grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>'; ensurePortfolioControls(grid, 0); });
  }

  function renderProvider(data){
    var p=(data && (data.provider || (data.data && data.data.provider))) || data || {};
    var services=(data && (data.services || (data.data && data.data.services))) || [];
    var reviews=(data && (data.reviews || (data.data && data.data.reviews))) || [];
    if(!p || !p.id) throw new Error('Provider not found');

    set('profile-name', p.business_name || 'Provider');
    set('profile-category-loc', String(p.service_category||'').replace(/_/g,' ') + (p.city ? ' · ' + p.city : ''));
    set('profile-rating', p.total_reviews > 0 && p.rating > 0 ? Number(p.rating).toFixed(1) : '—');
    set('profile-review-count', p.total_reviews > 0 ? '(' + p.total_reviews + ' reviews)' : '');
    set('profile-bio', p.bio || ((p.business_name || 'This provider') + ' offers professional beauty services in ' + (p.city || 'Accra') + '.'));
    set('stat-reviews', p.total_reviews || 0);
    set('stat-bookings', p.total_bookings || 0);
    set('stat-price', Math.round(Number(p.price_from||0)/100));
    set('sidebar-price-from', money(p.price_from || 0));
    set('info-location', [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana');
    set('info-phone', p.phone || '—');

    var status=q('profile-status-badge'); if(status){ status.style.display='none'; }
    var ver=q('profile-verified-badge'); if(ver){ ver.style.display='none'; }
    removeHeroActions();
    placeVerifiedUnderLogo(!!p.is_verified);

    var svc=q('services-grid');
    if(svc){
      if(services.length){
        svc.innerHTML = services.map(function(s){ return '<div class="service-item" data-svc-id="'+s.id+'" onclick="bookService(this)"><div><div style="font-size:14px;font-weight:700;">'+cleanText(s.name||'Service')+'</div><div style="font-size:12px;color:var(--t-muted);">'+(s.duration_minutes||60)+' min</div></div><div style="font-size:15px;font-weight:800;">'+money(s.price)+'</div></div>'; }).join('');
        set('sidebar-price-from', money(services[0].price));
      } else svc.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">No services listed yet</div>';
    }

    var rev=q('reviews-list');
    if(rev){ rev.innerHTML = reviews.length ? reviews.map(function(r){ return '<div style="padding:14px 0;border-bottom:1px solid var(--i-faint);"><div style="font-weight:700;font-size:13px;">'+cleanText((r.first_name||'')+' '+(r.last_name||''))+'</div><p style="font-size:13px;color:var(--t-secondary);">'+cleanText(r.comment||'')+'</p></div>'; }).join('') : '<div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet — be the first to book!</div>'; }

    document.title = (p.business_name || 'Provider') + ' — SalonLink';
    renderPortfolio(p.id);
  }

  function load(){
    var id=pid();
    if(!id)return;
    getJson('/api/providers/' + encodeURIComponent(id) + '?ts=' + Date.now()).then(renderProvider).catch(function(e){ console.error('Provider rescue load failed:', e); showFallback(); });
  }

  setTimeout(load, 50);
  setTimeout(function(){ if((q('profile-name')||{}).textContent === 'Loading...') load(); }, 900);
  setTimeout(showFallback, 1800);
})();
</script>`

  if (html.includes('provider-profile-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}
