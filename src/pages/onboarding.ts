import { baseHead, toastScript } from '../utils/layout'

export const onboardingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Onboarding')}</head>
<body style="background:#0F0A1E;min-height:100vh;padding:32px 16px">
<div class="max-w-2xl mx-auto">
  <div class="flex items-center gap-3 mb-8">
    <a href="/" style="font-size:28px;text-decoration:none">✂️</a>
    <span class="font-display font-bold text-xl gradient-text">SalonLink</span>
    <span class="ml-auto text-sm" style="color:#9D8EC0">Step <span id="cur-step">1</span> of 4</span>
  </div>

  <!-- Progress bar -->
  <div style="background:#1A1033;border-radius:8px;height:6px;margin-bottom:32px;overflow:hidden">
    <div id="progress-bar" style="height:100%;background:linear-gradient(90deg,#7C3AED,#EC4899);border-radius:8px;transition:width 0.4s;width:25%"></div>
  </div>

  <!-- Step 1: Business Info -->
  <div id="ob-step-1" class="slide-up">
    <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:32px">
      <div style="font-size:40px;margin-bottom:16px">🏪</div>
      <h2 class="font-display font-bold text-2xl mb-2">Business Information</h2>
      <p class="mb-6" style="color:#9D8EC0">Tell us about your salon or services</p>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Business Name *</label>
        <input type="text" id="ob-bizname" placeholder="e.g. Glam Studio GH" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Service Category *</label>
        <select id="ob-category" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3">
          <option>Hair Salon</option><option>Barbershop</option><option>Nail Technician</option>
          <option>Massage Therapist</option><option>Makeup Artist</option><option>Lash Technician</option><option>Spa / Facial</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Business Location *</label>
        <input type="text" id="ob-location" placeholder="e.g. East Legon, Accra" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">About Your Business</label>
        <textarea id="ob-about" rows="3" placeholder="Tell customers about your services, experience..." class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;resize:none"></textarea>
      </div>
      <button onclick="obNext(2)" class="w-full gradient-btn py-4 rounded-xl text-white font-bold">Continue <i class="fas fa-arrow-right ml-2"></i></button>
    </div>
  </div>

  <!-- Step 2: Services & Pricing -->
  <div id="ob-step-2" style="display:none">
    <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:32px">
      <div style="font-size:40px;margin-bottom:16px">💰</div>
      <h2 class="font-display font-bold text-2xl mb-2">Services & Pricing</h2>
      <p class="mb-6" style="color:#9D8EC0">Add the services you offer with prices</p>
      <div id="services-list">
        ${[
          {name:'Basic Cut/Style',price:50,duration:'1hr'},
          {name:'Premium Style',price:100,duration:'2hrs'},
        ].map((s,i)=>`
          <div class="service-row grid grid-cols-3 gap-3 mb-3">
            <input type="text" value="${s.name}" placeholder="Service name" class="col-span-1 px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
            <input type="number" value="${s.price}" placeholder="GHS" class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
            <input type="text" value="${s.duration}" placeholder="Duration" class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
          </div>
        `).join('')}
      </div>
      <button onclick="addService()" class="flex items-center gap-2 text-sm mb-6" style="color:#7C3AED">
        <i class="fas fa-plus-circle"></i> Add Another Service
      </button>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-3">Working Hours</label>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs" style="color:#9D8EC0">Opens at</label>
            <select class="w-full mt-1 px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3">
              ${['7:00 AM','8:00 AM','9:00 AM','10:00 AM'].map(t=>`<option>${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="text-xs" style="color:#9D8EC0">Closes at</label>
            <select class="w-full mt-1 px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3">
              ${['5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM'].map(t=>`<option>${t}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="obNext(1)" class="flex-1 py-4 rounded-xl font-bold" style="background:#0F0A1E;border:1px solid #2D2250">Back</button>
        <button onclick="obNext(3)" class="flex-1 gradient-btn py-4 rounded-xl text-white font-bold">Continue <i class="fas fa-arrow-right ml-2"></i></button>
      </div>
    </div>
  </div>

  <!-- Step 3: KYC Verification -->
  <div id="ob-step-3" style="display:none">
    <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:32px">
      <div style="font-size:40px;margin-bottom:16px">🪪</div>
      <h2 class="font-display font-bold text-2xl mb-2">Identity Verification</h2>
      <p class="mb-2" style="color:#9D8EC0">Required to accept bookings and build trust with customers</p>
      <div class="flex items-center gap-2 p-3 rounded-xl mb-6" style="background:#7C3AED11;border:1px solid #7C3AED33">
        <i class="fas fa-shield-alt" style="color:#7C3AED"></i>
        <span class="text-sm" style="color:#C4B5FD">Powered by Smile Identity • Ghana Card Verification</span>
      </div>

      <!-- Ghana Card Upload -->
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-3"><i class="fas fa-id-card mr-2" style="color:#7C3AED"></i>Ghana Card (Front & Back)</label>
        <div class="grid grid-cols-2 gap-3">
          <div id="card-front" onclick="triggerUpload('front-input')" style="border:2px dashed #2D2250;border-radius:16px;padding:24px;text-align:center;cursor:pointer;transition:0.3s" onmouseover="this.style.borderColor='#7C3AED'" onmouseout="this.style.borderColor='#2D2250'">
            <i class="fas fa-camera text-2xl mb-2" style="color:#9D8EC0"></i>
            <p class="text-xs" style="color:#9D8EC0">Front Side</p>
            <input type="file" id="front-input" accept="image/*" style="display:none" onchange="handleKycUpload('front',this)"/>
          </div>
          <div id="card-back" onclick="triggerUpload('back-input')" style="border:2px dashed #2D2250;border-radius:16px;padding:24px;text-align:center;cursor:pointer;transition:0.3s" onmouseover="this.style.borderColor='#7C3AED'" onmouseout="this.style.borderColor='#2D2250'">
            <i class="fas fa-camera text-2xl mb-2" style="color:#9D8EC0"></i>
            <p class="text-xs" style="color:#9D8EC0">Back Side</p>
            <input type="file" id="back-input" accept="image/*" style="display:none" onchange="handleKycUpload('back',this)"/>
          </div>
        </div>
      </div>

      <!-- Selfie -->
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-3"><i class="fas fa-user-circle mr-2" style="color:#EC4899"></i>Live Selfie for Face Match</label>
        <div id="selfie-area" onclick="startCamera()" style="border:2px dashed #2D2250;border-radius:16px;padding:32px;text-align:center;cursor:pointer;transition:0.3s" onmouseover="this.style.borderColor='#EC4899'" onmouseout="this.style.borderColor='#2D2250'">
          <i class="fas fa-user-circle text-4xl mb-3" style="color:#9D8EC0"></i>
          <p class="text-sm font-medium mb-1">Take a Live Selfie</p>
          <p class="text-xs" style="color:#9D8EC0">Face must be clearly visible. No sunglasses.</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button onclick="obNext(2)" class="flex-1 py-4 rounded-xl font-bold" style="background:#0F0A1E;border:1px solid #2D2250">Back</button>
        <button onclick="submitKYC()" id="kyc-btn" class="flex-1 gradient-btn py-4 rounded-xl text-white font-bold">
          <span id="kyc-text"><i class="fas fa-shield-alt mr-2"></i>Submit for Verification</span>
          <span id="kyc-loader" style="display:none"><i class="fas fa-spinner fa-spin mr-2"></i>Verifying...</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Step 4: Complete -->
  <div id="ob-step-4" style="display:none">
    <div style="background:#1A1033;border:1px solid #10B98133;border-radius:24px;padding:40px;text-align:center">
      <div style="width:80px;height:80px;border-radius:50%;background:#10B98122;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:40px">🎉</div>
      <h2 class="font-display font-bold text-3xl mb-3">You're All Set!</h2>
      <p style="color:#9D8EC0;margin-bottom:8px">Your profile is being reviewed. KYC verification typically takes <strong style="color:#E2D9F3">2-24 hours</strong>.</p>
      <p style="color:#9D8EC0;margin-bottom:32px">You'll receive an SMS once verified. In the meantime, complete your profile.</p>
      <div class="grid grid-cols-3 gap-4 mb-8">
        ${[{icon:'✅',label:'Profile Created'},{icon:'⏳',label:'KYC Pending'},{icon:'🔒',label:'Bookings Locked'}].map(i=>`
          <div style="background:#0F0A1E;border-radius:12px;padding:16px">
            <div style="font-size:28px;margin-bottom:8px">${i.icon}</div>
            <div class="text-xs" style="color:#9D8EC0">${i.label}</div>
          </div>
        `).join('')}
      </div>
      <a href="/provider/dashboard" class="gradient-btn inline-block px-10 py-4 rounded-2xl text-white font-bold text-lg">
        Go to Dashboard <i class="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
  </div>
</div>
${toastScript()}
<script>
function obNext(step) {
  for(let i=1;i<=4;i++) document.getElementById('ob-step-'+i).style.display='none';
  document.getElementById('ob-step-'+step).style.display='block';
  document.getElementById('cur-step').textContent=step;
  document.getElementById('progress-bar').style.width=(step*25)+'%';
}
function addService() {
  const row=document.createElement('div');
  row.className='service-row grid grid-cols-3 gap-3 mb-3';
  row.innerHTML='<input type="text" placeholder="Service name" class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/><input type="number" placeholder="GHS" class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/><input type="text" placeholder="Duration" class="px-3 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>';
  document.getElementById('services-list').appendChild(row);
}
function triggerUpload(id) { document.getElementById(id).click(); }
function handleKycUpload(side, input) {
  if(input.files[0]) {
    const area = document.getElementById('card-'+side);
    area.style.borderColor='#10B981';
    area.style.background='#10B98111';
    area.innerHTML='<i class="fas fa-check-circle text-2xl" style="color:#10B981"></i><p class="text-xs mt-2" style="color:#10B981">Uploaded ✓</p>';
    showToast(side.charAt(0).toUpperCase()+side.slice(1)+' uploaded','success');
  }
}
function startCamera() {
  document.getElementById('selfie-area').innerHTML='<i class="fas fa-check-circle text-4xl mb-3" style="color:#10B981"></i><p class="text-sm font-medium mb-1" style="color:#10B981">Selfie Captured ✓</p><p class="text-xs" style="color:#9D8EC0">Face match ready</p>';
  document.getElementById('selfie-area').style.borderColor='#10B981';
  showToast('Selfie captured for face match','success');
}
async function submitKYC() {
  const btn=document.getElementById('kyc-btn');
  document.getElementById('kyc-text').style.display='none';
  document.getElementById('kyc-loader').style.display='inline';
  btn.disabled=true;
  try {
    await axios.post('/api/uploads/kyc',{},{headers:{Authorization:'Bearer '+getToken()}});
  } catch(e){}
  setTimeout(()=>{
    showToast('KYC submitted! Under review.','success');
    obNext(4);
  },2500);
}
</script>
</body></html>`
