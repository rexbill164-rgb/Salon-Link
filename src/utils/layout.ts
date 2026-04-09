export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <meta name="referrer" content="no-referrer-when-downgrade"/>
  <title>${title} | SalonLink</title>
  <meta name="description" content="SalonLink — Ghana's beauty booking app. Find, book and manage salon appointments."/>
  <!-- PWA / Home Screen -->
  <link rel="manifest" href="/manifest.json"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
  <meta name="apple-mobile-web-app-title" content="SalonLink"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="application-name" content="SalonLink"/>
  <meta name="theme-color" content="#E1306C"/>
  <meta name="msapplication-TileColor" content="#E1306C"/>
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
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* ── INSTAGRAM GRADIENT COLORS ── */

      /* Page backgrounds */
      --c-void:     #FFFFFF;
      --c-deep:     #FAFAFA;
      --c-dark:     #F9F9F9;
      --c-mid:      #F5F5F5;
      --c-surface:  #FFFFFF;
      --c-raise:    #FAFAFA;
      --c-lift:     #F5F5F5;
      --c-mist:     #EEEEEE;

      /* Instagram gradient */
      --ig-purple:  #833AB4;
      --ig-pink:    #E1306C;
      --ig-orange:  #FD1D1D;
      --ig-yellow:  #FCAF45;
      --g-main:     #E1306C;
      --g-deep:     #833AB4;
      --g-light:    #FCAF45;
      --g-pale:     #FFF0F5;
      --g-dim:      rgba(225,48,108,0.10);
      --g-glow:     rgba(225,48,108,0.08);
      --g-border:   rgba(225,48,108,0.25);
      --g-border-s: rgba(225,48,108,0.45);

      /* TikTok black for contrast */
      --i-full:     #000000;
      --i-soft:     rgba(0,0,0,0.75);
      --i-dim:      rgba(0,0,0,0.45);
      --i-faint:    rgba(0,0,0,0.06);
      --i-ghost:    rgba(0,0,0,0.03);

      /* Text */
      --t-primary:  #000000;
      --t-secondary:#262626;
      --t-muted:    #8E8E8E;
      --t-faint:    #DBDBDB;

      /* Status */
      --s-green:    #00C853;
      --s-red:      #FF3B30;
      --s-blue:     #007AFF;
      --s-amber:    #FCAF45;

      /* Spacing & shape */
      --r-sm:  10px;
      --r-md:  16px;
      --r-lg:  24px;
      --r-xl:  32px;
      --r-2xl: 48px;

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
    ::selection { background: rgba(201,168,76,0.18); color: var(--g-deep); }

    /* ── TYPOGRAPHY ── */
    .font-display   { font-family: 'Poppins', sans-serif; }
    .font-serif     { font-family: 'Poppins', sans-serif; }
    .font-sans      { font-family: 'Poppins', 'Inter', sans-serif; }

    .display-hero   { font-family: 'Poppins', sans-serif; font-size: clamp(32px, 6vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; color: var(--t-primary); }
    .display-xl     { font-family: 'Poppins', sans-serif; font-size: clamp(28px, 4.5vw, 44px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; color: var(--t-primary); }
    .display-lg     { font-family: 'Poppins', sans-serif; font-size: clamp(22px, 3.2vw, 32px); font-weight: 700; line-height: 1.2; color: var(--t-primary); }
    .display-md     { font-family: 'Poppins', sans-serif; font-size: clamp(18px, 2.4vw, 24px); font-weight: 600; line-height: 1.3; color: var(--t-primary); }
    .display-sm     { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 600; color: var(--t-primary); }
    .eyebrow        { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--g-main); }

    /* ── INSTAGRAM GRADIENT TEXT ── */
    .gold           { color: var(--g-main); }
    .gold-gradient  {
      background: linear-gradient(135deg, var(--ig-purple) 0%, var(--ig-pink) 33%, var(--ig-orange) 66%, var(--ig-yellow) 100%);
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
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(32px) saturate(160%);
      -webkit-backdrop-filter: blur(32px) saturate(160%);
      border: 1px solid rgba(201,168,76,0.18);
    }
    .glass-gold {
      background: rgba(253,245,228,0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--g-border);
    }

    /* ── CARDS ── */
    .card {
      background: var(--c-surface);
      border: 1px solid var(--i-faint);
      border-radius: var(--r-lg);
      transition: transform 0.5s var(--ease-luxury), border-color 0.4s ease, box-shadow 0.5s ease;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
    }
    .card:hover { border-color: var(--g-border); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(160,120,48,0.12), 0 0 0 1px rgba(201,168,76,0.1); }
    .card:hover::before { opacity: 1; }

    .card-provider {
      background: var(--c-surface);
      border: 1px solid var(--i-faint);
      border-radius: var(--r-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.5s var(--ease-luxury);
      position: relative;
      box-shadow: 0 2px 16px rgba(58,47,30,0.06);
    }
    .card-provider:hover {
      border-color: var(--g-border-s);
      transform: translateY(-8px);
      box-shadow: 0 32px 64px rgba(160,120,48,0.18), 0 0 40px rgba(201,168,76,0.08);
    }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: linear-gradient(135deg, var(--ig-purple), var(--ig-pink), var(--ig-orange), var(--ig-yellow));
      background-size: 200%;
      color: #FFFFFF;
      font-family: 'Poppins', sans-serif;
      font-size: 13px; font-weight: 700;
      letter-spacing: 0.03em;
      border: none; border-radius: 12px;
      padding: 13px 28px;
      cursor: pointer;
      transition: background-position 0.5s ease, transform 0.2s ease, box-shadow 0.3s ease;
      text-decoration: none; white-space: nowrap;
      position: relative; overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .btn-primary:hover { background-position: right; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(160,120,48,0.35), 0 4px 12px rgba(160,120,48,0.2); }
    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      background: transparent;
      color: var(--g-deep);
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      border: 1.5px solid var(--g-border);
      border-radius: 100px;
      padding: 14px 34px;
      cursor: pointer;
      transition: all 0.35s var(--ease-luxury);
      text-decoration: none; white-space: nowrap;
    }
    .btn-outline:hover { background: var(--g-dim); border-color: var(--g-main); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(160,120,48,0.18); color: var(--g-deep); }

    .btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--i-ghost);
      color: var(--t-secondary);
      font-size: 12px; font-weight: 500;
      letter-spacing: 0.06em;
      border: 1px solid var(--i-faint);
      border-radius: 100px;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .btn-ghost:hover { background: var(--c-dark); color: var(--t-primary); border-color: rgba(58,47,30,0.18); }

    .btn-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px;
      background: var(--i-ghost);
      border: 1px solid var(--i-faint);
      border-radius: 12px;
      color: var(--t-secondary);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none; flex-shrink: 0;
    }
    .btn-icon:hover { background: var(--g-dim); border-color: var(--g-border); color: var(--g-main); }

    /* ── INPUTS ── */
    .input {
      width: 100%;
      background: var(--c-raise);
      border: 1.5px solid var(--i-faint);
      border-radius: var(--r-md);
      padding: 15px 18px;
      color: var(--t-primary);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 400;
      transition: all 0.3s ease;
      outline: none;
      -webkit-appearance: none;
    }
    .input::placeholder { color: var(--t-faint); }
    .input:focus { border-color: var(--g-main); box-shadow: 0 0 0 3px rgba(201,168,76,0.12), 0 2px 12px rgba(160,120,48,0.08); background: #FFFFFF; }
    .input:hover:not(:focus) { border-color: rgba(58,47,30,0.2); }
    select.input option { background: #FFFFFF; color: var(--t-primary); }

    /* ── DIVIDERS ── */
    .divider     { height: 1px; background: linear-gradient(90deg, transparent, var(--g-border), transparent); }
    .divider-v   { width: 1px;  background: linear-gradient(180deg, transparent, var(--g-border), transparent); }
    .divider-sub { height: 1px; background: var(--i-faint); }

    /* ── BADGES ── */
    .badge        { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
    .badge-gold   { background: var(--g-dim); color: var(--g-deep); border: 1px solid var(--g-border); }
    .badge-verified { background: rgba(46,158,94,0.10); color: #1E8050; border: 1px solid rgba(46,158,94,0.25); }
    .badge-pending  { background: rgba(201,168,76,0.12); color: var(--g-deep); border: 1px solid rgba(201,168,76,0.25); }
    .badge-live     { background: rgba(46,158,94,0.08); color: #1E8050; border: 1px solid rgba(46,158,94,0.2); }
    .badge-closed   { background: var(--i-ghost); color: var(--t-muted); border: 1px solid var(--i-faint); }
    .badge-success  { background: rgba(46,158,94,0.10); color: #1E8050; border: 1px solid rgba(46,158,94,0.2); }
    .badge-error    { background: rgba(192,72,72,0.08); color: #B03030; border: 1px solid rgba(192,72,72,0.2); }

    /* ── LAYOUT HELPERS ── */
    * { max-width: 100vw; }
    .container    { max-width: 1280px; margin: 0 auto; padding: 0 40px; width: 100%; }
    .container-sm { max-width: 960px;  margin: 0 auto; padding: 0 32px; width: 100%; }
    .container-xs { max-width: 680px;  margin: 0 auto; padding: 0 24px; width: 100%; }
    @media(max-width:768px) { .container,.container-sm,.container-xs { padding: 0 20px; } }

    /* ── GRID ── */
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
    @media(max-width:1024px){ .grid-3 { grid-template-columns: repeat(2,1fr); } .grid-4 { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:640px) { .grid-3,.grid-4 { grid-template-columns: 1fr; } }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes floatAlt  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
    @keyframes spin-slow { to{transform:rotate(360deg)} }
    @keyframes pulse-ring{ 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.35)} 50%{box-shadow:0 0 0 14px rgba(201,168,76,0)} }
    @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes line-grow { from{width:0} to{width:100%} }
    @keyframes orb-pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.05)} }
    @keyframes shimmer   { 0%{background-position:-200%} 100%{background-position:200%} }
    @keyframes particle  { 0%{transform:translateY(0) translateX(0);opacity:0.6} 100%{transform:translateY(-120px) translateX(var(--dx,20px));opacity:0} }

    .afu   { animation: fadeUp 0.7s var(--ease-luxury) both; }
    .afu-1 { animation: fadeUp 0.7s 0.08s var(--ease-luxury) both; }
    .afu-2 { animation: fadeUp 0.7s 0.16s var(--ease-luxury) both; }
    .afu-3 { animation: fadeUp 0.7s 0.24s var(--ease-luxury) both; }
    .afu-4 { animation: fadeUp 0.7s 0.32s var(--ease-luxury) both; }
    .afu-5 { animation: fadeUp 0.7s 0.40s var(--ease-luxury) both; }
    .float { animation: float 6s ease-in-out infinite; }
    .float-alt { animation: floatAlt 7s ease-in-out infinite; }

    /* ── SCROLL REVEAL ── */
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s var(--ease-luxury), transform 0.8s var(--ease-luxury); }
    .reveal.visible { opacity: 1; transform: none; }

    /* ── STARS ── */
    .stars { color: var(--g-main); letter-spacing: 1px; }

    /* ── TAG ── */
    .tag { display: inline-block; background: var(--g-dim); border: 1px solid rgba(201,168,76,0.2); border-radius: 100px; padding: 4px 12px; font-size: 11px; color: var(--g-deep); letter-spacing: 0.04em; font-weight: 500; }

    /* ── FORM ── */
    .form-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--t-muted); margin-bottom: 10px; }
    .form-group { margin-bottom: 22px; }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; pointer-events: none; }
    .input-icon-right { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; cursor: pointer; background: none; border: none; }
    .has-icon-left { padding-left: 46px !important; }
    .has-icon-right { padding-right: 46px !important; }

    /* ── MODAL ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(26,18,9,0.55); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); z-index: 9000; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 0.3s; }
    .modal-overlay.open { opacity: 1; }
    .modal { background: #FFFFFF; border: 1px solid var(--g-border); border-radius: var(--r-xl); max-width: 480px; width: 100%; padding: 44px; position: relative; transform: translateY(16px); transition: transform 0.4s var(--ease-luxury); box-shadow: 0 32px 80px rgba(160,120,48,0.18); }
    .modal-overlay.open .modal { transform: none; }

    /* ── TOAST ── */
    .toast-wrap { position: fixed; top: 28px; right: 28px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .toast {
      padding: 14px 20px 14px 16px; border-radius: 14px; font-size: 13px; font-weight: 500;
      display: flex; align-items: center; gap: 11px; backdrop-filter: blur(20px);
      min-width: 280px; max-width: 380px; pointer-events: auto;
      animation: fadeUp 0.35s var(--ease-luxury) both;
      box-shadow: 0 8px 32px rgba(58,47,30,0.15);
    }
    .toast-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; }
    .toast-success { background: rgba(255,255,255,0.96); border: 1px solid rgba(46,158,94,0.3); color: var(--t-primary); }
    .toast-success .toast-icon { background: rgba(46,158,94,0.12); color: #1E8050; }
    .toast-error   { background: rgba(255,255,255,0.96); border: 1px solid rgba(192,72,72,0.25); color: var(--t-primary); }
    .toast-error   .toast-icon { background: rgba(192,72,72,0.1); color: #B03030; }
    .toast-info    { background: rgba(255,255,255,0.96); border: 1px solid var(--g-border); color: var(--t-primary); }
    .toast-info    .toast-icon { background: var(--g-dim); color: var(--g-deep); }

    /* ── NAV ── */
    .nav-item { color: var(--t-secondary); font-size: 13px; font-weight: 500; letter-spacing: 0.03em; text-decoration: none; transition: color 0.25s; position: relative; padding-bottom: 2px; }
    .nav-item::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1.5px; background: var(--g-main); transition: width 0.35s var(--ease-luxury); }
    .nav-item:hover, .nav-item.active { color: var(--t-primary); }
    .nav-item:hover::after, .nav-item.active::after { width: 100%; }

    /* ── SIDEBAR ── */
    .sidebar-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 15px; border-radius: 12px;
      color: var(--t-secondary); font-size: 13px; font-weight: 500;
      text-decoration: none; transition: all 0.25s ease;
      cursor: pointer; background: none; border: none; width: 100%; text-align: left;
    }
    .sidebar-item:hover { background: var(--i-ghost); color: var(--t-primary); }
    .sidebar-item.active { background: var(--g-dim); color: var(--g-deep); border: 1px solid rgba(201,168,76,0.2); }
    .sidebar-item .icon { width: 18px; text-align: center; font-size: 13px; }

    /* ── STEP WIZARD ── */
    .step-node { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.4s var(--ease-luxury); flex-shrink: 0; }
    .step-node.done    { background: var(--s-green); color: white; box-shadow: 0 0 16px rgba(46,158,94,0.3); }
    .step-node.active  { background: var(--g-main); color: #FFFFFF; box-shadow: 0 0 20px rgba(201,168,76,0.4); animation: pulse-ring 2s infinite; }
    .step-node.pending { background: var(--c-lift); border: 1.5px solid var(--i-faint); color: var(--t-faint); }
    .step-line         { flex: 1; height: 1px; background: var(--i-faint); transition: background 0.4s; }
    .step-line.done    { background: var(--g-main); }

    /* ── STAT CARD ── */
    .stat-card { background: var(--c-surface); border: 1px solid var(--i-faint); border-radius: var(--r-lg); padding: 24px; position: relative; overflow: hidden; transition: border-color 0.3s, transform 0.4s var(--ease-luxury), box-shadow 0.3s; box-shadow: 0 2px 12px rgba(58,47,30,0.06); }
    .stat-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.08), transparent); }
    .stat-card:hover { border-color: var(--g-border); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(160,120,48,0.14); }

    /* ── MOBILE NAV ── */
    .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid var(--i-faint); z-index: 500; padding: 8px 0 env(safe-area-inset-bottom, 10px); box-shadow: 0 -4px 24px rgba(58,47,30,0.08); }
    @media(max-width:768px) { .mobile-nav { display: flex; } .hide-mob { display: none !important; } }
    @media(min-width:769px) { .show-mob { display: none !important; } }

    /* ── ORB ── */
    .orb { position: absolute; border-radius: 50%; pointer-events: none; }

    /* ── PROGRESS BAR ── */
    .progress { height: 3px; background: var(--c-lift); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--g-deep), var(--g-light)); border-radius: 2px; transition: width 0.6s var(--ease-luxury); }

    /* ── RATING ── */
    .rating-bar-wrap { display: flex; align-items: center; gap: 12px; }
    .rating-bar { flex: 1; height: 5px; background: var(--c-lift); border-radius: 3px; overflow: hidden; }
    .rating-bar-fill { height: 100%; background: linear-gradient(90deg, var(--g-main), var(--g-light)); border-radius: 3px; }

    /* ── BACKGROUND TEXTURES ── */
    .bg-grain {
      background-color: var(--c-void);
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E");
    }
    .bg-grid {
      background-image:
        linear-gradient(rgba(58,47,30,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(58,47,30,0.04) 1px, transparent 1px);
      background-size: 72px 72px;
    }
    .bg-grid-fine {
      background-image:
        linear-gradient(rgba(201,168,76,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,168,76,0.06) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .bg-warm {
      background: linear-gradient(160deg, #FFFDF9 0%, #FDF6E8 50%, #FFFDF9 100%);
    }

    /* ── SELECT CARD ── */
    .select-card { background: var(--c-raise); border: 1.5px solid var(--i-faint); border-radius: var(--r-md); padding: 20px; cursor: pointer; transition: all 0.3s var(--ease-luxury); }
    .select-card:hover { border-color: var(--g-border); background: var(--g-dim); }
    .select-card.selected { border-color: var(--g-main); background: rgba(201,168,76,0.06); box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }

    /* ── CURSOR GLOW ── */
    .cursor-glow { pointer-events: none; position: fixed; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%); transform: translate(-50%, -50%); z-index: 0; transition: left 0.12s, top 0.12s; will-change: left, top; }

    /* ── ANIMATED BORDER ── */
    .border-animated {
      position: relative;
      border-radius: var(--r-lg);
    }
    .border-animated::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, var(--g-main), transparent, var(--g-main), transparent);
      background-size: 400%;
      animation: gold-shift 4s linear infinite;
      z-index: -1;
    }

    /* ── TABLE ── */
    .table-luxury { width: 100%; border-collapse: collapse; }
    .table-luxury th { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--t-muted); padding: 14px 20px; border-bottom: 1px solid var(--i-faint); text-align: left; background: var(--c-raise); }
    .table-luxury td { padding: 16px 20px; border-bottom: 1px solid var(--i-faint); font-size: 13px; color: var(--t-secondary); transition: background 0.2s; }
    .table-luxury tr:hover td { background: var(--c-raise); }
    .table-luxury tr:last-child td { border-bottom: none; }

    /* ── MISC ── */
    .divider-label { display: flex; align-items: center; gap: 16px; }
    .divider-label::before, .divider-label::after { content: ''; flex: 1; height: 1px; background: var(--i-faint); }

    /* ── SCROLLBAR HIDDEN ── */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── PHOTO GRID ── */
    .photo-thumb { border-radius: 10px; overflow: hidden; aspect-ratio: 1; background: var(--c-lift); cursor: pointer; transition: transform 0.3s var(--ease-luxury); border: 1px solid var(--i-faint); }
    .photo-thumb:hover { transform: scale(1.03); }

    /* ── IMAGE PLACEHOLDERS (beauty themed) ── */
    .img-provider {
      width: 100%; height: 100%; object-fit: cover;
      background: linear-gradient(135deg, var(--c-dark) 0%, var(--c-lift) 100%);
    }
    .img-fallback {
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--g-pale) 0%, var(--c-dark) 100%);
      font-size: 48px;
    }

    /* ── SECTION DIVIDER ── */
    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--g-border) 30%, var(--g-border) 70%, transparent 100%);
      margin: 0 auto;
      max-width: 80%;
    }
  </style>
  ${extra}
