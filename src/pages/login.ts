import { baseHead, navbar, toastScript } from '../utils/layout'

export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Login')}</head>
<body style="min-height:100vh;display:flex;flex-direction:column">
${navbar()}
<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px 16px;background:linear-gradient(135deg,#0F0A1E,#1A0533)">
  <div style="width:100%;max-width:440px">
    <div class="text-center mb-8">
      <div style="font-size:48px;margin-bottom:12px">✂️</div>
      <h1 class="font-display font-bold text-3xl mb-2">Welcome back</h1>
      <p style="color:#9D8EC0">Sign in to your SalonLink account</p>
    </div>

    <!-- Login card -->
    <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:32px">
      <!-- Tabs -->
      <div style="display:flex;background:#0F0A1E;border-radius:12px;padding:4px;margin-bottom:24px">
        <button id="tab-email" onclick="switchTab('email')" class="flex-1 py-2.5 rounded-lg text-sm font-medium transition" style="background:#7C3AED;color:white">
          <i class="fas fa-envelope mr-2"></i>Email
        </button>
        <button id="tab-phone" onclick="switchTab('phone')" class="flex-1 py-2.5 rounded-lg text-sm font-medium transition" style="color:#9D8EC0">
          <i class="fas fa-phone mr-2"></i>Phone
        </button>
      </div>

      <!-- Email Form -->
      <form id="email-form" onsubmit="handleEmailLogin(event)">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Email Address</label>
          <div style="position:relative">
            <i class="fas fa-envelope" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9D8EC0"></i>
            <input type="email" id="email" placeholder="you@example.com" required
              class="w-full pl-10 pr-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3"/>
          </div>
        </div>
        <div class="mb-2">
          <label class="block text-sm font-medium mb-2">Password</label>
          <div style="position:relative">
            <i class="fas fa-lock" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9D8EC0"></i>
            <input type="password" id="password" placeholder="••••••••" required
              class="w-full pl-10 pr-12 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3"/>
            <button type="button" onclick="togglePwd()" style="position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#9D8EC0;background:none;border:none;cursor:pointer">
              <i class="fas fa-eye" id="pwd-eye"></i>
            </button>
          </div>
        </div>
        <div class="flex justify-end mb-6">
          <a href="#" class="text-sm" style="color:#7C3AED">Forgot password?</a>
        </div>
        <button type="submit" id="login-btn" class="w-full gradient-btn py-3.5 rounded-xl text-white font-bold text-base">
          <span id="login-text"><i class="fas fa-sign-in-alt mr-2"></i>Sign In</span>
          <span id="login-loader" style="display:none"><i class="fas fa-spinner fa-spin mr-2"></i>Signing in...</span>
        </button>
      </form>

      <!-- Phone Form -->
      <form id="phone-form" style="display:none" onsubmit="handlePhoneLogin(event)">
        <div class="mb-4" id="phone-step-1">
          <label class="block text-sm font-medium mb-2">Phone Number</label>
          <div style="position:relative">
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9D8EC0;font-size:13px">+233</span>
            <input type="tel" id="phone" placeholder="20 000 0000" required
              class="w-full pl-16 pr-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3"/>
          </div>
          <button type="button" onclick="sendOTP()" class="w-full mt-3 gradient-btn py-3.5 rounded-xl text-white font-bold text-base">
            <i class="fas fa-paper-plane mr-2"></i>Send OTP
          </button>
        </div>
        <div class="mb-4" id="phone-step-2" style="display:none">
          <label class="block text-sm font-medium mb-2">Enter 6-digit OTP</label>
          <div class="flex gap-2">
            ${[1,2,3,4,5,6].map(i => `<input type="text" maxlength="1" class="otp-input flex-1 text-center py-3 rounded-xl text-lg font-bold" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3" oninput="otpNext(this,${i})" id="otp${i}"/>`).join('')}
          </div>
          <p class="text-xs mt-2 text-center" style="color:#9D8EC0">OTP sent to +233 <span id="otp-phone"></span></p>
          <button type="submit" class="w-full mt-4 gradient-btn py-3.5 rounded-xl text-white font-bold text-base">
            <i class="fas fa-check-circle mr-2"></i>Verify & Login
          </button>
        </div>
      </form>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-6">
        <div style="flex:1;height:1px;background:#2D2250"></div>
        <span class="text-xs" style="color:#9D8EC0">or continue with</span>
        <div style="flex:1;height:1px;background:#2D2250"></div>
      </div>

      <!-- Demo Accounts -->
      <div style="background:#0F0A1E;border-radius:12px;padding:16px;margin-bottom:24px">
        <p class="text-xs font-semibold mb-3" style="color:#9D8EC0">🧪 Demo Accounts (for testing)</p>
        <div class="flex flex-col gap-2">
          <button onclick="fillDemo('customer@demo.com','Demo1234!')" class="text-left text-xs px-3 py-2 rounded-lg hover:bg-purple-900 transition" style="border:1px solid #2D2250">
            <span style="color:#10B981">●</span> Customer: customer@demo.com / Demo1234!
          </button>
          <button onclick="fillDemo('provider@demo.com','Demo1234!')" class="text-left text-xs px-3 py-2 rounded-lg hover:bg-purple-900 transition" style="border:1px solid #2D2250">
            <span style="color:#7C3AED">●</span> Provider: provider@demo.com / Demo1234!
          </button>
          <button onclick="fillDemo('admin@demo.com','Demo1234!')" class="text-left text-xs px-3 py-2 rounded-lg hover:bg-purple-900 transition" style="border:1px solid #2D2250">
            <span style="color:#F59E0B">●</span> Admin: admin@demo.com / Demo1234!
          </button>
        </div>
      </div>

      <p class="text-center text-sm" style="color:#9D8EC0">
        Don't have an account? <a href="/register" style="color:#7C3AED;font-weight:600">Sign up free</a>
      </p>
    </div>
  </div>
</div>
${toastScript()}
<script>
function switchTab(tab) {
  document.getElementById('email-form').style.display = tab==='email'?'block':'none';
  document.getElementById('phone-form').style.display = tab==='phone'?'block':'none';
  document.getElementById('tab-email').style.background = tab==='email'?'#7C3AED':'transparent';
  document.getElementById('tab-email').style.color = tab==='email'?'white':'#9D8EC0';
  document.getElementById('tab-phone').style.background = tab==='phone'?'#7C3AED':'transparent';
  document.getElementById('tab-phone').style.color = tab==='phone'?'white':'#9D8EC0';
}
function togglePwd() {
  const inp = document.getElementById('password');
  const eye = document.getElementById('pwd-eye');
  inp.type = inp.type==='password'?'text':'password';
  eye.className = inp.type==='password'?'fas fa-eye':'fas fa-eye-slash';
}
function fillDemo(email, pwd) {
  document.getElementById('email').value = email;
  document.getElementById('password').value = pwd;
  switchTab('email');
}
function otpNext(el, idx) {
  if(el.value && idx < 6) document.getElementById('otp'+(idx+1)).focus();
}
async function sendOTP() {
  const phone = document.getElementById('phone').value;
  if(!phone){ showToast('Enter your phone number','error'); return; }
  document.getElementById('otp-phone').textContent = phone;
  document.getElementById('phone-step-1').style.display='none';
  document.getElementById('phone-step-2').style.display='block';
  showToast('OTP sent! Use 123456 for demo','info');
}
async function handleEmailLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const txt = document.getElementById('login-text');
  const loader = document.getElementById('login-loader');
  btn.disabled=true; txt.style.display='none'; loader.style.display='inline';
  try {
    const res = await axios.post('/api/auth/login', {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    });
    const {token, user} = res.data;
    localStorage.setItem('salonlink_token', token);
    localStorage.setItem('salonlink_user', JSON.stringify(user));
    showToast('Welcome back, '+user.name+'! 🎉','success');
    setTimeout(()=>{
      if(user.role==='admin') window.location.href='/admin';
      else if(user.role==='provider') window.location.href='/provider/dashboard';
      else window.location.href='/discover';
    }, 1000);
  } catch(err) {
    const msg = err.response?.data?.error || 'Login failed. Check your credentials.';
    showToast(msg,'error');
  } finally {
    btn.disabled=false; txt.style.display='inline'; loader.style.display='none';
  }
}
async function handlePhoneLogin(e) {
  e.preventDefault();
  const otp = [1,2,3,4,5,6].map(i=>document.getElementById('otp'+i).value).join('');
  if(otp.length<6){ showToast('Enter the 6-digit OTP','error'); return; }
  showToast('Demo: Phone login successful!','success');
  setTimeout(()=>window.location.href='/discover',1000);
}
</script>
</body></html>`
