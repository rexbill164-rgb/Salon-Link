export function withCustomerMessagesShortcut(html: string): string {
  const script = `
<style id="customer-messages-shortcut-style">
  .sl-message-shortcut-badge{position:absolute;top:2px;right:14px;min-width:16px;height:16px;padding:0 5px;border-radius:999px;background:#ff3b30;color:#fff;font-size:10px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:16px}
  .sl-message-top-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:800;position:relative}
  .sl-message-top-badge{min-width:16px;height:16px;padding:0 5px;border-radius:999px;background:#ff3b30;color:#fff;font-size:10px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:16px}
</style>
<script id="customer-messages-shortcut-script">
(function(){
  if (location.pathname.indexOf('/admin') === 0 || location.pathname.indexOf('/provider/dashboard') === 0 || location.pathname.indexOf('/messages') === 0) return;
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
  function setBadge(count){
    ['sl-mobile-message-badge','sl-top-message-badge'].forEach(function(id){
      var badge = document.getElementById(id); if (!badge) return;
      if (count > 0) { badge.textContent = badgeText(count); badge.style.display = 'inline-flex'; }
      else { badge.style.display = 'none'; }
    });
  }
  function addToMobileNav(){
    var nav = document.querySelector('.mobile-nav');
    if (!nav || document.getElementById('sl-mobile-messages-link')) return;
    var link = document.createElement('a');
    link.id = 'sl-mobile-messages-link';
    link.href = '/messages';
    link.className = 'mobile-nav-item';
    link.style.position = 'relative';
    link.innerHTML = '<span style="font-size:20px;line-height:1;">💬</span><span>Messages</span><span id="sl-mobile-message-badge" class="sl-message-shortcut-badge"></span>';
    var profile = Array.prototype.slice.call(nav.querySelectorAll('a')).find(function(a){ return /profile/i.test(a.textContent || '') || (a.getAttribute('href') || '').indexOf('settings') >= 0; });
    if (profile) nav.insertBefore(link, profile); else nav.appendChild(link);
  }
  function addTopShortcut(){
    if (document.getElementById('sl-top-messages-link')) return;
    var holder = document.querySelector('#nav-auth') || document.querySelector('.nav-main div[style*="justify-content:space-between"]') || document.querySelector('nav div');
    if (!holder) return;
    var link = document.createElement('a');
    link.id = 'sl-top-messages-link';
    link.href = '/messages';
    link.className = 'sl-message-top-btn';
    link.innerHTML = '💬 Messages <span id="sl-top-message-badge" class="sl-message-top-badge"></span>';
    holder.appendChild(link);
  }
  function refresh(){
    addToMobileNav();
    addTopShortcut();
    unreadCount().then(setBadge);
  }
  document.addEventListener('DOMContentLoaded', function(){ refresh(); setTimeout(refresh, 600); });
  window.addEventListener('pageshow', refresh);
  if (window.MutationObserver) new MutationObserver(function(){ addToMobileNav(); }).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`
  if (html.includes('customer-messages-shortcut-script')) return html
  return html.replace('</body>', script + '</body>')
}
