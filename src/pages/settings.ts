import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const settingsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Settings', `
<style>
  body{background:#f7f7f7}.settings-wrap{padding:42px 0 120px}.settings-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:24px;padding:28px;margin-bottom:20px}.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.reward-card{background:linear-gradient(135deg,#fff7ed,#fdf2f8 52%,#eef4ff);border:1px solid rgba(0,0,0,.06);border-radius:24px;padding:28px;margin-bottom:20px}.reward-pill{display:inline-flex;background:#111;color:#fff;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:800}.settings-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px;border:1px solid rgba(0,0,0,.06);border-radius:16px;background:#fafafa;margin-bottom:12px}@media(max-width:640px){.settings-grid{grid-template-columns:1fr}.settings-card,.reward-card{padding:22px}}
</style>
`)}
</head>
<body>
${navbar('settings')}
<div class="settings-wrap"><div class="container-sm">
  <div style="margin-bottom:26px"><div class="eyebrow" style="margin-bottom:10px">Account</div><h1 class="display-lg font-display">Your Settings</h1></div>

  <section class="reward-card">
    <div class="eyebrow" style="margin-bottom:10px">Provider Rewards</div>
    <h2 style="font-size:24px;font-weight:900;letter-spacing:-.03em;margin-bottom:8px">SalonLink Surprise Shop</h2>
    <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:16px">Providers earn points when customers complete appointments and leave genuine ratings and comments. Points can later be used to claim salon gadgets and reward items.</p>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap"><span class="reward-pill">3 points per completed review</span><a href="/surprise-shop" class="btn-primary" style="font-size:12px;padding:11px 20px;text-decoration:none">Claim Gift</a></div>
  </section>

  <section class="settings-card">
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:24px"><div id="user-avatar" style="width:70px;height:70px;border-radius:22px;background:#f1f1f1;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800">U</div><div><div id="user-name" style="font-size:22px;font-weight:800">Your Name</div><div id="user-email" style="font-size:13px;color:#666">Loading...</div></div></div>
    <div class="eyebrow" style="margin-bottom:16px">Personal Information</div>
    <div class="settings-grid"><div><label class="form-label">First Name</label><input id="inp-first" class="input" type="text"></div><div><label class="form-label">Last Name</label><input id="inp-last" class="input" type="text"></div><div><label class="form-label">Email</label><input id="inp-email" class="input" type="email" readonly></div><div><label class="form-label">Phone</label><input id="inp-phone" class="input" type="tel"></div></div>
    <button id="save-profile-btn" class="btn-primary" style="margin-top:18px;padding:12px 26px;font-size:12px">Save Changes</button>
  </section>

  <section class="settings-card"><div class="eyebrow" style="margin-bottom:16px">Security</div><div class="settings-row"><div><strong>Change Password</strong><div style="font-size:12px;color:#666">Keep your account secure</div></div><button class="btn-ghost" onclick="showToast('Password settings coming soon','info')">Change</button></div><div class="settings-row"><div><strong>Notifications</strong><div style="font-size:12px;color:#666">Manage booking alerts and reminders</div></div><button class="btn-ghost" onclick="showToast('Notification settings saved','success')">Manage</button></div></section>

  <!-- Points Gathered — providers only -->
  <section id="points-section" style="display:none;background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(0,0,0,0.02));border:1px solid var(--g-border);border-radius:24px;padding:28px;margin-bottom:20px;">
    <div class="eyebrow" style="margin-bottom:6px;">Loyalty Points</div>
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:4px;">
      <span id="points-balance" class="font-display gold-gradient" style="font-size:48px;font-weight:800;line-height:1;">0</span>
      <span style="font-size:14px;color:var(--t-muted);">points</span>
    </div>
    <div style="font-size:12px;color:var(--t-muted);margin-bottom:24px;">Awarded by SalonLink admin. Redeem for exclusive rewards.</div>

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t-muted);margin-bottom:10px;">Recent Transactions</div>
    <div id="points-history" style="margin-bottom:24px;"><div style="text-align:center;color:var(--t-muted);padding:16px;font-size:13px;">Loading...</div></div>

    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t-muted);margin-bottom:12px;">Available Rewards</div>
    <div id="rewards-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;"><div style="text-align:center;color:var(--t-muted);padding:20px;font-size:13px;">Loading rewards...</div></div>
  </section>

</div></div>
${mobileNav('settings')}
${globalScripts()}
<script>
(function(){
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if(!user.id){ location.href='/login'; return; }

  // Load loyalty points for providers
  if (user.role === 'provider') {
    var section = document.getElementById('points-section');
    if (section) section.style.display = 'block';
    var token = localStorage.getItem('sl_token');
    axios.get('/api/providers/me/points', { headers: { Authorization: 'Bearer ' + token } })
      .then(function(r) {
        var bal = document.getElementById('points-balance');
        if (bal) bal.textContent = (r.data.points || 0).toLocaleString();

        var hist = document.getElementById('points-history');
        var history = r.data.history || [];
        if (hist) {
          if (!history.length) {
            hist.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:12px;font-size:13px;">No point transactions yet.</div>';
          } else {
            hist.innerHTML = history.slice(0,5).map(function(h) {
              var isPos = h.points > 0;
              return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--i-faint);">' +
                '<div style="width:32px;height:32px;border-radius:9px;background:'+(isPos?'rgba(93,201,138,0.1)':'rgba(224,112,112,0.1)')+';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
                  '<i class="fas '+(isPos?'fa-plus':'fa-minus')+'" style="font-size:12px;color:'+(isPos?'#5DC98A':'#E07070')+';"></i>' +
                '</div>' +
                '<div style="flex:1;"><div style="font-size:13px;font-weight:600;">'+(h.description||h.type)+'</div>' +
                '<div style="font-size:11px;color:var(--t-muted);">'+(h.created_at||'').split('T')[0]+'</div></div>' +
                '<div style="font-size:15px;font-weight:800;color:'+(isPos?'#5DC98A':'#E07070')+';">'+(isPos?'+':'')+h.points+' pts</div>' +
              '</div>';
            }).join('');
          }
        }

        var grid = document.getElementById('rewards-grid');
        var rewards = r.data.available_rewards || [];
        if (grid) {
          if (!rewards.length) {
            grid.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:13px;grid-column:1/-1;">No rewards available yet. Check back soon!</div>';
          } else {
            var pts = r.data.points || 0;
            grid.innerHTML = rewards.map(function(rw) {
              var canClaim = pts >= rw.points_required;
              return '<div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:16px;text-align:center;">' +
                '<div style="font-size:13px;font-weight:700;margin-bottom:4px;">' + rw.name + '</div>' +
                '<div style="font-size:11px;color:var(--t-muted);margin-bottom:10px;">' + (rw.description||'') + '</div>' +
                '<div style="font-size:16px;font-weight:800;color:var(--g-main);margin-bottom:10px;">' + rw.points_required + ' pts</div>' +
                (canClaim
                  ? '<button onclick="claimReward('+rw.id+',\''+rw.name.replace(/\'/g,"\\'")+'\',' + rw.points_required + ')" class="btn-primary" style="width:100%;padding:8px;border-radius:100px;font-size:12px;">Claim</button>'
                  : '<div style="font-size:11px;color:var(--t-muted);padding:8px 0;">Need '+(rw.points_required-pts)+' more pts</div>'
                ) +
              '</div>';
            }).join('');
          }
        }
      }).catch(function(){});
  }
  function val(id,v){ var e=document.getElementById(id); if(e) e.value=v||''; }
  function txt(id,v){ var e=document.getElementById(id); if(e) e.textContent=v||''; }
  txt('user-avatar',(user.first_name||'U').charAt(0).toUpperCase());
  txt('user-name',((user.first_name||'')+' '+(user.last_name||'')).trim()||'Your Name');
  txt('user-email',user.email||'');
  val('inp-first',user.first_name); val('inp-last',user.last_name); val('inp-email',user.email); val('inp-phone',user.phone);
  var btn=document.getElementById('save-profile-btn');
  if(btn) btn.onclick=function(){
    var token=localStorage.getItem('sl_token');
    if(!token){ location.href='/login'; return; }
    axios.put('/api/auth/profile',{first_name:document.getElementById('inp-first').value,last_name:document.getElementById('inp-last').value,phone:document.getElementById('inp-phone').value},{headers:{Authorization:'Bearer '+token}}).then(function(res){localStorage.setItem('sl_user',JSON.stringify(res.data.user));showToast('Profile updated','success')}).catch(function(){showToast('Could not save profile','error')});
  }
})();

function claimReward(rewardId, name, pointsRequired) {
  if (!confirm('Claim "' + name + '" for ' + pointsRequired + ' points?')) return;
  var token = localStorage.getItem('sl_token');
  axios.post('/api/providers/me/claim-reward', { reward_item_id: rewardId }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Reward claimed! Admin will process your request. \u2726', 'success'); setTimeout(function(){ location.reload(); }, 2000); })
    .catch(function(e) { showToast((e.response&&e.response.data&&e.response.data.error)||'Could not claim reward', 'error'); });
}
</script>
</body></html>`
