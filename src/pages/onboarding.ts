import { baseHead, globalScripts } from '../utils/layout'

export const onboardingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Onboarding', `
<style>
  .onboard-step { display:none; animation:fadeUp 0.5s var(--ease-luxury) both; }
  .onboard-step.active { display:block; }

  /* ── Upload Zone ── */
  .upload-zone {
    border: 2px dashed #c9a44a;
    border-radius: 16px;
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #fffdf7;
    position: relative;
  }
  .upload-zone:hover  { border-color:#a0793c; background:#fff8ec; }
  .upload-zone.done   { border-color:#00C853; background:rgba(0,200,83,0.05); }
  .upload-zone img.preview {
    width:100%; max-height:140px; object-fit:cover;
    border-radius:10px; display:none; margin:0 auto 8px;
  }
  .upload-zone.done img.preview { display:block; }

  /* ── Camera Modal ── */
  #cam-modal {
    display:none; position:fixed; inset:0; background:rgba(0,0,0,0.95);
    z-index:9999; flex-direction:column; align-items:center; justify-content:center;
  }
  #cam-modal.open { display:flex; }
  #cam-video { width:100%; max-width:420px; border-radius:16px; background:#111; display:block; }
  #cam-canvas { display:none; }

  /* oval guide for selfie */
  .face-oval {
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-55%);
    width:190px; height:250px;
    border:3px solid #fff; border-radius:50%;
    box-shadow:0 0 0 9999px rgba(0,0,0,0.5);
    pointer-events:none;
    animation:pulse-oval 2s ease-in-out infinite;
  }
  @keyframes pulse-oval {
    0%,100%{border-color:rgba(255,255,255,0.5);}
    50%{border-color:#00C853;}
  }

  /* selfie round preview */
  #selfie-round {
    display:none; width:120px; height:120px;
    border-radius:50%; object-fit:cover;
    border:3px solid #00C853; margin:0 auto 12px;
  }

  /* Action choice sheet */
  #action-sheet {
    display:none; position:fixed; inset:0; z-index:9990;
    background:rgba(0,0,0,0.6); align-items:flex-end; justify-content:center;
  }
  #action-sheet.open { display:flex; }
  .action-sheet-inner {
    background:#fff; border-radius:24px 24px 0 0;
    padding:28px 24px 40px; width:100%; max-width:480px;
  }
