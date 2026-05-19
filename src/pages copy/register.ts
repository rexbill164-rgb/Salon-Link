import { baseHead, globalScripts } from '../utils/layout'

export const registerPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Create Account', `
<style>
  body { background: #fafafa; min-height: 100vh; }
  
  .auth-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 24px 80px;
  }
  
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
  
  .auth-card {
    background: #fff;
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 520px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  @media(max-width:540px) {
    .auth-card { padding: 32px 24px; border-radius: 20px; }
  }
  
  .auth-title {
    font-size: 24px;
    font-weight: 700;
    color: #101010;
    margin-bottom: 8px;
  }
  .auth-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 32px;
  }
  .auth-subtitle a {
    color: #101010;
    font-weight: 600;
    text-decoration: none;
  }
  .auth-subtitle a:hover { text-decoration: underline; }
  
  /* Role cards */
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 32px;
  }
  .role-card {
    padding: 20px;
    background: #fff;
    border: 2px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .role-card:hover { border-color: rgba(0,0,0,0.15); }
  .role-card.selected {
    border-color: #101010;
    background: #fafafa;
  }
  .role-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 20px;
    color: #555;
  }
  .role-card.selected .role-icon {
    background: #101010;
    color: #fff;
  }
  .role-title {
    font-size: 14px;
    font-weight: 600;
    color: #101010;
    margin-bottom: 4px;
  }
  .role-desc {
    font-size: 12px;
    color: #888;
    line-height: 1.5;
  }
  
  /* Form styles */
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media(max-width:480px) {
    .form-row { grid-template-columns: 1fr; }
  }
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
  
  .phone-row {
    display: flex;
    gap: 10px;
  }
  .phone-prefix {
    padding: 14px 16px;
    background: #f5f5f5;
    border-radius: 12px;
    font-size: 14px;
    color: #555;
    white-space: nowrap;
  }
  
  /* Strength bar */
  .strength-bar {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }
  .strength-seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: #e5e5e5;
    transition: all 0.3s;
  }
  
  /* Provider fields */
  .provider-fields {
    padding-top: 24px;
    margin-top: 24px;
    border-top: 1px solid rgba(0,0,0,0.06);
  }
  .provider-fields-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 20px;
  }
  
  .kyc-notice {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
  }
  .kyc-notice-title {
    font-size: 13px;
    font-weight: 600;
    color: #101010;
    margin-bottom: 4px;
  }
  .kyc-notice-text {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }
  
  /* Terms */
  .terms-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
  .terms-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: 6px;
    margin-top: 2px;
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .terms-checkbox.checked {
    background: #101010;
    border-color: #101010;
  }
  .terms-text {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    cursor: pointer;
  }
  .terms-text a {
    color: #101010;
    font-weight: 500;
    text-decoration: none;
  }
  
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
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-submit:hover { background: #2a2a2a; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  
  .social-proof {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: #888;
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
    <h1 class="auth-title">Create your account</h1>
    <p class="auth-subtitle">
      Already have an account? <a href="/login">Log in</a>
    </p>

    <!-- Role selection -->
    <div class="role-grid">
      <div id="role-customer" onclick="selectRole('customer')" class="role-card selected">
        <div class="role-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="role-title">Customer</div>
        <div class="role-desc">Book beauty services</div>
      </div>
      <div id="role-provider" onclick="selectRole('provider')" class="role-card">
        <div class="role-icon">
          <i class="fas fa-scissors"></i>
        </div>
        <div class="role-title">Business</div>
        <div class="role-desc">List your services</div>
      </div>
    </div>

    <form onsubmit="handleRegister(event)" id="reg-form">
      <input type="hidden" id="role" value="customer"/>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">First name</label>
          <input type="text" id="firstName" class="form-input" placeholder="First name" required/>
        </div>
        <div class="form-group">
          <label class="form-label">Last name</label>
          <input type="text" id="lastName" class="form-input" placeholder="Last name" required/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Email</label>
        <div class="input-group">
          <i class="fas fa-envelope input-icon"></i>
          <input type="email" id="email" class="form-input" placeholder="you@example.com" required/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Phone number</label>
        <div class="phone-row">
          <div class="phone-prefix">+233</div>
          <input type="tel" id="phone" class="form-input" placeholder="20 000 0000" required/>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="input-group">
          <i class="fas fa-lock input-icon"></i>
          <input type="password" id="password" class="form-input" placeholder="Min. 8 characters" required minlength="8" oninput="checkStrength(this.value)"/>
          <button type="button" onclick="togglePwd()" class="toggle-pwd">
            <i id="eye-icon" class="fas fa-eye"></i>
          </button>
        </div>
        <div class="strength-bar">
          ${[1,2,3,4].map(i=>`<div id="str${i}" class="strength-seg"></div>`).join('')}
        </div>
      </div>

      <!-- Provider fields -->
      <div id="prov-fields" class="provider-fields" style="display:none;">
        <div class="provider-fields-title">Business details</div>
        <div class="form-group">
          <label class="form-label">Business name</label>
          <input type="text" id="bizName" class="form-input" placeholder="Your salon name"/>
        </div>
        <div class="form-group">
          <label class="form-label">Service category</label>
          <select id="serviceType" class="form-input">
            <option>Hair Salon</option>
            <option>Barbershop</option>
            <option>Nail Salon</option>
            <option>Massage & Spa</option>
            <option>Makeup Artist</option>
            <option>Lash Studio</option>
            <option>Skincare</option>
          </select>
        </div>
        <div class="kyc-notice">
          <div class="kyc-notice-title">Verification required</div>
          <div class="kyc-notice-text">Ghana Card + facial scan needed after signup to verify your identity and build client trust.</div>
        </div>
      </div>

      <div class="terms-row">
        <div id="terms-box" onclick="toggleTerms()" class="terms-checkbox"></div>
        <label onclick="toggleTerms()" class="terms-text">
          I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </label>
      </div>
      <input type="hidden" id="terms-accepted" value="false"/>

      <button type="submit" id="reg-btn" class="btn-submit">
        <span id="reg-text">Create account</span>
        <span id="reg-loader" style="display:none;"><i class="fas fa-circle-notch spinner"></i></span>
      </button>
    </form>

    <div class="social-proof">
      Join 50,000+ users on SalonLink
    </div>
  </div>
</div>

${globalScripts()}
<script>
var termsChecked = false;

function toggleTerms() {
  termsChecked = !termsChecked;
  document.getElementById('terms-accepted').value = termsChecked;
  var box = document.getElementById('terms-box');
  box.className = 'terms-checkbox' + (termsChecked ? ' checked' : '');
  box.innerHTML = termsChecked ? '<i class="fas fa-check" style="color:#fff;font-size:11px;"></i>' : '';
}

function selectRole(role) {
  document.getElementById('role').value = role;
  ['customer','provider'].forEach(function(r) {
    document.getElementById('role-'+r).className = 'role-card' + (r===role ? ' selected' : '');
  });
  document.getElementById('prov-fields').style.display = role==='provider' ? 'block' : 'none';
}

function togglePwd() {
  var inp = document.getElementById('password');
  var icon = document.getElementById('eye-icon');
  if (inp.type === 'password') { inp.type='text'; icon.className='fas fa-eye-slash'; }
  else { inp.type='password'; icon.className='fas fa-eye'; }
}

function checkStrength(v) {
  var score = 0;
  if(v.length>=8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  var colors = ['','#e53935','#ff9800','#8bc34a','#00a862'];
  for(var i=1;i<=4;i++){
    document.getElementById('str'+i).style.background = i<=score ? colors[score] : '#e5e5e5';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  if (!termsChecked) { showToast('Please accept the terms', 'error'); return; }
  var btn = document.getElementById('reg-btn');
  var txt = document.getElementById('reg-text');
  var load = document.getElementById('reg-loader');
  btn.disabled=true; txt.style.display='none'; load.style.display='inline-flex';
  
  var role = document.getElementById('role').value;
  var firstName = document.getElementById('firstName').value.trim();
  var lastName = document.getElementById('lastName').value.trim();
  var email = document.getElementById('email').value.trim();
  var phone = document.getElementById('phone').value.replace(/\\s/g,'');
  var password = document.getElementById('password').value;

  if(!firstName || !lastName) { showToast('Enter your name', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(!email) { showToast('Enter your email', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(!phone) { showToast('Enter your phone', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(password.length < 8) { showToast('Password must be 8+ characters', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }

  var payload = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: '+233' + phone,
    password: password,
    role: role
  };
  
  if(role==='provider'){
    var bizName = document.getElementById('bizName').value.trim();
    var svcType = document.getElementById('serviceType').value;
    if(!bizName) { showToast('Enter business name', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
    payload.business_name = bizName;
    payload.service_category = svcType;
  }
  
  try {
    var res = await axios.post('/api/auth/register', payload);
    if (res.data.token) {
      var u = res.data.user;
      if (!u.name) u.name = ((u.first_name||'') + (u.last_name ? ' '+u.last_name : '')).trim() || 'User';
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(u));
      showToast('Welcome to SalonLink!', 'success');
      setTimeout(function() {
        window.location.href = role==='provider' ? '/provider/onboarding' : '/discover';
      }, 800);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Registration failed';
    showToast(msg, 'error');
    btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none';
  }
}

var urlRole = new URLSearchParams(location.search).get('role');
if(urlRole) selectRole(urlRole);
</script>
</body></html>`
