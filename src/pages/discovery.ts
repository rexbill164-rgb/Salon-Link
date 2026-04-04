import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'

export const discoveryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Discover Services')}</head>
<body>
${navbar('discover')}
<div style="min-height:calc(100vh-64px);background:#0F0A1E;padding:24px 0 80px">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="font-display font-bold text-3xl mb-2">Find <span class="gradient-text">Beauty Services</span></h1>
      <p style="color:#9D8EC0">Discover verified professionals near you</p>
    </div>

    <!-- Search bar -->
    <div class="flex gap-3 mb-6">
      <div style="flex:1;position:relative">
        <i class="fas fa-search" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#9D8EC0;z-index:1"></i>
        <input type="text" id="search-input" placeholder="Search salons, services, providers..." oninput="filterProviders()"
          class="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm" style="background:#1A1033;border:1px solid #2D2250"/>
      </div>
      <div style="position:relative">
        <button onclick="toggleFilters()" class="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-medium text-sm" style="background:#1A1033;border:1px solid #2D2250">
          <i class="fas fa-sliders-h" style="color:#7C3AED"></i>
          <span>Filters</span>
          <span id="filter-count" style="display:none;background:#7C3AED;color:white;border-radius:50%;width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center">0</span>
        </button>
      </div>
    </div>

    <!-- Category pills -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-6" style="scrollbar-width:none">
      ${['All','Hair Styling','Barbing','Nail Care','Massage','Facials','Lashes','Makeup','Shaving']
        .map((cat,i) => `<button onclick="filterByCategory('${cat}')" class="category-pill flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${i===0?'active':''}\" style="${i===0?'background:#7C3AED;color:white':'background:#1A1033;border:1px solid #2D2250;color:#9D8EC0'}">${cat}</button>`)
        .join('')}
    </div>

    <!-- Filter panel -->
    <div id="filter-panel" style="display:none;background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:24px;margin-bottom:24px">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-semibold mb-3">Price Range</label>
          <div class="flex gap-2 flex-col">
            ${[['Under GHS 50','0-50'],['GHS 50-100','50-100'],['GHS 100-200','100-200'],['GHS 200+','200-999']]
              .map(([label,val]) => `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="price" value="${val}" style="accent-color:#7C3AED" onchange="filterProviders()"/><span style="color:#9D8EC0">${label}</span></label>`)
              .join('')}
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-3">Rating</label>
          <div class="flex gap-2 flex-col">
            ${[['4.5+ Stars','4.5'],['4.0+ Stars','4.0'],['3.5+ Stars','3.5'],['Any Rating','0']]
              .map(([label,val]) => `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="rating" value="${val}" style="accent-color:#7C3AED" onchange="filterProviders()"/><span style="color:#9D8EC0">${label}</span></label>`)
              .join('')}
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-3">Distance</label>
          <div class="flex gap-2 flex-col">
            ${[['Within 1km','1'],['Within 5km','5'],['Within 10km','10'],['Any Distance','999']]
              .map(([label,val]) => `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="distance" value="${val}" style="accent-color:#7C3AED" onchange="filterProviders()"/><span style="color:#9D8EC0">${label}</span></label>`)
              .join('')}
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-3">Availability</label>
          <div class="flex gap-2 flex-col">
            ${[['Available Today','today'],['This Week','week'],['Verified Only','verified'],['Open Now','open']]
              .map(([label,val]) => `<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" value="${val}" style="accent-color:#7C3AED" onchange="filterProviders()"/><span style="color:#9D8EC0">${label}</span></label>`)
              .join('')}
          </div>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="clearFilters()" class="px-4 py-2 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#9D8EC0">Clear All</button>
        <button onclick="toggleFilters()" class="gradient-btn px-6 py-2 rounded-xl text-white text-sm font-medium">Apply Filters</button>
      </div>
    </div>

    <!-- Sort bar -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm" style="color:#9D8EC0"><span id="results-count">24</span> providers found</p>
      <select onchange="sortProviders(this.value)" class="px-4 py-2 rounded-xl text-sm" style="background:#1A1033;border:1px solid #2D2250;color:#E2D9F3">
        <option value="rating">Top Rated</option>
        <option value="distance">Nearest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="reviews">Most Reviews</option>
      </select>
    </div>

    <!-- Provider Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="providers-grid">
      ${generateAllProviders()}
    </div>

    <!-- Load more -->
    <div class="text-center mt-10">
      <button onclick="loadMore()" class="px-8 py-3 rounded-2xl font-medium text-sm glass" style="border:1px solid #2D2250;color:#C4B5FD">
        <i class="fas fa-chevron-down mr-2"></i>Load More Providers
      </button>
    </div>
  </div>
</div>
${mobileNav('discover')}
${toastScript()}
<script>
function toggleFilters() {
  const panel = document.getElementById('filter-panel');
  panel.style.display = panel.style.display==='none'?'block':'none';
}
function filterByCategory(cat) {
  document.querySelectorAll('.category-pill').forEach(p=>{
    p.style.background = '#1A1033';
    p.style.borderColor = '#2D2250';
    p.style.color = '#9D8EC0';
    p.style.border = '1px solid #2D2250';
  });
  event.target.style.background = '#7C3AED';
  event.target.style.color = 'white';
  event.target.style.border = 'none';
  filterProviders();
}
function filterProviders() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.prov-card');
  let count = 0;
  cards.forEach(c=>{
    const name = c.dataset.name?.toLowerCase()||'';
    const tags = c.dataset.tags?.toLowerCase()||'';
    const show = !q || name.includes(q) || tags.includes(q);
    c.style.display = show ? 'block' : 'none';
    if(show) count++;
  });
  document.getElementById('results-count').textContent = count;
}
function sortProviders(by) { showToast('Sorted by '+by,'info'); }
function clearFilters() {
  document.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
  document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
  filterProviders();
}
function loadMore() { showToast('Loading more providers...','info'); }

