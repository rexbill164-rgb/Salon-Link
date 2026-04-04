import { baseHead, globalScripts } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Sign In', `
<style>
  .auth-split { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
  @media(max-width:768px){ .auth-split{ grid-template-columns:1fr; } .auth-left{ display:none!important; } }
  .auth-left {
    background:linear-gradient(160deg, #F5EDD8 0%, #EAD8A8 40%, #D4B870 100%);
    position:relative; overflow:hidden;
    display:flex; flex-direction:column; justify-content:flex-end; padding:60px;
  }
  .auth-right {
    display:flex; flex-direction:column; justify-content:center; padding:60px;
    background:#FFFFFF; overflow-y:auto;
  }
  .tab-pill { flex:1; padding:11px 12px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border:none; }
  .tab-pill.active { background:#FFFFFF; color:var(--t-primary); border:1px solid var(--i-faint); box-shadow:0 2px 12px rgba(58,47,30,0.1); }
  .tab-pill.inactive { background:transparent; color:var(--t-muted); }
  .demo-chip { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; background:var(--c-raise); border:1.5px solid var(--i-faint); cursor:pointer; transition:all 0.25s; width:100%; text-align:left; }
  .demo-chip:hover { border-color:var(--g-border); background:var(--g-dim); }
</style>
`)}
</head>
<body style="background:#FFFFFF;">

<div class="auth-split">

  <!-- ── LEFT PANEL (Gold Hero) ── -->
  <div class="auth-left">
    <!-- Background beauty image -->
    <div style="position:absolute;inset:0;overflow:hidden;">
      <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80" alt="Beauty" style="width:100%;height:100%;object-fit:cover;opacity:0.3;" loading="lazy"/>
    </div>
    <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(245,237,216,0.9) 0%,rgba(212,184,112,0.85) 60%,rgba(160,120,48,0.92) 100%);"></div>

    <!-- Brand -->
    <a href="/" style="position:absolute;top:40px;left:60px;display:flex;align-items:center;gap:12px;text-decoration:none;z-index:1;">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-star" style="color:#FFFFFF;font-size:13px;"></i>
      </div>
      <span style="font-family:'Playfair Display',serif;font-size:19px;letter-spacing:0.1em;color:#FFFFFF;">SALONLINK</span>
    </a>

    <!-- Big display text -->
    <div style="position:relative;z-index:1;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:20px;">Welcome Back</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,46px);font-weight:400;line-height:1.1;margin-bottom:18px;color:#FFFFFF;font-style:italic;">
        Your beauty<br/>journey continues.
      </h2>
      <p style="font-size:14px;color:rgba(255,255,255,0.75);line-height:1.9;margin-bottom:48px;font-weight:300;max-width:300px;">
        Sign in to manage bookings, view your style history, and discover new professionals.
      </p>

      <!-- Feature list -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${[
          {icon:'far fa-calendar-check', text:'Manage all your appointments'},
          {icon:'fas fa-images',          text:'View your complete style history'},
          {icon:'fas fa-star',            text:'Leave reviews for providers'},
        ].map(f=>`
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="${f.icon}" style="color:#FFFFFF;font-size:14px;"></i>
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.8);font-weight:300;">${f.text}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- ── RIGHT PANEL ── -->
  <div class="auth-right">
    <div style="max-width:400px;width:100%;margin:0 auto;">

      <!-- Mobile logo -->
      <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:40px;">
        <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(160,120,48,0.3);">
          <i class="fas fa-star" style="color:#FFFFFF;font-size:12px;"></i>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:18px;letter-spacing:0.1em;color:var(--t-primary);">SALONLINK</span>
      </a>

      <h1 class="font-display" style="font-size:34px;font-weight:400;margin-bottom:8px;color:var(--t-primary);">Sign In</h1>
      <p style="font-size:14px;color:var(--t-secondary);margin-bottom:36px;">
        No account yet? <a href="/register" style="color:var(--g-deep);text-decoration:none;font-weight:600;">Create one free →</a>
      </p>

      <!-- Tab switcher -->
      <div style="display:flex;background:var(--c-dark);border-radius:12px;padding:4px;gap:4px;margin-bottom:32px;border:1px solid var(--i-faint);">
        <button id="tab-email" onclick="switchTab('email')" class="tab-pill active">
          <i class="fas fa-envelope" style="margin-right:6px;font-size:10px;"></i>Email
        </button>
        <button id="tab-phone" onclick="switchTab('phone')" class="tab-pill inactive">
          <i class="fas fa-phone" style="margin-right:6px;font-size:10px;"></i>Phone
        </button>
      </div>

      <!-- Email form -->
      <form id="form-email" onsubmit="handleLogin(event)" style="display:block;">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <i class="fas fa-envelope input-icon"></i>
            <input type="email" id="email" class="input has-icon-left" placeholder="you@example.com" required/>
          </div>
        </div>
        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <label class="form-label" style="margin-bottom:0;">Password</label>
            <a href="#" style="font-size:11px;color:var(--g-deep);text-decoration:none;font-weight:600;">Forgot?</a>
          </div>
          <div class="input-wrap">
            <i class="fas fa-lock input-icon"></i>
            <input type="password" id="password" class="input has-icon-left has-icon-right" placeholder="••••••••" required/>
            <button type="button" onclick="togglePwd()" class="input-icon-right">
              <i id="eye-icon" class="fas fa-eye"></i>
            </button>
          </div>
        </div>

        <!-- Demo accounts -->
        <div style="background:var(--c-raise);border:1px solid var(--i-faint);border-radius:14px;padding:16px;margin-bottom:24px;">
          <div class="eyebrow" style="margin-bottom:12px;"><i class="fas fa-bolt" style="margin-right:6px;"></i>Quick Demo Access</div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            ${[
              {role:'Customer', email:'ama@example.com',       color:'#1E8050', icon:'fas fa-user',       bg:'rgba(46,158,94,0.08)'},
              {role:'Provider', email:'glam@example.com',      color:'var(--g-deep)', icon:'fas fa-cut',  bg:'var(--g-dim)'},
              {role:'Admin',    email:'admin@salonlink.com',   color:'#3A72C0', icon:'fas fa-shield-alt', bg:'rgba(58,114,192,0.08)'},
            ].map(d=>`
              <button type="button" onclick="fillDemo('${d.email}')" class="demo-chip">
                <div style="width:30px;height:30px;border-radius:9px;background:${d.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="${d.icon}" style="color:${d.color};font-size:12px;"></i>
                </div>
                <div style="flex:1;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${d.color};">${d.role}</div>
                  <div style="font-size:12px;color:var(--t-muted);">${d.email}</div>
                </div>
                <i class="fas fa-arrow-right" style="color:var(--t-faint);font-size:10px;"></i>
              </button>
            `).join('')}
          </div>
          <div style="font-size:11px;color:var(--t-faint);margin-top:10px;text-align:center;">Password: <span style="color:var(--t-secondary);font-weight:600;">Demo@123</span></div>
        </div>

        <button type="submit" id="login-btn" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <span id="login-text"><i class="fas fa-sign-in-alt" style="margin-right:8px;font-size:12px;"></i>Sign In</span>
          <span id="login-loader" style="display:none;align-items:center;gap:8px;"><i class="fas fa-circle-notch" style="animation:spin-slow 0.8s linear infinite;font-size:13px;"></i> Signing in...</span>
        </button>
      </form>

      <!-- Phone form -->
      <div id="form-phone" style="display:none;">
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div style="display:flex;gap:10px;">
            <div style="background:var(--c-raise);border:1.5px solid var(--i-faint);border-radius:var(--r-md);padding:15px 16px;font-size:14px;color:var(--t-secondary);white-space:nowrap;display:flex;align-items:center;gap:8px;">
              🇬🇭 <span style="color:var(--t-muted);">+233</span>
            </div>
            <input type="tel" id="phone" class="input" placeholder="20 000 0000" style="flex:1;"/>
          </div>
        </div>
        <button onclick="showToast('OTP sent to your number','success')" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <i class="fas fa-paper-plane" style="font-size:12px;"></i> Send OTP Code
        </button>
        <p style="font-size:12px;color:var(--t-faint);text-align:center;margin-top:16px;">Demo: Use Email tab for full demo access</p>
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

function togglePwd() {
  var inp = document.getElementById('password');
  var icon = document.getElementById('eye-icon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function fillDemo(email) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = 'Demo@123';
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
      setTimeout(function() {
        var u = res.data.user;
        window.location.href = u.role==='admin' ? '/admin' : u.role==='provider' ? '/provider/dashboard' : '/discover';
      }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials. Please try again.';
    showToast(msg, 'error');
    btn.disabled = false; txt.style.display = 'inline'; load.style.display = 'none';
  }
}
</script>
</body></html>`
