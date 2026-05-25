import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Ghana\'s Top Beauty Booking App', `
<style>
  /* ── Fresha-style Hero Gradient ── */
  .hero-section {
    background: linear-gradient(135deg, #f8f4ff 0%, #fce8f3 50%, #fff8f8 100%);
    padding: 60px 0 80px;
    position: relative;
    overflow: hidden;
  }
  @media(max-width:768px) {
    .hero-section { padding: 40px 0 60px; }
  }

  /* ── Fresha Search Bar ── */
  .search-container {
    display: flex;
    align-items: stretch;
    background: #fff;
    border-radius: 100px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.06);
    max-width: 720px;
    margin: 0 auto;
    overflow: hidden;
    transition: box-shadow 0.2s, border-color 0.2s;
  }
  .search-container:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.1);
  }
  .search-field {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border-right: 1px solid rgba(0,0,0,0.06);
    text-decoration: none;
    color: inherit;
    transition: background 0.15s;
  }
  .search-field:hover { background: #fafafa; }
  .search-field:last-of-type { border-right: none; }
  .search-field-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #101010;
    flex-shrink: 0;
  }
  .search-field-content { text-align: left; }
  .search-field-label {
    font-size: 12px;
    font-weight: 600;
    color: #101010;
    margin-bottom: 2px;
  }
  .search-field-value {
    font-size: 14px;
    color: #888;
  }
  .search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #101010;
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 16px 32px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin: 8px;
    transition: background 0.2s;
    text-decoration: none;
  }
  .search-btn:hover { background: #2a2a2a; }
  @media(max-width:640px) {
    .search-container { flex-direction: column; border-radius: 24px; }
    .search-field { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); padding: 14px 20px; }
    .search-field:last-of-type { border-bottom: none; }
    .search-btn { margin: 12px; border-radius: 100px; }
  }

  /* ── Stats Banner ── */
  .stats-text {
    font-size: 18px;
    font-weight: 700;
    color: #101010;
  }
  .stats-text span { color: #888; font-weight: 400; }

  /* ── Section Styles ── */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #101010;
    letter-spacing: -0.02em;
  }
  .section-link {
    font-size: 14px;
    font-weight: 500;
    color: #101010;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .section-link:hover { text-decoration: underline; }

  /* ── Provider Cards (Fresha style) ── */
  .provider-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media(max-width:1024px) { .provider-grid { grid-template-columns: repeat(3, 1fr); } }
  @media(max-width:768px) { .provider-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
  @media(max-width:480px) { .provider-grid { grid-template-columns: 1fr 1fr; gap: 12px; } }

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
  .provider-card-name .verified {
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
    margin-bottom: 8px;
  }
  .provider-card-rating {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .provider-card-rating .star {
    color: #101010;
    font-size: 14px;
  }
  .provider-card-rating .score {
    font-size: 14px;
    font-weight: 700;
    color: #101010;
  }
  .provider-card-rating .count {
    font-size: 13px;
    color: #888;
  }

  /* ── Horizontal Scroll ── */
  .h-scroll {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
    scroll-snap-type: x mandatory;
  }
  .h-scroll::-webkit-scrollbar { display: none; }
  .h-scroll > * { scroll-snap-align: start; }

  /* ── Category Cards ── */
  .category-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }
  @media(max-width:1024px) { .category-grid { grid-template-columns: repeat(4, 1fr); } }
  @media(max-width:640px) { .category-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }

  .category-card {
    text-align: center;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s;
  }
  .category-card:hover { transform: translateY(-4px); }
  .category-card-img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .category-card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  .category-card:hover .category-card-img img { transform: scale(1.08); }
  .category-card-label {
    font-size: 13px;
    font-weight: 600;
    color: #101010;
  }

  /* ── How it Works ── */
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  @media(max-width:768px) { .steps-grid { grid-template-columns: 1fr; gap: 24px; } }

  .step-card {
    text-align: center;
    padding: 32px 24px;
  }
  .step-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f8f4ff 0%, #fce8f3 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 24px;
    color: #101010;
  }
  .step-title {
    font-size: 18px;
    font-weight: 700;
    color: #101010;
    margin-bottom: 8px;
  }
  .step-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }

  /* ── Testimonials ── */
  .testimonial-card {
    background: #fff;
    border-radius: 20px;
    padding: 28px;
    min-width: 320px;
    max-width: 380px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    flex-shrink: 0;
  }
  .testimonial-stars { margin-bottom: 16px; color: #101010; font-size: 16px; letter-spacing: 2px; }
  .testimonial-text {
    font-size: 15px;
    line-height: 1.7;
    color: #333;
    margin-bottom: 20px;
  }
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .testimonial-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }
  .testimonial-name {
    font-size: 14px;
    font-weight: 600;
    color: #101010;
  }
  .testimonial-role {
    font-size: 13px;
    color: #888;
  }

  /* ── CTA Section ── */
  .cta-section {
    background: #101010;
    border-radius: 32px;
    padding: 80px 48px;
    text-align: center;
    color: #fff;
  }
  @media(max-width:640px) { .cta-section { padding: 48px 24px; border-radius: 24px; } }

  /* ── Footer ── */
  .footer {
    background: #fafafa;
    padding: 64px 0 32px;
    border-top: 1px solid rgba(0,0,0,0.06);
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  @media(max-width:768px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
  @media(max-width:480px) { .footer-grid { grid-template-columns: 1fr; } }

  .footer-brand { font-size: 22px; font-weight: 800; color: #101010; margin-bottom: 16px; }
  .footer-desc { font-size: 14px; color: #666; line-height: 1.7; max-width: 280px; }
  .footer-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 16px; }
  .footer-links { display: flex; flex-direction: column; gap: 12px; }
  .footer-links a { font-size: 14px; color: #555; text-decoration: none; }
  .footer-links a:hover { color: #101010; }
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid rgba(0,0,0,0.06);
    font-size: 13px;
    color: #888;
  }
  @media(max-width:640px) { .footer-bottom { flex-direction: column; gap: 12px; text-align: center; } }
</style>
`)}
</head>
<body>
${navbar('home')}

