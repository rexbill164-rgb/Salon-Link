export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <meta name="referrer" content="no-referrer-when-downgrade"/>
  <title>${title} | SalonLink</title>
  <meta name="description" content="SalonLink — Ghana's beauty booking app. Find, book and manage salon appointments."/>
  <!-- PWA / Home Screen -->
  <link rel="manifest" href="/manifest.json?v=2"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2"/>
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2"/>
  <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png?v=2"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
  <meta name="apple-mobile-web-app-title" content="SalonLink"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="application-name" content="SalonLink"/>
  <meta name="theme-color" content="#111111"/>
  <meta name="msapplication-TileColor" content="#111111"/>
  <meta name="msapplication-TileImage" content="/icon-192.png"/>
  <!-- Open Graph -->
  <meta property="og:title" content="SalonLink"/>
  <meta property="og:description" content="Ghana's beauty booking app"/>
  <meta property="og:image" content="/icon-512.png"/>
  <meta property="og:type" content="website"/>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0MHMPCL5D2"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0MHMPCL5D2');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script id="sl-disable-zoom">
    document.addEventListener('gesturestart', function(event) { event.preventDefault(); }, { passive:false });
    document.addEventListener('gesturechange', function(event) { event.preventDefault(); }, { passive:false });
    document.addEventListener('gestureend', function(event) { event.preventDefault(); }, { passive:false });
    document.addEventListener('touchmove', function(event) { if (event.touches && event.touches.length > 1) event.preventDefault(); }, { passive:false });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      var now = Date.now();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    }, { passive:false });
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { touch-action: manipulation; -webkit-text-size-adjust: 100%; }
    input, textarea, select { font-size: 16px !important; }

    :root {
      /* ── FRESHA-INSPIRED PALETTE ── */

      /* Pure backgrounds */
      --c-void:     #FFFFFF;
      --c-deep:     #F8F8F8;
      --c-dark:     #F2F2F2;
      --c-mid:      #EBEBEB;
      --c-surface:  #FFFFFF;
      --c-raise:    #FAFAFA;
      --c-lift:     #F5F5F5;
      --c-mist:     #EEEEEE;

      /* SalonLink — Monochrome Black & White brand */
      --g-main:     #111111;
      --g-deep:     #000000;
      --g-light:    #444444;
      --g-pale:     #F5F5F5;
      --g-dim:      rgba(0,0,0,0.05);
      --g-glow:     rgba(0,0,0,0.08);
      --g-border:   rgba(0,0,0,0.14);
      --g-border-s: rgba(0,0,0,0.30);

      /* Legacy aliases (keep backward compat) */
      --ig-purple:  #111111;
      --ig-pink:    #444444;
      --ig-orange:  #111111;
      --ig-yellow:  #666666;

      /* Neutrals */
      --i-full:     #1A1A1A;
      --i-soft:     rgba(26,26,26,0.75);
      --i-dim:      rgba(26,26,26,0.45);
      --i-faint:    rgba(26,26,26,0.08);
      --i-ghost:    rgba(26,26,26,0.04);

      /* Text */
      --t-primary:  #1A1A1A;
      --t-secondary:#4A4A4A;
      --t-muted:    #8A8A8A;
      --t-faint:    #C8C8C8;

      /* Status */
      --s-green:    #00C853;
      --s-red:      #FF3B30;
      --s-blue:     #007AFF;
      --s-amber:    #FF9500;

      /* Spacing & shape */
      --r-sm:  8px;
      --r-md:  14px;
      --r-lg:  20px;
      --r-xl:  28px;
      --r-2xl: 40px;

      /* Transitions */
      --ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    html { scroll-behavior: smooth; font-size: 16px; overflow-x: hidden; }

    body {
      font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--c-void);
      color: var(--t-primary);
      min-height: 100vh;
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 15px;
    }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--c-dark); }
    ::-webkit-scrollbar-thumb { background: var(--g-main); border-radius: 2px; }

    /* ── SELECTION ── */
    ::selection { background: rgba(201,146,42,0.18); color: var(--g-deep); }

    /* ── TYPOGRAPHY ── */
    .font-display   { font-family: 'Poppins', sans-serif; }
    .font-serif     { font-family: 'Poppins', sans-serif; }
    .font-sans      { font-family: 'Poppins', 'Inter', sans-serif; }

    .display-hero   { font-family: 'Poppins', sans-serif; font-size: clamp(32px, 6vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; color: var(--t-primary); }
    .display-xl     { font-family: 'Poppins', sans-serif; font-size: clamp(28px, 4.5vw, 44px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; color: var(--t-primary); }
    .display-lg     { font-family: 'Poppins', sans-serif; font-size: clamp(22px, 3.2vw, 32px); font-weight: 700; line-height: 1.2; color: var(--t-primary); }
    .display-md     { font-family: 'Poppins', sans-serif; font-size: clamp(18px, 2.4vw, 24px); font-weight: 600; line-height: 1.3; color: var(--t-primary); }
    .display-sm     { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 600; color: var(--t-primary); }
    .eyebrow        { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--g-main); }

    /* ── PURPLE GRADIENT TEXT ── */
    .gold           { color: var(--g-main); }
    .gold-gradient  {
      background: linear-gradient(135deg, var(--g-deep) 0%, var(--g-main) 50%, var(--g-light) 100%);
      background-size: 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gold-shift 4s ease infinite;
    }
    @keyframes gold-shift { 0%,100%{background-position:0%} 50%{background-position:100%} }

    /* ── SURFACES ── */
    .surface        { background: var(--c-surface); border: 1px solid var(--i-faint); }
    .surface-raise  { background: var(--c-raise); border: 1px solid var(--i-faint); }
    .surface-gold   { background: var(--g-dim); border: 1px solid var(--g-border); }

    .glass {
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.6);
    }
    .glass-gold {
      background: rgba(240,236,255,0.90);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--g-border);
    }

    /* ── CARDS ── */
    .card {
      background: var(--c-surface);
      border: 1px solid var(--i-faint);
      border-radius: var(--r-xl);
      transition: transform 0.4s var(--ease-luxury), border-color 0.3s ease, box-shadow 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .card:hover { border-color: var(--g-border); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(201,146,42,0.10); }

    .card-provider {
      background: var(--c-surface);
      border: 1px solid var(--i-faint);
      border-radius: var(--r-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s var(--ease-luxury);
      position: relative;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .card-provider:hover {
      border-color: var(--g-border);
      transform: translateY(-6px);
      box-shadow: 0 24px 56px rgba(0,0,0,0.12);
    }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--g-main);
      color: #FFFFFF;
      font-family: 'Poppins', sans-serif;
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.01em;
      border: none; border-radius: 100px;
      padding: 13px 28px;
      cursor: pointer;
      transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.3s ease;
      text-decoration: none; white-space: nowrap;
      position: relative; overflow: hidden;
    }
    .btn-primary:hover { background: #333333; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      background: transparent;
      color: var(--g-main);
      font-family: 'Poppins', sans-serif;
      font-size: 13px; font-weight: 600;
      border: 1.5px solid var(--g-border);
      border-radius: 100px;
      padding: 12px 28px;
      cursor: pointer;
      transition: all 0.3s var(--ease-luxury);
      text-decoration: none; white-space: nowrap;
    }
    .btn-outline:hover { background: var(--g-dim); border-color: var(--g-main); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.10); }

    .btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--i-ghost);
      color: var(--t-secondary);
      font-size: 13px; font-weight: 500;
      border: 1px solid var(--i-faint);
      border-radius: 100px;
      padding: 11px 22px;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }
    .btn-ghost:hover { background: var(--c-dark); color: var(--t-primary); border-color: rgba(0,0,0,0.15); }

    .btn-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px;
      background: var(--i-ghost);
      border: 1px solid var(--i-faint);
      border-radius: 50%;
      color: var(--t-secondary);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none; flex-shrink: 0;
    }
    .btn-icon:hover { background: var(--g-dim); border-color: var(--g-border); color: var(--g-main); }

    /* ── INPUTS ── */
    .input {
      width: 100%;
      background: var(--c-raise);
      border: 1.5px solid var(--i-faint);
      border-radius: var(--r-md);
      padding: 14px 16px;
      color: var(--t-primary);
      font-family: 'Poppins', sans-serif;
      font-size: 14px; font-weight: 400;
      transition: all 0.25s ease;
      outline: none;
    }
    .input:focus { border-color: var(--g-border); background: var(--c-surface); box-shadow: 0 0 0 4px var(--g-dim); }
    .input::placeholder { color: var(--t-muted); }

    .input-search {
      background: var(--c-raise);
      border: 1.5px solid transparent;
      border-radius: 100px;
      padding: 14px 20px 14px 48px;
      font-size: 14px;
      width: 100%;
      transition: all 0.25s ease;
    }
    .input-search:focus { border-color: var(--g-border); background: var(--c-surface); outline: none; }

    /* ── BADGES ── */
    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px;
      border-radius: 100px;
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    .badge-verified { background: rgba(0,200,83,0.10); color: var(--s-green); border: 1px solid rgba(0,200,83,0.20); }
    .badge-pending  { background: rgba(255,149,0,0.10); color: var(--s-amber); border: 1px solid rgba(255,149,0,0.20); }
    .badge-gold     { background: var(--g-dim); color: var(--g-main); border: 1px solid var(--g-border); }
    .badge-live     { background: rgba(0,200,83,0.10); color: var(--s-green); }
    .badge-closed   { background: rgba(255,59,48,0.08); color: var(--s-red); }

    /* ── NAVIGATION ── */
    .nav-main {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(255,255,255,0.90);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border-bottom: 1px solid var(--i-faint);
      transition: all 0.3s ease;
    }
    .nav-main.scrolled { background: rgba(255,255,255,0.98); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }

    .nav-link {
      color: var(--t-secondary);
      text-decoration: none;
      font-size: 13px; font-weight: 500;
      padding: 8px 14px;
      border-radius: 100px;
      transition: all 0.25s ease;
    }
    .nav-link:hover, .nav-link.active { color: var(--g-main); background: var(--g-dim); }

    /* ── BOTTOM MOBILE NAV ── */
    .mobile-nav {
      position: fixed;
      bottom: 16px; left: 50%; transform: translateX(-50%);
      width: calc(100% - 32px); max-width: 420px;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 28px;
      padding: 8px;
      display: flex; justify-content: space-around; gap: 4px;
      z-index: 900;
      box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
    }

    .mobile-nav-item {
      flex: 1;
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      padding: 8px 4px;
      border-radius: 20px;
      color: var(--t-muted);
      text-decoration: none;
      font-size: 9px; font-weight: 600;
      letter-spacing: 0.02em;
      transition: all 0.25s var(--ease-spring);
      position: relative;
    }
    .mobile-nav-item svg { width: 20px; height: 20px; stroke-width: 1.8; }
    .mobile-nav-item.active { color: var(--g-main); background: var(--g-dim); }
    .mobile-nav-item:active { transform: scale(0.92); }

    .mobile-nav-item.primary {
      background: var(--g-main);
      color: #FFFFFF;
      margin-top: -28px;
      width: 64px; height: 64px; flex: 0 0 64px;
      border-radius: 50%;
      box-shadow: 0 8px 28px rgba(0,0,0,0.32);
      justify-content: center;
    }
    .mobile-nav-item.primary span { font-size: 10px; margin-top: 0; }
    .mobile-nav-item.primary svg { width: 24px; height: 24px; }

    @media(min-width: 768px) {
      .mobile-nav { display: none; }
    }

    /* ── CONTAINER ── */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    @media(max-width: 767px) {
      .container { padding: 0 16px; }
    }

    /* ── UTILS ── */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .shimmer {
      background: linear-gradient(90deg, var(--c-dark) 25%, var(--c-mid) 50%, var(--c-dark) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    .fade-up { animation: fadeUp 0.6s var(--ease-luxury) both; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

    /* ── RESPONSIVE ── */
    @media(max-width: 767px) {
      body { font-size: 14px; padding-bottom: 100px; }
      .display-hero { font-size: 36px; }
      .display-xl { font-size: 28px; }
      .display-lg { font-size: 24px; }
      .card { border-radius: var(--r-lg); }
      .hide-mob { display: none !important; }
    }

    @media(min-width: 768px) {
      .hide-desk { display: none !important; }
    }
  </style>
  ${extra}
`