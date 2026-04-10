import { baseHead, mobileNav, globalScripts } from '../utils/layout'

export const discoveryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Discover Services', `
<style>
  /* ── Dark gradient header – Fresha Explore style ── */
  .disc-header {
    background: linear-gradient(160deg, #1A1040 0%, #2D1B80 40%, #4A2FC0 70%, #6C47FF 100%);
    padding: 28px 0 80px;
    position: relative;
    overflow: hidden;
  }
  .disc-header::before {
    content:'';
    position:absolute;inset:0;
    background: radial-gradient(ellipse 80% 60% at 60% 50%, rgba(155,123,255,0.25) 0%, transparent 60%);
    pointer-events:none;
  }

  /* ── Frosted search bar ── */
  .disc-search-wrap {
    position: sticky;
    top: 64px;
    z-index: 300;
    padding: 0 0 16px;
    background: transparent;
    margin-top: -54px;
  }
  .disc-search-inner {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 6px 6px 6px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.16);
    border: 1px solid rgba(255,255,255,0.8);
  }

  /* ── Filter chips – horizontal scroll ── */
  .filter-chip-row { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; }
  .filter-chip-row::-webkit-scrollbar { display:none; }
  .fchip {
    flex-shrink:0; padding:8px 16px; border-radius:100px;
    font-size:12px; font-weight:600;
    cursor:pointer; transition:all 0.25s; white-space:nowrap;
    background:#FFFFFF; border:1.5px solid var(--i-faint); color:var(--t-secondary);
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .fchip:hover { border-color:var(--g-border); color:var(--g-main); }
  .fchip.active { background:var(--g-main); color:#FFFFFF; border-color:var(--g-main); box-shadow:0 4px 14px rgba(108,71,255,0.30); }

  /* ── 2-column provider grid (Fresha style) ── */
  .prov-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media(min-width:768px){ .prov-grid { grid-template-columns: repeat(3,1fr); gap:16px; } }
  @media(min-width:1200px){ .prov-grid { grid-template-columns: repeat(4,1fr); } }

  /* ── Provider card – Fresha clean style ── */
  .pcard {
    background:#FFFFFF; border-radius:18px; overflow:hidden; cursor:pointer;
    border:1px solid var(--i-faint); transition:all 0.3s var(--ease-luxury);
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  }
  .pcard:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.12); border-color:var(--g-border); }
  .pcard:hover .pcard-img { transform:scale(1.04); }
  .pcard-img { width:100%;height:160px;object-fit:cover;display:block;transition:transform 0.5s var(--ease-luxury); }

  /* ── Filter panel ── */
  .filter-panel {
    background:#FFFFFF; border:1px solid var(--i-faint); border-radius:20px;
    padding:28px; margin-bottom:20px; box-shadow:0 8px 32px rgba(0,0,0,0.08);
    animation:fadeUp 0.25s var(--ease-luxury) both;
  }
  .radio-opt { display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer; }
  .radio-dot {
    width:18px; height:18px; border-radius:50%;
    border:1.5px solid var(--i-faint); display:flex; align-items:center;
    justify-content:center; transition:all 0.2s; flex-shrink:0;
  }
  .radio-opt.selected .radio-dot { border-color:var(--g-main); background:var(--g-main); }
  .radio-opt.selected .radio-dot::after { content:''; width:6px; height:6px; border-radius:50%; background:#FFFFFF; display:block; }

  /* ── Map button (floating) ── */
  .map-btn {
    position:fixed; bottom:100px; right:20px; z-index:400;
    background:var(--t-primary); color:#FFFFFF;
    border:none; border-radius:100px; padding:12px 22px;
    font-size:13px; font-weight:700;
    display:flex; align-items:center; gap:8px; cursor:pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.20);
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .map-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(0,0,0,0.25); }
</style>
`)}
</head>
<body style="background:#F5F5F5;">

<!-- ── Navbar (transparent on top) ── -->
<nav id="nav-main" style="position:fixed;top:0;left:0;right:0;z-index:800;background:transparent;transition:all 0.3s ease;width:100%;max-width:100vw;">
  <div style="padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;max-width:1440px;margin:0 auto;width:100%;">
    <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(255,255,255,0.3);">
        <i class="fas fa-spa" style="color:#FFFFFF;font-size:14px;"></i>
      </div>
      <span style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#FFFFFF;line-height:1;">Salon<span style="opacity:0.8;">Link</span></span>
    </a>
    <div id="nav-auth" style="display:flex;align-items:center;gap:10px;">
      <a href="/login" style="padding:9px 20px;font-size:13px;background:rgba(255,255,255,0.15);color:#FFFFFF;border:1.5px solid rgba(255,255,255,0.35);border-radius:100px;text-decoration:none;font-weight:600;backdrop-filter:blur(10px);">Sign In</a>
      <a href="/register" style="padding:10px 20px;font-size:13px;background:#FFFFFF;color:var(--g-main);border:none;border-radius:100px;text-decoration:none;font-weight:700;">Join Free</a>
    </div>
  </div>
</nav>

<!-- ══════════════════════════════════════════════
     DARK GRADIENT HEADER (Fresha Explore)
══════════════════════════════════════════════ -->
<div class="disc-header">
  <div class="container" style="padding-top:80px;position:relative;z-index:1;">

    <!-- Title row -->
    <div style="margin-bottom:28px;">
      <h1 style="font-size:clamp(26px,4vw,40px);font-weight:800;color:#FFFFFF;margin-bottom:8px;line-height:1.2;">
        Find beauty services
      </h1>
      <p style="font-size:15px;color:rgba(255,255,255,0.70);">Verified professionals across Ghana</p>
    </div>

    <!-- Search + Near Me row -->
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:20px;">
      <div style="flex:1;background:rgba(255,255,255,0.15);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,0.25);border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;cursor:pointer;" onclick="document.getElementById('search-input-hidden').focus()">
        <i class="fas fa-search" style="color:rgba(255,255,255,0.7);font-size:15px;"></i>
        <input id="search-input-hidden" type="text" oninput="filterCards()" placeholder="Search salons, services..." style="background:none;border:none;outline:none;color:#FFFFFF;font-family:'Poppins',sans-serif;font-size:14px;width:100%;" />
      </div>
      <button id="location-btn" onclick="detectLocation()" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,0.25);border-radius:14px;padding:14px 20px;color:#FFFFFF;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:background 0.25s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
        <i class="fas fa-map-marker-alt"></i>
        <span class="hide-mob">Near You</span>
      </button>
      <button onclick="toggleFilters()" id="filter-btn" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,0.25);border-radius:14px;padding:14px 20px;color:#FFFFFF;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;transition:background 0.25s;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
        <i class="fas fa-sliders-h"></i>
        <span class="hide-mob">Filters</span>
      </button>
    </div>

    <!-- Category chips row -->
    <div class="filter-chip-row no-scrollbar">
      ${[
        {label:'All',          icon:'⬛'},
        {label:'Hair Styling', icon:'✂️'},
        {label:'Barbing',      icon:'💈'},
        {label:'Nail Care',    icon:'💅'},
        {label:'Massage',      icon:'💆'},
        {label:'Facials',      icon:'🌿'},
        {label:'Lashes',       icon:'👁️'},
        {label:'Makeup',       icon:'💄'},
        {label:'Bridal',       icon:'💍'},
      ].map((cat,i)=>
        `<button onclick="filterCat('${cat.label}',this)" class="fchip ${i===0?'active':''}">${cat.icon} ${cat.label}</button>`
      ).join('')}
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════
     MAIN CONTENT
══════════════════════════════════════════════ -->
<div style="padding:20px 0 140px;">
  <div class="container">

    <!-- Filter panel -->
    <div id="filter-panel" style="display:none;margin-bottom:20px;">
      <div class="filter-panel">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
          <h3 style="font-size:16px;font-weight:700;color:var(--t-primary);">Filters</h3>
          <button onclick="resetFilters()" style="background:none;border:none;color:var(--g-main);font-size:13px;font-weight:600;cursor:pointer;">Reset all</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:24px;">
          ${[
            {label:'Price Range',    key:'price',  opts:[['Any Price','all'],['Under GHS 50','0-50'],['GHS 50–100','50-100'],['GHS 100–200','100-200'],['GHS 200+','200+']]},
            {label:'Min Rating',     key:'rating', opts:[['Any Rating','0'],['4.8+ Stars','4.8'],['4.5+ Stars','4.5'],['4.0+ Stars','4.0']]},
            {label:'Distance',       key:'dist',   opts:[['Anywhere','all'],['Within 2 km','2'],['Within 5 km','5'],['Within 10 km','10']]},
            {label:'Availability',   key:'avail',  opts:[['Any Time','all'],['Open Now','open'],['Verified Only','verified'],['Available Today','today']]},
          ].map(f=>`
            <div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t-muted);margin-bottom:12px;">${f.label}</div>
              ${f.opts.map(([label,val],i)=>`
                <div class="radio-opt ${i===0?'selected':''}" data-group="${f.key}" data-val="${val}" onclick="selectFilter('${f.key}',this)">
                  <div class="radio-dot"></div>
                  <span style="font-size:13px;color:var(--t-secondary);">${label}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid var(--i-faint);">
          <button onclick="toggleFilters()" style="flex:1;background:var(--i-ghost);border:1px solid var(--i-faint);border-radius:100px;padding:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--t-secondary);transition:background 0.2s;" onmouseover="this.style.background='var(--c-dark)'" onmouseout="this.style.background='var(--i-ghost)'">Cancel</button>
          <button onclick="applyFilters()" style="flex:2;background:var(--g-main);border:none;border-radius:100px;padding:12px;font-size:13px;font-weight:700;color:#FFFFFF;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='var(--g-deep)'" onmouseout="this.style.background='var(--g-main)'">
            <i class="fas fa-check" style="margin-right:6px;"></i> Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Results bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
      <p style="font-size:14px;color:var(--t-secondary);">
        <span id="count" style="color:var(--t-primary);font-weight:700;">0</span>
        <span style="margin-left:5px;">venues found</span>
      </p>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:var(--t-muted);">Sort:</span>
        <select onchange="sortCards(this.value)" style="background:#FFFFFF;border:1.5px solid var(--i-faint);border-radius:100px;padding:8px 32px 8px 14px;font-size:12px;font-weight:600;color:var(--t-primary);cursor:pointer;outline:none;-webkit-appearance:none;background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238A8A8A%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>');background-repeat:no-repeat;background-position:right 10px center;background-size:11px;">
          <option>Top Rated</option>
          <option>Price: Low → High</option>
          <option>Price: High → Low</option>
          <option>Nearest First</option>
          <option>Most Reviews</option>
        </select>
      </div>
    </div>

    <!-- Provider grid -->
    <div id="providers-grid" class="prov-grid">
      ${[1,2,3,4,5,6,7,8].map(()=>`
        <div style="background:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid var(--i-faint);">
          <div style="height:160px;background:linear-gradient(90deg,#EEEEEE 25%,#E5E5E5 50%,#EEEEEE 75%);background-size:400%;animation:shimmer 1.8s infinite;"></div>
          <div style="padding:14px;">
            <div style="height:16px;background:#EEEEEE;border-radius:6px;margin-bottom:8px;width:70%;animation:shimmer 1.8s infinite;background-size:400%;"></div>
            <div style="height:12px;background:#EEEEEE;border-radius:6px;margin-bottom:14px;width:50%;animation:shimmer 1.8s infinite;background-size:400%;"></div>
            <div style="height:36px;background:#EEEEEE;border-radius:100px;animation:shimmer 1.8s infinite;background-size:400%;"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="display:none;text-align:center;padding:80px 20px;">
      <div style="width:80px;height:80px;border-radius:50%;background:var(--g-dim);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
        <i class="fas fa-search" style="font-size:28px;color:var(--g-main);"></i>
      </div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:10px;">No results found</h3>
      <p style="font-size:14px;color:var(--t-muted);margin-bottom:24px;">Try adjusting your filters or search terms</p>
      <button onclick="clearSearch();resetFilters()" style="background:var(--g-main);color:#FFFFFF;border:none;border-radius:100px;padding:12px 28px;font-size:13px;font-weight:700;cursor:pointer;">Clear Filters</button>
    </div>

    <!-- Load more -->
    <div style="text-align:center;margin-top:48px;" id="load-more-wrap">
      <button onclick="loadMore()" style="background:#FFFFFF;border:1.5px solid var(--i-faint);border-radius:100px;padding:13px 36px;font-size:13px;font-weight:600;cursor:pointer;color:var(--t-secondary);transition:all 0.25s;box-shadow:0 2px 10px rgba(0,0,0,0.06);" onmouseover="this.style.borderColor='var(--g-main)';this.style.color='var(--g-main)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.color='var(--t-secondary)'">
        Load More <i class="fas fa-chevron-down" style="font-size:11px;margin-left:4px;"></i>
      </button>
    </div>

  </div>
</div>

<!-- Floating map button -->
<button class="map-btn hide-mob" onclick="showToast('Map view coming soon!','info')">
  <i class="fas fa-map"></i> Map
</button>

${mobileNav('discover')}
${globalScripts()}

<script>
// ── Make navbar solid on scroll ──
(function(){
  var u = (function(){ try{ return JSON.parse(localStorage.getItem('sl_user')||'{}'); }catch(e){ return {}; } })();
  var nav = document.getElementById('nav-auth');
  if (u && u.id && nav) {
    var dashLink = u.role === 'provider' ? '/provider/dashboard' : u.role === 'admin' ? '/admin' : '/dashboard';
    nav.innerHTML = '<a href="' + dashLink + '" style="padding:9px 20px;font-size:13px;background:rgba(255,255,255,0.15);color:#FFFFFF;border:1.5px solid rgba(255,255,255,0.35);border-radius:100px;text-decoration:none;font-weight:600;">' + (u.first_name || u.name || 'Dashboard') + '</a>';
  }
  var n = document.getElementById('nav-main');
  function updateNav() {
    if (window.scrollY > 100) {
      n.style.background = 'rgba(255,255,255,0.97)';
      n.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
      n.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
      // Update text colors
      n.querySelectorAll('a,span').forEach(function(el){
        if(el.tagName==='A' && el.href && el.style.color==='rgb(255, 255, 255)') {
          el.style.color = 'var(--t-primary)';
        }
      });
    } else {
      n.style.background = 'transparent';
      n.style.borderBottom = 'none';
      n.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', updateNav, {passive:true});
  updateNav();
})();

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
  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true; }
  if (!navigator.geolocation) {
    showToast('Location not supported', 'error');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; btn.disabled = false; }
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
    showToast('Showing nearest services first 📍', 'success');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> <span>Near You ✓</span>'; btn.style.background='rgba(255,255,255,0.30)'; btn.disabled = false; }
  }, function() {
    showToast('Could not get location. Please allow access.', 'error');
    if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i>'; btn.disabled = false; }
  });
}

