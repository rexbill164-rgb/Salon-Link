import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

const messagesStyles = `
<style>
  body { background:#F8F8F8; }
  .messages-shell { padding:18px 0 128px; }
  .messages-grid { display:grid; grid-template-columns:320px 1fr; gap:18px; align-items:start; }
  .msg-panel { background:#fff; border:1px solid var(--i-faint); border-radius:22px; box-shadow:0 8px 28px rgba(0,0,0,0.06); overflow:hidden; }
  .msg-panel-head { padding:18px 20px; border-bottom:1px solid var(--i-faint); display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .conversation-list { max-height:680px; overflow:auto; }
  .conversation-row { width:100%; border:0; background:#fff; border-bottom:1px solid var(--i-faint); padding:14px 16px; display:flex; gap:12px; text-align:left; cursor:pointer; transition:background 0.2s, transform 0.2s; }
  .conversation-row:hover, .conversation-row.active { background:#F5F5F5; }
  .conversation-row:active { transform:scale(0.99); }
  .chat-body { min-height:520px; max-height:620px; overflow:auto; padding:18px; display:flex; flex-direction:column; gap:10px; background:linear-gradient(180deg,#FBFBFB,#F7F7F7); }
  .bubble-row { display:flex; }
  .bubble-row.mine { justify-content:flex-end; }
  .bubble { max-width:74%; padding:11px 14px; border-radius:18px; font-size:13px; line-height:1.5; box-shadow:0 2px 10px rgba(0,0,0,0.04); word-break:break-word; }
  .bubble.mine { background:#111; color:#fff; border-bottom-right-radius:6px; }
  .bubble.theirs { background:#fff; color:#222; border:1px solid #eee; border-bottom-left-radius:6px; }
  .bubble-time { font-size:10px; opacity:0.62; margin-top:5px; }
  .composer { border-top:1px solid var(--i-faint); padding:12px; display:flex; gap:10px; background:#fff; }
  .composer textarea { flex:1; min-height:44px; max-height:110px; resize:vertical; border:1.5px solid var(--i-faint); border-radius:16px; padding:12px 14px; font-family:'Poppins',sans-serif; font-size:13px; outline:none; }
  .composer textarea:focus { border-color:#111; }
  .send-btn { border:0; background:#111; color:#fff; border-radius:16px; padding:0 18px; font-size:13px; font-weight:800; cursor:pointer; min-width:76px; }
  .send-btn:disabled { opacity:0.55; cursor:not-allowed; }
  .empty-note { padding:36px 18px; text-align:center; color:var(--t-muted); font-size:13px; line-height:1.6; }
  .avatar-dot { width:42px; height:42px; border-radius:14px; background:#111; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; flex-shrink:0; }
  .unread-pill { background:#111; color:#fff; min-width:20px; height:20px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; padding:0 6px; }
  @media(max-width:820px){
    .messages-shell { padding:10px 0 118px; }
    .messages-grid { grid-template-columns:1fr; gap:12px; }
    .conversation-list { max-height:240px; display:flex; overflow-x:auto; overflow-y:hidden; padding:10px; gap:10px; }
    .conversation-row { min-width:240px; border:1px solid var(--i-faint); border-radius:18px; }
    .chat-body { min-height:420px; max-height:58vh; padding:14px; }
    .bubble { max-width:86%; }
    .msg-panel-head { padding:14px 16px; }
  }
</style>
`

export const messagesPage = (initialConversationId = '') => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Messages', messagesStyles)}
</head>
<body>
${navbar('')}

<div class="messages-shell">
  <div class="container">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;">
      <div>
        <div class="eyebrow" style="margin-bottom:6px;">Messages</div>
        <h1 style="font-size:clamp(22px,4vw,32px);font-weight:800;color:var(--t-primary);">Customer and provider chat</h1>
      </div>
      <a href="/discover" class="btn-ghost" style="font-size:12px;padding:10px 18px;text-decoration:none;">Find providers</a>
    </div>

    <div id="auth-warning" class="msg-panel" style="display:none;padding:26px;text-align:center;margin-bottom:16px;">
      <div style="font-size:16px;font-weight:800;margin-bottom:8px;">Sign in to use messages</div>
      <div style="font-size:13px;color:var(--t-muted);margin-bottom:18px;">Messages are private between customers and providers.</div>
      <a href="/login?redirect=/messages" class="btn-primary" style="justify-content:center;text-decoration:none;">Sign In</a>
    </div>

    <div id="messages-app" class="messages-grid" style="display:none;">
      <aside class="msg-panel">
        <div class="msg-panel-head">
          <div>
            <div style="font-size:15px;font-weight:800;">Inbox</div>
            <div id="inbox-sub" style="font-size:11px;color:var(--t-muted);">Loading conversations...</div>
          </div>
          <button onclick="loadInbox()" class="btn-ghost" style="font-size:11px;padding:7px 12px;">Refresh</button>
        </div>
        <div id="conversation-list" class="conversation-list">
          <div class="empty-note">Loading inbox...</div>
        </div>
      </aside>

      <section class="msg-panel">
        <div class="msg-panel-head">
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            <div class="avatar-dot" id="chat-avatar">SL</div>
            <div style="min-width:0;">
              <div id="chat-title" style="font-size:15px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Choose a conversation</div>
              <div id="chat-sub" style="font-size:11px;color:var(--t-muted);">Send a private message</div>
            </div>
          </div>
        </div>
        <div id="chat-status" style="display:none;padding:10px 18px;background:#FFF8E6;border-bottom:1px solid #F3E0AE;color:#7A5A00;font-size:12px;"></div>
        <div id="chat-body" class="chat-body">
          <div class="empty-note">Select a conversation or start one from a provider profile.</div>
        </div>
        <div class="composer">
          <textarea id="message-input" placeholder="Write a message..." onkeydown="handleComposerKey(event)"></textarea>
          <button id="send-message-btn" class="send-btn" onclick="sendMessage()">Send</button>
        </div>
      </section>
    </div>
  </div>
