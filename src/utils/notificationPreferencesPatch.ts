export function withNotificationPreferencesPatch(html: string): string {
  const script = `
<script id="notification-preferences-patch-script">
(function(){
  var labels = [
    'Booking Confirmations',
    'Appointment Reminders',
    'Promotions & Discounts',
    'Re-engagement Nudges',
    'New Provider Alerts'
  ];
  var defaults = [true, true, false, true, false];

  function userKey(){
    try {
      var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
      return 'sl_notification_preferences_' + (user.id || user.email || 'guest');
    } catch(e) { return 'sl_notification_preferences_guest'; }
  }
  function loadPrefs(){
    try {
      var saved = JSON.parse(localStorage.getItem(userKey()) || 'null');
      if (Array.isArray(saved) && saved.length === defaults.length) return saved.map(Boolean);
    } catch(e) {}
    return defaults.slice();
  }
  function savePrefs(values){
    localStorage.setItem(userKey(), JSON.stringify(values.map(Boolean)));
  }
  function applyToggle(i, value){
    var toggle = document.getElementById('toggle-' + i);
    var thumb = document.getElementById('thumb-' + i);
    if (!toggle || !thumb) return;
    toggle.style.background = value ? 'var(--g-main)' : 'var(--c-mist)';
    thumb.style.left = value ? '23px' : '3px';
    toggle.setAttribute('aria-checked', value ? 'true' : 'false');
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('title', labels[i] || 'Notification preference');
  }
  function applyAll(){
    if (location.pathname !== '/settings') return;
    var prefs = loadPrefs();
    window.states = prefs.slice();
    prefs.forEach(function(value, i){ applyToggle(i, value); });
  }

  window.toggleSwitch = function(i){
    var prefs = loadPrefs();
    prefs[i] = !prefs[i];
    savePrefs(prefs);
    window.states = prefs.slice();
    applyToggle(i, prefs[i]);
    if (typeof window.showToast === 'function') {
      window.showToast((labels[i] || 'Preference') + (prefs[i] ? ' enabled' : ' disabled'), prefs[i] ? 'success' : 'info');
    }
  };

  document.addEventListener('DOMContentLoaded', function(){ applyAll(); setTimeout(applyAll, 400); });
})();
</script>`;
  return html.includes('</body>') ? html.replace('</body>', script + '</body>') : html + script;
}