var providerImages = {
  hair_salon: ['https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=75','https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&q=75','https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=75'],
  barbershop: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=75','https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=480&q=75'],
  nail_tech:  ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=75','https://images.unsplash.com/photo-1604093024411-1e8b48aad80d?w=480&q=75'],
  massage:    ['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=75','https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=480&q=75'],
  lash_tech:  ['https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=75','https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=480&q=75'],
  facial:     ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=480&q=75','https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&q=75'],
  makeup:     ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=480&q=75','https://images.unsplash.com/photo-1487412840181-b9dedc9e3b20?w=480&q=75']
};

function getProviderImage(cat, id) {
  var imgs = providerImages[cat] || providerImages.hair_salon;
  return imgs[(id-1) % imgs.length];
}

function toggleFilters() {
  filtersOpen = !filtersOpen;
  var p = document.getElementById('filter-panel');
  p.style.display = filtersOpen ? 'block' : 'none';
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
  document.querySelectorAll('.radio-opt').forEach(function(el, i) { if (i % 4 === 0 || i % 5 === 0) { /* first of each group */ } });
  document.querySelectorAll('[data-group]').forEach(function(el) { el.classList.remove('selected'); });
  document.querySelectorAll('[data-val="all"],[data-val="0"]').forEach(function(el){ el.classList.add('selected'); });
  showToast('Filters reset', 'info');
  renderGrid();
}

