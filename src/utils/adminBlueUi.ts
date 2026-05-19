export function withAdminBlueUi(html: string): string {
  if (html.includes('admin-blue-ui-style')) return html

  const patch = `
<style id="admin-blue-ui-style">
  .admin-sidebar > div:first-child {
    background:#ffffff !important;
    border-bottom:1px solid #eef2f7 !important;
    padding:18px 16px !important;
  }
  .admin-sidebar > div:first-child > div:first-child {
    width:42px !important;
    height:42px !important;
    border-radius:14px !important;
    background:linear-gradient(135deg,#2563eb,#60a5fa) !important;
    box-shadow:0 10px 24px rgba(37,99,235,.22) !important;
  }
  .admin-sidebar > div:first-child > div:first-child i::before { content:'\\f3cd' !important; }
  .admin-sidebar > div:first-child > span {
    font-family:Inter,Arial,sans-serif !important;
    font-size:20px !important;
    font-weight:900 !important;
    letter-spacing:-.04em !important;
    text-transform:none !important;
    color:#111827 !important;
  }
  .admin-sidebar > div:first-child > span::first-letter { color:#2563eb; }
  .admin-sidebar .sidebar-item {
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
  .admin-sidebar .sidebar-item:hover,
  .admin-sidebar .sidebar-item.active {
    background:#eff6ff !important;
    border-color:#dbeafe !important;
    color:#1d4ed8 !important;
  }
  .admin-sidebar .sidebar-item .icon {
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
  .admin-sidebar .sidebar-item.active .icon {
    background:#2563eb !important;
    color:#ffffff !important;
  }
  .admin-sidebar nav {
    padding:12px 10px !important;
  }
  .admin-sidebar div[style*="rgba(192,72,72"] {
    background:#fff7ed !important;
    border-color:#fed7aa !important;
  }
  .admin-sidebar div[style*="rgba(192,72,72"] > div:first-child {
    background:#eef4ff !important;
    color:#2563eb !important;
  }
  @media(max-width:768px){
    .admin-sidebar { width:260px !important; }
    .admin-sidebar .sidebar-item { font-size:13px !important; }
    .admin-sidebar .sidebar-item .icon { width:36px !important; height:36px !important; min-width:36px !important; }
  }
</style>`

  return html.replace('</head>', patch + '</head>')
}
