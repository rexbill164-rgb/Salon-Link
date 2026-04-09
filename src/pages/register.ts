import { baseHead, globalScripts } from '../utils/layout'

export const registerPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Create Account', `
<style>
  .register-wrap { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; padding:50px 20px 100px; background:var(--c-deep); }
  .register-card { max-width:580px; width:100%; }
  .role-card {
    padding:22px; background:#FFFFFF; border:1.5px solid var(--i-faint); border-radius:var(--r-lg);
    text-align:center; cursor:pointer; transition:all 0.35s var(--ease-luxury);
    box-shadow:0 2px 12px rgba(58,47,30,0.05);
  }
  .role-card:hover { border-color:var(--g-border); background:var(--g-dim); transform:translateY(-2px); box-shadow:0 8px 24px rgba(160,120,48,0.12); }
  .role-card.selected { border-color:var(--g-main); background:rgba(201,168,76,0.06); box-shadow:0 0 0 3px rgba(201,168,76,0.1), 0 12px 36px rgba(160,120,48,0.14); }
  .strength-seg { flex:1; height:4px; border-radius:2px; background:var(--c-mist); transition:all 0.4s; }
</style>
`)}
</head>
<body style="background:var(--c-deep);">
<div class="register-wrap">
  <div class="register-card afu">

    <!-- Top bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:44px;">
      <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(160,120,48,0.3);">
          <i class="fas fa-star" style="color:#FFFFFF;font-size:13px;"></i>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:19px;letter-spacing:0.1em;color:var(--t-primary);">SALONLINK</span>
      </a>
      <a href="/login" style="font-size:13px;color:var(--t-secondary);text-decoration:none;">Already a member? <span style="color:var(--g-deep);font-weight:600;">Sign in</span></a>
    </div>

    <!-- Heading -->
    <div style="margin-bottom:36px;">
      <div class="eyebrow" style="margin-bottom:14px;"><i class="fas fa-sparkles" style="margin-right:6px;"></i>Get Started Free</div>
      <h1 class="font-display" style="font-size:40px;font-weight:400;line-height:1.1;color:var(--t-primary);">Create Your<br/><em class="gold-gradient">Account</em></h1>
    </div>

    <!-- Role selection -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:32px;">
      <div id="role-customer" onclick="selectRole('customer')" class="role-card selected">
        <div style="width:48px;height:48px;border-radius:14px;background:rgba(46,158,94,0.08);border:1px solid rgba(46,158,94,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <i class="fas fa-user" style="color:#1E8050;font-size:20px;"></i>
        </div>
        <div style="font-size:14px;font-weight:700;margin-bottom:5px;color:var(--t-primary);">Customer</div>
        <div style="font-size:12px;color:var(--t-secondary);line-height:1.5;font-weight:300;">Book beauty services from verified professionals</div>
      </div>
      <div id="role-provider" onclick="selectRole('provider')" class="role-card">
        <div style="width:48px;height:48px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <i class="fas fa-cut" style="color:var(--g-deep);font-size:20px;"></i>
        </div>
        <div style="font-size:14px;font-weight:700;margin-bottom:5px;color:var(--t-primary);">Provider</div>
        <div style="font-size:12px;color:var(--t-secondary);line-height:1.5;font-weight:300;">List your salon and grow your clientele</div>
      </div>
    </div>

    <!-- Form card -->
    <div style="background:#FFFFFF;border:1px solid var(--g-border);border-radius:var(--r-xl);padding:38px;box-shadow:0 8px 32px rgba(160,120,48,0.10);">
      <form onsubmit="handleRegister(event)" id="reg-form">
        <input type="hidden" id="role" value="customer"/>

        <!-- Name row -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <div class="input-wrap">
              <i class="fas fa-user input-icon" style="font-size:13px;"></i>
              <input type="text" id="firstName" class="input has-icon-left" placeholder="Kwame" required/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <div class="input-wrap">
              <i class="fas fa-user input-icon" style="font-size:13px;"></i>
              <input type="text" id="lastName" class="input has-icon-left" placeholder="Mensah" required/>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <i class="fas fa-envelope input-icon"></i>
            <input type="email" id="email" class="input has-icon-left" placeholder="you@example.com" required/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div style="display:flex;gap:10px;">
            <div style="background:var(--c-raise);border:1.5px solid var(--i-faint);border-radius:var(--r-md);padding:15px 16px;font-size:14px;color:var(--t-secondary);white-space:nowrap;display:flex;align-items:center;gap:8px;flex-shrink:0;">
              🇬🇭 <span style="color:var(--t-muted);">+233</span>
            </div>
            <input type="tel" id="phone" class="input" placeholder="20 000 0000" style="flex:1;" required/>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <i class="fas fa-lock input-icon"></i>
            <input type="password" id="password" class="input has-icon-left has-icon-right" placeholder="Min. 8 characters" required minlength="8" oninput="checkStrength(this.value)"/>
            <button type="button" onclick="togglePwd()" class="input-icon-right">
              <i id="eye-icon2" class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <!-- Strength bar -->
        <div style="display:flex;gap:5px;margin-bottom:22px;">
          ${[1,2,3,4].map(i=>`<div id="str${i}" class="strength-seg"></div>`).join('')}
        </div>

        <!-- Provider-only fields -->
        <div id="prov-fields" style="display:none;">
          <div class="divider" style="margin:4px 0 24px;"></div>
          <div class="eyebrow" style="margin-bottom:18px;"><i class="fas fa-store" style="margin-right:6px;"></i>Business Details</div>
          <div class="form-group">
            <label class="form-label">Business Name</label>
            <div class="input-wrap">
              <i class="fas fa-store input-icon" style="font-size:13px;"></i>
              <input type="text" id="bizName" class="input has-icon-left" placeholder="Your Salon Name"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Service Category</label>
            <div class="input-wrap">
              <i class="fas fa-tag input-icon" style="font-size:13px;"></i>
              <select id="serviceType" class="input has-icon-left">
                <option>Hair Salon</option>
                <option>Barbershop</option>
                <option>Nail Technician</option>
                <option>Massage Therapist</option>
                <option>Makeup Artist</option>
                <option>Lash Technician</option>
                <option>Spa &amp; Facials</option>
              </select>
            </div>
          </div>
          <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-md);padding:16px;margin-bottom:22px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <div style="width:32px;height:32px;border-radius:10px;background:rgba(201,168,76,0.15);display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-id-card" style="color:var(--g-deep);font-size:14px;"></i>
              </div>
              <div>
                <div style="font-size:13px;font-weight:600;color:var(--t-primary);margin-bottom:2px;">KYC Verification Required</div>
                <div style="font-size:11px;color:var(--t-secondary);">Ghana Card + Facial scan after registration</div>
              </div>
            </div>
            <div style="font-size:12px;color:var(--t-muted);line-height:1.6;">Your identity will be verified via Smile Identity to build client trust. Takes ~2 minutes.</div>
          </div>
        </div>

        <!-- Terms -->
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:26px;">
          <div style="width:18px;height:18px;border:1.5px solid var(--i-faint);border-radius:5px;margin-top:2px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;" id="terms-box" onclick="toggleTerms()"></div>
          <label onclick="toggleTerms()" style="font-size:12px;color:var(--t-secondary);line-height:1.7;cursor:pointer;">
            I agree to the <a href="#" style="color:var(--g-deep);font-weight:600;">Terms of Service</a> and <a href="#" style="color:var(--g-deep);font-weight:600;">Privacy Policy</a>. I understand SalonLink may contact me about my account.
          </label>
        </div>
        <input type="hidden" id="terms-accepted" value="false"/>

        <button type="submit" id="reg-btn" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <span id="reg-text"><i class="fas fa-user-plus" style="margin-right:8px;font-size:12px;"></i>Create Account</span>
          <span id="reg-loader" style="display:none;align-items:center;gap:8px;"><i class="fas fa-circle-notch" style="animation:spin-slow 0.8s linear infinite;font-size:13px;"></i> Creating...</span>
        </button>
      </form>
    </div>

    <!-- Social proof -->
    <div style="text-align:center;margin-top:28px;">
      <p style="font-size:12px;color:var(--t-muted);">
        <i class="fas fa-users" style="color:var(--g-main);margin-right:5px;"></i>
        Join <span style="color:var(--g-deep);font-weight:700;">50,000+</span> users already on SalonLink · Free forever
      </p>
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
  box.style.background = termsChecked ? 'var(--g-main)' : 'transparent';
  box.style.borderColor = termsChecked ? 'var(--g-main)' : 'var(--i-faint)';
  box.innerHTML = termsChecked ? '<i class="fas fa-check" style="color:#FFFFFF;font-size:9px;"></i>' : '';
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
  var icon = document.getElementById('eye-icon2');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function checkStrength(v) {
  var score = 0;
  if(v.length>=8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  var colors = ['','#C04848','#C9A84C','#88AA44','#2E9E5E'];
  for(var i=1;i<=4;i++){
    var el = document.getElementById('str'+i);
    el.style.background = i<=score ? colors[score] : 'var(--c-mist)';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  if (!termsChecked) { showToast('Please accept the Terms of Service', 'error'); return; }
  var btn = document.getElementById('reg-btn');
  var txt = document.getElementById('reg-text');
  var load = document.getElementById('reg-loader');
  btn.disabled=true; txt.style.display='none'; load.style.display='inline-flex';
  var role = document.getElementById('role').value;
  var firstName = document.getElementById('firstName').value.trim();
  var lastName  = document.getElementById('lastName').value.trim();
  var email     = document.getElementById('email').value.trim();
  var phone     = document.getElementById('phone').value.replace(/\s/g,'');
  var password  = document.getElementById('password').value;

  if(!firstName || !lastName) { showToast('Please enter your first and last name', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(!email)    { showToast('Please enter your email address', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(!phone)    { showToast('Please enter your phone number', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
  if(password.length < 8) { showToast('Password must be at least 8 characters', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }

  var payload = {
    first_name: firstName,
    last_name:  lastName,
    email:      email,
    phone:      '+233' + phone,
    password:   password,
    role:       role
  };
  if(role==='provider'){
    var bizName = document.getElementById('bizName') ? document.getElementById('bizName').value.trim() : '';
    var svcType = document.getElementById('serviceType') ? document.getElementById('serviceType').value : '';
    if(!bizName) { showToast('Please enter your business name', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
    if(!svcType) { showToast('Please select your service category', 'error'); btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none'; return; }
    payload.business_name    = bizName;
    payload.service_category = svcType;
  }
  try {
    var res = await axios.post('/api/auth/register', payload);
    if (res.data.token) {
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(res.data.user));
      showToast('Account created! Welcome to SalonLink ✦', 'success');
      setTimeout(function() {
        window.location.href = role==='provider' ? '/provider/onboarding' : '/discover';
      }, 1000);
    }
  } catch(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Registration failed. Please try again.';
    showToast(msg, 'error');
    btn.disabled=false; txt.style.display='inline-flex'; load.style.display='none';
  }
}

// Pre-select from URL
var urlRole = new URLSearchParams(location.search).get('role');
if(urlRole) selectRole(urlRole);
</script>
</body></html>`
