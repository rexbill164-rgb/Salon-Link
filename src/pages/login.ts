import { baseHead, globalScripts } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Sign In', `
<style>
  .auth-split { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
  @media(max-width:768px){ .auth-split{ grid-template-columns:1fr; } .auth-left{ display:none!important; } }
  .auth-left { background:var(--c-dark); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; padding:60px; }
  .auth-right { display:flex; flex-direction:column; justify-content:center; padding:60px; background:var(--c-void); overflow-y:auto; }
  .tab-pill { flex:1; padding:11px 12px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border:none; }
  .tab-pill.active { background:var(--c-surface); color:var(--t-primary); border:1px solid var(--i-faint); box-shadow:0 4px 16px rgba(0,0,0,0.3); }
  .tab-pill.inactive { background:transparent; color:var(--t-faint); }
  .demo-chip { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:12px; background:var(--c-raise); border:1px solid var(--i-faint); cursor:pointer; transition:all 0.25s; }
  .demo-chip:hover { border-color:var(--g-border); background:var(--g-dim); }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<div class="auth-split">

  <!-- ── LEFT PANEL ── -->
  <div class="auth-left">
    <!-- Ambient orbs -->
    <div class="orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(201,168,76,0.07),transparent);top:-100px;right:-150px;animation:orb-pulse 8s ease infinite;"></div>
    <div class="orb" style="width:300px;height:300px;background:radial-gradient(circle,rgba(160,120,48,0.06),transparent);bottom:100px;left:-80px;"></div>

    <!-- Decorative grid -->
    <div class="bg-grid-fine" style="position:absolute;inset:0;opacity:0.6;"></div>

    <!-- Brand -->
    <a href="/" style="position:absolute;top:40px;left:60px;display:flex;align-items:center;gap:12px;text-decoration:none;">
      <div style="width:36px;height:36px;border:1px solid var(--g-border);border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      </div>
      <span style="font-family:'Playfair Display',serif;font-size:18px;letter-spacing:0.1em;color:var(--t-primary);">SALONLINK</span>
    </a>

    <!-- Big display text -->
    <div style="position:relative;z-index:1;">
      <div class="eyebrow" style="margin-bottom:24px;">Welcome Back</div>
      <h2 class="display-lg font-display" style="margin-bottom:20px;font-style:italic;line-height:1.1;">
        Your beauty<br/>journey continues.
      </h2>
      <p style="font-size:14px;color:var(--t-secondary);line-height:1.9;margin-bottom:52px;font-weight:300;max-width:320px;">
        Sign in to manage bookings, view your style history, and discover new professionals.
      </p>

      <!-- Feature list -->
      <div style="display:flex;flex-direction:column;gap:18px;">
        ${[
          {icon:'📅',text:'Manage all your appointments'},
          {icon:'🖼️',text:'View your complete hairstyle history'},
          {icon:'⭐',text:'Leave reviews for providers'},
        ].map(f=>`
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:38px;height:38px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;">${f.icon}</div>
            <span style="font-size:13px;color:var(--t-secondary);font-weight:300;">${f.text}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- ── RIGHT PANEL ── -->
  <div class="auth-right">
    <div style="max-width:420px;width:100%;margin:0 auto;">

      <!-- Mobile logo -->
      <a href="/" class="show-mob" style="display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:40px;">
        <div style="width:32px;height:32px;border:1px solid var(--g-border);border-radius:9px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:18px;letter-spacing:0.1em;">SALONLINK</span>
      </a>

      <h1 class="font-display" style="font-size:36px;font-weight:400;margin-bottom:10px;">Sign In</h1>
      <p style="font-size:14px;color:var(--t-secondary);margin-bottom:40px;">
        No account yet? <a href="/register" style="color:var(--g-main);text-decoration:none;font-weight:600;">Create one free →</a>
      </p>

      <!-- Tab switcher -->
      <div style="display:flex;background:var(--c-dark);border-radius:12px;padding:4px;gap:4px;margin-bottom:36px;border:1px solid var(--i-faint);">
        <button id="tab-email" onclick="switchTab('email')" class="tab-pill active">Email</button>
        <button id="tab-phone" onclick="switchTab('phone')" class="tab-pill inactive">Phone</button>
      </div>

      <!-- Email form -->
      <form id="form-email" onsubmit="handleLogin(event)" style="display:block;">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input type="email" id="email" class="input has-icon-left" placeholder="you@example.com" required/>
          </div>
        </div>
        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <label class="form-label" style="margin-bottom:0;">Password</label>
            <a href="#" style="font-size:11px;color:var(--g-main);text-decoration:none;">Forgot password?</a>
          </div>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="password" class="input has-icon-left has-icon-right" placeholder="••••••••" required/>
            <button type="button" onclick="togglePwd('password','eye-icon')" class="input-icon-right" style="transform:translateY(-50%);top:50%;">
              <svg id="eye-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <!-- Demo accounts -->
        <div style="background:var(--c-dark);border:1px solid var(--i-faint);border-radius:14px;padding:18px;margin-bottom:28px;">
          <div class="eyebrow" style="margin-bottom:14px;">Quick Demo Access</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              {role:'Customer',email:'customer@demo.com',color:'var(--s-green)',icon:'👤'},
              {role:'Provider',email:'provider@demo.com',color:'var(--g-main)',  icon:'💇'},
              {role:'Admin',   email:'admin@demo.com',   color:'var(--s-blue)', icon:'🛡️'},
            ].map(d=>`
              <button type="button" onclick="fillDemo('${d.email}')" class="demo-chip">
                <span style="font-size:16px;">${d.icon}</span>
                <div style="flex:1;text-align:left;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${d.color};">${d.role}</span>
                  <span style="font-size:12px;color:var(--t-secondary);margin-left:8px;">${d.email}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            `).join('')}
          </div>
          <div style="font-size:11px;color:var(--t-faint);margin-top:10px;">Password for all: <span style="color:var(--t-secondary);">Demo1234!</span></div>
        </div>

        <button type="submit" id="login-btn" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <span id="login-text">Sign In</span>
          <span id="login-loader" style="display:none;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin-slow 1s linear infinite"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg> Signing in...</span>
        </button>
      </form>

      <!-- Phone form -->
      <div id="form-phone" style="display:none;">
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div style="display:flex;gap:10px;">
            <div style="background:var(--c-mid);border:1px solid rgba(247,242,234,0.08);border-radius:var(--r-md);padding:15px 16px;font-size:14px;color:var(--t-secondary);white-space:nowrap;display:flex;align-items:center;gap:8px;">
              🇬🇭 <span style="color:var(--t-muted);">+233</span>
            </div>
            <input type="tel" id="phone" class="input" placeholder="20 000 0000" style="flex:1;"/>
          </div>
        </div>
        <button onclick="showToast('OTP sent to your number','success')" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          Send OTP Code
        </button>
        <p style="font-size:12px;color:var(--t-faint);text-align:center;margin-top:16px;">Demo: Use Email tab above for full demo access</p>
      </div>

    </div>
  </div>
</div>

${globalScripts()}
<script>
function switchTab(tab) {
  document.getElementById('form-email').style.display = tab==='email' ? 'block' : 'none';
  document.getElementById('form-phone').style.display = tab==='phone' ? 'block' : 'none';
  document.getElementById('tab-email').className = 'tab-pill ' + (tab==='email' ? 'active' : 'inactive');
  document.getElementById('tab-phone').className = 'tab-pill ' + (tab==='phone' ? 'active' : 'inactive');
}

function togglePwd(id, iconId) {
  var inp = document.getElementById(id);
  var icon = document.getElementById(iconId);
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    inp.type = 'password';
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}

function fillDemo(email) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = 'Demo1234!';
  showToast('Demo credentials filled ✦', 'info');
}

async function handleLogin(e) {
  e.preventDefault();
  var btn  = document.getElementById('login-btn');
  var txt  = document.getElementById('login-text');
  var load = document.getElementById('login-loader');
  btn.disabled = true; txt.style.display = 'none'; load.style.display = 'inline-flex';
  try {
    var res = await axios.post('/api/auth/login', {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    });
    if (res.data.token) {
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(res.data.user));
      showToast('Welcome back, ' + res.data.user.name + ' ✦', 'success');
      setTimeout(() => {
        var u = res.data.user;
        window.location.href = u.role==='admin' ? '/admin' : u.role==='provider' ? '/provider/dashboard' : '/discover';
      }, 800);
    }
  } catch(err) {
    var msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
    showToast(msg, 'error');
    btn.disabled = false; txt.style.display = 'inline'; load.style.display = 'none';
  }
}
</script>
</body></html>`