function filterCat(cat, btn) {
  document.querySelectorAll('.fchip').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  activeCat = cat;
  renderGrid();
}

function filterCards() { renderGrid(); }
function clearSearch() { document.getElementById('search-input-hidden').value = ''; filterCards(); }

function sortCards(v) {
  if (v === 'Nearest First' && !userLocation) {
    showToast('Enable location first using the Near You button', 'info'); return;
  }
  allProviders.sort(function(a,b){
    if (v==='Price: Low → High') return (a.price_from||0)-(b.price_from||0);
    if (v==='Price: High → Low') return (b.price_from||0)-(a.price_from||0);
    if (v==='Most Reviews') return (b.total_reviews||0)-(a.total_reviews||0);
    if (v==='Nearest First') return (a.distance_km||9999)-(b.distance_km||9999);
    return (parseFloat(b.rating)||0)-(parseFloat(a.rating)||0);
  });
  renderGrid();
}

function loadMore() { showToast('All providers loaded','info'); document.getElementById('load-more-wrap').style.display='none'; }

function goToProvider(id, isAvail) {
  if (!isAvail) { showToast('This provider is currently not accepting bookings','info'); setTimeout(function(){ window.location.href='/provider/'+id; },1000); return; }
  window.location.href = '/provider/' + id;
}

