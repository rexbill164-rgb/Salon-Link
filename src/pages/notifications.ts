import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const notificationsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Notifications')}</head>
<body style="background:var(--c-deep);">
${navbar('notifications')}

<div style="padding:48px 0 120px;">
  <div class="container-sm">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:48px;" class="afu">
      <div>
        <div class="eyebrow" style="margin-bottom:16px;">Updates</div>
        <h1 class="display-lg font-display">Your <em class="gold-gradient">Alerts</em></h1>
      </div>
      <button onclick="markAllRead()" class="btn-ghost" style="font-size:12px;padding:10px 22px;">Mark All Read</button>
    </div>

    <div id="notif-list" style="display:flex;flex-direction:column;gap:3px;">
      <div style="text-align:center;padding:40px;color:var(--t-muted);">Loading...</div>
    </div>

  </div>
</div>

${mobileNav('notifications')}
${globalScripts()}
<script>
var typeIcons = {
  booking:'<i class="far fa-calendar-check"></i>',
  payment:'<i class="fas fa-coins"></i>',
  review:'<i class="fas fa-star"></i>',
  system:'<i class="fas fa-bell"></i>',
  info:'<i class="fas fa-info-circle"></i>'
};

function timeAgo(d) {
  var diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff/60) + ' min ago';
  if (diff < 86400) return Math.floor(diff/3600) + ' hr ago';
  return Math.floor(diff/86400) + ' days ago';
}

function renderNotifs(list) {
  var el = document.getElementById('notif-list');
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:60px;color:var(--t-muted);">No notifications yet ✦</div>'; return; }
  el.innerHTML = list.map(function(n) {
    var unread = !n.is_read;
    var icon = typeIcons[n.type] || '🔔';
    return '<div data-id="' + n.id + '" onclick="markReadBtn(this)" class="notif-item' + (unread?' notif-unread':'') + '">' +
      '<div style="width:46px;height:46px;border-radius:14px;background:' + (unread?'var(--g-dim)':'var(--c-surface)') + ';border:1px solid ' + (unread?'var(--g-border)':'var(--i-faint)') + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + icon + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:5px;">' +
          '<div style="font-size:14px;font-weight:' + (unread?'700':'500') + ';display:flex;align-items:center;gap:8px;">' + n.title + (unread?'<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g-main);flex-shrink:0;"></span>':'') + '</div>' +
          '<span style="font-size:11px;color:var(--t-faint);white-space:nowrap;">' + timeAgo(n.created_at) + '</span>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--t-secondary);line-height:1.7;font-weight:300;">' + n.message + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}

function markRead(el, id) {
  el.style.background = 'transparent';
  el.style.borderColor = 'transparent';
  var dot = el.querySelector('[style*="border-radius:50%"]');
  if (dot) dot.remove();
  var token = localStorage.getItem('sl_token');
  if (token) axios.patch('/api/notifications/' + id + '/read', {}, { headers: { Authorization: 'Bearer ' + token } }).catch(function(){});
}

function markAllRead() {
  var token = localStorage.getItem('sl_token');
  if (!token) return;
  axios.patch('/api/notifications/read-all', {}, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('All marked as read ✦', 'success'); loadNotifs(); })
    .catch(function() { showToast('Could not update', 'error'); });
}

function loadNotifs() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }
  axios.get('/api/notifications', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) { renderNotifs(r.data.notifications || []); })
    .catch(function() { showToast('Could not load notifications', 'error'); });
}

document.addEventListener('DOMContentLoaded', loadNotifs);
</script>
</body></html>`
