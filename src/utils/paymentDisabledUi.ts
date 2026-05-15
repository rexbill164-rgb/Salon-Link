export const PAYMENT_DISABLED_MESSAGE = 'Payment will be handled at the salon. Mobile Money payment is currently unavailable.'

export function withPaymentDisabledUi(html: string): string {
  const script = `
<script id="payment-disabled-ui-guard">
(function(){
  var MSG = ${JSON.stringify('Payment will be handled at the salon. Mobile Money payment is currently unavailable.')};
  var toastShown = false;
  var lastToastAt = 0;

  function toastOnce(){
    var now = Date.now();
    if (toastShown || now - lastToastAt < 4000) return;
    toastShown = true;
    lastToastAt = now;
    if (window.showToast) window.showToast(MSG, 'info');
  }

  function markDisabled(el, text){
    if (!el || el.dataset.paymentDisabledGuard === '1') return;
    el.dataset.paymentDisabledGuard = '1';
    el.removeAttribute('href');
    el.removeAttribute('onclick');
    el.setAttribute('aria-disabled', 'true');
    el.style.opacity = '0.55';
    el.style.cursor = 'not-allowed';
    if (/^(BUTTON|INPUT|SELECT)$/i.test(el.tagName)) el.disabled = true;
    if (text && /^(BUTTON|A)$/i.test(el.tagName)) el.textContent = text;
  }

  function isPaymentElement(el){
    if (!el) return false;
    var text = (el.textContent || el.value || '').toLowerCase();
    var href = (el.getAttribute && el.getAttribute('href') || '').toLowerCase();
    var onclick = (el.getAttribute && el.getAttribute('onclick') || '').toLowerCase();
    var id = (el.id || '').toLowerCase();
    var cls = (el.className || '').toString().toLowerCase();
    var hay = text + ' ' + href + ' ' + onclick + ' ' + id + ' ' + cls;
    return hay.indexOf('momo') >= 0 || hay.indexOf('mobile money') >= 0 || hay.indexOf('paystack') >= 0 || hay.indexOf('pay now') >= 0 || hay.indexOf('send prompt') >= 0;
  }

  function patch(){
    Array.prototype.slice.call(document.querySelectorAll('a,button,input,select')).forEach(function(el){
      if (!isPaymentElement(el)) return;
      if (el.tagName === 'INPUT') { el.placeholder = 'Mobile Money unavailable'; }
      markDisabled(el, 'Payment Unavailable');
    });

    var paymentMethods = document.getElementById('payment-methods');
    if (paymentMethods && location.pathname.indexOf('/book/') === 0 && paymentMethods.dataset.cashOnlyRendered !== '1') {
      paymentMethods.dataset.cashOnlyRendered = '1';
      paymentMethods.innerHTML = '<div class="pay-method selected" style="cursor:default;"><span style="font-size:22px;">Cash</span><div style="flex:1;"><div style="font-size:13px;font-weight:600;">Pay at salon</div><div style="font-size:11px;color:var(--t-muted);">' + MSG + '</div></div><span class="badge" style="font-size:9px;">Active</span></div>';
    }

    window.payWithMomo = function(){ toastOnce(); };
    window.initiatePayment = function(){ toastOnce(); };
  }

  document.addEventListener('click', function(e){
    var target = e.target && e.target.closest ? e.target.closest('a,button,input,select,[aria-disabled="true"]') : null;
    if (target && isPaymentElement(target)) {
      e.preventDefault();
      e.stopPropagation();
      toastOnce();
    }
  }, true);

  patch();
  document.addEventListener('DOMContentLoaded', patch);
  setTimeout(patch, 300);
  setTimeout(patch, 1200);
})();
</script>`
  let next = html
    .replace(/Send MoMo Prompt/g, 'Payment Unavailable')
    .replace(/Mobile Money Number/g, 'Mobile Money unavailable')
    .replace(/Pay with Paystack/g, 'Payment Unavailable')
    .replace(/Pay Now/g, 'Payment Unavailable')
    .replace(/Confirm & Pay/g, 'Confirm Booking')
    .replace(/Secure your slot instantly with MoMo or Card/g, PAYMENT_DISABLED_MESSAGE)
  if (next.includes('payment-disabled-ui-guard')) return next
  return next.replace('</body>', script + '</body>')
}