// Load providers from API
async function loadProviders() {
  try {
    const res = await axios.get('/api/providers');
    if(res.data && res.data.length > 0) {
      // Would update grid with real data
    }
  } catch(e) { /* use static data */ }
}
loadProviders();
</script>
</body></html>`

function generateAllProviders() {
  const providers = [
    {id:1,name:'Glam Studio GH',type:'Hair Salon',rating:4.9,reviews:128,price:80,location:'East Legon, Accra',dist:'1.2km',verified:true,emoji:'💇‍♀️',tags:['Braiding','Natural Hair','Locs','Weave'],color:'#7C3AED',open:true},
    {id:2,name:'KutzByKofi',type:'Barbershop',rating:4.8,reviews:96,price:40,location:'Osu, Accra',dist:'2.1km',verified:true,emoji:'✂️',tags:['Fade','Lineup','Dreads','Beard'],color:'#3B82F6',open:true},
    {id:3,name:'Nails by Abena',type:'Nail Tech',rating:5.0,reviews:64,price:60,location:'Airport Area',dist:'3.4km',verified:true,emoji:'💅',tags:['Gel','Acrylics','Nail Art'],color:'#EC4899',open:false},
    {id:4,name:'Relax & Revive',type:'Massage Therapist',rating:4.7,reviews:52,price:120,location:'Cantonments, Accra',dist:'4.2km',verified:true,emoji:'💆',tags:['Swedish','Deep Tissue','Hot Stone'],color:'#10B981',open:true},
    {id:5,name:'Faces by Ama',type:'Makeup Artist',rating:4.8,reviews:87,price:150,location:'Labone, Accra',dist:'5.1km',verified:true,emoji:'💄',tags:['Bridal','Evening','Natural'],color:'#F59E0B',open:true},
    {id:6,name:'LashQueen Studio',type:'Lash Technician',rating:4.9,reviews:73,price:90,location:'Dzorwulu, Accra',dist:'6.3km',verified:false,emoji:'👁️',tags:['Classic','Volume','Hybrid'],color:'#8B5CF6',open:true},
    {id:7,name:'The Fade Factory',type:'Barbershop',rating:4.6,reviews:114,price:35,location:'Madina, Accra',dist:'7.8km',verified:true,emoji:'💈',tags:['Fade','Taper','Dreads'],color:'#EF4444',open:true},
    {id:8,name:'Glow & Grace Spa',type:'Facial Spa',rating:4.8,reviews:45,price:200,location:'Ridge, Accra',dist:'2.9km',verified:true,emoji:'🧖',tags:['HydraFacial','Acne Treatment','Glow'],color:'#06B6D4',open:false},
    {id:9,name:'Natural Roots Salon',type:'Natural Hair',rating:4.7,reviews:99,price:70,location:'Tema',dist:'12km',verified:true,emoji:'🌿',tags:['Loc Retwist','Natural Styles','TWA'],color:'#22C55E',open:true},
  ]
  return providers.map(p => `
    <div class="prov-card provider-card" data-name="${p.name}" data-tags="${p.tags.join(',')}" onclick="window.location.href='/provider/${p.id}'">
      <div style="height:140px;background:linear-gradient(135deg,${p.color}22,${p.color}11);display:flex;align-items:center;justify-content:center;font-size:56px;position:relative">
        ${p.emoji}
        <div style="position:absolute;top:12px;left:12px;display:flex;gap:6px">
          ${p.verified ? `<span class="text-xs px-2 py-1 rounded-full font-medium" style="background:#10B98122;color:#10B981;border:1px solid #10B98133"><i class="fas fa-check-circle mr-1"></i>Verified</span>` : '<span class="text-xs px-2 py-1 rounded-full" style="background:#F59E0B22;color:#F59E0B;border:1px solid #F59E0B33">Pending KYC</span>'}
        </div>
        <div style="position:absolute;top:12px;right:12px">
          <span class="text-xs px-2 py-1 rounded-full" style="background:${p.open?'#10B98122':'#EF444422'};color:${p.open?'#10B981':'#EF4444'}">● ${p.open?'Open':'Closed'}</span>
        </div>
      </div>
      <div style="padding:16px">
        <div class="flex items-start justify-between mb-1">
          <div>
            <h3 class="font-semibold">${p.name}</h3>
            <p class="text-xs" style="color:#9D8EC0">${p.type} · <i class="fas fa-map-marker-alt"></i> ${p.location}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="font-bold text-sm" style="color:#7C3AED">GHS ${p.price}</div>
            <div class="text-xs" style="color:#9D8EC0">${p.dist} away</div>
          </div>
        </div>
        <div class="flex items-center gap-2 my-2">
          <div style="color:#F59E0B;font-size:12px">${'★'.repeat(Math.floor(p.rating))}</div>
          <span class="text-xs font-semibold">${p.rating}</span>
          <span class="text-xs" style="color:#9D8EC0">(${p.reviews})</span>
        </div>
        <div class="flex gap-2 flex-wrap mb-3">
          ${p.tags.slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="flex gap-2">
          <button onclick="event.stopPropagation();window.location.href='/book/${p.id}'" class="flex-1 gradient-btn py-2.5 rounded-xl text-white text-sm font-semibold">Book Now</button>
          <button onclick="event.stopPropagation();saveFavorite(${p.id})" class="w-10 h-10 flex items-center justify-center rounded-xl" style="background:#0F0A1E;border:1px solid #2D2250;color:#9D8EC0">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}
