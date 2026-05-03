const FINAL_PREMIUM_STYLES = `
<style id="salonlink-final-premium-design">
  html[data-salonlink-theme="final-premium-design"] {
    --sl-black: #0A0A09;
    --sl-ink: #151412;
    --sl-charcoal: #25231F;
    --sl-muted: #69645C;
    --sl-soft: #8C867A;
    --sl-hairline: rgba(16, 15, 13, 0.10);
    --sl-hairline-strong: rgba(16, 15, 13, 0.18);
    --sl-white: #FFFFFF;
    --sl-paper: #FBFAF7;
    --sl-canvas: #F5F4F1;
    --sl-wash: #EEEBE5;
    --sl-gold: #B99B55;
    --sl-gold-soft: rgba(185, 155, 85, 0.15);
    --sl-ghana-warm: #A56E55;
    --sl-success: #0C8A4B;
    --sl-warning: #B87500;
    --sl-danger: #C24135;
    --sl-info: #2563EB;

    --sl-radius-xs: 10px;
    --sl-radius-sm: 14px;
    --sl-radius-md: 18px;
    --sl-radius-lg: 24px;
    --sl-radius-xl: 30px;
    --sl-radius-pill: 999px;

    --sl-space-1: 4px;
    --sl-space-2: 8px;
    --sl-space-3: 12px;
    --sl-space-4: 16px;
    --sl-space-5: 20px;
    --sl-space-6: 24px;
    --sl-space-8: 32px;
    --sl-space-10: 40px;

    --sl-shadow-xs: 0 1px 3px rgba(10, 10, 9, 0.06);
    --sl-shadow-sm: 0 8px 22px rgba(10, 10, 9, 0.07);
    --sl-shadow-md: 0 18px 48px rgba(10, 10, 9, 0.10), 0 2px 8px rgba(10, 10, 9, 0.04);
    --sl-shadow-lg: 0 28px 80px rgba(10, 10, 9, 0.16), 0 4px 18px rgba(10, 10, 9, 0.06);
    --sl-shadow-nav: 0 18px 60px rgba(10, 10, 9, 0.22), 0 2px 12px rgba(10, 10, 9, 0.08);

    --sl-ease: cubic-bezier(0.16, 1, 0.3, 1);
    --sl-ease-tap: cubic-bezier(0.2, 0.8, 0.2, 1);

    --c-void: var(--sl-white);
    --c-deep: var(--sl-canvas);
    --c-dark: var(--sl-wash);
    --c-mid: #E5E2DA;
    --c-surface: var(--sl-white);
    --c-raise: var(--sl-paper);
    --c-lift: #F3F1EC;
    --c-mist: #EAE6DE;

    --g-main: var(--sl-black);
    --g-deep: #000000;
    --g-light: var(--sl-charcoal);
    --g-pale: #F4F1EA;
    --g-dim: rgba(10, 10, 9, 0.055);
    --g-glow: rgba(10, 10, 9, 0.12);
    --g-border: var(--sl-hairline-strong);
    --g-border-s: rgba(10, 10, 9, 0.32);

    --ig-purple: var(--sl-black);
    --ig-pink: var(--sl-charcoal);
    --ig-orange: var(--sl-gold);
    --ig-yellow: var(--sl-gold);

    --i-full: var(--sl-ink);
    --i-soft: rgba(21, 20, 18, 0.74);
    --i-dim: rgba(21, 20, 18, 0.46);
    --i-faint: var(--sl-hairline);
    --i-ghost: rgba(21, 20, 18, 0.045);

    --t-primary: var(--sl-ink);
    --t-secondary: #4D4941;
    --t-muted: var(--sl-muted);
    --t-faint: #AAA49A;

    --r-sm: var(--sl-radius-xs);
    --r-md: var(--sl-radius-sm);
    --r-lg: var(--sl-radius-md);
    --r-xl: var(--sl-radius-lg);
    --r-2xl: var(--sl-radius-xl);
    --ease-luxury: var(--sl-ease);
  }

  html[data-salonlink-theme="final-premium-design"],
  html[data-salonlink-theme="final-premium-design"] body {
    min-width: 0;
    overflow-x: hidden;
  }

  html[data-salonlink-theme="final-premium-design"] body {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,249,246,0.98) 38%, rgba(245,244,241,1) 100%),
      var(--sl-canvas) !important;
    color: var(--sl-ink);
    font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 15px;
    letter-spacing: 0;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  html[data-salonlink-theme="final-premium-design"] body[data-sl-page="login"] {
    background: #070706 !important;
  }

  html[data-salonlink-theme="final-premium-design"] *,
  html[data-salonlink-theme="final-premium-design"] *::before,
  html[data-salonlink-theme="final-premium-design"] *::after {
    box-sizing: border-box;
  }

  html[data-salonlink-theme="final-premium-design"] h1,
  html[data-salonlink-theme="final-premium-design"] h2,
  html[data-salonlink-theme="final-premium-design"] h3,
  html[data-salonlink-theme="final-premium-design"] .font-display,
  html[data-salonlink-theme="final-premium-design"] .display-hero,
  html[data-salonlink-theme="final-premium-design"] .display-xl,
  html[data-salonlink-theme="final-premium-design"] .display-lg,
  html[data-salonlink-theme="final-premium-design"] .display-md {
    color: var(--sl-ink) !important;
    letter-spacing: 0 !important;
  }

  html[data-salonlink-theme="final-premium-design"] p,
  html[data-salonlink-theme="final-premium-design"] .text-muted {
    color: var(--t-secondary);
  }

  html[data-salonlink-theme="final-premium-design"] ::selection {
    background: var(--sl-gold-soft);
    color: var(--sl-black);
  }

  html[data-salonlink-theme="final-premium-design"] ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  html[data-salonlink-theme="final-premium-design"] ::-webkit-scrollbar-track {
    background: transparent;
  }

  html[data-salonlink-theme="final-premium-design"] ::-webkit-scrollbar-thumb {
    background: rgba(10, 10, 9, 0.22);
    border-radius: var(--sl-radius-pill);
  }

  html[data-salonlink-theme="final-premium-design"] a,
  html[data-salonlink-theme="final-premium-design"] button,
  html[data-salonlink-theme="final-premium-design"] input,
  html[data-salonlink-theme="final-premium-design"] select,
  html[data-salonlink-theme="final-premium-design"] textarea,
  html[data-salonlink-theme="final-premium-design"] [role="button"] {
    -webkit-tap-highlight-color: transparent;
  }

  html[data-salonlink-theme="final-premium-design"] a:focus-visible,
  html[data-salonlink-theme="final-premium-design"] button:focus-visible,
  html[data-salonlink-theme="final-premium-design"] input:focus-visible,
  html[data-salonlink-theme="final-premium-design"] select:focus-visible,
  html[data-salonlink-theme="final-premium-design"] textarea:focus-visible,
  html[data-salonlink-theme="final-premium-design"] [tabindex]:focus-visible {
    outline: 3px solid rgba(185, 155, 85, 0.36) !important;
    outline-offset: 3px;
  }

  html[data-salonlink-theme="final-premium-design"] .gold-gradient,
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,#833AB4"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,#833ab4"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,var(--g-deep),var(--g-main))"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(145deg,#2e2e2e"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)"] {
    background: linear-gradient(135deg, #0A0A09 0%, #2A261F 62%, #B99B55 145%) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .gold-gradient,
  html[data-salonlink-theme="final-premium-design"] [style*="-webkit-background-clip:text"] {
    -webkit-background-clip: text !important;
    background-clip: text !important;
  }

  html[data-salonlink-theme="final-premium-design"] .orb {
    display: none !important;
  }

  html[data-salonlink-theme="final-premium-design"] .btn-primary,
  html[data-salonlink-theme="final-premium-design"] .pay-btn,
  html[data-salonlink-theme="final-premium-design"] button[type="submit"],
  html[data-salonlink-theme="final-premium-design"] button[style*="background:var(--g-main)"],
  html[data-salonlink-theme="final-premium-design"] a[style*="background:var(--g-main)"],
  html[data-salonlink-theme="final-premium-design"] button[style*="background:#111111"],
  html[data-salonlink-theme="final-premium-design"] a[style*="background:#111111"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,#833AB4,#E1306C)"],
  html[data-salonlink-theme="final-premium-design"] [style*="linear-gradient(135deg,#833ab4,#c144b2)"] {
    background: linear-gradient(135deg, var(--sl-black) 0%, #25221D 100%) !important;
    border: 1px solid rgba(255,255,255,0.10) !important;
    border-radius: var(--sl-radius-pill) !important;
    box-shadow: 0 14px 34px rgba(10,10,9,0.20), inset 0 1px 0 rgba(255,255,255,0.10) !important;
    color: #FFFFFF !important;
    min-height: 44px;
    transition: transform 180ms var(--sl-ease-tap), box-shadow 220ms var(--sl-ease), background 220ms var(--sl-ease), opacity 180ms ease !important;
  }

  html[data-salonlink-theme="final-premium-design"] .btn-primary:hover,
  html[data-salonlink-theme="final-premium-design"] .pay-btn:hover:not(:disabled),
  html[data-salonlink-theme="final-premium-design"] button[type="submit"]:hover,
  html[data-salonlink-theme="final-premium-design"] button[style*="background:var(--g-main)"]:hover,
  html[data-salonlink-theme="final-premium-design"] a[style*="background:var(--g-main)"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 48px rgba(10,10,9,0.25), inset 0 1px 0 rgba(255,255,255,0.12) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .btn-outline,
  html[data-salonlink-theme="final-premium-design"] .btn-ghost,
  html[data-salonlink-theme="final-premium-design"] button[style*="border:1.5px solid var(--g-border)"],
  html[data-salonlink-theme="final-premium-design"] a[style*="border:1.5px solid var(--g-border)"],
  html[data-salonlink-theme="final-premium-design"] button[style*="border:1px solid var(--i-faint)"],
  html[data-salonlink-theme="final-premium-design"] a[style*="border:1px solid var(--i-faint)"] {
    background: rgba(255,255,255,0.86) !important;
    border-color: var(--sl-hairline-strong) !important;
    border-radius: var(--sl-radius-pill) !important;
    color: var(--sl-ink) !important;
    min-height: 42px;
    box-shadow: var(--sl-shadow-xs) !important;
    transition: transform 180ms var(--sl-ease-tap), border-color 180ms ease, box-shadow 220ms var(--sl-ease), background 180ms ease !important;
  }

  html[data-salonlink-theme="final-premium-design"] .btn-outline:hover,
  html[data-salonlink-theme="final-premium-design"] .btn-ghost:hover,
  html[data-salonlink-theme="final-premium-design"] button[style*="border:1.5px solid var(--g-border)"]:hover,
  html[data-salonlink-theme="final-premium-design"] a[style*="border:1.5px solid var(--g-border)"]:hover {
    border-color: rgba(10,10,9,0.28) !important;
    background: #FFFFFF !important;
    box-shadow: var(--sl-shadow-sm) !important;
    transform: translateY(-1px);
  }

  html[data-salonlink-theme="final-premium-design"] .btn-icon,
  html[data-salonlink-theme="final-premium-design"] .menu-btn,
  html[data-salonlink-theme="final-premium-design"] .admin-menu-btn,
  html[data-salonlink-theme="final-premium-design"] button[aria-label="Menu"] {
    width: 44px !important;
    min-width: 44px;
    height: 44px !important;
    min-height: 44px;
    border-radius: var(--sl-radius-sm) !important;
    border: 1px solid var(--sl-hairline) !important;
    background: rgba(255,255,255,0.92) !important;
    color: var(--sl-ink) !important;
    box-shadow: var(--sl-shadow-xs) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .sl-pressing,
  html[data-salonlink-theme="final-premium-design"] button:active,
  html[data-salonlink-theme="final-premium-design"] a:active,
  html[data-salonlink-theme="final-premium-design"] .pcard:active,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh:active,
  html[data-salonlink-theme="final-premium-design"] .card-provider:active,
  html[data-salonlink-theme="final-premium-design"] .service-select-item:active,
  html[data-salonlink-theme="final-premium-design"] .time-chip:active,
  html[data-salonlink-theme="final-premium-design"] .cal-day:active,
  html[data-salonlink-theme="final-premium-design"] .pay-method:active,
  html[data-salonlink-theme="final-premium-design"] .role-card:active,
  html[data-salonlink-theme="final-premium-design"] .select-card:active,
  html[data-salonlink-theme="final-premium-design"] .cat-tile:active,
  html[data-salonlink-theme="final-premium-design"] .cat-circle:active {
    transform: translateY(1px) scale(0.985) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .card,
  html[data-salonlink-theme="final-premium-design"] .card-provider,
  html[data-salonlink-theme="final-premium-design"] .pcard,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh,
  html[data-salonlink-theme="final-premium-design"] .prof-card,
  html[data-salonlink-theme="final-premium-design"] .bk-card,
  html[data-salonlink-theme="final-premium-design"] .bk-section-card,
  html[data-salonlink-theme="final-premium-design"] .summary-sidebar,
  html[data-salonlink-theme="final-premium-design"] .auth-card,
  html[data-salonlink-theme="final-premium-design"] .reset-card,
  html[data-salonlink-theme="final-premium-design"] .register-card form > div,
  html[data-salonlink-theme="final-premium-design"] .pay-card,
  html[data-salonlink-theme="final-premium-design"] .success-card,
  html[data-salonlink-theme="final-premium-design"] .kpi,
  html[data-salonlink-theme="final-premium-design"] .kpi-card,
  html[data-salonlink-theme="final-premium-design"] .stat-card,
  html[data-salonlink-theme="final-premium-design"] .stat-mini,
  html[data-salonlink-theme="final-premium-design"] .table-scroll,
  html[data-salonlink-theme="final-premium-design"] .breakdown,
  html[data-salonlink-theme="final-premium-design"] .filter-panel,
  html[data-salonlink-theme="final-premium-design"] .role-card,
  html[data-salonlink-theme="final-premium-design"] .select-card,
  html[data-salonlink-theme="final-premium-design"] .modal {
    background: rgba(255,255,255,0.96) !important;
    border: 1px solid var(--sl-hairline) !important;
    border-radius: var(--sl-radius-lg) !important;
    box-shadow: var(--sl-shadow-md) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .card:hover,
  html[data-salonlink-theme="final-premium-design"] .card-provider:hover,
  html[data-salonlink-theme="final-premium-design"] .pcard:hover,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh:hover,
  html[data-salonlink-theme="final-premium-design"] .role-card:hover,
  html[data-salonlink-theme="final-premium-design"] .select-card:hover,
  html[data-salonlink-theme="final-premium-design"] .service-select-item:hover,
  html[data-salonlink-theme="final-premium-design"] .pay-method:hover {
    border-color: var(--sl-hairline-strong) !important;
    box-shadow: var(--sl-shadow-lg) !important;
    transform: translateY(-3px);
  }

  html[data-salonlink-theme="final-premium-design"] .pcard,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh,
  html[data-salonlink-theme="final-premium-design"] .card-provider {
    cursor: pointer;
    overflow: hidden;
    isolation: isolate;
  }

  html[data-salonlink-theme="final-premium-design"] .pcard::after,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh::after,
  html[data-salonlink-theme="final-premium-design"] .card-provider::after {
    content: '';
    position: absolute;
    inset: auto 18px 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(185,155,85,0.55), transparent);
    opacity: 0;
    transition: opacity 220ms var(--sl-ease);
  }

  html[data-salonlink-theme="final-premium-design"] .pcard:hover::after,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh:hover::after,
  html[data-salonlink-theme="final-premium-design"] .card-provider:hover::after {
    opacity: 1;
  }

  html[data-salonlink-theme="final-premium-design"] .pcard img,
  html[data-salonlink-theme="final-premium-design"] .prov-card-fresh img,
  html[data-salonlink-theme="final-premium-design"] .card-provider img,
  html[data-salonlink-theme="final-premium-design"] .pcard-img,
  html[data-salonlink-theme="final-premium-design"] .photo-thumb,
  html[data-salonlink-theme="final-premium-design"] .cat-tile {
    border-radius: var(--sl-radius-md) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .cat-tile,
  html[data-salonlink-theme="final-premium-design"] .cat-circle-icon {
    box-shadow: var(--sl-shadow-md) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .cat-tile-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.18) 60%, transparent) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .input,
  html[data-salonlink-theme="final-premium-design"] input[type="text"],
  html[data-salonlink-theme="final-premium-design"] input[type="email"],
  html[data-salonlink-theme="final-premium-design"] input[type="tel"],
  html[data-salonlink-theme="final-premium-design"] input[type="password"],
  html[data-salonlink-theme="final-premium-design"] input[type="number"],
  html[data-salonlink-theme="final-premium-design"] input[type="search"],
  html[data-salonlink-theme="final-premium-design"] select,
  html[data-salonlink-theme="final-premium-design"] textarea {
    background: rgba(255,255,255,0.96) !important;
    border: 1.5px solid var(--sl-hairline) !important;
    border-radius: var(--sl-radius-md) !important;
    color: var(--sl-ink) !important;
    min-height: 46px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.82) !important;
    transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease !important;
  }

  html[data-salonlink-theme="final-premium-design"] .input:focus,
  html[data-salonlink-theme="final-premium-design"] input:focus,
  html[data-salonlink-theme="final-premium-design"] select:focus,
  html[data-salonlink-theme="final-premium-design"] textarea:focus {
    background: #FFFFFF !important;
    border-color: rgba(10,10,9,0.58) !important;
    box-shadow: 0 0 0 4px rgba(10,10,9,0.07) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .form-label,
  html[data-salonlink-theme="final-premium-design"] .eyebrow,
  html[data-salonlink-theme="final-premium-design"] .security-note,
  html[data-salonlink-theme="final-premium-design"] .kpi-lbl,
  html[data-salonlink-theme="final-premium-design"] .stat-mini-lbl {
    color: var(--sl-muted) !important;
    letter-spacing: 0.07em !important;
  }

  html[data-salonlink-theme="final-premium-design"] .badge,
  html[data-salonlink-theme="final-premium-design"] [class*="badge-"] {
    border-radius: var(--sl-radius-pill) !important;
    border-color: var(--sl-hairline) !important;
    letter-spacing: 0.02em !important;
  }

  html[data-salonlink-theme="final-premium-design"] .badge-gold,
  html[data-salonlink-theme="final-premium-design"] .badge-pending {
    background: var(--sl-gold-soft) !important;
    color: #6F5317 !important;
  }

  html[data-salonlink-theme="final-premium-design"] .badge-live,
  html[data-salonlink-theme="final-premium-design"] .badge-verified,
  html[data-salonlink-theme="final-premium-design"] .badge-success {
    background: rgba(12,138,75,0.10) !important;
    color: var(--sl-success) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .badge-error {
    background: rgba(194,65,53,0.10) !important;
    color: var(--sl-danger) !important;
  }

  html[data-salonlink-theme="final-premium-design"] #nav-main,
  html[data-salonlink-theme="final-premium-design"] .act-topbar,
  html[data-salonlink-theme="final-premium-design"] .topbar,
  html[data-salonlink-theme="final-premium-design"] .admin-topbar {
    background: rgba(255,255,255,0.92) !important;
    border-color: var(--sl-hairline) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    box-shadow: 0 1px 0 rgba(10,10,9,0.05), 0 14px 34px rgba(10,10,9,0.06) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .mobile-nav,
  html[data-salonlink-theme="final-premium-design"] .mob-nav,
  html[data-salonlink-theme="final-premium-design"] .admin-mob-nav {
    left: 50% !important;
    right: auto !important;
    bottom: max(12px, env(safe-area-inset-bottom)) !important;
    transform: translateX(-50%) !important;
    width: min(calc(100% - 24px), 430px) !important;
    max-width: 430px !important;
    background: rgba(255,255,255,0.94) !important;
    border: 1px solid rgba(10,10,9,0.10) !important;
    border-radius: 28px !important;
    box-shadow: var(--sl-shadow-nav) !important;
    padding: 9px 8px !important;
    overflow: visible !important;
  }

  html[data-salonlink-theme="final-premium-design"] .mobile-nav a,
  html[data-salonlink-theme="final-premium-design"] .mob-nav-item,
  html[data-salonlink-theme="final-premium-design"] .amob-btn {
    border-radius: var(--sl-radius-md) !important;
    min-height: 54px;
    justify-content: center;
    transition: background 180ms ease, color 180ms ease, transform 180ms var(--sl-ease-tap) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .mobile-nav a:hover,
  html[data-salonlink-theme="final-premium-design"] .mob-nav-item:hover,
  html[data-salonlink-theme="final-premium-design"] .amob-btn:hover {
    background: rgba(10,10,9,0.055) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .mobile-nav a[href="/discover"] div[style*="margin-top:-20px"] {
    background: linear-gradient(135deg, var(--sl-black) 0%, #2A261F 100%) !important;
    box-shadow: 0 14px 34px rgba(10,10,9,0.28), 0 0 0 6px rgba(185,155,85,0.12) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .pdash,
  html[data-salonlink-theme="final-premium-design"] .admin-layout,
  html[data-salonlink-theme="final-premium-design"] .admin-main,
  html[data-salonlink-theme="final-premium-design"] .main-wrap {
    background: linear-gradient(180deg, #FBFAF7 0%, #F3F2EF 100%) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .sidebar,
  html[data-salonlink-theme="final-premium-design"] .admin-sidebar {
    background: rgba(255,255,255,0.96) !important;
    border-color: var(--sl-hairline) !important;
    box-shadow: 16px 0 44px rgba(10,10,9,0.06) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .sidebar-item {
    border-radius: var(--sl-radius-sm) !important;
    min-height: 42px;
    color: var(--sl-muted) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .sidebar-item:hover,
  html[data-salonlink-theme="final-premium-design"] .sidebar-item.active {
    background: rgba(10,10,9,0.06) !important;
    color: var(--sl-black) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .admin-table,
  html[data-salonlink-theme="final-premium-design"] .table-luxury {
    width: 100%;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    background: #FFFFFF !important;
  }

  html[data-salonlink-theme="final-premium-design"] .admin-table th,
  html[data-salonlink-theme="final-premium-design"] .table-luxury th {
    background: #F7F5F1 !important;
    color: var(--sl-muted) !important;
    font-size: 10px !important;
    letter-spacing: 0.08em !important;
  }

  html[data-salonlink-theme="final-premium-design"] .admin-table td,
  html[data-salonlink-theme="final-premium-design"] .table-luxury td {
    background: rgba(255,255,255,0.88);
    color: var(--t-secondary) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .admin-table tr:hover td,
  html[data-salonlink-theme="final-premium-design"] .table-luxury tr:hover td {
    background: #FBFAF7 !important;
  }

  html[data-salonlink-theme="final-premium-design"] .service-select-item,
  html[data-salonlink-theme="final-premium-design"] .time-chip,
  html[data-salonlink-theme="final-premium-design"] .cal-day,
  html[data-salonlink-theme="final-premium-design"] .pay-method,
  html[data-salonlink-theme="final-premium-design"] .gallery-add-btn,
  html[data-salonlink-theme="final-premium-design"] .appt-row,
  html[data-salonlink-theme="final-premium-design"] .atab {
    border-radius: var(--sl-radius-md) !important;
    transition: transform 180ms var(--sl-ease-tap), border-color 180ms ease, box-shadow 220ms var(--sl-ease), background 180ms ease !important;
  }

  html[data-salonlink-theme="final-premium-design"] .tab-pill.active,
  html[data-salonlink-theme="final-premium-design"] .atab.active,
  html[data-salonlink-theme="final-premium-design"] .role-card.selected,
  html[data-salonlink-theme="final-premium-design"] .select-card.selected,
  html[data-salonlink-theme="final-premium-design"] .service-select-item.selected,
  html[data-salonlink-theme="final-premium-design"] .pay-method.selected,
  html[data-salonlink-theme="final-premium-design"] .time-chip.selected,
  html[data-salonlink-theme="final-premium-design"] .cal-day.selected {
    background: var(--sl-black) !important;
    border-color: var(--sl-black) !important;
    color: #FFFFFF !important;
    box-shadow: 0 14px 34px rgba(10,10,9,0.20) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .role-card.selected *,
  html[data-salonlink-theme="final-premium-design"] .select-card.selected *,
  html[data-salonlink-theme="final-premium-design"] .service-select-item.selected *,
  html[data-salonlink-theme="final-premium-design"] .pay-method.selected *,
  html[data-salonlink-theme="final-premium-design"] .time-chip.selected *,
  html[data-salonlink-theme="final-premium-design"] .cal-day.selected * {
    color: #FFFFFF !important;
  }

  html[data-salonlink-theme="final-premium-design"] .progress-fill,
  html[data-salonlink-theme="final-premium-design"] .step-node.active,
  html[data-salonlink-theme="final-premium-design"] input:checked + .toggle-slider,
  html[data-salonlink-theme="final-premium-design"] .bk-stripe {
    background: var(--sl-black) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .rating-bar-fill,
  html[data-salonlink-theme="final-premium-design"] .stars,
  html[data-salonlink-theme="final-premium-design"] [id^="star-"] {
    color: #C99D42 !important;
  }

  html[data-salonlink-theme="final-premium-design"] .empty-calendar-icon {
    background: linear-gradient(135deg, #FFFFFF, #EEE8DC) !important;
    color: var(--sl-black) !important;
    box-shadow: var(--sl-shadow-md) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .auth-bg::after {
    background: linear-gradient(160deg, rgba(0,0,0,0.88) 0%, rgba(15,14,13,0.58) 50%, rgba(0,0,0,0.88) 100%) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .auth-card {
    border: 1px solid rgba(255,255,255,0.74) !important;
    box-shadow: 0 34px 92px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.84) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .tab-pill {
    border-radius: var(--sl-radius-sm) !important;
    min-height: 44px;
  }

  html[data-salonlink-theme="final-premium-design"] .modal-overlay {
    background: rgba(0,0,0,0.58) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }

  html[data-salonlink-theme="final-premium-design"] .toast {
    border-radius: var(--sl-radius-md) !important;
    box-shadow: var(--sl-shadow-nav) !important;
  }

  html[data-salonlink-theme="final-premium-design"] [style*="box-shadow:0 4px 16px rgba(108,71,255"],
  html[data-salonlink-theme="final-premium-design"] [style*="box-shadow:0 3px 10px rgba(225,48,108"],
  html[data-salonlink-theme="final-premium-design"] [style*="box-shadow:0 3px 10px rgba(160,120,48"] {
    box-shadow: 0 14px 34px rgba(10,10,9,0.24), 0 0 0 6px rgba(185,155,85,0.12) !important;
  }

  html[data-salonlink-theme="final-premium-design"] [style*="color:#E1306C"],
  html[data-salonlink-theme="final-premium-design"] [style*="color:#833AB4"],
  html[data-salonlink-theme="final-premium-design"] [style*="color:#c144b2"],
  html[data-salonlink-theme="final-premium-design"] [style*="color:#C9A84C"] {
    color: var(--sl-black) !important;
  }

  html[data-salonlink-theme="final-premium-design"] [style*="border-bottom:2px solid #E1306C"],
  html[data-salonlink-theme="final-premium-design"] [style*="border-left:3px solid var(--g-main)"] {
    border-color: var(--sl-gold) !important;
  }

  html[data-salonlink-theme="final-premium-design"] [style*="rgba(131,58,180"],
  html[data-salonlink-theme="final-premium-design"] [style*="rgba(225,48,108"],
  html[data-salonlink-theme="final-premium-design"] [style*="rgba(193,68,178"] {
    border-color: var(--sl-hairline) !important;
  }

  @media (hover: none) {
    html[data-salonlink-theme="final-premium-design"] .card:hover,
    html[data-salonlink-theme="final-premium-design"] .card-provider:hover,
    html[data-salonlink-theme="final-premium-design"] .pcard:hover,
    html[data-salonlink-theme="final-premium-design"] .prov-card-fresh:hover,
    html[data-salonlink-theme="final-premium-design"] .role-card:hover,
    html[data-salonlink-theme="final-premium-design"] .select-card:hover {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html[data-salonlink-theme="final-premium-design"] *,
    html[data-salonlink-theme="final-premium-design"] *::before,
    html[data-salonlink-theme="final-premium-design"] *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }

  @media (max-width: 768px) {
    html[data-salonlink-theme="final-premium-design"] body {
      padding-bottom: 92px;
    }

    html[data-salonlink-theme="final-premium-design"] body[data-sl-page="login"],
    html[data-salonlink-theme="final-premium-design"] body[data-sl-page="payment"],
    html[data-salonlink-theme="final-premium-design"] body[data-sl-page="payment-success"] {
      padding-bottom: 0;
    }

    html[data-salonlink-theme="final-premium-design"] .container,
    html[data-salonlink-theme="final-premium-design"] .container-sm,
    html[data-salonlink-theme="final-premium-design"] .container-xs {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    html[data-salonlink-theme="final-premium-design"] h1,
    html[data-salonlink-theme="final-premium-design"] .display-hero {
      font-size: clamp(28px, 10vw, 40px) !important;
      line-height: 1.08 !important;
    }

    html[data-salonlink-theme="final-premium-design"] h2,
    html[data-salonlink-theme="final-premium-design"] .display-xl,
    html[data-salonlink-theme="final-premium-design"] .display-lg {
      font-size: clamp(22px, 7vw, 30px) !important;
      line-height: 1.16 !important;
    }

    html[data-salonlink-theme="final-premium-design"] .auth-wrap {
      padding: 76px 0 28px !important;
    }

    html[data-salonlink-theme="final-premium-design"] .auth-card {
      width: calc(100% - 24px) !important;
      max-width: 440px !important;
      padding: 28px 20px !important;
      border-radius: 26px !important;
    }

    html[data-salonlink-theme="final-premium-design"] .register-wrap {
      padding: 28px 14px 118px !important;
    }

    html[data-salonlink-theme="final-premium-design"] .form-row,
    html[data-salonlink-theme="final-premium-design"] .grid-2 {
      grid-template-columns: 1fr !important;
    }

    html[data-salonlink-theme="final-premium-design"] .admin-kpi-grid,
    html[data-salonlink-theme="final-premium-design"] .kpi-grid,
    html[data-salonlink-theme="final-premium-design"] .admin-actions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }

    html[data-salonlink-theme="final-premium-design"] .card,
    html[data-salonlink-theme="final-premium-design"] .pcard,
    html[data-salonlink-theme="final-premium-design"] .prov-card-fresh,
    html[data-salonlink-theme="final-premium-design"] .bk-card,
    html[data-salonlink-theme="final-premium-design"] .pay-card,
    html[data-salonlink-theme="final-premium-design"] .success-card,
    html[data-salonlink-theme="final-premium-design"] .kpi,
    html[data-salonlink-theme="final-premium-design"] .kpi-card,
    html[data-salonlink-theme="final-premium-design"] .stat-card,
    html[data-salonlink-theme="final-premium-design"] .stat-mini,
    html[data-salonlink-theme="final-premium-design"] .table-scroll {
      border-radius: 22px !important;
    }

    html[data-salonlink-theme="final-premium-design"] .admin-topbar,
    html[data-salonlink-theme="final-premium-design"] .topbar,
    html[data-salonlink-theme="final-premium-design"] .act-topbar {
      min-height: 58px;
    }

    html[data-salonlink-theme="final-premium-design"] .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    html[data-salonlink-theme="final-premium-design"] .modal {
      border-radius: 28px 28px 0 0 !important;
    }
  }
</style>
`