</style>
`)}</head>
<body style="background:#f8f5f0;">

<!-- Top bar -->
<div style="padding:16px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #eee;background:#fff;position:sticky;top:0;z-index:100;">
  <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
    <img src="/salonlink-logo.png" alt="SalonLink" style="height:34px;"/>
  </a>
  <span style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888;">Provider Setup</span>
</div>

<!-- ── Hidden file inputs ── -->
<input type="file" id="file-card-front"  accept="image/*"           style="display:none;" onchange="handleFile(this,'front')"/>
<input type="file" id="file-card-back"   accept="image/*"           style="display:none;" onchange="handleFile(this,'back')"/>
<input type="file" id="file-selfie-gal"  accept="image/*"           style="display:none;" onchange="handleFile(this,'selfie')"/>

<!-- ── Action Choice Sheet (Camera vs Gallery) ── -->
<div id="action-sheet">
  <div class="action-sheet-inner">
    <div id="sheet-title" style="font-size:17px;font-weight:800;margin-bottom:20px;text-align:center;"></div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <button onclick="sheetUseCamera()" style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:700;cursor:pointer;">
        <i class="fas fa-camera" style="margin-right:8px;"></i>Take Photo with Camera
      </button>
      <button id="sheet-gallery-btn" onclick="sheetUseGallery()" style="background:#f0f0f0;color:#333;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:700;cursor:pointer;">
        <i class="fas fa-image" style="margin-right:8px;"></i>Upload from Gallery
      </button>
      <button onclick="closeSheet()" style="background:none;color:#999;border:none;padding:10px;font-size:14px;cursor:pointer;">Cancel</button>
    </div>
  </div>
</div>

<!-- ── Camera Modal ── -->
<div id="cam-modal">
  <div style="width:100%;max-width:440px;padding:0 16px;">
    <div id="cam-title" style="color:#fff;font-size:16px;font-weight:800;text-align:center;margin-bottom:14px;"></div>
    <div style="position:relative;background:#000;border-radius:18px;overflow:hidden;">
      <video id="cam-video" autoplay playsinline muted></video>
      <canvas id="cam-canvas"></canvas>
      <div class="face-oval" id="face-oval" style="display:none;"></div>
    </div>
    <div id="cam-hint" style="color:rgba(255,255,255,0.65);font-size:13px;text-align:center;margin-top:10px;"></div>
    <div style="display:flex;gap:12px;margin-top:18px;justify-content:center;">
      <button onclick="closeCam()" style="background:rgba(255,255,255,0.18);color:#fff;border:none;border-radius:12px;padding:12px 24px;font-size:14px;cursor:pointer;">Cancel</button>
      <button onclick="snapPhoto()" style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;border:none;border-radius:12px;padding:12px 36px;font-size:15px;font-weight:700;cursor:pointer;">
        <i class="fas fa-camera"></i> Capture
      </button>
    </div>
    <div style="text-align:center;margin-top:14px;">
      <label id="cam-fallback-lbl" style="color:rgba(255,255,255,0.45);font-size:12px;cursor:pointer;text-decoration:underline;">
        Camera not working? Upload from gallery instead
        <input type="file" id="cam-fallback-input" accept="image/*" style="display:none;" onchange="handleFileFallback(this)"/>
      </label>
    </div>
  </div>
</div>

<div style="max-width:680px;margin:0 auto;padding:32px 16px 100px;">

  <!-- Step progress -->
  <div style="display:flex;align-items:center;margin-bottom:40px;">
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

  <!-- ══════════════ STEP 1: Identity ══════════════ -->
  <div id="ob-step1" class="onboard-step active">
    <div class="eyebrow" style="margin-bottom:12px;">Step 1 of 4</div>
    <h2 class="display-md" style="margin-bottom:8px;">Verify Your <span class="gold-gradient">Identity</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:16px;font-size:14px;line-height:1.8;">
      Upload your Ghana Card (front &amp; back) and take a live selfie. This builds trust with your clients.
    </p>
    <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:12px 16px;margin-bottom:22px;display:flex;align-items:flex-start;gap:10px;">
      <span style="font-size:18px;flex-shrink:0;">💡</span>
      <div style="font-size:13px;color:var(--t-secondary);line-height:1.6;"><strong style="color:var(--t-primary);">KYC is optional during setup.</strong> You can complete it now or later from your dashboard. Admin approval is needed before you can receive bookings.</div>
    </div>

    <!-- Ghana Card Number -->
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:22px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#a0793c;margin-bottom:14px;">
        <i class="fas fa-id-card" style="margin-right:6px;"></i>Ghana Card Number
      </div>
      <input type="text" id="card-num" class="input" placeholder="GHA-XXXXXXXXX-X"
        style="text-transform:uppercase;letter-spacing:0.06em;font-size:15px;"
        oninput="this.value=this.value.toUpperCase()" maxlength="16"/>
      <div style="font-size:11px;color:#999;margin-top:6px;">Format: GHA-000000000-0 (found on front of card)</div>
    </div>

    <!-- Ghana Card Photos -->
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:22px;margin-bottom:14px;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#a0793c;margin-bottom:16px;">
        <i class="fas fa-camera" style="margin-right:6px;"></i>Ghana Card Photos
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

        <!-- Front -->
        <div>
          <div style="font-size:11px;font-weight:800;margin-bottom:8px;color:#555;text-transform:uppercase;letter-spacing:0.08em;">FRONT SIDE</div>
          <div class="upload-zone" id="zone-front" onclick="openSheet('front')">
            <img class="preview" id="prev-front" alt="Front"/>
            <div id="ph-front">
              <div style="font-size:32px;margin-bottom:8px;">📄</div>
              <div style="font-size:13px;font-weight:700;margin-bottom:3px;">Tap to upload</div>
              <div style="font-size:11px;color:#999;">Camera or gallery</div>
            </div>
            <div id="ok-front" style="display:none;padding-top:6px;">
              <i class="fas fa-check-circle" style="color:#00C853;font-size:22px;"></i>
              <div style="font-size:12px;font-weight:700;color:#00C853;margin-top:4px;">Captured ✓</div>
              <div style="font-size:10px;color:#999;margin-top:2px;">Tap to retake</div>
            </div>
          </div>
        </div>

        <!-- Back -->
        <div>
          <div style="font-size:11px;font-weight:800;margin-bottom:8px;color:#555;text-transform:uppercase;letter-spacing:0.08em;">BACK SIDE</div>
          <div class="upload-zone" id="zone-back" onclick="openSheet('back')">
            <img class="preview" id="prev-back" alt="Back"/>
            <div id="ph-back">
              <div style="font-size:32px;margin-bottom:8px;">📄</div>
              <div style="font-size:13px;font-weight:700;margin-bottom:3px;">Tap to upload</div>
              <div style="font-size:11px;color:#999;">Camera or gallery</div>
            </div>
            <div id="ok-back" style="display:none;padding-top:6px;">
              <i class="fas fa-check-circle" style="color:#00C853;font-size:22px;"></i>
              <div style="font-size:12px;font-weight:700;color:#00C853;margin-top:4px;">Captured ✓</div>
              <div style="font-size:10px;color:#999;margin-top:2px;">Tap to retake</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selfie / Facial Verification -->
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:22px;margin-bottom:28px;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#a0793c;margin-bottom:14px;">
        <i class="fas fa-face-smile" style="margin-right:6px;"></i>Live Selfie — Facial Verification
      </div>
      <p style="font-size:13px;color:#666;margin-bottom:16px;line-height:1.7;">
        We need a live photo of your face to compare with your Ghana Card. Look directly at the camera, good lighting, no sunglasses.
      </p>

      <!-- Round selfie preview -->
      <img id="selfie-round" src="" alt="Selfie preview"/>

      <div class="upload-zone" id="zone-selfie" onclick="openSheet('selfie')">
        <div id="ph-selfie">
          <div style="font-size:48px;margin-bottom:12px;">🤳</div>
          <div style="font-size:15px;font-weight:800;margin-bottom:6px;">Take Live Selfie</div>
          <div style="font-size:12px;color:#888;margin-bottom:18px;">Look at camera · Good lighting · No sunglasses</div>
          <span style="background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;padding:11px 28px;border-radius:14px;font-size:13px;font-weight:700;display:inline-block;">📷 Open Camera</span>
        </div>
        <div id="ok-selfie" style="display:none;text-align:center;padding:8px 0;">
          <i class="fas fa-check-circle" style="color:#00C853;font-size:28px;margin-bottom:8px;display:block;"></i>
          <div style="font-size:13px;font-weight:700;color:#00C853;">Selfie Captured ✓</div>
          <div style="font-size:11px;color:#999;margin-top:4px;">Tap to retake</div>
        </div>
      </div>

      <!-- KYC note -->
      <div id="kyc-note" style="display:none;margin-top:14px;padding:14px;border-radius:12px;background:rgba(0,200,83,0.07);border:1px solid rgba(0,200,83,0.25);">
        <i class="fas fa-check-circle" style="color:#00C853;margin-right:8px;"></i>
        <strong style="color:#00C853;">All documents captured!</strong> Admin will review within 1–2 hours.
      </div>
    </div>

    <div style="display:flex;gap:12px;">
      <button onclick="validateStep1()" class="btn-primary" style="flex:1;justify-content:center;padding:16px;font-size:15px;">Submit KYC &amp; Continue <i class="fas fa-arrow-right" style="margin-left:8px;"></i></button>
    </div>
  </div>

  <!-- ══════════════ STEP 2: Business ══════════════ -->
  <div id="ob-step2" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:14px;">Step 2 of 4</div>
    <h2 class="display-md" style="margin-bottom:10px;">Your <span class="gold-gradient">Business</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:32px;font-size:14px;line-height:1.8;">Tell clients about your salon. This will appear on your public profile.</p>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:24px;margin-bottom:28px;">
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

  <!-- ══════════════ STEP 3: Services ══════════════ -->
  <div id="ob-step3" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:14px;">Step 3 of 4</div>
    <h2 class="display-md" style="margin-bottom:10px;">Your <span class="gold-gradient">Services</span></h2>
    <p style="color:var(--t-secondary);margin-bottom:32px;font-size:14px;line-height:1.8;">Add the services you offer with pricing. You can update these from your dashboard anytime.</p>

    <div id="services-list" style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;"></div>

    <button onclick="addService()" class="btn-ghost" style="font-size:13px;padding:12px 24px;margin-bottom:28px;width:100%;">
      <i class="fas fa-plus" style="margin-right:8px;"></i>Add a Service
    </button>

    <div style="display:flex;gap:12px;">
      <button onclick="goObStep(2)" class="btn-ghost" style="padding:14px 28px;">Back</button>
      <button onclick="skipServices()" class="btn-ghost" style="padding:14px 22px;font-size:13px;white-space:nowrap;">Skip for now</button>
      <button onclick="submitOnboarding()" class="btn-primary" style="flex:1;justify-content:center;padding:14px;font-size:14px;">Finish Setup <i class="fas fa-check" style="margin-left:8px;"></i></button>
    </div>
  </div>

  <!-- ══════════════ STEP 4: Complete ══════════════ -->
  <div id="ob-step4" class="onboard-step" style="text-align:center;padding-top:40px;">
    <div style="font-size:72px;margin-bottom:24px;">🎉</div>
    <h2 class="display-md" style="margin-bottom:16px;">Profile Saved!<br/><span class="gold-gradient">Welcome to SalonLink.</span></h2>
    <p style="font-size:15px;color:var(--t-secondary);line-height:1.9;margin-bottom:28px;max-width:440px;margin-left:auto;margin-right:auto;">
      Your salon profile and services are ready. Explore your dashboard, upload photos, and set your location while you wait for admin approval.
    </p>

    <!-- What you can do now -->
    <div style="background:#fff;border:1px solid var(--i-faint);border-radius:18px;padding:24px;margin-bottom:20px;text-align:left;max-width:400px;margin-left:auto;margin-right:auto;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--g-deep);margin-bottom:16px;">What you can do now</div>
      ${[
        {icon:'✅', text:'View and manage your services'},
        {icon:'📸', text:'Upload your logo and gallery photos'},
        {icon:'📍', text:'Set your exact location on the map'},
        {icon:'⚙️', text:'Update your profile and bio'},
      ].map(i=>`
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="font-size:18px;">${i.icon}</span>
          <span style="font-size:14px;color:var(--t-secondary);">${i.text}</span>
        </div>
      `).join('')}
    </div>

    <!-- Pending approval notice -->
    <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.3);border-radius:14px;padding:16px 20px;margin-bottom:28px;display:inline-flex;align-items:center;gap:10px;">
      <i class="fas fa-clock" style="color:var(--g-main);font-size:16px;"></i>
      <span style="font-size:13px;font-weight:600;color:var(--g-deep);">Pending admin approval — customers cannot book until approved</span>
    </div>

    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/provider/dashboard" class="btn-primary" style="padding:15px 40px;font-size:14px;">
        <i class="fas fa-th-large" style="margin-right:8px;"></i>Go to My Dashboard
      </a>
    </div>
  </div>

</div>

${globalScripts()}
<script>
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var kycData   = { front: null, back: null, selfie: null };
var camTarget = null;   // 'front' | 'back' | 'selfie'
var camStream = null;
var sheetTarget = null; // same

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTION SHEET (Choose Camera or Gallery)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openSheet(target) {
  sheetTarget = target;
  var titles = {
    front:  '📄 Ghana Card — Front Side',
    back:   '📄 Ghana Card — Back Side',
    selfie: '🤳 Live Selfie for Verification'
  };
  document.getElementById('sheet-title').textContent = titles[target] || 'Upload Photo';
  document.getElementById('action-sheet').classList.add('open');
}

function closeSheet() {
  document.getElementById('action-sheet').classList.remove('open');
}

function sheetUseCamera() {
  closeSheet();
  openCam(sheetTarget);
}

function sheetUseGallery() {
  closeSheet();
  // Trigger the corresponding hidden file input
  var inputMap = { front: 'file-card-front', back: 'file-card-back', selfie: 'file-selfie-gal' };
  var el = document.getElementById(inputMap[sheetTarget]);
  if (el) el.click();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function openCam(target) {
  camTarget = target;
  var isSelfie = target === 'selfie';

  document.getElementById('face-oval').style.display = isSelfie ? 'block' : 'none';
  document.getElementById('cam-title').textContent = isSelfie
    ? '🤳 Look directly at the camera and smile'
    : (target === 'front' ? '📄 Ghana Card — FRONT side' : '📄 Ghana Card — BACK side');
  document.getElementById('cam-hint').textContent = isSelfie
    ? 'Align face in oval · Good lighting · Remove glasses'
    : 'Lay card flat · Ensure all text is sharp & clear · Good lighting';

  document.getElementById('cam-modal').classList.add('open');

  try {
    camStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isSelfie ? 'user' : 'environment',
        width:  { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    var vid = document.getElementById('cam-video');
    vid.srcObject = camStream;
    await vid.play();
  } catch (err) {
    closeCam();
    showToast('Camera not available — please use "Upload from Gallery"', 'error');
    // Auto-open gallery as fallback
    var inputMap = { front: 'file-card-front', back: 'file-card-back', selfie: 'file-selfie-gal' };
    var el = document.getElementById(inputMap[camTarget]);
    if (el) el.click();
  }
}

function closeCam() {
  document.getElementById('cam-modal').classList.remove('open');
  if (camStream) {
    camStream.getTracks().forEach(function(t){ t.stop(); });
    camStream = null;
  }
}

function snapPhoto() {
  var vid    = document.getElementById('cam-video');
  var canvas = document.getElementById('cam-canvas');
  var w = vid.videoWidth  || 640;
  var h = vid.videoHeight || 480;
  canvas.width  = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  if (camTarget === 'selfie') {
    // Mirror selfie so text reads correctly
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(vid, 0, 0, w, h);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.82);
  closeCam();
  applyCapture(camTarget, dataUrl);
}

// Fallback inside camera modal
function handleFileFallback(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    closeCam();
    applyCapture(camTarget, e.target.result);
  };
  reader.readAsDataURL(input.files[0]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE INPUT HANDLER (from gallery)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function handleFile(input, target) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  // Basic size guard — 10 MB max
  if (file.size > 10 * 1024 * 1024) {
    showToast('Image is too large (max 10 MB). Please choose a smaller file.', 'error');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    applyCapture(target, e.target.result);
  };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  input.value = '';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPLY CAPTURED IMAGE TO UI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function applyCapture(target, dataUrl) {
  kycData[target] = dataUrl;

  if (target === 'selfie') {
    var round = document.getElementById('selfie-round');
    round.src = dataUrl;
    round.style.display = 'block';
    document.getElementById('ph-selfie').style.display   = 'none';
    document.getElementById('ok-selfie').style.display   = 'block';
    document.getElementById('zone-selfie').classList.add('done');
    showToast('Selfie captured ✓', 'success');
  } else {
    var img = document.getElementById('prev-' + target);
    img.src = dataUrl;
    document.getElementById('zone-' + target).classList.add('done');
    document.getElementById('ph-' + target).style.display = 'none';
    document.getElementById('ok-' + target).style.display = 'block';
    showToast((target === 'front' ? 'Front' : 'Back') + ' side captured ✓', 'success');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STEP VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function skipServices() {
  showToast('Services skipped — add them from your dashboard anytime', 'info');
  goObStep(4);
}

function validateStep1() {
  var cardNum = document.getElementById('card-num').value.trim();
  if (!cardNum) {
    showToast('Please enter your Ghana Card number', 'error'); return;
  }
  if (!kycData.front) {
    showToast('Please capture the FRONT of your Ghana Card', 'error'); return;
  }
  if (!kycData.back) {
    showToast('Please capture the BACK of your Ghana Card', 'error'); return;
  }
  if (!kycData.selfie) {
    showToast('Please take a live selfie for facial verification', 'error'); return;
  }
  document.getElementById('kyc-note').style.display = 'block';
  showToast('KYC documents captured! Proceeding...', 'success');
  setTimeout(function(){ goObStep(2); }, 800);
}

function validateStep2() {
  var bizName = document.getElementById('biz-name').value.trim();
  if (!bizName) { showToast('Please enter your business name', 'error'); return; }
  var loc = document.getElementById('location').value.trim();
  if (!loc)     { showToast('Please enter your location', 'error'); return; }
  goObStep(3);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STEP NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function goObStep(n) {
  for (var i = 1; i <= 4; i++) {
    var s = document.getElementById('ob-step' + i);
    if (s) s.classList.remove('active');
    var node = document.getElementById('ob-node-' + i);
    if (node) {
      node.className = 'step-node ' + (i < n ? 'done' : i === n ? 'active' : 'pending');
      node.innerHTML = i < n ? '<i class="fas fa-check" style="font-size:9px;"></i>' : String(i);
    }
    var line = document.getElementById('ob-line-' + i);
    if (line) line.className = 'step-line ' + (i < n ? 'done' : '');
  }
  var el = document.getElementById('ob-step' + n);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (n === 3 && document.getElementById('services-list').children.length === 0) addService();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERVICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function addService() {
  var list = document.getElementById('services-list');
  var div  = document.createElement('div');
  div.className = 'service-entry';
  div.style.cssText = 'background:#fff;border:1px solid #e5e5e5;border-radius:14px;padding:16px;display:grid;grid-template-columns:1fr 110px 120px 40px;gap:10px;align-items:center;';
  div.innerHTML =
    '<input type="text" class="input svc-name" placeholder="Service name (e.g. Box Braids)" style="font-size:13px;"/>' +
    '<input type="number" class="input svc-price" placeholder="GHS price" style="font-size:13px;" min="1" step="1"/>' +
    '<input type="number" class="input svc-duration" placeholder="Duration (mins)" style="font-size:13px;" min="10" step="5" value="60"/>' +
    '<button onclick="this.closest(\\'.service-entry\\').remove()" style="background:rgba(255,59,48,0.1);border:none;border-radius:10px;width:38px;height:38px;cursor:pointer;color:#FF3B30;font-size:16px;">✕</button>';
  list.appendChild(div);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBMIT ONBOARDING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function submitOnboarding() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }

  var entries = document.querySelectorAll('.service-entry');
  if (entries.length === 0) { showToast('Please add at least one service', 'error'); return; }

  // Validate at least one service has a name and price
  var hasValidService = false;
  Array.from(entries).forEach(function(e) {
    var nameEl  = e.querySelector('.svc-name');
    var priceEl = e.querySelector('.svc-price');
    if (nameEl && nameEl.value.trim() && priceEl && parseInt(priceEl.value) > 0) {
      hasValidService = true;
    }
  });
  if (!hasValidService) {
    showToast('Please fill in at least one service with a name and price', 'error');
    return;
  }

  var btn = document.querySelector('#ob-step3 .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  showToast('Saving your profile...', 'info');

  // Build profile payload
  var profilePayload = {
    business_name: (document.getElementById('biz-name') ? document.getElementById('biz-name').value.trim() : ''),
    bio:           (document.getElementById('bio')      ? document.getElementById('bio').value.trim()      : ''),
    phone:         (document.getElementById('biz-phone')? document.getElementById('biz-phone').value.trim(): ''),
    address:       (document.getElementById('location') ? document.getElementById('location').value.trim() : ''),
  };

  // Add KYC fields only if provided
  var cardNumEl = document.getElementById('card-num');
  if (cardNumEl && cardNumEl.value.trim()) profilePayload.kyc_card_number = cardNumEl.value.trim();
  if (kycData && kycData.front)  profilePayload.kyc_front_url  = kycData.front;
  if (kycData && kycData.back)   profilePayload.kyc_back_url   = kycData.back;
  if (kycData && kycData.selfie) profilePayload.kyc_selfie_url = kycData.selfie;
  if (kycData && kycData.front && kycData.back && kycData.selfie) profilePayload.kyc_status = 'submitted';

  var headers = { Authorization: 'Bearer ' + token };

  // Step 1: save profile
  axios.put('/api/providers/me', profilePayload, { headers: headers })
    .then(function() {
      // Step 2: save each valid service in sequence
      var serviceList = Array.from(entries).filter(function(e) {
        var n = e.querySelector('.svc-name');
        var p = e.querySelector('.svc-price');
        return n && n.value.trim() && p && parseInt(p.value) > 0;
      });

      var chain = Promise.resolve();
      serviceList.forEach(function(e) {
        var name  = e.querySelector('.svc-name').value.trim();
        var price = parseInt(e.querySelector('.svc-price').value);
        var durEl = e.querySelector('.svc-duration');
        var dur   = durEl ? (parseInt(durEl.value) || 60) : 60;
        chain = chain.then(function() {
          return axios.post('/api/providers/me/services',
            { name: name, price: price * 100, duration: dur },
            { headers: headers }
          ).catch(function(err) {
            console.warn('Service save warning:', name, err && err.response && err.response.data);
          });
        });
      });
      return chain;
    })
    .then(function() {
      goObStep(4);
      showToast('Profile & services saved! 🎉', 'success');
    })
    .catch(function(err) {
      var msg = (err.response && err.response.data && err.response.data.error) || 'Could not save. Please try again.';
      showToast(msg, 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Finish Setup'; }
    });
}
</script>
</body></html>`
