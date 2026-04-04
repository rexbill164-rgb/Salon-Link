import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Ghana\'s Most Exclusive Beauty Experience', `
<style>
  /* Hero specific */
  .hero-wrap { position:relative; min-height:100vh; display:flex; align-items:center; overflow:hidden; }
  .hero-bg-gradient { position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(201,168,76,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 10% 90%, rgba(160,120,48,0.04) 0%, transparent 50%); }
  .hero-line { position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:1px; height:120px; background:linear-gradient(180deg, transparent, var(--g-border)); }
  .floating-card { background:var(--c-surface); border:1px solid var(--g-border); border-radius:var(--r-xl); padding:24px; box-shadow:0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.1); backdrop-filter:blur(20px); }
  .service-pill { display:flex; align-items:center; gap:14px; padding:14px 18px; background:var(--c-surface); border:1px solid var(--i-faint); border-radius:14px; text-decoration:none; transition:all 0.35s var(--ease-luxury); cursor:pointer; }
  .service-pill:hover { border-color:var(--g-border); transform:translateX(4px); background:var(--g-dim); }
  .marquee-track { display:flex; gap:60px; animation:marquee 25s linear infinite; white-space:nowrap; }
  @keyframes ticker { 0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:none} }
  .provider-feature-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; cursor:pointer; transition:all 0.5s var(--ease-luxury); }
  .provider-feature-card:hover { border-color:var(--g-border-s); transform:translateY(-10px); box-shadow:0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px var(--g-dim); }
  .provider-feature-card:hover .card-img { transform:scale(1.06); }
  .card-img { transition:transform 0.6s var(--ease-luxury); }
  .testimonial-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-xl); padding:40px; transition:all 0.4s; }
  .testimonial-card:hover { border-color:var(--g-border); box-shadow:0 24px 60px rgba(0,0,0,0.4); }
  .number-counter { font-family:'Playfair Display',serif; font-size:clamp(40px,6vw,72px); font-weight:400; line-height:1; letter-spacing:-0.02em; }
</style>
`)}
</head>
<body class="bg-grain">
${navbar('home')}

<!-- ══════════════════════════════════════════════
     HERO
