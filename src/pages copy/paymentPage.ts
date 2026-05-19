import { baseHead, globalScripts } from '../utils/layout'

export const paymentPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Pay for Booking — SalonLink')}
<style>
  body { background:var(--c-deep); display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
  .pay-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:24px; padding:36px 32px; max-width:480px; width:100%; box-shadow:0 20px 60px rgba(0,0,0,0.12); }
  .pay-logo { display:flex; align-items:center; gap:10px; margin-bottom:28px; }
  .breakdown { background:var(--c-raise); border:1px solid var(--i-faint); border-radius:16px; padding:20px; margin-bottom:24px; }
  .breakdown-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; font-size:14px; }
  .breakdown-row:not(:last-child) { border-bottom:1px solid var(--i-faint); }
  .breakdown-total { font-weight:700; font-size:16px; color:var(--t-primary); }
  .pay-btn { width:100%; padding:16px; border-radius:14px; font-size:15px; font-weight:700; background:linear-gradient(135deg,var(--g-deep),var(--g-main)); color:white; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:opacity 0.2s; }
  .pay-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .pay-btn:hover:not(:disabled) { opacity:0.9; }
  .security-note { text-align:center; font-size:11px; color:var(--t-muted); margin-top:16px; display:flex; align-items:center; justify-content:center; gap:6px; }
  .badge-green { background:rgba(93,201,138,0.12); color:#5DC98A; padding:3px 10px; border-radius:100px; font-size:10px; font-weight:700; }
  .badge-gold { background:var(--g-dim); color:var(--g-main); padding:3px 10px; border-radius:100px; font-size:10px; font-weight:700; }
  .error-box { background:rgba(224,112,112,0.08); border:1px solid rgba(224,112,112,0.3); border-radius:12px; padding:14px; margin-bottom:20px; font-size:13px; color:#E07070; display:none; }
  .loading-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:999; align-items:center; justify-content:center; flex-direction:column; gap:16px; }
  .spinner { width:48px; height:48px; border:4px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
</style>
</head>
<body>
<div class="loading-overlay" id="loading-overlay">
  <div class="spinner"></div>
  <div style="color:white;font-size:14px;font-weight:600;">Redirecting to Paystack...</div>
</div>

<div class="pay-card">
  <!-- Logo -->
  <div class="pay-logo">
    <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45);display:flex;align-items:center;justify-content:center;">
      <span style="color:white;font-size:16px;">✦</span>
    </div>
    <span style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:800;background:linear-gradient(135deg,#833AB4,#E1306C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Salon<em style="font-weight:400;font-style:italic;">Link</em></span>
    <span class="badge-green">Secure Payment</span>
  </div>

  <!-- Error box -->
  <div class="error-box" id="error-box"></div>

  <!-- Booking summary -->
  <div style="margin-bottom:20px;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t-muted);margin-bottom:8px;">Booking Summary</div>
    <div id="booking-summary" style="font-size:14px;color:var(--t-secondary);">Loading booking details...</div>
  </div>

  <!-- Price breakdown -->
  <div class="breakdown">
    <div class="breakdown-row">
      <span style="color:var(--t-secondary);">Service Amount</span>
      <span id="svc-amount" style="font-weight:600;">—</span>
    </div>
    <div class="breakdown-row">
      <span style="color:var(--t-secondary);">Platform Fee <span class="badge-gold">SalonLink</span></span>
      <span id="platform-fee" style="font-weight:600;color:var(--g-main);">GHS 3.00</span>
    </div>
    <div class="breakdown-row breakdown-total">
      <span>Total Charge</span>
      <span id="total-amount" class="font-display gold-gradient">—</span>
    </div>
  </div>

  <!-- Note -->
  <div style="font-size:12px;color:var(--t-muted);margin-bottom:20px;padding:12px;background:var(--c-raise);border-radius:10px;border-left:3px solid var(--g-main);">
    💡 <strong>Transparent pricing:</strong> GHS 3.00 goes to SalonLink platform. The rest goes directly to your provider.
  </div>

  <!-- Pay button -->
  <button class="pay-btn" id="pay-btn" onclick="initiatePayment()">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    Pay with Paystack
  </button>

  <!-- Security note -->
  <div class="security-note">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    256-bit SSL encryption · Powered by Paystack
  </div>

  <div style="margin-top:20px;text-align:center;">
    <a href="/dashboard" style="font-size:12px;color:var(--t-muted);text-decoration:none;">← Back to Dashboard</a>
  </div>
</div>

${globalScripts()}
<script>
var bookingId = null;

(function init() {
  var params = new URLSearchParams(window.location.search);
  bookingId = params.get('booking_id');
  if (!bookingId) { showError('No booking ID provided. Please go back and try again.'); return; }

  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search); return; }

  // Load booking details
  axios.get('/api/bookings/' + bookingId, { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) {
      var b = r.data.booking;
      if (!b) { showError('Booking not found.'); return; }
      if (b.payment_status === 'paid') {
        showError('This booking is already paid. <a href="/dashboard" style="color:var(--g-main);">Go to Dashboard</a>');
        document.getElementById('pay-btn').disabled = true;
        return;
      }

      var svcAmt = b.total_amount / 100;
      var platformFee = 3.00;
      var total = svcAmt + platformFee;

      document.getElementById('booking-summary').innerHTML =
        '<div style="display:grid;gap:6px;">' +
        '<div>📅 <strong>' + b.booking_date + '</strong> at <strong>' + b.booking_time + '</strong></div>' +
        '<div>💇 <strong>' + (b.service_name||'Service') + '</strong> at <strong>' + (b.business_name||'Provider') + '</strong></div>' +
        '<div>📍 ' + (b.city||'Accra') + '</div>' +
        '</div>';

      document.getElementById('svc-amount').textContent = 'GHS ' + svcAmt.toFixed(2);
      document.getElementById('total-amount').textContent = 'GHS ' + total.toFixed(2);
    })
    .catch(function(e) {
      showError('Could not load booking: ' + (e.response?.data?.error || e.message));
    });
})();

