import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'

export const providerProfilePage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Profile')}</head>
<body>
${navbar()}
<div style="min-height:calc(100vh - 64px);background:#0F0A1E;padding-bottom:100px">

  <!-- Cover + Profile -->
  <div style="height:220px;background:linear-gradient(135deg,#7C3AED44,#EC4899,22,#1A1033);position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:0.3">💇‍♀️</div>
    <div style="position:absolute;bottom:-40px;left:24px;width:80px;height:80px;border-radius:20px;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:36px;border:3px solid #0F0A1E">💇‍♀️</div>
  </div>

  <div class="max-w-4xl mx-auto px-4" style="padding-top:60px">
    <!-- Header info -->
    <div class="flex items-start justify-between mb-6 flex-wrap gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="font-display font-bold text-3xl">Glam Studio GH</h1>
          <span class="text-sm px-3 py-1 rounded-full font-medium" style="background:#10B98122;color:#10B981;border:1px solid #10B98133">
            <i class="fas fa-check-circle mr-1"></i>Verified
          </span>
        </div>
        <p style="color:#9D8EC0" class="mb-2"><i class="fas fa-map-marker-alt mr-1" style="color:#7C3AED"></i>East Legon, Accra · <span style="color:#10B981">● Open Now</span></p>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <span style="color:#F59E0B">★★★★★</span>
            <span class="font-bold">4.9</span>
            <span style="color:#9D8EC0">(128 reviews)</span>
          </div>
          <span style="color:#9D8EC0">·</span>
          <span style="color:#9D8EC0">1.2km away</span>
          <span style="color:#9D8EC0">·</span>
          <span style="color:#9D8EC0">450+ clients</span>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="shareProvider()" class="w-10 h-10 flex items-center justify-center rounded-xl glass" style="border:1px solid #2D2250">
          <i class="fas fa-share-alt" style="color:#9D8EC0"></i>
        </button>
        <button onclick="saveFav()" id="fav-btn" class="w-10 h-10 flex items-center justify-center rounded-xl glass" style="border:1px solid #2D2250">
          <i class="far fa-heart" style="color:#EC4899"></i>
        </button>
        <a href="/book/1" class="gradient-btn px-6 py-2.5 rounded-xl text-white font-bold flex items-center gap-2">
          <i class="fas fa-calendar-plus"></i> Book Now
        </a>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-8 overflow-x-auto" style="background:#1A1033;border-radius:12px;padding:4px;border:1px solid #2D2250">
      ${['Overview','Services','Gallery','Reviews','Location'].map((tab,i)=>
        `<button onclick="switchTab('${tab.toLowerCase()}',this)" class="tab-btn flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition ${i===0?'active':''}\" style="${i===0?'background:#7C3AED;color:white':'color:#9D8EC0'}">${tab}</button>`
      ).join('')}
    </div>

    <!-- Tab: Overview -->
    <div id="tab-overview" class="tab-content">
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="md:col-span-2">
          <h3 class="font-semibold text-lg mb-3">About</h3>
          <p style="color:#9D8EC0;line-height:1.8" class="mb-4">
            Glam Studio GH is Accra's premier hair salon specializing in natural African hair care, braiding, locs, and protective styles. With over 8 years of experience, our team of certified stylists are dedicated to making you look and feel your best.
          </p>
          <div class="grid grid-cols-2 gap-4">
            ${[
              {icon:'fas fa-clock',label:'Working Hours',val:'Mon–Sat: 8am–7pm, Sun: 10am–4pm'},
              {icon:'fas fa-phone',label:'Contact',val:'+233 20 123 4567'},
              {icon:'fas fa-calendar',label:'Experience',val:'8+ Years in Business'},
              {icon:'fas fa-users',label:'Team',val:'5 Certified Stylists'},
            ].map(i=>`
              <div class="flex items-start gap-3 p-4 rounded-xl" style="background:#1A1033;border:1px solid #2D2250">
                <i class="${i.icon} mt-1" style="color:#7C3AED"></i>
                <div>
                  <p class="text-xs font-medium" style="color:#9D8EC0">${i.label}</p>
                  <p class="text-sm font-medium">${i.val}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-3">Quick Stats</h3>
          ${[
            {label:'Avg Response',val:'< 10 min',icon:'⚡'},
            {label:'Completion Rate',val:'98%',icon:'✅'},
            {label:'Repeat Clients',val:'75%',icon:'🔄'},
            {label:'Member Since',val:'Jan 2022',icon:'📅'},
          ].map(s=>`
            <div class="flex items-center justify-between p-3 mb-2 rounded-xl" style="background:#1A1033;border:1px solid #2D2250">
              <span class="text-sm" style="color:#9D8EC0">${s.icon} ${s.label}</span>
              <span class="text-sm font-bold" style="color:#C4B5FD">${s.val}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Tab: Services -->
    <div id="tab-services" class="tab-content" style="display:none">
      <div class="flex flex-col gap-3">
        ${[
          {name:'Natural Hair Twist',desc:'Full natural twist style with moisturizing treatment',price:80,duration:'2-3 hrs'},
          {name:'Box Braids (Medium)',desc:'Medium sized box braids, any length',price:150,duration:'4-5 hrs'},
          {name:'Loc Retwist',desc:'Professional retwist with sheen spray',price:60,duration:'1-2 hrs'},
          {name:'Silk Press',desc:'Silk press for all hair types + trim',price:100,duration:'2 hrs'},
          {name:'Ghana Weaving',desc:'Traditional Ghana weaving patterns',price:120,duration:'3-4 hrs'},
          {name:'Hair Coloring',desc:'Full color, highlights, or balayage',price:200,duration:'3-5 hrs'},
        ].map(s=>`
          <div class="flex items-center justify-between p-5 rounded-xl" style="background:#1A1033;border:1px solid #2D2250">
            <div class="flex-1">
              <h4 class="font-semibold mb-1">${s.name}</h4>
              <p class="text-sm mb-2" style="color:#9D8EC0">${s.desc}</p>
              <span class="text-xs" style="color:#9D8EC0"><i class="fas fa-clock mr-1"></i>${s.duration}</span>
            </div>
            <div class="text-right ml-6 flex-shrink-0">
              <div class="font-bold text-lg" style="color:#7C3AED">GHS ${s.price}</div>
              <a href="/book/1?service=${encodeURIComponent(s.name)}&price=${s.price}" class="mt-2 gradient-btn block px-4 py-1.5 rounded-lg text-white text-sm font-medium text-center">Book</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tab: Gallery -->
    <div id="tab-gallery" class="tab-content" style="display:none">
      <div class="grid grid-cols-3 gap-3">
        ${Array.from({length:9},(_,i)=>`
          <div style="aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg,#7C3AED${22+i*5},#EC4899${11+i*5});display:flex;align-items:center;justify-content:center;font-size:40px;cursor:pointer" onclick="openImage(${i})">
            ${'💇‍♀️🌿✨💅🪮💇💆🧖💄'.split('').filter((_,j)=>j%2===0)[i%5]}
          </div>
        `).join('')}
      </div>
      <p class="text-center mt-6 text-sm" style="color:#9D8EC0">Portfolio photos • Updated regularly</p>
    </div>

    <!-- Tab: Reviews -->
    <div id="tab-reviews" class="tab-content" style="display:none">
      <!-- Rating summary -->
      <div class="flex gap-8 p-6 rounded-2xl mb-6" style="background:#1A1033;border:1px solid #2D2250">
        <div class="text-center">
          <div class="font-display font-black text-6xl" style="color:#7C3AED">4.9</div>
          <div style="color:#F59E0B" class="text-xl">★★★★★</div>
          <div class="text-sm mt-1" style="color:#9D8EC0">128 reviews</div>
        </div>
        <div class="flex-1">
          ${[5,4,3,2,1].map(s=>`
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs w-3" style="color:#9D8EC0">${s}</span>
              <i class="fas fa-star text-xs" style="color:#F59E0B"></i>
              <div style="flex:1;height:6px;background:#2D2250;border-radius:3px;overflow:hidden">
                <div style="height:100%;background:#F59E0B;width:${[90,7,2,1,0][5-s]}%;border-radius:3px"></div>
              </div>
              <span class="text-xs w-8" style="color:#9D8EC0">${[115,9,3,1,0][5-s]}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <!-- Review cards -->
      ${[
        {name:'Akosua M.',rating:5,time:'2 days ago',text:'Absolutely love my locs retwist! Maame is so skilled and gentle. The salon is clean and welcoming. Will definitely be back!',service:'Loc Retwist'},
        {name:'Efua T.',rating:5,time:'1 week ago',text:'Got box braids done here for the first time and I am OBSESSED. My braids are perfect, so neat and the price is very fair for the quality.',service:'Box Braids'},
        {name:'Ama D.',rating:4,time:'2 weeks ago',text:'Silk press came out beautiful. Wait time was a bit long but the result was worth it. Lovely team.',service:'Silk Press'},
      ].map(r=>`
        <div class="p-5 rounded-2xl mb-4" style="background:#1A1033;border:1px solid #2D2250">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-weight:bold">${r.name[0]}</div>
              <div>
                <p class="font-semibold text-sm">${r.name}</p>
                <p class="text-xs" style="color:#9D8EC0">${r.service} · ${r.time}</p>
              </div>
            </div>
            <div style="color:#F59E0B">${'★'.repeat(r.rating)}</div>
          </div>
          <p class="text-sm" style="color:#9D8EC0;line-height:1.7">${r.text}</p>
        </div>
      `).join('')}
    </div>

    <!-- Tab: Location -->
    <div id="tab-location" class="tab-content" style="display:none">
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;overflow:hidden">
        <div style="height:300px;background:linear-gradient(135deg,#1A1033,#2D2250);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px">
          <i class="fas fa-map-marker-alt text-5xl" style="color:#7C3AED"></i>
          <p class="font-semibold">East Legon, Accra, Ghana</p>
          <p style="color:#9D8EC0;font-size:14px">Near East Legon Mall</p>
          <a href="https://maps.google.com?q=East+Legon+Accra" target="_blank" class="gradient-btn px-6 py-2.5 rounded-xl text-white font-medium text-sm mt-2">
            <i class="fas fa-directions mr-2"></i>Get Directions
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Sticky bottom CTA on mobile -->
<div class="md:hidden fixed bottom-0 left-0 right-0 p-4" style="background:#1A1033;border-top:1px solid #2D2250;z-index:40">
  <a href="/book/1" class="gradient-btn w-full block text-center py-4 rounded-2xl text-white font-bold text-lg">
    <i class="fas fa-calendar-plus mr-2"></i>Book Appointment
  </a>
</div>

${toastScript()}
<script>
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t=>t.style.display='none');
  document.querySelectorAll('.tab-btn').forEach(b=>{b.style.background='transparent';b.style.color='#9D8EC0';});
  document.getElementById('tab-'+name).style.display='block';
  btn.style.background='#7C3AED'; btn.style.color='white';
}
function saveFav() {
  const btn = document.getElementById('fav-btn');
  btn.innerHTML = '<i class="fas fa-heart" style="color:#EC4899"></i>';
  showToast('Added to favourites ❤️','success');
}
function shareProvider() {
  navigator.clipboard?.writeText(window.location.href);
  showToast('Link copied to clipboard!','success');
}
</script>
</body></html>`
