export function withBookingZeroPriceGuard(html: string): string {
  if (html.includes('booking-zero-price-guard-script')) return html

  const patch = `
<style id="booking-zero-price-guard-style">
  .sl-price-missing{opacity:.55!important;cursor:not-allowed!important;border-style:dashed!important}.sl-price-missing::after{content:'Price not set';font-size:11px;font-weight:800;color:#b42318;margin-left:auto}.sl-price-warning{background:#fff5f5;border:1px solid #f2caca;color:#9b1c1c;border-radius:14px;padding:12px 14px;font-size:12px;line-height:1.5;margin:0 0 14px}
</style>
<script id="booking-zero-price-guard-script">
(function(){
  if(location.pathname.indexOf('/book/') !== 0) return;
  function toast(m,t){if(window.showToast) window.showToast(m,t||'error')}
  function priceFromRow(row){
    var value = row && row.getAttribute ? Number(row.getAttribute('data-price')||0) : 0;
    return isFinite(value) ? value : 0;
  }
  function markZeroRows(){
    var list = Array.prototype.slice.call(document.querySelectorAll('.service-select-item'));
    list.forEach(function(row){
      var price = priceFromRow(row);
      if(price > 0) return;
      row.classList.add('sl-price-missing');
      row.classList.remove('selected');
      row.setAttribute('aria-disabled','true');
      row.onclick = function(event){
        event.preventDefault();
        event.stopPropagation();
        toast('This service has no price yet. Please choose another service or ask the provider to update it.','error');
        return false;
      };
    });
    var selected = document.querySelector('.service-select-item.selected');
    if(selected && priceFromRow(selected) <= 0) selected.classList.remove('selected');
    if(window.selectedService && Number(window.selectedService.pricePs||0) <= 0){
      window.selectedService = null;
      ['sum-service','sum-service-price','sum-price','sum-dur','recap-service','recap-total'].forEach(function(id){var el=document.getElementById(id); if(el) el.textContent='—';});
    }
    var firstValid = list.find(function(row){return priceFromRow(row) > 0 && !row.classList.contains('selected')});
    if(!document.querySelector('.service-select-item.selected') && firstValid && typeof window.selectSvc === 'function'){
      try{ window.selectSvc(firstValid); }catch(e){}
    }
  }
  function validateSelection(){
    if(!window.selectedService || Number(window.selectedService.pricePs||0) <= 0){
      toast('Please select a service with a valid price before continuing.','error');
      return false;
    }
    return true;
  }
  function patchFunctions(){
    if(window.__bookingZeroPriceGuardPatched) return;
    window.__bookingZeroPriceGuardPatched = true;
    var oldSelect = window.selectSvc;
    if(typeof oldSelect === 'function'){
      window.selectSvc = function(row){
        if(priceFromRow(row) <= 0){toast('This service has no price yet. Please choose another service.','error');return;}
        return oldSelect.apply(this, arguments);
      };
    }
    var oldGoStep = window.goStep;
    if(typeof oldGoStep === 'function'){
      window.goStep = function(n){
        if(Number(n) > 1 && !validateSelection()) return;
        return oldGoStep.apply(this, arguments);
      };
    }
    var oldProceed3 = window.proceedToStep3;
    if(typeof oldProceed3 === 'function'){
      window.proceedToStep3 = function(){ if(!validateSelection()) return; return oldProceed3.apply(this, arguments); };
    }
    var oldProceed4 = window.proceedToStep4;
    if(typeof oldProceed4 === 'function'){
      window.proceedToStep4 = function(){ if(!validateSelection()) return; return oldProceed4.apply(this, arguments); };
    }
    var oldConfirm = window.confirmBooking;
    if(typeof oldConfirm === 'function'){
      window.confirmBooking = function(){ if(!validateSelection()) return; return oldConfirm.apply(this, arguments); };
    }
  }
  function run(){patchFunctions();markZeroRows();}
  document.addEventListener('DOMContentLoaded', run);
  document.addEventListener('click', function(){setTimeout(run,80)}, true);
  setTimeout(run,500);setTimeout(run,1300);setInterval(run,3000);
})();
</script>`
  return html.replace('</body>', patch + '</body>')
}
