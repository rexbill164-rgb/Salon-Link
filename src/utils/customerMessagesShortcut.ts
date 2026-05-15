export function withCustomerMessagesShortcut(html: string): string {
  const script = `
<style id="customer-messages-shortcut-style">
  .sl-message-shortcut-badge{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#ff3b30;color:#fff;font-size:10px;font-weight:800;display:none;align-items:center;justify-content:center;line-height:18px;border:2px solid #fff}
  .sl-message-top-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:800;position:relative;white-space:nowrap}
  .sl-message-float-btn{position:fixed;right:18px;bottom:104px;z-index:880;display:flex;align-items:center;gap:8px;background:#111;color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-size:12px;font-weight:900;box-shadow:0 10px 30px rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.55)}
  .sl-message-float-btn span:first-child{font-size:17px;line-height:1}
  .sl-message-card-btn{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#111;color:#fff;text-decoration:none;border-radius:18px;padding:16px 18px;margin:12px 0 16px;font-weight:900;box-shadow:0 10px 26px rgba(0,0,0,.16)}
  .sl-message-card-sub{font-size:11px;opacity:.72;font-weight:600;margin-top:3px}
  @media(min-width:768px){.sl-message-float-btn{bottom:24px}.sl-message-card-btn{display:none}}
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
    ['sl-float-message-badge','sl-card-message-badge','sl-mobile-message-badge','sl-top-message-badge'].forEach(function(id){
      var badge = document.getElementById(id); if (!badge) return;
      if (count > 0) { badge.textContent = badgeText(count); badge.style.display = 'inline-flex'; }
      else { badge.style.display = 'none'; }
    });
  }
  function addFloatingButton(){
    if (!token() || !isCustomer() || document.getElementById('sl-float-messages-link')) return;
    var link = document.createElement('a');
    link.id = 'sl-float-messages-link';
    link.href = '/messages';
    link.className = 'sl-message-float-btn';
    link.innerHTML = '<span>💬</span><span>Messages</span><span id="sl-float-message-badge" class="sl-message-shortcut-badge"></span>';
    document.body.appendChild(link);
  }
  function addDashboardCard(){
    if (!token() || !isCustomer() || location.pathname !== '/dashboard' || document.getElementById('sl-dashboard-messages-card')) return;
    var target = document.querySelector('.container') || document.querySelector('main') || document.body;
    var card = document.createElement('a');
    card.id = 'sl-dashboard-messages-card';
    card.href = '/messages';
    card.className = 'sl-message-card-btn';
    card.innerHTML = '<div><div>💬 Messages</div><div class="sl-message-card-sub">Chat with providers and see replies</div></div><span id="sl-card-message-badge" class="sl-message-shortcut-badge" style="position:static;border-color:rgba(255,255,255,.25)"></span>';
    target.insertBefore(card, target.firstChild);
  }
  function addToMobileNav(){
    var nav = document.querySelector('.mobile-nav');
    if (!nav || document.getElementById('sl-mobile-messages-link') || !token() || !isCustomer()) return;
    var link = document.createElement('a');
    link.id = 'sl-mobile-messages-link';
    link.href = '/messages';
    link.className = 'mobile-nav-item';
    link.style.position = 'relative';
    link.innerHTML = '<span style="font-size:20px;line-height:1;">💬</span><span>Messages</span><span id="sl-mobile-message-badge" class="sl-message-shortcut-badge"></span>';
    nav.appendChild(link);
  }
  function addTopShortcut(){
    if (!token() || !isCustomer() || document.getElementById('sl-top-messages-link')) return;
    var holder = document.querySelector('#nav-auth') || document.querySelector('.nav-main div[style*="justify-content:space-between"]') || document.querySelector('nav div');
    if (!holder) return;
    var link = document.createElement('a');
    link.id = 'sl-top-messages-link';
    link.href = '/messages';
    link.className = 'sl-message-top-btn';
    link.innerHTML = '💬 Messages <span id="sl-top-message-badge" class="sl-message-shortcut-badge"></span>';
    holder.appendChild(link);
  }
  function refresh(){
    addFloatingButton();
    addDashboardCard();
    addToMobileNav();
    addTopShortcut();
    unreadCount().then(setBadge);
  }
  document.addEventListener('DOMContentLoaded', function(){ refresh(); setTimeout(refresh, 500); setTimeout(refresh, 1500); });
  window.addEventListener('pageshow', refresh);
  if (window.MutationObserver) new MutationObserver(function(){ addFloatingButton(); addToMobileNav(); }).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`
  if (html.includes('customer-messages-shortcut-script')) return html
  return html.replace('</body>', script + '</body>')
}
