import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Ghana\'s Most Exclusive Beauty Experience', `
<style>
  /* Hero specific */
  .hero-wrap { position:relative; min-height:100vh; display:flex; align-items:center; overflow:hidden; background:linear-gradient(160deg, #FFFDF9 0%, #FDF6E8 55%, #FAF0D8 100%); }
  .hero-bg-gradient { position:absolute; inset:0; background: radial-gradient(ellipse 70% 60% at 65% 40%, rgba(201,168,76,0.08) 0%, transparent 55%), radial-gradient(ellipse 50% 80% at 10% 90%, rgba(232,201,122,0.06) 0%, transparent 50%); }
  .floating-card { background:#FFFFFF; border:1px solid rgba(201,168,76,0.25); border-radius:var(--r-xl); padding:24px; box-shadow:0 24px 60px rgba(160,120,48,0.14), 0 4px 16px rgba(58,47,30,0.06); }
  .service-pill { display:flex; align-items:center; gap:14px; padding:14px 18px; background:#FFFFFF; border:1px solid var(--i-faint); border-radius:14px; text-decoration:none; transition:all 0.35s var(--ease-luxury); cursor:pointer; }
  .service-pill:hover { border-color:var(--g-border); transform:translateX(4px); background:var(--g-dim); }
  .marquee-track { display:flex; gap:60px; animation:marquee 30s linear infinite; white-space:nowrap; }
  .provider-feature-card { background:#FFFFFF; border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; cursor:pointer; transition:all 0.5s var(--ease-luxury); box-shadow:0 4px 20px rgba(58,47,30,0.07); }
  .provider-feature-card:hover { border-color:var(--g-border-s); transform:translateY(-10px); box-shadow:0 32px 70px rgba(160,120,48,0.18); }
  .provider-feature-card:hover .card-img-wrap img { transform:scale(1.06); }
  .card-img-wrap { overflow:hidden; }
  .card-img-wrap img { transition:transform 0.6s var(--ease-luxury); width:100%; height:100%; object-fit:cover; }
  .testimonial-card { background:#FFFFFF; border:1px solid var(--i-faint); border-radius:var(--r-xl); padding:38px; transition:all 0.4s; box-shadow:0 4px 20px rgba(58,47,30,0.06); }
  .testimonial-card:hover { border-color:var(--g-border); box-shadow:0 20px 50px rgba(160,120,48,0.14); transform:translateY(-4px); }
  .number-counter { font-family:'Playfair Display',serif; font-size:clamp(40px,6vw,68px); font-weight:400; line-height:1; letter-spacing:-0.02em; }
  .hero-img-main { border-radius:28px; overflow:hidden; box-shadow:0 32px 80px rgba(160,120,48,0.2), 0 8px 32px rgba(58,47,30,0.1); position:relative; }
  .hero-img-main img { width:100%; height:480px; object-fit:cover; display:block; }
  .section-light { background: #FFFFFF; }
  .section-cream { background: linear-gradient(180deg, #FAF6EF 0%, #FFFDF9 100%); }
  .section-warm  { background: linear-gradient(160deg, #FDF6E8 0%, #FAF0D8 50%, #FDF6E8 100%); }
</style>
`)}
</head>
<body>
${navbar('home')}

<!-- ══════════════════════════════════════════════
     HERO
