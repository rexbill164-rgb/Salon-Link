import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const providerProfilePage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Profile', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  body { background: #F5F5F5; }
  .hero-cover { height:320px; position:relative; overflow:hidden; }
  .hero-cover img { width:100%; height:100%; object-fit:cover; }
  .avatar-ring { width:72px; height:72px; border-radius:18px; overflow:hidden; border:3px solid #FFFFFF; box-shadow:0 4px 16px rgba(0,0,0,0.15); position:relative; background:var(--g-dim); flex-shrink:0; }

  .service-item { display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--i-faint); cursor:pointer; transition:all 0.2s; gap:8px; }
  .service-item:hover { background:var(--g-dim); margin:0 -20px; padding-left:20px; padding-right:20px; border-radius:14px; border-bottom-color:transparent; }
  .service-item:last-child { border-bottom:none; }

  .time-slot { padding:9px 16px; border-radius:100px; background:#FFFFFF; border:1.5px solid var(--i-faint); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
  .time-slot:hover, .time-slot.selected { background:var(--g-main); border-color:var(--g-main); color:#FFFFFF; box-shadow:0 4px 14px rgba(0,0,0,0.18); }
  .time-slot.disabled { opacity:0.3; cursor:not-allowed; background:var(--c-dark); }

  .portfolio-grid { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:12px; }
  .portfolio-item { aspect-ratio:1; border-radius:14px; overflow:hidden; background:var(--c-raise); cursor:pointer; transition:all 0.3s var(--ease-luxury); border:1px solid var(--i-faint); position:relative; }
  .portfolio-item:hover { transform:scale(1.04); }
  .portfolio-item img { width:100%; height:100%; object-fit:cover; display:block; }
  .portfolio-empty { grid-column:1/-1; padding:32px 16px; text-align:center; color:var(--t-muted); font-size:13px; border:1px dashed var(--i-faint); border-radius:14px; background:rgba(255,255,255,0.55); }
  .portfolio-modal { position:fixed; inset:0; background:rgba(0,0,0,0.76); z-index:9999; display:none; align-items:center; justify-content:center; padding:22px; }
  .portfolio-modal.active { display:flex; }
  .portfolio-modal-content { position:relative; max-width:920px; width:100%; max-height:88vh; display:flex; align-items:center; justify-content:center; }
  .portfolio-modal-img { max-width:100%; max-height:86vh; border-radius:18px; object-fit:contain; background:#111; box-shadow:0 24px 80px rgba(0,0,0,0.4); }
  .portfolio-modal-close { position:absolute; top:-14px; right:-8px; width:42px; height:42px; border-radius:50%; border:none; background:#fff; color:#111; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 8px 24px rgba(0,0,0,0.25); }

  .prof-card { background:#FFFFFF; border:1px solid var(--i-faint); border-radius:20px; padding:22px; margin-bottom:16px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
  .reveal { opacity:1 !important; transform:none !important; }
  .profile-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; }

  .details-card { background:#fff; border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; }
  .detail-row { display:flex; align-items:center; gap:14px; padding:16px 18px; border-bottom:1px solid #edf0f5; }
  .detail-row:last-child { border-bottom:none; }
  .detail-icon { width:40px; height:40px; border-radius:12px; background:#eef4ff; color:#2563eb; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .detail-icon svg { width:18px; height:18px; }
  .detail-main { flex:1; min-width:0; font-size:14px; color:#111827; }
  .detail-muted { color:#6b7280; font-size:12px; margin-top:2px; }
  .detail-chevron { color:#64748b; flex-shrink:0; }
  .detail-open { color:#079455; font-weight:700; }
  .detail-map-preview { width:96px; height:56px; border-radius:8px; overflow:hidden; background:#e5e7eb; flex-shrink:0; }
  .share-location-btn { width:100%; margin-top:12px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:14px; border:1px solid var(--i-faint); background:#fff; color:#111827; padding:12px 14px; font-size:13px; font-weight:700; cursor:pointer; }
  .share-location-btn:hover { background:#f8fafc; }

  @media(max-width:960px) {
    .profile-layout { grid-template-columns:1fr !important; }
    .hero-cover { height:260px; }
  }
  @media(max-width:640px) {
    .portfolio-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
  }
  @media(max-width:480px) {
    .hero-cover { height:220px; }
    .hero-cover h1 { font-size:20px !important; }
  }
</style>
`)}
</head>
<body>
${navbar('')}
<!-- provider-gallery-real-images-v3 -->

<div class="hero-cover">
  <img id="profile-cover" src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1280&q=80" alt="Salon Cover" loading="lazy"/>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.65) 100%);"></div>
  <a href="/discover" style="position:absolute;top:20px;left:16px;display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:100px;padding:8px 14px;font-size:12px;font-weight:600;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,0.25);">
    <i class="fas fa-arrow-left" style="font-size:10px;"></i> Back
  </a>
  <div style="position:absolute;top:20px;right:16px;display:flex;gap:8px;align-items:center;">
    <span id="profile-status-badge" class="badge badge-closed" style="display:none;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);"></span>
    <button onclick="showToast('Saved to favourites ✦','success')" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.18);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.25);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;padding:24px 20px 20px;">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;">
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
          <span id="profile-verified-badge" class="badge badge-pending" style="display:none;"></span>
        </div>
        <h1 id="profile-name" class="font-display" style="font-size:28px;font-weight:700;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.4);margin-bottom:4px;line-height:1.2;">Loading...</h1>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span id="profile-category-loc" style="font-size:13px;color:rgba(255,255,255,0.85);">—</span>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="color:#F6C90E;font-size:12px;">★</span>
            <span id="profile-rating" style="font-weight:700;color:#fff;font-size:13px;">—</span>
            <span id="profile-review-count" style="font-size:11px;color:rgba(255,255,255,0.7);"></span>
          </div>
        </div>
      </div>
      <div class="avatar-ring" style="flex-shrink:0;">
        <img id="profile-avatar" src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=180&q=80" alt="Provider" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
      </div>
    </div>
    <a href="/book/${id}" class="btn-primary" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;width:100%;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Book Appointment
    </a>
  </div>
</div>

<div class="container" style="padding-bottom:120px;">
  <div class="profile-layout">
    <div>
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:20px;">About</div>
        <p id="profile-bio" style="font-size:14px;color:var(--t-secondary);line-height:1.9;font-weight:300;">Loading provider information...</p>
        <div style="display:flex;gap:24px;margin-top:28px;flex-wrap:wrap;">
          <div><div id="stat-reviews" class="font-display gold-gradient" style="font-size:28px;">—</div><div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">Reviews</div></div>
          <div><div id="stat-bookings" class="font-display gold-gradient" style="font-size:28px;">—</div><div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">Bookings</div></div>
          <div><div id="stat-price" class="font-display gold-gradient" style="font-size:28px;">—</div><div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">From (GHS)</div></div>
        </div>
      </div>

      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:24px;">Services & Pricing</div>
        <div id="services-grid"><div style="text-align:center;padding:32px;color:var(--t-muted);">Loading services...</div></div>
      </div>

      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div class="eyebrow">Portfolio</div>
          <button id="portfolio-view-all-btn" onclick="openPortfolioModal(0)" class="btn-ghost" style="font-size:11px;padding:8px 18px;display:none;">View All</button>
        </div>
        <div id="portfolio-grid" class="portfolio-grid"><div class="portfolio-empty">Loading portfolio...</div></div>
      </div>

      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
          <div class="eyebrow">Reviews</div>
          <div style="display:flex;align-items:center;gap:10px;"><div class="font-display gold-gradient" style="font-size:36px;">4.9</div><div><div class="stars" style="font-size:15px;">★★★★★</div><div style="font-size:11px;color:var(--t-muted);">128 reviews</div></div></div>
        </div>
        <div style="margin-bottom:36px;">
          <div class="rating-bar-wrap" style="margin-bottom:10px;"><span style="font-size:12px;color:var(--t-secondary);min-width:30px;">5★</span><div class="rating-bar"><div class="rating-bar-fill" style="width:88%;"></div></div><span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">88%</span></div>
          <div class="rating-bar-wrap" style="margin-bottom:10px;"><span style="font-size:12px;color:var(--t-secondary);min-width:30px;">4★</span><div class="rating-bar"><div class="rating-bar-fill" style="width:9%;"></div></div><span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">9%</span></div>
          <div class="rating-bar-wrap" style="margin-bottom:10px;"><span style="font-size:12px;color:var(--t-secondary);min-width:30px;">3★</span><div class="rating-bar"><div class="rating-bar-fill" style="width:2%;"></div></div><span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">2%</span></div>
          <div class="rating-bar-wrap" style="margin-bottom:10px;"><span style="font-size:12px;color:var(--t-secondary);min-width:30px;">2★</span><div class="rating-bar"><div class="rating-bar-fill" style="width:1%;"></div></div><span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">1%</span></div>
          <div class="rating-bar-wrap" style="margin-bottom:10px;"><span style="font-size:12px;color:var(--t-secondary);min-width:30px;">1★</span><div class="rating-bar"><div class="rating-bar-fill" style="width:0%;"></div></div><span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">0%</span></div>
        </div>
        <div id="reviews-list"><div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet for this provider.</div></div>
      </div>
    </div>

    <div>
      <div style="position:sticky;top:92px;display:flex;flex-direction:column;gap:20px;">
        <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:28px;" class="reveal">
          <div class="eyebrow" style="margin-bottom:20px;">Book This Provider</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;"><span style="font-size:13px;color:var(--t-secondary);">Starting from</span><span id="sidebar-price-from" class="font-display gold-gradient" style="font-size:28px;">—</span></div>
          <a href="/book/${id}" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;margin-bottom:12px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Book Appointment</a>
          <button onclick="showToast('Sending message...','info')" class="btn-outline" style="width:100%;justify-content:center;padding:12px;font-size:12px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Message Provider</button>
        </div>

        <div class="details-card reveal">
          <div class="detail-row">
            <div class="detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
            <div class="detail-main"><span id="detail-open-status" class="detail-open">Open</span> · <span id="detail-hours">Closes 8 pm</span></div>
            <div class="detail-chevron">⌄</div>
          </div>
          <div class="detail-row">
            <div class="detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div class="detail-main" id="info-location">Accra, Ghana</div>
            <div id="detail-map-preview" class="detail-map-preview" style="display:none;"></div>
          </div>
          <div class="detail-row">
            <div class="detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <div class="detail-main"><span id="detail-rating">—</span> <span style="color:#f5b301;letter-spacing:1px;">★★★★★</span> · <span id="detail-reviews">0 Reviews</span></div>
            <div class="detail-chevron">›</div>
          </div>
          <div class="detail-row">
            <div class="detail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.32 1.76.59 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.11a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.6.59A2 2 0 0 1 22 16.92z"/></svg></div>
            <div class="detail-main" id="info-phone">—</div>
            <div class="detail-chevron">›</div>
          </div>
          <div style="padding:16px 18px;">
            <div id="provider-map-wrap" style="display:none;">
              <div id="provider-map" style="width:100%;height:180px;border-radius:12px;border:1px solid var(--i-faint);overflow:hidden;"></div>
              <div id="map-distance" class="detail-muted" style="margin-top:6px;"></div>
              <button id="share-location-btn" class="share-location-btn" onclick="shareProviderLocation()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"/></svg> Share Location</button>
            </div>
          </div>
        </div>

        <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-lg);padding:22px;" class="reveal">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:16px;">🪪</span><span style="font-size:12px;color:var(--t-secondary);">Identity verified via Ghana Card</span></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;"><span style="font-size:16px;">🔒</span><span style="font-size:12px;color:var(--t-secondary);">Secure payments via Paystack</span></div>
          <div style="display:flex;align-items:center;gap:12px;"><span style="font-size:16px;">📸</span><span style="font-size:12px;color:var(--t-secondary);">Style history stored per client</span></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="portfolio-modal" class="portfolio-modal" onclick="closePortfolioModal(event)">
  <div class="portfolio-modal-content">
    <button class="portfolio-modal-close" onclick="closePortfolioModal(event)" aria-label="Close">×</button>
    <img id="portfolio-modal-img" class="portfolio-modal-img" src="" alt="Portfolio preview" />
  </div>
</div>

${mobileNav('')}
${globalScripts()}
<script>
window.__portfolioPhotos = [];
window.__currentProvider = null;

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, function(ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[ch];
  });
}

function setPortfolioEmpty() {
  var grid = document.getElementById('portfolio-grid');
  var btn = document.getElementById('portfolio-view-all-btn');
  if (grid) grid.innerHTML = '<div class="portfolio-empty">No portfolio images uploaded yet.</div>';
  if (btn) btn.style.display = 'none';
}

function renderPortfolio(photos) {
  var grid = document.getElementById('portfolio-grid');
  var btn = document.getElementById('portfolio-view-all-btn');
  if (!grid) return;
  var valid = (photos || []).filter(function(ph) { return ph && ph.image_url && Number(ph.is_logo || 0) === 0; });
  window.__portfolioPhotos = valid;
  if (!valid.length) { setPortfolioEmpty(); return; }
  grid.innerHTML = valid.map(function(ph, idx) {
    return '<div class="portfolio-item" onclick="openPortfolioModal(' + idx + ')"><img src="' + escapeHtml(ph.image_url) + '" alt="Provider portfolio image" loading="lazy" onerror="this.closest(\'.portfolio-item\').remove(); if(!document.querySelector(\'.portfolio-item\')) setPortfolioEmpty();" /></div>';
  }).join('');
  if (btn) btn.style.display = valid.length ? 'inline-flex' : 'none';
}

function loadPortfolio(providerId) {
  if (!providerId) { setPortfolioEmpty(); return; }
  fetch('/api/uploads/provider-gallery/' + encodeURIComponent(providerId) + '?ts=' + Date.now(), { credentials: 'same-origin' })
    .then(function(res) { if (!res.ok) throw new Error('Portfolio API failed: ' + res.status); return res.json(); })
    .then(function(data) {
      var photos = Array.isArray(data) ? data : (data.photos || data.images || data.gallery || []);
      renderPortfolio(photos);
    })
    .catch(function(err) { console.error('Portfolio load error', err); setPortfolioEmpty(); });
}

function openPortfolioModal(index) {
  var photos = window.__portfolioPhotos || [];
  if (!photos.length || !photos[index]) { setPortfolioEmpty(); return; }
  var modal = document.getElementById('portfolio-modal');
  var img = document.getElementById('portfolio-modal-img');
  if (img) img.src = photos[index].image_url;
  if (modal) modal.classList.add('active');
}

function closePortfolioModal(event) {
  if (event) event.stopPropagation();
  var modal = document.getElementById('portfolio-modal');
  var img = document.getElementById('portfolio-modal-img');
  if (modal) modal.classList.remove('active');
  if (img) img.src = '';
}

document.addEventListener('keydown', function(event) { if (event.key === 'Escape') closePortfolioModal(event); });

function shareProviderLocation() {
  var p = window.__currentProvider || {};
  var address = [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana';
  var mapsLink = p.location_lat && p.location_lng
    ? 'https://www.google.com/maps?q=' + encodeURIComponent(p.location_lat + ',' + p.location_lng)
    : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
  var profileLink = window.location.origin + window.location.pathname;
  var text = 'Check out ' + (p.business_name || 'this provider') + ' on SalonLink.\nLocation: ' + address + '\nMap: ' + mapsLink + '\nProfile: ' + profileLink;
  if (navigator.share) {
    navigator.share({ title: (p.business_name || 'SalonLink provider'), text: text, url: mapsLink }).catch(function(){});
    return;
  }
  var copyText = text;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(copyText).then(function(){ showToast('Location link copied','success'); }).catch(function(){ showToast('Copy failed','error'); });
  } else {
    showToast('Location link copied','success');
  }
}

(function() {
  var routeId = window.location.pathname.split('/').pop();
  axios.get('/api/providers/' + routeId).then(function(res) {
    var p = res.data.provider;
    var services = res.data.services || [];
    var reviews = res.data.reviews || [];
    if (!p) return;
    window.__currentProvider = p;
    loadPortfolio(p.id || routeId);

    var nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = p.business_name || 'Provider';
    var catLabel = (p.service_category || '').replace(/_/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });
    var catLocEl = document.getElementById('profile-category-loc');
    if (catLocEl) catLocEl.textContent = catLabel + (p.city ? ' · ' + p.city : '');
    var ratingEl = document.getElementById('profile-rating');
    if (ratingEl) ratingEl.textContent = p.total_reviews > 0 && p.rating > 0 ? parseFloat(p.rating).toFixed(1) : '—';
    var rcEl = document.getElementById('profile-review-count');
    if (rcEl) rcEl.textContent = p.total_reviews > 0 ? '(' + p.total_reviews + ' reviews)' : '';
    var detailRating = document.getElementById('detail-rating');
    if (detailRating) detailRating.textContent = p.total_reviews > 0 && p.rating > 0 ? parseFloat(p.rating).toFixed(1) : '—';
    var detailReviews = document.getElementById('detail-reviews');
    if (detailReviews) detailReviews.textContent = (p.total_reviews || 0) + ' Reviews';

    var statusBadge = document.getElementById('profile-status-badge');
    var openStatus = document.getElementById('detail-open-status');
    if (statusBadge) {
      statusBadge.style.display = 'inline-flex';
      if (p.is_accepting_bookings) {
        statusBadge.className = 'badge badge-live';
        statusBadge.innerHTML = '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open';
        if (openStatus) { openStatus.textContent = 'Open'; openStatus.className = 'detail-open'; }
      } else {
        statusBadge.className = 'badge badge-closed';
        statusBadge.textContent = 'Not Accepting Bookings';
        if (openStatus) { openStatus.textContent = 'Closed'; openStatus.className = ''; }
      }
    }

    var verifiedBadge = document.getElementById('profile-verified-badge');
    if (verifiedBadge) {
      verifiedBadge.style.display = 'inline-flex';
      if (p.is_verified && p.kyc_status === 'approved') {
        verifiedBadge.className = 'badge badge-verified';
        verifiedBadge.innerHTML = '<svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Verified';
      } else {
        verifiedBadge.className = 'badge badge-pending';
        verifiedBadge.textContent = 'New';
      }
    }

    var avatarSrc = p.avatar_url || p.logo_url;
    if (avatarSrc) { var avatarImg = document.getElementById('profile-avatar'); if (avatarImg) avatarImg.src = avatarSrc; }
    if (p.cover_url) { var coverImg = document.getElementById('profile-cover'); if (coverImg) coverImg.src = p.cover_url; }
    document.title = (p.business_name || 'Provider') + ' — SalonLink';

    var bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = p.bio || ((p.business_name || 'This provider') + ' offers professional beauty services in ' + (p.city || 'Accra') + '.');
    var statReviews = document.getElementById('stat-reviews'); if (statReviews) statReviews.textContent = p.total_reviews || 0;
    var statBookings = document.getElementById('stat-bookings'); if (statBookings) statBookings.textContent = p.total_bookings || 0;
    var statPrice = document.getElementById('stat-price'); if (statPrice && p.price_from) statPrice.textContent = Math.round(p.price_from / 100);

    var svcGrid = document.getElementById('services-grid');
    if (svcGrid) {
      if (services.length) {
        svcGrid.innerHTML = services.map(function(s, idx) {
          var priceGhs = Math.round((s.price || 0) / 100);
          var durMins = s.duration_minutes || 60;
          var durStr = durMins >= 60 ? (durMins / 60).toFixed(1).replace('.0','') + ' hr' + (durMins >= 120 ? 's' : '') : durMins + ' min';
          return '<div class="service-item" data-svc-id="' + s.id + '" onclick="bookService(this)" style="cursor:pointer;">' +
            '<div style="display:flex;align-items:center;gap:14px;"><div style="width:36px;height:36px;border-radius:10px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:16px;">✦</div><div><div style="display:flex;align-items:center;gap:9px;"><span style="font-size:14px;font-weight:600;">' + escapeHtml(s.name) + '</span>' + (idx === 0 ? '<span class="badge badge-gold" style="font-size:9px;">Popular</span>' : '') + '</div><div style="font-size:12px;color:var(--t-muted);margin-top:2px;">⏱ ' + durStr + '</div></div></div>' +
            '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;"><span class="font-display gold-gradient" style="font-size:18px;">GHS ' + priceGhs + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div></div>';
        }).join('');
        var sidebarPrice = document.getElementById('sidebar-price-from');
        if (sidebarPrice && services[0]) sidebarPrice.textContent = 'GHS ' + Math.round(services[0].price / 100);
      } else {
        svcGrid.innerHTML = '<div style="text-align:center;padding:32px;color:var(--t-muted);">No services listed yet</div>';
      }
    }

    var revList = document.getElementById('reviews-list');
    if (revList) {
      if (reviews.length) {
        revList.innerHTML = reviews.map(function(r) {
          return '<div style="padding:20px 0;border-bottom:1px solid var(--i-faint);"><div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;"><div style="width:38px;height:38px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--g-main);">' + escapeHtml((r.first_name || 'A').charAt(0)) + '</div><div><div style="font-size:13px;font-weight:700;">' + escapeHtml((r.first_name || '') + ' ' + (r.last_name || '')) + '</div><div style="color:var(--g-main);font-size:12px;">' + '★'.repeat(r.rating || 0) + '</div></div></div><p style="font-size:13px;color:var(--t-secondary);line-height:1.6;">' + escapeHtml(r.comment || '') + '</p></div>';
        }).join('');
      } else {
        revList.innerHTML = '<div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet — be the first to book!</div>';
      }
    }

    var fullLocation = [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana';
    var locEl = document.getElementById('info-location'); if (locEl) locEl.textContent = fullLocation;
    var phoneEl = document.getElementById('info-phone'); if (phoneEl) phoneEl.textContent = p.phone || '—';

    if (p.location_lat && p.location_lng) {
      var mapWrap = document.getElementById('provider-map-wrap'); if (mapWrap) mapWrap.style.display = 'block';
      function initProfileMap() {
        if (!window.L) { setTimeout(initProfileMap, 300); return; }
        var lat = parseFloat(p.location_lat); var lng = parseFloat(p.location_lng);
        var map = L.map('provider-map', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19, crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup('<strong>' + escapeHtml(p.business_name) + '</strong><br>' + escapeHtml(p.address || p.city || 'Accra')).openPopup();
        var preview = document.getElementById('detail-map-preview');
        if (preview) { preview.style.display = 'block'; preview.innerHTML = '<div style="width:100%;height:100%;background:linear-gradient(135deg,#e0f2fe,#bfdbfe);display:flex;align-items:center;justify-content:center;color:#ef4444;font-size:22px;">●</div>'; }
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            var R = 6371;
            var dLat = (lat - pos.coords.latitude) * Math.PI / 180;
            var dLng = (lng - pos.coords.longitude) * Math.PI / 180;
            var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(pos.coords.latitude*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
            var km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var distEl = document.getElementById('map-distance');
            if (distEl) distEl.textContent = '📍 ' + (km < 1 ? Math.round(km*1000) + 'm from your location' : km.toFixed(1) + 'km from your location');
          }, function(){});
        }
      }
      initProfileMap();
    }
  }).catch(function(e) { console.error('Provider load error', e); setPortfolioEmpty(); });
})();

function bookService(el) {
  var svcId = el.getAttribute('data-svc-id');
  var pid = window.location.pathname.split('/').pop();
  window.location.href = '/book/' + pid + (svcId ? '?service=' + svcId : '');
}
</script>
</body></html>`
