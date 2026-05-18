import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const discoveryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Discover Services', `
<style>
  /* ── Fresha-style Search Header ── */
  .search-header {
    background: linear-gradient(135deg, #f8f4ff 0%, #fce8f3 50%, #fff8f8 100%);
    padding: 32px 0 40px;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }

  /* ── Search bar ── */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border-radius: 100px;
    padding: 8px 8px 8px 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.06);
    transition: box-shadow 0.2s;
  }
  .search-bar:focus-within {
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }
  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    color: #101010;
    background: transparent;
    min-width: 0;
  }
  .search-bar input::placeholder { color: #888; }
  .search-bar-btn {
    background: #101010;
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .search-bar-btn:hover { background: #2a2a2a; }

  /* ── Filter chips ── */
  .filter-chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 20px 0 4px;
  }
  .filter-chips::-webkit-scrollbar { display: none; }
  .filter-chip {
    flex-shrink: 0;
    padding: 10px 20px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    color: #555;
    transition: all 0.2s;
  }
  .filter-chip:hover { border-color: #101010; color: #101010; }
  .filter-chip.active {
    background: #101010;
    color: #fff;
    border-color: #101010;
  }

  /* ── Provider grid ── */
  .provider-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media(max-width:1024px) { .provider-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width:768px) { .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
  @media(max-width:480px) { .provider-grid { grid-template-columns: 1fr 1fr; gap: 12px; } }

  /* ── Provider card (Fresha style) ── */
  .provider-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .provider-card:hover {
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transform: translateY(-4px);
  }
  .provider-card-img {
    position: relative;
    aspect-ratio: 4/3;
    overflow: hidden;
  }
  .provider-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .provider-card:hover .provider-card-img img { transform: scale(1.05); }
  .provider-card-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 6px;
  }
  .provider-card-heart {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #101010;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .provider-card-heart:hover { transform: scale(1.1); }
  .provider-card-content { padding: 14px 16px; }
  .provider-card-name {
    font-size: 15px;
    font-weight: 600;
    color: #101010;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .verified-badge {
    width: 16px;
    height: 16px;
    background: #00a862;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 9px;
  }
  .provider-card-meta {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
  }
  .provider-card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }
  .provider-card-rating .star { color: #101010; font-size: 14px; }
  .provider-card-rating .score { font-size: 14px; font-weight: 700; color: #101010; }
  .provider-card-rating .count { font-size: 13px; color: #888; }

  /* ── Filter panel ── */
  .filter-panel {
    background: #fff;
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 24px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .filter-group-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 12px;
  }
  .filter-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
  }
  .filter-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .filter-option.selected .filter-radio {
    border-color: #101010;
    background: #101010;
  }
  .filter-option.selected .filter-radio::after {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
  .filter-option-label {
    font-size: 14px;
    color: #333;
  }

  /* ── Results bar ── */
  .results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    flex-wrap: wrap;
    gap: 12px;
  }
  .results-count { font-size: 14px; color: #555; }
  .results-count strong { color: #101010; }
  .sort-select {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    padding: 10px 36px 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #101010;
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
    background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>');
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 14px;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }
  .empty-state-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 28px;
    color: #888;
  }
  .empty-state h3 {
    font-size: 20px;
    font-weight: 700;
    color: #101010;
    margin-bottom: 8px;
  }
  .empty-state p {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }

  /* ── Skeleton loader ── */
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 400%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
</style>
`)}
</head>
<body style="background:#fafafa;">
${navbar('discover')}

<!-- ══════════════════════════════════════════════
     SEARCH HEADER
══════════════════════════════════════════════ -->
<section class="search-header">
  <div class="container">
    <div style="max-width:680px;margin:0 auto;">
      <div class="search-bar">
        <i class="fas fa-search" style="color:#888;font-size:16px;"></i>
        <input id="search-input" type="text" oninput="filterCards()" placeholder="Search salons, services, locations..."/>
        <button class="search-bar-btn" onclick="filterCards()">Search</button>
      </div>

      <div class="filter-chips">
        ${[
          {label:'All', cat:'All'},
          {label:'Hair Salons', cat:'Hair Styling'},
          {label:'Barbershops', cat:'Barbing'},
          {label:'Nail Salons', cat:'Nail Care'},
          {label:'Massage', cat:'Massage'},
          {label:'Skincare', cat:'Facials'},
          {label:'Lashes', cat:'Lashes'},
          {label:'Makeup', cat:'Makeup'},
        ].map((c,i)=>
          `<button onclick="filterCat('${c.cat}',this)" class="filter-chip ${i===0?'active':''}">${c.label}</button>`
        ).join('')}
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     MAIN CONTENT
══════════════════════════════════════════════ -->
<main style="padding:32px 0 120px;">
  <div class="container">

    <!-- Filter panel (hidden by default) -->
    <div id="filter-panel" style="display:none;">
      <div class="filter-panel">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <h3 style="font-size:18px;font-weight:700;color:#101010;">Filters</h3>
          <button onclick="resetFilters()" style="background:none;border:none;color:#101010;font-size:14px;font-weight:500;cursor:pointer;text-decoration:underline;">Reset all</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:32px;">
          ${[
            {label:'Price Range', key:'price', opts:[['Any Price','all'],['Under GHS 50','0-50'],['GHS 50-100','50-100'],['GHS 100-200','100-200'],['GHS 200+','200+']]},
            {label:'Rating', key:'rating', opts:[['Any Rating','0'],['4.8+ Stars','4.8'],['4.5+ Stars','4.5'],['4.0+ Stars','4.0']]},
            {label:'Distance', key:'dist', opts:[['Anywhere','all'],['Within 2 km','2'],['Within 5 km','5'],['Within 10 km','10']]},
            {label:'Availability', key:'avail', opts:[['Any Time','all'],['Open Now','open'],['Verified Only','verified']]},
          ].map(f=>`
            <div>
              <div class="filter-group-title">${f.label}</div>
              ${f.opts.map(([label,val],i)=>`
                <div class="filter-option ${i===0?'selected':''}" data-group="${f.key}" data-val="${val}" onclick="selectFilter('${f.key}',this)">
                  <div class="filter-radio"></div>
                  <span class="filter-option-label">${label}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:12px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(0,0,0,0.06);">
          <button onclick="toggleFilters()" style="flex:1;background:#f5f5f5;border:none;border-radius:100px;padding:14px;font-size:14px;font-weight:500;cursor:pointer;color:#555;">Cancel</button>
          <button onclick="applyFilters()" style="flex:2;background:#101010;border:none;border-radius:100px;padding:14px;font-size:14px;font-weight:600;color:#fff;cursor:pointer;">Apply Filters</button>
        </div>
      </div>
    </div>

    <!-- Results bar -->
    <div class="results-bar">
      <p class="results-count"><strong id="count">0</strong> venues found</p>
      <div style="display:flex;align-items:center;gap:12px;">
        <button onclick="toggleFilters()" style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:100px;padding:10px 20px;font-size:14px;font-weight:500;cursor:pointer;color:#101010;">
          <i class="fas fa-sliders-h"></i> Filters
        </button>
        <button onclick="detectLocation()" id="location-btn" style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:100px;padding:10px 20px;font-size:14px;font-weight:500;cursor:pointer;color:#101010;">
          <i class="fas fa-map-marker-alt"></i> Near me
        </button>
        <select onchange="sortCards(this.value)" class="sort-select">
          <option>Top Rated</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Nearest First</option>
          <option>Most Reviews</option>
        </select>
      </div>
    </div>

    <!-- Provider grid -->
    <div id="providers-grid" class="provider-grid">
      ${[1,2,3,4,5,6,7,8].map(()=>`
        <div style="background:#fff;border-radius:16px;overflow:hidden;">
          <div style="aspect-ratio:4/3;" class="skeleton"></div>
          <div style="padding:14px 16px;">
            <div style="height:16px;margin-bottom:8px;width:70%;" class="skeleton"></div>
            <div style="height:12px;margin-bottom:8px;width:50%;" class="skeleton"></div>
            <div style="height:14px;width:40%;" class="skeleton"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Empty state -->
    <div id="empty-state" class="empty-state" style="display:none;">
      <div class="empty-state-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>No results found</h3>
      <p>Try adjusting your filters or search terms</p>
      <button onclick="clearSearch();resetFilters()" style="background:#101010;color:#fff;border:none;border-radius:100px;padding:14px 28px;font-size:14px;font-weight:600;cursor:pointer;">Clear Filters</button>
    </div>

    <!-- Load more -->
    <div id="load-more-wrap" style="text-align:center;margin-top:48px;">
      <button onclick="loadMore()" style="background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:100px;padding:14px 32px;font-size:14px;font-weight:500;cursor:pointer;color:#555;">
        Load more
      </button>
    </div>

  </div>
</main>

${mobileNav('discover')}
${globalScripts()}

<script>
var filtersOpen = false;
var activeFilters = {};
var allProviders = [];
var activeCat = 'All';
var userLocation = null;

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
  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...'; btn.disabled = true; }
  if (!navigator.geolocation) {
    showToast('Location not supported', 'error');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Near me'; btn.disabled = false; }
    return;
  }
  navigator.geolocation.getCurrentPosition(function(pos) {
    userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    allProviders = allProviders.map(function(p) {
      if (p.location_lat && p.location_lng) {
        p.distance_km = haversineKm(userLocation.lat, userLocation.lng, p.location_lat, p.location_lng);
      } else { p.distance_km = 9999; }
      return p;
    });
    allProviders.sort(function(a,b){ return (a.distance_km||9999)-(b.distance_km||9999); });
    renderGrid();
    showToast('Showing nearest services first', 'success');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Near me'; btn.style.background='#f0f0f0'; btn.disabled = false; }
  }, function() {
    showToast('Could not get location', 'error');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Near me'; btn.disabled = false; }
  });
}

var providerImages = {
  hair_salon: ['https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=75','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&q=75'],
  barbershop: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=75','https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=480&q=75'],
  nail_tech: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=75'],
  massage: ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=75'],
  lash_tech: ['https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=75'],
  facial: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=480&q=75'],
  makeup: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=480&q=75']
};

function getProviderImage(cat, id) {
  var imgs = providerImages[cat] || providerImages.hair_salon;
  return imgs[(id-1) % imgs.length];
}

function toggleFilters() {
  filtersOpen = !filtersOpen;
  document.getElementById('filter-panel').style.display = filtersOpen ? 'block' : 'none';
}

function selectFilter(group, el) {
  document.querySelectorAll('[data-group="' + group + '"]').forEach(function(e) { e.classList.remove('selected'); });
  el.classList.add('selected');
  activeFilters[group] = el.dataset.val;
}

function applyFilters() {
  toggleFilters();
  showToast('Filters applied', 'success');
  renderGrid();
}

function resetFilters() {
  activeFilters = {};
  document.querySelectorAll('.filter-option').forEach(function(el) { el.classList.remove('selected'); });
  document.querySelectorAll('[data-val="all"],[data-val="0"]').forEach(function(el){ el.classList.add('selected'); });
  showToast('Filters reset', 'info');
  renderGrid();
}

function filterCat(cat, btn) {
  document.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  activeCat = cat;
  renderGrid();
}

function filterCards() { renderGrid(); }
function clearSearch() { document.getElementById('search-input').value = ''; filterCards(); }

function sortCards(v) {
  if (v === 'Nearest First' && !userLocation) {
    showToast('Enable location first', 'info'); return;
  }
  allProviders.sort(function(a,b){
    if (v==='Price: Low to High') return (a.price_from||0)-(b.price_from||0);
    if (v==='Price: High to Low') return (b.price_from||0)-(a.price_from||0);
    if (v==='Most Reviews') return (b.total_reviews||0)-(a.total_reviews||0);
    if (v==='Nearest First') return (a.distance_km||9999)-(b.distance_km||9999);
    return (parseFloat(b.rating)||0)-(parseFloat(a.rating)||0);
  });
  renderGrid();
}

function loadMore() { showToast('All providers loaded','info'); document.getElementById('load-more-wrap').style.display='none'; }

function goToProvider(id, isAvail) {
  if (!isAvail) { showToast('Currently not accepting bookings','info'); }
  window.location.href = '/provider/' + id;
}

function renderGrid() {
  var q = (document.getElementById('search-input').value||'').toLowerCase();
  var catMap = {'Hair Styling':'hair_salon','Barbing':'barbershop','Nail Care':'nail_tech','Massage':'massage','Facials':'facial','Lashes':'lash_tech','Makeup':'makeup'};
  var filtered = allProviders.filter(function(p) {
    var matchCat = activeCat==='All' || p.service_category===catMap[activeCat];
    var matchQ = !q || (p.business_name+' '+p.city+' '+p.service_category).toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  var grid = document.getElementById('providers-grid');
  if (filtered.length===0) {
    grid.innerHTML=''; grid.style.display='none';
    document.getElementById('empty-state').style.display='block';
  } else {
    grid.innerHTML = filtered.map(buildCard).join('');
    grid.style.display='';
    document.getElementById('empty-state').style.display='none';
  }
  document.getElementById('count').textContent = filtered.length;
}

function buildCard(p) {
  var catLabel = (p.service_category||'').replace(/_/g,' ').split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(' ');
  var priceFrom = p.price_from ? 'GHS '+Math.round(p.price_from/100) : '';
  var img = p.cover_url || p.logo_url || getProviderImage(p.service_category, p.id);
  var isVerified = !!p.is_verified;
  var distLabel = (p.distance_km&&p.distance_km<9999) ? (p.distance_km<1?Math.round(p.distance_km*1000)+'m':p.distance_km.toFixed(1)+'km') : (p.city||'Accra');
  var stars = parseFloat(p.rating)||4.8;

  return '<div class="provider-card" onclick="goToProvider('+p.id+',true)">' +
    '<div class="provider-card-img">' +
      '<img src="'+img+'" alt="'+p.business_name+'" loading="lazy"/>' +
      '<div class="provider-card-badge">' +
        (isVerified?'<span class="badge badge-verified"><i class="fas fa-check" style="font-size:10px;"></i> Verified</span>':'') +
      '</div>' +
      '<div class="provider-card-heart"><i class="far fa-heart"></i></div>' +
    '</div>' +
    '<div class="provider-card-content">' +
      '<div class="provider-card-name">' + p.business_name + (isVerified?'<span class="verified-badge"><i class="fas fa-check"></i></span>':'') + '</div>' +
      '<div class="provider-card-meta">' + distLabel + '</div>' +
      '<div class="provider-card-meta">' + catLabel + (priceFrom?' · '+priceFrom:'') + '</div>' +
      '<div class="provider-card-rating">' +
        '<span class="star">★</span>' +
        '<span class="score">' + stars.toFixed(1) + '</span>' +
        '<span class="count">(' + (p.total_reviews||0) + ')</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }, function(){});
  }

  axios.get('/api/providers').then(function(res) {
    allProviders = res.data.providers || [];
    if (userLocation) {
      allProviders = allProviders.map(function(p) {
        if (p.location_lat && p.location_lng) { p.distance_km = haversineKm(userLocation.lat, userLocation.lng, p.location_lat, p.location_lng); }
        else { p.distance_km = 9999; }
        return p;
      });
      allProviders.sort(function(a,b){ return (a.distance_km||9999)-(b.distance_km||9999); });
    }
    renderGrid();
    if (svc) {
      document.querySelectorAll('.filter-chip').forEach(function(b) {
        if (b.textContent.trim().toLowerCase().includes(svc.toLowerCase())) {
          b.click();
        }
      });
    }
  }).catch(function() {
    showToast('Could not load providers', 'error');
    document.getElementById('providers-grid').innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">' +
      '<p style="color:#666;">Failed to load. Please refresh.</p></div>';
  });
});
</script>
</body></html>`
