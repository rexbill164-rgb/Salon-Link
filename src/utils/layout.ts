export const baseHead = (title: string, extra = '') => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} | SalonLink</title>
  <meta name="description" content="SalonLink — Ghana's most exclusive beauty booking experience."/>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* Palette — deep obsidian + warm champagne gold */
      --c-void:     #050407;
      --c-deep:     #080609;
      --c-dark:     #0C0A10;
      --c-mid:      #110E16;
      --c-surface:  #16121D;
      --c-raise:    #1C1724;
      --c-lift:     #231E2C;
      --c-mist:     #2C2638;

      /* Gold spectrum */
      --g-pale:     #F5E6C8;
      --g-light:    #E8C97A;
      --g-main:     #C9A84C;
      --g-deep:     #A07830;
      --g-dim:      rgba(201,168,76,0.12);
      --g-glow:     rgba(201,168,76,0.06);
      --g-border:   rgba(201,168,76,0.2);
      --g-border-s: rgba(201,168,76,0.35);

      /* Ivory */
      --i-full:     #F7F2EA;
      --i-soft:     rgba(247,242,234,0.8);
      --i-dim:      rgba(247,242,234,0.5);
      --i-faint:    rgba(247,242,234,0.08);
      --i-ghost:    rgba(247,242,234,0.04);

      /* Text */
      --t-primary:  #EDE8E0;
      --t-secondary:#B0A090;
      --t-muted:    #7A6E62;
      --t-faint:    #4A4240;

      /* Status */
      --s-green:    #3DAA6E;
      --s-red:      #C04848;
      --s-blue:     #4872C0;
      --s-amber:    #C9A84C;

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

    html { scroll-behavior: smooth; font-size: 16px; }

    body {
      font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      background: var(--c-void);
      color: var(--t-primary);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--g-main); border-radius: 2px; }

    /* ── SELECTION ── */
    ::selection { background: var(--g-dim); color: var(--g-light); }

    /* ── TYPOGRAPHY ── */
    .font-display   { font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif; }
    .font-serif     { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-sans      { font-family: 'DM Sans', 'Inter', sans-serif; }

    .display-hero   { font-family: 'Playfair Display', serif; font-size: clamp(52px, 9vw, 108px); font-weight: 400; line-height: 0.95; letter-spacing: -0.02em; }
    .display-xl     { font-family: 'Playfair Display', serif; font-size: clamp(38px, 6vw, 72px); font-weight: 400; line-height: 1.05; letter-spacing: -0.01em; }
    .display-lg     { font-family: 'Playfair Display', serif; font-size: clamp(28px, 4vw, 48px); font-weight: 400; line-height: 1.1; }
    .display-md     { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 32px); font-weight: 400; line-height: 1.2; }
    .display-sm     { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; }
    .eyebrow        { font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--g-main); }

    /* ── GOLD TEXT ── */
    .gold           { color: var(--g-main); }
    .gold-gradient  {
      background: linear-gradient(135deg, var(--g-deep) 0%, var(--g-main) 30%, var(--g-pale) 60%, var(--g-main) 80%, var(--g-deep) 100%);
      background-size: 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gold-shift 5s ease infinite;
    }
    @keyframes gold-shift { 0%,100%{background-position:0%} 50%{background-position:100%} }

    /* ── SURFACES ── */
    .surface        { background: var(--c-surface); border: 1px solid var(--i-faint); }
    .surface-raise  { background: var(--c-raise); border: 1px solid var(--i-faint); }
    .surface-gold   { background: var(--g-dim); border: 1px solid var(--g-border); }

    .glass {
      background: rgba(22,18,29,0.7);
      backdrop-filter: blur(32px) saturate(160%);
      -webkit-backdrop-filter: blur(32px) saturate(160%);
      border: 1px solid var(--i-faint);
    }
    .glass-gold {
      background: rgba(201,168,76,0.05);
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
      background: linear-gradient(135deg, var(--g-glow) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
    }
    .card:hover { border-color: var(--g-border); transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--g-dim); }
    .card:hover::before { opacity: 1; }

    .card-provider {
      background: var(--c-surface);
      border: 1px solid rgba(247,242,234,0.06);
      border-radius: var(--r-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.5s var(--ease-luxury);
      position: relative;
    }
    .card-provider:hover {
      border-color: var(--g-border-s);
      transform: translateY(-8px);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.06), inset 0 1px 0 rgba(201,168,76,0.1);
    }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      background: linear-gradient(135deg, var(--g-deep), var(--g-main), var(--g-light), var(--g-main), var(--g-deep));
      background-size: 300%;
      color: #05040A;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      border: none; border-radius: 100px;
      padding: 15px 36px;
      cursor: pointer;
      transition: background-position 0.6s ease, transform 0.3s var(--ease-luxury), box-shadow 0.4s ease;
      text-decoration: none; white-space: nowrap;
      position: relative; overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    .btn-primary:hover { background-position: right; transform: translateY(-2px); box-shadow: 0 20px 50px rgba(201,168,76,0.3), 0 4px 16px rgba(0,0,0,0.3); }
    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      background: transparent;
      color: var(--g-main);
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      border: 1px solid var(--g-border);
      border-radius: 100px;
      padding: 14px 34px;
      cursor: pointer;
      transition: all 0.35s var(--ease-luxury);
      text-decoration: none; white-space: nowrap;
    }
    .btn-outline:hover { background: var(--g-dim); border-color: var(--g-main); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.15); }

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
    .btn-ghost:hover { background: var(--i-faint); color: var(--t-primary); border-color: rgba(247,242,234,0.15); }

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
      background: var(--c-mid);
      border: 1px solid rgba(247,242,234,0.08);
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
    .input:focus { border-color: var(--g-main); box-shadow: 0 0 0 3px rgba(201,168,76,0.08), 0 4px 20px rgba(0,0,0,0.2); background: var(--c-dark); }
    .input:hover:not(:focus) { border-color: rgba(247,242,234,0.14); }
    select.input option { background: var(--c-surface); }

    /* ── DIVIDERS ── */
    .divider     { height: 1px; background: linear-gradient(90deg, transparent, var(--g-border), transparent); }
    .divider-v   { width: 1px;  background: linear-gradient(180deg, transparent, var(--g-border), transparent); }
    .divider-sub { height: 1px; background: var(--i-faint); }

    /* ── BADGES ── */
    .badge        { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
    .badge-gold   { background: var(--g-dim); color: var(--g-main); border: 1px solid var(--g-border); }
    .badge-verified { background: rgba(61,170,110,0.1); color: #5DC98A; border: 1px solid rgba(61,170,110,0.25); }
    .badge-pending  { background: rgba(201,168,76,0.1); color: var(--g-main); border: 1px solid rgba(201,168,76,0.2); }
    .badge-live     { background: rgba(61,170,110,0.08); color: #5DC98A; border: 1px solid rgba(61,170,110,0.2); }
    .badge-closed   { background: rgba(247,242,234,0.04); color: var(--t-muted); border: 1px solid var(--i-faint); }
    .badge-success  { background: rgba(61,170,110,0.1); color: #5DC98A; border: 1px solid rgba(61,170,110,0.2); }
    .badge-error    { background: rgba(192,72,72,0.1); color: #E07070; border: 1px solid rgba(192,72,72,0.2); }

    /* ── LAYOUT HELPERS ── */
    .container    { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
    .container-sm { max-width: 960px;  margin: 0 auto; padding: 0 32px; }
    .container-xs { max-width: 680px;  margin: 0 auto; padding: 0 24px; }
    @media(max-width:768px) { .container,.container-sm,.container-xs { padding: 0 20px; } }

    /* ── GRID ── */
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
    @media(max-width:1024px){ .grid-3 { grid-template-columns: repeat(2,1fr); } .grid-4 { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:640px) { .grid-3,.grid-4 { grid-template-columns: 1fr; } }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes floatAlt  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
    @keyframes spin-slow { to{transform:rotate(360deg)} }
    @keyframes pulse-ring{ 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.3)} 50%{box-shadow:0 0 0 16px rgba(201,168,76,0)} }
    @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes line-grow { from{width:0} to{width:100%} }
    @keyframes orb-pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.05)} }
    @keyframes shimmer   { 0%{background-position:-200%} 100%{background-position:200%} }
    @keyframes particle  { 0%{transform:translateY(0) translateX(0);opacity:0.6} 100%{transform:translateY(-120px) translateX(var(--dx,20px));opacity:0} }

    .afu   { animation: fadeUp 0.8s var(--ease-luxury) both; }
    .afu-1 { animation: fadeUp 0.8s 0.08s var(--ease-luxury) both; }
    .afu-2 { animation: fadeUp 0.8s 0.16s var(--ease-luxury) both; }
    .afu-3 { animation: fadeUp 0.8s 0.24s var(--ease-luxury) both; }
    .afu-4 { animation: fadeUp 0.8s 0.32s var(--ease-luxury) both; }
    .afu-5 { animation: fadeUp 0.8s 0.40s var(--ease-luxury) both; }
    .float { animation: float 6s ease-in-out infinite; }
    .float-alt { animation: floatAlt 7s ease-in-out infinite; }

    /* ── SCROLL REVEAL ── */
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.9s var(--ease-luxury), transform 0.9s var(--ease-luxury); }
    .reveal.visible { opacity: 1; transform: none; }

    /* ── STARS ── */
    .stars { color: var(--g-main); letter-spacing: 1px; }

    /* ── TAG ── */
    .tag { display: inline-block; background: var(--i-ghost); border: 1px solid var(--i-faint); border-radius: 100px; padding: 4px 12px; font-size: 11px; color: var(--t-secondary); letter-spacing: 0.04em; }

    /* ── FORM ── */
    .form-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--t-secondary); margin-bottom: 10px; }
    .form-group { margin-bottom: 22px; }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; pointer-events: none; }
    .input-icon-right { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--t-faint); font-size: 14px; cursor: pointer; background: none; border: none; }
    .has-icon-left { padding-left: 46px !important; }
    .has-icon-right { padding-right: 46px !important; }

    /* ── MODAL ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(5,4,7,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); z-index: 9000; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; transition: opacity 0.3s; }
    .modal-overlay.open { opacity: 1; }
    .modal { background: var(--c-surface); border: 1px solid var(--g-border); border-radius: var(--r-xl); max-width: 480px; width: 100%; padding: 44px; position: relative; transform: translateY(20px); transition: transform 0.4s var(--ease-luxury); }
    .modal-overlay.open .modal { transform: none; }

    /* ── TOAST ── */
    .toast-wrap { position: fixed; top: 28px; right: 28px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
    .toast {
      padding: 14px 20px 14px 16px; border-radius: 14px; font-size: 13px; font-weight: 500;
      display: flex; align-items: center; gap: 11px; backdrop-filter: blur(20px);
      min-width: 280px; max-width: 380px; pointer-events: auto;
      animation: fadeUp 0.35s var(--ease-luxury) both;
      box-shadow: 0 16px 40px rgba(0,0,0,0.4);
    }
    .toast-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; }
    .toast-success { background: rgba(61,170,110,0.1); border: 1px solid rgba(61,170,110,0.2); color: var(--t-primary); }
    .toast-success .toast-icon { background: rgba(61,170,110,0.2); color: #5DC98A; }
    .toast-error   { background: rgba(192,72,72,0.1); border: 1px solid rgba(192,72,72,0.2); color: var(--t-primary); }
    .toast-error   .toast-icon { background: rgba(192,72,72,0.2); color: #E07070; }
    .toast-info    { background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); color: var(--t-primary); }
    .toast-info    .toast-icon { background: var(--g-dim); color: var(--g-main); }

    /* ── NAV ── */
    .nav-item { color: var(--t-secondary); font-size: 13px; font-weight: 500; letter-spacing: 0.03em; text-decoration: none; transition: color 0.25s; position: relative; padding-bottom: 2px; }
    .nav-item::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--g-main); transition: width 0.35s var(--ease-luxury); }
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
    .sidebar-item.active { background: var(--g-dim); color: var(--g-main); border: 1px solid var(--g-border); }
    .sidebar-item .icon { width: 18px; text-align: center; font-size: 13px; }

    /* ── STEP WIZARD ── */
    .step-node { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.4s var(--ease-luxury); flex-shrink: 0; }
    .step-node.done    { background: var(--s-green); color: white; box-shadow: 0 0 20px rgba(61,170,110,0.3); }
    .step-node.active  { background: var(--g-main); color: var(--c-void); box-shadow: 0 0 24px rgba(201,168,76,0.4); animation: pulse-ring 2s infinite; }
    .step-node.pending { background: var(--c-raise); border: 1px solid var(--i-faint); color: var(--t-faint); }
    .step-line         { flex: 1; height: 1px; background: var(--i-faint); transition: background 0.4s; }
    .step-line.done    { background: var(--g-main); }

    /* ── STAT CARD ── */
    .stat-card { background: var(--c-surface); border: 1px solid var(--i-faint); border-radius: var(--r-lg); padding: 24px; position: relative; overflow: hidden; transition: border-color 0.3s, transform 0.4s var(--ease-luxury); }
    .stat-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, var(--g-glow), transparent); }
    .stat-card:hover { border-color: var(--g-border); transform: translateY(-3px); }

    /* ── MOBILE NAV ── */
    .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(8,6,9,0.96); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid var(--i-faint); z-index: 500; padding: 8px 0 env(safe-area-inset-bottom, 10px); }
    @media(max-width:768px) { .mobile-nav { display: flex; } .hide-mob { display: none !important; } }
    @media(min-width:769px) { .show-mob { display: none !important; } }

    /* ── ORB ── */
    .orb { position: absolute; border-radius: 50%; pointer-events: none; }

    /* ── PROGRESS BAR ── */
    .progress { height: 2px; background: var(--c-lift); border-radius: 1px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, var(--g-deep), var(--g-light)); border-radius: 1px; transition: width 0.6s var(--ease-luxury); }

    /* ── RATING ── */
    .rating-bar-wrap { display: flex; align-items: center; gap: 12px; }
    .rating-bar { flex: 1; height: 4px; background: var(--c-lift); border-radius: 2px; overflow: hidden; }
    .rating-bar-fill { height: 100%; background: linear-gradient(90deg, var(--g-main), var(--g-light)); border-radius: 2px; }

    /* ── BACKGROUND TEXTURES ── */
    .bg-grain {
      background-color: var(--c-void);
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    }
    .bg-grid {
      background-image:
        linear-gradient(rgba(247,242,234,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(247,242,234,0.025) 1px, transparent 1px);
      background-size: 72px 72px;
    }
    .bg-grid-fine {
      background-image:
        linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* ── SELECT CARD ── */
    .select-card { background: var(--c-raise); border: 1px solid var(--i-faint); border-radius: var(--r-md); padding: 20px; cursor: pointer; transition: all 0.3s var(--ease-luxury); }
    .select-card:hover { border-color: var(--g-border); background: var(--g-dim); }
    .select-card.selected { border-color: var(--g-main); background: rgba(201,168,76,0.08); box-shadow: 0 0 0 1px var(--g-border), inset 0 0 20px rgba(201,168,76,0.03); }

    /* ── CURSOR GLOW ── */
    .cursor-glow { pointer-events: none; position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 70%); transform: translate(-50%, -50%); z-index: 0; transition: left 0.12s, top 0.12s; will-change: left, top; }

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
    .table-luxury th { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--t-muted); padding: 14px 20px; border-bottom: 1px solid var(--i-faint); text-align: left; }
    .table-luxury td { padding: 16px 20px; border-bottom: 1px solid rgba(247,242,234,0.04); font-size: 13px; color: var(--t-secondary); transition: background 0.2s; }
    .table-luxury tr:hover td { background: var(--i-ghost); }
    .table-luxury tr:last-child td { border-bottom: none; }

    /* ── MISC ── */
    .divider-label { display: flex; align-items: center; gap: 16px; }
    .divider-label::before, .divider-label::after { content: ''; flex: 1; height: 1px; background: var(--i-faint); }

    /* ── SCROLLBAR HIDDEN ── */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* ── PHOTO GRID ── */
    .photo-thumb { border-radius: 10px; overflow: hidden; aspect-ratio: 1; background: var(--c-raise); cursor: pointer; transition: transform 0.3s var(--ease-luxury); }
    .photo-thumb:hover { transform: scale(1.03); }
  </style>
  ${extra}