const FINAL_PREMIUM_SCRIPT = `
<script id="salonlink-final-premium-design-script">
(function () {
  if (window.__salonLinkFinalPremiumDesign) return;
  window.__salonLinkFinalPremiumDesign = true;
  document.documentElement.setAttribute('data-salonlink-theme', 'final-premium-design');

  var pressable = 'a,button,[role="button"],.pcard,.prov-card-fresh,.card-provider,.service-select-item,.time-chip,.cal-day,.pay-method,.cat-tile,.cat-circle,.role-card,.select-card,.gallery-add-btn,.appt-row,.sidebar-item';
  function closestPressable(event) {
    return event && event.target && event.target.closest ? event.target.closest(pressable) : null;
  }
  function clearPressing() {
    document.querySelectorAll('.sl-pressing').forEach(function (node) {
      node.classList.remove('sl-pressing');
    });
  }

  document.addEventListener('pointerdown', function (event) {
    var target = closestPressable(event);
    if (target) target.classList.add('sl-pressing');
  }, { passive: true });

  ['pointerup', 'pointercancel', 'pointerleave', 'scroll'].forEach(function (eventName) {
    document.addEventListener(eventName, clearPressing, { passive: true });
  });
})();
</script>
`

function safePageName(page: string): string {
  const cleaned = page.replace(/[^a-z0-9-]/gi, '').toLowerCase()
  return cleaned || 'app'
}