<!-- ══════════════════════════════════════════════
     HERO — Fresha-style gradient
══════════════════════════════════════════════ -->
<section class="hero-section">
  <div class="container">
    <div style="max-width:800px;margin:0 auto;text-align:center;">
      <h1 style="font-size:clamp(36px,6vw,56px);font-weight:800;line-height:1.1;letter-spacing:-0.02em;color:#101010;margin-bottom:16px;">
        Book local selfcare services
      </h1>
      <p style="font-size:18px;color:#555;margin-bottom:40px;max-width:520px;margin-left:auto;margin-right:auto;">
        Discover top-rated salons, barbers, spas and beauty experts trusted by thousands in Ghana
      </p>

      <!-- Fresha-style Search Bar -->
      <div class="search-container">
        <a href="/discover" class="search-field">
          <div class="search-field-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="search-field-content">
            <div class="search-field-label">All treatments</div>
            <div class="search-field-value">Hair, nails, massage...</div>
          </div>
        </a>
        <a href="/discover" class="search-field hide-mob">
          <div class="search-field-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="search-field-content">
            <div class="search-field-label">Current location</div>
            <div class="search-field-value">Accra, Ghana</div>
          </div>
        </a>
        <a href="/discover" class="search-field hide-mob">
          <div class="search-field-icon">
            <i class="far fa-calendar"></i>
          </div>
          <div class="search-field-content">
            <div class="search-field-label">Any time</div>
            <div class="search-field-value">Select date</div>
          </div>
        </a>
        <a href="/discover" class="search-btn">Search</a>
      </div>

      <!-- Stats -->
      <div style="margin-top:40px;">
        <p class="stats-text">Trusted booking <span>for salons, barbers, spas and beauty professionals across Ghana</span></p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     TOP RATED — Provider Cards
