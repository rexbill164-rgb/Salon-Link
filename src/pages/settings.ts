import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const settingsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Settings')}</head>
<body class="bg-grain">
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
        <div style="width:72px;height:72px;border-radius:22px;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:2px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:28px;color:var(--g-main);cursor:pointer;transition:all 0.3s;" onclick="showToast('Photo upload coming soon','info')">K</div>
        <div>
          <div class="font-display" style="font-size:22px;margin-bottom:4px;">Demo Customer</div>
          <div style="font-size:13px;color:var(--t-secondary);">customer@demo.com</div>
          <button onclick="showToast('Photo upload coming soon','info')" class="btn-ghost" style="margin-top:10px;font-size:11px;padding:7px 16px;">Change Photo</button>
        </div>
      </div>
      <div class="eyebrow" style="margin-bottom:20px;">Personal Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${[
          {label:'First Name',val:'Demo',   type:'text'},
          {label:'Last Name', val:'Customer',type:'text'},
          {label:'Email',     val:'customer@demo.com',type:'email'},
          {label:'Phone',     val:'+233 20 000 0000',type:'tel'},
        ].map(f=>`
          <div class="form-group">
            <label class="form-label">${f.label}</label>
            <input type="${f.type}" class="input" value="${f.val}"/>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;">
        <button onclick="showToast('Profile updated ✦','success')" class="btn-primary" style="padding:13px 32px;font-size:12px;">Save Changes</button>
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
</script>
</body></html>`
