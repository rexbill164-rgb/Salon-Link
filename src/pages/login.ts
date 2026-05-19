import { baseHead, globalScripts } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Log In', `
<style>
  body { background: #fafafa; min-height: 100vh; }
  
  /* ── Auth container ── */
  .auth-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }
  
  /* ── Logo ── */
  .auth-logo {
    text-decoration: none;
    margin-bottom: 40px;
    text-align: center;
  }
  .auth-logo-text {
    font-size: 28px;
    font-weight: 800;
    color: #101010;
    letter-spacing: -0.02em;
  }
  
  /* ── Auth card ── */
  .auth-card {
    background: #fff;
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  @media(max-width:480px) {
    .auth-card { padding: 32px 24px; border-radius: 20px; }
  }
  
  .auth-title {
    font-size: 24px;
    font-weight: 700;
    color: #101010;
    margin-bottom: 8px;
    text-align: center;
  }
  .auth-subtitle {
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-bottom: 32px;
  }
  .auth-subtitle a {
    color: #101010;
    font-weight: 600;
    text-decoration: none;
  }
  .auth-subtitle a:hover { text-decoration: underline; }
  
  /* ── Form styles ── */
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #101010;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    padding: 14px 16px;
    font-size: 15px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 12px;
    background: #fff;
    color: #101010;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus {
    border-color: #101010;
    box-shadow: 0 0 0 3px rgba(16,16,16,0.06);
  }
  .form-input::placeholder { color: #999; }
  
  .input-group {
    position: relative;
  }
  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 14px;
  }
  .input-group .form-input {
    padding-left: 44px;
  }
  .toggle-pwd {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 4px;
    font-size: 14px;
  }
  
  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .forgot-link {
    font-size: 13px;
    color: #101010;
    font-weight: 500;
    text-decoration: none;
  }
  .forgot-link:hover { text-decoration: underline; }
  
  /* ── Buttons ── */
  .btn-submit {
    width: 100%;
    padding: 16px 24px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: #101010;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
  }
  .btn-submit:hover { background: #2a2a2a; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  
  /* ── Tabs ── */
  .tab-container {
    display: flex;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
  }
  .tab-btn {
    flex: 1;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    background: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn.active {
    background: #fff;
    color: #101010;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  
  /* ── Notice ── */
  .notice-box {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 24px;
  }
  .notice-title {
    font-size: 13px;
    font-weight: 600;
    color: #1d4ed8;
    margin-bottom: 4px;
  }
  .notice-text {
    font-size: 12px;
    color: #3b82f6;
    line-height: 1.5;
  }
  
  /* ── OTP inputs ── */
  .otp-container {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 24px;
  }
  .otp-input {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s;
  }
  .otp-input:focus { border-color: #101010; }
  
  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 9999;
  }
  .modal-card {
    background: #fff;
    border-radius: 24px;
    padding: 36px 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    color: #888;
    cursor: pointer;
  }
  
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; }
</style>
`)}
</head>
<body>

<div class="auth-container">
  <a href="/" class="auth-logo">
    <div class="auth-logo-text">salonlink</div>
  </a>

  <div class="auth-card">
    <h1 class="auth-title">Welcome back</h1>
    <p class="auth-subtitle">
      Don&apos;t have an account? <a href="/register">Sign up</a>
    </p>

    <!-- Notice for password reset -->
    <div id="reset-notice" class="notice-box">
      <div class="notice-title">Existing users</div>
      <div class="notice-text">
        Temporary password: <strong>SalonLink2026</strong><br/>
        Use "Forgot password" to set your own.
      </div>
    </div>

    <!-- Tab switcher -->
    <div class="tab-container">
      <button id="tab-email" onclick="switchTab('email')" class="tab-btn active">Email</button>
      <button id="tab-phone" onclick="switchTab('phone')" class="tab-btn">Phone / WhatsApp</button>
    </div>

    <!-- Email form -->
    <form id="form-email" onsubmit="handleLogin(event)">
      <div class="form-group">
        <label class="form-label">Email</label>
        <div class="input-group">
          <i class="fas fa-envelope input-icon"></i>
          <input type="email" id="email" class="form-input" placeholder="you@example.com" required/>
        </div>
      </div>
      <div class="form-group">
        <div class="form-row">
          <label class="form-label" style="margin-bottom:0;">Password</label>
          <a href="#" onclick="showForgot();return false;" class="forgot-link">Forgot password?</a>
        </div>
        <div class="input-group">
          <i class="fas fa-lock input-icon"></i>
          <input type="password" id="password" class="form-input" placeholder="Enter your password" required/>
          <button type="button" onclick="togglePwd()" class="toggle-pwd">
            <i id="eye-icon" class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <button type="submit" id="login-btn" class="btn-submit">
        <span id="login-text">Log in</span>
        <span id="login-loader" style="display:none;"><i class="fas fa-circle-notch spinner"></i></span>
      </button>
    </form>

    <!-- Phone form -->
    <div id="form-phone" style="display:none;">
      <div id="phone-step-1">
        <div class="form-group">
          <label class="form-label">Phone number</label>
          <div style="display:flex;gap:10px;">
            <div style="padding:14px 16px;background:#f5f5f5;border-radius:12px;font-size:14px;color:#555;white-space:nowrap;">+233</div>
            <input type="tel" id="phone-input" class="form-input" placeholder="20 000 0000" maxlength="10"/>
          </div>
        </div>
        <button id="send-otp-btn" type="button" onclick="sendOtp()" class="btn-submit">
          Send code via WhatsApp
        </button>
      </div>
      <div id="phone-step-2" style="display:none;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:14px;color:#666;">Enter the code sent to</div>
          <div id="phone-display" style="font-size:16px;font-weight:600;color:#101010;margin-top:4px;"></div>
        </div>
        <div class="otp-container">
          ${[0,1,2,3,4,5].map(i=>`<input type="tel" maxlength="1" id="otp-${i}" class="otp-input" oninput="otpInput(this,${i})" onkeydown="otpKey(event,${i})" inputmode="numeric"/>`).join('')}
        </div>
        <button id="verify-otp-btn" type="button" onclick="verifyOtp()" class="btn-submit">
          Verify & log in
        </button>
        <div style="text-align:center;margin-top:16px;">
          <button onclick="backToPhone()" style="background:none;border:none;color:#666;font-size:13px;cursor:pointer;">Change number</button>
          <span style="color:#ddd;margin:0 8px;">|</span>
          <button onclick="sendOtp(true)" style="background:none;border:none;color:#101010;font-size:13px;font-weight:600;cursor:pointer;">Resend code</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Forgot Password Modal -->
<div id="forgot-modal" class="modal-overlay" style="display:none;">
  <div class="modal-card" style="position:relative;">
    <button onclick="closeForgot()" class="modal-close"><i class="fas fa-times"></i></button>
    
    <div id="forgot-step-1">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Reset password</h2>
      <p style="font-size:14px;color:#666;margin-bottom:24px;">Enter your email and we&apos;ll send you a code.</p>
      <div class="form-group">
        <input type="email" id="forgot-email" class="form-input" placeholder="Email address"/>
      </div>
      <button id="send-reset-btn" type="button" onclick="sendResetCode()" class="btn-submit">Send reset code</button>
    </div>
    
    <div id="forgot-step-2" style="display:none;">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Enter code</h2>
      <div id="reset-demo-info" class="notice-box" style="display:none;margin-bottom:16px;">
        <div class="notice-text">Demo code: <strong id="reset-demo-code"></strong></div>
      </div>
      <div class="form-group">
        <input type="text" id="reset-code-input" class="form-input" placeholder="6-digit code" maxlength="6"/>
      </div>
      <div class="form-group">
        <input type="password" id="reset-pw1" class="form-input" placeholder="New password"/>
      </div>
      <div class="form-group">
        <input type="password" id="reset-pw2" class="form-input" placeholder="Confirm new password"/>
      </div>
      <button id="confirm-reset-btn" type="button" onclick="confirmReset()" class="btn-submit">Reset password</button>
    </div>
    
    <div id="forgot-step-3" style="display:none;text-align:center;">
      <div style="width:64px;height:64px;border-radius:50%;background:#e8f5e9;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <i class="fas fa-check" style="font-size:24px;color:#00a862;"></i>
      </div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Password reset!</h2>
      <p style="font-size:14px;color:#666;margin-bottom:24px;">You can now log in with your new password.</p>
      <button onclick="closeForgot()" class="btn-submit">Continue to login</button>
    </div>
  </div>
</div>

${globalScripts()}
<script>
function switchTab(tab) {
  document.getElementById('form-email').style.display = tab==='email' ? 'block' : 'none';
  document.getElementById('form-phone').style.display = tab==='phone' ? 'block' : 'none';
  document.getElementById('tab-email').className = 'tab-btn ' + (tab==='email' ? 'active' : '');
  document.getElementById('tab-phone').className = 'tab-btn ' + (tab==='phone' ? 'active' : '');
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
      showToast('Welcome back!', 'success');
      setTimeout(function(){ window.location.href = u.role==='admin'?'/admin':u.role==='provider'?'/provider/dashboard':'/discover'; }, 600);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials';
    showToast(msg, 'error');
    btn.disabled=false; txt.style.display='inline'; load.style.display='none';
  }
}

var _otpPhone = '';
async function sendOtp(resend) {
  var raw = resend ? _otpPhone : document.getElementById('phone-input').value.replace(/\\D/g,'');
  if (!resend && raw.length < 9) { showToast('Enter a valid phone number', 'error'); return; }
  var btn = document.getElementById('send-otp-btn');
  if (btn) { btn.disabled=true; btn.textContent='Sending...'; }
  try {
    var res = await axios.post('/api/auth/otp/send', { phone: raw });
    _otpPhone = raw;
    if (res.data.via === 'demo' && res.data.otp_demo) {
      showToast('Demo OTP: ' + res.data.otp_demo, 'info');
      res.data.otp_demo.split('').forEach(function(d,i){ var el=document.getElementById('otp-'+i); if(el) el.value=d; });
    } else { showToast('Code sent to WhatsApp', 'success'); }
    document.getElementById('phone-display').textContent = '+233 ' + raw;
    document.getElementById('phone-step-1').style.display='none';
    document.getElementById('phone-step-2').style.display='block';
    setTimeout(function(){ var el=document.getElementById('otp-0'); if(el) el.focus(); }, 100);
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Failed to send code';
    showToast(msg, 'error');
    if (btn) { btn.disabled=false; btn.textContent='Send code via WhatsApp'; }
  }
}

async function verifyOtp() {
  var otp = [0,1,2,3,4,5].map(function(i){ var el=document.getElementById('otp-'+i); return el?el.value:''; }).join('');
  if (otp.length < 6) { showToast('Enter the complete code', 'error'); return; }
  var btn = document.getElementById('verify-otp-btn');
  btn.disabled=true; btn.textContent='Verifying...';
  try {
    var res = await axios.post('/api/auth/otp/verify', { phone: _otpPhone, otp: otp });
    if (res.data.token) {
      var u = res.data.user;
      if (!u.name) u.name = ((u.first_name||'') + (u.last_name ? ' '+u.last_name : '')).trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(u));
      showToast('Welcome!', 'success');
      setTimeout(function(){ window.location.href = u.role==='admin'?'/admin':u.role==='provider'?'/provider/dashboard':'/discover'; }, 600);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Incorrect code';
    showToast(msg, 'error');
    btn.disabled=false; btn.textContent='Verify & log in';
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

function showForgot() {
  document.getElementById('forgot-modal').style.display='flex';
  document.getElementById('forgot-email').focus();
}
function closeForgot() {
  document.getElementById('forgot-modal').style.display='none';
  document.getElementById('forgot-step-1').style.display='block';
  document.getElementById('forgot-step-2').style.display='none';
  document.getElementById('forgot-step-3').style.display='none';
}
var _forgotEmail = '';
async function sendResetCode() {
  var email = document.getElementById('forgot-email').value.trim();
  if (!email) { showToast('Enter your email', 'error'); return; }
  var btn = document.getElementById('send-reset-btn');
  btn.disabled=true; btn.textContent='Sending...';
  try {
    var res = await axios.post('/api/auth/reset-password/request', { email });
    _forgotEmail = email;
    if (res.data.demo_code) {
      document.getElementById('reset-demo-info').style.display='block';
      document.getElementById('reset-demo-code').textContent = res.data.demo_code;
    }
    document.getElementById('forgot-step-1').style.display='none';
    document.getElementById('forgot-step-2').style.display='block';
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Failed to send code';
    showToast(msg, 'error');
    btn.disabled=false; btn.textContent='Send reset code';
  }
}
async function confirmReset() {
  var code = document.getElementById('reset-code-input').value.trim();
  var pw1 = document.getElementById('reset-pw1').value;
  var pw2 = document.getElementById('reset-pw2').value;
  if (!code || code.length !== 6) { showToast('Enter the 6-digit code', 'error'); return; }
  if (!pw1 || pw1.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
  if (pw1 !== pw2) { showToast('Passwords do not match', 'error'); return; }
  var btn = document.getElementById('confirm-reset-btn');
  btn.disabled=true; btn.textContent='Resetting...';
  try {
    await axios.post('/api/auth/reset-password/confirm', { email: _forgotEmail, code, new_password: pw1 });
    document.getElementById('forgot-step-2').style.display='none';
    document.getElementById('forgot-step-3').style.display='block';
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Reset failed';
    showToast(msg, 'error');
    btn.disabled=false; btn.textContent='Reset password';
  }
}
</script>
</body></html>`
