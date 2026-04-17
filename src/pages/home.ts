import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Ghana\'s Top Beauty Booking App', `
<style>
  /* ── Global B&W ── */
  body { background:#FFFFFF; }

  /* ── Hero ── */
  .hero-wrap { position:relative; background:#FFFFFF; overflow:hidden; }

  /* ── Airbnb-style search bar ── */
  .hero-search-bar {
    display:flex; align-items:stretch; gap:0;
    background:#FFFFFF; border-radius:100px; padding:0;
    width:100%; max-width:680px; cursor:pointer;
    box-shadow: 0 4px 28px rgba(0,0,0,0.13);
    border: 1px solid #E0E0E0;
    overflow: hidden;
  }
  .hero-search-bar:hover { box-shadow: 0 6px 36px rgba(0,0,0,0.18); }
  .search-field {
    flex:1; display:flex; align-items:center; gap:10px;
    padding:14px 22px; border-right:1px solid #E0E0E0;
    text-decoration:none; transition: background 0.2s;
  }
  .search-field:hover { background:#F7F7F7; }
  .search-field:last-of-type { border-right: none; }
  .search-btn {
    background:#111111; color:#FFFFFF; border:none; border-radius:0 100px 100px 0;
    padding:14px 28px; font-size:14px; font-weight:700; cursor:pointer;
    white-space:nowrap; transition:background 0.2s;
    display:flex; align-items:center; gap:8px;
    flex-shrink:0;
  }
  .search-btn:hover { background:#333333; }

  /* ── Section titles ── */
  .section-title { font-size:22px; font-weight:800; color:#111111; }
  .see-all { font-size:13px; font-weight:600; color:#111111; text-decoration:none; border-bottom:1.5px solid #111111; padding-bottom:1px; }
  .see-all:hover { opacity:0.6; }

  /* ── Top category circles ── */
  .top-cats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
  }
  @media(min-width:640px){ .top-cats-grid { grid-template-columns: repeat(7, 1fr); gap: 20px; } }
  @media(min-width:1024px){ .top-cats-grid { grid-template-columns: repeat(9, 1fr); } }

  .cat-circle { display:flex; flex-direction:column; align-items:center; gap:8px; text-decoration:none; }
  .cat-circle-img {
    width:72px; height:72px; border-radius:50%; overflow:hidden;
    border: 2px solid #E8E8E8;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  @media(min-width:640px){ .cat-circle-img { width:88px; height:88px; } }
  .cat-circle:hover .cat-circle-img { border-color:#111111; transform:scale(1.06); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
  .cat-circle-img img { width:100%; height:100%; object-fit:cover; display:block; }
  .cat-circle-label { font-size:11px; font-weight:700; color:#111111; text-align:center; line-height:1.2; }
  @media(min-width:640px){ .cat-circle-label { font-size:12px; } }

  /* ── Category tiles ── */
  .cat-tiles-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media(min-width:640px){ .cat-tiles-grid { grid-template-columns: repeat(3,1fr); gap:12px; } }
  @media(min-width:1024px){ .cat-tiles-grid { grid-template-columns: repeat(3,1fr); gap:14px; } }

  .cat-tile {
    position:relative; border-radius:16px; overflow:hidden; display:block;
    text-decoration:none; aspect-ratio:4/3;
    cursor:pointer; transition:transform 0.3s;
  }
  .cat-tile:hover { transform:scale(1.02); }
  .cat-tile img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s; }
  .cat-tile:hover img { transform:scale(1.06); }
  .cat-tile-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(0,0,0,0.68) 0%,rgba(0,0,0,0.10) 55%,transparent 100%);
  }
  .cat-tile-label {
    position:absolute; bottom:14px; left:16px;
    font-size:16px; font-weight:800; color:#FFFFFF;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  /* ── Provider cards ── */
  .prov-card-fresh {
    background: #FFFFFF; border-radius:16px; overflow:hidden;
    cursor:pointer; border:1px solid #EBEBEB;
    transition:transform 0.3s, box-shadow 0.3s;
    flex-shrink: 0;
  }
  .prov-card-fresh:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(0,0,0,0.11); }
  .prov-card-fresh:hover .pcard-img { transform:scale(1.04); }
  .pcard-img { width:100%; height:150px; object-fit:cover; transition:transform 0.5s; display:block; }

  /* ── Horizontal scroll ── */
  .h-scroll { display:flex; gap:14px; overflow-x:auto; padding-bottom:8px; }
  .h-scroll::-webkit-scrollbar { display:none; }

  /* ── Stats strip ── */
  .stats-strip {
    background:#111111; border-radius:20px;
    padding:28px 40px; display:flex; align-items:center;
    justify-content:space-around; flex-wrap:wrap; gap:20px;
  }
  .stat-item { text-align:center; }
  .stat-num { font-size:28px; font-weight:800; color:#FFFFFF; }
  .stat-lbl { font-size:11px; color:rgba(255,255,255,0.55); font-weight:500; margin-top:3px; }

  /* ── How it works ── */
  .hiw-step {
    display:flex; align-items:flex-start; gap:16px;
    padding:24px; background:#FFFFFF; border-radius:16px;
    border:1px solid #EBEBEB; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .hiw-num {
    width:40px; height:40px; border-radius:50%; background:#111111;
    color:#FFFFFF; display:flex; align-items:center;
    justify-content:center; font-weight:800; font-size:15px; flex-shrink:0;
  }

  /* ── Testimonials ── */
  .testi-card {
    background:#FFFFFF; border-radius:18px; padding:28px;
    border:1px solid #EBEBEB; box-shadow:0 2px 10px rgba(0,0,0,0.05);
    min-width:280px;
  }
</style>
`)}
</head>
<body>
${navbar('home')}