</div>

${mobileNav('')}
${globalScripts()}
<script>
window.__initialConversationId = ${JSON.stringify(initialConversationId)};
var state = {
  me: null,
  conversations: [],
  activeConversationId: window.__initialConversationId || '',
  providerId: 0,
  receiverId: 0,
  activeTitle: 'Conversation'
};

function token() { return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
function headers() { return { Authorization: 'Bearer ' + token() }; }
function esc(value) {
  return String(value || '').replace(/[&<>"']/g, function(ch) {
    if (ch === '&') return '&amp;';
    if (ch === '<') return '&lt;';
    if (ch === '>') return '&gt;';
    if (ch === '"') return '&quot;';
    return '&#39;';
  });
}
function otherName(c) { return ((c.other_first_name || '') + ' ' + (c.other_last_name || '')).trim(); }
function titleFor(c) {
  if (!c) return 'Conversation';
  if (state.me && state.me.role === 'provider') return otherName(c) || 'Customer';
  return c.business_name || otherName(c) || 'Provider';
}
function initials(name) {
  var clean = String(name || 'SL').trim();
  if (!clean) return 'SL';
  var parts = clean.split(' ').filter(Boolean).slice(0, 2);
  return parts.map(function(part) { return part.charAt(0).toUpperCase(); }).join('') || 'SL';
}
function formatTime(value) {
  if (!value) return '';
  try { return new Date(value).toLocaleString('en-GH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch(e) { return value; }
}
function setStatus(message, isError) {
  var el = document.getElementById('chat-status');
  if (!el) return;
  if (!message) { el.style.display = 'none'; el.textContent = ''; return; }
  el.style.display = 'block';
  el.style.background = isError ? '#FFF5F5' : '#FFF8E6';
  el.style.borderBottomColor = isError ? '#F2CACA' : '#F3E0AE';
  el.style.color = isError ? '#9B1C1C' : '#7A5A00';
  el.textContent = message;
}
function setChatHeader(title, sub) {
  state.activeTitle = title || 'Conversation';
  document.getElementById('chat-title').textContent = state.activeTitle;
  document.getElementById('chat-sub').textContent = sub || 'Private SalonLink conversation';
  document.getElementById('chat-avatar').textContent = initials(state.activeTitle);
}
function conversationIdFor(providerId, customerId) { return 'provider:' + providerId + ':customer:' + customerId; }

function applyConversationMeta(c) {
  if (!c) return;
  state.providerId = Number(c.provider_id || state.providerId || 0);
  state.receiverId = Number(c.other_user_id || state.receiverId || 0);
  setChatHeader(titleFor(c), c.business_name ? 'Provider conversation' : 'Private conversation');
}

function renderInbox() {
  var list = document.getElementById('conversation-list');
  var sub = document.getElementById('inbox-sub');
  if (sub) sub.textContent = state.conversations.length + ' conversation' + (state.conversations.length === 1 ? '' : 's');
  if (!state.conversations.length) {
    list.innerHTML = '<div class="empty-note">No conversations yet. Open a provider profile and tap Message Provider to start.</div>';
    return;
  }
  list.innerHTML = state.conversations.map(function(c) {
    var title = titleFor(c);
    var unread = Number(c.unread_count || 0);
    return '<button class="conversation-row" data-conv="' + esc(c.conversation_id) + '">' +
      '<div class="avatar-dot">' + esc(initials(title)) + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">' +
          '<span style="font-size:13px;font-weight:800;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(title) + '</span>' +
          (unread ? '<span class="unread-pill">' + unread + '</span>' : '') +
        '</div>' +
        '<div style="font-size:12px;color:var(--t-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(c.last_message || '') + '</div>' +
        '<div style="font-size:10px;color:var(--t-faint);margin-top:4px;">' + esc(formatTime(c.created_at)) + '</div>' +
      '</div>' +
    '</button>';
  }).join('');
  list.querySelectorAll('.conversation-row').forEach(function(row) {
    row.addEventListener('click', function() { openConversation(row.getAttribute('data-conv')); });
  });
}

function renderMessages(items) {
  var body = document.getElementById('chat-body');
  if (!items.length) {
    body.innerHTML = '<div class="empty-note">No messages yet. Say hello and confirm details before booking.</div>';
    return;
  }
  body.innerHTML = items.map(function(m) {
    var mine = state.me && Number(m.sender_id) === Number(state.me.id);
    return '<div class="bubble-row ' + (mine ? 'mine' : '') + '">' +
      '<div class="bubble ' + (mine ? 'mine' : 'theirs') + '">' +
        '<div>' + esc(m.message) + '</div>' +
        '<div class="bubble-time">' + esc(formatTime(m.created_at)) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  body.scrollTop = body.scrollHeight;
}

function loadInbox() {
  if (!token()) return Promise.resolve();
  return axios.get('/api/messages/inbox', { headers: headers() })
    .then(function(res) {
      state.conversations = res.data.conversations || [];
      renderInbox();
      if (res.data.note) setStatus(res.data.note, false);
      if (state.activeConversationId && !state.providerId) openConversation(state.activeConversationId);
    })
    .catch(function() {
      document.getElementById('conversation-list').innerHTML = '<div class="empty-note">Could not load inbox. Please refresh.</div>';
    });
}

function openConversation(conversationId) {
  if (!conversationId) return;
  state.activeConversationId = decodeURIComponent(conversationId);
  var found = state.conversations.find(function(c) { return c.conversation_id === state.activeConversationId; });
  applyConversationMeta(found);
  setStatus('', false);
  document.getElementById('chat-body').innerHTML = '<div class="empty-note">Loading conversation...</div>';
  axios.get('/api/messages/conversation/' + encodeURIComponent(state.activeConversationId), { headers: headers() })
    .then(function(res) {
      var items = res.data.messages || [];
      if (!found && items.length) {
        var first = items[0];
        state.providerId = Number(first.provider_id || 0);
        state.receiverId = Number(first.sender_id) === Number(state.me.id) ? Number(first.receiver_id) : Number(first.sender_id);
        setChatHeader(first.business_name || 'Conversation', 'Private conversation');
      }
      renderMessages(items);
      axios.patch('/api/messages/read/' + encodeURIComponent(state.activeConversationId), {}, { headers: headers() }).then(loadInbox).catch(function(){});
      if (res.data.note) setStatus(res.data.note, false);
    })
    .catch(function() {
      renderMessages([]);
      setStatus('Could not load this conversation.', true);
    });
}

function startProviderConversation(providerId) {
  providerId = Number(providerId || 0);
  if (!providerId) return;
  setStatus('', false);
  setChatHeader('Provider', 'Loading provider...');
  axios.get('/api/providers/' + providerId)
    .then(function(res) {
      var p = res.data.provider || {};
      state.providerId = Number(p.id || providerId);
      state.receiverId = Number(p.user_id || 0);
      setChatHeader(p.business_name || 'Provider', (p.city || 'Ghana') + ' provider');
      if (state.me && state.me.id) {
        state.activeConversationId = conversationIdFor(state.providerId, state.me.id);
        openConversation(state.activeConversationId);
      }
    })
    .catch(function() { setStatus('Could not load provider chat.', true); });
}

function sendMessage() {
  var input = document.getElementById('message-input');
  var text = input.value.trim();
  if (!text) return;
  if (!state.providerId || !state.receiverId) {
    setStatus('Choose a conversation first.', true);
    return;
  }
  var btn = document.getElementById('send-message-btn');
  btn.disabled = true;
  btn.textContent = 'Sending';
  axios.post('/api/messages/send', {
    provider_id: state.providerId,
    receiver_id: state.receiverId,
    message: text
  }, { headers: headers() })
    .then(function(res) {
      input.value = '';
      state.activeConversationId = res.data.conversation_id || state.activeConversationId;
      if (state.activeConversationId && location.pathname === '/messages') {
        history.replaceState(null, '', '/messages/' + encodeURIComponent(state.activeConversationId));
      }
      return loadInbox().then(function() { openConversation(state.activeConversationId); });
    })
    .catch(function(err) {
      var msg = err.response && err.response.data && err.response.data.error ? err.response.data.error : 'Could not send message.';
      setStatus(msg, true);
    })
    .finally(function() {
      btn.disabled = false;
      btn.textContent = 'Send';
    });
}

function handleComposerKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function bootMessages() {
  if (!token()) {
    document.getElementById('auth-warning').style.display = 'block';
    document.getElementById('messages-app').style.display = 'none';
    return;
  }
  document.getElementById('messages-app').style.display = 'grid';
  axios.get('/api/auth/me', { headers: headers() })
    .then(function(res) {
      state.me = res.data.user || null;
      var providerId = new URLSearchParams(location.search).get('provider_id');
      return loadInbox().then(function() {
        if (providerId) startProviderConversation(providerId);
        else if (state.activeConversationId) openConversation(state.activeConversationId);
      });
    })
    .catch(function() {
      document.getElementById('auth-warning').style.display = 'block';
      document.getElementById('messages-app').style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', bootMessages);
</script>
</body></html>`
