import { baseHead, navbar, toastScript } from '../utils/layout'

export const registerPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Create Account')}</head>
<body>
${navbar()}
<div style="min-height:calc(100vh - 64px);display:flex;align-items:center;justify-content:center;padding:40px 16px;background:linear-gradient(135deg,#0F0A1E,#1A0533)">
  <div style="width:100%;max-width:520px">
    <div class="text-center mb-8">
      <div style="font-size:48px;margin-bottom:12px">✨</div>
      <h1 class="font-display font-bold text-3xl mb-2">Create your account</h1>
      <p style="color:#9D8EC0">Join SalonLink for free</p>
    </div>

    <!-- Role selector -->
    <div class="grid grid-cols-2 gap-4 mb-8" id="role-selector">
      <div id="role-customer" onclick="selectRole('customer')" class="p-5 rounded-2xl cursor-pointer transition" style="background:#1A1033;border:2px solid #7C3AED">
        <div style="font-size:36px;margin-bottom:10px">👤</div>
        <div class="font-semibold mb-1">Customer</div>
        <div class="text-xs" style="color:#9D8EC0">Book beauty services near you</div>
      </div>
      <div id="role-provider" onclick="selectRole('provider')" class="p-5 rounded-2xl cursor-pointer transition" style="background:#1A1033;border:2px solid #2D2250">
        <div style="font-size:36px;margin-bottom:10px">💼</div>
        <div class="font-semibold mb-1">Provider</div>
        <div class="text-xs" style="color:#9D8EC0">List your salon or services</div>
      </div>
    </div>

    <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:32px">
      <form id="register-form" onsubmit="handleRegister(event)">
        <input type="hidden" id="role" value="customer"/>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-2">First Name</label>
            <input type="text" id="firstName" placeholder="Kwame" required
              class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Last Name</label>
            <input type="text" id="lastName" placeholder="Mensah" required
              class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Email Address</label>
          <div style="position:relative">
            <i class="fas fa-envelope" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9D8EC0"></i>
            <input type="email" id="reg-email" placeholder="you@example.com" required
              class="w-full pl-10 pr-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Phone Number</label>
          <div style="display:flex;gap:8px">
            <select class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3;width:100px">
              <option value="+233">🇬🇭 +233</option>
              <option value="+234">🇳🇬 +234</option>
              <option value="+1">🇺🇸 +1</option>
            </select>
            <input type="tel" id="reg-phone" placeholder="20 000 0000" required
              class="flex-1 px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Password</label>
          <div style="position:relative">
            <i class="fas fa-lock" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9D8EC0"></i>
            <input type="password" id="reg-password" placeholder="Min. 8 characters" required minlength="8"
              class="w-full pl-10 pr-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250" oninput="checkPwd(this.value)"/>
          </div>
          <!-- Password strength -->
          <div class="flex gap-1 mt-2" id="pwd-strength">
            <div class="flex-1 h-1 rounded-full" id="ps1" style="background:#2D2250"></div>
            <div class="flex-1 h-1 rounded-full" id="ps2" style="background:#2D2250"></div>
            <div class="flex-1 h-1 rounded-full" id="ps3" style="background:#2D2250"></div>
            <div class="flex-1 h-1 rounded-full" id="ps4" style="background:#2D2250"></div>
          </div>
          <p class="text-xs mt-1" id="pwd-hint" style="color:#9D8EC0">Use 8+ characters with numbers & symbols</p>
        </div>

        <!-- Provider-only fields -->
        <div id="provider-fields" style="display:none">
          <div class="mb-4" style="background:#0F0A1E;border-radius:12px;padding:16px">
            <p class="text-xs font-semibold mb-3" style="color:#9D8EC0"><i class="fas fa-info-circle mr-1" style="color:#7C3AED"></i>Provider Info (optional – complete in dashboard)</p>
            <div class="mb-3">
              <label class="block text-xs font-medium mb-1">Business Name</label>
              <input type="text" id="businessName" placeholder="My Salon Name"
                class="w-full px-4 py-2.5 rounded-xl text-sm" style="background:#1A1033;border:1px solid #2D2250"/>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">Service Type</label>
              <select id="serviceType" class="w-full px-4 py-2.5 rounded-xl text-sm" style="background:#1A1033;border:1px solid #2D2250;color:#E2D9F3">
                <option>Hair Salon</option>
                <option>Barbershop</option>
                <option>Nail Technician</option>
                <option>Massage Therapist</option>
                <option>Makeup Artist</option>
                <option>Lash Technician</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3 mb-6">
          <input type="checkbox" id="terms" required class="mt-1 w-4 h-4 rounded" style="accent-color:#7C3AED"/>
          <label for="terms" class="text-sm" style="color:#9D8EC0">
            I agree to the <a href="#" style="color:#7C3AED">Terms of Service</a> and <a href="#" style="color:#7C3AED">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" id="reg-btn" class="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-base">
          <span id="reg-text"><i class="fas fa-user-plus mr-2"></i>Create Account</span>
          <span id="reg-loader" style="display:none"><i class="fas fa-spinner fa-spin mr-2"></i>Creating account...</span>
        </button>
      </form>

      <p class="text-center text-sm mt-6" style="color:#9D8EC0">
        Already have an account? <a href="/login" style="color:#7C3AED;font-weight:600">Sign in</a>
      </p>
    </div>
  </div>
