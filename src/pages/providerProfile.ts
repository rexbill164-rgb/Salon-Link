import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const providerProfilePage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Profile', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  .hero-cover { height:380px; position:relative; overflow:hidden; }
  .hero-cover img { width:100%; height:100%; object-fit:cover; }
  .avatar-ring { width:90px; height:90px; border-radius:26px; overflow:hidden; border:3px solid #FFFFFF; box-shadow:0 4px 20px rgba(160,120,48,0.2); position:relative; background:var(--g-dim); }
  .service-item { display:flex; align-items:center; justify-content:space-between; padding:18px 0; border-bottom:1px solid var(--i-faint); cursor:pointer; transition:padding-left 0.3s; }
  .service-item:hover { padding-left:6px; }
  .service-item:last-child { border-bottom:none; }
  .time-slot { padding:10px 16px; border-radius:10px; background:var(--c-raise); border:1px solid var(--i-faint); font-size:13px; font-weight:500; cursor:pointer; transition:all 0.25s; text-align:center; }
  .time-slot:hover, .time-slot.selected { background:var(--g-dim); border-color:var(--g-main); color:var(--g-main); }
  .time-slot.disabled { opacity:0.3; cursor:not-allowed; background:var(--c-dark); }
  .portfolio-item { aspect-ratio:1; border-radius:14px; overflow:hidden; background:var(--c-raise); cursor:pointer; transition:all 0.35s var(--ease-luxury); display:flex; align-items:center; justify-content:center; font-size:36px; border:1px solid var(--i-faint); }
  .portfolio-item:hover { transform:scale(1.04); border-color:var(--g-border); }
  /* Override global reveal — make all cards immediately visible on this page */
  .reveal { opacity:1 !important; transform:none !important; }
</style>
`)}
</head>
<body style="background:var(--c-deep);">
${navbar('')}

<!-- ── HERO COVER ── -->
<div class="hero-cover">
  <img id="profile-cover" src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1280&q=80" alt="Salon Cover" loading="lazy"/>
  <!-- Strong gradient so name is always readable -->
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.65) 100%);"></div>
  <!-- Back button -->
  <a href="/discover" style="position:absolute;top:20px;left:16px;display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:100px;padding:8px 14px;font-size:12px;font-weight:600;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,0.25);">
    <i class="fas fa-arrow-left" style="font-size:10px;"></i> Back
  </a>
  <!-- Status + save overlaid top-right -->
  <div style="position:absolute;top:20px;right:16px;display:flex;gap:8px;align-items:center;">
    <span id="profile-status-badge" class="badge badge-closed" style="display:none;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);"></span>
    <button onclick="showToast('Saved to favourites ✦','success')" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.18);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.25);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
  </div>
  <!-- Name + info overlaid at bottom of cover -->
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
      <!-- Avatar -->
      <div class="avatar-ring" style="flex-shrink:0;">
        <img id="profile-avatar" src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=180&q=80" alt="Provider" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
      </div>
    </div>
    <!-- Book button -->
    <a href="/book/${id}" class="btn-primary" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;width:100%;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      Book Appointment
    </a>
  </div>
</div>

<!-- ── MAIN CONTENT ── -->
<div class="container" style="padding-bottom:120px;">
  <div style="display:grid;grid-template-columns:1fr 380px;gap:40px;" class="profile-layout">

    <!-- LEFT COLUMN -->
    <div>

      <!-- About -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:20px;">About</div>
        <p id="profile-bio" style="font-size:14px;color:var(--t-secondary);line-height:1.9;font-weight:300;">Loading provider information...</p>
        <div style="display:flex;gap:24px;margin-top:28px;flex-wrap:wrap;">
          <div>
            <div id="stat-reviews" class="font-display gold-gradient" style="font-size:28px;">—</div>
            <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">Reviews</div>
          </div>
          <div>
            <div id="stat-bookings" class="font-display gold-gradient" style="font-size:28px;">—</div>
            <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">Bookings</div>
          </div>
          <div>
            <div id="stat-price" class="font-display gold-gradient" style="font-size:28px;">—</div>
            <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">From (GHS)</div>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:24px;">Services & Pricing</div>
        <div id="services-grid">
          <div style="text-align:center;padding:32px;color:var(--t-muted);">Loading services...</div>
        </div>
      </div>

      <!-- Portfolio -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div class="eyebrow">Portfolio</div>
          <button onclick="showToast('Full portfolio coming soon','info')" class="btn-ghost" style="font-size:11px;padding:8px 18px;">View All</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
          ${['💇‍♀️','🌿','✨','💅','🎀','👑','🌺','💫'].map((e,i)=>`
            <div class="portfolio-item" onclick="showToast('Style ${i+1} preview coming soon','info')">${e}</div>
          `).join('')}
        </div>
      </div>

      <!-- Reviews -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
          <div class="eyebrow">Reviews</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="font-display gold-gradient" style="font-size:36px;">4.9</div>
            <div>
              <div class="stars" style="font-size:15px;">★★★★★</div>
              <div style="font-size:11px;color:var(--t-muted);">128 reviews</div>
            </div>
          </div>
        </div>

        <!-- Rating bars -->
        <div style="margin-bottom:36px;">
          ${[{stars:5,pct:88},{stars:4,pct:9},{stars:3,pct:2},{stars:2,pct:1},{stars:1,pct:0}].map(r=>`
            <div class="rating-bar-wrap" style="margin-bottom:10px;">
              <span style="font-size:12px;color:var(--t-secondary);min-width:30px;">${r.stars}★</span>
              <div class="rating-bar"><div class="rating-bar-fill" style="width:${r.pct}%;"></div></div>
              <span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">${r.pct}%</span>
            </div>
          `).join('')}
        </div>

        <!-- Individual reviews -->
        <div id="reviews-list">
          <div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet for this provider.</div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div>
      <div style="position:sticky;top:92px;display:flex;flex-direction:column;gap:20px;">

        <!-- Quick book card -->
        <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:28px;" class="reveal">
          <div class="eyebrow" style="margin-bottom:20px;">Book This Provider</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <span style="font-size:13px;color:var(--t-secondary);">Starting from</span>
            <span id="sidebar-price-from" class="font-display gold-gradient" style="font-size:28px;">—</span>
          </div>
          <a href="/book/${id}" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;margin-bottom:12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Appointment
          </a>
          <button onclick="showToast('Sending message...','info')" class="btn-outline" style="width:100%;justify-content:center;padding:12px;font-size:12px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message Provider
          </button>
        </div>

        <!-- Info card -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;" class="reveal">
          <div class="eyebrow" style="margin-bottom:20px;">Details</div>
          <div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;">
            <span style="font-size:18px;flex-shrink:0;">📍</span>
            <div><div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Location</div>
            <div style="font-size:13px;color:var(--t-primary);" id="info-location">Accra, Ghana</div></div>
          </div>
          <div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;">
            <span style="font-size:18px;flex-shrink:0;">📞</span>
            <div><div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Contact</div>
            <div style="font-size:13px;color:var(--t-primary);" id="info-phone">—</div></div>
          </div>
          <div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;">
            <span style="font-size:18px;flex-shrink:0;">💳</span>
            <div><div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Payment</div>
            <div style="font-size:13px;color:var(--t-primary);">MoMo · Card · Cash</div></div>
          </div>
          <!-- Map showing provider location -->
          <div id="provider-map-wrap" style="display:none;margin-top:8px;margin-bottom:4px;">
            <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:8px;">📍 Location on Map</div>
            <div id="provider-map" style="width:100%;height:180px;border-radius:12px;border:1px solid var(--i-faint);overflow:hidden;"></div>
            <div id="map-distance" style="font-size:11px;color:var(--t-muted);margin-top:6px;"></div>
          </div>
        </div>

        <!-- Trust signals -->
        <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-lg);padding:22px;" class="reveal">
          ${[
            {icon:'🪪',text:'Identity verified via Ghana Card'},
            {icon:'🔒',text:'Secure payments via Paystack'},
            {icon:'📸',text:'Style history stored per client'},
          ].map(t=>`
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;last-child:margin-bottom:0;">
              <span style="font-size:16px;">${t.icon}</span>
              <span style="font-size:12px;color:var(--t-secondary);">${t.text}</span>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  </div>
</div>

<style>
@media(max-width:900px){
  .profile-layout { grid-template-columns:1fr !important; }
}
</style>

${mobileNav('')}
${globalScripts()}
<script>
(function() {
  var id = window.location.pathname.split('/').pop();
  axios.get('/api/providers/' + id).then(function(res) {
    var p = res.data.provider;
    var services = res.data.services || [];
    var reviews = res.data.reviews || [];
    if (!p) return;

    // ── Header elements ──
    var nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = p.business_name || 'Provider';

    var catLabel = (p.service_category || '').replace(/_/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });
    var catLocEl = document.getElementById('profile-category-loc');
    if (catLocEl) catLocEl.textContent = catLabel + (p.city ? ' · ' + p.city : '');

    var ratingEl = document.getElementById('profile-rating');
    if (ratingEl) ratingEl.textContent = p.total_reviews > 0 && p.rating > 0 ? parseFloat(p.rating).toFixed(1) : '—';

    var rcEl = document.getElementById('profile-review-count');
    if (rcEl) rcEl.textContent = p.total_reviews > 0 ? '(' + p.total_reviews + ' reviews)' : '';

    // Status badge
    var statusBadge = document.getElementById('profile-status-badge');
    if (statusBadge) {
      statusBadge.style.display = 'inline-flex';
      if (p.is_accepting_bookings) {
        statusBadge.className = 'badge badge-live';
        statusBadge.innerHTML = '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open';
      } else {
        statusBadge.className = 'badge badge-closed';
        statusBadge.textContent = 'Not Accepting Bookings';
      }
    }

    // Verified badge
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

    // Avatar & cover
    var avatarSrc = p.avatar_url || p.logo_url;
    if (avatarSrc) {
      var avatarImg = document.getElementById('profile-avatar');
      if (avatarImg) avatarImg.src = avatarSrc;
    }
    if (p.cover_url) {
      var coverImg = document.getElementById('profile-cover');
      if (coverImg) coverImg.src = p.cover_url;
    }
    // Update page title
    document.title = (p.business_name || 'Provider') + ' — SalonLink';

    // ── About section ──
    var bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = p.bio || (p.business_name + ' offers professional beauty services in ' + (p.city || 'Accra') + '.');

    var statReviews = document.getElementById('stat-reviews');
    if (statReviews) statReviews.textContent = p.total_reviews || 0;
    var statBookings = document.getElementById('stat-bookings');
    if (statBookings) statBookings.textContent = p.total_bookings || 0;
    var statPrice = document.getElementById('stat-price');
    if (statPrice && p.price_from) statPrice.textContent = Math.round(p.price_from / 100);

    // ── Services grid ──
    var svcGrid = document.getElementById('services-grid');
    if (svcGrid) {
      if (services.length) {
        svcGrid.innerHTML = services.map(function(s, idx) {
          var priceGhs = Math.round((s.price || 0) / 100);
          var durMins = s.duration_minutes || 60;
          var durStr = durMins >= 60 ? (durMins / 60).toFixed(1).replace('.0','') + ' hr' + (durMins >= 120 ? 's' : '') : durMins + ' min';
          return '<div class="service-item" data-svc-id="' + s.id + '" onclick="bookService(this)" style="cursor:pointer;">' +
            '<div style="display:flex;align-items:center;gap:14px;">' +
              '<div style="width:36px;height:36px;border-radius:10px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:16px;">✦</div>' +
              '<div>' +
                '<div style="display:flex;align-items:center;gap:9px;">' +
                  '<span style="font-size:14px;font-weight:600;">' + s.name + '</span>' +
                  (idx === 0 ? '<span class="badge badge-gold" style="font-size:9px;">Popular</span>' : '') +
                '</div>' +
                '<div style="font-size:12px;color:var(--t-muted);margin-top:2px;">⏱ ' + durStr + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">' +
              '<span class="font-display gold-gradient" style="font-size:18px;">GHS ' + priceGhs + '</span>' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</div>' +
          '</div>';
        }).join('');

        // Update sidebar price
        var sidebarPrice = document.getElementById('sidebar-price-from');
        if (sidebarPrice && services[0]) sidebarPrice.textContent = 'GHS ' + Math.round(services[0].price / 100);
      } else {
        svcGrid.innerHTML = '<div style="text-align:center;padding:32px;color:var(--t-muted);">No services listed yet</div>';
      }
    }

    // ── Reviews ──
    var revRating = document.getElementById('review-rating-big');
    if (revRating) revRating.textContent = p.rating ? parseFloat(p.rating).toFixed(1) : '—';
    var revCount = document.getElementById('review-count-big');
    if (revCount) revCount.textContent = (p.total_reviews || 0) + ' reviews';

    var revList = document.getElementById('reviews-list');
    if (revList) {
      if (reviews.length) {
        revList.innerHTML = reviews.map(function(r) {
          return '<div style="padding:20px 0;border-bottom:1px solid var(--i-faint);">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">' +
              '<div style="width:38px;height:38px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--g-main);">' + (r.first_name || 'A').charAt(0) + '</div>' +
              '<div><div style="font-size:13px;font-weight:700;">' + (r.first_name || '') + ' ' + (r.last_name || '') + '</div>' +
                '<div style="color:var(--g-main);font-size:12px;">' + '★'.repeat(r.rating) + '</div>' +
              '</div>' +
            '</div>' +
            '<p style="font-size:13px;color:var(--t-secondary);line-height:1.6;">' + (r.comment || '') + '</p>' +
          '</div>';
        }).join('');
      } else {
        revList.innerHTML = '<div style="text-align:center;padding:24px;color:var(--t-muted);">No reviews yet — be the first to book!</div>';
      }
    }

    // ── Location & Map ──
    var locEl = document.getElementById('info-location');
    if (locEl) locEl.textContent = [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana';
    var phoneEl = document.getElementById('info-phone');
    if (phoneEl) phoneEl.textContent = p.phone || '—';

    // Show map if provider has coordinates
    if (p.location_lat && p.location_lng) {
      var mapWrap = document.getElementById('provider-map-wrap');
      if (mapWrap) mapWrap.style.display = 'block';
      // Initialize Leaflet map after DOM is ready
      function initProfileMap() {
        if (!window.L) { setTimeout(initProfileMap, 300); return; }
        var map = L.map('provider-map', { zoomControl: true, scrollWheelZoom: false })
          .setView([parseFloat(p.location_lat), parseFloat(p.location_lng)], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          crossOrigin: 'anonymous',
          referrerPolicy: 'no-referrer'
        }).addTo(map);
        var icon = L.divIcon({
          html: '<div style="background:linear-gradient(135deg,#C9A84C,#8B6914);width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"></div>',
          iconSize: [32,32], iconAnchor: [16,32], className: ''
        });
        L.marker([parseFloat(p.location_lat), parseFloat(p.location_lng)], { icon: icon })
          .addTo(map)
          .bindPopup('<strong>' + p.business_name + '</strong><br>' + (p.address || p.city || 'Accra'))
          .openPopup();
        // Show distance if customer location known
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            var R = 6371;
            var pLat = parseFloat(p.location_lat), pLng = parseFloat(p.location_lng);
            var dLat = (pLat - pos.coords.latitude) * Math.PI / 180;
            var dLng = (pLng - pos.coords.longitude) * Math.PI / 180;
            var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
                    Math.cos(pos.coords.latitude*Math.PI/180)*Math.cos(pLat*Math.PI/180)*
                    Math.sin(dLng/2)*Math.sin(dLng/2);
            var km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var distEl = document.getElementById('map-distance');
            if (distEl) distEl.textContent = '📍 ' + (km < 1 ? Math.round(km*1000) + 'm from your location' : km.toFixed(1) + 'km from your location');
          }, function(){});
        }
      }
      initProfileMap();
    }
  }).catch(function(e) { console.error('Provider load error', e); });
})();

function bookService(el) {
  var svcId = el.getAttribute('data-svc-id');
  var pid = window.location.pathname.split('/').pop();
  window.location.href = '/book/' + pid + (svcId ? '?service=' + svcId : '');
}
</script>
</body></html>`
