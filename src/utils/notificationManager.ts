// SalonLink Notification Manager
// Handles: permission request, SW registration, push subscription, polling fallback

export function withNotificationManager(html: string): string {
  const vapidPublicKey = 'BHZJi6p7qvXyqtO8Hnkbwy82nPfrZlQm9ZdUAqDuaS7vl135S_3XKcLWHXx_EM5EqnQ6gXjep-dSWpJJuRJ4DFI'

  const script = `<script id="sl-notif-mgr">
(function(){
  var VAPID_PUBLIC = '${vapidPublicKey}';
  var _pollTimer = null;
  var _lastNotifId = 0;
  var _badgeCount = 0;

  function token(){ return localStorage.getItem('sl_token') || ''; }
  function isLoggedIn(){ return !!token(); }

  // ── Update badge on all notification bells ──
  function updateBadge(count) {
    _badgeCount = count;
    var bells = document.querySelectorAll('.sl-notif-bell-badge');
    Array.prototype.forEach.call(bells, function(el) {
      el.textContent = count > 0 ? (count > 9 ? '9+' : count) : '';
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    // Update page title
    if (count > 0 && !document.title.startsWith('(')) {
      document.title = '(' + count + ') ' + document.title;
    } else if (count === 0) {
      document.title = document.title.replace(/^\(\d+\+?\)\s/, '');
    }
  }

  // ── Show in-app toast notification ──
  function showNotifToast(title, body, url) {
    var existing = document.getElementById('sl-notif-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'sl-notif-toast';
    toast.style.cssText = 'position:fixed;top:env(safe-area-inset-top,16px);left:50%;transform:translateX(-50%) translateY(-120%);max-width:360px;width:calc(100% - 32px);background:#1a1a2e;color:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;gap:12px;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;border:1px solid rgba(255,255,255,0.1);';
    toast.innerHTML = '<img src="/icon-192.png" style="width:36px;height:36px;border-radius:10px;flex-shrink:0;"/>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:700;margin-bottom:2px;">' + title + '</div>' +
        '<div style="font-size:11px;opacity:0.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + body + '</div>' +
      '</div>' +
      '<div style="font-size:18px;opacity:0.4;flex-shrink:0;">→</div>';
    if (url) toast.onclick = function(){ window.location.href = url; };
    document.body.appendChild(toast);
    // Animate in
    requestAnimationFrame(function(){
      toast.style.transform = 'translateX(-50%) translateY(12px)';
    });
    // Auto-dismiss after 5s
    setTimeout(function(){
      toast.style.transform = 'translateX(-50%) translateY(-120%)';
      setTimeout(function(){ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 5000);
  }

  // ── Show browser notification (requires permission) ──
  function showBrowserNotif(title, body, url) {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try {
      var n = new Notification(title, {
        body: body,
        icon: '/icon-192.png',
        badge: '/favicon.png',
        tag: 'salonlink',
        vibrate: [200, 100, 200]
      });
      if (url) n.onclick = function(){ window.focus(); window.location.href = url; n.close(); };
    } catch(_) {}
  }

  // ── Poll for unread notifications ──
  function pollNotifications() {
    if (!isLoggedIn()) return;
    fetch('/api/notifications/unread', {
      headers: { Authorization: 'Bearer ' + token() }
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      var items = data.items || [];
      var newItems = items.filter(function(n){ return n.id > _lastNotifId; });
      if (items.length > 0) {
        _lastNotifId = Math.max.apply(null, items.map(function(n){ return n.id; }));
      }
      updateBadge(items.length);
      // Show notifications for new items
      newItems.forEach(function(n){
        showNotifToast(n.title, n.body, n.url);
        showBrowserNotif(n.title, n.body, n.url);
      });
    }).catch(function(){});
  }

  // ── Register service worker + subscribe to push ──
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      // Request notification permission
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().then(function(perm) {
          if (perm === 'granted' && isLoggedIn()) subscribeToPush(reg);
        });
      } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && isLoggedIn()) {
        subscribeToPush(reg);
      }
    }).catch(function(){});
  }

  // ── Subscribe to Web Push ──
  function subscribeToPush(reg) {
    if (!reg.pushManager) return;
    reg.pushManager.getSubscription().then(function(existing) {
      if (existing) { saveSub(existing); return; }
      var appKey = urlBase64ToUint8Array(VAPID_PUBLIC);
      return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appKey });
    }).then(function(sub) {
      if (sub) saveSub(sub);
    }).catch(function(){});
  }

  function saveSub(sub) {
    if (!isLoggedIn()) return;
    var j = sub.toJSON();
    fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
      body: JSON.stringify({ endpoint: j.endpoint, keys: j.keys })
    }).catch(function(){});
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(function(c){ return c.charCodeAt(0); }));
  }

  // ── Init ──
  function init() {
    if (!isLoggedIn()) return;
    registerSW();
    // Poll every 15 seconds
    pollNotifications();
    _pollTimer = setInterval(pollNotifications, 15000);
    // Mark as read when tab becomes visible
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden && _badgeCount > 0) {
        fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token() }
        }).then(function(){ updateBadge(0); }).catch(function(){});
      }
    });
  }

  // Start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

  // Expose for manual trigger after login
  window.slInitNotifications = init;
})();
</script>`

  return html.replace('</body>', script + '\n</body>')
}
