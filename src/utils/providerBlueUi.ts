export function withProviderBlueUi(html: string): string {
  if (html.includes('provider-blue-ui-style')) return html

  const patch = `
<style id="provider-blue-ui-style">
  .sidebar > div:first-child {
    background:#ffffff !important;
    border-bottom:1px solid #eef2f7 !important;
    padding:18px 16px !important;
  }
  .sidebar > div:first-child a > div:first-child {
    width:42px !important;
    height:42px !important;
    border-radius:14px !important;
    background:linear-gradient(135deg,#2563eb,#60a5fa) !important;
    box-shadow:0 10px 24px rgba(37,99,235,.22) !important;
  }
  .sidebar > div:first-child a > span {
    font-family:Inter,Arial,sans-serif !important;
    font-size:20px !important;
    font-weight:900 !important;
    letter-spacing:-.04em !important;
    color:#111827 !important;
    background:none !important;
    -webkit-text-fill-color:#111827 !important;
  }
  .sidebar .sidebar-item {
    display:flex !important;
    align-items:center !important;
    gap:12px !important;
    width:100% !important;
    padding:12px 12px !important;
    border-radius:16px !important;
    border:1px solid transparent !important;
    background:transparent !important;
    color:#334155 !important;
    font-size:13px !important;
    font-weight:700 !important;
    line-height:1.2 !important;
    text-align:left !important;
    margin-bottom:6px !important;
    white-space:normal !important;
  }
  .sidebar .sidebar-item:hover,
  .sidebar .sidebar-item.active {
    background:#eff6ff !important;
    border-color:#dbeafe !important;
    color:#1d4ed8 !important;
  }
  .sidebar .sidebar-item .icon {
    width:38px !important;
    height:38px !important;
    min-width:38px !important;
    border-radius:13px !important;
    background:#eef4ff !important;
    color:#2563eb !important;
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    font-size:16px !important;
    box-shadow:none !important;
  }
  .sidebar .sidebar-item.active .icon {
    background:#2563eb !important;
    color:#ffffff !important;
  }
  .sidebar nav { padding:12px 10px !important; }
  #sb-avatar {
    background:#f8fafc !important;
    border:1px solid #dbeafe !important;
    color:#2563eb !important;
    overflow:hidden !important;
  }
  #sb-avatar img { width:100% !important; height:100% !important; object-fit:cover !important; display:block !important; }
  @media(max-width:768px){
    .sidebar { width:260px !important; }
    .sidebar .sidebar-item { font-size:13px !important; }
    .sidebar .sidebar-item .icon { width:36px !important; height:36px !important; min-width:36px !important; }
  }
</style>
<script id="provider-blue-ui-script">
(function(){
  if(location.pathname !== '/provider/dashboard') return;
  function token(){return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''}
  function applyLogo(p){
    var box = document.getElementById('sb-avatar');
    if(!box) return;
    var logo = p && p.logo_url;
    if(logo){ box.innerHTML = '<img src="' + logo + '" alt="Provider logo" />'; }
    else { box.innerHTML = ''; }
  }
  function loadLogo(){
    if(!token()) return;
    fetch('/api/providers/me/dashboard?ts=' + Date.now(), {headers:{Authorization:'Bearer '+token()}, cache:'no-store'})
      .then(function(r){return r.json()})
      .then(function(data){applyLogo(data && data.provider)}).catch(function(){});
  }
  document.addEventListener('DOMContentLoaded', function(){setTimeout(loadLogo, 500); setTimeout(loadLogo, 1800);});
})();
</script>`

  return html.replace('</head>', patch + '</head>')
}
