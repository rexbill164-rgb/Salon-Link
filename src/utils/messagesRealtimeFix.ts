export function withMessagesRealtimeFix(html: string): string {
  if (html.includes('messages-realtime-fix-script')) return html

  const patch = `
<script id="messages-realtime-fix-script">
(function(){
  if (!location.pathname.startsWith('/messages')) return;

  var lastMessageKey = '';
  var lastConversationId = '';
  var pollMs = 2500;
  var inboxPollMs = 8000;
  var activeTimer = null;
  var inboxTimer = null;
  var isPolling = false;

  function getState(){ return window.state || state || {}; }
  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function messageKey(items){
    if (!items || !items.length) return 'empty';
    var last = items[items.length - 1] || {};
    return String(items.length) + ':' + String(last.id || '') + ':' + String(last.created_at || '') + ':' + String(last.message || '').slice(0, 25);
  }
  function activeConversationId(){
    try { return getState().activeConversationId || ''; } catch(e) { return ''; }
  }
  function loadConversationQuietly(){
    if (isPolling || !token()) return;
    var conv = activeConversationId();
    if (!conv) return;
    isPolling = true;
    axios.get('/api/messages/conversation/' + encodeURIComponent(conv), { headers: headers() })
      .then(function(res){
        var items = res.data.messages || [];
        var key = messageKey(items);
        if (conv !== lastConversationId || key !== lastMessageKey) {
          lastConversationId = conv;
          lastMessageKey = key;
          if (typeof renderMessages === 'function') renderMessages(items);
          axios.patch('/api/messages/read/' + encodeURIComponent(conv), {}, { headers: headers() }).catch(function(){});
        }
      })
      .catch(function(){})
      .finally(function(){ isPolling = false; });
  }
  function refreshInboxQuietly(){
    if (!token() || typeof loadInbox !== 'function') return;
    loadInbox().catch(function(){});
  }
  function startRealtime(){
    if (activeTimer) clearInterval(activeTimer);
    if (inboxTimer) clearInterval(inboxTimer);
    loadConversationQuietly();
    activeTimer = setInterval(loadConversationQuietly, pollMs);
    inboxTimer = setInterval(refreshInboxQuietly, inboxPollMs);
  }
  var oldOpenConversation = window.openConversation;
  if (typeof oldOpenConversation === 'function') {
    window.openConversation = function(conversationId){
      var result = oldOpenConversation.apply(this, arguments);
      setTimeout(function(){
        lastConversationId = '';
        lastMessageKey = '';
        loadConversationQuietly();
      }, 900);
      return result;
    };
  }
  var oldSendMessage = window.sendMessage;
  if (typeof oldSendMessage === 'function') {
    window.sendMessage = function(){
      var result = oldSendMessage.apply(this, arguments);
      setTimeout(loadConversationQuietly, 700);
      setTimeout(refreshInboxQuietly, 1200);
      return result;
    };
  }
  document.addEventListener('visibilitychange', function(){ if (!document.hidden) { loadConversationQuietly(); refreshInboxQuietly(); } });
  setTimeout(startRealtime, 1200);
  setTimeout(startRealtime, 3000);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
