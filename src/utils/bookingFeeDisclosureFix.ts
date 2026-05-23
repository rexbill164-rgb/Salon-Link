export function withBookingFeeDisclosureFix(html: string): string {
  if (html.includes('booking-fee-disclosure-fix-script')) return html

  const patch = `
<script id="booking-fee-disclosure-fix-script">
(function(){
  var cleanCashMessage = 'Your booking will be confirmed immediately. Pay the service amount directly to the provider when you arrive.';

  function serviceAmountText(){
    try {
      if (window.selectedService && Number(window.selectedService.priceGhs || 0)) return 'GHS ' + Number(window.selectedService.priceGhs || 0);
      var sp = document.getElementById('sum-service-price');
      if (sp && sp.textContent) return sp.textContent.trim();
    } catch(e) {}
    return '';
  }

  function hidePlatformFeeRows(){
    var all = Array.prototype.slice.call(document.querySelectorAll('div,span,p,strong'));
    all.forEach(function(node){
      var text = (node.textContent || '').trim().toLowerCase();
      if (text === 'platform fee' || text === 'ghs 3' || text === 'ghs 2' || text.indexOf('provider will send') >= 0 || text.indexOf('platform fee') >= 0) {
        var row = node.closest && node.closest('div[style*="justify-content:space-between"], #rc-cash-notice, #fee-reminder-modal');
        if (row) row.style.display = 'none';
        else node.style.display = 'none';
      }
    });
    var rcNotice = document.getElementById('rc-cash-notice');
    if (rcNotice) rcNotice.style.display = 'none';
  }

  function cleanText(){
    var replacements = [
      ['Your provider will send a GHS 2 platform charge to SalonLink after your appointment.', cleanCashMessage],
      ['Your provider will send a GHS 2 platform fee to SalonLink after your appointment.', cleanCashMessage],
      ['After your appointment, your provider will send the GHS 2.00 platform charge to:', ''],
      ['After your appointment, your provider will send the GHS 2.00 platform fee to:', ''],
      ['Platform Fee Reminder', 'Booking Reminder'],
      ['GHS 2.00', ''],
      ['GHS 2.00', ''],
      ['GHS 2', ''],
      ['GHS 2', ''],
      ['platform fee', ''],
      ['Platform Fee', '']
    ];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var text = node.nodeValue || '';
      replacements.forEach(function(pair){ text = text.split(pair[0]).join(pair[1]); });
      node.nodeValue = text.replace(/\s{2,}/g, ' ').trim();
    });
    var cash = document.getElementById('cash-booking-notice');
    if (cash) cash.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--g-main);margin-bottom:6px;">Pay On-Site Details</div><div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">' + cleanCashMessage + '</div>';
  }

  function forceServiceOnlyTotals(){
    var amount = serviceAmountText();
    if (!amount) return;
    ['sum-price','recap-total','pm-total','rc-total'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.textContent = amount;
    });
    hidePlatformFeeRows();
    cleanText();
  }

  function patchFunctions(){
    if (window.__bookingFeeServiceOnlyPatched) return;
    window.__bookingFeeServiceOnlyPatched = true;

    var oldSelectSvc = window.selectSvc;
    if (typeof oldSelectSvc === 'function') {
      window.selectSvc = function(){
        var result = oldSelectSvc.apply(this, arguments);
        setTimeout(forceServiceOnlyTotals, 0);
        setTimeout(forceServiceOnlyTotals, 250);
        return result;
      };
    }

    var oldProceedToStep4 = window.proceedToStep4;
    if (typeof oldProceedToStep4 === 'function') {
      window.proceedToStep4 = function(){
        var result = oldProceedToStep4.apply(this, arguments);
        setTimeout(forceServiceOnlyTotals, 0);
        setTimeout(forceServiceOnlyTotals, 250);
        return result;
      };
    }

    var oldShowPaymentModal = window.showPaymentModal;
    if (typeof oldShowPaymentModal === 'function') {
      window.showPaymentModal = function(){
        var result = oldShowPaymentModal.apply(this, arguments);
        setTimeout(forceServiceOnlyTotals, 0);
        return result;
      };
    }

    var oldShowReceipt = window.showReceipt;
    if (typeof oldShowReceipt === 'function') {
      window.showReceipt = function(){
        var result = oldShowReceipt.apply(this, arguments);
        setTimeout(function(){
          forceServiceOnlyTotals();
          var notice = document.getElementById('rc-cash-notice');
          if (notice) notice.style.display = 'none';
        }, 0);
        setTimeout(forceServiceOnlyTotals, 300);
        return result;
      };
    }
  }

  function run(){
    patchFunctions();
    forceServiceOnlyTotals();
  }

  run();
  document.addEventListener('DOMContentLoaded', run);
  document.addEventListener('click', function(){ setTimeout(run, 80); }, true);
  setTimeout(run, 300);
  setTimeout(run, 1200);
  setTimeout(run, 2500);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
