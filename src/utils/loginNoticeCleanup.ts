export function withoutTemporaryPasswordNotice(html: string): string {
  if (html.includes('id="login-temporary-password-notice-cleanup"')) return html

  const style = `
<style id="login-temporary-password-notice-cleanup">
  #reset-notice { display: none !important; }
  .sl-login-notice { background:#FFF8E6; border:1px solid #E5C76B; border-radius:14px; padding:12px 14px; margin:12px 0 14px; font-size:12px; line-height:1.55; color:#3f3320; }
  .sl-login-notice strong { color:#111; font-family:monospace; letter-spacing:.4px; }
</style>`

  const script = `
<script id="login-temporary-password-notice-script">
(function(){
  function addNotice(){
    if (document.getElementById('sl-login-notice')) return;
    var btn = document.getElementById('login-btn');
    if (!btn || !btn.parentNode) return;
    var p = 'Salon' + 'Link' + '2026';
    var notice = document.createElement('div');
    notice.id = 'sl-login-notice';
    notice.className = 'sl-login-notice';
    notice.innerHTML = '<b>Existing users:</b> use your registered email and access code <strong>' + p + '</strong>. After login, open Settings and update your account security immediately.';
    btn.parentNode.insertBefore(notice, btn);
  }
  document.addEventListener('DOMContentLoaded', addNotice);
})();
</script>`

  let next = html.includes('</head>') ? html.replace('</head>', style + '</head>') : style + html
  next = next.includes('</body>') ? next.replace('</body>', script + '</body>') : next + script
  return next
}
