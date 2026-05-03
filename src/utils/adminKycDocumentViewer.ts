const ADMIN_KYC_DOCUMENT_VIEWER_SCRIPT = `
<script id="admin-kyc-document-viewer">
(function(){
  if (location.pathname !== '/admin') return;
  if (window.__salonlinkAdminKycViewerReady) return;
  window.__salonlinkAdminKycViewerReady = true;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>\"']/g, function(ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function adminToken() {
    return localStorage.getItem('sl_token') || localStorage.getItem('token') || localStorage.getItem('auth_token') || '';
  }

  function normalizeImageSrc(value) {
    if (!value || typeof value !== 'string') return '';
    var src = value.trim();
    if (!src) return '';
    if (src.indexOf('data:image') === 0 || src.indexOf('http://') === 0 || src.indexOf('https://') === 0) return src;
    if (/^[A-Za-z0-9+/=]{20,}$/.test(src)) return 'data:image/jpeg;base64,' + src;
    return '';
  }

  function documentBlock(title, rawValue) {
    var src = normalizeImageSrc(rawValue);
    if (!src) {
      return '<div style="border:1px dashed #ddd;border-radius:16px;padding:18px;background:#fafafa;min-height:120px;display:flex;align-items:center;justify-content:center;text-align:center;color:#777;font-size:12px;"><div><strong>' + escapeHtml(title) + '</strong><br>Not uploaded</div></div>';
    }

    return '<div style="border:1px solid #eee;border-radius:16px;padding:12px;background:#fff;overflow:hidden;">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#777;margin-bottom:10px;">' + escapeHtml(title) + '</div>' +
      '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(title) + '" style="width:100%;max-height:340px;object-fit:contain;border-radius:12px;background:#f7f7f7;display:block;">' +
      '<a href="' + escapeHtml(src) + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;font-size:12px;color:#111;font-weight:700;">Open full image</a>' +
    '</div>';
  }

  function showMessage(message, isError) {
    var body = document.getElementById('kyc-doc-body');
    if (!body) return;
    body.innerHTML = '<div style="padding:24px;border:1px solid ' + (isError ? '#f2caca' : '#eee') + ';background:' + (isError ? '#fff5f5' : '#fafafa') + ';border-radius:16px;color:' + (isError ? '#9b1c1c' : '#555') + ';">' + escapeHtml(message) + '</div>';
  }

  function ensureModal() {
    var modal = document.getElementById('kyc-doc-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'kyc-doc-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:999999;display:none;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:24px;max-width:980px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 30px 90px rgba(0,0,0,.35);">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 24px;border-bottom:1px solid #eee;">' +
        '<div><div style="font-size:18px;font-weight:900;color:#111;">KYC Documents</div><div id="kyc-doc-sub" style="font-size:12px;color:#777;margin-top:2px;">Loading...</div></div>' +
        '<button type="button" id="kyc-doc-close" style="width:38px;height:38px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:20px;">&times;</button>' +
      '</div>' +
      '<div id="kyc-doc-body" style="padding:22px;">Loading...</div>' +
    '</div>';

    modal.addEventListener('click', function(event) {
      if (event.target === modal) modal.style.display = 'none';
    });
    document.body.appendChild(modal);

    var close = document.getElementById('kyc-doc-close');
    if (close) close.addEventListener('click', function() { modal.style.display = 'none'; });

    return modal;
  }

  async function fetchKycImages(providerId, token) {
    var url = '/api/admin/providers/' + encodeURIComponent(providerId) + '/kyc-images';
    var headers = { Authorization: 'Bearer ' + token };

    if (window.axios) {
      var axiosResponse = await window.axios.get(url, { headers: headers });
      return axiosResponse.data || {};
    }

    var response = await fetch(url, { headers: headers });
    var data = await response.json().catch(function() { return {}; });
    if (!response.ok) throw new Error(data.error || 'Could not load KYC documents');
    return data;
  }

  async function showKycDocuments(providerId) {
    if (!providerId) {
      showMessage('Provider ID missing for this KYC record.', true);
      return;
    }

    var token = adminToken();
    var modal = ensureModal();
    modal.style.display = 'flex';

    var subtitle = document.getElementById('kyc-doc-sub');
    var body = document.getElementById('kyc-doc-body');
    if (subtitle) subtitle.textContent = 'Provider #' + providerId;
    if (body) body.innerHTML = '<div style="padding:30px;text-align:center;color:#777;">Loading documents...</div>';

    if (!token) {
      showMessage('Admin session missing. Please sign in again.', true);
      return;
    }

    try {
      var data = await fetchKycImages(providerId, token);
      if (!data.success) throw new Error(data.error || 'Could not load KYC documents');

      var images = data.images || {};
      var cardNumber = images.kyc_card_number || '';
      if (subtitle) subtitle.textContent = 'Ghana Card: ' + (cardNumber || 'Not uploaded');
      if (!body) return;

      body.innerHTML =
        '<div style="background:#f8f8f8;border:1px solid #eee;border-radius:16px;padding:14px;margin-bottom:18px;font-size:13px;color:#333;"><strong>Ghana Card Number:</strong> ' + escapeHtml(cardNumber || 'Not uploaded') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">' +
          documentBlock('Ghana Card Front', images.kyc_front_url) +
          documentBlock('Ghana Card Back', images.kyc_back_url) +
          documentBlock('Selfie', images.kyc_selfie_url) +
        '</div>';
    } catch (error) {
      console.error('KYC DOCUMENT VIEW ERROR:', error);
      showMessage('Could not load KYC documents. Please try again or refresh your admin session.', true);
    }
  }

  function providerIdFromRow(row) {
    if (!row) return '';
    var explicit = row.getAttribute('data-provider-id');
    if (explicit) return explicit;

    var rowId = row.id || '';
    var rowMatch = rowId.match(/kyc-row-(\d+)/);
    if (rowMatch) return rowMatch[1];

    var target = row.querySelector('[onclick*="viewProviderKyc"], [onclick*="loadKycImages"], [onclick*="approveKyc"], [onclick*="rejectKyc"]');
    var onclick = target ? target.getAttribute('onclick') || '' : '';
    var clickMatch = onclick.match(/\((\d+)\)/);
    if (clickMatch) return clickMatch[1];

    return '';
  }

  function ensureKycDocumentButtons() {
    var tbody = document.getElementById('kyc-tbody');
    if (!tbody) return;

    Array.prototype.slice.call(tbody.querySelectorAll('tr')).forEach(function(row) {
      if (row.dataset.kycViewerAdded === '1') return;
      if ((row.textContent || '').toLowerCase().indexOf('loading') >= 0) return;

      var providerId = providerIdFromRow(row);
      if (!providerId) return;

      row.dataset.kycViewerAdded = '1';
      var actionCell = row.querySelector('td:last-child') || row.insertCell(-1);
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'View Documents';
      button.style.cssText = 'margin:4px;padding:8px 12px;border-radius:999px;border:1px solid #111;background:#111;color:#fff;font-size:11px;font-weight:800;cursor:pointer;';
      button.addEventListener('click', function() { showKycDocuments(providerId); });
      actionCell.appendChild(button);
    });
  }

  window.openKycDocuments = showKycDocuments;
  window.viewProviderKyc = showKycDocuments;
  window.loadKycImages = showKycDocuments;
  window.ensureKycDocumentButtons = ensureKycDocumentButtons;

  document.addEventListener('DOMContentLoaded', function() {
    ensureKycDocumentButtons();
    var tbody = document.getElementById('kyc-tbody');
    if (tbody && window.MutationObserver) {
      new MutationObserver(ensureKycDocumentButtons).observe(tbody, { childList: true, subtree: true });
    }
    document.addEventListener('click', function() { setTimeout(ensureKycDocumentButtons, 400); }, true);
  });
})();
</script>`

export function withAdminKycDocumentViewer(html: string): string {
  if (html.includes('__salonlinkAdminKycViewerReady')) return html
  if (html.includes('</body>')) {
    return html.replace('</body>', ADMIN_KYC_DOCUMENT_VIEWER_SCRIPT + '</body>')
  }
  return html + ADMIN_KYC_DOCUMENT_VIEWER_SCRIPT
}
