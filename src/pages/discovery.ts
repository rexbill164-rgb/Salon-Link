import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const discoveryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Discover Services', `
<style>
  .filter-row { display:flex; gap:8px; align-items:center; overflow-x:auto; padding-bottom:4px; }
  .filter-row::-webkit-scrollbar { display:none; }
  @media(max-width:640px){ .filter-row { flex-wrap:nowrap; } }
  .cat-chip {
    flex-shrink:0; padding:9px 20px; border-radius:100px;
    font-size:12px; font-weight:600; letter-spacing:0.05em;
    cursor:pointer; transition:all 0.3s var(--ease-luxury); white-space:nowrap;
    background:transparent; border:1.5px solid var(--i-faint); color:var(--t-secondary);
  }
  .cat-chip:hover { border-color:var(--g-border); color:var(--t-primary); background:var(--g-dim); }
  .cat-chip.active { background:var(--g-main); color:#FFFFFF; border-color:var(--g-main); box-shadow:0 6px 18px rgba(160,120,48,0.3); }
  .filter-panel {
    background:#FFFFFF; border:1px solid var(--g-border); border-radius:var(--r-xl);
    padding:36px; margin-bottom:32px;
    animation:fadeUp 0.3s var(--ease-luxury) both;
    box-shadow:0 16px 48px rgba(160,120,48,0.12);
  }
  .prov-card {
    background:#FFFFFF; border:1px solid var(--i-faint); border-radius:var(--r-xl);
    overflow:hidden; cursor:pointer;
    transition:all 0.45s var(--ease-luxury); position:relative;
    box-shadow:0 2px 14px rgba(58,47,30,0.06);
  }
  .prov-card:hover { border-color:var(--g-border); transform:translateY(-7px); box-shadow:0 28px 60px rgba(160,120,48,0.16); }
  .prov-card:hover .prov-img-inner { transform:scale(1.05); }
  .prov-img-inner { transition:transform 0.6s var(--ease-luxury); width:100%; height:100%; object-fit:cover; }
  .radio-custom { display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer; }
  .radio-dot {
    width:16px; height:16px; border-radius:50%;
    border:1.5px solid var(--i-faint); display:flex; align-items:center;
    justify-content:center; transition:all 0.2s; flex-shrink:0;
  }
  .radio-custom.selected .radio-dot { border-color:var(--g-main); background:var(--g-main); }
  .radio-custom.selected .radio-dot::after { content:''; width:5px; height:5px; border-radius:50%; background:#FFFFFF; display:block; }
</style>
`)}
</head>
<body>
${navbar('discover')}

<div style="min-height:calc(100vh - 70px);padding:20px 0 120px;background:var(--c-deep);">
  <div class="container">

    <!-- ── PAGE HEADER ── -->
    <div style="margin-bottom:48px;" class="afu">
      <div class="eyebrow" style="margin-bottom:14px;"><i class="fas fa-compass" style="margin-right:7px;"></i>Find Your Professional</div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <h1 class="display-lg font-display">Discover <em class="gold-gradient">Beauty Services</em></h1>
        <button id="location-btn" onclick="detectLocation()" style="display:flex;align-items:center;gap:9px;height:48px;padding:0 22px;background:#FFFFFF;border:1.5px solid var(--i-faint);border-radius:100px;color:var(--t-secondary);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s;white-space:nowrap;" onmouseover="this.style.borderColor='var(--g-border)';this.style.color='var(--g-deep)'" onmouseout="if(!userLocation){this.style.borderColor='var(--i-faint)';this.style.color='var(--t-secondary)'}">
          <i class="fas fa-map-marker-alt" style="font-size:13px;"></i>
          📍 Near Me
        </button>
      </div>
    </div>

    <!-- ── SEARCH ROW ── -->
    <div class="filter-row afu-1" style="margin-bottom:22px;">
      <div style="flex:1;position:relative;">
        <i class="fas fa-search" style="position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--t-faint);pointer-events:none;font-size:14px;"></i>
        <input type="text" id="search" oninput="filterCards()" placeholder="Search salons, barbers, nail techs..." class="input" style="padding-left:50px;padding-right:50px;height:52px;border-radius:100px;background:#FFFFFF;font-size:14px;"/>
        <button onclick="clearSearch()" id="clear-btn" style="position:absolute;right:18px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--t-faint);cursor:pointer;display:none;font-size:18px;line-height:1;">×</button>
      </div>
      <button onclick="toggleFilters()" id="filter-toggle" style="display:flex;align-items:center;gap:9px;height:52px;padding:0 24px;background:#FFFFFF;border:1.5px solid var(--i-faint);border-radius:100px;color:var(--t-secondary);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s;white-space:nowrap;" onmouseover="this.style.borderColor='var(--g-border)';this.style.color='var(--g-deep)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.color='var(--t-secondary)'">
        <i class="fas fa-sliders-h" style="font-size:13px;"></i>
        <span id="filter-label">Filters</span>
        <span id="filter-count" style="display:none;background:var(--g-main);color:#FFFFFF;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:800;display:none;align-items:center;justify-content:center;margin-left:2px;">0</span>
      </button>
    </div>

    <!-- ── CATEGORY CHIPS ── -->
    <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:28px;" class="no-scrollbar afu-2">
      ${[
        {label:'All',          icon:'fas fa-th'},
        {label:'Hair Styling', icon:'fas fa-cut'},
        {label:'Barbing',      icon:'fas fa-male'},
        {label:'Nail Care',    icon:'fas fa-paint-brush'},
        {label:'Massage',      icon:'fas fa-spa'},
        {label:'Facials',      icon:'fas fa-leaf'},
        {label:'Lashes',       icon:'fas fa-eye'},
        {label:'Makeup',       icon:'fas fa-magic'},
        {label:'Bridal',       icon:'fas fa-ring'},
      ].map((cat,i)=>
        `<button onclick="filterCat('${cat.label}',this)" class="cat-chip ${i===0?'active':''}"><i class="${cat.icon}" style="margin-right:6px;font-size:11px;"></i>${cat.label}</button>`
      ).join('')}
    </div>

    <!-- ── FILTER PANEL ── -->
    <div id="filter-panel" style="display:none;">
      <div class="filter-panel">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:24px;">
          ${[
            {label:'Price Range',    key:'price',  opts:[['Any Price','all'],['Under GHS 50','0-50'],['GHS 50–100','50-100'],['GHS 100–200','100-200'],['GHS 200+','200+']]},
            {label:'Minimum Rating', key:'rating', opts:[['Any Rating','0'],['4.8+ Stars','4.8'],['4.5+ Stars','4.5'],['4.0+ Stars','4.0']]},
            {label:'Distance',       key:'dist',   opts:[['Anywhere','all'],['Within 2 km','2'],['Within 5 km','5'],['Within 10 km','10']]},
            {label:'Availability',   key:'avail',  opts:[['Any Time','all'],['Open Now','open'],['Verified Only','verified'],['Available Today','today']]},
          ].map(f=>`
            <div>
              <div class="eyebrow" style="margin-bottom:14px;">${f.label}</div>
              ${f.opts.map(([label,val],i)=>`
                <div class="radio-custom ${i===0?'selected':''}" data-group="${f.key}" data-val="${val}" onclick="selectFilter('${f.key}',this)">
                  <div class="radio-dot"></div>
                  <span style="font-size:13px;color:var(--t-secondary);font-weight:400;">${label}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:12px;margin-top:28px;padding-top:24px;border-top:1px solid var(--i-faint);">
          <button onclick="resetFilters()" class="btn-ghost" style="padding:10px 24px;">Reset All</button>
          <button onclick="applyFilters()" class="btn-primary" style="padding:10px 28px;font-size:12px;">
            <i class="fas fa-check" style="font-size:11px;"></i> Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- ── RESULTS BAR ── -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
      <p style="font-size:14px;color:var(--t-secondary);">
        <span id="count" style="color:var(--t-primary);font-weight:700;font-size:16px;">0</span>
        <span style="margin-left:6px;">professionals found</span>
      </p>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;color:var(--t-muted);">Sort by:</span>
        <select onchange="sortCards(this.value)" class="input" style="width:auto;padding:9px 36px 9px 14px;border-radius:100px;font-size:12px;background:#FFFFFF;-webkit-appearance:none;background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238A7A62%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>');background-repeat:no-repeat;background-position:right 12px center;background-size:11px;">
          <option>Top Rated</option>
          <option>Price: Low → High</option>
          <option>Price: High → Low</option>
          <option>Nearest First</option>
          <option>Most Reviews</option>
        </select>
      </div>
    </div>

    <!-- ── PROVIDER GRID ── -->
    <div id="providers-grid" class="grid-3">
      <!-- Skeleton loaders -->
      ${[1,2,3,4,5,6].map(()=>`
        <div style="background:#FFFFFF;border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <div style="height:200px;background:linear-gradient(90deg,var(--c-dark) 25%,var(--c-mid) 50%,var(--c-dark) 75%);background-size:400%;animation:shimmer 1.8s infinite;"></div>
          <div style="padding:22px;">
            <div style="height:18px;background:var(--c-dark);border-radius:6px;margin-bottom:10px;width:70%;animation:shimmer 1.8s infinite;background-size:400%;"></div>
            <div style="height:13px;background:var(--c-dark);border-radius:6px;margin-bottom:16px;width:50%;animation:shimmer 1.8s infinite;background-size:400%;"></div>
            <div style="height:40px;background:var(--c-dark);border-radius:100px;animation:shimmer 1.8s infinite;background-size:400%;"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="display:none;text-align:center;padding:100px 20px;">
      <div style="width:80px;height:80px;border-radius:50%;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
        <i class="fas fa-search" style="font-size:28px;color:var(--g-main);"></i>
      </div>
      <h3 class="font-display" style="font-size:24px;margin-bottom:12px;color:var(--t-primary);">No results found</h3>
      <p style="font-size:14px;color:var(--t-secondary);margin-bottom:28px;">Try adjusting your filters or search terms</p>
      <button onclick="clearSearch();resetFilters()" class="btn-outline">Clear All Filters</button>
    </div>

    <!-- Load more -->
    <div style="text-align:center;margin-top:64px;" id="load-more-wrap">
      <button onclick="loadMore()" class="btn-ghost" style="padding:14px 40px;font-size:13px;">
        Load More Providers
        <i class="fas fa-chevron-down" style="font-size:11px;"></i>
      </button>
    </div>

  </div>
</div>

${mobileNav('discover')}
${globalScripts()}

<script>
var filtersOpen = false;
var activeFilters = {};
var allProviders = [];
var activeCat = 'All';
var userLocation = null; // { lat, lng }

function goToProvider(id, isAvailable) {
  if (!isAvailable) {
    showToast('This provider is currently unavailable. You can still view their profile.', 'info');
    setTimeout(function() { window.location.href = '/provider/' + id; }, 1200);
    return;
  }
  window.location.href = '/provider/' + id;
}
function showFav(btn) { btn.innerHTML = '<i class="fas fa-heart" style="color:var(--s-red);font-size:14px;"></i>'; showToast('Saved to favourites', 'success'); }

// Haversine distance (km) between two lat/lng points
function haversineKm(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
          Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
          Math.sin(dLng/2)*Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function detectLocation() {
  var btn = document.getElementById('location-btn');
  if (btn) { btn.textContent = 'Detecting...'; btn.disabled = true; }
  if (!navigator.geolocation) {
    showToast('Location not supported on this browser', 'error');
    if (btn) { btn.textContent = '📍 Near Me'; btn.disabled = false; }
    return;
  }
  navigator.geolocation.getCurrentPosition(function(pos) {
    userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    // Re-sort providers by distance
    allProviders = allProviders.map(function(p) {
      if (p.location_lat && p.location_lng) {
        p.distance_km = haversineKm(userLocation.lat, userLocation.lng, p.location_lat, p.location_lng);
      } else {
        p.distance_km = 9999;
      }
      return p;
    });
    allProviders.sort(function(a, b) { return (a.distance_km||9999) - (b.distance_km||9999); });
    renderGrid();
    showToast('Showing nearest services first 📍', 'success');
    if (btn) { btn.textContent = '✓ Near Me'; btn.style.background = 'var(--g-main)'; btn.style.color = '#fff'; btn.disabled = false; }
  }, function() {
    showToast('Could not get your location. Please allow location access.', 'error');
    if (btn) { btn.textContent = '📍 Near Me'; btn.disabled = false; }
  });
}

// Provider images for variety
var providerImages = {
  hair_salon: [
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=75',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&q=75',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=75',
  ],
  barbershop: [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=75',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=480&q=75',
  ],
  nail_tech: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=75',
    'https://images.unsplash.com/photo-1604093024411-1e8b48aad80d?w=480&q=75',
  ],
  massage: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=75',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=480&q=75',
  ],
  lash_tech: [
    'https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=75',
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=480&q=75',
  ],
  facial: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=480&q=75',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&q=75',
  ],
  makeup: [
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=480&q=75',
    'https://images.unsplash.com/photo-1487412840181-b9dedc9e3b20?w=480&q=75',
  ]
};

function getProviderImage(cat, id) {
  var imgs = providerImages[cat] || providerImages.hair_salon;
  return imgs[(id - 1) % imgs.length];
}

function toggleFilters() {
  filtersOpen = !filtersOpen;
  var p = document.getElementById('filter-panel');
  p.style.display = filtersOpen ? 'block' : 'none';
  document.getElementById('filter-label').textContent = filtersOpen ? 'Hide' : 'Filters';
}

function selectFilter(group, el) {
  document.querySelectorAll('[data-group="' + group + '"]').forEach(function(e) { e.classList.remove('selected'); });
  el.classList.add('selected');
  activeFilters[group] = el.dataset.val;
}

function applyFilters() {
  toggleFilters();
  var cnt = Object.values(activeFilters).filter(function(v){ return v !== 'all' && v !== '0'; }).length;
  var fc = document.getElementById('filter-count');
  if (cnt > 0) { fc.style.display = 'inline-flex'; fc.textContent = cnt; } else { fc.style.display = 'none'; }
  showToast('Filters applied', 'success');
  renderGrid();
}

function resetFilters() {
  activeFilters = {};
  document.querySelectorAll('.radio-custom').forEach(function(el, i) { if (i % 4 === 0) el.classList.add('selected'); });
  document.getElementById('filter-count').style.display = 'none';
  showToast('Filters reset', 'info');
}

function filterCat(cat, btn) {
  document.querySelectorAll('.cat-chip').forEach(function(b) { b.className = 'cat-chip'; });
  btn.className = 'cat-chip active';
  activeCat = cat;
  renderGrid();
}

function renderGrid() {
  var q = (document.getElementById('search').value || '').toLowerCase();
  var catMap = {'Hair Styling':'hair_salon','Barbing':'barbershop','Nail Care':'nail_tech','Massage':'massage','Facials':'facial','Lashes':'lash_tech','Makeup':'makeup'};
  var filtered = allProviders.filter(function(p) {
    var matchCat = activeCat === 'All' || p.service_category === catMap[activeCat];
    var matchQ = !q || (p.business_name + ' ' + p.city + ' ' + p.service_category).toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  var grid = document.getElementById('providers-grid');
  if (filtered.length === 0) {
    grid.innerHTML = '';
    document.getElementById('empty-state').style.display = 'block';
    grid.style.display = 'none';
  } else {
    grid.innerHTML = filtered.map(buildProviderCard).join('');
    document.getElementById('empty-state').style.display = 'none';
    grid.style.display = '';
  }
  document.getElementById('count').textContent = filtered.length;
  document.getElementById('clear-btn').style.display = q ? 'block' : 'none';
}

function filterCards() { renderGrid(); }

function clearSearch() {
  document.getElementById('search').value = '';
  filterCards();
}

function sortCards(v) {
  if (v === 'Nearest First' && !userLocation) {
    showToast('Enable location first using the 📍 Near Me button', 'info');
    return;
  }
  allProviders.sort(function(a, b) {
    if (v === 'Price: Low → High') return (a.price_from||0) - (b.price_from||0);
    if (v === 'Price: High → Low') return (b.price_from||0) - (a.price_from||0);
    if (v === 'Most Reviews') return (b.total_reviews||0) - (a.total_reviews||0);
    if (v === 'Nearest First') return (a.distance_km||9999) - (b.distance_km||9999);
    return (parseFloat(b.rating)||0) - (parseFloat(a.rating)||0);
  });
  renderGrid();
}

function loadMore() { showToast('All providers loaded', 'info'); document.getElementById('load-more-wrap').style.display = 'none'; }

function buildProviderCard(p) {
  var catLabel = (p.service_category || '').replace(/_/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });
  var priceFrom = p.price_from ? 'GHS ' + Math.round(p.price_from/100) : 'GHS 40';
  // Use cover (background) first, then logo, then category placeholder
  var img = p.cover_url || p.logo_url || getProviderImage(p.service_category, p.id);
  var stars = Math.round(parseFloat(p.rating) || 4);
  // Provider is bookable if they accept bookings (verification is optional for booking)
  var isAccepting = !!p.is_accepting_bookings;
  var isVerified = !!p.is_verified;
  var isAvailable = isAccepting; // Only block if not accepting bookings
  var distLabel = (p.distance_km && p.distance_km < 9999)
    ? (p.distance_km < 1 ? Math.round(p.distance_km * 1000) + 'm away' : p.distance_km.toFixed(1) + 'km away')
    : (p.city || 'Accra');

  return '<div class="prov-card" data-search="' + (p.business_name + ' ' + p.city + ' ' + p.service_category).toLowerCase() +
    '" data-price="' + (p.price_from/100||0) + '" data-rating="' + p.rating + '" data-reviews="' + p.total_reviews + '"' +
    ' onclick="goToProvider(' + p.id + ',' + isAvailable + ')" style="' + (!isAccepting ? 'opacity:0.85;' : '') + '">' +
    '<div style="height:200px;position:relative;overflow:hidden;">' +
      '<img class="prov-img-inner" src="' + img + '" alt="' + p.business_name + '" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>' +
      (!isAccepting ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="background:rgba(0,0,0,0.7);color:#fff;font-size:11px;font-weight:700;padding:6px 14px;border-radius:100px;letter-spacing:0.05em;">NOT ACCEPTING BOOKINGS</span></div>' : '') +
      '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,9,0.3),transparent);pointer-events:none;"></div>' +
      '<div style="position:absolute;top:14px;left:14px;">' +
        (isVerified ? '<span class="badge badge-verified" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);"><i class="fas fa-shield-alt" style="font-size:8px;"></i> Verified</span>' :
          '<span class="badge badge-pending" style="background:rgba(255,255,255,0.92);">New</span>') +
      '</div>' +
      '<div style="position:absolute;top:14px;right:14px;">' +
        '<span class="badge ' + (isAccepting ? 'badge-live' : 'badge-closed') + '" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);">' +
          (isAccepting ? '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#1E8050;margin-right:3px;"></span>Open' : '<i class="far fa-clock" style="font-size:8px;margin-right:3px;"></i>Closed') +
        '</span>' +
      '</div>' +
      '<div style="position:absolute;bottom:12px;left:14px;font-size:11px;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:5px;">' +
        '<i class="fas fa-map-marker-alt" style="font-size:10px;"></i>' + distLabel +
      '</div>' +
    '</div>' +
    '<div style="padding:22px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">' +
        '<div><div class="font-display" style="font-size:18px;font-weight:600;margin-bottom:3px;color:var(--t-primary);">' + p.business_name + '</div>' +
          '<div style="font-size:12px;color:var(--t-muted);">' + catLabel + '</div></div>' +
        '<div style="text-align:right;flex-shrink:0;margin-left:10px;">' +
          '<div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:2px;">from</div>' +
          '<div class="font-display gold-gradient" style="font-size:19px;font-weight:600;">' + priceFrom + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:7px;margin-bottom:14px;">' +
        '<span class="stars" style="font-size:12px;">★★★★★</span>' +
        '<span style="font-size:13px;font-weight:700;color:var(--g-deep);">' + (p.rating || '4.8') + '</span>' +
        '<span style="font-size:11px;color:var(--t-muted);">(' + (p.total_reviews||0) + ' reviews)</span>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;">' +
        '<span class="tag"><i class="fas fa-tag" style="font-size:9px;margin-right:4px;"></i>' + catLabel + '</span>' +
        (p.service_count ? '<span class="tag">' + p.service_count + ' services</span>' : '') +
        (p.total_bookings ? '<span class="tag"><i class="fas fa-users" style="font-size:9px;margin-right:4px;"></i>' + p.total_bookings + ' clients</span>' : '') +
      '</div>' +
      '<div style="display:flex;gap:9px;">' +
        (isAccepting
          ? '<a href="/book/' + p.id + '" onclick="event.stopPropagation()" class="btn-primary" style="flex:1;justify-content:center;padding:11px 14px;font-size:11px;"><i class="far fa-calendar-check" style="font-size:11px;"></i> Book Now</a>'
          : '<button onclick="event.stopPropagation();goToProvider(' + p.id + ',false)" class="btn-ghost" style="flex:1;justify-content:center;padding:11px 14px;font-size:11px;opacity:0.7;"><i class="fas fa-eye" style="font-size:11px;"></i> View Profile</button>'
        ) +
        '<button onclick="event.stopPropagation();showFav(this)" class="btn-icon" title="Save" style="border-radius:12px;">' +
          '<i class="far fa-heart" style="font-size:14px;"></i>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

document.addEventListener('DOMContentLoaded', function() {
  // Silently try to get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var btn = document.getElementById('location-btn');
      if (btn) { btn.textContent = '✓ Near Me'; btn.style.background = 'var(--g-main)'; btn.style.color = '#fff'; }
    }, function() { /* location denied, that's okay */ });
  }

  axios.get('/api/providers').then(function(res) {
    allProviders = res.data.providers || [];
    // If we already have location, sort by distance
    if (userLocation) {
      allProviders = allProviders.map(function(p) {
        if (p.location_lat && p.location_lng) {
          p.distance_km = haversineKm(userLocation.lat, userLocation.lng, p.location_lat, p.location_lng);
        } else { p.distance_km = 9999; }
        return p;
      });
      allProviders.sort(function(a, b) { return (a.distance_km||9999) - (b.distance_km||9999); });
    }
    renderGrid();
  }).catch(function() {
    showToast('Could not load providers', 'error');
    document.getElementById('providers-grid').innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;">' +
      '<i class="fas fa-exclamation-circle" style="font-size:40px;color:var(--s-red);margin-bottom:20px;display:block;"></i>' +
      '<p style="color:var(--t-secondary);">Failed to load providers. Please refresh.</p></div>';
  });
});
</script>
</body></html>`