function renderGrid() {
  var q = (document.getElementById('search-input-hidden').value||'').toLowerCase();
  var catMap = {'Hair Styling':'hair_salon','Barbing':'barbershop','Nail Care':'nail_tech','Massage':'massage','Facials':'facial','Lashes':'lash_tech','Makeup':'makeup','Bridal':'makeup'};
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
  var catLabel = (p.service_category||'').replace(/_/g,' ').replace(/\\b\\w/g,function(l){return l.toUpperCase();});
  var priceFrom = p.price_from ? 'GHS '+Math.round(p.price_from/100) : 'GHS 40';
  var img = p.cover_url || p.logo_url || getProviderImage(p.service_category, p.id);
  var isAccepting = !!p.is_accepting_bookings;
  var isVerified  = !!p.is_verified;
  var distLabel   = (p.distance_km&&p.distance_km<9999) ? (p.distance_km<1?Math.round(p.distance_km*1000)+'m':p.distance_km.toFixed(1)+'km') : (p.city||'Accra');
  var stars = parseFloat(p.rating)||4.8;

  return '<div class="pcard" onclick="goToProvider('+p.id+','+isAccepting+')">' +
    '<div style="position:relative;overflow:hidden;">' +
      '<img class="pcard-img" src="'+img+'" alt="'+p.business_name+'" loading="lazy"/>' +
      '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.3),transparent 55%);"></div>' +
      '<div style="position:absolute;top:10px;left:10px;">' +
        (isVerified?'<span style="background:rgba(255,255,255,0.95);border-radius:100px;padding:3px 9px;font-size:10px;font-weight:700;color:#007A3D;display:flex;align-items:center;gap:3px;"><i class="fas fa-shield-alt" style="font-size:8px;"></i> Verified</span>':'') +
      '</div>' +
      '<div style="position:absolute;top:10px;right:10px;">' +
        '<span style="background:rgba(255,255,255,0.95);border-radius:100px;padding:3px 9px;font-size:10px;font-weight:700;display:flex;align-items:center;gap:4px;color:'+(isAccepting?'#007A3D':'#888')+'">' +
          (isAccepting?'<span style="width:5px;height:5px;background:#00C853;border-radius:50%;"></span> Open':'<i class="far fa-clock" style="font-size:8px;"></i> Closed') +
        '</span>' +
      '</div>' +
      '<div style="position:absolute;bottom:10px;left:12px;font-size:11px;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:4px;">' +
        '<i class="fas fa-map-marker-alt" style="font-size:9px;"></i>' + distLabel +
      '</div>' +
    '</div>' +
    '<div style="padding:14px;">' +
      '<div style="font-size:15px;font-weight:700;color:var(--t-primary);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.business_name + '</div>' +
      '<div style="font-size:12px;color:var(--t-muted);margin-bottom:10px;">' + catLabel + '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:4px;">' +
          '<span style="color:#FFB800;font-size:13px;">★</span>' +
          '<span style="font-size:13px;font-weight:700;color:var(--t-primary);">' + stars.toFixed(1) + '</span>' +
          '<span style="font-size:11px;color:var(--t-muted);">(' + (p.total_reviews||0) + ')</span>' +
        '</div>' +
        '<div style="font-size:13px;font-weight:700;color:var(--g-main);">' + priceFrom + '</div>' +
      '</div>' +
      '<a href="/book/'+p.id+'" onclick="event.stopPropagation()" style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px;background:var(--g-main);color:#FFFFFF;border:none;border-radius:100px;padding:10px;font-size:12px;font-weight:700;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background=\'var(--g-deep)\'" onmouseout="this.style.background=\'var(--g-main)\'">' +
        '<i class="far fa-calendar-check" style="font-size:11px;"></i> Book Now' +
      '</a>' +
    '</div>' +
  '</div>';
}

