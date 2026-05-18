export function withCustomerMessagesShortcut(html: string): string {
  const script = `
<style id="customer-messages-shortcut-style">
  .sl-message-shortcut-badge{position:absolute;top:2px;right:10px;min-width:17px;height:17px;padding:0 5px;border-radius:999px;background:#ff3b30;color:#fff;font-size:9px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:17px;border:2px solid #fff}
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
  document.addEventListener('DOMContentLoaded', function(){ refresh(); setTimeout(refresh, 500); setTimeout(refresh, 1500); });
  window.addEventListener('pageshow', refresh);
  if (window.MutationObserver) new MutationObserver(function(){ removeDuplicateMessageShortcuts(); ensureBottomBadge(); }).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`
  if (html.includes('customer-messages-shortcut-script')) return html
  return html.replace('</body>', script + '</body>')
}