function initiatePayment() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }

  var btn = document.getElementById('pay-btn');
  btn.disabled = true;
  btn.innerHTML = '<div style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;"></div> Processing...';

  axios.post('/api/payments/initialize', { booking_id: parseInt(bookingId) }, { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) {
      if (r.data.authorization_url) {
        document.getElementById('loading-overlay').style.display = 'flex';
        window.location.href = r.data.authorization_url;
      } else {
        showError('Could not initialize payment. Please try again.');
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Pay with Paystack';
      }
    })
    .catch(function(e) {
      var msg = e.response?.data?.error || 'Payment initialization failed.';
      showError(msg);
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Pay with Paystack';
    });
}

function showError(msg) {
  var box = document.getElementById('error-box');
  box.innerHTML = '⚠️ ' + msg;
  box.style.display = 'block';
}
</script>
</body>
</html>`

export const paymentSuccessPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Payment Successful — SalonLink')}
<style>
  body { background:var(--c-deep); display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
  .success-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:24px; padding:48px 36px; max-width:460px; width:100%; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.12); }
  .checkmark { width:80px; height:80px; border-radius:50%; background:rgba(93,201,138,0.12); border:2px solid rgba(93,201,138,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; font-size:36px; }
  .details-grid { background:var(--c-raise); border:1px solid var(--i-faint); border-radius:16px; padding:20px; margin:24px 0; text-align:left; }
  .detail-row { display:flex; justify-content:space-between; padding:8px 0; font-size:13px; }
  .detail-row:not(:last-child) { border-bottom:1px solid var(--i-faint); }
</style>
</head>
<body>
<div class="success-card">
  <div class="checkmark" id="status-icon">✅</div>
  <h1 id="status-title" class="font-display" style="font-size:26px;font-weight:700;margin-bottom:8px;">Verifying Payment...</h1>
  <p id="status-msg" style="font-size:14px;color:var(--t-secondary);margin-bottom:0;">Please wait while we confirm your payment.</p>

  <div class="details-grid" id="payment-details" style="display:none;">
    <div class="detail-row">
      <span style="color:var(--t-muted);">Reference</span>
      <span id="det-ref" style="font-family:monospace;font-size:11px;color:var(--t-primary);">—</span>
    </div>
    <div class="detail-row">
      <span style="color:var(--t-muted);">Amount Paid</span>
      <span id="det-amount" style="font-weight:700;color:var(--t-primary);">—</span>
    </div>
    <div class="detail-row">
      <span style="color:var(--t-muted);">Status</span>
      <span style="color:#5DC98A;font-weight:700;">Confirmed ✓</span>
    </div>
  </div>

  <div id="action-btns" style="display:none;margin-top:24px;display:flex;flex-direction:column;gap:12px;">
    <a href="/dashboard" style="display:block;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));color:white;font-weight:700;font-size:14px;text-decoration:none;">View My Bookings</a>
    <a href="/discover" style="display:block;padding:14px;border-radius:14px;border:1px solid var(--i-faint);color:var(--t-secondary);font-weight:600;font-size:14px;text-decoration:none;">Explore More Salons</a>
  </div>

  <div id="fail-btn" style="display:none;margin-top:24px;">
    <a href="/dashboard" style="display:block;padding:14px;border-radius:14px;border:1px solid var(--i-faint);color:var(--t-secondary);font-weight:600;font-size:14px;text-decoration:none;">Go to Dashboard</a>
  </div>
</div>

${globalScripts()}
<script>
(function() {
  var params = new URLSearchParams(window.location.search);
  var ref = params.get('ref') || params.get('reference') || params.get('trxref');

  if (!ref) {
    document.getElementById('status-icon').textContent = '❌';
    document.getElementById('status-title').textContent = 'No Reference Found';
    document.getElementById('status-msg').textContent = 'Could not verify payment — no reference provided.';
    document.getElementById('fail-btn').style.display = 'block';
    return;
  }

  // Verify the payment
  axios.get('/api/payments/verify/' + encodeURIComponent(ref))
    .then(function(r) {
      if (r.data.success && r.data.status === 'success') {
        document.getElementById('status-icon').textContent = '🎉';
        document.getElementById('status-title').textContent = 'Payment Successful!';
        document.getElementById('status-msg').textContent = 'Your booking is confirmed. The provider has been notified.';
        document.getElementById('det-ref').textContent = ref;
        document.getElementById('det-amount').textContent = r.data.amount ? 'GHS ' + (r.data.amount/100).toFixed(2) : '—';
        document.getElementById('payment-details').style.display = 'block';
        document.getElementById('action-btns').style.display = 'flex';
      } else {
        document.getElementById('status-icon').textContent = '❌';
        document.getElementById('status-title').textContent = 'Payment Not Confirmed';
        var errMsg = r.data.message || 'Your payment could not be verified.';
        if (r.data.debug) errMsg += ' (' + JSON.stringify(r.data.debug) + ')';
        document.getElementById('status-msg').textContent = errMsg;
        document.getElementById('fail-btn').style.display = 'block';
      }
    })
    .catch(function(e) {
      var errDetail = e.response && e.response.data ? JSON.stringify(e.response.data) : e.message;
      document.getElementById('status-icon').textContent = '⚠️';
      document.getElementById('status-title').textContent = 'Verification Error';
      document.getElementById('status-msg').textContent = 'Could not verify: ' + errDetail;
      document.getElementById('fail-btn').style.display = 'block';
    });
})();
</script>
</body>
</html>`
