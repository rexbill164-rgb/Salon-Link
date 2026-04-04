import { baseHead, globalScripts } from '../utils/layout'

export const onboardingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Onboarding', `
<style>
  .onboard-step { display:none; animation:fadeUp 0.5s var(--ease-luxury) both; }
  .onboard-step.active { display:block; }
  .upload-zone { border:2px dashed var(--i-faint); border-radius:var(--r-xl); padding:56px 32px; text-align:center; cursor:pointer; transition:all 0.3s; }
  .upload-zone:hover { border-color:var(--g-main); background:var(--g-dim); }
</style>
`)}</head>
<body class="bg-grain">

<!-- Top bar -->
<div style="padding:24px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--i-faint);">
  <a href="/" style="display:flex;align-items:center;gap:12px;text-decoration:none;">
    <div style="width:34px;height:34px;border:1px solid var(--g-border);border-radius:10px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
    </div>
    <span style="font-family:'Playfair Display',serif;font-size:18px;letter-spacing:0.1em;">SALONLINK</span>
  </a>
  <span class="eyebrow">Provider Onboarding</span>
</div>

<div style="max-width:680px;margin:0 auto;padding:60px 24px 100px;">

  <!-- Step progress -->
  <div style="display:flex;align-items:center;gap:0;margin-bottom:64px;" class="afu">
    ${[
      {n:1,label:'Identity'},
      {n:2,label:'Business'},
      {n:3,label:'Services'},
      {n:4,label:'Complete'},
    ].map((s,i,arr) => `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div class="step-node ${i===0?'active':'pending'}" id="ob-node-${s.n}">${s.n}</div>
          <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">${s.label}</span>
        </div>
        ${i < arr.length-1 ? `<div class="step-line" id="ob-line-${s.n}" style="width:100px;margin-bottom:20px;"></div>` : ''}
      </div>
    `).join('')}
  </div>

  <!-- Step 1: Identity -->
  <div id="ob-step1" class="onboard-step active">
    <div class="eyebrow" style="margin-bottom:18px;">Step 1 of 4</div>
    <h2 class="display-md font-display" style="margin-bottom:12px;">Verify Your <em class="gold-gradient">Identity</em></h2>
    <p style="color:var(--t-secondary);margin-bottom:40px;font-size:14px;line-height:1.8;font-weight:300;">Ghana Card verification builds instant trust with your clients. This process takes about 2 minutes.</p>

    <div style="display:flex;flex-direction:column;gap:16px;margin-bottom:40px;">
      <!-- Ghana Card upload -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
        <div class="eyebrow" style="margin-bottom:18px;">Ghana Card</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;">
          <div class="upload-zone" onclick="showToast('Camera/upload opening...','info')">
            <div style="font-size:32px;margin-bottom:12px;">📄</div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;">Front Side</div>
            <div style="font-size:11px;color:var(--t-muted);">Tap to upload</div>
          </div>
          <div class="upload-zone" onclick="showToast('Camera/upload opening...','info')">
            <div style="font-size:32px;margin-bottom:12px;">📄</div>
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;">Back Side</div>
            <div style="font-size:11px;color:var(--t-muted);">Tap to upload</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Ghana Card Number</label>
          <input type="text" id="card-num" class="input" placeholder="GHA-XXXXXXXXX-X"/>
        </div>
      </div>

      <!-- Selfie capture -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
        <div class="eyebrow" style="margin-bottom:18px;">Facial Verification</div>
        <div class="upload-zone" onclick="startFaceScan()">
          <div style="font-size:48px;margin-bottom:16px;">🤳</div>
          <div style="font-size:15px;font-weight:700;margin-bottom:6px;">Take a Selfie</div>
          <div style="font-size:12px;color:var(--t-secondary);margin-bottom:16px;">Powered by Smile Identity</div>
          <span class="btn-outline" style="font-size:11px;padding:10px 24px;pointer-events:none;">Open Camera</span>
        </div>
        <div id="face-progress" style="display:none;margin-top:16px;padding:16px;background:rgba(61,170,110,0.08);border:1px solid rgba(61,170,110,0.2);border-radius:var(--r-md);">
          <div style="display:flex;align-items:center;gap:12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5DC98A" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style="font-size:13px;color:#5DC98A;font-weight:600;">Facial scan analysing... 98.2% match</span>
          </div>
        </div>
      </div>
    </div>

    <button onclick="goObStep(2)" class="btn-primary" style="padding:15px 48px;font-size:13px;">
      Continue
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </div>

  <!-- Step 2: Business info -->
  <div id="ob-step2" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:18px;">Step 2 of 4</div>
    <h2 class="display-md font-display" style="margin-bottom:12px;">Your <em class="gold-gradient">Business</em></h2>
    <p style="color:var(--t-secondary);margin-bottom:40px;font-size:14px;line-height:1.8;font-weight:300;">Tell clients about your salon. This will appear on your public profile.</p>

    <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:32px;">
      ${[
        {label:'Business Name',   id:'biz-name',  type:'text',    ph:'Glam Studio GH'},
        {label:'Tagline',         id:'tagline',    type:'text',    ph:'Your short-form pitch line'},
        {label:'Phone Number',    id:'biz-phone',  type:'tel',     ph:'+233 24 000 0000'},
        {label:'Location',        id:'location',   type:'text',    ph:'East Legon, Accra, Ghana'},
      ].map(f=>`
        <div class="form-group">
          <label class="form-label">${f.label}</label>
          <input type="${f.type}" id="${f.id}" class="input" placeholder="${f.ph}"/>
        </div>
      `).join('')}
      <div class="form-group">
        <label class="form-label">About Your Salon</label>
        <textarea id="bio" class="input" rows="4" placeholder="Describe your expertise, experience, and what makes you special..." style="resize:vertical;height:100px;"></textarea>
      </div>
    </div>

    <div style="display:flex;gap:12px;">
      <button onclick="goObStep(1)" class="btn-ghost" style="padding:14px 32px;">Back</button>
      <button onclick="goObStep(3)" class="btn-primary" style="padding:14px 48px;font-size:13px;">Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
    </div>
  </div>

  <!-- Step 3: Services -->
  <div id="ob-step3" class="onboard-step">
    <div class="eyebrow" style="margin-bottom:18px;">Step 3 of 4</div>
    <h2 class="display-md font-display" style="margin-bottom:12px;">Your <em class="gold-gradient">Services</em></h2>
    <p style="color:var(--t-secondary);margin-bottom:40px;font-size:14px;line-height:1.8;font-weight:300;">Add the services you offer with pricing. You can update these anytime.</p>

    <div id="services-list" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
      <div class="service-entry" style="display:grid;grid-template-columns:1fr 120px 120px auto;gap:12px;align-items:center;">
        <input type="text" class="input" placeholder="Service name" value="Natural Twist"/>
        <input type="number" class="input" placeholder="Price" value="80"/>
        <input type="text" class="input" placeholder="Duration" value="90 min"/>
        <button onclick="removeService(this)" class="btn-icon" style="width:42px;height:42px;border-radius:11px;flex-shrink:0;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--s-red)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>

    <button onclick="addService()" class="btn-ghost" style="font-size:12px;padding:10px 24px;margin-bottom:32px;">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Add Another Service
    </button>

    <div style="display:flex;gap:12px;">
      <button onclick="goObStep(2)" class="btn-ghost" style="padding:14px 32px;">Back</button>
      <button onclick="goObStep(4)" class="btn-primary" style="padding:14px 48px;font-size:13px;">Finish Setup <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
    </div>
  </div>

  <!-- Step 4: Complete -->
  <div id="ob-step4" class="onboard-step" style="text-align:center;">
    <div style="display:inline-flex;width:80px;height:80px;border-radius:50%;background:rgba(61,170,110,0.12);border:1px solid rgba(61,170,110,0.3);align-items:center;justify-content:center;font-size:36px;margin-bottom:32px;animation:pulse-ring 2s infinite;">✓</div>
    <h2 class="display-md font-display" style="margin-bottom:16px;">You're All Set!<br/><em class="gold-gradient">Welcome to SalonLink.</em></h2>
    <p style="font-size:15px;color:var(--t-secondary);line-height:1.9;margin-bottom:48px;max-width:420px;margin-left:auto;margin-right:auto;font-weight:300;">
      Your profile is under review. KYC verification typically takes 1–2 hours.
      Once approved, your salon will go live to thousands of clients.
    </p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <a href="/provider/dashboard" class="btn-primary" style="padding:15px 40px;font-size:13px;">Go to Dashboard</a>
      <a href="/provider/1" class="btn-outline" style="padding:14px 36px;font-size:13px;">Preview Profile</a>
    </div>
  </div>

</div>

${globalScripts()}
<script>
function goObStep(n) {
  for (var i = 1; i <= 4; i++) {
    var s = document.getElementById('ob-step' + i);
    if (s) { s.classList.remove('active'); }
    var node = document.getElementById('ob-node-' + i);
    if (node) {
      node.className = 'step-node ' + (i < n ? 'done' : i === n ? 'active' : 'pending');
      node.innerHTML = i < n ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : i;
    }
    var line = document.getElementById('ob-line-' + i);
    if (line) line.className = 'step-line ' + (i < n ? 'done' : '');
  }
  var current = document.getElementById('ob-step' + n);
  if (current) current.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startFaceScan() {
  showToast('Launching Smile Identity scanner...', 'info');
  setTimeout(() => {
    document.getElementById('face-progress').style.display = 'block';
    showToast('Identity verified! 98.2% facial match ✦', 'success');
  }, 2000);
}

function addService() {
  var list = document.getElementById('services-list');
  var div = document.createElement('div');
  div.className = 'service-entry';
  div.style.cssText = 'display:grid;grid-template-columns:1fr 120px 120px auto;gap:12px;align-items:center;animation:fadeUp 0.3s both;';
  div.innerHTML = '<input type="text" class="input" placeholder="Service name"/><input type="number" class="input" placeholder="Price (GHS)"/><input type="text" class="input" placeholder="Duration"/><button onclick="removeService(this)" class="btn-icon" style="width:42px;height:42px;border-radius:11px;flex-shrink:0;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--s-red)" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>';
  list.appendChild(div);
}

function removeService(btn) {
  btn.closest('.service-entry').remove();
}
</script>
</body></html>`