function tagHtml(html: string): string {
  const htmlMatch = html.match(/<html\b[^>]*>/i)
  if (!htmlMatch || htmlMatch[0].includes('data-salonlink-theme')) return html
  return html.replace(htmlMatch[0], htmlMatch[0].replace(/<html/i, '<html data-salonlink-theme="final-premium-design"'))
}

function tagBody(html: string, page: string): string {
  const bodyMatch = html.match(/<body\b[^>]*>/i)
  if (!bodyMatch || bodyMatch[0].includes('data-sl-page')) return html
  return html.replace(bodyMatch[0], bodyMatch[0].replace(/<body/i, `<body data-sl-page="${safePageName(page)}"`))
}

export function withFinalPremiumDesign(html: string, page = 'app'): string {
  let themed = tagBody(tagHtml(html), page)

  if (!themed.includes('id="salonlink-final-premium-design"')) {
    if (/<\/head>/i.test(themed)) {
      themed = themed.replace(/<\/head>/i, (match) => FINAL_PREMIUM_STYLES + '\n' + match)
    } else {
      themed = FINAL_PREMIUM_STYLES + themed
    }
  }

  if (!themed.includes('id="salonlink-final-premium-design-script"')) {
    if (/<\/body>/i.test(themed)) {
      themed = themed.replace(/<\/body>/i, (match) => FINAL_PREMIUM_SCRIPT + '\n' + match)
    } else {
      themed += FINAL_PREMIUM_SCRIPT
    }
  }

  return themed
}
