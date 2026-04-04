import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Home - Book Beauty Services Near You')}</head>
<body>
${navbar('home')}

<!-- HERO SECTION -->
<section style="background:linear-gradient(135deg,#0F0A1E 0%,#1A0533 50%,#0F0A1E 100%);min-height:90vh;display:flex;align-items:center;position:relative;overflow:hidden;">
  <!-- Floating orbs -->
  <div style="position:absolute;top:-100px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(124,58,237,0.15),transparent);border-radius:50%;pointer-events:none;"></div>
  <div style="position:absolute;bottom:-100px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(236,72,153,0.1),transparent);border-radius:50%;pointer-events:none;"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="slide-up">
        <div class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm">
          <span class="pulse-dot w-2 h-2 bg-green-400 rounded-full"></span>
          <span style="color:#C4B5FD">2,400+ verified professionals in Ghana</span>
        </div>
        <h1 class="font-display font-black text-5xl lg:text-7xl leading-tight mb-6">
          Your Beauty,<br/>
          <span class="gradient-text">Booked in</span><br/>
          60 Seconds.
        </h1>
        <p class="text-lg mb-8" style="color:#9D8EC0;max-width:480px;line-height:1.8">
          Discover verified salons, barbers, nail techs & beauty professionals near you. Book, pay, and get styled — all in one app.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <a href="/discover" class="gradient-btn px-8 py-4 rounded-2xl text-white font-bold text-lg text-center flex items-center justify-center gap-2">
            <i class="fas fa-search"></i> Find Services
          </a>
          <a href="/register?role=provider" class="px-8 py-4 rounded-2xl font-bold text-lg text-center flex items-center justify-center gap-2 glass border" style="border-color:#7C3AED;color:#C4B5FD">
            <i class="fas fa-store"></i> Join as Provider
          </a>
        </div>
        <!-- Stats row -->
        <div class="flex items-center gap-8">
          <div>
            <div class="font-display font-black text-3xl" style="color:#7C3AED">2.4K+</div>
            <div class="text-xs" style="color:#9D8EC0">Professionals</div>
          </div>
          <div style="width:1px;height:40px;background:#2D2250"></div>
          <div>
            <div class="font-display font-black text-3xl" style="color:#EC4899">50K+</div>
            <div class="text-xs" style="color:#9D8EC0">Bookings Done</div>
          </div>
          <div style="width:1px;height:40px;background:#2D2250"></div>
          <div>
            <div class="font-display font-black text-3xl" style="color:#F59E0B">4.9★</div>
            <div class="text-xs" style="color:#9D8EC0">Avg Rating</div>
          </div>
        </div>
      </div>

      <!-- Hero visual: floating cards -->
      <div class="relative hidden lg:block" style="height:550px">
        <!-- Main card -->
        <div class="absolute" style="top:40px;left:60px;width:300px">
          <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:20px">
            <div class="flex items-center gap-3 mb-3">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:20px">💇</div>
              <div>
                <div class="font-semibold text-sm">Glam Studio GH</div>
                <div class="flex items-center gap-1 text-xs" style="color:#F59E0B">★★★★★ <span style="color:#9D8EC0">(128)</span></div>
              </div>
              <span class="ml-auto text-xs px-2 py-1 rounded-full" style="background:#10B98122;color:#10B981">Verified</span>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div style="height:60px;background:linear-gradient(135deg,#7C3AED22,#EC4899,22);border-radius:10px;background:#2D2250"></div>
              <div style="height:60px;background:#2D2250;border-radius:10px"></div>
              <div style="height:60px;background:#2D2250;border-radius:10px"></div>
            </div>
            <a href="/book/1" class="gradient-btn block text-center py-2 rounded-xl text-white text-sm font-semibold">Book Now – GHS 80</a>
          </div>
        </div>
        <!-- Booking confirmation card -->
        <div class="absolute" style="top:20px;right:20px;width:220px">
          <div style="background:#1A1033;border:1px solid #10B98133;border-radius:16px;padding:16px">
            <div class="flex items-center gap-2 mb-2">
              <div style="width:32px;height:32px;border-radius:50%;background:#10B98122;display:flex;align-items:center;justify-content:center;color:#10B981">✓</div>
              <span class="text-sm font-semibold">Booking Confirmed!</span>
            </div>
            <p class="text-xs mb-2" style="color:#9D8EC0">Tomorrow, 2:00 PM</p>
            <p class="text-xs font-medium" style="color:#C4B5FD">Natural Twist & Style</p>
          </div>
        </div>
        <!-- Notification card -->
        <div class="absolute" style="bottom:100px;right:0;width:240px">
          <div style="background:#1A1033;border:1px solid #F59E0B33;border-radius:16px;padding:16px">
            <div class="flex items-center gap-2">
              <span style="font-size:24px">⏰</span>
              <div>
                <p class="text-xs font-semibold">Reminder</p>
                <p class="text-xs" style="color:#9D8EC0">Your appointment in 1 hour!</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Rating card -->
        <div class="absolute" style="bottom:30px;left:40px;width:200px">
          <div style="background:#1A1033;border:1px solid #EC4899,33;border-radius:16px;padding:16px">
            <p class="text-xs font-semibold mb-1">Rate your experience</p>
            <div class="flex gap-1 text-yellow-400 text-xl">★★★★★</div>
            <p class="text-xs mt-1" style="color:#9D8EC0">Loved the service! 💜</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SERVICE CATEGORIES -->