`

/* ─────────────────────────────────────────────────────────────
   NAVBAR  — white/gold light theme
───────────────────────────────────────────────────────────── */
export const navbar = (active = '') => `
<nav id="nav-main" style="position:fixed;top:0;left:0;right:0;z-index:800;background:rgba(255,255,255,0.96);border-bottom:1px solid var(--i-faint);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:all 0.4s ease;box-shadow:0 2px 20px rgba(58,47,30,0.06);width:100%;max-width:100vw;overflow-x:hidden;">
  <div style="padding:0 20px;height:70px;display:flex;align-items:center;justify-content:space-between;max-width:1440px;margin:0 auto;width:100%;">

    <!-- Logo -->
    <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;">
      <!-- SalonLink App Icon: woman silhouette + location pin -->
      <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#833AB4 0%,#E1306C 55%,#FCAF45 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(225,48,108,0.4);flex-shrink:0;">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Woman head silhouette -->
          <ellipse cx="16" cy="10" rx="5.5" ry="6" fill="rgba(255,255,255,0.95)"/>
          <path d="M8 26c0-5 3.6-8 8-8s8 3 8 8" fill="rgba(255,255,255,0.95)"/>
          <!-- Hair flowing -->
          <path d="M10.5 8 Q9 4 13 3 Q16 2 19 3 Q23 4 21.5 8" fill="rgba(255,255,255,0.7)" stroke="none"/>
          <!-- Location pin overlay -->
          <circle cx="23" cy="22" r="6" fill="rgba(255,255,255,0.25)"/>
          <path d="M23 16.5c-2.2 0-4 1.8-4 4 0 3 4 7.5 4 7.5s4-4.5 4-7.5c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="white"/>
        </svg>
      </div>
      <span style="font-family:'Poppins',sans-serif;font-size:19px;font-weight:800;letter-spacing:-0.03em;background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;">Salon<span style="font-weight:500;font-style:italic;letter-spacing:0.01em;">Link</span></span>
    </a>

    <!-- Center links -->
    <div class="hide-mob" style="display:flex;align-items:center;gap:40px;">
      <a href="/discover"          class="nav-item ${active==='discover'?'active':''}">Discover</a>
      <a href="/dashboard"         class="nav-item ${active==='dashboard'?'active':''}">Bookings</a>
      <a href="/notifications"     class="nav-item ${active==='notifications'?'active':''}">Alerts</a>
      <a href="/hairstyle-history" class="nav-item ${active==='history'?'active':''}">History</a>
    </div>

    <!-- Right CTA -->
    <div id="nav-auth" style="display:flex;align-items:center;gap:12px;">
      <a href="/login"    class="btn-ghost"   style="padding:10px 22px;font-size:11px;">Sign In</a>
      <a href="/register" class="btn-primary" style="padding:11px 26px;font-size:11px;">Join Free</a>
    </div>
  </div>