document.addEventListener('DOMContentLoaded', function() {
  // Check URL params for pre-selected category
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');
  if (svc) {
    document.querySelectorAll('.fchip').forEach(function(b) {
      if (b.textContent.trim().toLowerCase().includes(svc.toLowerCase())) {
        b.click();
      }
    });
  }

  // Try location silently
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var btn = document.getElementById('location-btn');
      if (btn) { btn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span class="hide-mob"> Near You ✓</span>'; btn.style.background='rgba(255,255,255,0.28)'; }
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
    // Re-apply selected category if any
    if (svc) {
      document.querySelectorAll('.fchip').forEach(function(b) {
        if (b.textContent.trim().toLowerCase().includes(svc.toLowerCase())) {
          activeCat = b.textContent.trim().replace(/^[^\w]+/,'').trim();
          document.querySelectorAll('.fchip').forEach(function(x){ x.classList.remove('active'); });
          b.classList.add('active');
          renderGrid();
        }
      });
    }
  }).catch(function() {
    showToast('Could not load providers', 'error');
    document.getElementById('providers-grid').innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">' +
      '<i class="fas fa-exclamation-circle" style="font-size:36px;color:var(--s-red);margin-bottom:16px;display:block;"></i>' +
      '<p style="color:var(--t-secondary);">Failed to load providers. Please refresh.</p></div>';
  });
});
</script>
</body></html>`
