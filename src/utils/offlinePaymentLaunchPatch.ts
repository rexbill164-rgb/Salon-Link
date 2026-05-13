export const OFFLINE_PAYMENT_MESSAGE = 'Payment will be handled at the salon. Mobile Money payment is currently unavailable.'

const offlinePaymentPatchScript = `
<script id="sl-offline-payment-launch-patch">
(function() {
  var MSG = ${JSON.stringify(OFFLINE_PAYMENT_MESSAGE)};

  function notify() {
    if (typeof window.showToast === 'function') window.showToast(MSG, 'info');
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function resetConfirmButton() {
    var btn = document.getElementById('confirm-btn');
    var txt = document.getElementById('confirm-text');
    var load = document.getElementById('confirm-loader');
    if (btn) btn.disabled = false;
    if (txt) { txt.style.display = ''; txt.textContent = 'Confirm Booking'; }
    if (load) load.style.display = 'none';
  }

  function patchBookingPaymentUi() {
    if (!window.location.pathname.indexOf('/book/') === 0) return;

    window.payWhen = 'later';

    var payNow = document.getElementById('pay-now-wrap');
    if (payNow) {
      payNow.classList.remove('selected');
      payNow.removeAttribute('onclick');
      payNow.setAttribute('aria-disabled', 'true');
      payNow.style.opacity = '0.55';
      payNow.style.cursor = 'not-allowed';
      setText(payNow.querySelector('div[style*="font-size:14px"]'), 'Mobile Money unavailable');
      setText(payNow.querySelector('div[style*="font-size:12px"]'), MSG);
      setText(payNow.querySelector('.badge'), 'Coming soon');
    }

    var payLater = document.getElementById('pay-later-wrap');
    if (payLater) {
      payLater.classList.add('selected');
      payLater.removeAttribute('onclick');
      payLater.style.cursor = 'default';
      setText(payLater.querySelector('div[style*="font-size:14px"]'), 'Pay at salon');
      setText(payLater.querySelector('div[style*="font-size:12px"]'), 'Confirm the booking now and pay directly at the salon.');
      setText(payLater.querySelector('.badge'), 'Cash/manual');
    }

    var methods = document.getElementById('payment-methods');
    if (methods) {
      methods.style.display = 'flex';
      methods.style.flexDirection = 'column';
      methods.innerHTML =
        '<div class="eyebrow" style="margin-bottom:12px;">Payment Method</div>' +
        '<div class="pay-method selected" style="cursor:default;">' +
          '<span style="font-size:22px;">Cash</span>' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;">Pay at salon</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">' + MSG + '</div>' +
          '</div>' +
          '<span class="badge" style="font-size:9px;background:rgba(201,168,76,0.15);color:var(--g-main);">Active</span>' +
        '</div>' +
        '<div class="pay-method" aria-disabled="true" style="cursor:not-allowed;opacity:0.55;">' +
          '<span style="font-size:22px;">MoMo</span>' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;">Mobile Money</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">Currently unavailable</div>' +
          '</div>' +
          '<span class="badge" style="font-size:9px;">Coming soon</span>' +
        '</div>' +
        '<div class="pay-method" aria-disabled="true" style="cursor:not-allowed;opacity:0.55;">' +
          '<span style="font-size:22px;">Card</span>' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;">Card / Paystack</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">Currently unavailable</div>' +
          '</div>' +
          '<span class="badge" style="font-size:9px;">Unavailable</span>' +
        '</div>';
    }

    var momoInput = document.getElementById('momo-input');
    if (momoInput) {
      momoInput.style.display = 'block';
      momoInput.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--t-primary);margin-bottom:8px;">Mobile Money unavailable</div><div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">' + MSG + '</div>';
    }

    var cashNotice = document.getElementById('cash-booking-notice');
    if (cashNotice) {
      cashNotice.style.display = 'block';
      cashNotice.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--g-main);margin-bottom:6px;">Payment at the salon</div><div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">' + MSG + '</div>';
    }

    resetConfirmButton();
  }

  function forceManualBooking() {
    var token = typeof window.getToken === 'function' ? window.getToken() : localStorage.getItem('sl_token');
    if (!token) {
      if (typeof window.showToast === 'function') window.showToast('Please log in to book', 'error');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (!window.selectedService || !window.selectedService.id) {
      if (typeof window.showToast === 'function') window.showToast('Please select a service', 'error');
      if (typeof window.goStep === 'function') window.goStep(1);
      return;
    }
    if (!window.selectedDate) {
      if (typeof window.showToast === 'function') window.showToast('Please select a date', 'error');
      if (typeof window.goStep === 'function') window.goStep(2);
      return;
    }
    if (!window.selectedTime) {
      if (typeof window.showToast === 'function') window.showToast('Please select a time', 'error');
      if (typeof window.goStep === 'function') window.goStep(2);
      return;
    }

    var btn = document.getElementById('confirm-btn');
    var txt = document.getElementById('confirm-text');
    var load = document.getElementById('confirm-loader');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (load) load.style.display = 'inline-flex';

    window.axios.post('/api/bookings', {
      provider_id: window._providerId,
      service_id: window.selectedService.id,
      booking_date: window.selectedDate,
      booking_time: window.selectedTime,
      notes: document.getElementById('b-notes') ? document.getElementById('b-notes').value.trim() : ''
    }, { headers: { Authorization: 'Bearer ' + token } })
      .then(function(res) {
        var bookingId = res.data.booking_id || (res.data.booking && res.data.booking.id) || res.data.id;
        if (!bookingId) throw new Error('Booking created but booking ID was not returned.');
        window._bookingId = bookingId;
        return window.axios.post('/api/payments/cash-book', { booking_id: bookingId }, { headers: { Authorization: 'Bearer ' + token } });
      })
      .then(function(cashRes) {
        window._bookingRef = cashRes.data.reference || ('SL-CASH-' + window._bookingId);
        resetConfirmButton();
        if (typeof window.showReceipt === 'function') window.showReceipt('cash', '');
        else window.location.href = '/dashboard';
      })
      .catch(function(err) {
        var msg = (err.response && err.response.data && (err.response.data.error || err.response.data.message)) || err.message || 'Booking failed. Please try again.';
        if (typeof window.showToast === 'function') window.showToast(msg, 'error');
        resetConfirmButton();
      });
  }

  function patchBookingPage() {
    if (window.location.pathname.indexOf('/book/') !== 0) return;
    patchBookingPaymentUi();
    window.selectPayWhen = function() { window.payWhen = 'later'; patchBookingPaymentUi(); notify(); };
    window.selectPayMethod = function() { notify(); };
    window.payWithMomo = function() { notify(); };
    window.payWithCash = function() {
      if (typeof window.closePaymentModal === 'function') window.closePaymentModal();
      if (typeof window.showReceipt === 'function') window.showReceipt('cash', '');
    };
    window.confirmBooking = forceManualBooking;
  }

  function patchPaymentPage() {
    if (window.location.pathname.indexOf('/payment/pay') !== 0) return;
    var loading = document.getElementById('loading-overlay');
    if (loading) loading.style.display = 'none';
    var btn = document.getElementById('pay-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Payment Unavailable';
    }
    var note = document.querySelector('.security-note');
    if (note) note.textContent = MSG;
    if (typeof window.showError === 'function') window.showError(MSG);
    window.initiatePayment = function() {
      if (typeof window.showError === 'function') window.showError(MSG);
      notify();
    };
  }

  function patchPaymentSuccessPage() {
    if (window.location.pathname.indexOf('/payment/success') !== 0) return;
    setTimeout(function() {
      var title = document.getElementById('status-title');
      var msg = document.getElementById('status-msg');
      if (title) title.textContent = 'Online payment unavailable';
      if (msg) msg.textContent = MSG;
    }, 0);
  }

  function patch() {
    patchBookingPage();
    patchPaymentPage();
    patchPaymentSuccessPage();
  }

  patch();
  document.addEventListener('DOMContentLoaded', patch);
  setTimeout(patch, 250);
})();
</script>`

export function withOfflinePaymentLaunchPatch(html: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/Confirm & Pay/g, 'Confirm Booking'],
    [/Confirm Cash Booking/g, 'Confirm Booking'],
    [/Pay with Paystack/g, 'Payment Unavailable'],
    [/Redirecting to Paystack\.\.\./g, 'Payment unavailable'],
    [/Pay Now/g, 'Mobile Money unavailable'],
    [/Secure your slot instantly with MoMo or Card/g, OFFLINE_PAYMENT_MESSAGE],
    [/Recommended/g, 'Coming soon'],
    [/Select Payment Method/g, 'Payment Method'],
    [/Mobile Money Number/g, 'Mobile Money unavailable'],
    [/Secure Payment/g, 'Payment paused'],
    [/256-bit SSL encryption · Powered by Paystack/g, OFFLINE_PAYMENT_MESSAGE]
  ]

  const patchedHtml = replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), html)

  if (patchedHtml.includes('sl-offline-payment-launch-patch')) return patchedHtml
  return patchedHtml.replace('</body>', `${offlinePaymentPatchScript}\n</body>`)
}
