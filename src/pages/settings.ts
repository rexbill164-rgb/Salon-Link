import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const settingsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Settings', `
<style>
  body{background:#f7f7f7}.settings-wrap{padding:42px 0 120px}.settings-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:24px;padding:28px;margin-bottom:20px}.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.reward-card{background:linear-gradient(135deg,#fff7ed,#fdf2f8 52%,#eef4ff);border:1px solid rgba(0,0,0,.06);border-radius:24px;padding:28px;margin-bottom:20px}.reward-pill{display:inline-flex;background:#111;color:#fff;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:800}.settings-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px;border:1px solid rgba(0,0,0,.06);border-radius:16px;background:#fafafa;margin-bottom:12px}.points-modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:9000;align-items:center;justify-content:center;padding:20px}.points-modal{background:#fff;border-radius:28px;padding:28px;max-width:480px;width:100%;max-height:85vh;overflow-y:auto}@media(max-width:640px){.settings-grid{grid-template-columns:1fr}.settings-card,.reward-card{padding:22px}}
</style>
`)}
</head>
<body>
${navbar('settings')}
<div class="settings-wrap"><div class="container-sm">
  <div style="margin-bottom:26px"><div class="eyebrow" style="margin-bottom:10px">Account</div><h1 class="display-lg font-display">Your Settings</h1></div>

  <!-- Provider-only: Points Gathered -->
  <section id="points-section" class="reward-card" style="display:none;">
    <div class="eyebrow" style="margin-bottom:10px">Provider Rewards</div>
    <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;margin-bottom:8px">Points Gathered</h2>
    <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:16px">Earn points for great service and use them to claim reward items from SalonLink.</p>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="reward-pill">⭐ <span id="total-points-badge">0</span> pts</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button onclick="openPointsModal()" class="btn-primary" style="font-size:12px;padding:11px 20px;">View Points</button>
        <a href="/surprise-shop" class="btn-ghost" style="font-size:12px;padding:11px 20px;text-decoration:none;">View Items to Claim</a>
      </div>
    </div>
  </section>

  <section class="settings-card">
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:24px"><div id="user-avatar" style="width:70px;height:70px;border-radius:22px;background:#f1f1f1;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800">U</div><div><div id="user-name" style="font-size:22px;font-weight:800">Your Name</div><div id="user-email" style="font-size:13px;color:#666">Loading...</div></div></div>
    <div class="eyebrow" style="margin-bottom:16px">Personal Information</div>
    <div class="settings-grid"><div><label class="form-label">First Name</label><input id="inp-first" class="input" type="text"></div><div><label class="form-label">Last Name</label><input id="inp-last" class="input" type="text"></div><div><label class="form-label">Email</label><input id="inp-email" class="input" type="email" readonly></div><div><label class="form-label">Phone</label><input id="inp-phone" class="input" type="tel"></div></div>
    <button id="save-profile-btn" class="btn-primary" style="margin-top:18px;padding:12px 26px;font-size:12px">Save Changes</button>
  </section>

  <section class="settings-card"><div class="eyebrow" style="margin-bottom:16px">Security</div><div class="settings-row"><div><strong>Change Password</strong><div style="font-size:12px;color:#666">Keep your account secure</div></div><button class="btn-ghost" onclick="showToast('Password settings coming soon','info')">Change</button></div><div class="settings-row"><div><strong>Notifications</strong><div style="font-size:12px;color:#666">Manage booking alerts and reminders</div></div><button class="btn-ghost" onclick="showToast('Notification settings saved','success')">Manage</button></div></section>
</div></div>

<!-- Points Modal -->
<div id="points-modal-overlay" class="points-modal-overlay" onclick="if(event.target===this)closePointsModal()">
  <div class="points-modal">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="font-size:20px;font-weight:900;margin:0;">⭐ Points Gathered</h2>
      <button onclick="closePointsModal()" style="width:32px;height:32px;border-radius:50%;border:1px solid #eee;background:#f5f5f5;cursor:pointer;font-size:16px;">✕</button>
    </div>
    <div style="background:linear-gradient(135deg,#C9A84C,#8B6914);border-radius:18px;padding:20px;margin-bottom:20px;text-align:center;">
      <div style="font-size:13px;color:rgba(255,255,255,.8);margin-bottom:6px;">Total Accumulated Points</div>
      <div style="font-size:48px;font-weight:900;color:#fff;" id="modal-points-total">0</div>
      <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px;">Admin will review your page performance and award points.</div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:#888;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px;">How to Earn Points</div>
      ${[
        {num:'1', title:'Confirm a booking', desc:'Accept a customer\'s booking request promptly.'},
        {num:'2', title:'Complete the job', desc:'Mark job complete, confirm with client, and upload 1–2 client pictures to your profile.'},
        {num:'3', title:'Pay your service charge', desc:'Pay the weekly or monthly platform service charge on time.'},
        {num:'4', title:'Claim rewards', desc:'At month-end, use your points to claim listed reward items.'},
      ].map(r => `
        <div style="display:flex;gap:12px;padding:12px;border:1px solid #eee;border-radius:14px;margin-bottom:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;">\${r.num}</div>
          <div><div style="font-size:13px;font-weight:700;">\${r.title}</div><div style="font-size:12px;color:#666;margin-top:2px;">\${r.desc}</div></div>
        </div>
      `).join('')}
    </div>

    <div id="points-history" style="margin-bottom:20px;"></div>

    <a href="/surprise-shop" class="btn-primary" style="display:block;text-align:center;text-decoration:none;padding:14px;font-size:13px;">View Items to Claim →</a>
  </div>
</div>

${mobileNav('settings')}
${globalScripts()}
<script>
(function(){
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if(!user.id){ location.href='/login'; return; }
  function val(id,v){ var e=document.getElementById(id); if(e) e.value=v||''; }
  function txt(id,v){ var e=document.getElementById(id); if(e) e.textContent=v||''; }
  txt('user-avatar',(user.first_name||'U').charAt(0).toUpperCase());
  txt('user-name',((user.first_name||'')+' '+(user.last_name||'')).trim()||'Your Name');
  txt('user-email',user.email||'');
  val('inp-first',user.first_name); val('inp-last',user.last_name); val('inp-email',user.email); val('inp-phone',user.phone);

  // Show points section for providers
  if(user.role === 'provider'){
    var sec = document.getElementById('points-section');
    if(sec) sec.style.display = 'block';
    loadProviderPoints();
  }

  var btn=document.getElementById('save-profile-btn');
  if(btn) btn.onclick=function(){
    var token=localStorage.getItem('sl_token');
    if(!token){ location.href='/login'; return; }
    axios.put('/api/auth/profile',{first_name:document.getElementById('inp-first').value,last_name:document.getElementById('inp-last').value,phone:document.getElementById('inp-phone').value},{headers:{Authorization:'Bearer '+token}}).then(function(res){localStorage.setItem('sl_user',JSON.stringify(res.data.user));showToast('Profile updated','success')}).catch(function(){showToast('Could not save profile','error')});
  };
})();

function loadProviderPoints(){
  var token = localStorage.getItem('sl_token');
  if(!token) return;
  axios.get('/api/providers/me/points', {headers:{Authorization:'Bearer '+token}}).then(function(res){
    var pts = res.data.total_points || 0;
    var badge = document.getElementById('total-points-badge');
    var modalTotal = document.getElementById('modal-points-total');
    if(badge) badge.textContent = pts;
    if(modalTotal) modalTotal.textContent = pts;
    // Render history
    var hist = res.data.history || [];
    var histEl = document.getElementById('points-history');
    if(histEl && hist.length){
      histEl.innerHTML = '<div style="font-size:12px;font-weight:700;color:#888;letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px;">Recent Activity</div>' +
        hist.map(function(h){
          return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">' +
            '<div><div style="font-size:13px;font-weight:600;">' + (h.reason||h.type||'Points') + '</div><div style="font-size:11px;color:#999;">' + (h.created_at ? new Date(h.created_at).toLocaleDateString() : '') + '</div></div>' +
            '<div style="font-size:16px;font-weight:800;color:' + (h.points > 0 ? '#00C853' : '#E53935') + ';">' + (h.points > 0 ? '+' : '') + h.points + '</div>' +
          '</div>';
        }).join('');
    }
  }).catch(function(){});
}

function openPointsModal(){
  loadProviderPoints();
  var ov = document.getElementById('points-modal-overlay');
  if(ov){ ov.style.display='flex'; document.body.style.overflow='hidden'; }
}
function closePointsModal(){
  var ov = document.getElementById('points-modal-overlay');
  if(ov){ ov.style.display='none'; document.body.style.overflow=''; }
}
</script>
</body></html>`
