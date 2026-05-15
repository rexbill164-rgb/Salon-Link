export function withMessagesKeyboardFix(html: string): string {
  const style = `
<style id="messages-keyboard-fix-style">
  @media(max-width:820px){
    body.messages-keyboard-open { overflow:hidden; }
    body.messages-keyboard-open .mobile-nav,
    body.messages-keyboard-open nav.mobile-nav,
    body.messages-keyboard-open [class*="mobile-nav"] {
      transform:translateY(120%) !important;
      opacity:0 !important;
      pointer-events:none !important;
    }
    body.messages-keyboard-open .messages-shell {
      padding-bottom:10px !important;
    }
    body.messages-keyboard-open .messages-grid {
      display:block !important;
    }
    body.messages-keyboard-open .messages-grid > aside {
      display:none !important;
    }
    body.messages-keyboard-open .messages-grid > section {
      height:calc(100dvh - 18px) !important;
      max-height:calc(100dvh - 18px) !important;
      border-radius:0 !important;
      display:flex !important;
      flex-direction:column !important;
      margin:0 !important;
    }
    body.messages-keyboard-open .chat-body {
      min-height:0 !important;
      max-height:none !important;
      flex:1 1 auto !important;
      padding-bottom:14px !important;
    }
    body.messages-keyboard-open .composer {
      flex:0 0 auto !important;
      padding:10px 12px calc(env(safe-area-inset-bottom,0px) + 10px) !important;
      background:#fff !important;
      box-shadow:0 -8px 22px rgba(0,0,0,0.06) !important;
    }
    body.messages-keyboard-open .composer textarea {
      max-height:74px !important;
      resize:none !important;
      font-size:16px !important;
    }
    body.messages-keyboard-open .send-btn {
      min-width:82px !important;
      min-height:52px !important;
    }
  }
</style>`

  const script = `
<script id="messages-keyboard-fix-script">
(function(){
  if (location.pathname.indexOf('/messages') !== 0) return;
  function chatBody(){ return document.getElementById('chat-body'); }
  function input(){ return document.getElementById('message-input'); }
  function scrollChatToBottom(){
    var body = chatBody();
    if (body) body.scrollTop = body.scrollHeight;
  }
  function openKeyboardMode(){
    document.body.classList.add('messages-keyboard-open');
    setTimeout(function(){
      var app = document.getElementById('messages-app');
      if (app) app.scrollIntoView({ block:'start', behavior:'smooth' });
      scrollChatToBottom();
    }, 80);
    setTimeout(scrollChatToBottom, 320);
  }
  function closeKeyboardMode(){
    document.body.classList.remove('messages-keyboard-open');
    setTimeout(scrollChatToBottom, 80);
  }
  function wire(){
    var box = input();
    if (!box || box.dataset.keyboardFixWired === '1') return;
    box.dataset.keyboardFixWired = '1';
    box.addEventListener('focus', openKeyboardMode);
    box.addEventListener('blur', function(){ setTimeout(closeKeyboardMode, 180); });
    box.addEventListener('input', scrollChatToBottom);
  }
  document.addEventListener('DOMContentLoaded', function(){ wire(); setTimeout(wire, 500); });
  if (window.MutationObserver) new MutationObserver(wire).observe(document.documentElement, { childList:true, subtree:true });
})();
</script>`

  let next = html
  if (!next.includes('messages-keyboard-fix-style')) next = next.replace('</head>', style + '</head>')
  if (!next.includes('messages-keyboard-fix-script')) next = next.replace('</body>', script + '</body>')
  return next
}
