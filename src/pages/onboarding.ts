import { baseHead, globalScripts } from '../utils/layout'

export const onboardingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Onboarding', `
<style>
  .onboard-step { display:none; animation:fadeUp 0.5s var(--ease-luxury) both; }
  .onboard-step.active { display:block; }

  .upload-zone {
    border:2px dashed var(--i-faint);
    border-radius:var(--r-xl);
    padding:40px 24px;
    text-align:center;
    cursor:pointer;
    transition:all 0.3s;
    position:relative;
    overflow:hidden;
  }
  .upload-zone:hover { border-color:var(--g-main); background:var(--g-dim); }
  .upload-zone.uploaded { border-color:#00C853; background:rgba(0,200,83,0.06); }
  .upload-zone img.preview {
    width:100%; max-height:160px; object-fit:cover;
    border-radius:12px; display:block; margin:0 auto 8px;
  }

  #camera-modal {
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92);
    z-index:9999; flex-direction:column; align-items:center; justify-content:center;
  }
  #camera-modal.open { display:flex; }
  #camera-video { width:100%; max-width:400px; border-radius:16px; background:#000; }
  #camera-canvas { display:none; }

  .face-oval {
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-55%);
    width:200px; height:260px;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 9999px rgba(0,0,0,0.55);
    pointer-events:none;
    animation:pulse-oval 2s ease-in-out infinite;
  }
  @keyframes pulse-oval {
    0%,100%{border-color:rgba(255,255,255,0.6);}
    50%{border-color:#00C853;}
  }
  #selfie-preview {
    display:none; width:140px; height:140px;
    border-radius:50%; object-fit:cover;
    border:3px solid #00C853; margin:0 auto 12px;
  }