`

/* ─────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────── */
export const navbar = (active = '') => `
<nav id="nav-main" style="position:fixed;top:0;left:0;right:0;z-index:800;transition:all 0.4s ease;">
  <div style="padding:0 40px;height:72px;display:flex;align-items:center;justify-content:space-between;max-width:1440px;margin:0 auto;">

    <!-- Logo -->
    <a href="/" style="display:flex;align-items:center;gap:13px;text-decoration:none;flex-shrink:0;">
      <div style="width:38px;height:38px;border:1px solid var(--g-border);border-radius:11px;display:flex;align-items:center;justify-content:center;background:var(--g-dim);transition:all 0.3s;" onmouseover="this.style.boxShadow='0 0 20px rgba(201,168,76,0.3)'" onmouseout="this.style.boxShadow='none'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#C9A84C"/></svg>
      </div>
      <span style="font-family:'Playfair Display',serif;font-size:20px;font-weight:500;letter-spacing:0.1em;color:var(--t-primary);line-height:1;">SALONLINK</span>
    </a>

    <!-- Center links -->
    <div class="hide-mob" style="display:flex;align-items:center;gap:40px;">
      <a href="/discover" class="nav-item ${active==='discover'?'active':''}">Discover</a>
      <a href="/dashboard" class="nav-item ${active==='dashboard'?'active':''}">Bookings</a>
      <a href="/notifications" class="nav-item ${active==='notifications'?'active':''}">Alerts</a>
      <a href="/hairstyle-history" class="nav-item ${active==='history'?'active':''}">History</a>
    </div>

    <!-- Right CTA -->
    <div id="nav-auth" style="display:flex;align-items:center;gap:12px;">
      <a href="/login" class="btn-ghost" style="padding:10px 22px;font-size:11px;">Sign In</a>
      <a href="/register" class="btn-primary" style="padding:11px 26px;font-size:11px;">Join Free</a>
    </div>
  </div>
