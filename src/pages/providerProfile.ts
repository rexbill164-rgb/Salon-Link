import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const providerProfilePage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Profile', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  body { background: #F5F5F5; }
  /* ── Fresha-style provider profile ── */
  .hero-cover { height:320px; position:relative; overflow:hidden; }
  .hero-cover img { width:100%; height:100%; object-fit:cover; }
  .avatar-ring { width:72px; height:72px; border-radius:18px; overflow:hidden; border:3px solid #FFFFFF; box-shadow:0 4px 16px rgba(0,0,0,0.15); position:relative; background:var(--g-dim); flex-shrink:0; }

  /* Service items */
  .service-item { display:flex; align-items:center; justify-content:space-between; padding:16px 0; border-bottom:1px solid var(--i-faint); cursor:pointer; transition:all 0.2s; gap:8px; }
  .service-item:hover { background:var(--g-dim); margin:0 -20px; padding-left:20px; padding-right:20px; border-radius:14px; border-bottom-color:transparent; }
  .service-item:last-child { border-bottom:none; }

  /* Time slots – Fresha pill style */
  .time-slot { padding:9px 16px; border-radius:100px; background:#FFFFFF; border:1.5px solid var(--i-faint); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,0.05); }
  .time-slot:hover, .time-slot.selected { background:var(--g-main); border-color:var(--g-main); color:#FFFFFF; box-shadow:0 4px 14px rgba(0,0,0,0.18); }
  .time-slot.disabled { opacity:0.3; cursor:not-allowed; background:var(--c-dark); }

  /* Clean blue detail icons */
  .detail-row-clean { display:flex; gap:14px; margin-bottom:18px; align-items:flex-start; }
  .detail-icon-blue { width:40px; height:40px; border-radius:12px; background:#eef4ff; color:#2563eb; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .detail-icon-blue i { font-size:16px; }
  .trust-row-clean { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
  .trust-row-clean:last-child { margin-bottom:0; }

  /* Portfolio */
  .portfolio-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .portfolio-item { aspect-ratio:1; border-radius:14px; overflow:hidden; background:var(--c-raise); cursor:pointer; transition:transform 0.2s; border:1px solid var(--i-faint); }
  .portfolio-item:hover { transform:scale(1.03); }
  .portfolio-item img { width:100%; height:100%; object-fit:cover; display:block; }
  .portfolio-empty { text-align:center; color:var(--t-muted); padding:24px 10px; border:1px dashed var(--i-faint); border-radius:12px; grid-column:1/-1; font-size:13px; }
  .portfolio-modal { position:fixed; inset:0; z-index:2200; background:rgba(0,0,0,.8); display:none; align-items:center; justify-content:center; padding:18px; }
  .portfolio-modal.open { display:flex; }
  .portfolio-modal-card { background:#fff; border-radius:14px; overflow:hidden; max-width:min(96vw,780px); }
  .portfolio-modal-card img { width:100%; max-height:80vh; object-fit:contain; background:#111; display:block; }
  .portfolio-modal-caption { font-size:13px; color:#444; padding:10px 12px; }

  /* Cards */
  .prof-card { background:#FFFFFF; border:1px solid var(--i-faint); border-radius:20px; padding:22px; margin-bottom:16px; box-shadow:0 2px 10px rgba(0,0,0,0.05); }

  /* Reveal always visible on profile page */
  .reveal { opacity:1 !important; transform:none !important; }

  /* Responsive layout */
  .profile-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; }
  @media(max-width:960px) {
    .profile-layout { grid-template-columns:1fr !important; }
    .hero-cover { height:260px; }
    .portfolio-grid { grid-template-columns:repeat(2,1fr); }
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
    <!-- Share Profile button -->
    <button onclick="shareProviderProfile()" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;width:100%;padding:12px 16px;border-radius:100px;border:1.5px solid rgba(255,255,255,0.35);background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">
      <i class="fas fa-share-nodes" style="font-size:13px;"></i>
      Share Profile
    </button>
  </div>
</div>

<!-- ── MAIN CONTENT ── -->
<div class="container" style="padding-bottom:120px;">
  <div class="profile-layout">

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
      <!-- provider-gallery-real-images-v2 -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div class="eyebrow">Portfolio</div>
          <button type="button" id="portfolio-view-all-btn" onclick="openPortfolioModal(0)" class="btn-ghost" style="font-size:11px;padding:8px 14px;">View All</button>
        </div>
        <div id="portfolio-grid" class="portfolio-grid"><div class="portfolio-empty">Loading portfolio...</div></div>
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

          <div class="detail-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Location</div>
              <div style="font-size:13px;color:var(--t-primary);" id="info-location">Accra, Ghana</div>
            </div>
          </div>

          <div class="detail-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-phone"></i>
            </div>
            <div>
              <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Contact</div>
              <div style="font-size:13px;color:var(--t-primary);" id="info-phone">—</div>
            </div>
          </div>

          <div class="detail-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-wallet"></i>
            </div>
            <div>
              <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">Payment</div>
              <div style="font-size:13px;color:var(--t-primary);">Pay at salon</div>
            </div>
          </div>

          <!-- Map showing provider location -->
          <div id="provider-map-wrap" style="display:none;margin-top:8px;margin-bottom:4px;">
            <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:8px;">Location on Map</div>
            <div id="provider-map" style="width:100%;height:180px;border-radius:12px;border:1px solid var(--i-faint);overflow:hidden;"></div>
            <div id="map-distance" style="font-size:11px;color:var(--t-muted);margin-top:6px;"></div>
            <button id="share-location-btn" onclick="shareProviderLocation()" style="width:100%;margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;border:1px solid var(--i-faint);background:#fff;color:#111827;padding:12px 14px;font-size:13px;font-weight:800;cursor:pointer;">
              <i class="fas fa-share-nodes"></i>
              Share Location
            </button>
          </div>
        </div>

        <!-- Trust signals -->
        <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-lg);padding:22px;" class="reveal">
          <div class="trust-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-id-card"></i>
            </div>
            <span style="font-size:12px;color:var(--t-secondary);">Identity verified via Ghana Card</span>
          </div>

          <div class="trust-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-lock"></i>
            </div>
            <span style="font-size:12px;color:var(--t-secondary);">Secure booking process</span>
          </div>

          <div class="trust-row-clean">
            <div class="detail-icon-blue">
              <i class="fas fa-images"></i>
            </div>
            <span style="font-size:12px;color:var(--t-secondary);">Style history stored per client</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

${mobileNav('')}
<div id="portfolio-modal" class="portfolio-modal" onclick="closePortfolioModal(event)">
  <div class="portfolio-modal-card">
    <img id="portfolio-modal-image" src="" alt="Portfolio preview" />
    <div id="portfolio-modal-caption" class="portfolio-modal-caption"></div>
  </div>
</div>
${globalScripts()}
<script>
window.__portfolioVersion = 'provider-gallery-real-images-v2';
(function() {
  var id = window.location.pathname.split('/').pop();

  function showProviderLoadError(message) {
    var nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = 'Provider unavailable';
    var bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = message || 'We could not load this provider right now. Please try again.';
    var svcGrid = document.getElementById('services-grid');
    if (svcGrid) svcGrid.innerHTML = '<div style="text-align:center;padding:32px;color:var(--t-muted);">Unable to load services right now.</div>';
    var sidebarPrice = document.getElementById('sidebar-price-from');
    if (sidebarPrice) sidebarPrice.textContent = '—';
  }

  function renderProvider(res) {
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

    // ── Portfolio (provider-specific images) ──
    var portfolioGrid = document.getElementById('portfolio-grid');
    var viewAllBtn = document.getElementById('portfolio-view-all-btn');
    if (viewAllBtn) viewAllBtn.style.display = 'none';
    if (portfolioGrid) {
      portfolioGrid.innerHTML = '<div class="portfolio-empty">Loading portfolio...</div>';
      var providerIdForGallery = (p && p.id) ? p.id : id;
      axios.get('/api/uploads/provider-gallery/' + providerIdForGallery + '?ts=' + Date.now()).then(function(gr) {
        // Filter: is_logo===0 means work photo, exclude logo (1) and cover (2)
        // Also accept is_logo===false (boolean) for compatibility
        var photos = (gr.data.photos || []).filter(function(ph) {
          if (!ph || !ph.image_url) return false;
          var val = ph.is_logo;
          return val === 0 || val === '0' || val === false;
        });
        if (!photos.length) {
          window.__portfolioPhotos = [];
          portfolioGrid.innerHTML = '<div class="portfolio-empty">No portfolio images uploaded yet.</div>';
          return;
        }
        // Render immediately — no Image() probe (causes false negatives with base64/CORS)
        window.__portfolioPhotos = photos;
        if (viewAllBtn) viewAllBtn.style.display = 'inline-flex';
        portfolioGrid.innerHTML = photos.map(function(ph, i) {
          return '<button type="button" class="portfolio-item" onclick="openPortfolioModal(' + i + ')">' +
            '<img src="' + ph.image_url + '" alt="Portfolio image ' + (i + 1) + '" loading="lazy" ' +
            'onerror="this.parentElement.style.display=\'none\'" />' +
          '</button>';
        }).join('');
      }).catch(function(err) {
        console.error('Portfolio fetch failed for provider:', providerIdForGallery, err);
        window.__portfolioPhotos = [];
        portfolioGrid.innerHTML = '<div class="portfolio-empty">No portfolio images uploaded yet.</div>';
      });
    }

    // ── Location & Map ──
    var locEl = document.getElementById('info-location');
    if (locEl) locEl.textContent = [p.address, p.city].filter(Boolean).join(', ') || 'Accra, Ghana';
    var phoneEl = document.getElementById('info-phone');
    if (phoneEl) phoneEl.textContent = p.phone || '—';

    // Show map if provider has valid coordinates
    var pLat = p.location_lat ? parseFloat(p.location_lat) : null;
    var pLng = p.location_lng ? parseFloat(p.location_lng) : null;
    if (pLat && pLng && !isNaN(pLat) && !isNaN(pLng)) {
      window.__providerLocation = { lat: pLat, lng: pLng };
      var mapWrap = document.getElementById('provider-map-wrap');
      if (mapWrap) mapWrap.style.display = 'block';
      var _profileMapInited = false;
      function initProfileMap() {
        if (_profileMapInited) return;
        if (!window.L) { setTimeout(initProfileMap, 400); return; }
        var mapEl = document.getElementById('provider-map');
        if (!mapEl) return;
        // Guard against double init (Leaflet throws if container already used)
        if (mapEl._leaflet_id) return;
        _profileMapInited = true;
        try {
          var map = L.map('provider-map', { zoomControl: true, scrollWheelZoom: false })
            .setView([pLat, pLng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
          }).addTo(map);
          var icon = L.divIcon({
            html: '<div style="background:linear-gradient(135deg,#C9A84C,#8B6914);width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>',
            iconSize: [32,32], iconAnchor: [16,32], className: ''
          });
          L.marker([pLat, pLng], { icon: icon })
            .addTo(map)
            .bindPopup('<strong>' + (p.business_name || 'Provider') + '</strong><br>' + (p.address || p.city || 'Accra'))
            .openPopup();
          // Distance calculation (non-blocking, graceful fail)
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              var R = 6371;
              var dLat = (pLat - pos.coords.latitude) * Math.PI / 180;
              var dLng = (pLng - pos.coords.longitude) * Math.PI / 180;
              var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
                      Math.cos(pos.coords.latitude*Math.PI/180)*Math.cos(pLat*Math.PI/180)*
                      Math.sin(dLng/2)*Math.sin(dLng/2);
              var km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              var distEl = document.getElementById('map-distance');
              if (distEl) distEl.textContent = km < 1 ? Math.round(km*1000) + 'm from your location' : km.toFixed(1) + 'km from your location';
            }, function(){}); // silently ignore geolocation denial
          }
        } catch(mapErr) {
          console.error('Profile map init failed:', mapErr);
          if (mapWrap) mapWrap.style.display = 'none';
        }
      }
      initProfileMap();
    }
  }

  function loadProvider() {
    return axios.get('/api/providers/' + id).then(function(res) {
      renderProvider(res);
    }).catch(function(e) {
      console.error('Provider load error', e);
      showProviderLoadError('We could not load this provider details right now. Please refresh and try again.');
    });
  }

  loadProvider();
})();

function bookService(el) {
  var svcId = el.getAttribute('data-svc-id');
  var pid = window.location.pathname.split('/').pop();
  window.location.href = '/book/' + pid + (svcId ? '?service=' + svcId : '');
}
function openPortfolioModal(index) {
  var photos = window.__portfolioPhotos || [];
  var item = photos[index];
  if (!item) return;
  var modal = document.getElementById('portfolio-modal');
  var img = document.getElementById('portfolio-modal-image');
  var caption = document.getElementById('portfolio-modal-caption');
  if (!modal || !img || !caption) return;
  img.src = item.image_url;
  caption.textContent = item.caption || 'Portfolio image';
  modal.classList.add('open');
}

function shareProviderProfile() {
  var providerName = (document.getElementById('profile-name') || {}).textContent || 'SalonLink Provider';
  var profileLink = window.location.origin + window.location.pathname;
  var text = 'Book an appointment with ' + providerName + ' on SalonLink: ' + profileLink;
  if (navigator.share) {
    navigator.share({ title: providerName + ' — SalonLink', text: text, url: profileLink }).catch(function(){});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(profileLink).then(function() {
      showToast('Profile link copied to clipboard \u2726', 'success');
    }).catch(function() {
      _fallbackCopyToClipboard(profileLink);
    });
  } else {
    _fallbackCopyToClipboard(profileLink);
  }
}

function _fallbackCopyToClipboard(text) {
  try {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Profile link copied \u2726', 'success');
  } catch(e) {
    showToast('Copy failed \u2014 share URL: ' + text, 'info');
  }
}

function shareProviderLocation() {
  var providerName = (document.getElementById('profile-name') || {}).textContent || 'SalonLink Provider';
  var address = (document.getElementById('info-location') || {}).textContent || 'Accra, Ghana';
  var profileLink = window.location.origin + window.location.pathname;
  var mapLink = '';
  if (window.__providerLocation && window.__providerLocation.lat && window.__providerLocation.lng) {
    mapLink = 'https://www.google.com/maps?q=' + encodeURIComponent(window.__providerLocation.lat + ',' + window.__providerLocation.lng);
  } else {
    mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
  }
  var text = 'Find ' + providerName + ' on SalonLink.\nLocation: ' + address + '\nMap: ' + mapLink + '\nProfile: ' + profileLink;
  if (navigator.share) {
    navigator.share({ title: providerName, text: text, url: mapLink }).catch(function(){});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(mapLink).then(function() {
      showToast('Location link copied \u2726', 'success');
    }).catch(function() { _fallbackCopyToClipboard(mapLink); });
  } else {
    _fallbackCopyToClipboard(mapLink);
  }
}

function closePortfolioModal(ev) {
  if (ev && ev.target && ev.target.closest && ev.target.closest('.portfolio-modal-card')) return;
  var modal = document.getElementById('portfolio-modal');
  if (modal) modal.classList.remove('open');
}
</script>
</body></html>`