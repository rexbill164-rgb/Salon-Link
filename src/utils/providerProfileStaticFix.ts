export function withProviderProfileStaticFix(html: string): string {
  const script = `
<script id="provider-profile-static-rescue">
(function(){
  if (!/^\/provider\/[^/]+$/.test(location.pathname)) return;

  function q(id){ return document.getElementById(id); }
  function set(id, v){ var e=q(id); if(e)e.textContent = v; }
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100).toLocaleString(); }
  function safe(v){ return String(v||'').replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]||c}); }
  function pid(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function getJson(url){
    if (window.axios) return window.axios.get(url).then(function(r){ return r.data; });
    return fetch(url, { cache: 'no-store' }).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); });
  }

  function renderPortfolio(providerId){
    var grid=q('portfolio-grid');
    var btn=q('portfolio-view-all-btn');
    if(btn)btn.style.display='none';
    if(!grid)return;
    getJson('/api/uploads/provider-gallery/' + encodeURIComponent(providerId) + '?ts=' + Date.now()).then(function(data){
      var photos=(data.photos||data.gallery||[]).filter(function(ph){
        var isLogo = Number(ph && ph.is_logo || 0);
        return ph && ph.image_url && isLogo === 0;
      });
      window.__portfolioPhotos = photos;
      if(!photos.length){ grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>'; return; }
      if(btn)btn.style.display='inline-flex';
      grid.innerHTML = photos.map(function(ph,i){
        return '<button type="button" class="portfolio-item" onclick="openPortfolioModal('+i+')"><img src="'+ph.image_url+'" alt="Portfolio image '+(i+1)+'" loading="lazy" onerror="this.parentElement.style.display=\'none\'"/></button>';
      }).join('');
    }).catch(function(){
      window.__portfolioPhotos=[];
      grid.innerHTML='<div class="portfolio-empty">No portfolio images uploaded yet.</div>';
    });
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
    if(p.price_from){ set('stat-price', Math.round(Number(p.price_from)/100)); set('sidebar-price-from', money(p.price_from)); }
    set('info-location', [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana');
    set('info-phone', p.phone || '—');

    var av=q('profile-avatar'); if(av && (p.avatar_url || p.logo_url)) av.src = p.avatar_url || p.logo_url;
    var cv=q('profile-cover'); if(cv && p.cover_url) cv.src = p.cover_url;

    var status=q('profile-status-badge');
    if(status){ status.style.display='inline-flex'; status.textContent = p.is_accepting_bookings ? 'Open' : 'Not Accepting Bookings'; }
    var ver=q('profile-verified-badge');
    if(ver){ ver.style.display='inline-flex'; ver.textContent = p.is_verified ? 'Verified' : 'New'; }

    var svc=q('services-grid');
    if(svc){
      if(services.length){
        svc.innerHTML = services.map(function(s,i){
          return '<div class="service-item" data-svc-id="'+s.id+'" onclick="bookService(this)"><div><div style="font-size:14px;font-weight:700;">'+safe(s.name||'Service')+'</div><div style="font-size:12px;color:var(--t-muted);">'+(s.duration_minutes||60)+' min</div></div><div style="font-size:15px;font-weight:800;">'+money(s.price)+'</div></div>';
        }).join('');
        set('sidebar-price-from', money(services[0].price));
      } else {
        svc.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">No services listed yet</div>';
      }
    }

    var rev=q('reviews-list');
    if(rev){
      rev.innerHTML = reviews.length ? reviews.map(function(r){ return '<div style="padding:14px 0;border-bottom:1px solid var(--i-faint);"><div style="font-weight:700;font-size:13px;">'+safe((r.first_name||'')+' '+(r.last_name||''))+'</div><div style="font-size:12px;color:var(--g-main);">'+'★'.repeat(Number(r.rating||0))+'</div><p style="font-size:13px;color:var(--t-secondary);">'+safe(r.comment||'')+'</p></div>'; }).join('') : '<div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet — be the first to book!</div>';
    }

    document.title = (p.business_name || 'Provider') + ' — SalonLink';
    renderPortfolio(p.id);
  }

  function load(){
    var id=pid();
    if(!id)return;
    getJson('/api/providers/' + encodeURIComponent(id) + '?ts=' + Date.now()).then(renderProvider).catch(function(e){
      console.error('Provider rescue load failed:', e);
      set('profile-name','Provider unavailable');
      set('profile-bio','We could not load this provider right now. Please refresh and try again.');
      var svc=q('services-grid'); if(svc)svc.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">Unable to load services right now.</div>';
      var grid=q('portfolio-grid'); if(grid)grid.innerHTML='<div class="portfolio-empty">Unable to load portfolio right now.</div>';
    });
  }

  setTimeout(load, 350);
  setTimeout(function(){ if((q('profile-name')||{}).textContent === 'Loading...') load(); }, 1200);
})();
</script>`

  if (html.includes('provider-profile-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}