<!-- ══════════════════════════════════════════════
     HERO — Clean Airbnb/Fresha style, B&W
══════════════════════════════════════════════ -->
<section class="hero-wrap" style="padding:48px 0 0;">
  <div class="container" style="padding-bottom:0;">

    <!-- Headline + search -->
    <div style="max-width:740px;margin:0 auto;text-align:center;padding:0 0 52px;">
      <div class="afu" style="display:inline-flex;align-items:center;gap:8px;background:#F5F5F5;border:1px solid #E0E0E0;border-radius:100px;padding:6px 16px;margin-bottom:24px;">
        <span style="font-size:13px;">✂️</span>
        <span style="font-size:12px;font-weight:700;color:#111111;letter-spacing:0.06em;text-transform:uppercase;">Ghana's #1 Beauty Platform</span>
      </div>

      <h1 class="afu-1" style="font-size:clamp(34px,6vw,58px);font-weight:800;line-height:1.1;letter-spacing:-0.03em;margin-bottom:16px;color:#111111;">
        Find &amp; book<br/>beauty services
      </h1>

      <p class="afu-2" style="font-size:16px;color:#666666;line-height:1.7;margin-bottom:40px;max-width:500px;margin-left:auto;margin-right:auto;">
        Discover verified beauty professionals near you. Book instantly, pay securely.
      </p>

      <!-- Airbnb-style pill search bar -->
      <div class="afu-3 hero-search-bar" style="margin:0 auto 36px;">
        <a href="/discover" class="search-field" style="flex:1.6;">
          <i class="fas fa-search" style="color:#111111;font-size:14px;flex-shrink:0;"></i>
          <div style="text-align:left;">
            <div style="font-size:10px;font-weight:700;color:#111111;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:1px;">Service</div>
            <div style="font-size:13px;color:#888888;">Hair, nails, barber…</div>
          </div>
        </a>
        <a href="/discover" class="search-field" style="flex:1;">
          <i class="fas fa-map-marker-alt" style="color:#111111;font-size:14px;flex-shrink:0;"></i>
          <div style="text-align:left;">
            <div style="font-size:10px;font-weight:700;color:#111111;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:1px;">Location</div>
            <div style="font-size:13px;color:#888888;">Accra, Ghana</div>
          </div>
        </a>
        <a href="/discover" class="search-btn">
          <i class="fas fa-search" style="font-size:13px;"></i>
          Search
        </a>
      </div>

      <!-- Popular tags -->
      <div class="afu-4" style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
        <span style="font-size:12px;color:#999999;">Popular:</span>
        ${['Hair Braiding','Nail Art','Fade Haircut','Facial','Makeup'].map(s=>`
          <a href="/discover?service=${encodeURIComponent(s)}" style="font-size:12px;font-weight:600;color:#111111;background:#F5F5F5;border:1px solid #E0E0E0;border-radius:100px;padding:5px 14px;text-decoration:none;">${s}</a>
        `).join('')}
      </div>
    </div>

    <!-- Hero image strip (desktop) -->
    <div class="hide-mob" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;overflow:hidden;margin:0 -40px;">
      ${[
        {url:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80',h:'300px'},
        {url:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',h:'300px'},
        {url:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',h:'300px'},
        {url:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',h:'300px'},
        {url:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',h:'300px'},
      ].map((img,i)=>`
        <div style="height:${img.h};overflow:hidden;${i===0?'border-radius:20px 0 0 0':i===4?'border-radius:0 20px 0 0':''}">
          <img src="${img.url}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt=""/>
        </div>
      `).join('')}
    </div>

  </div>
</section>

<!-- ══════════════════════════════════════════════
     TOP CATEGORIES — Circular images (Fresha style)
══════════════════════════════════════════════ -->
<section style="padding:56px 0 48px;background:#FFFFFF;">
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h2 class="section-title">Top categories</h2>
      <a href="/discover" class="see-all">See all <i class="fas fa-arrow-right" style="font-size:11px;"></i></a>
    </div>

    <div class="top-cats-grid">
      ${[
        {label:'Hair &amp; Styling', img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80', cat:'Hair Styling'},
        {label:'Nails',             img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&q=80', cat:'Nail Care'},
        {label:'Brows &amp; Lashes',img:'https://images.unsplash.com/photo-1583241475880-083f84372725?w=200&q=80', cat:'Lashes'},
        {label:'Barbering',         img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&q=80', cat:'Barbing'},
        {label:'Massage',           img:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&q=80', cat:'Massage'},
        {label:'Facials',           img:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&q=80', cat:'Facials'},
        {label:'Makeup',            img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&q=80', cat:'Makeup'},
        {label:'Spa &amp; Sauna',   img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&q=80', cat:'Facials'},
        {label:'Bridal',            img:'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=200&q=80', cat:'Bridal'},
      ].map(c=>`
        <a href="/discover?service=${encodeURIComponent(c.cat)}" class="cat-circle">
          <div class="cat-circle-img">
            <img src="${c.img}" alt="${c.label}" loading="lazy"/>
          </div>
          <span class="cat-circle-label">${c.label}</span>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     BROWSE BY CATEGORY — Large tiles
══════════════════════════════════════════════ -->
<section style="padding:0 0 56px;background:#FFFFFF;">
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
      <h2 class="section-title">Browse by category</h2>
      <a href="/discover" class="see-all">See all <i class="fas fa-arrow-right" style="font-size:11px;"></i></a>
    </div>

    <div class="cat-tiles-grid">
      ${[
        {label:'Hair Salons', img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', cat:'Hair Styling'},
        {label:'Barbers',     img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', cat:'Barbing'},
        {label:'Nails',       img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', cat:'Nail Care'},
        {label:'Massage',     img:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', cat:'Massage'},
        {label:'Facials',     img:'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', cat:'Facials'},
        {label:'Makeup',      img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', cat:'Makeup'},
      ].map(c=>`
        <a href="/discover?service=${encodeURIComponent(c.cat)}" class="cat-tile">
          <img src="${c.img}" alt="${c.label}" loading="lazy"/>
          <div class="cat-tile-overlay"></div>
          <div class="cat-tile-label">${c.label}</div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     STATS STRIP
══════════════════════════════════════════════ -->
<section style="padding:0 0 56px;">
  <div class="container">
    <div class="stats-strip reveal">
      ${[
        {num:'2,400+', lbl:'Verified Providers'},
        {num:'50K+',   lbl:'Happy Clients'},
        {num:'4.9★',   lbl:'Average Rating'},
        {num:'98%',    lbl:'Satisfaction Rate'},
      ].map(s=>`
        <div class="stat-item">
          <div class="stat-num">${s.num}</div>
          <div class="stat-lbl">${s.lbl}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     RECOMMENDED — horizontal scroll
══════════════════════════════════════════════ -->
<section style="padding:0 0 56px;background:#FFFFFF;">
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
      <div>
        <h2 class="section-title">Recommended for you</h2>
        <p style="font-size:13px;color:#888888;margin-top:4px;">Top-rated professionals near you</p>
      </div>
      <a href="/discover" class="see-all">View all</a>
    </div>

    <div class="h-scroll">
      ${featuredProviders().map(p=>`
        <div class="prov-card-fresh" style="min-width:210px;max-width:230px;" onclick="window.location.href='/provider/${p.id}'">
          <div style="position:relative;overflow:hidden;">
            <img class="pcard-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
            <div style="position:absolute;top:10px;left:10px;">
              ${p.verified ? `<span style="background:rgba(255,255,255,0.95);border-radius:100px;padding:3px 9px;font-size:10px;font-weight:700;color:#007A3D;display:flex;align-items:center;gap:3px;"><i class="fas fa-shield-alt" style="font-size:8px;"></i> Verified</span>` : ''}
            </div>
            <div style="position:absolute;top:10px;right:10px;">
              <span style="background:rgba(255,255,255,0.95);border-radius:100px;padding:3px 9px;font-size:10px;font-weight:700;display:flex;align-items:center;gap:4px;color:${p.open?'#007A3D':'#888'};">
                ${p.open ? '<span style="width:5px;height:5px;background:#00C853;border-radius:50%;"></span> Open' : '⏰ Closed'}
              </span>
            </div>
          </div>
          <div style="padding:14px;">
            <div style="font-size:14px;font-weight:700;color:#111111;margin-bottom:2px;">${p.name}</div>
            <div style="font-size:11px;color:#999999;margin-bottom:8px;">${p.type} · ${p.loc}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:#FFB800;font-size:13px;">★</span>
                <span style="font-size:13px;font-weight:700;color:#111111;">${p.rating}</span>
                <span style="font-size:11px;color:#999999;">(${p.reviews})</span>
              </div>
              <div style="font-size:13px;font-weight:600;color:#111111;">from GHS ${p.price}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     NEW TO SALONLINK
══════════════════════════════════════════════ -->
<section style="padding:0 0 56px;background:#FAFAFA;">
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-top:40px;">
      <div>
        <h2 class="section-title">New to SalonLink</h2>
        <p style="font-size:13px;color:#888888;margin-top:4px;">Fresh faces, exceptional talent</p>
      </div>
      <a href="/discover" class="see-all">View all</a>
    </div>

    <div class="h-scroll">
      ${newProviders().map(p=>`
        <div class="prov-card-fresh" style="min-width:210px;max-width:230px;" onclick="window.location.href='/provider/${p.id}'">
          <div style="position:relative;overflow:hidden;">
            <img class="pcard-img" src="${p.img}" alt="${p.name}" loading="lazy"/>
            <div style="position:absolute;top:10px;left:10px;">
              <span style="background:#111111;border-radius:100px;padding:3px 9px;font-size:10px;font-weight:700;color:#FFFFFF;">New</span>
            </div>
          </div>
          <div style="padding:14px;">
            <div style="font-size:14px;font-weight:700;color:#111111;margin-bottom:2px;">${p.name}</div>
            <div style="font-size:11px;color:#999999;margin-bottom:8px;">${p.type} · ${p.loc}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="color:#FFB800;font-size:13px;">★</span>
                <span style="font-size:13px;font-weight:700;color:#111111;">${p.rating}</span>
              </div>
              <div style="font-size:13px;font-weight:600;color:#111111;">from GHS ${p.price}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     HOW IT WORKS
══════════════════════════════════════════════ -->
<section style="padding:56px 0;background:#FFFFFF;">
  <div class="container">
    <div style="text-align:center;margin-bottom:40px;" class="reveal">
      <h2 class="section-title" style="font-size:clamp(22px,3vw,32px);margin-bottom:10px;">How SalonLink works</h2>
      <p style="font-size:15px;color:#888888;">Book your beauty service in 3 easy steps</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
      ${[
        {n:'1', icon:'fas fa-search', title:'Discover', desc:'Search verified beauty professionals near you. Filter by service, price, and reviews.'},
        {n:'2', icon:'far fa-calendar-check', title:'Book instantly', desc:'Pick a time slot, confirm your booking in under 60 seconds.'},
        {n:'3', icon:'fas fa-star', title:'Enjoy & Review', desc:'Arrive, get treated, pay via MoMo or card, then leave a review.'},
      ].map(s=>`
        <div class="hiw-step reveal">
          <div class="hiw-num">${s.n}</div>
          <div>
            <div style="font-size:16px;font-weight:700;color:#111111;margin-bottom:6px;">${s.title}</div>
            <div style="font-size:13px;color:#666666;line-height:1.7;">${s.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="text-align:center;margin-top:36px;">
      <a href="/discover" style="display:inline-flex;align-items:center;gap:8px;background:#111111;color:#FFFFFF;border:none;border-radius:100px;padding:14px 36px;font-size:14px;font-weight:700;text-decoration:none;transition:background 0.2s;">
        <i class="fas fa-search" style="font-size:13px;"></i>
        Start Exploring
      </a>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOR PROVIDERS
══════════════════════════════════════════════ -->
<section style="padding:56px 0;background:#FAFAFA;">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;" class="reveal">

      <!-- Copy -->
      <div>
        <div style="display:inline-flex;align-items:center;gap:8px;background:#F0F0F0;border:1px solid #E0E0E0;border-radius:100px;padding:6px 14px;margin-bottom:20px;">
          <i class="fas fa-store" style="color:#111111;font-size:12px;"></i>
          <span style="font-size:12px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.08em;">For Professionals</span>
        </div>
        <h2 style="font-size:clamp(24px,3.5vw,38px);font-weight:800;line-height:1.2;margin-bottom:18px;color:#111111;">
          Grow your salon business.<br/>
          <span style="color:#111111;border-bottom:3px solid #111111;">It's completely free.</span>
        </h2>
        <p style="font-size:15px;color:#666666;line-height:1.8;margin-bottom:32px;">
          Join thousands of beauty professionals on SalonLink. Get discovered, manage bookings effortlessly, and build a loyal clientele.
        </p>
        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:36px;">
          ${[
            {icon:'fas fa-id-card', title:'Free KYC Verification', desc:'Build trust with instant Ghana Card identity verification.'},
            {icon:'far fa-calendar-alt', title:'Smart Booking Calendar', desc:'Zero double-bookings. Duration-aware slot management.'},
            {icon:'fas fa-chart-line', title:'Growth Analytics', desc:'Track revenue and client retention in real-time.'},
          ].map(f=>`
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="width:40px;height:40px;border-radius:12px;background:#F0F0F0;border:1px solid #E0E0E0;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="${f.icon}" style="color:#111111;font-size:16px;"></i>
              </div>
              <div>
                <div style="font-size:14px;font-weight:600;margin-bottom:2px;color:#111111;">${f.title}</div>
                <div style="font-size:13px;color:#888888;">${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <a href="/register?role=provider" style="display:inline-flex;align-items:center;gap:8px;background:#111111;color:#FFFFFF;border:none;border-radius:100px;padding:14px 36px;font-size:14px;font-weight:700;text-decoration:none;transition:background 0.2s;">
          Start for Free <i class="fas fa-arrow-right" style="font-size:12px;"></i>
        </a>
      </div>

      <!-- Dashboard mockup -->
      <div class="hide-mob">
        <div style="background:#FFFFFF;border:1px solid #EBEBEB;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.10);">
          <div style="background:#111111;padding:16px 20px;display:flex;align-items:center;gap:8px;">
            ${['rgba(255,255,255,0.3)','rgba(255,255,255,0.3)','rgba(255,255,255,0.3)'].map(c=>`<div style="width:10px;height:10px;border-radius:50%;background:${c};"></div>`).join('')}
            <span style="font-size:12px;color:rgba(255,255,255,0.7);margin-left:8px;font-weight:500;">Provider Dashboard</span>
          </div>
          <div style="padding:24px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
              ${[
                {lbl:"Today's", val:'8', icon:'📅', bg:'#F5F5F5'},
                {lbl:'Revenue', val:'₵ 2,840', icon:'💰', bg:'#F5F5F5'},
                {lbl:'Clients', val:'248', icon:'👥', bg:'#F5F5F5'},
                {lbl:'Rating', val:'4.9 ★', icon:'⭐', bg:'#F5F5F5'},
              ].map(s=>`
                <div style="background:${s.bg};border:1px solid #EBEBEB;border-radius:14px;padding:14px;">
                  <div style="font-size:20px;margin-bottom:6px;">${s.icon}</div>
                  <div style="font-size:20px;font-weight:800;color:#111111;margin-bottom:2px;">${s.val}</div>
                  <div style="font-size:10px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.06em;">${s.lbl}</div>
                </div>
              `).join('')}
            </div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#999999;margin-bottom:12px;">Today's Schedule</div>
            ${[
              {time:'9:00 AM', name:'Akosua M.', svc:'Natural Twist'},
              {time:'11:30 AM',name:'Efua T.',   svc:'Box Braids'},
              {time:'2:00 PM', name:'Ama D.',    svc:'Silk Press'},
            ].map((a,i)=>`
              <div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i<2?'border-bottom:1px solid #F0F0F0;':''}">
                <span style="font-size:11px;color:#111111;font-weight:700;min-width:64px;">${a.time}</span>
                <span style="flex:1;font-size:13px;font-weight:600;color:#111111;">${a.name}</span>
                <span style="font-size:12px;color:#888888;">${a.svc}</span>
                <span style="background:#F0F0F0;color:#111111;font-size:10px;font-weight:700;padding:3px 8px;border-radius:100px;">confirmed</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════ -->
<section style="padding:56px 0;background:#FFFFFF;">
  <div class="container">
    <div style="text-align:center;margin-bottom:36px;" class="reveal">
      <h2 class="section-title" style="font-size:clamp(22px,3vw,32px);">What people are saying</h2>
    </div>

    <div class="h-scroll">
      ${[
        {name:'Akosua Mensah', loc:'Customer · Accra', img:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=88&q=80', q:'SalonLink completely transformed how I find hair appointments. A verified stylist in minutes!', rating:5},
        {name:'Efua Tetteh',   loc:'Customer · East Legon', img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=88&q=80', q:'The experience is so seamless. My stylist had my full style history ready on arrival.', rating:5},
        {name:'Kofi Asante',   loc:'Barbershop Owner · Osu', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&q=80', q:'Since joining SalonLink my bookings tripled. The verification makes clients trust us immediately.', rating:5},
        {name:'Ama Darko',     loc:'Customer · Airport Area', img:'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=88&q=80', q:'Booking was so easy. I found a great nail artist close by with amazing reviews. 10/10!', rating:5},
      ].map(t=>`
        <div class="testi-card">
          <div style="display:flex;gap:2px;margin-bottom:14px;">
            ${'<span style="color:#FFB800;font-size:16px;">★</span>'.repeat(t.rating)}
          </div>
          <p style="font-size:14px;line-height:1.7;color:#444444;margin-bottom:20px;">"${t.q}"</p>
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${t.img}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #E0E0E0;" loading="lazy" alt="${t.name}"/>
            <div>
              <div style="font-size:14px;font-weight:700;color:#111111;">${t.name}</div>
              <div style="font-size:11px;color:#999999;">${t.loc}</div>
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
<section style="padding:56px 0;background:#FAFAFA;">
  <div class="container">
    <div style="background:#111111;border-radius:24px;padding:60px 40px;text-align:center;" class="reveal">
      <h2 style="font-size:clamp(24px,4vw,40px);font-weight:800;color:#FFFFFF;margin-bottom:14px;">
        Your next look awaits
      </h2>
      <p style="font-size:16px;color:rgba(255,255,255,0.65);margin-bottom:36px;max-width:440px;margin-left:auto;margin-right:auto;">
        Join 50,000+ Ghanaians who book through SalonLink every month.
      </p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
        <a href="/discover" style="background:#FFFFFF;color:#111111;border:none;border-radius:100px;padding:15px 36px;font-size:14px;font-weight:700;text-decoration:none;">
          <i class="fas fa-search" style="font-size:13px;margin-right:6px;"></i>
          Discover Providers
        </a>
        <a href="/register" style="background:rgba(255,255,255,0.12);color:#FFFFFF;border:1.5px solid rgba(255,255,255,0.35);border-radius:100px;padding:14px 34px;font-size:14px;font-weight:700;text-decoration:none;">
          Create Free Account
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════ -->
<footer style="background:#111111;padding:56px 0 28px;">
  <div class="container">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <div style="width:32px;height:32px;border-radius:9px;background:#FFFFFF;display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-spa" style="color:#111111;font-size:14px;"></i>
          </div>
          <span style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:800;color:#FFFFFF;">SalonLink</span>
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.8;max-width:240px;">
          Ghana's leading beauty booking platform. Connecting clients with verified professionals.
        </p>
        <div style="display:flex;gap:8px;margin-top:20px;">
          ${[['fab fa-instagram'],['fab fa-twitter'],['fab fa-tiktok']].map(([ic])=>`
            <a href="#" style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.55);display:flex;align-items:center;justify-content:center;text-decoration:none;">
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
          <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:18px;">${col.title}</div>
          <div style="display:flex;flex-direction:column;gap:11px;">
            ${col.links.map(l=>`
              <a href="#" style="font-size:13px;color:rgba(255,255,255,0.50);text-decoration:none;">${l}</a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:24px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.28);">© 2025 SalonLink Ltd. All rights reserved. Made with ❤️ in Accra, Ghana 🇬🇭</p>
      <p style="font-size:12px;color:rgba(255,255,255,0.28);">GHS · English · Privacy Policy</p>
    </div>
  </div>
</footer>

${mobileNav('home')}
${globalScripts()}
</body></html>`

function featuredProviders() {
  return [
    {id:1, name:'Glam Studio GH',  type:'Hair Salon',      rating:'4.9', reviews:128, price:'80',  loc:'East Legon',   img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=80',  open:true,  verified:true},
    {id:2, name:'KutzByKofi',      type:'Barbershop',      rating:'4.8', reviews:96,  price:'40',  loc:'Osu, Accra',   img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=80',  open:true,  verified:true},
    {id:3, name:'Nails by Abena',  type:'Nail Technician', rating:'5.0', reviews:64,  price:'60',  loc:'Airport Area', img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=80',  open:false, verified:true},
    {id:4, name:'Spa by Lydia',    type:'Massage & Spa',   rating:'4.7', reviews:42,  price:'120', loc:'Cantonments',  img:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=80',  open:true,  verified:false},
    {id:5, name:'Lashes by Grace', type:'Lash Tech',       rating:'4.9', reviews:88,  price:'70',  loc:'Labone',       img:'https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=80', open:true,  verified:true},
    {id:6, name:'Makeover HQ',     type:'Makeup Artist',   rating:'4.8', reviews:54,  price:'150', loc:'Accra Mall',   img:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=480&q=80', open:false, verified:true},
  ]
}

function newProviders() {
  return [
    {id:7,  name:'Curl Studio',     type:'Natural Hair',  rating:'New', price:'90',  loc:'Tema',      img:'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=80'},
    {id:8,  name:'The Barbery',     type:'Barbershop',    rating:'New', price:'50',  loc:'Dansoman',  img:'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=480&q=80'},
    {id:9,  name:'Glow Facials',    type:'Skin Specialist',rating:'New',price:'100', loc:'Spintex',   img:'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&q=80'},
    {id:10, name:'Brows & Co',      type:'Brow Artist',   rating:'New', price:'55',  loc:'Adabraka',  img:'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=480&q=80'},
  ]
}
