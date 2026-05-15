export const PAYMENT_DISABLED_MESSAGE = 'Payment will be handled at the salon. Mobile Money payment is currently unavailable.'

export function withPaymentDisabledUi(html: string): string {
  const script = `
<script id="payment-disabled-ui-guard">
(function(){
  var MSG = ${JSON.stringify('Payment will be handled at the salon. Mobile Money payment is currently unavailable.')};
  function toast(){ if (window.showToast) window.showToast(MSG, 'info'); }
  function disable(el, text){
    if (!el) return;
    el.removeAttribute('href');
    el.removeAttribute('onclick');
    el.disabled = true;
    el.setAttribute('aria-disabled', 'true');
    el.style.opacity = '0.55';
    el.style.cursor = 'not-allowed';
    if (text) el.textContent = text;
    el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); toast(); }, true);
  }
  function patch(){
    Array.prototype.slice.call(document.querySelectorAll('a,button,input,select,div')).forEach(function(el){
      var text = (el.textContent || el.value || '').toLowerCase();
      var href = (el.getAttribute && el.getAttribute('href') || '').toLowerCase();
      var onclick = (el.getAttribute && el.getAttribute('onclick') || '').toLowerCase();
      var id = (el.id || '').toLowerCase();
      var hay = text + ' ' + href + ' ' + onclick + ' ' + id;
      var isOnlinePay = hay.indexOf('momo') >= 0 || hay.indexOf('mobile money') >= 0 || hay.indexOf('paystack') >= 0 || hay.indexOf('pay now') >= 0 || hay.indexOf('send prompt') >= 0;
      if (!isOnlinePay) return;
      if (el.tagName === 'INPUT') { el.disabled = true; el.placeholder = 'Mobile Money unavailable'; return; }
      if (el.tagName === 'SELECT') { el.disabled = true; return; }
      disable(el, /button|a/i.test(el.tagName) ? 'Payment Unavailable' : null);
    });
    var paymentMethods = document.getElementById('payment-methods');
    if (paymentMethods && location.pathname.indexOf('/book/') === 0) {
      paymentMethods.innerHTML = '<div class="pay-method selected" style="cursor:default;"><span style="font-size:22px;">Cash</span><div style="flex:1;"><div style="font-size:13px;font-weight:600;">Pay at salon</div><div style="font-size:11px;color:var(--t-muted);">' + MSG + '</div></div><span class="badge" style="font-size:9px;">Active</span></div>';
    }
    window.payWithMomo = function(){ toast(); };
    window.initiatePayment = function(){ toast(); };
  }
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