</nav>
<div style="height:70px;"></div>
<script>
(function(){
  // Update nav based on login state
  var u = (function(){ try{ return JSON.parse(localStorage.getItem('sl_user')||'{}'); }catch(e){ return {}; } })();
  if (u && u.id) {
    var nav = document.getElementById('nav-auth');
    if (nav) {
      var dashLink = u.role === 'provider' ? '/provider/dashboard' : u.role === 'admin' ? '/admin' : '/dashboard';
      nav.innerHTML = '<a href="' + dashLink + '" class="btn-ghost" style="padding:10px 22px;font-size:11px;">' + (u.first_name || u.name || 'Dashboard') + '</a>' +
        '<button onclick="logout()" class="btn-ghost" style="padding:10px 16px;font-size:11px;color:var(--s-red);">Sign Out</button>';
    }
  }
  var n=document.getElementById('nav-main');
  function update(){
    if(window.scrollY>60){
      n.style.boxShadow='0 4px 32px rgba(58,47,30,0.1)';
    } else {
      n.style.boxShadow='0 2px 20px rgba(58,47,30,0.06)';
    }
  }
  window.addEventListener('scroll',update,{passive:true});
  update();
})();
</script>
`

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────────────────────── */
export const mobileNav = (active = '') => `
<div class="mobile-nav">
  ${[
    {href:'/',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',label:'Home',id:'home'},
    {href:'/discover',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',label:'Discover',id:'discover'},
    {href:'/discover',icon:'plus',label:'Book',id:'book'},
    {href:'/dashboard',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',label:'Bookings',id:'dashboard'},
    {href:'/settings',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',label:'Profile',id:'settings'},
  ].map(l => `
    <a href="${l.href}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;padding:6px 0 2px;color:${active===l.id?'var(--g-main)':'var(--t-muted)'};transition:color 0.2s;">
      ${l.id==='book'
        ? `<div style="width:46px;height:46px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:-22px;box-shadow:0 6px 20px rgba(160,120,48,0.4);transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>`
        : l.icon
      }
      <span style="font-size:9px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">${l.label}</span>
    </a>
  `).join('')}
</div>
`

/* ─────────────────────────────────────────────────────────────
   SCRIPTS (cursor glow, toast, auth helpers, reveal)
───────────────────────────────────────────────────────────── */
export const globalScripts = () => `
<div id="cursor-glow" class="cursor-glow" style="display:none;"></div>
<div class="toast-wrap" id="toast-wrap"></div>

<script>
// ── Cursor glow (desktop only)
if(window.innerWidth > 768) {
  var glow = document.getElementById('cursor-glow');
  glow.style.display = 'block';
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, {passive: true});
}

// ── Toast
function showToast(msg, type='info') {
  var icons = { success:'<i class="fas fa-check"></i>', error:'<i class="fas fa-times"></i>', info:'✦', warning:'!' };
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = '<div class="toast-icon">' + (icons[type]||'✦') + '</div><span style="flex:1;line-height:1.5;color:var(--t-primary);">' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--t-faint);cursor:pointer;font-size:18px;line-height:1;padding:2px;margin-left:4px;">×</button>';
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition='opacity 0.4s,transform 0.4s'; t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(), 400); }, 4200);
}

// ── Auth helpers
function getToken() { return localStorage.getItem('sl_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('sl_user') || '{}'); } catch(e) { return {}; } }
function isLoggedIn(){ return !!getToken(); }
function logout()   { localStorage.removeItem('sl_token'); localStorage.removeItem('sl_user'); window.location.href = '/'; }

// ── Update nav on load
document.addEventListener('DOMContentLoaded', () => {
  var user = getUser(), token = getToken();
  var nav = document.getElementById('nav-auth');
  if (token && user && user.name && nav) {
    var dashLink = user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin' : '/dashboard';
    nav.innerHTML = \`
      <a href="/notifications" class="btn-icon" title="Notifications" style="position:relative;border-radius:50%;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span style="position:absolute;top:8px;right:8px;width:6px;height:6px;background:var(--g-main);border-radius:50%;border:1.5px solid white;"></span>
      </a>
      <div style="position:relative;" id="user-menu-wrap">
        <button onclick="toggleDD()" style="display:flex;align-items:center;gap:10px;background:var(--g-dim);border:1.5px solid var(--g-border);border-radius:100px;padding:6px 14px 6px 6px;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.borderColor='var(--g-main)'" onmouseout="this.style.borderColor='var(--g-border)'">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;color:#FFFFFF;font-weight:600;">\${user.name[0].toUpperCase()}</div>
          <span style="font-size:13px;font-weight:500;color:var(--t-primary);">\${user.name.split(' ')[0]}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted)" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div id="user-dd" style="display:none;position:absolute;right:0;top:calc(100% + 10px);min-width:210px;background:#FFFFFF;border:1px solid var(--g-border);border-radius:20px;padding:8px;z-index:900;box-shadow:0 20px 50px rgba(58,47,30,0.15);">
          \${user.role==='provider'?'<a href="/provider/dashboard" class="sidebar-item"><span class="icon"><i class="fas fa-chart-bar"></i></span> Provider Dashboard</a>':''}
          \${user.role==='admin'?'<a href="/admin" class="sidebar-item"><span class="icon"><i class="fas fa-shield-alt"></i></span> Admin Panel</a>':''}
          <a href="\${dashLink}"       class="sidebar-item"><span class="icon"><i class="far fa-calendar-alt"></i></span> My Bookings</a>
          <a href="/hairstyle-history" class="sidebar-item"><span class="icon"><i class="fas fa-images"></i></span> Style History</a>
          <a href="/settings"          class="sidebar-item"><span class="icon"><i class="fas fa-cog"></i></span> Settings</a>
          <div style="height:1px;background:var(--i-faint);margin:6px 0;"></div>
          <button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;"><span class="icon"><i class="fas fa-sign-out-alt"></i></span> Sign Out</button>
        </div>
      </div>
    \`;
  }
  // Close dropdown on outside click
  document.addEventListener('click', e => {
    var wrap = document.getElementById('user-menu-wrap');
    var dd   = document.getElementById('user-dd');
    if (wrap && dd && !wrap.contains(e.target)) dd.style.display = 'none';
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    revealEls.forEach(function(el) { ro.observe(el); });
  }
});

// Fix dropdown toggle
function toggleDD() {
  var dd = document.getElementById('user-dd');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function dismissPwa() {
  var b = document.getElementById('pwa-banner');
  if (b) b.remove();
  localStorage.setItem('sl_pwa_dismissed', '1');
}

// ── PWA Add-to-Home-Screen prompt ──
(function() {
  var dismissed = localStorage.getItem('sl_pwa_dismissed');
  if (dismissed) return;
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) return;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isAndroid = /android/i.test(navigator.userAgent);
  if (!isIOS && !isAndroid) return;

  setTimeout(function() {
    var banner = document.createElement('div');
    banner.id = 'pwa-banner';
    banner.style.cssText = 'position:fixed;bottom:env(safe-area-inset-bottom,0);left:0;right:0;z-index:99998;padding:12px 16px;background:#fff;border-top:1px solid #f0f0f0;box-shadow:0 -4px 24px rgba(0,0,0,0.12);display:flex;align-items:center;gap:12px;';
    banner.innerHTML =
      '<img src="/icon-192.png" style="width:44px;height:44px;border-radius:12px;flex-shrink:0;" alt="SalonLink"/>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:700;margin-bottom:2px;">Add SalonLink to your home screen</div>' +
        '<div style="font-size:11px;color:#888;">' + (isIOS ? 'Tap Share \u2192 Add to Home Screen' : 'Tap \u22ee \u2192 Add to Home Screen') + '</div>' +
      '</div>' +
      '<button onclick="dismissPwa()" style="flex-shrink:0;background:linear-gradient(135deg,#E1306C,#F77737);color:#fff;border:none;border-radius:10px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">Add App</button>' +
      '<button onclick="dismissPwa()" style="flex-shrink:0;background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;padding:4px;">\xd7</button>';
    document.body.appendChild(banner);
  }, 3000);
})();
</script>
`

// Keep backward compat alias
export const toastScript = globalScripts;