</nav>
<div style="height:72px;"></div>
<script>
(function(){
  var n=document.getElementById('nav-main');
  function update(){
    if(window.scrollY>60){
      n.style.background='rgba(5,4,7,0.9)';
      n.style.backdropFilter='blur(28px)';
      n.style.webkitBackdropFilter='blur(28px)';
      n.style.borderBottom='1px solid rgba(247,242,234,0.06)';
    } else {
      n.style.background='transparent';
      n.style.backdropFilter='none';
      n.style.webkitBackdropFilter='none';
      n.style.borderBottom='1px solid transparent';
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
    {href:'/book/1',icon:'plus',label:'Book',id:'book'},
    {href:'/dashboard',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',label:'Bookings',id:'dashboard'},
    {href:'/settings',icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',label:'Profile',id:'settings'},
  ].map(l => `
    <a href="${l.href}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;text-decoration:none;padding:6px 0 2px;color:${active===l.id?'var(--g-main)':'var(--t-faint)'};transition:color 0.2s;">
      ${l.id==='book'
        ? `<div style="width:48px;height:48px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:-22px;box-shadow:0 8px 28px rgba(201,168,76,0.4);transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05040A" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>`
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
  var icons = { success:'✓', error:'✕', info:'✦', warning:'◈' };
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = '<div class="toast-icon">' + icons[type] + '</div><span style="flex:1;line-height:1.5;">' + msg + '</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--t-faint);cursor:pointer;font-size:16px;line-height:1;padding:2px;">×</button>';
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition='opacity 0.4s,transform 0.4s'; t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(), 400); }, 4000);
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
    nav.innerHTML = \`
      <a href="/notifications" class="btn-icon" title="Notifications" style="position:relative;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span style="position:absolute;top:9px;right:9px;width:5px;height:5px;background:var(--g-main);border-radius:50%;"></span>
      </a>
      <div style="position:relative;" id="user-menu-wrap">
        <button onclick="document.getElementById('user-dd').classList.toggle('open')" style="display:flex;align-items:center;gap:10px;background:var(--c-surface);border:1px solid var(--i-faint);border-radius:100px;padding:7px 16px 7px 7px;cursor:pointer;transition:border-color 0.3s;" onmouseover="this.style.borderColor='var(--g-border)'" onmouseout="this.style.borderColor='var(--i-faint)'">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;color:var(--g-main);">\${user.name[0].toUpperCase()}</div>
          <span style="font-size:13px;font-weight:500;color:var(--t-primary);">\${user.name.split(' ')[0]}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--t-muted)" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div id="user-dd" style="display:none;position:absolute;right:0;top:calc(100% + 10px);min-width:210px;background:var(--c-surface);border:1px solid var(--g-border);border-radius:20px;padding:8px;z-index:900;box-shadow:0 32px 64px rgba(0,0,0,0.5);">
          \${user.role==='provider'?'<a href="/provider/dashboard" class="sidebar-item"><span class="icon">◈</span> Provider Dashboard</a>':''}
          \${user.role==='admin'?'<a href="/admin" class="sidebar-item"><span class="icon">⬡</span> Admin Panel</a>':''}
          <a href="/dashboard"       class="sidebar-item"><span class="icon">📅</span> My Bookings</a>
          <a href="/hairstyle-history" class="sidebar-item"><span class="icon">✦</span> Style History</a>
          <a href="/settings"        class="sidebar-item"><span class="icon">⚙</span> Settings</a>
          <div style="height:1px;background:var(--i-faint);margin:6px 0;"></div>
          <button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;"><span class="icon">→</span> Sign Out</button>
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

  // Fix toggle to use display
  var ddToggle = document.querySelector('[onclick*="user-dd"]');
  // handled above

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function(el) { ro.observe(el); });
  }
});

// Fix dropdown toggle (avoid classList issue on hidden element)
function toggleDD() {
  var dd = document.getElementById('user-dd');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
</script>
`

// Keep backward compat alias
export const toastScript = globalScripts;
