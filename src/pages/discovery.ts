import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const discoveryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Discover Services', `
<style>
  .filter-row { display:flex; gap:10px; align-items:center; }
  @media(max-width:640px){ .filter-row { flex-wrap:wrap; } }
  .cat-chip { flex-shrink:0; padding:9px 20px; border-radius:100px; font-size:12px; font-weight:700; letter-spacing:0.06em; cursor:pointer; transition:all 0.3s var(--ease-luxury); white-space:nowrap; background:transparent; border:1px solid var(--i-faint); color:var(--t-secondary); }
  .cat-chip:hover { border-color:var(--g-border); color:var(--t-primary); }
  .cat-chip.active { background:var(--g-main); color:var(--c-void); border-color:var(--g-main); box-shadow:0 6px 20px rgba(201,168,76,0.3); }
  .filter-panel { background:var(--c-surface); border:1px solid var(--g-border); border-radius:var(--r-xl); padding:36px; margin-bottom:32px; animation:fadeUp 0.3s var(--ease-luxury) both; }
  .prov-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; cursor:pointer; transition:all 0.45s var(--ease-luxury); position:relative; }
  .prov-card:hover { border-color:var(--g-border-s); transform:translateY(-7px); box-shadow:0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.08); }
  .prov-card:hover .prov-img-wrap { transform:scale(1.04); }
  .prov-img-wrap { transition:transform 0.6s var(--ease-luxury); }
  .map-btn { display:flex; align-items:center; gap:9px; padding:10px 22px; background:var(--c-surface); border:1px solid var(--i-faint); border-radius:100px; color:var(--t-secondary); font-size:12px; font-weight:600; cursor:pointer; transition:all 0.3s; letter-spacing:0.04em; }
  .map-btn:hover { border-color:var(--g-border); color:var(--g-main); }
  .radio-custom { display:flex; align-items:center; gap:10px; margin-bottom:10px; cursor:pointer; }
  .radio-dot { width:16px; height:16px; border-radius:50%; border:1px solid var(--i-faint); display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
  .radio-custom.selected .radio-dot { border-color:var(--g-main); background:var(--g-main); }
  .radio-custom.selected .radio-dot::after { content:''; width:6px; height:6px; border-radius:50%; background:var(--c-void); display:block; }
</style>
`)}
</head>
<body class="bg-grain">
${navbar('discover')}

<div style="min-height:calc(100vh - 72px);padding:48px 0 120px;">
  <div class="container">

    <!-- ── PAGE HEADER ── -->
    <div style="margin-bottom:52px;" class="afu">
      <div class="eyebrow" style="margin-bottom:18px;">Find Your Professional</div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:20px;">
        <h1 class="display-lg font-display">Discover <em class="gold-gradient">Beauty Services</em></h1>
        <button class="map-btn" onclick="showToast('Map view coming soon ✦','info')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Map View
        </button>
      </div>
    </div>

    <!-- ── SEARCH ROW ── -->
    <div class="filter-row afu-1" style="margin-bottom:24px;">
      <div style="flex:1;position:relative;">
        <svg style="position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--t-faint);pointer-events:none;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search" oninput="filterCards()" placeholder="Search salons, barbers, nail techs..." class="input" style="padding-left:50px;padding-right:50px;height:52px;border-radius:100px;"/>
        <button onclick="clearSearch()" id="clear-btn" style="position:absolute;right:18px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--t-faint);cursor:pointer;display:none;font-size:16px;">×</button>
      </div>
      <button onclick="toggleFilters()" id="filter-toggle" style="display:flex;align-items:center;gap:9px;height:52px;padding:0 24px;background:var(--c-surface);border:1px solid var(--i-faint);border-radius:100px;color:var(--t-secondary);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s;white-space:nowrap;letter-spacing:0.04em;" onmouseover="this.style.borderColor='var(--g-border)';this.style.color='var(--g-main)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.color='var(--t-secondary)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        <span id="filter-label">Filters</span>
        <span id="filter-count" style="display:none;background:var(--g-main);color:var(--c-void);width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;margin-left:2px;">0</span>
      </button>
    </div>

    <!-- ── CATEGORY CHIPS ── -->
    <div style="display:flex;gap:9px;overflow-x:auto;padding-bottom:6px;margin-bottom:32px;" class="no-scrollbar afu-2">
      ${['All','Hair Styling','Barbing','Nail Care','Massage','Facials','Lashes','Makeup','Bridal'].map((cat,i)=>
        `<button onclick="filterCat('${cat}',this)" class="cat-chip ${i===0?'active':''}">${cat}</button>`
      ).join('')}
    </div>

    <!-- ── FILTER PANEL ── -->
    <div id="filter-panel" style="display:none;">
      <div class="filter-panel">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:36px;">
          ${[
            {label:'Price Range',     key:'price',  opts:[['Any Price','all'],['Under GHS 50','0-50'],['GHS 50–100','50-100'],['GHS 100–200','100-200'],['GHS 200+','200+']]},
            {label:'Minimum Rating',  key:'rating', opts:[['Any Rating','0'],['4.8+ Stars','4.8'],['4.5+ Stars','4.5'],['4.0+ Stars','4.0']]},
            {label:'Distance',        key:'dist',   opts:[['Anywhere','all'],['Within 2 km','2'],['Within 5 km','5'],['Within 10 km','10']]},
            {label:'Availability',    key:'avail',  opts:[['Any Time','all'],['Open Now','open'],['Verified Only','verified'],['Available Today','today']]},
          ].map(f=>`
            <div>
              <div class="eyebrow" style="margin-bottom:16px;">${f.label}</div>
              ${f.opts.map(([label,val],i)=>`
                <div class="radio-custom ${i===0?'selected':''}" data-group="${f.key}" data-val="${val}" onclick="selectFilter('${f.key}',this)">
                  <div class="radio-dot"></div>
                  <span style="font-size:13px;color:var(--t-secondary);font-weight:300;">${label}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:12px;margin-top:32px;padding-top:28px;border-top:1px solid var(--i-faint);">
          <button onclick="resetFilters()" class="btn-ghost" style="padding:10px 24px;">Reset All</button>
          <button onclick="applyFilters()" class="btn-primary" style="padding:10px 28px;font-size:12px;">Apply Filters</button>
        </div>
      </div>
    </div>

    <!-- ── RESULTS BAR ── -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:12px;">
      <p style="font-size:14px;color:var(--t-secondary);">
        <span id="count" style="color:var(--t-primary);font-weight:700;font-size:16px;">9</span>
        <span style="margin-left:6px;">professionals found</span>
      </p>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;color:var(--t-muted);">Sort:</span>
        <select onchange="sortCards(this.value)" class="input" style="width:auto;padding:9px 36px 9px 14px;border-radius:100px;font-size:12px;background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23B0A090%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>');background-repeat:no-repeat;background-position:right 14px center;background-size:12px;-webkit-appearance:none;">
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
      ${renderAllProviders()}
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="display:none;text-align:center;padding:100px 20px;">
      <div style="font-size:64px;margin-bottom:24px;">🔍</div>
      <h3 class="font-display" style="font-size:24px;margin-bottom:12px;">No results found</h3>
      <p style="font-size:14px;color:var(--t-secondary);margin-bottom:28px;">Try adjusting your filters or search terms</p>
      <button onclick="clearSearch();resetFilters()" class="btn-outline">Clear All Filters</button>
    </div>

    <!-- Load more -->
    <div style="text-align:center;margin-top:72px;" id="load-more-wrap">
      <button onclick="loadMore()" class="btn-ghost" style="padding:14px 40px;font-size:13px;">
        Load More Providers
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </div>

  </div>
</div>

${mobileNav('discover')}
${globalScripts()}

<script>
var filtersOpen = false;
var activeFilters = {};

function toggleFilters() {
  filtersOpen = !filtersOpen;
  var p = document.getElementById('filter-panel');
  p.style.display = filtersOpen ? 'block' : 'none';
  document.getElementById('filter-label').textContent = filtersOpen ? 'Hide Filters' : 'Filters';
}

function filterCat(cat, btn) {
  document.querySelectorAll('.cat-chip').forEach(b => b.className = 'cat-chip');
  btn.className = 'cat-chip active';
  filterCards();
}

function selectFilter(group, el) {
  document.querySelectorAll('[data-group="' + group + '"]').forEach(e => {
    e.classList.remove('selected');
    e.querySelector('.radio-dot').style.background = '';
    e.querySelector('.radio-dot').style.borderColor = 'var(--i-faint)';
  });
  el.classList.add('selected');
  activeFilters[group] = el.dataset.val;
}

function applyFilters() {
  toggleFilters();
  var cnt = Object.values(activeFilters).filter(v => v !== 'all' && v !== '0').length;
  var fc = document.getElementById('filter-count');
  if (cnt > 0) { fc.style.display = 'inline-flex'; fc.textContent = cnt; }
  else { fc.style.display = 'none'; }
  showToast('Filters applied ✦', 'success');
  filterCards();
}

function resetFilters() {
  activeFilters = {};
  document.querySelectorAll('.radio-custom').forEach((el, i) => {
    var grp = el.dataset.group;
    var isFirst = !document.querySelector('.radio-custom[data-group="' + grp + '"].selected');
    if (i === 0 || isFirst) el.classList.add('selected');
  });
  document.getElementById('filter-count').style.display = 'none';
  showToast('Filters reset', 'info');
}

function filterCards() {
  var q = (document.getElementById('search').value || '').toLowerCase();
  var cards = document.querySelectorAll('.prov-card');
  var n = 0;
  cards.forEach(c => {
    var txt = (c.dataset.search || '').toLowerCase();
    var show = !q || txt.includes(q);
    c.style.display = show ? '' : 'none';
    if (show) n++;
  });
  document.getElementById('count').textContent = n;
  document.getElementById('empty-state').style.display = n === 0 ? 'block' : 'none';
  document.getElementById('providers-grid').style.display = n === 0 ? 'none' : '';
  document.getElementById('clear-btn').style.display = q ? 'block' : 'none';
}

function clearSearch() {
  document.getElementById('search').value = '';
  filterCards();
}

function sortCards(v) { showToast('Sorted by: ' + v, 'info'); }

function loadMore() {
  showToast('Loading more providers...', 'info');
  document.getElementById('load-more-wrap').style.display = 'none';
}
</script>
</body></html>`

function renderAllProviders() {
  const providers = [
    {id:1, name:'Glam Studio GH',    type:'Hair Salon',      r:4.9, rev:128, price:80,  dist:'1.2km', loc:'East Legon',    verified:true,  open:true,  emoji:'💇‍♀️', tags:['Braiding','Natural','Locs']},
    {id:2, name:'KutzByKofi',        type:'Barbershop',      r:4.8, rev:96,  price:40,  dist:'2.1km', loc:'Osu, Accra',    verified:true,  open:true,  emoji:'✂️',   tags:['Fade','Beard','Dreads']},
    {id:3, name:'Nails by Abena',    type:'Nail Technician', r:5.0, rev:64,  price:60,  dist:'3.4km', loc:'Airport Area',  verified:true,  open:false, emoji:'💅',   tags:['Gel','Acrylics','Art']},
    {id:4, name:'Relax & Revive',    type:'Massage',         r:4.7, rev:52,  price:120, dist:'4.2km', loc:'Cantonments',   verified:true,  open:true,  emoji:'💆',   tags:['Swedish','Deep Tissue']},
    {id:5, name:'Faces by Ama',      type:'Makeup Artist',   r:4.8, rev:87,  price:150, dist:'5.1km', loc:'Labone',        verified:true,  open:true,  emoji:'💄',   tags:['Bridal','Evening']},
    {id:6, name:'LashQueen Studio',  type:'Lash Technician', r:4.9, rev:73,  price:90,  dist:'6.3km', loc:'Dzorwulu',      verified:false, open:true,  emoji:'👁️',   tags:['Classic','Volume']},
    {id:7, name:'The Fade Factory',  type:'Barbershop',      r:4.6, rev:114, price:35,  dist:'7.8km', loc:'Madina',        verified:true,  open:true,  emoji:'💈',   tags:['Fade','Taper']},
    {id:8, name:'Glow & Grace Spa',  type:'Facial Spa',      r:4.8, rev:45,  price:200, dist:'2.9km', loc:'Ridge, Accra',  verified:true,  open:false, emoji:'🧖',   tags:['Facial','HydraFacial']},
    {id:9, name:'Natural Roots GH',  type:'Natural Hair',    r:4.7, rev:99,  price:70,  dist:'12km',  loc:'Tema',          verified:true,  open:true,  emoji:'🌿',   tags:['Loc Retwist','TWA']},
  ]
  return providers.map(p => `
    <div class="prov-card" data-search="${p.name} ${p.type} ${p.loc} ${p.tags.join(' ')}".toLowerCase()" onclick="window.location.href='/provider/${p.id}'">
      <!-- Image area -->
      <div style="height:172px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));display:flex;align-items:center;justify-content:center;position:relative;border-bottom:1px solid var(--i-faint);overflow:hidden;">
        <div class="prov-img-wrap" style="font-size:68px;filter:drop-shadow(0 8px 20px rgba(0,0,0,0.5));user-select:none;">${p.emoji}</div>

        <!-- Status badges -->
        <div style="position:absolute;top:14px;left:14px;display:flex;gap:7px;">
          ${p.verified ? `<span class="badge badge-verified" style="font-size:10px;"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style="margin-right:2px;"><path d="M9 12l2 2 4-4"/></svg>Verified</span>` : '<span class="badge badge-pending" style="font-size:10px;">Unverified</span>'}
        </div>
        <div style="position:absolute;top:14px;right:14px;">
          <span class="badge ${p.open?'badge-live':'badge-closed'}" style="font-size:10px;">
            ${p.open ? '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:4px;vertical-align:middle;"></span>Open' : 'Closed'}
          </span>
        </div>

        <!-- Distance -->
        <div style="position:absolute;bottom:12px;right:14px;font-size:10px;color:var(--t-muted);display:flex;align-items:center;gap:5px;">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${p.dist}
        </div>
      </div>

      <!-- Content -->
      <div style="padding:22px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div class="font-display" style="font-size:18px;font-weight:500;margin-bottom:3px;">${p.name}</div>
            <div style="font-size:12px;color:var(--t-muted);">${p.type} · ${p.loc}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;margin-left:10px;">
            <div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:3px;">from</div>
            <div class="font-display gold-gradient" style="font-size:19px;">GHS ${p.price}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:7px;margin-bottom:14px;">
          <span class="stars" style="font-size:12px;">★★★★★</span>
          <span style="font-size:13px;font-weight:700;color:var(--g-main);">${p.r}</span>
          <span style="font-size:11px;color:var(--t-muted);">(${p.rev})</span>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;">
          ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>

        <div style="display:flex;gap:9px;">
          <a href="/book/${p.id}" onclick="event.stopPropagation()" class="btn-primary" style="flex:1;justify-content:center;padding:11px 14px;font-size:11px;">
            Book Now
          </a>
          <button onclick="event.stopPropagation();this.innerHTML='<svg width=15 height=15 viewBox=0_0_24_24 fill=var(--g-main) stroke=none><path d=M20.84_4.61a5.5_5.5_0_0_0-7.78_0L12_5.67l-1.06-1.06a5.5_5.5_0_0_0-7.78_7.78l1.06_1.06L12_21.23l7.78-7.78_1.06-1.06a5.5_5.5_0_0_0_0-7.78z/></svg>';showToast('Saved to favourites','success')" class="btn-icon" title="Save">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}
