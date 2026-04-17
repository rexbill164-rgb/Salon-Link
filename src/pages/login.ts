import { baseHead, globalScripts } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Sign In', `
<style>
  /* ── Full-screen split layout ── */
  .auth-split { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
  @media(max-width:800px){ .auth-split{ grid-template-columns:1fr; } .auth-left{ display:none!important; } }

  /* ── Left: immersive video hero ── */
  .auth-left {
    position:relative; overflow:hidden;
    display:flex; flex-direction:column; justify-content:space-between; padding:44px 52px;
  }
  .auth-left video {
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; z-index:0;
  }
  /* Dark gradient overlay — dark at top & bottom, slightly lighter in centre */
  .auth-left::after {
    content:''; position:absolute; inset:0; z-index:1;
    background: linear-gradient(to bottom,
      rgba(10,8,5,0.72) 0%,
      rgba(10,8,5,0.30) 40%,
      rgba(10,8,5,0.55) 75%,
      rgba(10,8,5,0.88) 100%);
  }
  .auth-left-content { position:relative; z-index:2; }

  /* ── Right: clean white form ── */
  .auth-right {
    display:flex; flex-direction:column; justify-content:center;
    padding:60px 56px; background:#FFFFFF; overflow-y:auto;
  }
  @media(max-width:1000px){ .auth-right { padding:48px 36px; } }

  .tab-pill { flex:1; padding:11px 12px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.3s; border:none; }
  .tab-pill.active { background:#FFFFFF; color:var(--t-primary); border:1px solid var(--i-faint); box-shadow:0 2px 12px rgba(58,47,30,0.1); }
  .tab-pill.inactive { background:transparent; color:var(--t-muted); }
  .demo-chip { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; background:var(--c-raise); border:1.5px solid var(--i-faint); cursor:pointer; transition:all 0.25s; width:100%; text-align:left; }
  .demo-chip:hover { border-color:var(--g-border); background:var(--g-dim); }

  /* Gold shimmer on logo icon */
  @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
  .logo-icon-glow { animation: shimmer 3s ease-in-out infinite; }
</style>
`)}
</head>
<body style="background:#FFFFFF;">

<div class="auth-split">

  <!-- ── LEFT PANEL: Full-screen video hero ── -->
  <div class="auth-left">

    <!-- Autoplay muted video loop — beauty salon ambience -->
    <video autoplay muted loop playsinline preload="auto"
      poster="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1000&q=80">
      <source src="https://cdn.coverr.co/videos/coverr-woman-getting-hair-styled-8163/1080p.mp4" type="video/mp4"/>
      <!-- Fallback: static image if video fails -->
    </video>

    <!-- TOP: Logo -->
    <a href="/" class="auth-left-content" style="display:flex;align-items:center;gap:14px;text-decoration:none;">
      <!-- Icon badge -->
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#C9922A,#E4B55A);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(201,146,42,0.5);flex-shrink:0;">
        <i class="fas fa-cut logo-icon-glow" style="color:#FFFFFF;font-size:16px;"></i>
      </div>
      <div>
        <div style="font-family:'Poppins',sans-serif;font-size:20px;font-weight:800;letter-spacing:0.08em;color:#FFFFFF;line-height:1;">SALONLINK</div>
        <div style="font-size:10px;font-weight:500;letter-spacing:0.18em;color:rgba(255,255,255,0.55);text-transform:uppercase;margin-top:3px;">Ghana&rsquo;s Beauty Network</div>
      </div>
    </a>

    <!-- BOTTOM: tagline + stats -->
    <div class="auth-left-content">
      <h2 style="font-family:'Poppins',sans-serif;font-size:clamp(26px,3.2vw,42px);font-weight:800;line-height:1.15;color:#FFFFFF;margin-bottom:16px;">
        Your beauty,<br/><span style="color:#E4B55A;">your time.</span>
      </h2>
      <p style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.8;margin-bottom:36px;max-width:320px;">
        Book Ghana&rsquo;s top salons, barbershops &amp; beauty pros — anytime, anywhere.
      </p>
      <!-- Social proof stats -->
      <div style="display:flex;gap:28px;">
        ${[
          {n:'500+', l:'Providers'},
          {n:'5K+',  l:'Bookings'},
          {n:'4.9★', l:'Avg Rating'},
        ].map(s=>`
          <div>
            <div style="font-size:20px;font-weight:800;color:#E4B55A;line-height:1;">${s.n}</div>
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:3px;letter-spacing:0.06em;">${s.l}</div>
          </div>
        `).join('')}
      </div>
    </div>

  </div>

  <!-- ── RIGHT PANEL ── -->
  <div class="auth-right">
    <div style="max-width:400px;width:100%;margin:0 auto;">

      <!-- Mobile logo -->
      <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;margin-bottom:40px;">
        <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#C9922A,#E4B55A);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(201,146,42,0.35);">
          <i class="fas fa-cut" style="color:#FFFFFF;font-size:14px;"></i>
        </div>
        <div>
          <div style="font-family:'Poppins',sans-serif;font-size:17px;font-weight:800;letter-spacing:0.07em;color:var(--t-primary);line-height:1;">SALONLINK</div>
          <div style="font-size:9px;color:var(--t-muted);letter-spacing:0.14em;text-transform:uppercase;margin-top:2px;">Ghana's Beauty Network</div>
        </div>
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
            <input type="email" id="email" class="input has-icon-left" placeholder="you@example.com" autocomplete="username" required/>
          </div>
        </div>
        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <label class="form-label" style="margin-bottom:0;">Password</label>
            <a href="#" style="font-size:11px;color:var(--g-deep);text-decoration:none;font-weight:600;">Forgot?</a>
          </div>
          <div class="input-wrap">
            <i class="fas fa-lock input-icon"></i>
            <input type="password" id="password" class="input has-icon-left has-icon-right" placeholder="••••••••" autocomplete="current-password" required/>
            <button type="button" onclick="togglePwd()" class="input-icon-right">
              <i id="eye-icon" class="fas fa-eye"></i>
            </button>
          </div>
        </div>



        <button type="submit" id="login-btn" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <span id="login-text"><i class="fas fa-sign-in-alt" style="margin-right:8px;font-size:12px;"></i>Sign In</span>
          <span id="login-loader" style="display:none;align-items:center;gap:8px;"><i class="fas fa-circle-notch" style="animation:spin-slow 0.8s linear infinite;font-size:13px;"></i> Signing in...</span>
        </button>
      </form>

      <!-- Phone form -->
      <div id="form-phone" style="display:none;">
        <!-- Step 1: enter phone -->
        <div id="phone-step-1">
          <div style="display:flex;align-items:center;gap:10px;background:rgba(37,211,102,0.08);border:1px solid rgba(37,211,102,0.25);border-radius:12px;padding:12px 14px;margin-bottom:18px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M13.507.135C6.07.135 0 6.143 0 13.505c0 2.387.634 4.624 1.737 6.558L0 24l4.073-1.67a13.4 13.4 0 0 0 6.27 1.56h.006c7.437 0 13.5-6.008 13.5-13.37 0-3.573-1.395-6.93-3.926-9.455A13.436 13.436 0 0 0 13.507.135zm0 24.453h-.005a11.13 11.13 0 0 1-5.677-1.553l-.408-.242-4.216 1.726 1.18-4.05-.264-.415A11.085 11.085 0 0 1 2.37 13.505c0-6.146 5.015-11.145 11.18-11.145 2.984 0 5.787 1.16 7.899 3.268a11.072 11.072 0 0 1 3.281 7.877c-.003 6.147-5.018 11.083-11.223 11.083z"/></svg>
            <span style="font-size:12px;color:#128C7E;font-weight:600;">OTP will be sent to your WhatsApp</span>
          </div>
          <div class="form-group">
            <label class="form-label">Ghana Phone Number</label>
            <div style="display:flex;gap:10px;">
              <div style="background:var(--c-raise);border:1.5px solid var(--i-faint);border-radius:var(--r-md);padding:15px 16px;font-size:14px;color:var(--t-secondary);white-space:nowrap;display:flex;align-items:center;gap:6px;">
                🇬🇭 <span style="color:var(--t-muted);">+233</span>
              </div>
              <input type="tel" id="phone-input" class="input" placeholder="20 000 0000" style="flex:1;" maxlength="10"/>
            </div>
          </div>
          <button id="send-otp-btn" onclick="sendOtp()" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
            Send OTP via WhatsApp
          </button>
        </div>

        <!-- Step 2: enter OTP -->
        <div id="phone-step-2" style="display:none;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="font-size:36px;margin-bottom:8px;">📲</div>
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;">Check your WhatsApp</div>
            <div style="font-size:13px;color:var(--t-muted);">We sent a 6-digit code to</div>
            <div style="font-size:14px;font-weight:700;color:var(--g-main);margin-top:4px;" id="phone-display"></div>
          </div>
          <!-- OTP boxes -->
          <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">
            ${[0,1,2,3,4,5].map(i=>`<input type="tel" maxlength="1" id="otp-${i}" class="input" style="width:46px;height:54px;text-align:center;font-size:22px;font-weight:700;padding:0;border-radius:12px;" oninput="otpInput(this,${i})" onkeydown="otpKey(event,${i})" inputmode="numeric"/>`).join('')}
          </div>
          <button id="verify-otp-btn" onclick="verifyOtp()" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
            Verify &amp; Sign In
          </button>
          <button onclick="backToPhone()" style="width:100%;margin-top:10px;background:none;border:none;color:var(--t-muted);font-size:12px;cursor:pointer;padding:8px;">
            ← Change number
          </button>
          <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--t-muted);">
            Didn't receive it? <button onclick="sendOtp(true)" style="background:none;border:none;color:var(--g-main);font-size:12px;cursor:pointer;font-weight:600;">Resend</button>
          </div>
        </div>
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
      var u = res.data.user;
      if (!u.name) u.name = (u.first_name || '') + (u.last_name ? ' ' + u.last_name : '');
      u.name = u.name.trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(u));
      showToast('Welcome back, ' + u.name + ' \u2726', 'success');
      setTimeout(function() {
        window.location.href = u.role==='admin' ? '/admin' : u.role==='provider' ? '/provider/dashboard' : '/discover';
      }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials. Please try again.';
    showToast(msg, 'error');
    btn.disabled = false; txt.style.display = 'inline'; load.style.display = 'none';
  }
}

// ── WhatsApp OTP ──
var _otpPhone = '';

async function sendOtp(resend) {
  var raw = document.getElementById('phone-input').value.replace(/\D/g,'');
  if (!resend && raw.length < 9) { showToast('Enter a valid phone number', 'error'); return; }
  if (resend) raw = _otpPhone;

  var btn = document.getElementById('send-otp-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  try {
    var res = await axios.post('/api/auth/otp/send', { phone: raw });
    _otpPhone = raw;

    if (res.data.via === 'demo' && res.data.otp_demo) {
      // No WhatsApp configured — show OTP on screen for demo
      showToast('Demo mode: Your OTP is ' + res.data.otp_demo, 'info');
      // Pre-fill OTP boxes
      var digits = res.data.otp_demo.split('');
      digits.forEach(function(d, i) {
        var el = document.getElementById('otp-' + i);
        if (el) el.value = d;
      });
    } else {
      showToast('OTP sent to your WhatsApp \u2726', 'success');
    }

    document.getElementById('phone-display').textContent = '+233 ' + raw;
    document.getElementById('phone-step-1').style.display = 'none';
    document.getElementById('phone-step-2').style.display = 'block';
    setTimeout(function(){ var el = document.getElementById('otp-0'); if(el) el.focus(); }, 100);
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Failed to send OTP';
    showToast(msg, 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg> Send OTP via WhatsApp'; }
  }
}

async function verifyOtp() {
  var otp = [0,1,2,3,4,5].map(function(i){ var el = document.getElementById('otp-'+i); return el ? el.value : ''; }).join('');
  if (otp.length < 6) { showToast('Enter the complete 6-digit code', 'error'); return; }

  var btn = document.getElementById('verify-otp-btn');
  btn.disabled = true; btn.textContent = 'Verifying...';

  try {
    var res = await axios.post('/api/auth/otp/verify', { phone: _otpPhone, otp: otp });
    if (res.data.token) {
      var uOtp = res.data.user;
      if (!uOtp.name) uOtp.name = ((uOtp.first_name||'') + (uOtp.last_name ? ' '+uOtp.last_name : '')).trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(uOtp));
      showToast('Welcome to SalonLink \u2726', 'success');
      setTimeout(function() {
        window.location.href = uOtp.role==='admin' ? '/admin' : uOtp.role==='provider' ? '/provider/dashboard' : '/discover';
      }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Incorrect OTP';
    showToast(msg, 'error');
    btn.disabled = false; btn.textContent = 'Verify & Sign In';
  }
}

function backToPhone() {
  document.getElementById('phone-step-1').style.display = 'block';
  document.getElementById('phone-step-2').style.display = 'none';
  var btn = document.getElementById('send-otp-btn');
  if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg> Send OTP via WhatsApp'; }
}

function otpInput(el, idx) {
  el.value = el.value.replace(/\D/g,'').slice(-1);
  if (el.value && idx < 5) { var next = document.getElementById('otp-'+(idx+1)); if(next) next.focus(); }
  // Auto-verify when all filled
  var otp = [0,1,2,3,4,5].map(function(i){ var e = document.getElementById('otp-'+i); return e ? e.value : ''; }).join('');
  if (otp.length === 6) verifyOtp();
}

function otpKey(e, idx) {
  if (e.key === 'Backspace' && !e.target.value && idx > 0) {
    var prev = document.getElementById('otp-'+(idx-1));
    if (prev) { prev.value = ''; prev.focus(); }
  }
}
</script>
</body></html>`
