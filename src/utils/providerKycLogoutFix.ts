export function withProviderKycLogoutFix(html: string): string {
  const script = `
<script id="provider-kyc-logout-fix">
(function(){
  if (location.pathname !== '/provider/dashboard') return;

  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function http(){ return window.axios || null; }
  function byId(id){ return document.getElementById(id); }
  function toast(message, type){ if (window.showToast) window.showToast(message, type || 'info'); else console.log(message); }

  function moveLogoutUnderSettings(){
    var settings = byId('nav-settings');
    if (!settings || document.getElementById('nav-signout-inline')) return;
    var parent = settings.parentNode;
    if (!parent) return;

    var view = document.createElement('button');
    view.id = 'nav-view-profile-inline';
    view.type = 'button';
    view.className = 'sidebar-item';
    view.innerHTML = '<span class="icon">👁️</span><span>View Public Profile</span>';
    view.onclick = function(){ if (window.viewPublicProfile) window.viewPublicProfile(); };

    var out = document.createElement('button');
    out.id = 'nav-signout-inline';
    out.type = 'button';
    out.className = 'sidebar-item';
    out.style.color = 'var(--s-red)';
    out.innerHTML = '<span class="icon">🚪</span><span>Sign Out</span>';
    out.onclick = function(){ if (window.logout) window.logout(); else { localStorage.clear(); location.href = '/login'; } };

    settings.insertAdjacentElement('afterend', out);
    settings.insertAdjacentElement('afterend', view);

    var oldProfile = byId('view-profile-btn');
    if (oldProfile && oldProfile.parentElement) oldProfile.parentElement.style.display = 'none';
  }

  function statusLabel(value){
    value = String(value || 'not_submitted').toLowerCase();
    if (value === 'approved') return 'Approved';
    if (value === 'submitted' || value === 'pending') return 'Under Review';
    if (value === 'rejected') return 'Rejected';
    return 'Not Submitted';
  }
  function statusColor(value){
    value = String(value || 'not_submitted').toLowerCase();
    if (value === 'approved') return '#00A65A';
    if (value === 'submitted' || value === 'pending') return '#B7791F';
    if (value === 'rejected') return '#D92D20';
    return 'var(--t-muted)';
  }

  function renderKyc(provider){
    var box = byId('kyc-content');
    if (!box) return;
    var kyc = provider || {};
    var label = kyc.is_verified ? 'Approved' : statusLabel(kyc.kyc_status);
    var color = kyc.is_verified ? '#00A65A' : statusColor(kyc.kyc_status);
    var isFinal = kyc.is_verified || String(kyc.kyc_status || '').toLowerCase() === 'approved' || String(kyc.kyc_status || '').toLowerCase() === 'submitted' || String(kyc.kyc_status || '').toLowerCase() === 'pending';

    box.innerHTML = '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:18px;">' +
      '<div style="width:46px;height:46px;border-radius:14px;background:rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:center;font-size:22px;">🪪</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:16px;font-weight:800;color:' + color + ';margin-bottom:4px;">KYC Status: ' + label + '</div>' +
        '<div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">KYC helps customers trust the provider and helps admin approve verified providers. You can set up your profile while KYC is being reviewed.</div>' +
      '</div>' +
    '</div>';

    if (isFinal && !String(kyc.kyc_status || '').toLowerCase().includes('rejected')) {
      box.innerHTML += '<div style="background:rgba(0,166,90,0.08);border:1px solid rgba(0,166,90,0.18);border-radius:14px;padding:14px;font-size:12px;color:var(--t-secondary);">' +
        (kyc.is_verified ? '✅ Your provider account is verified.' : '⏳ Your KYC has been submitted and is awaiting admin review.') +
      '</div>';
      return;
    }

    box.innerHTML += '<div id="kyc-upload-section">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
        '<label style="display:block;"><div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:6px;">Ghana Card Front</div><input type="file" id="kyc-front-inp" accept="image/*" class="input" style="font-size:12px;"/></label>' +
        '<label style="display:block;"><div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:6px;">Ghana Card Back</div><input type="file" id="kyc-back-inp" accept="image/*" class="input" style="font-size:12px;"/></label>' +
      '</div>' +
      '<label style="display:block;margin-bottom:12px;"><div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:6px;">Selfie / Face Photo</div><input type="file" id="kyc-selfie-inp" accept="image/*" class="input" style="font-size:12px;"/></label>' +
      '<input type="text" id="kyc-card-num" class="input" placeholder="Ghana Card Number, e.g. GHA-000000000-0" style="font-size:13px;margin-bottom:12px;"/>' +
      '<button type="button" onclick="submitKycDash()" class="btn-primary" style="width:100%;padding:13px;font-size:13px;">Submit KYC Documents</button>' +
    '</div>';
  }

  function fileToBase64(file){
    return new Promise(function(resolve, reject){
      if (!file) return resolve(null);
      var reader = new FileReader();
      reader.onload = function(e){ resolve(e.target.result); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  window.loadKyc = function(){
    var box = byId('kyc-content');
    if (box) box.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading KYC status...</div>';
    if (!http()) { renderKyc({}); return; }
    http().get('/api/providers/me/dashboard', { headers: headers() })
      .then(function(res){ renderKyc((res.data || {}).provider || {}); })
      .catch(function(){
        if (box) box.innerHTML = '<div style="padding:18px;border-radius:14px;background:rgba(217,45,32,0.06);border:1px solid rgba(217,45,32,0.18);font-size:13px;color:#D92D20;">Could not load KYC status. Please refresh and try again.</div>';
      });
  };

  window.submitKycDash = function(){
    if (!http()) return;
    var front = byId('kyc-front-inp');
    var back = byId('kyc-back-inp');
    var selfie = byId('kyc-selfie-inp');
    var card = byId('kyc-card-num');
    Promise.all([
      fileToBase64(front && front.files ? front.files[0] : null),
      fileToBase64(back && back.files ? back.files[0] : null),
      fileToBase64(selfie && selfie.files ? selfie.files[0] : null)
    ]).then(function(files){
      var payload = { kyc_card_number: card ? card.value.trim() : '' };
      if (files[0]) payload.kyc_front_url = files[0];
      if (files[1]) payload.kyc_back_url = files[1];
      if (files[2]) payload.kyc_selfie_url = files[2];
      if (!payload.kyc_card_number && !payload.kyc_front_url && !payload.kyc_back_url && !payload.kyc_selfie_url) {
        toast('Please add your Ghana Card number or upload at least one document.', 'error');
        return;
      }
      toast('Submitting KYC...', 'info');
      http().post('/api/providers/me/kyc', payload, { headers: headers() })
        .then(function(){ toast('KYC submitted for review.', 'success'); window.loadKyc(); })
        .catch(function(error){
          var data = error && error.response && error.response.data ? error.response.data : {};
          toast(data.error || 'KYC submission failed', 'error');
        });
    });
  };

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(moveLogoutUnderSettings, 200);
    setTimeout(moveLogoutUnderSettings, 1000);
  });
})();
</script>`
  if (html.includes('provider-kyc-logout-fix')) return html
  return html.replace('</body>', script + '</body>')
}
