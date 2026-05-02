export function enhancePage(html: string): string {
  const polish = `
<style id="salonlink-graphite-refresh">
  :root {
    --sl-ink: #07111f;
    --sl-ink-2: #0c1728;
    --sl-card: rgba(17, 31, 52, 0.88);
    --sl-card-strong: rgba(22, 39, 64, 0.96);
    --sl-line: rgba(151, 184, 214, 0.18);
    --sl-line-strong: rgba(116, 231, 245, 0.34);
    --sl-cyan: #69e7f7;
    --sl-blue: #7aa7ff;
    --sl-champagne: #d8b86a;
    --sl-green: #5ee2a8;
    --sl-red: #ff6f7d;
    --sl-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
    --sl-shadow-soft: 0 14px 44px rgba(0, 0, 0, 0.22);

    --c-void: #07111f;
    --c-deep: #0b1526;
    --c-dark: #0f1b2d;
    --c-mid: #15243a;
    --c-surface: rgba(17, 31, 52, 0.90);
    --c-raise: rgba(22, 39, 64, 0.88);
    --c-lift: rgba(28, 48, 75, 0.92);
    --c-mist: rgba(116, 139, 165, 0.28);
    --g-main: #69e7f7;
    --g-deep: #7aa7ff;
    --g-light: #d8b86a;
    --g-pale: rgba(105, 231, 247, 0.10);
    --g-dim: rgba(105, 231, 247, 0.12);
    --g-glow: rgba(105, 231, 247, 0.18);
    --g-border: rgba(105, 231, 247, 0.28);
    --g-border-s: rgba(216, 184, 106, 0.44);
    --i-full: #f8fbff;
    --i-soft: rgba(248, 251, 255, 0.78);
    --i-dim: rgba(248, 251, 255, 0.46);
    --i-faint: rgba(248, 251, 255, 0.09);
    --i-ghost: rgba(248, 251, 255, 0.055);
    --t-primary: #f8fbff;
    --t-secondary: #c5d4e7;
    --t-muted: #8ea4bb;
    --t-faint: #60758d;
    --s-green: #5ee2a8;
    --s-red: #ff6f7d;
    --s-blue: #7aa7ff;
    --s-amber: #d8b86a;
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 18px;
    --r-xl: 24px;
    --r-2xl: 32px;
  }

  html { background: var(--sl-ink); }

  body.sl-refresh {
    background:
      radial-gradient(circle at 18% 0%, rgba(105, 231, 247, 0.13), transparent 32%),
      radial-gradient(circle at 90% 10%, rgba(216, 184, 106, 0.13), transparent 26%),
      linear-gradient(180deg, var(--sl-ink) 0%, var(--sl-ink-2) 46%, #091321 100%) !important;
    color: var(--t-primary) !important;
  }

  body.sl-refresh::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(180deg, rgba(0,0,0,0.55), transparent 72%);
  }

  body.sl-refresh > * { position: relative; z-index: 1; }
  body.sl-refresh .orb,
  body.sl-refresh .hero-bg-gradient,
  body.sl-refresh .cursor-glow { display: none !important; }

  body.sl-refresh .section-light,
  body.sl-refresh .section-cream,
  body.sl-refresh .section-warm,
  body.sl-refresh .hero-wrap,
  body.sl-refresh .register-wrap,
  body.sl-refresh [style*="background:var(--c-deep)"],
  body.sl-refresh [style*="background: var(--c-deep)"] {
    background: transparent !important;
  }

  body.sl-refresh [style*="background:#FFFFFF"],
  body.sl-refresh [style*="background: #FFFFFF"],
  body.sl-refresh [style*="background:#fff"],
  body.sl-refresh [style*="background: #fff"],
  body.sl-refresh [style*="background:var(--c-surface)"],
  body.sl-refresh [style*="background: var(--c-surface)"],
  body.sl-refresh [style*="background:var(--c-raise)"],
  body.sl-refresh [style*="background: var(--c-raise)"] {
    background: linear-gradient(180deg, rgba(22,39,64,0.92), rgba(14,27,45,0.92)) !important;
  }

  body.sl-refresh [style*="border:1px solid var(--i-faint)"],
  body.sl-refresh [style*="border:1.5px solid var(--i-faint)"],
  body.sl-refresh [style*="border:1px solid var(--g-border)"] {
    border-color: var(--sl-line) !important;
  }

  body.sl-refresh nav#nav-main,
  body.sl-refresh .mobile-nav,
  body.sl-refresh .mob-nav,
  body.sl-refresh .topbar,
  body.sl-refresh .sidebar {
    background: rgba(7, 17, 31, 0.88) !important;
    border-color: var(--sl-line) !important;
    box-shadow: 0 10px 42px rgba(0, 0, 0, 0.20) !important;
    backdrop-filter: blur(22px) saturate(150%) !important;
    -webkit-backdrop-filter: blur(22px) saturate(150%) !important;
  }

  body.sl-refresh .gold-gradient {
    background: linear-gradient(135deg, var(--sl-cyan) 0%, var(--sl-blue) 42%, var(--sl-champagne) 100%) !important;
    background-size: 180% !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
  }

  body.sl-refresh .display-hero,
  body.sl-refresh .display-xl,
  body.sl-refresh .display-lg,
  body.sl-refresh .display-md,
  body.sl-refresh h1,
  body.sl-refresh h2,
  body.sl-refresh h3,
  body.sl-refresh .font-display {
    color: var(--t-primary) !important;
    letter-spacing: 0 !important;
  }

  body.sl-refresh .eyebrow {
    color: var(--sl-cyan) !important;
    letter-spacing: 0.16em !important;
  }

  body.sl-refresh .card,
  body.sl-refresh .floating-card,
  body.sl-refresh .testimonial-card,
  body.sl-refresh .provider-feature-card,
  body.sl-refresh .prov-card,
  body.sl-refresh .stat-card,
  body.sl-refresh .kpi-card,
  body.sl-refresh .filter-panel,
  body.sl-refresh .service-select-item,
  body.sl-refresh .pay-method,
  body.sl-refresh .role-card,
  body.sl-refresh .upload-zone,
  body.sl-refresh .modal,
  body.sl-refresh .provider-map-shell {
    background: linear-gradient(180deg, rgba(22,39,64,0.96), rgba(12,23,40,0.94)) !important;
    border: 1px solid var(--sl-line) !important;
    box-shadow: var(--sl-shadow-soft) !important;
    color: var(--t-primary) !important;
  }

  body.sl-refresh .card:hover,
  body.sl-refresh .testimonial-card:hover,
  body.sl-refresh .provider-feature-card:hover,
  body.sl-refresh .prov-card:hover,
  body.sl-refresh .role-card:hover,
  body.sl-refresh .service-select-item:hover,
  body.sl-refresh .pay-method:hover {
    border-color: var(--sl-line-strong) !important;
    box-shadow: 0 28px 76px rgba(0,0,0,0.36), 0 0 0 1px rgba(105,231,247,0.10) !important;
    transform: translateY(-4px) !important;
  }

  body.sl-refresh .btn-primary,
  body.sl-refresh button.btn-primary,
  body.sl-refresh a.btn-primary {
    background: linear-gradient(135deg, #2b7cff 0%, #55d7ef 52%, #d8b86a 118%) !important;
    color: #06101d !important;
    border: 0 !important;
    border-radius: 12px !important;
    box-shadow: 0 16px 42px rgba(71, 187, 234, 0.26) !important;
    font-weight: 800 !important;
    letter-spacing: 0.02em !important;
  }

  body.sl-refresh .btn-primary svg,
  body.sl-refresh .btn-primary i { color: currentColor !important; }

  body.sl-refresh .btn-outline,
  body.sl-refresh .btn-ghost,
  body.sl-refresh .btn-icon {
    background: rgba(255,255,255,0.055) !important;
    color: var(--t-secondary) !important;
    border-color: var(--sl-line) !important;
    box-shadow: none !important;
  }

  body.sl-refresh .btn-outline:hover,
  body.sl-refresh .btn-ghost:hover,
  body.sl-refresh .btn-icon:hover {
    background: rgba(105,231,247,0.12) !important;
    border-color: var(--sl-line-strong) !important;
    color: var(--t-primary) !important;
  }

  body.sl-refresh .input,
  body.sl-refresh input,
  body.sl-refresh textarea,
  body.sl-refresh select {
    background: rgba(5, 13, 25, 0.56) !important;
    color: var(--t-primary) !important;
    border-color: var(--sl-line) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.035) !important;
  }

  body.sl-refresh .input::placeholder,
  body.sl-refresh input::placeholder,
  body.sl-refresh textarea::placeholder { color: rgba(197, 212, 231, 0.46) !important; }

  body.sl-refresh .input:focus,
  body.sl-refresh input:focus,
  body.sl-refresh textarea:focus,
  body.sl-refresh select:focus {
    border-color: var(--sl-cyan) !important;
    box-shadow: 0 0 0 4px rgba(105,231,247,0.14) !important;
  }

  body.sl-refresh .badge,
  body.sl-refresh .tag {
    background: rgba(105,231,247,0.11) !important;
    border-color: rgba(105,231,247,0.22) !important;
    color: var(--t-secondary) !important;
  }

  body.sl-refresh .badge-live,
  body.sl-refresh .badge-verified,
  body.sl-refresh .badge-success { color: var(--sl-green) !important; border-color: rgba(94,226,168,0.28) !important; }
  body.sl-refresh .badge-pending,
  body.sl-refresh .badge-gold { color: var(--sl-champagne) !important; border-color: rgba(216,184,106,0.32) !important; }
  body.sl-refresh .badge-error { color: var(--sl-red) !important; border-color: rgba(255,111,125,0.30) !important; }
  body.sl-refresh .stars { color: var(--sl-champagne) !important; }

  body.sl-refresh .hero-img-main,
  body.sl-refresh .hero-img-main img,
  body.sl-refresh .card-img-wrap,
  body.sl-refresh .prov-card img,
  body.sl-refresh .provider-feature-card img,
  body.sl-refresh .hero-cover,
  body.sl-refresh .mobile-auth-hero { border-radius: 18px !important; }

  body.sl-refresh img { filter: saturate(0.9) contrast(1.05) brightness(0.88); }

  body.sl-refresh .auth-split {
    background: radial-gradient(circle at 22% 16%, rgba(105,231,247,0.18), transparent 34%), linear-gradient(135deg, #07111f, #101b2e) !important;
  }

  body.sl-refresh .auth-left { background: linear-gradient(160deg, rgba(7,17,31,0.94), rgba(16,31,52,0.82)) !important; }
  body.sl-refresh .auth-left > div:nth-child(2) { background: linear-gradient(160deg, rgba(7,17,31,0.62), rgba(12,23,40,0.88) 48%, rgba(5,12,22,0.96) 100%) !important; }
  body.sl-refresh .auth-right { background: rgba(8, 18, 33, 0.82) !important; border-left: 1px solid var(--sl-line) !important; }

  body.sl-refresh .cat-chip {
    background: rgba(255,255,255,0.045) !important;
    border-color: var(--sl-line) !important;
    color: var(--t-secondary) !important;
  }

  body.sl-refresh .cat-chip.active,
  body.sl-refresh .radio-custom.selected .radio-dot,
  body.sl-refresh .time-chip.selected,
  body.sl-refresh .cal-day.selected,
  body.sl-refresh .role-card.selected,
  body.sl-refresh .service-select-item.selected,
  body.sl-refresh .pay-method.selected {
    background: rgba(105,231,247,0.14) !important;
    border-color: var(--sl-cyan) !important;
    color: var(--t-primary) !important;
    box-shadow: 0 0 0 3px rgba(105,231,247,0.10) !important;
  }

  body.sl-refresh .step-node.active,
  body.sl-refresh .step-node.done,
  body.sl-refresh .progress-fill {
    background: linear-gradient(135deg, var(--sl-blue), var(--sl-cyan)) !important;
    color: #06101d !important;
  }

  body.sl-refresh .step-node.pending {
    background: rgba(255,255,255,0.05) !important;
    color: var(--t-muted) !important;
    border-color: var(--sl-line) !important;
  }

  body.sl-refresh .step-line.done { background: var(--sl-cyan) !important; }
  body.sl-refresh .divider { background: linear-gradient(90deg, transparent, rgba(105,231,247,0.35), transparent) !important; }

  body.sl-refresh .leaflet-container { background: #0b1526 !important; border-radius: 14px !important; }
  body.sl-refresh .leaflet-tile { filter: saturate(0.72) brightness(0.76) contrast(1.08); }
  body.sl-refresh .leaflet-popup-content-wrapper,
  body.sl-refresh .leaflet-popup-tip {
    background: #101f34 !important;
    color: var(--t-primary) !important;
    border: 1px solid var(--sl-line) !important;
  }

  .salonlink-gh-note,
  .salonlink-flowbar,
  .salonlink-auth-proof,
  .salonlink-map-note {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    border-radius: 999px;
    background: rgba(105,231,247,0.10);
    border: 1px solid rgba(105,231,247,0.24);
    color: var(--t-secondary);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .salonlink-gh-note { padding: 8px 13px; margin-bottom: 18px; }

  .salonlink-flowbar {
    width: 100%;
    justify-content: space-between;
    padding: 14px;
    margin: 0 0 24px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(105,231,247,0.10), rgba(216,184,106,0.08));
  }

  .salonlink-flow-item { display: flex; align-items: center; gap: 9px; min-width: 0; color: var(--t-secondary); }
  .salonlink-flow-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(105,231,247,0.14);
    border: 1px solid rgba(105,231,247,0.32);
    color: var(--sl-cyan);
    font-size: 11px;
  }

  .salonlink-auth-proof {
    width: 100%;
    justify-content: space-between;
    padding: 10px 12px;
    margin: 0 0 24px;
    border-radius: 14px;
    letter-spacing: 0.02em;
    text-transform: none;
    font-size: 12px;
  }

  .salonlink-home-command {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: -40px auto 40px;
    padding: 14px;
    max-width: 920px;
    border-radius: 18px;
    background: rgba(7,17,31,0.72);
    border: 1px solid var(--sl-line);
    box-shadow: var(--sl-shadow-soft);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .salonlink-home-command a {
    flex: 1;
    min-width: 170px;
    padding: 12px 14px;
    border-radius: 12px;
    text-decoration: none;
    color: var(--t-secondary);
    background: rgba(255,255,255,0.045);
    border: 1px solid var(--sl-line);
    transition: all 0.25s ease;
  }

  .salonlink-home-command a:hover { color: var(--t-primary); border-color: var(--sl-line-strong); background: rgba(105,231,247,0.10); }
  .salonlink-home-command strong { display: block; font-size: 13px; color: var(--t-primary); margin-bottom: 3px; }
  .salonlink-home-command span { display: block; font-size: 11px; line-height: 1.5; }

  body.sl-refresh .toast { background: rgba(12,23,40,0.96) !important; border-color: var(--sl-line) !important; color: var(--t-primary) !important; }
  body.sl-refresh .toast span { color: var(--t-primary) !important; }

  @media (max-width: 900px) {
    body.sl-refresh .auth-split { grid-template-columns: 1fr !important; }
    body.sl-refresh .auth-right { border-left: 0 !important; }
    .salonlink-flowbar { align-items: flex-start; flex-direction: column; border-radius: 16px; }
    .salonlink-home-command { margin: 20px 18px 32px; }
  }

  @media (max-width: 768px) {
    body.sl-refresh .display-hero { font-size: 36px !important; }
    body.sl-refresh .display-xl { font-size: 30px !important; }
    body.sl-refresh .container,
    body.sl-refresh .container-sm,
    body.sl-refresh .container-xs { padding-left: 18px !important; padding-right: 18px !important; }
    body.sl-refresh .grid-3,
    body.sl-refresh .grid-4 { gap: 16px !important; }
  }
</style>
<script id="salonlink-graphite-refresh-script">
(function(){
  var ghImages = [
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=760&q=82&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=760&q=82&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=760&q=82&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=760&q=82&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=760&q=82&auto=format&fit=crop'
  ];
  var ghNames = ['Ama, East Legon','Abena, Osu','Efua, Kumasi','Akosua, Tema','Naa, Labone'];
  var ghQuotes = [
    'Booking felt calm and premium from the first tap. I could compare services, choose a time, and pay without calling around.',
    'The nearest provider flow makes the app feel useful immediately. It looks polished and still feels very Ghanaian.',
    'I like that the provider page shows services, trust signals, reviews, and map details in one clean place.',
    'The style history and reminders make repeat bookings simple. It feels more like a beauty concierge than a directory.',
    'As a busy client, I can see price, distance, availability, and reputation before I commit. That is the whole win.'
  ];

  function setPageClass(){
    document.body.classList.add('sl-refresh');
    var path = location.pathname.split('/').filter(Boolean).join('-') || 'home';
    document.body.classList.add('sl-page-' + path);
  }

  function polishTestimonials(){
    var cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(function(card, index){
      var img = card.querySelector('img');
      if(img){ img.src = ghImages[index % ghImages.length]; img.alt = ghNames[index % ghNames.length]; }
      Array.from(card.querySelectorAll('div,span,p')).forEach(function(el){
        var txt = (el.textContent || '').trim();
        if(/^Sarah|^Emily|^Jessica|^Ashley|^Olivia|^Sophia|^Emma/i.test(txt)) el.textContent = ghNames[index % ghNames.length];
      });
      var paragraph = card.querySelector('p');
      if(paragraph && paragraph.textContent && paragraph.textContent.length > 25){ paragraph.textContent = ghQuotes[index % ghQuotes.length]; }
    });
  }

  function polishHero(){
    if(location.pathname !== '/') return;
    var hero = document.querySelector('.hero-wrap .container');
    if(hero && !document.querySelector('.salonlink-gh-note')){
      var note = document.createElement('div');
      note.className = 'salonlink-gh-note';
      note.textContent = 'Ghana beauty bookings, now more focused';
      hero.prepend(note);
    }
    var heroSection = document.querySelector('.hero-wrap');
    if(heroSection && !document.querySelector('.salonlink-home-command')){
      var command = document.createElement('div');
      command.className = 'salonlink-home-command';
      command.innerHTML = '<a href="/discover"><strong>Find the right professional</strong><span>Browse verified providers by service, rating, price, and distance.</span></a>' +
        '<a href="/register?role=provider"><strong>Grow as a provider</strong><span>Set services, location, gallery, bookings, KYC, and customer trust.</span></a>' +
        '<a href="/hairstyle-history"><strong>Keep every look</strong><span>Return to favorite styles and make repeat appointments easier.</span></a>';
      heroSection.insertAdjacentElement('afterend', command);
    }
  }

  function polishDiscovery(){
    if(location.pathname !== '/discover') return;
    var grid = document.getElementById('providers-grid');
    if(grid && !document.querySelector('.salonlink-flowbar')){
      var flow = document.createElement('div');
      flow.className = 'salonlink-flowbar';
      flow.innerHTML = '<div class="salonlink-flow-item"><span class="salonlink-flow-dot">1</span><span>Choose service</span></div>' +
        '<div class="salonlink-flow-item"><span class="salonlink-flow-dot">2</span><span>Sort by distance, rating, or price</span></div>' +
        '<div class="salonlink-flow-item"><span class="salonlink-flow-dot">3</span><span>Open profile, confirm map, then book</span></div>';
      grid.parentNode && grid.parentNode.insertBefore(flow, grid);
    }
  }

  function polishAuth(){
    if(location.pathname !== '/login' && location.pathname !== '/register') return;
    var wrap = document.querySelector('.auth-right > div, .register-card');
    if(wrap && !document.querySelector('.salonlink-auth-proof')){
      var proof = document.createElement('div');
      proof.className = 'salonlink-auth-proof';
      proof.innerHTML = '<span>Secure account</span><span>Verified providers</span><span>Fast booking flow</span>';
      var h1 = wrap.querySelector('h1');
      if(h1 && h1.parentNode) h1.parentNode.insertBefore(proof, h1);
      else wrap.prepend(proof);
    }
  }

  function polishMaps(){
    var wrap = document.getElementById('provider-map-wrap');
    if(wrap){
      wrap.classList.add('provider-map-shell');
      if(!wrap.querySelector('.salonlink-map-note')){
        var note = document.createElement('div');
        note.className = 'salonlink-map-note';
        note.style.marginTop = '10px';
        note.style.padding = '8px 10px';
        note.textContent = 'Map uses saved provider coordinates and OpenStreetMap tiles';
        wrap.appendChild(note);
      }
    }
  }

  function polishImages(){
    Array.from(document.querySelectorAll('img')).forEach(function(img){
      if(!img.src || !img.src.includes('images.unsplash.com')) return;
      var alt = (img.alt || '').toLowerCase();
      if(alt.includes('beauty') || alt.includes('styling') || alt.includes('professional') || alt.includes('client') || alt.includes('salon')){
        if(!img.dataset.salonlinkPolished){
          img.dataset.salonlinkPolished = '1';
          if(img.naturalWidth === 0 || img.src.includes('photo-1560869713')) img.src = ghImages[0];
        }
      }
    });
  }

  function patchLoginRedirect(){
    if(location.pathname !== '/login' || typeof window.handleLogin !== 'function' || window.__slLoginPatched) return;
    window.__slLoginPatched = true;
    window.handleLogin = async function(e) {
      e.preventDefault();
      var btn  = document.getElementById('login-btn');
      var txt  = document.getElementById('login-text');
      var load = document.getElementById('login-loader');
      if(btn) btn.disabled = true;
      if(txt) txt.style.display = 'none';
      if(load) load.style.display = 'inline-flex';
      try {
        var res = await axios.post('/api/auth/login', {
          email: document.getElementById('email').value.trim(),
          password: document.getElementById('password').value
        });
        if (res.data.token) {
          localStorage.setItem('sl_token', res.data.token);
          localStorage.setItem('sl_user', JSON.stringify(res.data.user));
          var u = res.data.user || {};
          var redirect = new URLSearchParams(location.search).get('redirect');
          var fallback = u.role === 'admin' ? '/admin' : u.role === 'provider' ? '/provider/dashboard' : '/discover';
          showToast('Welcome back, ' + (u.first_name || u.email || 'there'), 'success');
          setTimeout(function(){ window.location.href = redirect || fallback; }, 650);
        }
      } catch(err) {
        var msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials. Please try again.';
        showToast(msg, 'error');
        if(btn) btn.disabled = false;
        if(txt) txt.style.display = 'inline';
        if(load) load.style.display = 'none';
      }
    };
  }

  function run(){
    setPageClass();
    polishTestimonials();
    polishHero();
    polishDiscovery();
    polishAuth();
    polishMaps();
    polishImages();
    patchLoginRedirect();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
</script>`

  return html.replace('</body>', polish + '</body>')
}
