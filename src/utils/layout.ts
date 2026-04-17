export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
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
  <meta name="theme-color" content="#C9922A"/>
  <meta name="msapplication-TileColor" content="#C9922A"/>
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
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

      /* SalonLink Gold – primary brand */
      --g-main:     #C9922A;
      --g-deep:     #A5721A;
      --g-light:    #E4B55A;
      --g-pale:     #FDF6E8;
      --g-dim:      rgba(201,146,42,0.08);
      --g-glow:     rgba(201,146,42,0.12);
      --g-border:   rgba(201,146,42,0.22);
      --g-border-s: rgba(201,146,42,0.45);

      /* Legacy aliases (keep backward compat) */
      --ig-purple:  #C9922A;
      --ig-pink:    #E4B55A;
      --ig-orange:  #C9922A;
      --ig-yellow:  #E4B55A;

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
      box-shadow: 0 24px 56px rgba(108,71,255,0.14);
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
    .btn-primary:hover { background: var(--g-deep); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,146,42,0.35); }
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
    .btn-outline:hover { background: var(--g-dim); border-color: var(--g-main); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201,146,42,0.15); }

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
      -webkit-appearance: none;
    }
    .input::placeholder { color: var(--t-faint); }
    .input:focus { border-color: var(--g-main); box-shadow: 0 0 0 3px rgba(108,71,255,0.10); background: #FFFFFF; }
    .input:hover:not(:focus) { border-color: rgba(0,0,0,0.18); }
    select.input option { background: #FFFFFF; color: var(--t-primary); }

    /* ── DIVIDERS ── */
    .divider     { height: 1px; background: var(--i-faint); }
    .divider-v   { width: 1px;  background: var(--i-faint); }
    .divider-sub { height: 1px; background: var(--i-faint); }

    /* ── BADGES ── */
    .badge        { display: inline-flex; align-items: center; gap: 4px; border-radius: 100px; padding: 4px 10px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }
    .badge-gold   { background: var(--g-dim); color: var(--g-deep); border: 1px solid var(--g-border); }
    .badge-verified { background: rgba(0,200,83,0.10); color: #007A3D; border: 1px solid rgba(0,200,83,0.25); }
    .badge-pending  { background: rgba(255,149,0,0.10); color: #B36600; border: 1px solid rgba(255,149,0,0.25); }
    .badge-live     { background: rgba(0,200,83,0.08); color: #007A3D; border: 1px solid rgba(0,200,83,0.20); }
    .badge-closed   { background: var(--i-ghost); color: var(--t-muted); border: 1px solid var(--i-faint); }
    .badge-success  { background: rgba(0,200,83,0.10); color: #007A3D; border: 1px solid rgba(0,200,83,0.20); }
    .badge-error    { background: rgba(255,59,48,0.08); color: #CC2200; border: 1px solid rgba(255,59,48,0.20); }

    /* ── LAYOUT HELPERS ── */
    * { max-width: 100vw; }
    .container    { max-width: 1280px; margin: 0 auto; padding: 0 40px; width: 100%; }
    .container-sm { max-width: 960px;  margin: 0 auto; padding: 0 32px; width: 100%; }
    .container-xs { max-width: 680px;  margin: 0 auto; padding: 0 24px; width: 100%; }
    @media(max-width:768px) { .container,.container-sm,.container-xs { padding: 0 16px; } }

    /* ── GRID ── */
    .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    @media(max-width:1024px){ .grid-3 { grid-template-columns: repeat(2,1fr); } .grid-4 { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:640px) { .grid-3,.grid-4 { grid-template-columns: 1fr; } }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes spin-slow { to{transform:rotate(360deg)} }
    @keyframes pulse-ring{ 0%,100%{box-shadow:0 0 0 0 rgba(108,71,255,0.35)} 50%{box-shadow:0 0 0 12px rgba(108,71,255,0)} }
    @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes shimmer   { 0%{background-position:-200%} 100%{background-position:200%} }

    .afu   { animation: fadeUp 0.6s var(--ease-luxury) both; }
    .afu-1 { animation: fadeUp 0.6s 0.07s var(--ease-luxury) both; }
    .afu-2 { animation: fadeUp 0.6s 0.14s var(--ease-luxury) both; }
    .afu-3 { animation: fadeUp 0.6s 0.21s var(--ease-luxury) both; }
    .afu-4 { animation: fadeUp 0.6s 0.28s var(--ease-luxury) both; }
    .afu-5 { animation: fadeUp 0.6s 0.35s var(--ease-luxury) both; }
    .float { animation: float 5s ease-in-out infinite; }

    /* ── SCROLL REVEAL ── */
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s var(--ease-luxury), transform 0.7s var(--ease-luxury); }
    .reveal.visible { opacity: 1; transform: none; }

    /* ── STARS ── */
    .stars { color: #FFB800; letter-spacing: 1px; }

    /* ── TAG ── */
    .tag { display: inline-block; background: var(--c-dark); border-radius: 100px; padding: 4px 12px; font-size: 11px; color: var(--t-secondary); font-weight: 500; }

    /* ── FORM ── */
    .form-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t-muted); margin-bottom: 8px; }
    .form-group { margin-bottom: 20px; }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; pointer-events: none; }
    .input-icon-right { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; cursor: pointer; background: none; border: none; }
    .has-icon-left { padding-left: 46px !important; }
    .has-icon-right { padding-right: 46px !important; }

    /* ── MODAL ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 9000; display: flex; align-items: flex-end; justify-content: center; padding: 0; opacity: 0; transition: opacity 0.3s; }
    @media(min-width:600px){ .modal-overlay { align-items: center; padding: 20px; } }
    .modal-overlay.open { opacity: 1; }
    .modal { background: #FFFFFF; border-radius: 28px 28px 0 0; max-width: 520px; width: 100%; padding: 32px 28px 40px; position: relative; transform: translateY(20px); transition: transform 0.4s var(--ease-luxury); max-height: 90vh; overflow-y: auto; }
    @media(min-width:600px){ .modal { border-radius: 28px; } }
    .modal-overlay.open .modal { transform: none; }

    /* ── TOAST ── */
    .toast-wrap { position: fixed; top: 20px; right: 16px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
    .toast {
      padding: 12px 16px 12px 14px; border-radius: 14px; font-size: 13px; font-weight: 500;
      display: flex; align-items: center; gap: 10px; backdrop-filter: blur(20px);
      min-width: 260px; max-width: 360px; pointer-events: auto;
      animation: fadeUp 0.3s var(--ease-luxury) both;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .toast-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; }
    .toast-success { background: rgba(255,255,255,0.98); border: 1px solid rgba(0,200,83,0.25); color: var(--t-primary); }
    .toast-success .toast-icon { background: rgba(0,200,83,0.10); color: #007A3D; }
    .toast-error   { background: rgba(255,255,255,0.98); border: 1px solid rgba(255,59,48,0.22); color: var(--t-primary); }
    .toast-error   .toast-icon { background: rgba(255,59,48,0.08); color: #CC2200; }
    .toast-info    { background: rgba(255,255,255,0.98); border: 1px solid var(--g-border); color: var(--t-primary); }
    .toast-info    .toast-icon { background: var(--g-dim); color: var(--g-main); }

    /* ── NAV ── */
    .nav-item { color: var(--t-secondary); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
    .nav-item:hover, .nav-item.active { color: var(--g-main); }

    /* ── SIDEBAR ── */
    .sidebar-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 12px;
      color: var(--t-secondary); font-size: 13px; font-weight: 500;
      text-decoration: none; transition: all 0.2s ease;
      cursor: pointer; background: none; border: none; width: 100%; text-align: left;
    }
    .sidebar-item:hover { background: var(--i-ghost); color: var(--t-primary); }
    .sidebar-item.active { background: var(--g-dim); color: var(--g-main); }
    .sidebar-item .icon { width: 18px; text-align: center; font-size: 13px; }

    /* ── STEP WIZARD ── */
    .step-node { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.3s var(--ease-luxury); flex-shrink: 0; }
    .step-node.done    { background: var(--s-green); color: white; }
    .step-node.active  { background: var(--g-main); color: #FFFFFF; animation: pulse-ring 2s infinite; }
    .step-node.pending { background: var(--c-lift); border: 1.5px solid var(--i-faint); color: var(--t-faint); }
    .step-line         { flex: 1; height: 2px; background: var(--i-faint); transition: background 0.4s; }
    .step-line.done    { background: var(--g-main); }

    /* ── STAT CARD ── */
    .stat-card { background: var(--c-surface); border: 1px solid var(--i-faint); border-radius: var(--r-lg); padding: 20px; position: relative; overflow: hidden; transition: border-color 0.3s, transform 0.3s; }
    .stat-card:hover { border-color: var(--g-border); transform: translateY(-3px); }

    /* ── MOBILE NAV – Fresha floating pill style ── */
    .mobile-nav {
      display: none;
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 400px;
      background: rgba(255,255,255,0.98);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-radius: 28px;
      z-index: 500;
      padding: 10px 8px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
      border: 1px solid rgba(255,255,255,0.8);
    }
    @media(max-width:768px) { .mobile-nav { display: flex; } .hide-mob { display: none !important; } }
    @media(min-width:769px) { .show-mob { display: none !important; } }

    /* ── PROGRESS BAR ── */
    .progress { height: 4px; background: var(--c-lift); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--g-main); border-radius: 2px; transition: width 0.5s var(--ease-luxury); }

    /* ── RATING ── */
    .rating-bar-wrap { display: flex; align-items: center; gap: 12px; }
    .rating-bar { flex: 1; height: 4px; background: var(--c-lift); border-radius: 2px; overflow: hidden; }
    .rating-bar-fill { height: 100%; background: #FFB800; border-radius: 2px; }

    /* ── ORB ── */
    .orb { position: absolute; border-radius: 50%; pointer-events: none; }

    /* ── ANIMATIONS ── */
    @keyframes orb-pulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }

    /* ── PHOTO GRID ── */
    .photo-thumb { border-radius: 12px; overflow: hidden; aspect-ratio: 1; background: var(--c-lift); cursor: pointer; transition: transform 0.3s var(--ease-luxury); border: 1px solid var(--i-faint); }
    .photo-thumb:hover { transform: scale(1.03); }

    /* ── IMAGE PLACEHOLDERS ── */
    .img-provider { width: 100%; height: 100%; object-fit: cover; }
    .img-fallback { display: flex; align-items: center; justify-content: center; background: var(--g-dim); font-size: 40px; }

    /* ── TABLE ── */
    .table-luxury { width: 100%; border-collapse: collapse; }
    .table-luxury th { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t-muted); padding: 12px 16px; border-bottom: 1px solid var(--i-faint); text-align: left; background: var(--c-raise); }
    .table-luxury td { padding: 14px 16px; border-bottom: 1px solid var(--i-faint); font-size: 13px; color: var(--t-secondary); transition: background 0.2s; }
    .table-luxury tr:hover td { background: var(--c-raise); }
    .table-luxury tr:last-child td { border-bottom: none; }

    /* ── MISC ── */
    .divider-label { display: flex; align-items: center; gap: 16px; }
    .divider-label::before, .divider-label::after { content: ''; flex: 1; height: 1px; background: var(--i-faint); }

    /* ── SCROLLBAR HIDDEN ── */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── SELECT CARD ── */
    .select-card { background: var(--c-raise); border: 1.5px solid var(--i-faint); border-radius: var(--r-md); padding: 16px; cursor: pointer; transition: all 0.25s var(--ease-luxury); }
    .select-card:hover { border-color: var(--g-border); background: var(--g-dim); }
    .select-card.selected { border-color: var(--g-main); background: var(--g-dim); box-shadow: 0 0 0 3px rgba(108,71,255,0.08); }

    /* ── SECTION DIVIDER ── */
    .section-divider { height: 1px; background: var(--i-faint); margin: 0 auto; }

    /* ── FRESHA CATEGORY TILE ── */
    .cat-tile {
      position: relative; border-radius: 18px; overflow: hidden; cursor: pointer;
      aspect-ratio: 4/3; transition: transform 0.35s var(--ease-luxury);
      box-shadow: 0 4px 20px rgba(0,0,0,0.10);
    }
    .cat-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.16); }
    .cat-tile img { width: 100%; height: 100%; object-fit: cover; }
    .cat-tile-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 60%, transparent 100%); }
    .cat-tile-label { position: absolute; bottom: 14px; left: 16px; color: #FFFFFF; font-weight: 700; font-size: 15px; text-shadow: 0 1px 4px rgba(0,0,0,0.3); }

    /* ── FRESHA CIRCULAR ICON ── */
    .cat-circle {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      cursor: pointer; text-decoration: none; transition: transform 0.25s;
    }
    .cat-circle:hover { transform: translateY(-3px); }
    .cat-circle-icon {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-size: 26px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10); transition: box-shadow 0.25s;
    }
    .cat-circle:hover .cat-circle-icon { box-shadow: 0 6px 20px rgba(0,0,0,0.16); }
    .cat-circle-label { font-size: 11px; font-weight: 600; color: var(--t-secondary); text-align: center; line-height: 1.3; }
  </style>
  ${extra}
`

/* ─────────────────────────────────────────────────────────────
   NAVBAR  — Fresha-style clean white
───────────────────────────────────────────────────────────── */
export const navbar = (active = '') => `
<nav id="nav-main" style="position:fixed;top:0;left:0;right:0;z-index:800;background:rgba(255,255,255,0.97);border-bottom:1px solid var(--i-faint);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:all 0.3s ease;box-shadow:0 1px 12px rgba(0,0,0,0.06);width:100%;max-width:100vw;overflow-x:hidden;">
  <div style="padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;max-width:1440px;margin:0 auto;width:100%;">

    <!-- Logo -->
    <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;">
      <div style="width:36px;height:36px;border-radius:10px;background:var(--g-main);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(108,71,255,0.35);flex-shrink:0;">
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="10" rx="5.5" ry="6" fill="rgba(255,255,255,0.95)"/>
          <path d="M8 26c0-5 3.6-8 8-8s8 3 8 8" fill="rgba(255,255,255,0.95)"/>
          <path d="M10.5 8 Q9 4 13 3 Q16 2 19 3 Q23 4 21.5 8" fill="rgba(255,255,255,0.6)" stroke="none"/>
          <circle cx="23" cy="22" r="6" fill="rgba(255,255,255,0.2)"/>
          <path d="M23 16.5c-2.2 0-4 1.8-4 4 0 3 4 7.5 4 7.5s4-4.5 4-7.5c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="white"/>
        </svg>
      </div>
      <span style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:var(--t-primary);line-height:1;">Salon<span style="color:var(--g-main);">Link</span></span>
    </a>

    <!-- Center links -->
    <div class="hide-mob" style="display:flex;align-items:center;gap:36px;">
      <a href="/discover"          class="nav-item ${active==='discover'?'active':''}">Discover</a>
      <a href="/dashboard"         class="nav-item ${active==='dashboard'?'active':''}">Bookings</a>
      <a href="/notifications"     class="nav-item ${active==='notifications'?'active':''}">Alerts</a>
      <a href="/hairstyle-history" class="nav-item ${active==='history'?'active':''}">History</a>
    </div>

    <!-- Right CTA -->
    <div id="nav-auth" style="display:flex;align-items:center;gap:10px;">
      <a href="/login"    class="btn-ghost"   style="padding:9px 20px;font-size:13px;">Sign In</a>
      <a href="/register" class="btn-primary" style="padding:10px 24px;font-size:13px;">Join Free</a>
    </div>
  </div>
</nav>
<div style="height:64px;"></div>
<script>
(function(){
  var u = (function(){ try{ return JSON.parse(localStorage.getItem('sl_user')||'{}'); }catch(e){ return {}; } })();
  if (u && u.id) {
    var nav = document.getElementById('nav-auth');
    if (nav) {
      var dashLink = u.role === 'provider' ? '/provider/dashboard' : u.role === 'admin' ? '/admin' : '/dashboard';
      nav.innerHTML = '<a href="' + dashLink + '" class="btn-ghost" style="padding:9px 20px;font-size:13px;">' + (u.first_name || u.name || 'Dashboard') + '</a>' +
        '<button onclick="logout()" class="btn-ghost" style="padding:9px 16px;font-size:13px;color:var(--s-red);">Sign Out</button>';
    }
  }
  var n=document.getElementById('nav-main');
  function update(){
    if(window.scrollY>40){
      n.style.boxShadow='0 2px 20px rgba(0,0,0,0.10)';
    } else {
      n.style.boxShadow='0 1px 12px rgba(0,0,0,0.06)';
    }
  }
  window.addEventListener('scroll',update,{passive:true});
  update();
})();
</script>
`

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV  — Fresha floating pill style
───────────────────────────────────────────────────────────── */
export const mobileNav = (active = '') => `
<div class="mobile-nav">
  ${[
    {href:'/',icon:'home',label:'Home',id:'home'},
    {href:'/discover',icon:'search',label:'Explore',id:'discover'},
    {href:'/discover',icon:'plus',label:'Book',id:'book'},
    {href:'/dashboard',icon:'calendar',label:'Activity',id:'dashboard'},
    {href:'/settings',icon:'user',label:'Profile',id:'settings'},
  ].map(l => `
    <a href="${l.href}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;padding:4px 0;color:${active===l.id?'var(--g-main)':'var(--t-muted)'};transition:color 0.2s;position:relative;">
      ${l.id==='book'
        ? `<div style="width:48px;height:48px;background:var(--g-main);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:-20px;box-shadow:0 4px 16px rgba(108,71,255,0.40);transition:transform 0.25s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>`
        : l.icon === 'home'
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="${active===l.id?'var(--g-main)':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
          : l.icon === 'search'
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
            : l.icon === 'calendar'
              ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
              : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      }
      <span style="font-size:9px;font-weight:600;letter-spacing:0.04em;">${l.label}</span>
    </a>
  `).join('')}
</div>
`

/* ─────────────────────────────────────────────────────────────
   SCRIPTS (toast, auth helpers, reveal)
───────────────────────────────────────────────────────────── */
export const globalScripts = () => `
<div class="toast-wrap" id="toast-wrap"></div>

<script>
// ── Toast
function showToast(msg, type='info') {
  var icons = { success:'<i class="fas fa-check"></i>', error:'<i class="fas fa-times"></i>', info:'<i class="fas fa-info"></i>', warning:'!' };
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = '<div class="toast-icon">' + (icons[type]||'✦') + '</div><span style="flex:1;line-height:1.5;color:var(--t-primary);">' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--t-faint);cursor:pointer;font-size:18px;line-height:1;padding:2px;margin-left:4px;">×</button>';
  wrap.appendChild(t);
  setTimeout(function() { t.style.transition='opacity 0.4s,transform 0.4s'; t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(function(){t.remove();}, 400); }, 4000);
}

// ── Auth helpers
function getToken() { return localStorage.getItem('sl_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('sl_user') || '{}'); } catch(e) { return {}; } }
function isLoggedIn(){ return !!getToken(); }
function logout()   { localStorage.removeItem('sl_token'); localStorage.removeItem('sl_user'); window.location.href = '/'; }

// ── Update nav on load
document.addEventListener('DOMContentLoaded', function() {
  var user = getUser(), token = getToken();
  var nav = document.getElementById('nav-auth');
  if (!user.name && (user.first_name || user.last_name)) user.name = ((user.first_name||'') + (user.last_name ? ' '+user.last_name : '')).trim();
  if (token && user && (user.name || user.id) && nav) {
    if (!user.name) user.name = 'User';
    var dashLink = user.role === 'provider' ? '/provider/dashboard' : user.role === 'admin' ? '/admin' : '/dashboard';
    var initLetter = (user.name||'U')[0].toUpperCase();
    var firstName = user.name.split(' ')[0];
    var provLink = user.role==='provider' ? '<a href="/provider/dashboard" class="sidebar-item"><span class="icon"><i class="fas fa-chart-bar"></i></span> Provider Dashboard</a>' : '';
    var adminLink = user.role==='admin' ? '<a href="/admin" class="sidebar-item"><span class="icon"><i class="fas fa-shield-alt"></i></span> Admin Panel</a>' : '';
    nav.innerHTML =
      '<a href="/notifications" class="btn-icon" title="Notifications" style="position:relative;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
        '<span style="position:absolute;top:8px;right:8px;width:7px;height:7px;background:var(--g-main);border-radius:50%;border:2px solid white;"></span>' +
      '</a>' +
      '<div style="position:relative;" id="user-menu-wrap">' +
        '<button onclick="toggleDD()" id="user-menu-btn" style="display:flex;align-items:center;gap:9px;background:var(--g-dim);border:1.5px solid var(--g-border);border-radius:100px;padding:6px 14px 6px 6px;cursor:pointer;transition:all 0.25s;">' +
          '<div style="width:28px;height:28px;border-radius:50%;background:var(--g-main);display:flex;align-items:center;justify-content:center;font-size:13px;color:#FFFFFF;font-weight:700;">' + initLetter + '</div>' +
          '<span style="font-size:13px;font-weight:600;color:var(--t-primary);">' + firstName + '</span>' +
          '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted)" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</button>' +
        '<div id="user-dd" style="display:none;position:absolute;right:0;top:calc(100%+8px);min-width:210px;background:#FFFFFF;border:1px solid var(--i-faint);border-radius:20px;padding:8px;z-index:900;box-shadow:0 16px 48px rgba(0,0,0,0.12);">' +
          provLink + adminLink +
          '<a href="' + dashLink + '" class="sidebar-item"><span class="icon"><i class="far fa-calendar-alt"></i></span> My Bookings</a>' +
          '<a href="/hairstyle-history" class="sidebar-item"><span class="icon"><i class="fas fa-images"></i></span> Style History</a>' +
          '<a href="/settings" class="sidebar-item"><span class="icon"><i class="fas fa-cog"></i></span> Settings</a>' +
          '<div style="height:1px;background:var(--i-faint);margin:6px 0;"></div>' +
          '<button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;"><span class="icon"><i class="fas fa-sign-out-alt"></i></span> Sign Out</button>' +
        '</div>' +
      '</div>';
  }
  document.addEventListener('click', function(e) {
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
    banner.style.cssText = 'position:fixed;bottom:env(safe-area-inset-bottom,0);left:0;right:0;z-index:99998;padding:12px 16px;background:#fff;border-top:1px solid #f0f0f0;box-shadow:0 -4px 20px rgba(0,0,0,0.10);display:flex;align-items:center;gap:12px;';
    banner.innerHTML =
      '<img src="/icon-192.png" style="width:44px;height:44px;border-radius:12px;flex-shrink:0;" alt="SalonLink"/>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:700;margin-bottom:2px;">Add SalonLink to your home screen</div>' +
        '<div style="font-size:11px;color:#888;">' + (isIOS ? 'Tap Share → Add to Home Screen' : 'Tap ⋮ → Add to Home Screen') + '</div>' +
      '</div>' +
      '<button onclick="dismissPwa()" style="flex-shrink:0;background:var(--g-main);color:#fff;border:none;border-radius:100px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">Add</button>' +
      '<button onclick="dismissPwa()" style="flex-shrink:0;background:none;border:none;color:#aaa;font-size:20px;cursor:pointer;padding:4px;">×</button>';
    document.body.appendChild(banner);
  }, 3000);
})();

// ── Service Worker + Push ──
(function() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  var token = localStorage.getItem('sl_token');

  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
    if (!token) return;
    reg.pushManager.getSubscription().then(function(existing) {
      if (existing) { savePushSub(existing, token); return; }
      setTimeout(function() {
        var path = window.location.pathname;
        var isAppPage = path.startsWith('/provider') || path.startsWith('/dashboard') || path.startsWith('/admin');
        if (!isAppPage) return;
        Notification.requestPermission().then(function(perm) {
          if (perm !== 'granted') return;
          fetch('/api/notifications/vapid-public-key').then(function(r){ return r.json(); }).then(function(d) {
            if (!d.key) return;
            var appServerKey = urlBase64ToUint8Array(d.key);
            reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
              .then(function(sub) { savePushSub(sub, token); }).catch(function(){});
          }).catch(function(){});
        });
      }, 5000);
    });
  }).catch(function(){});

  function savePushSub(sub, tok) {
    var key = sub.getKey ? sub.getKey('p256dh') : null;
    var auth = sub.getKey ? sub.getKey('auth') : null;
    if (!key || !auth) return;
    fetch('/api/notifications/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(key))),
        auth: btoa(String.fromCharCode.apply(null, new Uint8Array(auth)))
      })
    }).catch(function(){});
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
    return outputArray;
  }
})();
</script>
`

// Keep backward compat alias
export const toastScript = globalScripts;
