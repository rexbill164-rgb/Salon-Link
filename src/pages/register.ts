import { baseHead, globalScripts } from '../utils/layout'

export const registerPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Create Account', `
<style>
  .register-wrap { min-height:100vh; display:flex; align-items:flex-start; justify-content:center; padding:60px 20px 100px; background:var(--c-void); }
  .register-card { max-width:560px; width:100%; }
  .role-card { padding:24px; background:var(--c-raise); border:1px solid var(--i-faint); border-radius:var(--r-lg); text-align:center; cursor:pointer; transition:all 0.35s var(--ease-luxury); }
  .role-card:hover { border-color:var(--g-border); background:var(--g-dim); }
  .role-card.selected { border-color:var(--g-main); background:rgba(201,168,76,0.08); box-shadow:0 0 0 1px var(--g-border), 0 12px 40px rgba(201,168,76,0.1); }
  .strength-seg { flex:1; height:3px; border-radius:2px; background:var(--c-mist); transition:all 0.4s; }
</style>
`)}
</head>
<body>
<div class="register-wrap">
  <div class="register-card afu">

    <!-- Top bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:48px;">
      <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;">
        <div style="width:36px;height:36px;border:1px solid var(--g-border);border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:19px;letter-spacing:0.1em;">SALONLINK</span>
      </a>
      <a href="/login" style="font-size:13px;color:var(--t-secondary);text-decoration:none;">Already a member? <span style="color:var(--g-main);font-weight:600;">Sign in</span></a>
    </div>

    <!-- Heading -->
    <div style="margin-bottom:40px;">
      <div class="eyebrow" style="margin-bottom:16px;">Get Started Free</div>
      <h1 class="font-display" style="font-size:40px;font-weight:400;line-height:1.1;">Create Your<br/><em class="gold-gradient">Account</em></h1>
    </div>

    <!-- Role selection -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:36px;">
      <div id="role-customer" onclick="selectRole('customer')" class="role-card selected">
        <div style="font-size:36px;margin-bottom:14px;">👤</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:6px;">Customer</div>
        <div style="font-size:12px;color:var(--t-secondary);line-height:1.5;">Book beauty services from verified professionals</div>
      </div>
      <div id="role-provider" onclick="selectRole('provider')" class="role-card">
        <div style="font-size:36px;margin-bottom:14px;">💼</div>
        <div style="font-size:14px;font-weight:700;margin-bottom:6px;">Provider</div>
        <div style="font-size:12px;color:var(--t-secondary);line-height:1.5;">List your salon and grow your clientele</div>
      </div>
    </div>

    <!-- Form card -->
    <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:40px;">
      <form onsubmit="handleRegister(event)" id="reg-form">
        <input type="hidden" id="role" value="customer"/>

        <!-- Name row -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" id="firstName" class="input" placeholder="Kwame" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" id="lastName" class="input" placeholder="Mensah" required/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-wrap">
            <svg class="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input type="email" id="email" class="input has-icon-left" placeholder="you@example.com" required/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div style="display:flex;gap:10px;">
            <div style="background:var(--c-mid);border:1px solid rgba(247,242,234,0.08);border-radius:var(--r-md);padding:15px 16px;font-size:14px;color:var(--t-secondary);white-space:nowrap;display:flex;align-items:center;gap:8px;flex-shrink:0;">
              🇬🇭 <span style="color:var(--t-muted);">+233</span>
            </div>
            <input type="tel" id="phone" class="input" placeholder="20 000 0000" style="flex:1;" required/>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:8px;">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="password" class="input has-icon-left" placeholder="Min. 8 characters" required minlength="8" oninput="checkStrength(this.value)"/>
          </div>
        </div>
        <!-- Strength bar -->
        <div style="display:flex;gap:5px;margin-bottom:24px;">
          ${[1,2,3,4].map(i=>`<div id="str${i}" class="strength-seg"></div>`).join('')}
        </div>

        <!-- Provider-only fields -->
        <div id="prov-fields" style="display:none;">
          <div class="divider" style="margin-bottom:28px;"></div>
          <div class="eyebrow" style="margin-bottom:20px;">Business Details</div>
          <div class="form-group">
            <label class="form-label">Business Name</label>
            <input type="text" id="bizName" class="input" placeholder="Your Salon Name"/>
          </div>
          <div class="form-group">
            <label class="form-label">Service Category</label>
            <select id="serviceType" class="input">
              <option>Hair Salon</option>
              <option>Barbershop</option>
              <option>Nail Technician</option>
              <option>Massage Therapist</option>
              <option>Makeup Artist</option>
              <option>Lash Technician</option>
              <option>Spa &amp; Facials</option>
            </select>
          </div>
          <div style="background:var(--c-raise);border:1px solid var(--g-border);border-radius:var(--r-md);padding:18px;margin-bottom:24px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
              <div style="width:32px;height:32px;border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;font-size:16px;">🪪</div>
              <div>
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">KYC Verification Required</div>
                <div style="font-size:11px;color:var(--t-secondary);">Ghana Card + Facial scan after registration</div>
              </div>
            </div>
            <div style="font-size:12px;color:var(--t-muted);line-height:1.6;">Your identity will be verified via Smile Identity to build client trust. Takes ~2 minutes.</div>
          </div>
        </div>

        <!-- Terms -->
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:28px;">
          <div style="width:18px;height:18px;border:1px solid var(--i-faint);border-radius:5px;margin-top:2px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;" id="terms-box" onclick="toggleTerms()"></div>
          <label onclick="toggleTerms()" style="font-size:12px;color:var(--t-secondary);line-height:1.7;cursor:pointer;">
            I agree to the <a href="#" style="color:var(--g-main);">Terms of Service</a> and <a href="#" style="color:var(--g-main);">Privacy Policy</a>. I understand SalonLink may contact me about my account.
          </label>
        </div>
        <input type="hidden" id="terms-accepted" value="false"/>

        <button type="submit" id="reg-btn" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:13px;">
          <span id="reg-text">Create Account</span>
          <span id="reg-loader" style="display:none;">Creating...</span>
        </button>
      </form>
    </div>

    <!-- Social proof -->
    <div style="text-align:center;margin-top:32px;">
      <p style="font-size:12px;color:var(--t-faint);">Join <span style="color:var(--g-main);font-weight:600;">50,000+</span> users already on SalonLink · Free forever</p>
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
  box.innerHTML = termsChecked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#05040A" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
}

function selectRole(role) {
  document.getElementById('role').value = role;
  ['customer','provider'].forEach(r => {
    document.getElementById('role-'+r).className = 'role-card' + (r===role ? ' selected' : '');
  });
  document.getElementById('prov-fields').style.display = role==='provider' ? 'block' : 'none';
  // Pre-fill role from URL
}

function checkStrength(v) {
  var score = 0;
  if(v.length>=8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  var colors = ['','#C04848','#C9A84C','#88AA44','#3DAA6E'];
  for(var i=1;i<=4;i++){
    var el=document.getElementById('str'+i);
    el.style.background = i<=score ? colors[score] : 'var(--c-mist)';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  if (!termsChecked) { showToast('Please accept the Terms of Service', 'error'); return; }
  var btn=document.getElementById('reg-btn');
  var txt=document.getElementById('reg-text');
  var load=document.getElementById('reg-loader');
  btn.disabled=true; txt.style.display='none'; load.style.display='inline';
  var role = document.getElementById('role').value;
  var payload = {
    name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: '+233' + document.getElementById('phone').value.replace(/\\s/g,''),
    password: document.getElementById('password').value,
    role
  };
  if(role==='provider'){
    payload.businessName = document.getElementById('bizName').value;
    payload.serviceType  = document.getElementById('serviceType').value;
  }
  try {
    var res = await axios.post('/api/auth/register', payload);
    if (res.data.token) {
      localStorage.setItem('sl_token', res.data.token);
      localStorage.setItem('sl_user', JSON.stringify(res.data.user));
      showToast('Account created! Welcome to SalonLink ✦', 'success');
      setTimeout(() => {
        window.location.href = role==='provider' ? '/provider/onboarding' : '/discover';
      }, 1000);
    }
  } catch(err) {
    showToast(err.response?.data?.error || 'Registration failed. Please try again.', 'error');
    btn.disabled=false; txt.style.display='inline'; load.style.display='none';
  }
}

// Pre-select from URL
var urlRole = new URLSearchParams(location.search).get('role');
if(urlRole) selectRole(urlRole);
</script>
</body></html>`