</div>
${toastScript()}
<script>
let selectedRole = 'customer';
// Auto-select role from URL
const urlRole = new URLSearchParams(window.location.search).get('role');
if(urlRole) selectRole(urlRole);

function selectRole(role) {
  selectedRole = role;
  document.getElementById('role').value = role;
  document.getElementById('role-customer').style.borderColor = role==='customer'?'#7C3AED':'#2D2250';
  document.getElementById('role-provider').style.borderColor = role==='provider'?'#7C3AED':'#2D2250';
  document.getElementById('provider-fields').style.display = role==='provider'?'block':'none';
}
function checkPwd(val) {
  const bars = [document.getElementById('ps1'),document.getElementById('ps2'),document.getElementById('ps3'),document.getElementById('ps4')];
  const hints = document.getElementById('pwd-hint');
  let strength = 0;
  if(val.length>=8) strength++;
  if(/[A-Z]/.test(val)) strength++;
  if(/[0-9]/.test(val)) strength++;
  if(/[^A-Za-z0-9]/.test(val)) strength++;
  const colors = ['#EF4444','#F59E0B','#3B82F6','#10B981'];
  const labels = ['Too weak','Fair','Good','Strong 💪'];
  bars.forEach((b,i)=>{ b.style.background = i<strength ? colors[strength-1] : '#2D2250'; });
  if(strength>0) hints.textContent = labels[strength-1];
}
async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('reg-btn');
  const txt = document.getElementById('reg-text');
  const loader = document.getElementById('reg-loader');
  btn.disabled=true; txt.style.display='none'; loader.style.display='inline';
  try {
    const body = {
      name: document.getElementById('firstName').value+' '+document.getElementById('lastName').value,
      email: document.getElementById('reg-email').value,
      phone: document.getElementById('reg-phone').value,
      password: document.getElementById('reg-password').value,
      role: selectedRole,
    };
    if(selectedRole==='provider') {
      body.businessName = document.getElementById('businessName').value;
      body.serviceType = document.getElementById('serviceType').value;
    }
    const res = await axios.post('/api/auth/register', body);
    const {token, user} = res.data;
    localStorage.setItem('salonlink_token', token);
    localStorage.setItem('salonlink_user', JSON.stringify(user));
    showToast('Account created! Welcome to SalonLink 🎉','success');
    setTimeout(()=>{
      if(user.role==='provider') window.location.href='/provider/onboarding';
      else window.location.href='/discover';
    },1200);
  } catch(err) {
    const msg = err.response?.data?.error || 'Registration failed. Try again.';
    showToast(msg,'error');
  } finally {
    btn.disabled=false; txt.style.display='inline'; loader.style.display='none';
  }
}
</script>
</body></html>`
