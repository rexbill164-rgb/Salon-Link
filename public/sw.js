// SalonLink Service Worker — Push Notifications + Offline Cache
const CACHE_NAME = 'salonlink-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// ── Push Notification Handler ──
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) {}

  const title   = data.title   || 'SalonLink';
  const body    = data.body    || 'You have a new notification';
  const url     = data.url     || '/';
  const icon    = data.icon    || '/icon-192.png';
  const badge   = data.badge   || '/favicon.png';
  const tag     = data.tag     || 'salonlink-notif';

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction || false
    })
  );
});

// ── Notification Click: open the relevant page ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
