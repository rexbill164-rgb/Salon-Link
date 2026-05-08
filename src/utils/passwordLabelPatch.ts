export function withPasswordLabelPatch(html: string): string {
  const script = `
<script id="password-label-patch-script">
(function(){
  function applyLabels(){
    document.querySelectorAll('*').forEach(function(el){
      if (!el.childNodes || el.childNodes.length !== 1 || el.childNodes[0].nodeType !== 3) return;
      var t = el.textContent || '';
      var next = t
        .replace(/Update Account Security/g, 'Change Password')
        .replace(/Account \/ Security/g, 'Change Password')
        .replace(/Current Access Code/g, 'Current Password')
        .replace(/New Access Code/g, 'New Password')
        .replace(/Confirm New Access Code/g, 'Confirm New Password')
        .replace(/Update Access Code/g, 'Change Password')
        .replace(/New access code must be at least 8 characters/g, 'New password must be at least 8 characters')
        .replace(/New access codes do not match/g, 'New passwords do not match')
        .replace(/Fill all security fields/g, 'Fill all password fields')
        .replace(/Account security updated/g, 'Password changed successfully')
        .replace(/Could not update account security/g, 'Could not change password')
        .replace(/temporary access code/g, 'temporary password');
      if (next !== t) el.textContent = next;
    });
    var btn = document.getElementById('sl-update-code');
    if (btn) btn.textContent = 'Change Password';
    var link = document.getElementById('sl-account-link');
    if (link) link.textContent = 'Change Password';
  }
  document.addEventListener('DOMContentLoaded', function(){ applyLabels(); setTimeout(applyLabels, 500); });
})();
</script>`
  return html.includes('</body>') ? html.replace('</body>', script + '</body>') : html + script
}
