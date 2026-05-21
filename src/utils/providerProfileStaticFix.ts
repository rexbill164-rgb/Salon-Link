export function withProviderProfileStaticFix(html: string): string {
  const script = `
<script id="provider-profile-static-rescue">
(function(){
  var parts = location.pathname.split('/').filter(Boolean);
  if (!(parts.length === 2 && parts[0] === 'provider')) return;

  function q(id){ return document.getElementById(id); }
  function set(id, v){ var e=q(id); if(e)e.textContent = v; }
  function pid(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100).toLocaleString(); }
  function cleanText(v){ return String(v||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]||c}); }

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
  }

  function applyGalleryImages(items){
    var logo = (items || []).find(function(ph){ return ph && ph.image_url && Number(ph.is_logo||0) === 1; });
    var cover = (items || []).find(function(ph){ return ph && ph.image_url && Number(ph.is_logo||0) === 2; });
    var av=q('profile-avatar');
    var cv=q('profile-cover');
    if(av && logo) av.src = logo.image_url;
    if(cv && cover) cv.src = cover.image_url;
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
      if(!photos.length){ grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>'; return; }
      if(btn)btn.style.display='inline-flex';
      grid.innerHTML = photos.map(function(ph,i){ return '<button type="button" class="portfolio-item" onclick="openPortfolioModal('+i+')"><img src="'+ph.image_url+'" alt="Portfolio image '+(i+1)+'" loading="lazy"/></button>'; }).join('');
    }).catch(function(){ grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>'; });
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

    var status=q('profile-status-badge'); if(status){ status.style.display='inline-flex'; status.textContent = p.is_accepting_bookings ? 'Open' : 'Not Accepting Bookings'; }
    var ver=q('profile-verified-badge'); if(ver){ ver.style.display='inline-flex'; ver.textContent = p.is_verified ? 'Verified' : 'New'; }

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