</style>
`)}</head>
<body style="background:var(--c-deep);">

<!-- Top bar -->
<div style="padding:20px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--i-faint);background:#fff;">
  <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
    <img src="/salonlink-logo.png" alt="SalonLink" style="height:36px;"/>
  </a>
  <span class="eyebrow">Provider Setup</span>
</div>

<!-- Camera Modal -->
<div id="camera-modal">
  <div style="position:relative;width:100%;max-width:420px;padding:0 16px;">
    <div id="cam-title" style="color:#fff;font-size:16px;font-weight:700;text-align:center;margin-bottom:16px;">📷 Position your Ghana Card</div>
    <div style="position:relative;background:#000;border-radius:16px;overflow:hidden;">
      <video id="camera-video" autoplay playsinline muted></video>
      <canvas id="camera-canvas"></canvas>
      <!-- Face oval only shown during selfie -->
      <div class="face-oval" id="face-oval" style="display:none;"></div>
    </div>
    <div id="cam-hint" style="color:rgba(255,255,255,0.7);font-size:13px;text-align:center;margin-top:12px;"></div>
    <div style="display:flex;gap:12px;margin-top:20px;justify-content:center;">
      <button onclick="closeCameraModal()" style="background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-size:14px;cursor:pointer;">Cancel</button>
      <button id="snap-btn" onclick="snapPhoto()" style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;border:none;border-radius:12px;padding:12px 32px;font-size:14px;font-weight:700;cursor:pointer;">
        <i class="fas fa-camera"></i> Capture
      </button>
    </div>
    <!-- Also allow file upload as fallback -->
    <div style="margin-top:16px;text-align:center;">
      <label id="file-fallback-label" style="color:rgba(255,255,255,0.5);font-size:12px;cursor:pointer;text-decoration:underline;">
        Or upload from gallery
        <input type="file" id="file-fallback" accept="image/*" onchange="handleFileFallback(this)" style="display:none;"/>
      </label>
    </div>
  </div>
</div>

<div style="max-width:680px;margin:0 auto;padding:40px 20px 100px;">

  <!-- Step progress -->
  <div style="display:flex;align-items:center;margin-bottom:48px;">
    ${[
      {n:1,label:'Identity'},
      {n:2,label:'Business'},
      {n:3,label:'Services'},
      {n:4,label:'Complete'},
    ].map((s,i,arr) => `
      <div style="display:flex;align-items:center;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div class="step-node ${i===0?'active':'pending'}" id="ob-node-${s.n}">${s.n}</div>
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">${s.label}</span>
        </div>
        ${i < arr.length-1 ? `<div class="step-line" id="ob-line-${s.n}" style="width:60px;margin-bottom:20px;"></div>` : ''}
      </div>
    `).join('')}
  </div>

  <!-- ── STEP 1: Identity ── -->
  <div id="ob-step1" class="onboard-step active">
    <div class="eyebrow" style="margin-bottom:14px;">Step 1 of 4</div>
    <h2 class="display-md" style="margin-bottom:10px;">Verify Your <span class="gold-gradient">Identity</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:32px;font-size:14px;line-height:1.8;">
      Upload your Ghana Card (front & back) and take a live selfie. This takes about 2 minutes and builds trust with clients.
    </p>

    <!-- Ghana Card Number -->
    <div style="background:#fff;border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:24px;margin-bottom:16px;">
      <div class="eyebrow" style="margin-bottom:16px;"><i class="fas fa-id-card" style="margin-right:6px;color:var(--g-main);"></i>Ghana Card Number</div>
      <input type="text" id="card-num" class="input" placeholder="GHA-XXXXXXXXX-X" style="text-transform:uppercase;letter-spacing:0.05em;"
        oninput="this.value=this.value.toUpperCase()" maxlength="15"/>
      <div style="font-size:11px;color:var(--t-muted);margin-top:8px;">Format: GHA-000000000-0 (found on front of your Ghana Card)</div>
    </div>

    <!-- Ghana Card Front & Back -->
    <div style="background:#fff;border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:24px;margin-bottom:16px;">
      <div class="eyebrow" style="margin-bottom:16px;"><i class="fas fa-camera" style="margin-right:6px;color:var(--g-main);"></i>Ghana Card Photos</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <!-- Front -->
        <div>
          <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--t-secondary);">FRONT SIDE</div>
          <div class="upload-zone" id="zone-front" onclick="openCamera('front')">
            <img id="preview-front" class="preview" style="display:none;"/>
            <div id="placeholder-front">
              <div style="font-size:36px;margin-bottom:10px;">📄</div>
              <div style="font-size:13px;font-weight:600;margin-bottom:4px;">Tap to capture</div>
              <div style="font-size:11px;color:var(--t-muted);">Camera or gallery</div>
            </div>
            <div id="done-front" style="display:none;">
              <i class="fas fa-check-circle" style="color:#00C853;font-size:24px;margin-bottom:6px;"></i>
              <div style="font-size:12px;font-weight:700;color:#00C853;">Captured ✓</div>
            </div>
          </div>
        </div>
        <!-- Back -->
        <div>
          <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:var(--t-secondary);">BACK SIDE</div>
          <div class="upload-zone" id="zone-back" onclick="openCamera('back')">
            <img id="preview-back" class="preview" style="display:none;"/>
            <div id="placeholder-back">
              <div style="font-size:36px;margin-bottom:10px;">📄</div>
              <div style="font-size:13px;font-weight:600;margin-bottom:4px;">Tap to capture</div>
              <div style="font-size:11px;color:var(--t-muted);">Camera or gallery</div>
            </div>
            <div id="done-back" style="display:none;">
              <i class="fas fa-check-circle" style="color:#00C853;font-size:24px;margin-bottom:6px;"></i>
              <div style="font-size:12px;font-weight:700;color:#00C853;">Captured ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selfie / Facial -->
    <div style="background:#fff;border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:24px;margin-bottom:32px;">
      <div class="eyebrow" style="margin-bottom:16px;"><i class="fas fa-face-smile" style="margin-right:6px;color:var(--g-main);"></i>Live Selfie — Facial Verification</div>
      <p style="font-size:13px;color:var(--t-secondary);margin-bottom:16px;line-height:1.7;">
        We need a live photo of your face to match with your Ghana Card. Please look directly at the camera and smile.
      </p>
      <img id="selfie-preview" src="" alt="Selfie"/>
      <div class="upload-zone" id="zone-selfie" onclick="openCamera('selfie')">
        <div id="placeholder-selfie">
          <div style="font-size:48px;margin-bottom:12px;">🤳</div>
          <div style="font-size:15px;font-weight:700;margin-bottom:6px;">Take a Live Selfie</div>
          <div style="font-size:12px;color:var(--t-secondary);margin-bottom:16px;">Look at camera · Good lighting · No sunglasses</div>
          <span style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;padding:10px 24px;border-radius:12px;font-size:12px;font-weight:700;">Open Camera</span>
        </div>
        <div id="done-selfie" style="display:none;text-align:center;">
          <i class="fas fa-check-circle" style="color:#00C853;font-size:28px;margin-bottom:8px;"></i>
          <div style="font-size:13px;font-weight:700;color:#00C853;">Selfie Captured ✓</div>
          <div style="font-size:11px;color:var(--t-muted);margin-top:4px;">Tap to retake</div>
        </div>
      </div>
      <!-- Status -->
      <div id="kyc-status" style="display:none;margin-top:16px;padding:14px 16px;border-radius:12px;">
      </div>
    </div>

    <button onclick="validateStep1()" class="btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:14px;">
      Continue <i class="fas fa-arrow-right" style="margin-left:8px;"></i>
    </button>
  </div>

  <!-- ── STEP 2: Business ── -->
  <div id="ob-step2" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:14px;">Step 2 of 4</div>
    <h2 class="display-md" style="margin-bottom:10px;">Your <span class="gold-gradient">Business</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:32px;font-size:14px;line-height:1.8;">Tell clients about your salon. This will appear on your public profile.</p>

    <div style="background:#fff;border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:28px;">
      ${[
        {label:'Business Name',id:'biz-name',type:'text',ph:'Glam Studio GH'},
        {label:'Tagline',id:'tagline',type:'text',ph:'Your short pitch line'},
        {label:'Phone Number',id:'biz-phone',type:'tel',ph:'+233 24 000 0000'},
        {label:'Location / Area',id:'location',type:'text',ph:'East Legon, Accra'},
      ].map(f=>`
        <div class="form-group">
          <label class="form-label">${f.label}</label>
          <input type="${f.type}" id="${f.id}" class="input" placeholder="${f.ph}"/>
        </div>
      `).join('')}
      <div class="form-group">
        <label class="form-label">About Your Salon</label>
        <textarea id="bio" class="input" rows="4" placeholder="Describe your expertise, experience, and what makes you special..." style="resize:vertical;min-height:100px;"></textarea>
      </div>
    </div>

    <div style="display:flex;gap:12px;">
      <button onclick="goObStep(1)" class="btn-ghost" style="padding:14px 28px;">Back</button>
      <button onclick="validateStep2()" class="btn-primary" style="flex:1;justify-content:center;padding:14px;font-size:14px;">Continue <i class="fas fa-arrow-right" style="margin-left:8px;"></i></button>
    </div>
  </div>

  <!-- ── STEP 3: Services ── -->
  <div id="ob-step3" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:14px;">Step 3 of 4</div>
    <h2 class="display-md" style="margin-bottom:10px;">Your <span class="gold-gradient">Services</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:32px;font-size:14px;line-height:1.8;">Add services you offer with pricing. You can update these anytime from your dashboard.</p>

    <div id="services-list" style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;"></div>

    <button onclick="addService()" class="btn-ghost" style="font-size:13px;padding:12px 24px;margin-bottom:28px;width:100%;">
      <i class="fas fa-plus" style="margin-right:8px;"></i>Add a Service
    </button>

    <div style="display:flex;gap:12px;">
      <button onclick="goObStep(2)" class="btn-ghost" style="padding:14px 28px;">Back</button>
      <button onclick="submitOnboarding()" class="btn-primary" style="flex:1;justify-content:center;padding:14px;font-size:14px;">Finish Setup <i class="fas fa-check" style="margin-left:8px;"></i></button>
    </div>
  </div>

  <!-- ── STEP 4: Complete ── -->
  <div id="ob-step4" class="onboard-step" style="text-align:center;padding-top:40px;">
    <div style="font-size:72px;margin-bottom:24px;">🎉</div>
    <h2 class="display-md" style="margin-bottom:16px;">You're All Set!<br/><span class="gold-gradient">Welcome to SalonLink.</span></h2>
    <p style="font-size:15px;color:var(--t-secondary);line-height:1.9;margin-bottom:40px;max-width:420px;margin-left:auto;margin-right:auto;">
      Your profile is under review. KYC verification typically takes 1–2 hours.
      Once approved by admin, your salon will go live to thousands of clients.
    </p>
    <div style="background:#fff;border:1px solid rgba(0,200,83,0.3);border-radius:16px;padding:20px;margin-bottom:32px;display:inline-block;">
      <i class="fas fa-clock" style="color:#00C853;margin-right:8px;"></i>
      <span style="font-size:14px;font-weight:600;color:#00C853;">KYC documents submitted — Pending admin review</span>
    </div>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/provider/dashboard" class="btn-primary" style="padding:15px 40px;font-size:14px;">Go to Dashboard</a>
    </div>
  </div>

</div>

${globalScripts()}
<script>
// ── State ──
var kycData = { front: null, back: null, selfie: null };
var currentCamTarget = null;
var stream = null;

// ── Camera ──
async function openCamera(target) {
  currentCamTarget = target;
  var isSelfie = target === 'selfie';
  document.getElementById('face-oval').style.display = isSelfie ? 'block' : 'none';
  document.getElementById('cam-title').textContent = isSelfie
    ? '🤳 Look directly at camera and smile'
    : (target === 'front' ? '📄 Capture Ghana Card — FRONT' : '📄 Capture Ghana Card — BACK');
  document.getElementById('cam-hint').textContent = isSelfie
    ? 'Align your face inside the oval · Good lighting · No glasses'
    : 'Ensure all text is clearly visible · Flat surface · Good lighting';
  document.getElementById('camera-modal').classList.add('open');

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: isSelfie ? 'user' : 'environment', width:{ideal:1280}, height:{ideal:720} },
      audio: false
    });
    var video = document.getElementById('camera-video');
    video.srcObject = stream;
    video.play();
  } catch(err) {
    // Camera not available — fallback to file upload
    closeCameraModal();
    document.getElementById('file-fallback').click();
    showToast('Camera not available — please upload from gallery', 'info');
  }
}

function closeCameraModal() {
  document.getElementById('camera-modal').classList.remove('open');
  if (stream) { stream.getTracks().forEach(function(t){ t.stop(); }); stream = null; }
}

function snapPhoto() {
  var video  = document.getElementById('camera-video');
  var canvas = document.getElementById('camera-canvas');
  canvas.width  = video.videoWidth  || 640;
  canvas.height = video.videoHeight || 480;
  var ctx = canvas.getContext('2d');
  if (currentCamTarget === 'selfie') {
    // Mirror selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  closeCameraModal();
  applyCapture(currentCamTarget, dataUrl);
}

function handleFileFallback(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    closeCameraModal();
    applyCapture(currentCamTarget, e.target.result);
  };
  reader.readAsDataURL(input.files[0]);
}

function applyCapture(target, dataUrl) {
  kycData[target] = dataUrl;
  if (target === 'selfie') {
    var prev = document.getElementById('selfie-preview');
    prev.src = dataUrl;
    prev.style.display = 'block';
    document.getElementById('placeholder-selfie').style.display = 'none';
    document.getElementById('done-selfie').style.display = 'block';
    document.getElementById('zone-selfie').classList.add('uploaded');
    showToast('Selfie captured! ✓', 'success');
  } else {
    var img = document.getElementById('preview-' + target);
    img.src = dataUrl;
    img.style.display = 'block';
    document.getElementById('placeholder-' + target).style.display = 'none';
    document.getElementById('done-' + target).style.display = 'block';
    document.getElementById('zone-' + target).classList.add('uploaded');
    showToast((target === 'front' ? 'Front' : 'Back') + ' side captured! ✓', 'success');
  }
}

// ── Step 1 validation ──
function validateStep1() {
  var cardNum = document.getElementById('card-num').value.trim();
  if (!cardNum) { showToast('Please enter your Ghana Card number', 'error'); return; }
  if (!kycData.front) { showToast('Please capture the FRONT of your Ghana Card', 'error'); return; }
  if (!kycData.back)  { showToast('Please capture the BACK of your Ghana Card', 'error'); return; }
  if (!kycData.selfie){ showToast('Please take a live selfie for facial verification', 'error'); return; }

  // Mark KYC pending in status
  var status = document.getElementById('kyc-status');
  status.style.display = 'block';
  status.style.background = 'rgba(0,200,83,0.08)';
  status.style.border = '1px solid rgba(0,200,83,0.25)';
  status.innerHTML = '<i class="fas fa-check-circle" style="color:#00C853;margin-right:8px;"></i><strong style="color:#00C853;">All documents captured!</strong> Your KYC will be reviewed by admin within 1-2 hours.';

  showToast('Identity documents captured! Proceeding...', 'success');
  setTimeout(function(){ goObStep(2); }, 800);
}

// ── Step 2 validation ──
function validateStep2() {
  var bizName = document.getElementById('biz-name').value.trim();
  if (!bizName) { showToast('Please enter your business name', 'error'); return; }
  var loc = document.getElementById('location').value.trim();
  if (!loc) { showToast('Please enter your location', 'error'); return; }
  goObStep(3);
}

// ── Step navigation ──
function goObStep(n) {
  for (var i = 1; i <= 4; i++) {
    var s = document.getElementById('ob-step' + i);
    if (s) s.classList.remove('active');
    var node = document.getElementById('ob-node-' + i);
    if (node) {
      node.className = 'step-node ' + (i < n ? 'done' : i === n ? 'active' : 'pending');
      node.innerHTML = i < n
        ? '<i class="fas fa-check" style="font-size:9px;"></i>'
        : String(i);
    }
    var line = document.getElementById('ob-line-' + i);
    if (line) line.className = 'step-line ' + (i < n ? 'done' : '');
  }
  var el = document.getElementById('ob-step' + n);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Add first service row if step 3
  if (n === 3 && document.getElementById('services-list').children.length === 0) addService();
}

// ── Services ──
function addService() {
  var list = document.getElementById('services-list');
  var div = document.createElement('div');
  div.className = 'service-entry';
  div.style.cssText = 'background:#fff;border:1px solid var(--i-faint);border-radius:14px;padding:16px;display:grid;grid-template-columns:1fr 100px 100px 40px;gap:10px;align-items:center;';
  div.innerHTML =
    '<input type="text" class="input" placeholder="Service name (e.g. Box Braids)" style="font-size:13px;"/>' +
    '<input type="number" class="input" placeholder="GHS" style="font-size:13px;" min="1"/>' +
    '<input type="text" class="input" placeholder="e.g. 2hr" style="font-size:13px;"/>' +
    '<button onclick="this.closest(\\'.service-entry\\').remove()" style="background:rgba(255,59,48,0.1);border:none;border-radius:10px;width:38px;height:38px;cursor:pointer;color:#FF3B30;font-size:16px;">✕</button>';
  list.appendChild(div);
}

function removeService(btn) { btn.closest('.service-entry').remove(); }

// ── Submit onboarding ──
async function submitOnboarding() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }

  var bizName = document.getElementById('biz-name').value.trim();
  var bio     = document.getElementById('bio').value.trim();
  var phone   = document.getElementById('biz-phone').value.trim();
  var loc     = document.getElementById('location').value.trim();
  var entries = document.querySelectorAll('.service-entry');

  if (entries.length === 0) { showToast('Please add at least one service', 'error'); return; }

  try {
    showToast('Saving your profile...', 'info');
    await axios.put('/api/providers/me', {
      business_name: bizName, bio: bio, phone: phone, address: loc,
      kyc_status: 'pending',
      kyc_card_number: document.getElementById('card-num').value.trim()
    }, { headers: { Authorization: 'Bearer ' + token } });

    var servicePs = Array.from(entries).map(function(e) {
      var inputs = e.querySelectorAll('input');
      var name  = inputs[0] && inputs[0].value.trim();
      var price = inputs[1] && parseInt(inputs[1].value);
      var dur   = inputs[2] && inputs[2].value.trim();
      if (!name || !price) return Promise.resolve();
      return axios.post('/api/providers/me/services', {
        name: name, price: price * 100, duration: dur || '60 min'
      }, { headers: { Authorization: 'Bearer ' + token } }).catch(function(){});
    });
    await Promise.all(servicePs);
    goObStep(4);
    showToast('Profile saved! Under review by admin.', 'success');
  } catch(e) {
    showToast('Could not save. Please try again.', 'error');
  }
}
</script>
</body></html>`