══════════════════════════════════════════════ -->
<section style="padding:64px 0;background:#fff;">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Top rated near you</h2>
      <a href="/discover" class="section-link">View all <i class="fas fa-arrow-right" style="font-size:12px;"></i></a>
    </div>

    <div class="provider-grid" id="home-provider-grid">
      ${featuredProviders().map(p => `
        <div class="provider-card" onclick="window.location.href='/provider/${p.id}'">
          <div class="provider-card-img">
            <img src="${p.img}" alt="${p.name}" loading="lazy"/>
            <div class="provider-card-badge">
              ${p.verified ? `<span class="badge badge-verified"><i class="fas fa-check" style="font-size:10px;"></i> Verified</span>` : ''}
            </div>
            <div class="provider-card-heart">
              <i class="far fa-heart"></i>
            </div>
          </div>
          <div class="provider-card-content">
            <div class="provider-card-name">
              ${p.name}
              ${p.verified ? `<span class="verified"><i class="fas fa-check"></i></span>` : ''}
            </div>
            <div class="provider-card-meta">${p.loc}</div>
            <div class="provider-card-meta">${p.type}</div>
            <div class="provider-card-rating">
              <span class="star">★</span>
              <span class="score">${p.rating}</span>
              <span class="count">(${p.reviews} reviews)</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     CATEGORIES
══════════════════════════════════════════════ -->
<section style="padding:64px 0;background:#fafafa;">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Browse by category</h2>
      <a href="/discover" class="section-link">View all <i class="fas fa-arrow-right" style="font-size:12px;"></i></a>
    </div>

    <div class="category-grid">
      ${[
    { label: 'Hair Salons', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', cat: 'Hair Styling' },
    { label: 'Barbershops', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80', cat: 'Barbing' },
    { label: 'Nail Salons', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', cat: 'Nail Care' },
    { label: 'Massage', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80', cat: 'Massage' },
    { label: 'Skincare', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80', cat: 'Facials' },
    { label: 'Makeup', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', cat: 'Makeup' },
  ].map(c => `
        <a href="/discover?service=${encodeURIComponent(c.cat)}" class="category-card">
          <div class="category-card-img">
            <img src="${c.img}" alt="${c.label}" loading="lazy"/>
          </div>
          <div class="category-card-label">${c.label}</div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     NEW TO SALONLINK
══════════════════════════════════════════════ -->
<section style="padding:64px 0;background:#fff;">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">New to SalonLink</h2>
      <a href="/discover" class="section-link">View all <i class="fas fa-arrow-right" style="font-size:12px;"></i></a>
    </div>

    <div class="h-scroll">
      ${newProviders().map(p => `
        <div class="provider-card" style="min-width:260px;max-width:280px;flex-shrink:0;" onclick="window.location.href='/provider/${p.id}'">
          <div class="provider-card-img">
            <img src="${p.img}" alt="${p.name}" loading="lazy"/>
            <div class="provider-card-badge">
              <span class="badge badge-new">New</span>
            </div>
            <div class="provider-card-heart">
              <i class="far fa-heart"></i>
            </div>
          </div>
          <div class="provider-card-content">
            <div class="provider-card-name">${p.name}</div>
            <div class="provider-card-meta">${p.loc}</div>
            <div class="provider-card-meta">${p.type} · from GHS ${p.price}</div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     HOW IT WORKS
══════════════════════════════════════════════ -->
<section style="padding:80px 0;background:#fafafa;">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px;">
      <h2 class="section-title" style="font-size:28px;">How SalonLink works</h2>
    </div>

    <div class="steps-grid">
      <div class="step-card">
        <div class="step-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="step-title">Discover</div>
        <div class="step-desc">Browse verified beauty professionals and wellness experts near you</div>
      </div>
      <div class="step-card">
        <div class="step-icon">
          <i class="far fa-calendar-check"></i>
        </div>
        <div class="step-title">Book</div>
        <div class="step-desc">Choose your preferred time and book instantly online</div>
      </div>
      <div class="step-card">
        <div class="step-icon">
          <i class="fas fa-heart"></i>
        </div>
        <div class="step-title">Enjoy</div>
        <div class="step-desc">Relax and enjoy your treatment with a trusted professional</div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     TESTIMONIALS
══════════════════════════════════════════════ -->
<section style="padding:80px 0;background:#fff;">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px;">
      <h2 class="section-title" style="font-size:28px;">What our customers say</h2>
    </div>

    <div class="h-scroll" style="gap:20px;">
      ${[
    { name: 'Akosua Mensah', role: 'Customer', loc: 'Accra', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', text: 'SalonLink completely transformed how I find hair appointments. Found a verified stylist in minutes!' },
    { name: 'Efua Tetteh', role: 'Customer', loc: 'East Legon', img: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=100&q=80', text: 'The experience is so seamless. My stylist had my full style history ready on arrival.' },
    { name: 'Kofi Asante', role: 'Barbershop Owner', loc: 'Osu', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: 'Since joining SalonLink my bookings tripled. The verification makes clients trust us immediately.' },
    { name: 'Ama Darko', role: 'Customer', loc: 'Airport Area', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80', text: 'Booking was so easy. I found a great nail artist close by with amazing reviews. Highly recommend!' },
  ].map(t => `
        <div class="testimonial-card">
          <div class="testimonial-stars">★★★★★</div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <img class="testimonial-avatar" src="${t.img}" alt="${t.name}" loading="lazy"/>
            <div>
              <div class="testimonial-name">${t.name}</div>
              <div class="testimonial-role">${t.role} · ${t.loc}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOR PROVIDERS CTA
══════════════════════════════════════════════ -->
<section style="padding:80px 0;background:#fafafa;">
  <div class="container">
    <div class="cta-section">
      <h2 style="font-size:clamp(28px,4vw,42px);font-weight:800;margin-bottom:16px;">
        Grow your business with SalonLink
      </h2>
      <p style="font-size:16px;color:rgba(255,255,255,0.7);margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto;">
        Join thousands of beauty professionals who use SalonLink to manage bookings and grow their client base
      </p>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
        <a href="/register?role=provider" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#101010;border:none;border-radius:100px;padding:16px 32px;font-size:15px;font-weight:600;text-decoration:none;">
          Get started free
        </a>
        <a href="/discover" style="display:inline-flex;align-items:center;gap:8px;background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:100px;padding:16px 32px;font-size:15px;font-weight:600;text-decoration:none;">
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════
     FOOTER
══════════════════════════════════════════════ -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">salonlink</div>
        <p class="footer-desc">
          Ghana's beauty booking platform connecting clients with verified beauty and wellness professionals.
        </p>
      </div>
      <div>
        <div class="footer-title">Platform</div>
        <div class="footer-links">
          <a href="/discover">Discover</a>
          <a href="/register?role=provider">List your business</a>
          <a href="/login">Log in</a>
          <a href="/register">Sign up</a>
        </div>
      </div>
      <div>
        <div class="footer-title">Company</div>
        <div class="footer-links">
          <a href="#">About us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Blog</a>
        </div>
      </div>
      <div>
        <div class="footer-title">Support</div>
        <div class="footer-links">
          <a href="#">Help center</a>
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 SalonLink. All rights reserved.</p>
      <p>Made in Accra, Ghana</p>
    </div>
  </div>
</footer>

${mobileNav('home')}
${globalScripts()}
<script>
(function loadRealProviders(){
  var grid = document.getElementById('home-provider-grid');
  if (!grid) return;
  var defaultImg = 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=80';
  fetch('/api/providers?verified=1&limit=8')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var providers = (data.providers || data.results || []).filter(function(p){ return p.is_verified && p.is_accepting_bookings; });
      if (!providers || !providers.length) return; // keep fallback if no real providers
      grid.innerHTML = providers.map(function(p){
        var img = p.logo_url && p.logo_url.startsWith('http') ? p.logo_url : defaultImg;
        var rating = p.rating ? parseFloat(p.rating).toFixed(1) : 'New';
        var reviews = p.total_reviews || 0;
        var city = p.city || p.address || 'Ghana';
        var category = p.service_category || 'Salon';
        var open = p.is_accepting_bookings ? '' : '<div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;padding:2px 8px;border-radius:100px;">Closed</div>';
        return '<div class="provider-card" onclick="window.location.href=\'/provider/'+p.id+'\'">' +
          '<div class="provider-card-img">' +
            '<img src="'+img+'" alt="'+p.business_name+'" loading="lazy" onerror="this.src=\''+defaultImg+'\'" />' +
            '<div class="provider-card-badge">' +
              (p.is_verified ? '<span class="badge badge-verified"><i class="fas fa-check" style="font-size:10px;"></i> Verified</span>' : '') +
            '</div>' + open +
            '<div class="provider-card-heart"><i class="far fa-heart"></i></div>' +
          '</div>' +
          '<div class="provider-card-content">' +
            '<div class="provider-card-name">'+p.business_name+(p.is_verified?'<span class="verified"><i class="fas fa-check"></i></span>':'')+'</div>' +
            '<div class="provider-card-meta">'+city+'</div>' +
            '<div class="provider-card-meta">'+category+'</div>' +
            '<div class="provider-card-rating"><span class="star">★</span><span class="score">'+rating+'</span><span class="count">('+reviews+' reviews)</span></div>' +
          '</div>' +
        '</div>';
      }).join('');
    }).catch(function(){}); // silently keep fallback on error
})();
</script>
</body></html>`

function featuredProviders() {
  return [
    { id: 1, name: 'Glam Studio GH', type: 'Hair Salon', rating: '4.9', reviews: 128, price: '80', loc: 'East Legon, Accra', img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=80', open: true, verified: true },
    { id: 2, name: 'KutzByKofi', type: 'Barbershop', rating: '4.8', reviews: 96, price: '40', loc: 'Osu, Accra', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=80', open: true, verified: true },
    { id: 3, name: 'Nails by Abena', type: 'Nail Salon', rating: '5.0', reviews: 64, price: '60', loc: 'Airport Area', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=80', open: false, verified: true },
    { id: 4, name: 'Spa by Lydia', type: 'Massage & Spa', rating: '4.7', reviews: 42, price: '120', loc: 'Cantonments', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=80', open: true, verified: false },
    { id: 5, name: 'Lashes by Grace', type: 'Lash Studio', rating: '4.9', reviews: 88, price: '70', loc: 'Labone', img: 'https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=80', open: true, verified: true },
    { id: 6, name: 'Makeover HQ', type: 'Makeup Artist', rating: '4.8', reviews: 54, price: '150', loc: 'Accra Mall', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=480&q=80', open: false, verified: true },
    { id: 7, name: 'The Curl Bar', type: 'Natural Hair', rating: '4.9', reviews: 112, price: '95', loc: 'Tema', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=80', open: true, verified: true },
    { id: 8, name: 'Zen Wellness', type: 'Spa & Wellness', rating: '4.8', reviews: 78, price: '180', loc: 'Ridge', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&q=80', open: true, verified: true },
  ]
}

function newProviders() {
  return [
    { id: 9, name: 'Curl Studio', type: 'Natural Hair', rating: 'New', price: '90', loc: 'Tema', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=80' },
    { id: 10, name: 'The Barbery', type: 'Barbershop', rating: 'New', price: '50', loc: 'Dansoman', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=480&q=80' },
    { id: 11, name: 'Glow Facials', type: 'Skincare', rating: 'New', price: '100', loc: 'Spintex', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=480&q=80' },
    { id: 12, name: 'Brows & Co', type: 'Brow Studio', rating: 'New', price: '55', loc: 'Adabraka', img: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=480&q=80' },
    { id: 13, name: 'Royal Cuts', type: 'Barbershop', rating: 'New', price: '45', loc: 'Madina', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=480&q=80' },
  ]
}
