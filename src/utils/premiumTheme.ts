const PREMIUM_THEME_STYLES = `
<style id="premium-mobile-refresh">
  :root {
    --c-void: #FFFFFF;
    --c-deep: #F6F6F4;
    --c-dark: #EFEFEB;
    --c-mid: #E5E3DE;
    --c-surface: #FFFFFF;
    --c-raise: #FAFAF8;
    --c-lift: #F4F2EE;
    --c-mist: #ECE9E3;

    --g-main: #111111;
    --g-deep: #000000;
    --g-light: #363330;
    --g-pale: #F4F1EA;
    --g-dim: rgba(17,17,17,0.055);
    --g-glow: rgba(17,17,17,0.14);
    --g-border: rgba(17,17,17,0.14);
    --g-border-s: rgba(17,17,17,0.30);

    --accent-gold: #BFA05A;
    --accent-gold-soft: rgba(191,160,90,0.14);
    --accent-clay: #9C6D5B;

    --t-primary: #141312;
    --t-secondary: #504D48;
    --t-muted: #7A756C;
    --t-faint: #A9A49B;

    --r-sm: 10px;
    --r-md: 14px;
    --r-lg: 20px;
    --r-xl: 26px;
    --r-2xl: 34px;

    --premium-radius: 24px;
    --premium-radius-sm: 16px;
    --premium-border: rgba(20,19,18,0.10);
    --premium-border-strong: rgba(20,19,18,0.18);
    --premium-shadow-card: 0 18px 48px rgba(17,17,17,0.08), 0 2px 10px rgba(17,17,17,0.04);
    --premium-shadow-hover: 0 24px 70px rgba(17,17,17,0.13), 0 3px 12px rgba(17,17,17,0.05);
    --premium-shadow-float: 0 18px 60px rgba(17,17,17,0.18), 0 2px 12px rgba(17,17,17,0.08);
    --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
  }

  html[data-theme-refresh="premium-mobile-refresh"] {
    background: var(--c-deep);
    scroll-padding-top: 84px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] body {
    background:
      radial-gradient(circle at 12% -18%, rgba(191,160,90,0.13), transparent 30rem),
      linear-gradient(180deg, #FFFFFF 0%, #F8F8F6 34%, #F3F2EF 100%) !important;
    color: var(--t-primary);
    letter-spacing: 0;
  }

  html[data-theme-refresh="premium-mobile-refresh"] body[data-premium-page="login"] {
    background: #080808 !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] h1,
  html[data-theme-refresh="premium-mobile-refresh"] h2,
  html[data-theme-refresh="premium-mobile-refresh"] h3,
  html[data-theme-refresh="premium-mobile-refresh"] .display-hero,
  html[data-theme-refresh="premium-mobile-refresh"] .display-xl,
  html[data-theme-refresh="premium-mobile-refresh"] .display-lg,
  html[data-theme-refresh="premium-mobile-refresh"] .font-display {
    letter-spacing: 0 !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] ::selection {
    background: rgba(191,160,90,0.24);
    color: #111111;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .orb {
    display: none !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] a,
  html[data-theme-refresh="premium-mobile-refresh"] button,
  html[data-theme-refresh="premium-mobile-refresh"] input,
  html[data-theme-refresh="premium-mobile-refresh"] select,
  html[data-theme-refresh="premium-mobile-refresh"] textarea,
  html[data-theme-refresh="premium-mobile-refresh"] .pcard,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider,
  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item,
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip,
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method {
    -webkit-tap-highlight-color: transparent;
  }

  html[data-theme-refresh="premium-mobile-refresh"] a:focus-visible,
  html[data-theme-refresh="premium-mobile-refresh"] button:focus-visible,
  html[data-theme-refresh="premium-mobile-refresh"] input:focus-visible,
  html[data-theme-refresh="premium-mobile-refresh"] select:focus-visible,
  html[data-theme-refresh="premium-mobile-refresh"] textarea:focus-visible,
  html[data-theme-refresh="premium-mobile-refresh"] [tabindex]:focus-visible {
    outline: 3px solid rgba(191,160,90,0.34) !important;
    outline-offset: 3px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .btn-primary,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-btn,
  html[data-theme-refresh="premium-mobile-refresh"] button[style*="background:var(--g-main)"],
  html[data-theme-refresh="premium-mobile-refresh"] a[style*="background:var(--g-main)"],
  html[data-theme-refresh="premium-mobile-refresh"] button[style*="background:#111111"],
  html[data-theme-refresh="premium-mobile-refresh"] a[style*="background:#111111"] {
    background: linear-gradient(135deg, #111111 0%, #27231E 100%) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 999px !important;
    box-shadow: 0 12px 28px rgba(17,17,17,0.18), inset 0 1px 0 rgba(255,255,255,0.10) !important;
    color: #FFFFFF !important;
    min-height: 44px;
    transform: translateZ(0);
  }

  html[data-theme-refresh="premium-mobile-refresh"] .btn-primary:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-btn:hover:not(:disabled),
  html[data-theme-refresh="premium-mobile-refresh"] button[style*="background:var(--g-main)"]:hover,
  html[data-theme-refresh="premium-mobile-refresh"] a[style*="background:var(--g-main)"]:hover {
    box-shadow: 0 18px 42px rgba(17,17,17,0.24), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    transform: translateY(-2px);
  }

  html[data-theme-refresh="premium-mobile-refresh"] .btn-outline,
  html[data-theme-refresh="premium-mobile-refresh"] .btn-ghost,
  html[data-theme-refresh="premium-mobile-refresh"] button[style*="border:1.5px solid var(--g-border)"],
  html[data-theme-refresh="premium-mobile-refresh"] a[style*="border:1.5px solid var(--g-border)"] {
    border-color: var(--premium-border-strong) !important;
    border-radius: 999px !important;
    background: rgba(255,255,255,0.72) !important;
    box-shadow: 0 4px 16px rgba(17,17,17,0.04) !important;
    min-height: 42px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .btn-icon,
  html[data-theme-refresh="premium-mobile-refresh"] .menu-btn,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-menu-btn {
    border-radius: 14px !important;
    border-color: var(--premium-border) !important;
    background: rgba(255,255,255,0.86) !important;
    box-shadow: 0 8px 24px rgba(17,17,17,0.06) !important;
    min-width: 44px;
    min-height: 44px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .is-pressing,
  html[data-theme-refresh="premium-mobile-refresh"] button:active,
  html[data-theme-refresh="premium-mobile-refresh"] .btn-primary:active,
  html[data-theme-refresh="premium-mobile-refresh"] .btn-outline:active,
  html[data-theme-refresh="premium-mobile-refresh"] .btn-ghost:active,
  html[data-theme-refresh="premium-mobile-refresh"] .pcard:active,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh:active,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider:active,
  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item:active,
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip:active,
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day:active,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method:active {
    transform: translateY(1px) scale(0.985) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .card,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider,
  html[data-theme-refresh="premium-mobile-refresh"] .pcard,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh,
  html[data-theme-refresh="premium-mobile-refresh"] .prof-card,
  html[data-theme-refresh="premium-mobile-refresh"] .bk-card,
  html[data-theme-refresh="premium-mobile-refresh"] .bk-section-card,
  html[data-theme-refresh="premium-mobile-refresh"] .summary-sidebar,
  html[data-theme-refresh="premium-mobile-refresh"] .auth-card,
  html[data-theme-refresh="premium-mobile-refresh"] .reset-card,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-card,
  html[data-theme-refresh="premium-mobile-refresh"] .success-card,
  html[data-theme-refresh="premium-mobile-refresh"] .kpi,
  html[data-theme-refresh="premium-mobile-refresh"] .kpi-card,
  html[data-theme-refresh="premium-mobile-refresh"] .stat-card,
  html[data-theme-refresh="premium-mobile-refresh"] .stat-mini,
  html[data-theme-refresh="premium-mobile-refresh"] .table-scroll,
  html[data-theme-refresh="premium-mobile-refresh"] .breakdown,
  html[data-theme-refresh="premium-mobile-refresh"] .filter-panel,
  html[data-theme-refresh="premium-mobile-refresh"] .role-card,
  html[data-theme-refresh="premium-mobile-refresh"] .select-card {
    background: rgba(255,255,255,0.96) !important;
    border-color: var(--premium-border) !important;
    border-radius: var(--premium-radius) !important;
    box-shadow: var(--premium-shadow-card) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .card:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .pcard:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .role-card:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .select-card:hover {
    border-color: var(--premium-border-strong) !important;
    box-shadow: var(--premium-shadow-hover) !important;
    transform: translateY(-3px);
  }

  html[data-theme-refresh="premium-mobile-refresh"] .pcard,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider {
    cursor: pointer;
    overflow: hidden;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .pcard img,
  html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh img,
  html[data-theme-refresh="premium-mobile-refresh"] .card-provider img,
  html[data-theme-refresh="premium-mobile-refresh"] .pcard-img,
  html[data-theme-refresh="premium-mobile-refresh"] .photo-thumb,
  html[data-theme-refresh="premium-mobile-refresh"] .cat-tile {
    border-radius: 20px !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .cat-tile,
  html[data-theme-refresh="premium-mobile-refresh"] .cat-circle-icon {
    box-shadow: var(--premium-shadow-card) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .cat-tile-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.66), rgba(0,0,0,0.16) 62%, transparent) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .input,
  html[data-theme-refresh="premium-mobile-refresh"] input[type="text"],
  html[data-theme-refresh="premium-mobile-refresh"] input[type="email"],
  html[data-theme-refresh="premium-mobile-refresh"] input[type="tel"],
  html[data-theme-refresh="premium-mobile-refresh"] input[type="password"],
  html[data-theme-refresh="premium-mobile-refresh"] input[type="number"],
  html[data-theme-refresh="premium-mobile-refresh"] input[type="search"],
  html[data-theme-refresh="premium-mobile-refresh"] select,
  html[data-theme-refresh="premium-mobile-refresh"] textarea {
    background: #FFFFFF !important;
    border-color: var(--premium-border) !important;
    border-radius: 16px !important;
    color: var(--t-primary) !important;
    min-height: 46px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .input:focus,
  html[data-theme-refresh="premium-mobile-refresh"] input:focus,
  html[data-theme-refresh="premium-mobile-refresh"] select:focus,
  html[data-theme-refresh="premium-mobile-refresh"] textarea:focus {
    border-color: #111111 !important;
    box-shadow: 0 0 0 4px rgba(17,17,17,0.07) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .badge,
  html[data-theme-refresh="premium-mobile-refresh"] [class*="badge-"] {
    border-radius: 999px !important;
    letter-spacing: 0.02em !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .gold-gradient,
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833AB4"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833ab4"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,var(--g-deep),var(--g-main))"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(145deg,#2e2e2e"] {
    background: linear-gradient(135deg, #111111 0%, #2F2A22 55%, #BFA05A 140%) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="-webkit-background-clip:text"],
  html[data-theme-refresh="premium-mobile-refresh"] .gold-gradient {
    -webkit-background-clip: text !important;
    background-clip: text !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="box-shadow:0 3px 10px rgba(225,48,108"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="box-shadow:0 4px 16px rgba(108,71,255"] {
    box-shadow: 0 12px 28px rgba(17,17,17,0.22), 0 0 0 6px rgba(191,160,90,0.10) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="color:#E1306C"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="color:#833AB4"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="color:#c144b2"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="color:#C9A84C"] {
    color: var(--g-main) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="border-bottom:2px solid #E1306C"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="border-left:3px solid var(--g-main)"] {
    border-color: var(--accent-gold) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .auth-bg::after {
    background: linear-gradient(160deg, rgba(0,0,0,0.88) 0%, rgba(16,16,15,0.58) 50%, rgba(0,0,0,0.88) 100%) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .auth-card {
    border: 1px solid rgba(255,255,255,0.78) !important;
    box-shadow: 0 36px 90px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.86) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .tab-pill {
    border-radius: 14px !important;
    min-height: 44px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .tab-pill.active,
  html[data-theme-refresh="premium-mobile-refresh"] .atab.active,
  html[data-theme-refresh="premium-mobile-refresh"] .role-card.selected,
  html[data-theme-refresh="premium-mobile-refresh"] .select-card.selected,
  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item.selected,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method.selected,
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip.selected,
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day.selected {
    background: var(--g-main) !important;
    border-color: var(--g-main) !important;
    color: #FFFFFF !important;
    box-shadow: 0 14px 34px rgba(17,17,17,0.18) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .role-card.selected *:not(i),
  html[data-theme-refresh="premium-mobile-refresh"] .select-card.selected *:not(i),
  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item.selected *:not(i),
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method.selected *:not(i),
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip.selected *:not(i),
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day.selected *:not(i) {
    color: #FFFFFF !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .act-topbar,
  html[data-theme-refresh="premium-mobile-refresh"] .topbar,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-topbar,
  html[data-theme-refresh="premium-mobile-refresh"] #nav-main {
    background: rgba(255,255,255,0.92) !important;
    border-color: var(--premium-border) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    box-shadow: 0 1px 0 rgba(17,17,17,0.04), 0 12px 36px rgba(17,17,17,0.06) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .mobile-nav,
  html[data-theme-refresh="premium-mobile-refresh"] .mob-nav,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-mob-nav {
    left: 50% !important;
    right: auto !important;
    bottom: max(12px, env(safe-area-inset-bottom)) !important;
    transform: translateX(-50%) !important;
    width: min(calc(100% - 24px), 430px) !important;
    background: rgba(255,255,255,0.94) !important;
    border: 1px solid rgba(17,17,17,0.10) !important;
    border-radius: 28px !important;
    box-shadow: var(--premium-shadow-float) !important;
    padding: 9px 8px !important;
    overflow: visible !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .admin-mob-nav-inner {
    width: 100%;
    overflow-x: auto;
    padding: 0 2px !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .mobile-nav a,
  html[data-theme-refresh="premium-mobile-refresh"] .mob-nav-item,
  html[data-theme-refresh="premium-mobile-refresh"] .amob-btn {
    border-radius: 18px !important;
    min-height: 54px;
    justify-content: center;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .mobile-nav a[href="/discover"] div[style*="margin-top:-20px"] {
    background: linear-gradient(135deg, #111111 0%, #2A261F 100%) !important;
    box-shadow: 0 14px 34px rgba(17,17,17,0.26), 0 0 0 6px rgba(191,160,90,0.11) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .pdash,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-layout {
    background: linear-gradient(180deg, #FBFBFA, #F3F2EF) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .sidebar,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-sidebar {
    background: rgba(255,255,255,0.96) !important;
    border-color: var(--premium-border) !important;
    box-shadow: 16px 0 44px rgba(17,17,17,0.06) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .main-wrap,
  html[data-theme-refresh="premium-mobile-refresh"] .admin-main {
    background: transparent !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .sidebar-item {
    border-radius: 15px !important;
    min-height: 42px;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .sidebar-item:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .sidebar-item.active {
    background: rgba(17,17,17,0.06) !important;
    border-color: rgba(17,17,17,0.10) !important;
    color: var(--g-main) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .admin-table,
  html[data-theme-refresh="premium-mobile-refresh"] .table-luxury {
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .admin-table th,
  html[data-theme-refresh="premium-mobile-refresh"] .table-luxury th {
    background: #F8F7F4 !important;
    color: #69645C !important;
    letter-spacing: 0.08em !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .admin-table td,
  html[data-theme-refresh="premium-mobile-refresh"] .table-luxury td {
    background: rgba(255,255,255,0.72);
  }

  html[data-theme-refresh="premium-mobile-refresh"] .admin-table tr:hover td,
  html[data-theme-refresh="premium-mobile-refresh"] .table-luxury tr:hover td {
    background: #FBFAF7 !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .empty-calendar-icon {
    background: linear-gradient(135deg, #FFFFFF, #EFEAE0) !important;
    color: var(--g-main) !important;
    box-shadow: var(--premium-shadow-card) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .bk-stripe,
  html[data-theme-refresh="premium-mobile-refresh"] .progress-fill,
  html[data-theme-refresh="premium-mobile-refresh"] .step-node.active,
  html[data-theme-refresh="premium-mobile-refresh"] input:checked + .toggle-slider {
    background: var(--g-main) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .rating-bar-fill,
  html[data-theme-refresh="premium-mobile-refresh"] .stars,
  html[data-theme-refresh="premium-mobile-refresh"] [id^="star-"] {
    color: #C99D42 !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .modal,
  html[data-theme-refresh="premium-mobile-refresh"] .reset-card {
    border-radius: 28px !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .modal-overlay {
    background: rgba(0,0,0,0.58) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .toast {
    border-radius: 18px !important;
    box-shadow: var(--premium-shadow-float) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833AB4,#E1306C)"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833ab4,#E1306C)"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833ab4,#c144b2)"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="linear-gradient(135deg,#833AB4,#E1306C,#FCAF45)"] {
    background: linear-gradient(135deg, #111111 0%, #2F2A22 100%) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] [style*="rgba(131,58,180"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="rgba(225,48,108"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="rgba(193,68,178"],
  html[data-theme-refresh="premium-mobile-refresh"] [style*="rgba(201,168,76"] {
    border-color: var(--premium-border) !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .security-note,
  html[data-theme-refresh="premium-mobile-refresh"] .form-label,
  html[data-theme-refresh="premium-mobile-refresh"] .eyebrow {
    letter-spacing: 0.06em !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item,
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip,
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method,
  html[data-theme-refresh="premium-mobile-refresh"] .gallery-add-btn,
  html[data-theme-refresh="premium-mobile-refresh"] .appt-row {
    border-radius: 18px !important;
    transition: transform 0.2s var(--ease-premium), border-color 0.2s, box-shadow 0.2s, background 0.2s !important;
  }

  html[data-theme-refresh="premium-mobile-refresh"] .service-select-item:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .time-chip:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .cal-day:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .pay-method:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .gallery-add-btn:hover,
  html[data-theme-refresh="premium-mobile-refresh"] .appt-row:hover {
    border-color: var(--premium-border-strong) !important;
    box-shadow: 0 12px 28px rgba(17,17,17,0.07) !important;
  }

  @media (hover: none) {
    html[data-theme-refresh="premium-mobile-refresh"] .card:hover,
    html[data-theme-refresh="premium-mobile-refresh"] .card-provider:hover,
    html[data-theme-refresh="premium-mobile-refresh"] .pcard:hover,
    html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh:hover,
    html[data-theme-refresh="premium-mobile-refresh"] .role-card:hover,
    html[data-theme-refresh="premium-mobile-refresh"] .select-card:hover {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    html[data-theme-refresh="premium-mobile-refresh"] body {
      padding-bottom: 92px;
    }

    html[data-theme-refresh="premium-mobile-refresh"] body[data-premium-page="login"],
    html[data-theme-refresh="premium-mobile-refresh"] body[data-premium-page="payment"],
    html[data-theme-refresh="premium-mobile-refresh"] body[data-premium-page="payment-success"] {
      padding-bottom: 0;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .container,
    html[data-theme-refresh="premium-mobile-refresh"] .container-sm,
    html[data-theme-refresh="premium-mobile-refresh"] .container-xs {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] h1,
    html[data-theme-refresh="premium-mobile-refresh"] .display-hero {
      font-size: clamp(28px, 10vw, 40px) !important;
      line-height: 1.08 !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] h2,
    html[data-theme-refresh="premium-mobile-refresh"] .display-xl,
    html[data-theme-refresh="premium-mobile-refresh"] .display-lg {
      font-size: clamp(22px, 7vw, 30px) !important;
      line-height: 1.16 !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .auth-wrap {
      padding: 76px 0 28px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .auth-card {
      max-width: calc(100% - 24px) !important;
      padding: 28px 20px !important;
      border-radius: 26px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .register-wrap {
      padding: 28px 14px 118px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .register-card > div[style*="grid-template-columns:1fr 1fr"],
    html[data-theme-refresh="premium-mobile-refresh"] .form-row,
    html[data-theme-refresh="premium-mobile-refresh"] .grid-2 {
      grid-template-columns: 1fr !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .admin-kpi-grid,
    html[data-theme-refresh="premium-mobile-refresh"] .kpi-grid,
    html[data-theme-refresh="premium-mobile-refresh"] .admin-actions-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .card,
    html[data-theme-refresh="premium-mobile-refresh"] .pcard,
    html[data-theme-refresh="premium-mobile-refresh"] .prov-card-fresh,
    html[data-theme-refresh="premium-mobile-refresh"] .bk-card,
    html[data-theme-refresh="premium-mobile-refresh"] .pay-card,
    html[data-theme-refresh="premium-mobile-refresh"] .success-card,
    html[data-theme-refresh="premium-mobile-refresh"] .kpi,
    html[data-theme-refresh="premium-mobile-refresh"] .kpi-card,
    html[data-theme-refresh="premium-mobile-refresh"] .stat-card,
    html[data-theme-refresh="premium-mobile-refresh"] .stat-mini,
    html[data-theme-refresh="premium-mobile-refresh"] .table-scroll {
      border-radius: 22px !important;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .admin-topbar,
    html[data-theme-refresh="premium-mobile-refresh"] .topbar,
    html[data-theme-refresh="premium-mobile-refresh"] .act-topbar {
      min-height: 58px;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .table-scroll {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    html[data-theme-refresh="premium-mobile-refresh"] .modal {
      border-radius: 28px 28px 0 0 !important;
    }
  }
</style>
`

