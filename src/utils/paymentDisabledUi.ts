export const PAYMENT_DISABLED_MESSAGE = 'Payment will be handled at the salon. Mobile Money payment is currently unavailable.'

export function withPaymentDisabledUi(html: string): string {
  const script = `
<script id="payment-disabled-ui-guard">
(function(){
  var MSG = ${JSON.stringify('Payment will be handled at the salon. Mobile Money payment is currently unavailable.')};
  var toastShown = false;
  var lastToastAt = 0;
  var cleanCashMessage = 'Your booking will be confirmed immediately. Pay the service amount directly to the provider when you arrive.';

  function toastOnce(){
    var now = Date.now();
    if (toastShown || now - lastToastAt < 4000) return;
    toastShown = true;
    lastToastAt = now;
    if (window.showToast) window.showToast(MSG, 'info');
  }

  function removeFeeText(){
    var exact = [
      'Your provider will send a GHS 2 platform charge to SalonLink after your appointment.',
      'Your provider will send a GHS 2 platform fee to SalonLink after your appointment.',
      'After your appointment, your provider will send the GHS 2.00 platform charge to:',
      'After your appointment, your provider will send the GHS 2.00 platform fee to:',
      'GHS 2 platform charge',
      'GHS 2 platform fee',
      'GHS 2.00',
      'GHS 2.00',
      'Platform Fee Reminder',
      'Platform Fee',
      'platform fee'
    ];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var v = node.nodeValue || '';
      exact.forEach(function(x){ v = v.split(x).join(''); });
      if (v.indexOf('Your booking will be confirmed immediately') >= 0 && v.indexOf('Pay the full amount directly') >= 0) v = cleanCashMessage;
      node.nodeValue = v.replace(/\s{2,}/g, ' ').trim();
    });
    var cash = document.getElementById('cash-booking-notice');
    if (cash) {
      cash.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--g-main);margin-bottom:6px;">Pay On-Site Details</div><div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">' + cleanCashMessage + '</div>';
    }
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

    removeFeeText();
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
  setTimeout(patch, 2500);
})();
</script>`
  let next = html
    .replace(/Your provider will send a GHS 2 platform charge to SalonLink after your appointment\./g, 'Pay the service amount directly to the provider when you arrive.')
    .replace(/Your provider will send a GHS 2 platform fee to SalonLink after your appointment\./g, 'Pay the service amount directly to the provider when you arrive.')
    .replace(/GHS 2 platform charge/g, '')
    .replace(/GHS 2 platform fee/g, '')
    .replace(/Platform Fee Reminder/g, 'Booking Reminder')
    .replace(/Platform Fee/g, '')
    .replace(/platform fee/g, '')
    .replace(/Send MoMo Prompt/g, 'Payment Unavailable')
    .replace(/Mobile Money Number/g, 'Mobile Money unavailable')
    .replace(/Pay with Paystack/g, 'Payment Unavailable')
    .replace(/Pay Now/g, 'Payment Unavailable')
    .replace(/Confirm & Pay/g, 'Confirm Booking')
    .replace(/Secure your slot instantly with MoMo or Card/g, PAYMENT_DISABLED_MESSAGE)
  if (next.includes('payment-disabled-ui-guard')) return next
  return next.replace('</body>', script + '</body>')
}
