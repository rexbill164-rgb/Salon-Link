export function withAdminProviderThemeUi(html: string): string {
  const style = `
<style id="admin-provider-fresha-theme-ui">
  :root{
    --sl-page-bg:#fafafa;
    --sl-card-bg:#ffffff;
    --sl-ink:#101010;
    --sl-muted:#666666;
    --sl-soft:#f5f5f5;
    --sl-line:rgba(0,0,0,.08);
    --sl-shadow:0 4px 24px rgba(0,0,0,.06);
    --sl-shadow-hover:0 10px 32px rgba(0,0,0,.10);
  }
  body{background:var(--sl-page-bg)!important;color:var(--sl-ink)!important;}

  /* Shared page surfaces */
  .admin-main,
  .main-wrap,
  .content-pad,
  .pdash{background:var(--sl-page-bg)!important;}
  .admin-topbar,
  .topbar{
    background:rgba(255,255,255,.94)!important;
    border-bottom:1px solid var(--sl-line)!important;
    backdrop-filter:blur(24px)!important;
    box-shadow:0 1px 0 rgba(0,0,0,.02)!important;
    padding-top:max(16px,env(safe-area-inset-top))!important;
  }

  /* Sidebar polish */
  .admin-sidebar,
  .sidebar{
    background:#fff!important;
    border-right:1px solid var(--sl-line)!important;
    box-shadow:8px 0 30px rgba(0,0,0,.035)!important;
  }
  .admin-sidebar > div:first-child,
  .sidebar > div:first-child{
    border-bottom:1px solid var(--sl-line)!important;
  }
  .admin-sidebar span[style*="SALONLINK"],
  .sidebar span[style*="Salon"]{
    color:var(--sl-ink)!important;
    background:none!important;
    -webkit-text-fill-color:var(--sl-ink)!important;
    letter-spacing:-.02em!important;
    font-family:'Poppins',sans-serif!important;
    font-weight:800!important;
  }
  .admin-sidebar [style*="linear-gradient"],
  .sidebar [style*="linear-gradient"]{
    background:#101010!important;
    box-shadow:0 6px 18px rgba(0,0,0,.16)!important;
  }
  .sidebar-item{
    border-radius:14px!important;
    color:#555!important;
    font-weight:600!important;
    transition:background .2s,color .2s,transform .2s!important;
  }
  .sidebar-item:hover{
    background:#f5f5f5!important;
    color:#101010!important;
    transform:translateX(2px)!important;
  }
  .sidebar-item.active{
    background:#101010!important;
    color:#fff!important;
    border-color:#101010!important;
    box-shadow:0 8px 22px rgba(0,0,0,.12)!important;
  }
  .sidebar-item.active .icon{color:#fff!important;}

  /* Cards and KPI blocks */
  .kpi,
  .kpi-card,
  .card,
  .table-scroll,
  .pending-banner,
  .admin-section > div[style*="background:var(--c-surface)"],
  .admin-section > div[style*="background:#fff"],
  .section > div[style*="background:#fff"]{
    background:var(--sl-card-bg)!important;
    border:1px solid var(--sl-line)!important;
    border-radius:24px!important;
    box-shadow:var(--sl-shadow)!important;
  }
  .kpi:hover,
  .kpi-card:hover,
  .card:hover,
  .table-scroll:hover{
    box-shadow:var(--sl-shadow-hover)!important;
    transform:translateY(-1px)!important;
  }
  .kpi::before,
  .kpi-card::after{
    height:0!important;
    display:none!important;
  }
  .kpi-val,
  .font-display.gold-gradient,
  .gold-gradient,
  .gold{
    color:#101010!important;
    background:none!important;
    -webkit-text-fill-color:#101010!important;
  }
  .kpi-lbl,
  .eyebrow{
    color:#777!important;
    letter-spacing:.11em!important;
  }

  /* Buttons */
  .btn-primary,
  button[style*="background:var(--g-main)"],
  button[style*="background:#101010"],
  button[style*="background: #101010"]{
    background:#101010!important;
    color:#fff!important;
    border-radius:999px!important;
    border-color:#101010!important;
    box-shadow:none!important;
  }
  .btn-primary:hover,
  button[style*="background:var(--g-main)"]:hover,
  button[style*="background:#101010"]:hover{
    background:#2a2a2a!important;
  }
  .btn-ghost,
  .btn-outline,
  .btn-icon,
  .menu-btn,
  .admin-menu-btn,
  .gallery-add-btn,
  button[style*="background:var(--c-raise)"],
  button[style*="background:#fff"]{
    background:#fff!important;
    border:1px solid var(--sl-line)!important;
    border-radius:999px!important;
    color:#101010!important;
    box-shadow:none!important;
  }
  .btn-icon,
  .menu-btn,
  .admin-menu-btn{border-radius:14px!important;}

  /* Inputs and tables */
  .input,
  input,
  select,
  textarea{
    border-radius:14px!important;
    border-color:var(--sl-line)!important;
    background:#fff!important;
    color:#101010!important;
  }
  .admin-table th{
    background:#fff!important;
    color:#777!important;
    border-bottom:1px solid var(--sl-line)!important;
  }
  .admin-table td{border-bottom:1px solid var(--sl-line)!important;}
  .admin-table tr:hover td{background:#fafafa!important;}

  /* Provider dashboard quick-action cards */
  .card button[style*="border:1px solid var(--i-faint)"]{
    border-radius:18px!important;
    background:#fff!important;
  }
  .card button[style*="border:1px solid var(--i-faint)"]:hover{
    background:#f5f5f5!important;
    border-color:rgba(0,0,0,.12)!important;
  }

  /* Badges and status */
  .badge,
  .badge-live,
  .badge-gold,
  .badge-pending,
  .badge-verified{
    border-radius:999px!important;
    font-weight:700!important;
  }

  /* Mobile bottom nav */
  .mob-nav,
  .admin-mob-nav{
    background:rgba(255,255,255,.96)!important;
    border:1px solid rgba(255,255,255,.7)!important;
    border-radius:28px!important;
    box-shadow:0 8px 40px rgba(0,0,0,.16)!important;
  }
  .mob-nav-item.active,
  .amob-btn.active{
    background:#101010!important;
    color:#fff!important;
    border-radius:20px!important;
  }

  @media(max-width:768px){
    .content-pad,
    .admin-main > div[style*="padding:32px"]{
      padding:14px!important;
      padding-bottom:110px!important;
    }
    .kpi,
    .kpi-card,
    .card,
    .table-scroll{border-radius:20px!important;}
    .admin-topbar,
    .topbar{padding:12px 14px!important;padding-top:max(12px,env(safe-area-inset-top))!important;}
  }
</style>`
  return html.replace('</head>', style + '</head>')
}
