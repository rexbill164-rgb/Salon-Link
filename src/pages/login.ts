import { baseHead, globalScripts } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Sign In', `
<style>
  html,body { height:100%; margin:0; padding:0; overflow:hidden; }
  /* Full-screen cinematic layout */
  .auth-wrap {
    position:fixed; inset:0;
    display:flex; align-items:center; justify-content:center;
  }
  /* Video / image background */
  .auth-bg {
    position:absolute; inset:0; overflow:hidden;
    background:#0a0a0a;
  }
  .auth-bg video, .auth-bg img.bg-img {
    width:100%; height:100%; object-fit:cover;
    opacity:0.55;
  }
  .auth-bg::after {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(135deg,
      rgba(5,5,5,0.88) 0%,
      rgba(20,20,20,0.60) 45%,
      rgba(5,5,5,0.84) 100%);
  }
  /* Card */
  .auth-card {
    position:relative; z-index:10;
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(28px);
    border-radius:26px;
    padding:44px 48px;
    width:100%; max-width:440px;
    box-shadow:0 40px 100px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.6);
    overflow-y:auto; max-height:92vh;
  }
  @media(max-width:520px){
    .auth-card{ border-radius:0; max-height:100vh; padding:36px 24px; max-width:100%; height:100vh; }
    html,body { overflow:auto; }
  }
  /* Logo bar above card */
  .auth-logo {
    position:absolute; top:32px; left:50%; transform:translateX(-50%);
    z-index:10; display:flex; align-items:center; gap:12px;
    text-decoration:none;
  }
  .auth-logo-icon {
    width:48px; height:48px; border-radius:15px;
    background:linear-gradient(145deg,#2e2e2e,#0f0f0f);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .auth-logo-text {
    font-family:'Poppins',sans-serif; font-size:20px; font-weight:800;
    letter-spacing:0.08em; color:#FFFFFF;
    text-shadow:0 2px 12px rgba(0,0,0,0.4);
  }
  .auth-logo-sub {
    font-size:10px; color:rgba(255,255,255,0.6);
    letter-spacing:0.18em; text-transform:uppercase; margin-top:1px;
  }
  .tab-pill { flex:1; padding:11px 12px; border-radius:8px; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.25s; border:none; background:transparent; color:#AAAAAA; }
  .tab-pill.active { background:#FFFFFF; color:#111111; border:1px solid #EEEEEE; box-shadow:0 2px 14px rgba(0,0,0,0.09); }
</style>
`)}
</head>
<body>

<div class="auth-wrap">
  <!-- ── Cinematic Background ── -->
  <div class="auth-bg">
    <!-- Fallback image shown while video loads or on mobile -->
    <img class="bg-img" id="bg-img"
      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80"
      alt="" loading="eager"/>
    <!-- Autoplay looping video (muted, no controls) -->
    <video id="bg-video" autoplay muted loop playsinline
      style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.55;">
      <source src="https://cdn.coverr.co/videos/coverr-a-woman-getting-a-haircut-at-a-salon-1584/mp4" type="video/mp4"/>
    </video>
  </div>

  <!-- ── Logo (above card) ── -->
  <a href="/" class="auth-logo">
    <div class="auth-logo-icon">
      <i class="fas fa-cut" style="color:#FFFFFF;font-size:18px;"></i>
    </div>
    <div>
      <div class="auth-logo-text">SALONLINK</div>
      <div class="auth-logo-sub">Ghana's Beauty Network</div>
    </div>
  </a>

  <!-- ── Login Card ── -->
  <div class="auth-card">
    <h1 style="font-size:26px;font-weight:700;margin-bottom:6px;color:var(--t-primary);">Welcome back</h1>
    <p style="font-size:13px;color:var(--t-secondary);margin-bottom:28px;">
      No account? <a href="/register" style="color:#111111;text-decoration:none;font-weight:700;">Create one free →</a>
    </p>

    <!-- Tab switcher -->
    <div style="display:flex;background:var(--c-dark);border-radius:10px;padding:3px;gap:3px;margin-bottom:24px;border:1px solid var(--i-faint);">
      <button id="tab-email" onclick="switchTab('email')" class="tab-pill active">
        <i class="fas fa-envelope" style="margin-right:5px;font-size:10px;"></i>Email
      </button>
      <button id="tab-phone" onclick="switchTab('phone')" class="tab-pill">
        <i class="fas fa-phone" style="margin-right:5px;font-size:10px;"></i>Phone / WhatsApp
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
          <a href="#" style="font-size:11px;color:#111111;text-decoration:none;font-weight:600;">Forgot?</a>
        </div>
        <div class="input-wrap">
          <i class="fas fa-lock input-icon"></i>
          <input type="password" id="password" class="input has-icon-left has-icon-right" placeholder="••••••••" autocomplete="current-password" required/>
          <button type="button" onclick="togglePwd()" class="input-icon-right">
            <i id="eye-icon" class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <button type="submit" id="login-btn" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;margin-top:4px;">
        <span id="login-text"><i class="fas fa-sign-in-alt" style="margin-right:8px;font-size:12px;"></i>Sign In</span>
        <span id="login-loader" style="display:none;align-items:center;gap:8px;"><i class="fas fa-circle-notch" style="animation:spin-slow 0.8s linear infinite;font-size:13px;"></i> Signing in...</span>
      </button>
    </form>

    <!-- Phone / WhatsApp form -->
    <div id="form-phone" style="display:none;">
      <div id="phone-step-1">
        <div style="display:flex;align-items:center;gap:10px;background:rgba(37,211,102,0.08);border:1px solid rgba(37,211,102,0.25);border-radius:12px;padding:12px 14px;margin-bottom:18px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M13.507.135C6.07.135 0 6.143 0 13.505c0 2.387.634 4.624 1.737 6.558L0 24l4.073-1.67a13.4 13.4 0 0 0 6.27 1.56h.006c7.437 0 13.5-6.008 13.5-13.37 0-3.573-1.395-6.93-3.926-9.455A13.436 13.436 0 0 0 13.507.135z"/></svg>
          <span style="font-size:12px;color:#128C7E;font-weight:600;">OTP sent to your WhatsApp</span>
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
        <button id="send-otp-btn" onclick="sendOtp()" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;">
          Send OTP via WhatsApp
        </button>
      </div>
      <div id="phone-step-2" style="display:none;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:36px;margin-bottom:8px;">📲</div>
          <div style="font-size:15px;font-weight:700;margin-bottom:4px;">Check your WhatsApp</div>
          <div style="font-size:13px;color:var(--t-muted);">Code sent to <span id="phone-display" style="color:#111111;font-weight:700;"></span></div>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px;">
          ${[0,1,2,3,4,5].map(i=>`<input type="tel" maxlength="1" id="otp-${i}" class="input" style="width:46px;height:54px;text-align:center;font-size:22px;font-weight:700;padding:0;border-radius:12px;" oninput="otpInput(this,${i})" onkeydown="otpKey(event,${i})" inputmode="numeric"/>`).join('')}
        </div>
        <button id="verify-otp-btn" onclick="verifyOtp()" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;">
          Verify &amp; Sign In
        </button>
        <button onclick="backToPhone()" style="width:100%;margin-top:10px;background:none;border:none;color:var(--t-muted);font-size:12px;cursor:pointer;padding:8px;">
          ← Change number
        </button>
        <div style="text-align:center;margin-top:12px;font-size:12px;color:var(--t-muted);">
          Didn't receive it? <button onclick="sendOtp(true)" style="background:none;border:none;color:#111111;font-size:12px;cursor:pointer;font-weight:600;">Resend</button>
        </div>
      </div>
    </div>
  </div>
</div>

${globalScripts()}
<script>
// Try to play video background, fallback to image
(function(){
  var vid = document.getElementById('bg-video');
  var img = document.getElementById('bg-img');
  if (!vid) return;
  vid.addEventListener('canplay', function(){
    vid.style.display = 'block';
    if (img) img.style.display = 'none';
  });
  vid.load();
})();

function switchTab(tab) {
  document.getElementById('form-email').style.display = tab==='email' ? 'block' : 'none';
  document.getElementById('form-phone').style.display = tab==='phone' ? 'block' : 'none';
  document.getElementById('tab-email').className = 'tab-pill ' + (tab==='email' ? 'active' : '');
  document.getElementById('tab-phone').className = 'tab-pill ' + (tab==='phone' ? 'active' : '');
}

function togglePwd() {
  var inp = document.getElementById('password');
  var icon = document.getElementById('eye-icon');
  if (inp.type === 'password') { inp.type='text'; icon.className='fas fa-eye-slash'; }
  else { inp.type='password'; icon.className='fas fa-eye'; }
}

async function handleLogin(e) {
  e.preventDefault();
  var btn=document.getElementById('login-btn'), txt=document.getElementById('login-text'), load=document.getElementById('login-loader');
  btn.disabled=true; txt.style.display='none'; load.style.display='inline-flex';
  try {
    var res = await axios.post('/api/auth/login', {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    });
    if (res.data.token) {
      var u = res.data.user;
      if (!u.name) u.name = ((u.first_name||'') + (u.last_name ? ' '+u.last_name : '')).trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(u));
      showToast('Welcome back, ' + u.name + ' \u2726', 'success');
      setTimeout(function(){ window.location.href = u.role==='admin'?'/admin':u.role==='provider'?'/provider/dashboard':'/discover'; }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials. Please try again.';
    showToast(msg, 'error');
    btn.disabled=false; txt.style.display='inline'; load.style.display='none';
  }
}

var _otpPhone = '';
async function sendOtp(resend) {
  var raw = resend ? _otpPhone : document.getElementById('phone-input').value.replace(/\D/g,'');
  if (!resend && raw.length < 9) { showToast('Enter a valid phone number', 'error'); return; }
  var btn = document.getElementById('send-otp-btn');
  if (btn) { btn.disabled=true; btn.textContent='Sending...'; }
  try {
    var res = await axios.post('/api/auth/otp/send', { phone: raw });
    _otpPhone = raw;
    if (res.data.via === 'demo' && res.data.otp_demo) {
      showToast('Demo OTP: ' + res.data.otp_demo, 'info');
      res.data.otp_demo.split('').forEach(function(d,i){ var el=document.getElementById('otp-'+i); if(el) el.value=d; });
    } else { showToast('OTP sent to WhatsApp \u2726', 'success'); }
    document.getElementById('phone-display').textContent = '+233 ' + raw;
    document.getElementById('phone-step-1').style.display='none';
    document.getElementById('phone-step-2').style.display='block';
    setTimeout(function(){ var el=document.getElementById('otp-0'); if(el) el.focus(); }, 100);
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Failed to send OTP';
    showToast(msg, 'error');
    if (btn) { btn.disabled=false; btn.textContent='Send OTP via WhatsApp'; }
  }
}

async function verifyOtp() {
  var otp = [0,1,2,3,4,5].map(function(i){ var el=document.getElementById('otp-'+i); return el?el.value:''; }).join('');
  if (otp.length < 6) { showToast('Enter the complete 6-digit code', 'error'); return; }
  var btn = document.getElementById('verify-otp-btn');
  btn.disabled=true; btn.textContent='Verifying...';
  try {
    var res = await axios.post('/api/auth/otp/verify', { phone: _otpPhone, otp: otp });
    if (res.data.token) {
      var u = res.data.user;
      if (!u.name) u.name = ((u.first_name||'') + (u.last_name ? ' '+u.last_name : '')).trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(u));
      showToast('Welcome to SalonLink \u2726', 'success');
      setTimeout(function(){ window.location.href = u.role==='admin'?'/admin':u.role==='provider'?'/provider/dashboard':'/discover'; }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Incorrect OTP';
    showToast(msg, 'error');
    btn.disabled=false; btn.textContent='Verify & Sign In';
  }
}

function otpInput(el, idx) {
  if (el.value && idx < 5) { var next=document.getElementById('otp-'+(idx+1)); if(next) next.focus(); }
}
function otpKey(e, idx) {
  if (e.key==='Backspace' && !e.target.value && idx > 0) { var prev=document.getElementById('otp-'+(idx-1)); if(prev){ prev.focus(); prev.value=''; } }
}
function backToPhone() {
  document.getElementById('phone-step-1').style.display='block';
  document.getElementById('phone-step-2').style.display='none';
}
</script>
</body></html>`