<section class="py-20" style="background:#0F0A1E">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="font-display font-bold text-4xl mb-3">Browse by <span class="gradient-text">Service</span></h2>
      <p style="color:#9D8EC0">Find exactly what you need</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      ${[
        {icon:'💇‍♀️',label:'Hair Styling',color:'#7C3AED'},
        {icon:'✂️',label:'Barbing',color:'#3B82F6'},
        {icon:'💅',label:'Nail Care',color:'#EC4899'},
        {icon:'💆',label:'Massage',color:'#10B981'},
        {icon:'🧖',label:'Facials',color:'#F59E0B'},
        {icon:'👁️',label:'Lashes',color:'#8B5CF6'},
        {icon:'💄',label:'Makeup',color:'#EF4444'},
        {icon:'🪒',label:'Shaving',color:'#06B6D4'},
      ].map(s => `
        <a href="/discover?service=${s.label}" class="flex flex-col items-center gap-3 p-4 rounded-2xl glass card-hover cursor-pointer">
          <div style="width:56px;height:56px;border-radius:16px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:28px">${s.icon}</div>
          <span class="text-xs font-medium text-center" style="color:#C4B5FD">${s.label}</span>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- TOP PROVIDERS -->
<section class="py-20" style="background:#0A0718">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h2 class="font-display font-bold text-4xl mb-2">Top <span class="gradient-text">Providers</span></h2>
        <p style="color:#9D8EC0">Highly rated, verified professionals</p>
      </div>
      <a href="/discover" class="glass px-5 py-2 rounded-xl text-sm font-medium" style="color:#C4B5FD;border:1px solid #2D2250">View All →</a>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="top-providers">
      ${generateProviderCards()}
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="py-20" style="background:#0F0A1E">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="font-display font-bold text-4xl mb-3">How <span class="gradient-text">SalonLink</span> Works</h2>
      <p style="color:#9D8EC0">Book your appointment in 3 simple steps</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      ${[
        {step:'01',icon:'fas fa-search',title:'Discover',desc:'Search for salons, barbers, or beauty pros near you. Filter by service, price, rating, or distance.',color:'#7C3AED'},
        {step:'02',icon:'fas fa-calendar-check',title:'Book',desc:'Choose your service, pick a date and time that works, and confirm your booking in seconds.',color:'#EC4899'},
        {step:'03',icon:'fas fa-star',title:'Get Styled',desc:'Show up and get the look you want. Pay online or in person. Rate your experience after.',color:'#F59E0B'},
      ].map(s => `
        <div class="relative p-8 rounded-2xl" style="background:#1A1033;border:1px solid #2D2250">
          <div class="absolute -top-4 left-8 text-5xl font-black" style="color:#2D2250;font-family:'Poppins',sans-serif">${s.step}</div>
          <div style="width:56px;height:56px;border-radius:16px;background:${s.color}22;display:flex;align-items:center;justify-content:center;margin-bottom:20px">
            <i class="${s.icon} text-2xl" style="color:${s.color}"></i>
          </div>
          <h3 class="font-display font-bold text-xl mb-3">${s.title}</h3>
          <p style="color:#9D8EC0;line-height:1.7">${s.desc}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- FOR PROVIDERS CTA -->
<section class="py-20" style="background:linear-gradient(135deg,#1A0533,#0F0A1E)">
  <div class="max-w-4xl mx-auto px-4 text-center">
    <div class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm" style="color:#C4B5FD">
      <i class="fas fa-store" style="color:#7C3AED"></i> For Beauty Professionals
    </div>
    <h2 class="font-display font-black text-5xl mb-6">Grow Your Business<br/><span class="gradient-text">For Free</span></h2>
    <p class="text-lg mb-10" style="color:#9D8EC0;max-width:560px;margin:0 auto 40px">Join thousands of beauty professionals already using SalonLink to get discovered, manage bookings, and grow their clientele.</p>
    <div class="grid sm:grid-cols-3 gap-6 mb-10">
      ${[
        {icon:'fas fa-user-plus',title:'Free Sign Up',desc:'No setup fees. Register and start accepting bookings instantly.'},
        {icon:'fas fa-id-card',title:'KYC Verified',desc:'Build trust with customers through our Ghana Card verification system.'},
        {icon:'fas fa-chart-line',title:'Grow Revenue',desc:'Smart scheduling, hairstyle history, and customer management tools.'},
      ].map(f => `
        <div class="p-6 rounded-2xl glass text-left">
          <i class="${f.icon} text-2xl mb-4 block" style="color:#7C3AED"></i>
          <h4 class="font-semibold mb-2">${f.title}</h4>
          <p class="text-sm" style="color:#9D8EC0">${f.desc}</p>
        </div>
      `).join('')}
    </div>
    <a href="/register?role=provider" class="gradient-btn inline-block px-10 py-4 rounded-2xl text-white font-bold text-lg">
      <i class="fas fa-rocket mr-2"></i> Start for Free Today
    </a>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:#0A0718;border-top:1px solid #2D2250;padding:60px 0 30px">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-2xl">✂️</span>
          <span class="font-display font-bold text-lg gradient-text">SalonLink</span>
        </div>
        <p class="text-sm" style="color:#9D8EC0;line-height:1.7">The #1 beauty booking platform in Ghana. Connecting customers with verified professionals.</p>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Platform</h4>
        <div class="flex flex-col gap-2 text-sm" style="color:#9D8EC0">
          <a href="/discover" class="hover:text-white transition">Find Services</a>
          <a href="/register?role=provider" class="hover:text-white transition">Become a Provider</a>
          <a href="/login" class="hover:text-white transition">Login</a>
        </div>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Support</h4>
        <div class="flex flex-col gap-2 text-sm" style="color:#9D8EC0">
          <a href="#" class="hover:text-white transition">Help Center</a>
          <a href="#" class="hover:text-white transition">Privacy Policy</a>
          <a href="#" class="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Contact</h4>
        <div class="flex flex-col gap-2 text-sm" style="color:#9D8EC0">
          <span><i class="fas fa-envelope mr-2"></i>hello@salonlink.gh</span>
          <span><i class="fas fa-phone mr-2"></i>+233 20 000 0000</span>
          <span><i class="fas fa-map-marker-alt mr-2"></i>Accra, Ghana</span>
        </div>
        <div class="flex gap-3 mt-4">
          <a href="#" class="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-purple-900 transition"><i class="fab fa-instagram text-sm"></i></a>
          <a href="#" class="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-purple-900 transition"><i class="fab fa-twitter text-sm"></i></a>
          <a href="#" class="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-purple-900 transition"><i class="fab fa-facebook text-sm"></i></a>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid #2D2250;padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <p class="text-sm" style="color:#9D8EC0">© 2025 SalonLink. All rights reserved. Made with 💜 in Ghana.</p>
      <div class="flex gap-4 text-sm" style="color:#9D8EC0">
        <span>🇬🇭 Ghana</span>
        <span>GHS Cedis</span>
      </div>
    </div>
  </div>
</footer>

${mobileNav('home')}
${toastScript()}
</body>
</html>`

function generateProviderCards() {
  const providers = [
    {name:'Glam Studio GH',type:'Hair Salon',rating:'4.9',reviews:128,price:'GHS 80',location:'East Legon, Accra',verified:true,emoji:'💇‍♀️',tags:['Braiding','Natural Hair','Locs'],color:'#7C3AED'},
    {name:'KutzByKofi',type:'Barbershop',rating:'4.8',reviews:96,price:'GHS 40',location:'Osu, Accra',verified:true,emoji:'✂️',tags:['Fade','Lineup','Dreads'],color:'#3B82F6'},
    {name:'Nails by Abena',type:'Nail Tech',rating:'5.0',reviews:64,price:'GHS 60',location:'Airport Area, Accra',verified:true,emoji:'💅',tags:['Gel Nails','Acrylics','Nail Art'],color:'#EC4899'},
  ]
  return providers.map(p => `
    <div class="provider-card" onclick="window.location.href='/provider/1'">
      <div style="height:140px;background:linear-gradient(135deg,${p.color}33,${p.color}11);display:flex;align-items:center;justify-content:center;font-size:60px;position:relative">
        ${p.emoji}
        ${p.verified ? `<span class="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium" style="background:#10B98122;color:#10B981;border:1px solid #10B98133"><i class="fas fa-check-circle mr-1"></i>Verified</span>` : ''}
      </div>
      <div style="padding:16px">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-semibold text-base">${p.name}</h3>
            <p class="text-xs" style="color:#9D8EC0">${p.type} · ${p.location}</p>
          </div>
          <div class="text-right">
            <div class="font-bold text-sm" style="color:#7C3AED">From ${p.price}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <div class="flex gap-0.5 text-xs" style="color:#F59E0B">${'★'.repeat(5)}</div>
          <span class="text-xs font-semibold">${p.rating}</span>
          <span class="text-xs" style="color:#9D8EC0">(${p.reviews} reviews)</span>
        </div>
        <div class="flex gap-2 flex-wrap mb-3">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <button class="w-full gradient-btn py-2.5 rounded-xl text-white text-sm font-semibold">Book Appointment</button>
      </div>
    </div>
  `).join('')
}