══════════════════════════════════════════════ -->
<section class="hero-wrap bg-grid">
  <div class="hero-bg-gradient"></div>

  <!-- Floating orbs -->
  <div class="orb" style="width:700px;height:700px;background:radial-gradient(circle,rgba(201,168,76,0.04),transparent);top:-250px;right:-200px;animation:orb-pulse 8s ease infinite;"></div>
  <div class="orb" style="width:400px;height:400px;background:radial-gradient(circle,rgba(160,120,48,0.05),transparent);bottom:-100px;left:-150px;animation:orb-pulse 10s ease 2s infinite;"></div>

  <div class="container" style="padding-top:60px;padding-bottom:80px;position:relative;z-index:1;">
    <div style="display:grid;grid-template-columns:55fr 45fr;gap:80px;align-items:center;">

      <!-- LEFT -->
      <div>
        <div class="afu" style="display:inline-flex;align-items:center;gap:12px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:100px;padding:8px 18px 8px 10px;margin-bottom:36px;">
          <div style="width:22px;height:22px;border-radius:50%;background:var(--g-main);display:flex;align-items:center;justify-content:center;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#05040A"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--g-main);">Ghana's #1 Beauty Platform</span>
        </div>

        <h1 class="display-hero afu-1" style="margin-bottom:28px;">
          Where Beauty<br/>
          Meets <em class="gold-gradient" style="font-style:italic;">Luxury.</em>
        </h1>

        <p class="afu-2" style="font-size:17px;line-height:1.9;color:var(--t-secondary);max-width:460px;margin-bottom:52px;font-weight:300;">
          Discover and instantly book Ghana's most exceptional beauty professionals.
          Verified identities, seamless payments, and unforgettable experiences.
        </p>

        <div class="afu-3" style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:72px;">
          <a href="/discover" class="btn-primary" style="padding:17px 40px;font-size:13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Discover Now
          </a>
          <a href="/register?role=provider" class="btn-outline" style="padding:16px 36px;font-size:13px;">
            Join as Provider
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        <!-- Stats row -->
        <div class="afu-4" style="display:flex;gap:0;align-items:stretch;">
          ${[
            {num:'2,400+',label:'Verified Providers',icon:'✓'},
            {num:'50K+',  label:'Happy Clients',    icon:'♡'},
            {num:'4.9',   label:'Average Rating',   icon:'★'},
          ].map((s,i) => `
            <div style="flex:1;padding:0 ${i>0?'32px':'0 32px 0 0'};${i>0?'border-left:1px solid var(--i-faint);':''}">
              <div class="number-counter gold-gradient">${s.num}</div>
              <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-top:6px;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RIGHT: Floating UI stack -->
      <div class="hide-mob" style="position:relative;height:620px;">

        <!-- Main booking card -->
        <div class="floating-card float" style="position:absolute;top:20px;left:0;width:320px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
            <span class="eyebrow">Featured Provider</span>
            <span class="badge badge-verified"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> KYC Verified</span>
          </div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:22px;">
            <div style="width:60px;height:60px;border-radius:18px;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">💇‍♀️</div>
            <div>
              <div class="font-display" style="font-size:20px;font-weight:500;margin-bottom:3px;">Glam Studio GH</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span class="stars" style="font-size:13px;">★★★★★</span>
                <span style="font-size:12px;font-weight:600;color:var(--g-main);">4.9</span>
                <span style="font-size:11px;color:var(--t-muted);">(128 reviews)</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:22px;">
            ${['Braiding','Natural Hair','Locs','Silk Press'].map(t=>`<span class="tag">${t}</span>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding:14px 18px;background:var(--c-raise);border-radius:12px;">
            <div>
              <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:4px;">Starting from</div>
              <div class="font-display gold-gradient" style="font-size:26px;">GHS 80</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-bottom:4px;">Location</div>
              <div style="font-size:13px;color:var(--t-secondary);">East Legon, Accra</div>
            </div>
          </div>
          <a href="/book/1" class="btn-primary" style="width:100%;justify-content:center;padding:14px;">Book Appointment</a>
        </div>

        <!-- Confirmed pill -->
        <div style="position:absolute;top:12px;right:-20px;background:rgba(61,170,110,0.1);border:1px solid rgba(61,170,110,0.25);border-radius:16px;padding:14px 18px;animation:fadeUp 0.6s 0.5s both;backdrop-filter:blur(20px);">
          <div style="display:flex;align-items:center;gap:11px;">
            <div style="width:34px;height:34px;border-radius:50%;background:rgba(61,170,110,0.2);display:flex;align-items:center;justify-content:center;color:#5DC98A;font-size:16px;">✓</div>
            <div>
              <div style="font-size:13px;font-weight:600;color:#5DC98A;">Booking Confirmed</div>
              <div style="font-size:11px;color:var(--t-muted);margin-top:2px;">Friday · 2:30 PM</div>
            </div>
          </div>
        </div>

        <!-- Payment confirmation -->
        <div style="position:absolute;bottom:160px;right:-10px;width:240px;background:var(--c-surface);border:1px solid var(--g-border);border-radius:16px;padding:18px;animation:fadeUp 0.6s 0.8s both;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:34px;height:34px;border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--g-main)" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div>
              <div style="font-size:12px;font-weight:600;">Payment via MTN MoMo</div>
              <div style="font-size:11px;color:var(--t-muted);">Secure · Instant</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:var(--t-muted);">Total paid</span>
            <span class="font-display gold-gradient" style="font-size:18px;">GHS 120</span>
          </div>
        </div>

        <!-- Style history preview -->
        <div style="position:absolute;bottom:40px;left:10px;width:270px;background:var(--c-surface);border:1px solid var(--i-faint);border-radius:20px;padding:20px;animation:fadeUp 0.6s 1.0s both;">
          <div class="eyebrow" style="margin-bottom:14px;">Style History</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            ${['💇‍♀️','🌿','✨','💅'].map((e,i)=>`
              <div style="aspect-ratio:1;border-radius:12px;background:${i===0?'linear-gradient(135deg,var(--c-mist),var(--g-dim))':'var(--c-raise)'};border:1px solid ${i===0?'var(--g-border)':'var(--i-faint)'};display:flex;align-items:center;justify-content:center;font-size:22px;">
                ${e}
              </div>
            `).join('')}
          </div>
          <div style="margin-top:12px;font-size:11px;color:var(--t-muted);">4 appointments · Last: 2 weeks ago</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:float 3s ease-in-out infinite;">
    <span style="font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--t-faint);">Scroll</span>
    <div style="width:1px;height:36px;background:linear-gradient(180deg,var(--g-border),transparent);"></div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     MARQUEE STRIP
══════════════════════════════════════════════ -->
<div style="border-top:1px solid var(--i-faint);border-bottom:1px solid var(--i-faint);background:var(--c-dark);padding:18px 0;overflow:hidden;">
  <div class="marquee-track">
    ${['Braiding & Locs','Barber & Fades','Nail Artistry','Massage Therapy','Bridal Makeup','Lash Extensions','Skin Facials','Natural Hair','Body Waxing','Brow Shaping'].map(s=>`
      <span style="display:inline-flex;align-items:center;gap:16px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--t-faint);">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        ${s}
      </span>
    `).join('')}
    ${['Braiding & Locs','Barber & Fades','Nail Artistry','Massage Therapy','Bridal Makeup','Lash Extensions'].map(s=>`
      <span style="display:inline-flex;align-items:center;gap:16px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--t-faint);">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        ${s}
      </span>
    `).join('')}
  </div>
</div>

<!-- ══════════════════════════════════════════════
     SERVICES — EDITORIAL GRID
══════════════════════════════════════════════ -->
<section style="padding:140px 0;background:var(--c-dark);">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:80px;" class="reveal">
      <div>
        <div class="eyebrow" style="margin-bottom:20px;">What We Offer</div>
        <h2 class="display-xl">Browse by<br/><em class="gold-gradient">Service</em></h2>
      </div>
      <a href="/discover" class="btn-outline">View All Services <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>

    <!-- 4-col grid desktop / 2-col tablet / scroll mobile -->
    <div class="grid-4 hide-mob">
      ${[
        {emoji:'💇‍♀️',title:'Hair Styling',  desc:'Natural, braided & relaxed',count:'680+ providers',href:'Hair Styling'},
        {emoji:'✂️', title:'Barbing',       desc:'Fades, lineups & grooming', count:'240+ providers',href:'Barbing'},
        {emoji:'💅', title:'Nail Artistry', desc:'Gel, acrylics & nail art',   count:'190+ providers',href:'Nail Care'},
        {emoji:'💆', title:'Massage',       desc:'Swedish & deep tissue',      count:'120+ providers',href:'Massage'},
        {emoji:'🧖', title:'Facials & Spa', desc:'HydraFacials & skin care',   count:'95+ providers', href:'Facials'},
        {emoji:'👁️', title:'Lash Extensions',desc:'Classic, volume & hybrid', count:'140+ providers',href:'Lashes'},
        {emoji:'💄', title:'Makeup',        desc:'Bridal, editorial & glam',   count:'210+ providers',href:'Makeup'},
        {emoji:'🪒', title:'Shaving',       desc:'Hot towel & straight razor', count:'80+ providers', href:'Shaving'},
      ].map((s,i) => `
        <a href="/discover?service=${encodeURIComponent(s.href)}" class="card reveal" style="padding:30px;text-decoration:none;display:block;--delay:${i*50}ms;animation-delay:var(--delay);">
          <div style="width:52px;height:52px;border-radius:16px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;">${s.emoji}</div>
          <div style="font-size:15px;font-weight:600;color:var(--t-primary);margin-bottom:6px;">${s.title}</div>
          <div style="font-size:12px;color:var(--t-secondary);line-height:1.6;margin-bottom:18px;font-weight:300;">${s.desc}</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            <span style="font-size:11px;letter-spacing:0.08em;color:var(--g-main);">${s.count}</span>
          </div>
        </a>
      `).join('')}
    </div>

    <!-- Mobile horizontal scroll -->
    <div class="show-mob" style="display:flex;gap:14px;overflow-x:auto;padding-bottom:12px;" class="no-scrollbar">
      ${[{emoji:'💇‍♀️',title:'Hair'},{emoji:'✂️',title:'Barbing'},{emoji:'💅',title:'Nails'},{emoji:'💆',title:'Massage'},{emoji:'💄',title:'Makeup'},{emoji:'👁️',title:'Lashes'}].map(s=>`
        <a href="/discover?service=${s.title}" style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 16px;background:var(--c-surface);border:1px solid var(--i-faint);border-radius:20px;min-width:88px;text-decoration:none;transition:border-color 0.3s;">
          <span style="font-size:30px;">${s.emoji}</span>
          <span style="font-size:11px;color:var(--t-secondary);font-weight:500;">${s.title}</span>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FEATURED PROVIDERS
══════════════════════════════════════════════ -->
<section style="padding:140px 0;background:var(--c-void);">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:80px;" class="reveal">
      <div>
        <div class="eyebrow" style="margin-bottom:20px;">Hand-Picked Excellence</div>
        <h2 class="display-xl">Featured<br/><em class="gold-gradient">Providers</em></h2>
      </div>
      <a href="/discover" class="btn-ghost">View All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    </div>
    <div class="grid-3">
      ${featuredProviders()}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     HOW IT WORKS
══════════════════════════════════════════════ -->
<section style="padding:160px 0;background:var(--c-dark);position:relative;overflow:hidden;">
  <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(201,168,76,0.04),transparent);top:50%;left:50%;transform:translate(-50%,-50%);"></div>
  <div class="container" style="position:relative;z-index:1;">
    <div style="text-align:center;margin-bottom:100px;" class="reveal">
      <div class="eyebrow" style="margin-bottom:20px;">Simple. Elegant. Fast.</div>
      <h2 class="display-xl">Perfection in<br/><em class="gold-gradient">Three Steps</em></h2>
    </div>

    <!-- Steps with connecting line -->
    <div style="position:relative;">
      <div style="position:absolute;top:32px;left:calc(16.66% + 19px);right:calc(16.66% + 19px);height:1px;background:linear-gradient(90deg,transparent,var(--g-border),transparent);" class="hide-mob"></div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;" class="hide-mob">
        ${[
          {n:'01',title:'Discover',  icon:'<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',desc:'Browse Ghana\'s most exceptional beauty professionals. Filter by service, price, distance, and verified status.'},
          {n:'02',title:'Book',      icon:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',desc:'Choose your service, pick a date, and confirm your slot in under 60 seconds. Zero double-booking, guaranteed.'},
          {n:'03',title:'Experience',icon:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',desc:'Arrive and receive world-class treatment. Pay via mobile money or card. Your style history is saved for next time.'},
        ].map((s,i) => `
          <div class="reveal" style="padding:56px 48px;text-align:center;">
            <div style="position:relative;display:inline-flex;margin-bottom:32px;">
              <div style="width:64px;height:64px;border-radius:50%;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--g-main)" stroke-width="1.8">${s.icon}</svg>
              </div>
              <div class="font-display" style="position:absolute;top:-18px;right:-18px;font-size:48px;font-weight:400;color:rgba(201,168,76,0.1);line-height:1;pointer-events:none;">${s.n}</div>
            </div>
            <h3 class="display-sm font-display" style="margin-bottom:16px;">${s.title}</h3>
            <p style="font-size:14px;color:var(--t-secondary);line-height:1.9;font-weight:300;">${s.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- Mobile: stacked -->
      <div class="show-mob" style="display:flex;flex-direction:column;gap:24px;">
        ${[
          {n:'01',title:'Discover',desc:'Browse verified beauty professionals near you.'},
          {n:'02',title:'Book',desc:'Pick a time slot. Confirm in under 60 seconds.'},
          {n:'03',title:'Experience',desc:'Get treated. Pay flexibly. Style history saved.'},
        ].map(s=>`
          <div style="display:flex;gap:24px;align-items:flex-start;padding:28px;background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);">
            <div class="font-display" style="font-size:40px;color:var(--g-border);line-height:1;flex-shrink:0;">${s.n}</div>
            <div>
              <div style="font-size:18px;font-family:'Playfair Display',serif;margin-bottom:8px;">${s.title}</div>
              <div style="font-size:13px;color:var(--t-secondary);line-height:1.7;">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOR PROVIDERS — FULL-WIDTH SPLIT
══════════════════════════════════════════════ -->
<section style="padding:160px 0;background:var(--c-void);">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:120px;align-items:center;">

      <!-- Dashboard preview card -->
      <div class="reveal" style="order:0;">
        <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);overflow:hidden;box-shadow:0 60px 120px rgba(0,0,0,0.7);">
          <!-- Window chrome -->
          <div style="padding:14px 20px;background:var(--c-dark);border-bottom:1px solid var(--i-faint);display:flex;align-items:center;gap:8px;">
            ${['#C04848','#C9A84C','#3DAA6E'].map(c=>`<div style="width:10px;height:10px;border-radius:50%;background:${c};opacity:0.8;"></div>`).join('')}
            <span style="font-size:11px;color:var(--t-faint);margin-left:8px;letter-spacing:0.06em;">Provider Dashboard · Glam Studio GH</span>
          </div>
          <div style="padding:28px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
              ${[
                {label:"Today's Appointments",val:'6',icon:'📅'},
                {label:'This Week Revenue',val:'GHS 2,480',icon:'💰'},
                {label:'Total Clients',val:'248',icon:'👥'},
                {label:'Avg Rating',val:'4.9 ★',icon:'⭐'},
              ].map(s=>`
                <div style="background:var(--c-dark);border:1px solid var(--i-faint);border-radius:14px;padding:18px;">
                  <div style="font-size:18px;margin-bottom:6px;">${s.icon}</div>
                  <div class="font-display gold-gradient" style="font-size:22px;margin-bottom:4px;">${s.val}</div>
                  <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--t-faint);">${s.label}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:14px;">Today's Schedule</div>
            ${[
              {time:'9:00 AM',name:'Akosua Mensah',service:'Natural Twist',status:'confirmed'},
              {time:'11:30 AM',name:'Efua Tetteh',service:'Box Braids',status:'confirmed'},
              {time:'2:00 PM',name:'Ama Darko',service:'Silk Press',status:'pending'},
            ].map(a=>`
              <div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid rgba(247,242,234,0.04);">
                <span style="font-size:11px;color:var(--g-main);font-weight:600;min-width:66px;">${a.time}</span>
                <span style="font-size:13px;font-weight:500;flex:1;">${a.name}</span>
                <span style="font-size:11px;color:var(--t-muted);">${a.service}</span>
                <span class="badge ${a.status==='confirmed'?'badge-verified':'badge-pending'}" style="font-size:9px;">${a.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Copy -->
      <div class="reveal">
        <div class="eyebrow" style="margin-bottom:24px;">For Beauty Professionals</div>
        <h2 class="display-xl" style="margin-bottom:24px;">
          Grow Your Business.<br/>
          <em class="gold-gradient">Completely Free.</em>
        </h2>
        <p style="font-size:16px;color:var(--t-secondary);line-height:1.9;margin-bottom:48px;font-weight:300;">
          Join thousands of beauty professionals thriving on SalonLink. Get discovered,
          manage bookings effortlessly, and build a loyal clientele — all from one elegant platform.
        </p>
        <div style="display:flex;flex-direction:column;gap:22px;margin-bottom:52px;">
          ${[
            {icon:'🪪',title:'Free KYC Verification',desc:'Build instant trust with Ghana Card identity + facial verification.'},
            {icon:'📅',title:'Smart Booking Calendar',desc:'Intelligent scheduling that eliminates double-bookings automatically.'},
            {icon:'🖼️',title:'Hairstyle Portfolio',desc:'Store client style history and showcase your best transformations.'},
            {icon:'📊',title:'Growth Analytics',desc:'Track revenue, booking trends, and client retention in real-time.'},
          ].map(f=>`
            <div style="display:flex;align-items:flex-start;gap:18px;">
              <div style="width:46px;height:46px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${f.icon}</div>
              <div>
                <div style="font-size:15px;font-weight:600;margin-bottom:5px;">${f.title}</div>
                <div style="font-size:13px;color:var(--t-secondary);font-weight:300;line-height:1.7;">${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="/register?role=provider" class="btn-primary" style="font-size:13px;padding:17px 40px;">
          Start for Free
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════ -->
<section style="padding:140px 0;background:var(--c-dark);">
  <div class="container">
    <div style="text-align:center;margin-bottom:80px;" class="reveal">
      <div class="eyebrow" style="margin-bottom:20px;">Client Love</div>
      <h2 class="display-xl">What They <em class="gold-gradient">Say</em></h2>
    </div>
    <div class="grid-3">
      ${[
        {name:'Akosua Mensah',loc:'Customer · Accra',q:'"SalonLink completely transformed how I find hair appointments. A verified stylist in minutes — truly exceptional."',stars:5,initial:'A'},
        {name:'Efua Tetteh',  loc:'Customer · East Legon', q:'"The experience is so refined — from booking to the chair. My stylist had my full style history ready on arrival."',stars:5,initial:'E'},
        {name:'Kofi Asante',  loc:'Barbershop Owner · Osu', q:'"Since joining SalonLink my bookings tripled. The KYC verification makes clients trust us immediately."',stars:5,initial:'K'},
      ].map(t=>`
        <div class="testimonial-card reveal">
          <div class="stars" style="font-size:16px;margin-bottom:24px;">${'★'.repeat(t.stars)}</div>
          <p class="font-serif" style="font-size:18px;line-height:1.85;color:var(--t-primary);font-weight:300;margin-bottom:32px;font-style:italic;">${t.q}</p>
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:18px;color:var(--g-main);">${t.initial}</div>
            <div>
              <div style="font-size:14px;font-weight:600;">${t.name}</div>
              <div style="font-size:11px;color:var(--t-muted);">${t.loc}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     CTA BAND
══════════════════════════════════════════════ -->
<section style="padding:180px 0;background:var(--c-void);text-align:center;position:relative;overflow:hidden;">
  <div class="orb" style="width:900px;height:900px;background:radial-gradient(circle,rgba(201,168,76,0.05),transparent);top:50%;left:50%;transform:translate(-50%,-50%);animation:orb-pulse 10s ease infinite;"></div>
  <div class="container" style="position:relative;z-index:1;" class="reveal">
    <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:48px;">
      <div style="height:1px;width:40px;background:linear-gradient(90deg,transparent,var(--g-border));"></div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      <div style="height:1px;width:40px;background:linear-gradient(90deg,var(--g-border),transparent);"></div>
    </div>
    <h2 class="display-hero reveal" style="margin-bottom:28px;">
      Your Next Look<br/><em class="gold-gradient">Awaits.</em>
    </h2>
    <p style="font-size:18px;color:var(--t-secondary);margin-bottom:56px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.8;font-weight:300;">
      Join 50,000+ Ghanaians who book their beauty experiences through SalonLink.
    </p>
    <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;" class="reveal">
      <a href="/discover" class="btn-primary" style="font-size:14px;padding:18px 48px;">Discover Providers</a>
      <a href="/register" class="btn-outline" style="font-size:14px;padding:17px 44px;">Create Free Account</a>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════ -->
<footer style="background:var(--c-deep);border-top:1px solid var(--i-faint);padding:100px 0 48px;">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;margin-bottom:80px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
          <div style="width:36px;height:36px;border:1px solid var(--g-border);border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--g-dim);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <span style="font-family:'Playfair Display',serif;font-size:20px;letter-spacing:0.1em;">SALONLINK</span>
        </div>
        <p style="font-size:13px;color:var(--t-secondary);line-height:1.9;max-width:260px;font-weight:300;">
          Ghana's most exclusive beauty booking platform. Connecting clients with verified professionals since 2025.
        </p>
        <div style="display:flex;gap:10px;margin-top:28px;">
          ${[['fab fa-instagram','Instagram'],['fab fa-twitter','Twitter'],['fab fa-tiktok','TikTok']].map(([ic,label])=>`
            <a href="#" title="${label}" class="btn-icon" style="width:38px;height:38px;border-radius:10px;">
              <i class="${ic}" style="font-size:13px;"></i>
            </a>
          `).join('')}
        </div>
      </div>
      ${[
        {title:'Platform',links:['Discover Services','Become a Provider','Login','Register']},
        {title:'Company', links:['About Us','Careers','Press','Blog']},
        {title:'Support', links:['Help Center','Privacy Policy','Terms','Contact']},
      ].map(col=>`
        <div>
          <div class="eyebrow" style="margin-bottom:22px;">${col.title}</div>
          <div style="display:flex;flex-direction:column;gap:13px;">
            ${col.links.map(l=>`
              <a href="#" style="font-size:13px;color:var(--t-secondary);text-decoration:none;transition:color 0.2s;font-weight:300;" onmouseover="this.style.color='var(--t-primary)'" onmouseout="this.style.color='var(--t-secondary)'">${l}</a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="divider" style="margin-bottom:32px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
      <p style="font-size:12px;color:var(--t-faint);">© 2025 SalonLink Ltd. All rights reserved. Made with love in Accra, Ghana 🇬🇭</p>
      <p style="font-size:12px;color:var(--t-faint);">GHS · English · Privacy Policy</p>
    </div>
  </div>
</footer>

${mobileNav('home')}
${globalScripts()}
</body></html>`

function featuredProviders() {
  const providers = [
    {id:1,name:'Glam Studio GH',   type:'Hair Salon',     rating:'4.9',reviews:128,price:'80',  loc:'East Legon',  emoji:'💇‍♀️',tags:['Braiding','Natural Hair','Locs'],open:true, verified:true},
    {id:2,name:'KutzByKofi',       type:'Barbershop',     rating:'4.8',reviews:96, price:'40',  loc:'Osu, Accra',  emoji:'✂️',  tags:['Fade','Dreads','Beard'],          open:true, verified:true},
    {id:3,name:'Nails by Abena',   type:'Nail Technician',rating:'5.0',reviews:64, price:'60',  loc:'Airport Area',emoji:'💅',  tags:['Gel','Acrylics','Nail Art'],       open:false,verified:true},
  ]
  return providers.map(p => `
    <div class="card-provider reveal" onclick="window.location.href='/provider/${p.id}'">
      <!-- Image area -->
      <div style="height:180px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));display:flex;align-items:center;justify-content:center;position:relative;border-bottom:1px solid var(--i-faint);">
        <div class="card-img" style="font-size:72px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.4));">${p.emoji}</div>
        <!-- Badges -->
        <div style="position:absolute;top:16px;left:16px;">
          ${p.verified ? `<span class="badge badge-verified"><svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Verified</span>` : ''}
        </div>
        <div style="position:absolute;top:16px;right:16px;">
          <span class="badge ${p.open?'badge-live':'badge-closed'}">
            ${p.open ? `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:4px;animation:pulse-ring 2s infinite;"></span> Open Now` : 'Closed'}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:26px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div class="font-display" style="font-size:19px;font-weight:500;margin-bottom:4px;">${p.name}</div>
            <div style="font-size:12px;color:var(--t-muted);">${p.type} &nbsp;·&nbsp; ${p.loc}</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:3px;">from</div>
            <div class="font-display gold-gradient" style="font-size:20px;">GHS ${p.price}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <span class="stars">★★★★★</span>
          <span style="font-size:13px;font-weight:700;color:var(--g-main);">${p.rating}</span>
          <span style="font-size:12px;color:var(--t-muted);">(${p.reviews} reviews)</span>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;">
          ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>

        <div style="display:flex;gap:10px;">
          <a href="/book/${p.id}" onclick="event.stopPropagation()" class="btn-primary" style="flex:1;justify-content:center;padding:12px 16px;font-size:11px;">
            Book Now
          </a>
          <button onclick="event.stopPropagation();showToast('Saved to favourites ✦','success')" class="btn-icon" title="Save">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}