══════════════════════════════════════════════ -->
<section class="hero-wrap">
  <div class="hero-bg-gradient"></div>

  <!-- Decorative orbs -->
  <div class="orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(201,168,76,0.06),transparent);top:-200px;right:-150px;animation:orb-pulse 9s ease infinite;"></div>
  <div class="orb" style="width:350px;height:350px;background:radial-gradient(circle,rgba(232,201,122,0.07),transparent);bottom:-80px;left:-120px;animation:orb-pulse 11s ease 2s infinite;"></div>

  <div class="container" style="padding-top:60px;padding-bottom:80px;position:relative;z-index:1;">
    <div style="display:grid;grid-template-columns:55fr 45fr;gap:80px;align-items:center;">

      <!-- LEFT COPY -->
      <div>
        <div class="afu" style="display:inline-flex;align-items:center;gap:10px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:100px;padding:7px 16px 7px 9px;margin-bottom:32px;">
          <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--g-deep);">Ghana's #1 Beauty Platform</span>
        </div>

        <h1 class="display-hero afu-1" style="margin-bottom:26px;">
          Where Beauty<br/>
          Meets <em class="gold-gradient" style="font-style:italic;">Luxury.</em>
        </h1>

        <p class="afu-2" style="font-size:17px;line-height:1.9;color:var(--t-secondary);max-width:460px;margin-bottom:48px;font-weight:300;">
          Discover and instantly book Ghana's most exceptional beauty professionals.
          Verified identities, seamless payments, and unforgettable experiences.
        </p>

        <div class="afu-3" style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:64px;">
          <a href="/discover" class="btn-primary" style="padding:17px 40px;font-size:13px;">
            <i class="fas fa-search" style="font-size:12px;"></i>
            Discover Now
          </a>
          <a href="/register?role=provider" class="btn-outline" style="padding:16px 36px;font-size:13px;">
            Join as Provider
            <i class="fas fa-arrow-right" style="font-size:11px;"></i>
          </a>
        </div>

        <!-- Stats row -->
        <div class="afu-4" style="display:flex;gap:0;align-items:stretch;">
          ${[
            {num:'2,400+',label:'Verified Providers',icon:'fas fa-check-circle'},
            {num:'50K+',  label:'Happy Clients',    icon:'fas fa-heart'},
            {num:'4.9★',  label:'Average Rating',   icon:'fas fa-star'},
          ].map((s,i) => `
            <div style="flex:1;padding:0 ${i>0?'28px':'0 28px 0 0'};${i>0?'border-left:1px solid var(--i-faint);':''}">
              <div class="number-counter gold-gradient">${s.num}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:7px;">
                <i class="${s.icon}" style="color:var(--g-main);font-size:10px;"></i>
                <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);">${s.label}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RIGHT: Beautiful hero image + floating cards -->
      <div class="hide-mob" style="position:relative;height:580px;">

        <!-- Main hero image -->
        <div class="hero-img-main float" style="position:absolute;top:0;left:0;width:310px;">
          <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=620&q=80" alt="Beauty Professional" loading="lazy"/>
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,9,0.2),transparent);border-radius:28px;"></div>
        </div>

        <!-- Second image -->
        <div style="position:absolute;top:50px;right:-20px;width:200px;height:220px;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(160,120,48,0.18);animation:fadeUp 0.7s 0.3s both;">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" alt="Hair Styling" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
        </div>

        <!-- Booking confirmed badge -->
        <div style="position:absolute;top:8px;right:30px;background:#FFFFFF;border:1px solid rgba(46,158,94,0.3);border-radius:16px;padding:14px 18px;animation:fadeUp 0.6s 0.5s both;box-shadow:0 10px 30px rgba(46,158,94,0.15);">
          <div style="display:flex;align-items:center;gap:11px;">
            <div style="width:32px;height:32px;border-radius:50%;background:rgba(46,158,94,0.12);display:flex;align-items:center;justify-content:center;color:#1E8050;">
              <i class="fas fa-check" style="font-size:13px;"></i>
            </div>
            <div>
              <div style="font-size:12px;font-weight:700;color:#1E8050;">Booking Confirmed</div>
              <div style="font-size:11px;color:var(--t-muted);margin-top:1px;">Friday · 2:30 PM</div>
            </div>
          </div>
        </div>

        <!-- Payment card -->
        <div style="position:absolute;bottom:170px;right:-10px;width:230px;background:#FFFFFF;border:1px solid var(--g-border);border-radius:16px;padding:16px;animation:fadeUp 0.6s 0.8s both;box-shadow:0 16px 40px rgba(160,120,48,0.14);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <div style="width:32px;height:32px;border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-mobile-alt" style="color:var(--g-deep);font-size:13px;"></i>
            </div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--t-primary);">MTN MoMo Payment</div>
              <div style="font-size:10px;color:var(--t-muted);">Secure · Instant</div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:var(--t-muted);">Total paid</span>
            <span class="font-display gold-gradient" style="font-size:18px;font-weight:600;">GHS 120</span>
          </div>
        </div>

        <!-- Style history mini card -->
        <div style="position:absolute;bottom:40px;left:20px;width:250px;background:#FFFFFF;border:1px solid var(--i-faint);border-radius:18px;padding:18px;animation:fadeUp 0.6s 1.0s both;box-shadow:0 10px 30px rgba(58,47,30,0.08);">
          <div class="eyebrow" style="margin-bottom:12px;"><i class="fas fa-history" style="margin-right:6px;"></i>Style History</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
            ${[
              'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=120&q=70',
              'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=120&q=70',
              'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=120&q=70',
              'https://images.unsplash.com/photo-1583241475880-083f84372725?w=120&q=70',
            ].map((url,i)=>`
              <div style="aspect-ratio:1;border-radius:10px;overflow:hidden;border:1px solid var(--i-faint);${i===0?'border-color:var(--g-border);box-shadow:0 0 0 2px rgba(201,168,76,0.2);':''}">
                <img src="${url}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--t-muted);">4 appointments · Last: 2 weeks ago</div>
        </div>

        <!-- Provider badge -->
        <div style="position:absolute;top:310px;left:-20px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:14px;padding:12px 16px;animation:fadeUp 0.6s 1.2s both;">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:34px;height:34px;border-radius:50%;overflow:hidden;border:2px solid var(--g-border);">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=68&q=80" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
            </div>
            <div>
              <div style="font-size:12px;font-weight:700;color:var(--t-primary);">Glam Studio GH</div>
              <div style="display:flex;gap:2px;margin-top:2px;">
                ${'<i class="fas fa-star" style="color:var(--g-main);font-size:9px;"></i>'.repeat(5)}
                <span style="font-size:10px;color:var(--t-muted);margin-left:4px;">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;animation:float 3s ease-in-out infinite;opacity:0.6;">
    <span style="font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:var(--t-muted);">Scroll</span>
    <div style="width:1px;height:32px;background:linear-gradient(180deg,var(--g-border),transparent);"></div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     MARQUEE STRIP
══════════════════════════════════════════════ -->
<div style="border-top:1px solid var(--i-faint);border-bottom:1px solid var(--i-faint);background:var(--g-dim);padding:17px 0;overflow:hidden;">
  <div class="marquee-track">
    ${['Braiding & Locs','Barber & Fades','Nail Artistry','Massage Therapy','Bridal Makeup','Lash Extensions','Skin Facials','Natural Hair','Body Waxing','Brow Shaping'].map(s=>`
      <span style="display:inline-flex;align-items:center;gap:14px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--t-muted);">
        <i class="fas fa-star" style="color:var(--g-main);font-size:8px;"></i>
        ${s}
      </span>
    `).join('')}
    ${['Braiding & Locs','Barber & Fades','Nail Artistry','Massage Therapy','Bridal Makeup','Lash Extensions'].map(s=>`
      <span style="display:inline-flex;align-items:center;gap:14px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:var(--t-muted);">
        <i class="fas fa-star" style="color:var(--g-main);font-size:8px;"></i>
        ${s}
      </span>
    `).join('')}
  </div>
</div>

<!-- ══════════════════════════════════════════════
     SERVICES — EDITORIAL GRID
══════════════════════════════════════════════ -->
<section class="section-light" style="padding:120px 0;">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:72px;" class="reveal">
      <div>
        <div class="eyebrow" style="margin-bottom:16px;">What We Offer</div>
        <h2 class="display-xl">Browse by<br/><em class="gold-gradient">Service</em></h2>
      </div>
      <a href="/discover" class="btn-outline">View All <i class="fas fa-arrow-right" style="font-size:10px;"></i></a>
    </div>

    <div class="grid-4 hide-mob">
      ${[
        {icon:'fas fa-cut',   title:'Hair Styling',    desc:'Natural, braided & relaxed',count:'680+ providers',href:'Hair Styling',   color:'#FFF8EC'},
        {icon:'fas fa-male',  title:'Barbing',         desc:'Fades, lineups & grooming', count:'240+ providers',href:'Barbing',        color:'#EEF8FF'},
        {icon:'fas fa-paint-brush',title:'Nail Art',   desc:'Gel, acrylics & nail art',  count:'190+ providers',href:'Nail Care',      color:'#FFF0F5'},
        {icon:'fas fa-spa',   title:'Massage',         desc:'Swedish & deep tissue',     count:'120+ providers',href:'Massage',        color:'#F0FFF6'},
        {icon:'fas fa-leaf',  title:'Facials & Spa',   desc:'HydraFacials & skin care',  count:'95+ providers', href:'Facials',        color:'#F5FFF8'},
        {icon:'fas fa-eye',   title:'Lash Extensions', desc:'Classic, volume & hybrid',  count:'140+ providers',href:'Lashes',         color:'#FFF0FF'},
        {icon:'fas fa-magic', title:'Makeup',          desc:'Bridal, editorial & glam',  count:'210+ providers',href:'Makeup',         color:'#FFF5F0'},
        {icon:'fas fa-shower',title:'Shaving',         desc:'Hot towel & straight razor',count:'80+ providers', href:'Shaving',        color:'#F8F5FF'},
      ].map((s,i) => `
        <a href="/discover?service=${encodeURIComponent(s.href)}" class="card reveal" style="padding:28px;text-decoration:none;display:block;background:${s.color};">
          <div style="width:50px;height:50px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin-bottom:18px;">
            <i class="${s.icon}" style="color:var(--g-deep);font-size:18px;"></i>
          </div>
          <div style="font-size:15px;font-weight:600;color:var(--t-primary);margin-bottom:5px;">${s.title}</div>
          <div style="font-size:12px;color:var(--t-secondary);line-height:1.6;margin-bottom:16px;font-weight:300;">${s.desc}</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <i class="fas fa-users" style="color:var(--g-main);font-size:10px;"></i>
            <span style="font-size:11px;letter-spacing:0.06em;color:var(--g-deep);font-weight:600;">${s.count}</span>
          </div>
        </a>
      `).join('')}
    </div>

    <!-- Mobile horizontal scroll -->
    <div class="show-mob no-scrollbar" style="display:flex;gap:14px;overflow-x:auto;padding-bottom:12px;">
      ${[
        {icon:'fas fa-cut',       title:'Hair'},
        {icon:'fas fa-male',      title:'Barbing'},
        {icon:'fas fa-paint-brush',title:'Nails'},
        {icon:'fas fa-spa',       title:'Massage'},
        {icon:'fas fa-magic',     title:'Makeup'},
        {icon:'fas fa-eye',       title:'Lashes'},
      ].map(s=>`
        <a href="/discover?service=${s.title}" style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 16px;background:#FFFFFF;border:1px solid var(--i-faint);border-radius:20px;min-width:86px;text-decoration:none;transition:border-color 0.3s,box-shadow 0.3s;" onmouseover="this.style.borderColor='var(--g-border)';this.style.boxShadow='0 8px 20px rgba(160,120,48,0.12)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.boxShadow='none'">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
            <i class="${s.icon}" style="color:var(--g-deep);font-size:16px;"></i>
          </div>
          <span style="font-size:11px;color:var(--t-secondary);font-weight:600;">${s.title}</span>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FEATURED PROVIDERS
══════════════════════════════════════════════ -->
<section class="section-cream" style="padding:120px 0;">
  <div class="container">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:72px;" class="reveal">
      <div>
        <div class="eyebrow" style="margin-bottom:16px;">Hand-Picked Excellence</div>
        <h2 class="display-xl">Featured<br/><em class="gold-gradient">Providers</em></h2>
      </div>
      <a href="/discover" class="btn-ghost">View All <i class="fas fa-arrow-right" style="font-size:11px;"></i></a>
    </div>
    <div class="grid-3">
      ${featuredProviders()}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     HOW IT WORKS
══════════════════════════════════════════════ -->
<section class="section-warm" style="padding:140px 0;position:relative;overflow:hidden;">
  <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(201,168,76,0.06),transparent);top:50%;left:50%;transform:translate(-50%,-50%);"></div>
  <div class="container" style="position:relative;z-index:1;">
    <div style="text-align:center;margin-bottom:90px;" class="reveal">
      <div class="eyebrow" style="margin-bottom:16px;">Simple. Elegant. Fast.</div>
      <h2 class="display-xl">Perfection in<br/><em class="gold-gradient">Three Steps</em></h2>
    </div>

    <div style="position:relative;">
      <div style="position:absolute;top:32px;left:calc(16.66% + 19px);right:calc(16.66% + 19px);height:1px;background:linear-gradient(90deg,transparent,var(--g-border),transparent);" class="hide-mob"></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;" class="hide-mob">
        ${[
          {n:'01',title:'Discover',  icon:'fas fa-search',        desc:'Browse Ghana\'s most exceptional beauty professionals. Filter by service, price, distance, and verified status.'},
          {n:'02',title:'Book',      icon:'far fa-calendar-check', desc:'Choose your service, pick a date, and confirm your slot in under 60 seconds. Zero double-booking, guaranteed.'},
          {n:'03',title:'Experience',icon:'fas fa-star',           desc:'Arrive and receive world-class treatment. Pay via mobile money or card. Your style history is saved for next time.'},
        ].map((s,i) => `
          <div class="reveal" style="padding:52px 44px;text-align:center;">
            <div style="position:relative;display:inline-flex;margin-bottom:28px;">
              <div style="width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,var(--g-dim),rgba(201,168,76,0.15));border:1.5px solid var(--g-border);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;box-shadow:0 8px 24px rgba(160,120,48,0.15);">
                <i class="${s.icon}" style="color:var(--g-deep);font-size:22px;"></i>
              </div>
              <div class="font-display" style="position:absolute;top:-16px;right:-16px;font-size:44px;font-weight:400;color:rgba(201,168,76,0.12);line-height:1;pointer-events:none;">${s.n}</div>
            </div>
            <h3 class="display-sm font-display" style="margin-bottom:14px;">${s.title}</h3>
            <p style="font-size:14px;color:var(--t-secondary);line-height:1.9;font-weight:300;">${s.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- Mobile stacked -->
      <div class="show-mob" style="display:flex;flex-direction:column;gap:20px;">
        ${[
          {n:'01',title:'Discover',icon:'fas fa-search',       desc:'Browse verified beauty professionals near you.'},
          {n:'02',title:'Book',    icon:'far fa-calendar-check',desc:'Pick a time slot. Confirm in under 60 seconds.'},
          {n:'03',title:'Experience',icon:'fas fa-star',       desc:'Get treated. Pay flexibly. Style history saved.'},
        ].map(s=>`
          <div style="display:flex;gap:20px;align-items:flex-start;padding:26px;background:#FFFFFF;border:1px solid var(--i-faint);border-radius:var(--r-lg);box-shadow:0 4px 16px rgba(58,47,30,0.06);">
            <div style="width:44px;height:44px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="${s.icon}" style="color:var(--g-deep);font-size:16px;"></i>
            </div>
            <div>
              <div style="font-size:18px;font-family:'Playfair Display',serif;margin-bottom:6px;">${s.title}</div>
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
<section class="section-light" style="padding:140px 0;">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;">

      <!-- Dashboard preview card -->
      <div class="reveal">
        <div style="background:#FFFFFF;border:1px solid var(--g-border);border-radius:var(--r-xl);overflow:hidden;box-shadow:0 32px 80px rgba(160,120,48,0.16);">
          <!-- Window chrome -->
          <div style="padding:14px 20px;background:var(--c-dark);border-bottom:1px solid var(--i-faint);display:flex;align-items:center;gap:8px;">
            ${['#C04848','#C9A84C','#2E9E5E'].map(c=>`<div style="width:10px;height:10px;border-radius:50%;background:${c};"></div>`).join('')}
            <span style="font-size:11px;color:var(--t-muted);margin-left:8px;letter-spacing:0.06em;">Provider Dashboard · Glam Studio GH</span>
          </div>
          <div style="padding:26px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;">
              ${[
                {label:"Today's Appts", val:'6',         icon:'far fa-calendar',  color:'#FFF8EC'},
                {label:'Revenue',       val:'GHS 2,480', icon:'fas fa-coins',     color:'#FFFDF5'},
                {label:'Total Clients', val:'248',       icon:'fas fa-users',     color:'#F0FFF6'},
                {label:'Rating',        val:'4.9 ★',     icon:'fas fa-star',      color:'#FFF5EC'},
              ].map(s=>`
                <div style="background:${s.color};border:1px solid var(--i-faint);border-radius:14px;padding:16px;">
                  <div style="width:30px;height:30px;border-radius:8px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                    <i class="${s.icon}" style="color:var(--g-deep);font-size:12px;"></i>
                  </div>
                  <div class="font-display gold-gradient" style="font-size:20px;margin-bottom:3px;">${s.val}</div>
                  <div style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--t-muted);">${s.label}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:12px;">Today's Schedule</div>
            ${[
              {time:'9:00 AM', name:'Akosua Mensah', service:'Natural Twist', status:'confirmed'},
              {time:'11:30 AM',name:'Efua Tetteh',   service:'Box Braids',    status:'confirmed'},
              {time:'2:00 PM', name:'Ama Darko',     service:'Silk Press',    status:'pending'},
            ].map(a=>`
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--i-faint);">
                <span style="font-size:11px;color:var(--g-deep);font-weight:700;min-width:64px;">${a.time}</span>
                <span style="font-size:13px;font-weight:500;flex:1;color:var(--t-primary);">${a.name}</span>
                <span style="font-size:11px;color:var(--t-muted);">${a.service}</span>
                <span class="badge ${a.status==='confirmed'?'badge-verified':'badge-pending'}" style="font-size:9px;">${a.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Copy -->
      <div class="reveal">
        <div class="eyebrow" style="margin-bottom:22px;">For Beauty Professionals</div>
        <h2 class="display-xl" style="margin-bottom:22px;">
          Grow Your Business.<br/>
          <em class="gold-gradient">Completely Free.</em>
        </h2>
        <p style="font-size:16px;color:var(--t-secondary);line-height:1.9;margin-bottom:44px;font-weight:300;">
          Join thousands of beauty professionals thriving on SalonLink. Get discovered,
          manage bookings effortlessly, and build a loyal clientele — all from one elegant platform.
        </p>
        <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:48px;">
          ${[
            {icon:'fas fa-id-card',    title:'Free KYC Verification',   desc:'Build instant trust with Ghana Card identity + facial verification.'},
            {icon:'far fa-calendar-alt',title:'Smart Booking Calendar', desc:'Intelligent scheduling that eliminates double-bookings automatically.'},
            {icon:'fas fa-images',     title:'Hairstyle Portfolio',      desc:'Store client style history and showcase your best transformations.'},
            {icon:'fas fa-chart-line', title:'Growth Analytics',         desc:'Track revenue, booking trends, and client retention in real-time.'},
          ].map(f=>`
            <div style="display:flex;align-items:flex-start;gap:16px;">
              <div style="width:44px;height:44px;border-radius:13px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="${f.icon}" style="color:var(--g-deep);font-size:17px;"></i>
              </div>
              <div>
                <div style="font-size:15px;font-weight:600;margin-bottom:4px;color:var(--t-primary);">${f.title}</div>
                <div style="font-size:13px;color:var(--t-secondary);font-weight:300;line-height:1.7;">${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="/register?role=provider" class="btn-primary" style="font-size:13px;padding:17px 40px;">
          Start for Free <i class="fas fa-arrow-right" style="font-size:11px;"></i>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     BEAUTY GALLERY ROW
══════════════════════════════════════════════ -->
<section class="section-cream" style="padding:80px 0;overflow:hidden;">
  <div class="container">
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;border-radius:var(--r-xl);overflow:hidden;" class="hide-mob">
      ${[
        'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=75',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=75',
        'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=75',
        'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&q=75',
        'https://images.unsplash.com/photo-1583241475880-083f84372725?w=400&q=75',
      ].map((url,i)=>`
        <div style="height:260px;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(58,47,30,0.08);transition:transform 0.4s var(--ease-luxury);" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
          <img src="${url}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="Beauty style ${i+1}"/>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════ -->
<section class="section-light" style="padding:120px 0;">
  <div class="container">
    <div style="text-align:center;margin-bottom:72px;" class="reveal">
      <div class="eyebrow" style="margin-bottom:16px;">Client Love</div>
      <h2 class="display-xl">What They <em class="gold-gradient">Say</em></h2>
    </div>
    <div class="grid-3">
      ${[
        {name:'Akosua Mensah', loc:'Customer · Accra',         img:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=88&q=80', q:'"SalonLink completely transformed how I find hair appointments. A verified stylist in minutes — truly exceptional."'},
        {name:'Efua Tetteh',   loc:'Customer · East Legon',    img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=88&q=80', q:'"The experience is so refined — from booking to the chair. My stylist had my full style history ready on arrival."'},
        {name:'Kofi Asante',   loc:'Barbershop Owner · Osu',   img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&q=80', q:'"Since joining SalonLink my bookings tripled. The KYC verification makes clients trust us immediately."'},
      ].map(t=>`
        <div class="testimonial-card reveal">
          <div class="stars" style="font-size:16px;margin-bottom:22px;">★★★★★</div>
          <p class="font-serif" style="font-size:18px;line-height:1.85;color:var(--t-primary);font-weight:300;margin-bottom:28px;font-style:italic;">${t.q}</p>
          <div style="display:flex;align-items:center;gap:13px;">
            <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid var(--g-border);flex-shrink:0;">
              <img src="${t.img}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="${t.name}"/>
            </div>
            <div>
              <div style="font-size:14px;font-weight:600;color:var(--t-primary);">${t.name}</div>
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
<section style="padding:160px 0;background:linear-gradient(160deg,var(--g-pale) 0%,#FDF0CC 50%,var(--g-pale) 100%);text-align:center;position:relative;overflow:hidden;">
  <div class="orb" style="width:800px;height:800px;background:radial-gradient(circle,rgba(201,168,76,0.1),transparent);top:50%;left:50%;transform:translate(-50%,-50%);animation:orb-pulse 10s ease infinite;"></div>
  <div class="container" style="position:relative;z-index:1;">
    <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:40px;" class="reveal">
      <div style="height:1px;width:40px;background:linear-gradient(90deg,transparent,var(--g-border));"></div>
      <i class="fas fa-star" style="color:var(--g-main);font-size:14px;"></i>
      <div style="height:1px;width:40px;background:linear-gradient(90deg,var(--g-border),transparent);"></div>
    </div>
    <h2 class="display-hero reveal" style="margin-bottom:24px;">
      Your Next Look<br/><em class="gold-gradient">Awaits.</em>
    </h2>
    <p style="font-size:18px;color:var(--t-secondary);margin-bottom:52px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.8;font-weight:300;" class="reveal">
      Join 50,000+ Ghanaians who book their beauty experiences through SalonLink.
    </p>
    <div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap;" class="reveal">
      <a href="/discover" class="btn-primary" style="font-size:14px;padding:18px 48px;">
        <i class="fas fa-search" style="font-size:12px;"></i>
        Discover Providers
      </a>
      <a href="/register" class="btn-outline" style="font-size:14px;padding:17px 44px;">Create Free Account</a>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════ -->
<footer style="background:var(--t-primary);padding:90px 0 44px;">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:56px;margin-bottom:70px;">
      <div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <span style="font-family:'Playfair Display',serif;font-size:19px;letter-spacing:0.1em;color:#FFFFFF;">SALONLINK</span>
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,0.55);line-height:1.9;max-width:250px;font-weight:300;">
          Ghana's most exclusive beauty booking platform. Connecting clients with verified professionals since 2025.
        </p>
        <div style="display:flex;gap:9px;margin-top:24px;">
          ${[['fab fa-instagram','#E4405F'],['fab fa-twitter','#1DA1F2'],['fab fa-tiktok','#FFFFFF']].map(([ic,color])=>`
            <a href="#" class="btn-icon" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);transition:all 0.3s;" onmouseover="this.style.background='rgba(201,168,76,0.15)';this.style.borderColor='var(--g-border)';this.style.color='var(--g-light)'" onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.color='rgba(255,255,255,0.6)'">
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
          <div class="eyebrow" style="margin-bottom:20px;color:var(--g-main);">${col.title}</div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${col.links.map(l=>`
              <a href="#" style="font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s;font-weight:300;" onmouseover="this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">${l}</a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:28px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.35);">© 2025 SalonLink Ltd. All rights reserved. Made with love in Accra, Ghana 🇬🇭</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.35);">GHS · English · Privacy Policy</p>
    </div>
  </div>
</footer>

${mobileNav('home')}
${globalScripts()}
</body></html>`

function featuredProviders() {
  const providers = [
    {id:1, name:'Glam Studio GH',  type:'Hair Salon',      rating:'4.9', reviews:128, price:'80',  loc:'East Legon',   img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=80',  tags:['Braiding','Natural Hair','Locs'], open:true,  verified:true},
    {id:2, name:'KutzByKofi',      type:'Barbershop',      rating:'4.8', reviews:96,  price:'40',  loc:'Osu, Accra',   img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=80',  tags:['Fade','Dreads','Beard'],          open:true,  verified:true},
    {id:3, name:'Nails by Abena',  type:'Nail Technician', rating:'5.0', reviews:64,  price:'60',  loc:'Airport Area',  img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=80',  tags:['Gel','Acrylics','Nail Art'],      open:false, verified:true},
  ]
  return providers.map(p => `
    <div class="provider-feature-card reveal" onclick="window.location.href='/provider/${p.id}'">
      <!-- Image area -->
      <div class="card-img-wrap" style="height:200px;position:relative;">
        <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
        <!-- Overlay gradient -->
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,9,0.3),transparent);"></div>
        <!-- Badges -->
        <div style="position:absolute;top:14px;left:14px;">
          ${p.verified ? `<span class="badge badge-verified" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);"><i class="fas fa-shield-alt" style="font-size:8px;"></i> Verified</span>` : ''}
        </div>
        <div style="position:absolute;top:14px;right:14px;">
          <span class="badge ${p.open?'badge-live':'badge-closed'}" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);">
            ${p.open ? `<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#1E8050;margin-right:3px;"></span> Open` : '<i class="fas fa-clock" style="font-size:8px;margin-right:3px;"></i>Closed'}
          </span>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div class="font-display" style="font-size:18px;font-weight:600;margin-bottom:3px;color:var(--t-primary);">${p.name}</div>
            <div style="font-size:12px;color:var(--t-muted);display:flex;align-items:center;gap:5px;">
              <i class="fas fa-map-marker-alt" style="font-size:10px;color:var(--g-main);"></i>
              ${p.type} · ${p.loc}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:2px;">from</div>
            <div class="font-display gold-gradient" style="font-size:19px;font-weight:600;">GHS ${p.price}</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:7px;margin-bottom:14px;">
          <span class="stars">★★★★★</span>
          <span style="font-size:13px;font-weight:700;color:var(--g-deep);">${p.rating}</span>
          <span style="font-size:12px;color:var(--t-muted);">(${p.reviews} reviews)</span>
        </div>

        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:18px;">
          ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>

        <div style="display:flex;gap:9px;">
          <a href="/book/${p.id}" onclick="event.stopPropagation()" class="btn-primary" style="flex:1;justify-content:center;padding:11px 14px;font-size:11px;">
            <i class="far fa-calendar-check" style="font-size:11px;"></i>
            Book Now
          </a>
          <button onclick="event.stopPropagation();showToast('Saved to favourites ★','success')" class="btn-icon" title="Save" style="border-radius:12px;">
            <i class="far fa-heart" style="font-size:14px;"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}
