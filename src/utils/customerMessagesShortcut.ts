export function withCustomerMessagesShortcut(html: string): string {
  const script = `
<style id="customer-messages-shortcut-style">
  .sl-message-shortcut-badge{position:absolute;top:2px;right:10px;min-width:17px;height:17px;padding:0 5px;border-radius:999px;background:#ff3b30;color:#fff;font-size:9px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:17px;border:2px solid #fff}
  .sl-provider-detail-icon{width:40px!important;height:40px!important;border-radius:12px!important;background:#eef4ff!important;color:#2563eb!important;display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 40px!important;font-size:16px!important}
  .sl-provider-detail-row{display:flex!important;gap:14px!important;margin-bottom:18px!important;align-items:flex-start!important}
  .sl-provider-share-btn{width:100%!important;margin-top:12px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;border-radius:14px!important;border:1px solid rgba(0,0,0,.08)!important;background:#fff!important;color:#111827!important;padding:12px 14px!important;font-size:13px!important;font-weight:800!important;cursor:pointer!important}
</style>
<script id="customer-messages-shortcut-script">
(function(){
  if (location.pathname.indexOf('/admin') === 0 || location.pathname.indexOf('/provider/dashboard') === 0) return;
  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function user(){ try { return JSON.parse(localStorage.getItem('sl_user') || localStorage.getItem('user') || '{}'); } catch(e){ return {}; } }
  function isCustomer(){ var u=user(); return !u.role || u.role === 'customer'; }
  function unreadCount(){
    if (!token() || !window.axios || !isCustomer()) return Promise.resolve(0);
    return window.axios.get('/api/messages/inbox', { headers:{ Authorization:'Bearer ' + token() } })
      .then(function(res){
        var rows = (res.data && res.data.conversations) || [];
        return rows.reduce(function(sum, row){ return sum + Number(row.unread_count || 0); }, 0);
      }).catch(function(){ return 0; });
  }
  function badgeText(count){ return count > 9 ? '9+' : String(count); }
  function removeDuplicateMessageShortcuts(){
    ['sl-float-messages-link','sl-dashboard-messages-card','sl-top-messages-link','sl-mobile-messages-link'].forEach(function(id){
      var el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
  }
  function ensureBottomBadge(){
    var nav = document.querySelector('.mobile-nav');
    if (!nav) return null;
    var messageLink = nav.querySelector('a[href="/messages"]');
    if (!messageLink) return null;
    messageLink.style.position = 'relative';
    var badge = document.getElementById('sl-mobile-message-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'sl-mobile-message-badge';
      badge.className = 'sl-message-shortcut-badge';
      messageLink.appendChild(badge);
    }
    return badge;
  }
  function setBadge(count){
    var badge = ensureBottomBadge();
    if (!badge) return;
    if (count > 0) {
      badge.textContent = badgeText(count);
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
  function refresh(){
    removeDuplicateMessageShortcuts();
    unreadCount().then(setBadge);
  }

  function replaceEmojiWithIcon(targetId, iconClass){
    var target = document.getElementById(targetId);
    if (!target) return;
    var row = target.closest('div[style*="display:flex"]');
    if (!row) return;
    row.classList.add('sl-provider-detail-row');
    var first = row.children && row.children[0];
    if (!first) return;
    if (first.classList && first.classList.contains('sl-provider-detail-icon')) return;
    var icon = document.createElement('div');
    icon.className = 'sl-provider-detail-icon';
    icon.innerHTML = '<i class="fas ' + iconClass + '"></i>';
    row.replaceChild(icon, first);
  }
  function ensureProviderShare(){
    if (location.pathname.indexOf('/provider/') !== 0 || location.pathname.indexOf('/provider/dashboard') === 0) return;
    replaceEmojiWithIcon('info-location','fa-map-marker-alt');
    replaceEmojiWithIcon('info-phone','fa-phone');

    var mapWrap = document.getElementById('provider-map-wrap');
    if (!mapWrap || document.getElementById('share-location-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'share-location-btn';
    btn.className = 'sl-provider-share-btn';
    btn.innerHTML = '<i class="fas fa-share-nodes"></i><span>Share Location</span>';
    btn.onclick = window.shareProviderLocation;
    mapWrap.appendChild(btn);
  }
  window.shareProviderLocation = window.shareProviderLocation || function(){
    var providerName = document.getElementById('profile-name') ? document.getElementById('profile-name').textContent : 'SalonLink Provider';
    var address = document.getElementById('info-location') ? document.getElementById('info-location').textContent : 'Accra, Ghana';
    var profileLink = window.location.origin + window.location.pathname;
    var mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    if (window.__providerLocation && window.__providerLocation.lat && window.__providerLocation.lng) {
      mapLink = 'https://www.google.com/maps?q=' + encodeURIComponent(window.__providerLocation.lat + ',' + window.__providerLocation.lng);
    }
    var text = 'Check out ' + providerName + ' on SalonLink.\n' + 'Location: ' + address + '\n' + 'Map: ' + mapLink + '\n' + 'Profile: ' + profileLink;
    if (navigator.share) navigator.share({ title: providerName, text: text, url: mapLink }).catch(function(){});
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function(){ if(window.showToast) showToast('Location link copied','success'); });
    else if(window.showToast) showToast('Sharing is not supported on this device','info');
  };

  document.addEventListener('DOMContentLoaded', function(){ refresh(); ensureProviderShare(); setTimeout(refresh, 500); setTimeout(refresh, 1500); setTimeout(ensureProviderShare, 800); setTimeout(ensureProviderShare, 1800); });
  window.addEventListener('pageshow', function(){ refresh(); ensureProviderShare(); });
  if (window.MutationObserver) new MutationObserver(function(){ removeDuplicateMessageShortcuts(); ensureBottomBadge(); ensureProviderShare(); }).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`
  if (html.includes('customer-messages-shortcut-script')) return html
  return html.replace('</body>', script + '</body>')
}
