import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const settingsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Settings')}</head>
<body style="background:var(--c-deep);">
${navbar('settings')}

<div style="padding:48px 0 120px;">
  <div class="container-sm">

    <div style="margin-bottom:52px;" class="afu">
      <div class="eyebrow" style="margin-bottom:16px;">Account</div>
      <h1 class="display-lg font-display">Your <em class="gold-gradient">Settings</em></h1>
    </div>

    <!-- Profile card -->
    <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:36px;margin-bottom:24px;" class="afu-1">
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:32px;flex-wrap:wrap;">
        <div id="user-avatar" style="width:72px;height:72px;border-radius:22px;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:2px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:28px;color:var(--g-main);cursor:pointer;transition:all 0.3s;" onclick="showToast('Photo upload coming soon','info')">U</div>
        <div>
          <div id="user-name" class="font-display" style="font-size:22px;margin-bottom:4px;">Your Name</div>
          <div id="user-email" style="font-size:13px;color:var(--t-secondary);">Loading...</div>
          <button onclick="showToast('Photo upload coming soon','info')" class="btn-ghost" style="margin-top:10px;font-size:11px;padding:7px 16px;">Change Photo</button>
        </div>
      </div>
      <div class="eyebrow" style="margin-bottom:20px;">Personal Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input id="inp-first" type="text" class="input" placeholder="First name"/>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input id="inp-last" type="text" class="input" placeholder="Last name"/>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input id="inp-email" type="email" class="input" placeholder="Email" readonly style="opacity:0.6;cursor:not-allowed;"/>
        </div>
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input id="inp-phone" type="tel" class="input" placeholder="+233 XX XXX XXXX"/>
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;">
        <button onclick="saveProfile()" class="btn-primary" style="padding:13px 32px;font-size:12px;">Save Changes</button>
        <button onclick="showToast('Changes discarded','info')" class="btn-ghost" style="padding:12px 24px;font-size:12px;">Discard</button>
      </div>
    </div>

    <!-- Security -->
    <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:24px;" class="afu-2">
      <div class="eyebrow" style="margin-bottom:24px;">Security</div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${[
          {label:'Change Password',  sub:'Last changed 30 days ago',    action:'Change'},
          {label:'Two-Factor Auth',  sub:'SMS verification — Enabled',  action:'Manage'},
          {label:'Active Sessions',  sub:'2 devices currently logged in',action:'View'},
        ].map(s=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:18px;background:var(--c-raise);border:1px solid var(--i-faint);border-radius:14px;gap:16px;flex-wrap:wrap;">
            <div>
              <div style="font-size:14px;font-weight:600;margin-bottom:3px;">${s.label}</div>
              <div style="font-size:12px;color:var(--t-secondary);">${s.sub}</div>
            </div>
            <button onclick="showToast('${s.action} ${s.label.toLowerCase()}','info')" class="btn-ghost" style="font-size:11px;padding:8px 18px;flex-shrink:0;">${s.action}</button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Notifications -->
    <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:24px;" class="afu-3">
      <div class="eyebrow" style="margin-bottom:24px;">Notification Preferences</div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${[
          {label:'Booking Confirmations',  on:true},
          {label:'Appointment Reminders',  on:true},
          {label:'Promotions & Discounts', on:false},
          {label:'Re-engagement Nudges',   on:true},
          {label:'New Provider Alerts',    on:false},
        ].map((n,i)=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--i-faint);">
            <span style="font-size:14px;">${n.label}</span>
            <div id="toggle-${i}" onclick="toggleSwitch(${i})" style="width:44px;height:24px;border-radius:12px;background:${n.on?'var(--g-main)':'var(--c-mist)'};cursor:pointer;position:relative;transition:background 0.3s;flex-shrink:0;">
              <div id="thumb-${i}" style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:3px;left:${n.on?'23px':'3px'};transition:left 0.3s;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Danger zone -->
    <div style="background:rgba(192,72,72,0.06);border:1px solid rgba(192,72,72,0.2);border-radius:var(--r-xl);padding:28px;">
      <div class="eyebrow" style="color:var(--s-red);margin-bottom:16px;">Danger Zone</div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div style="font-size:14px;font-weight:600;margin-bottom:4px;">Delete Account</div>
          <div style="font-size:12px;color:var(--t-secondary);">Permanently delete your SalonLink account and all data</div>
        </div>
        <button onclick="showToast('Please contact support to delete your account','error')" style="padding:10px 24px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;border:1px solid rgba(192,72,72,0.35);color:var(--s-red);transition:all 0.3s;" onmouseover="this.style.background='rgba(192,72,72,0.1)'" onmouseout="this.style.background='transparent'">Delete Account</button>
      </div>
    </div>

  </div>
</div>

${mobileNav('settings')}
${globalScripts()}
<script>
var states = [true,true,false,true,false];
function toggleSwitch(i) {
  states[i] = !states[i];
  document.getElementById('toggle-'+i).style.background = states[i] ? 'var(--g-main)' : 'var(--c-mist)';
  document.getElementById('thumb-'+i).style.left = states[i] ? '23px' : '3px';
  showToast(states[i] ? 'Notifications enabled' : 'Notifications disabled', states[i] ? 'success' : 'info');
}

// Load user info into settings form
document.addEventListener('DOMContentLoaded', function() {
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!user.id) { window.location.href = '/login'; return; }

  // Populate avatar initial
  var avatarEl = document.getElementById('user-avatar');
  if (avatarEl) avatarEl.textContent = (user.first_name || 'U')[0].toUpperCase();

  // Populate name shown in card
  var nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = (user.first_name || '') + ' ' + (user.last_name || '');
  var emailEl = document.getElementById('user-email');
  if (emailEl) emailEl.textContent = user.email || '';

  // Populate input fields by id
  var fn = document.getElementById('inp-first'); if (fn) fn.value = user.first_name || '';
  var ln = document.getElementById('inp-last');  if (ln) ln.value = user.last_name  || '';
  var em = document.getElementById('inp-email'); if (em) em.value = user.email      || '';
  var ph = document.getElementById('inp-phone'); if (ph) ph.value = user.phone      || '';
});

function saveProfile() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }
  var data = {
    first_name: document.getElementById('inp-first').value,
    last_name:  document.getElementById('inp-last').value,
    phone:      document.getElementById('inp-phone').value,
  };
  axios.put('/api/auth/profile', data, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(res) {
      localStorage.setItem('sl_user', JSON.stringify(res.data.user));
      showToast('Profile updated ✦', 'success');
    })
    .catch(function() { showToast('Could not save profile', 'error'); });
}
</script>
</body></html>`