const PREMIUM_THEME_SCRIPT = `
<script id="premium-mobile-refresh-script">
(function () {
  if (window.__salonLinkPremiumTheme) return;
  window.__salonLinkPremiumTheme = true;
  document.documentElement.setAttribute('data-theme-refresh', 'premium-mobile-refresh');

  var selector = 'a,button,[role="button"],.pcard,.prov-card-fresh,.card-provider,.service-select-item,.time-chip,.cal-day,.pay-method,.cat-tile,.cat-circle,.role-card,.select-card,.gallery-add-btn,.appt-row';
  function targetFor(event) {
    return event && event.target && event.target.closest ? event.target.closest(selector) : null;
  }
  function clearPressed() {
    document.querySelectorAll('.is-pressing').forEach(function (el) { el.classList.remove('is-pressing'); });
  }

  document.addEventListener('pointerdown', function (event) {
    var target = targetFor(event);
    if (target) target.classList.add('is-pressing');
  }, { passive: true });

  ['pointerup', 'pointercancel', 'scroll'].forEach(function (name) {
    document.addEventListener(name, clearPressed, { passive: true });
  });
})();
</script>
`

function safePageName(page: string): string {
  const cleaned = page.replace(/[^a-z0-9-]/gi, '').toLowerCase()
  return cleaned || 'app'
}

export function withPremiumTheme(html: string, page = 'app'): string {
  const alreadyThemed = html.includes('id="premium-mobile-refresh"')
  let themed = html
  const bodyMatch = themed.match(/<body\b[^>]*>/i)
  if (bodyMatch && !bodyMatch[0].includes('data-premium-page')) {
    const taggedBody = bodyMatch[0].replace(/<body/i, `<body data-premium-page="${safePageName(page)}"`)
    themed = themed.replace(bodyMatch[0], taggedBody)
  }

  if (alreadyThemed) return themed

  if (/<\/head>/i.test(themed)) {
    themed = themed.replace(/<\/head>/i, (match) => PREMIUM_THEME_STYLES + '\n' + match)
  } else {
    themed = PREMIUM_THEME_STYLES + themed
  }

  if (/<\/body>/i.test(themed)) {
    themed = themed.replace(/<\/body>/i, (match) => PREMIUM_THEME_SCRIPT + '\n' + match)
  } else {
    themed += PREMIUM_THEME_SCRIPT
  }

  return themed
}
