export function withBookingStablePriceFix(html: string): string {
  if (html.includes('booking-stable-price-fix-script')) return html

  const patch = `
<style id="booking-stable-price-fix-style">
  .service-select-item .sl-booking-price{margin-left:auto!important;font-size:20px!important;font-weight:500!important;color:#101010!important;white-space:nowrap!important;min-width:82px!important;text-align:right!important}.service-select-item .sl-old-price{display:none!important}.sl-price-unavailable{opacity:.55!important;border-style:dashed!important}.sl-price-unavailable .sl-booking-price{font-size:12px!important;color:#b42318!important;font-weight:800!important}
</style>
<script id="booking-stable-price-fix-script">
(function(){
  if(location.pathname.indexOf('/book/') !== 0) return;

  var serviceById = {};
  var servicesLoaded = false;

  function pid(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function ps(v){ var n = Number(v || 0); return isFinite(n) ? n : 0; }
  function ghs(p){ return Math.round(ps(p) / 100); }
  function moneyPs(p){ return 'GHS ' + ghs(p); }
  function durText(mins){ var d = Number(mins || 60); return d >= 60 ? (Math.floor(d/60)) + ' hr' + (d>=120?'s':'') + (d%60?(' '+(d%60)+'m'):'') : d + ' min'; }
  function txt(id,v){ var e=document.getElementById(id); if(e) e.textContent = v; }
  function toast(m,t){ if(window.showToast) window.showToast(m,t || 'info'); }

  function serviceFromRow(row){
    var id = row && row.getAttribute('data-id');
    if(id && serviceById[String(id)]) return serviceById[String(id)];
    var rowName = String(row && row.getAttribute('data-name') || '').trim().toLowerCase();
    var match = Object.keys(serviceById).map(function(k){return serviceById[k]}).find(function(s){return String(s.name||'').trim().toLowerCase() === rowName;});
    return match || null;
  }

  function setSelected(s){
    if(!s) return false;
    var pricePs = ps(s.price);
    if(pricePs <= 0){ toast('This service has no price yet. Please choose another service.','error'); return false; }
    var duration = Number(s.duration_minutes || s.duration || 60);
    window.selectedService = { id:Number(s.id), name:s.name || 'Service', pricePs:pricePs, priceGhs:ghs(pricePs), dur:durText(duration), duration:duration };
    txt('sum-service', window.selectedService.name);
    txt('sum-service-price', moneyPs(pricePs));
    txt('sum-price', moneyPs(pricePs));
    txt('sum-dur', window.selectedService.dur);
    txt('recap-service', window.selectedService.name);
    txt('recap-total', moneyPs(pricePs));
    txt('pm-service', window.selectedService.name);
    txt('pm-total', moneyPs(pricePs));
    txt('rc-service', window.selectedService.name);
    txt('rc-total', moneyPs(pricePs));
    return true;
  }

  function cleanFeeDisplay(){
    Array.prototype.slice.call(document.querySelectorAll('div,span,p,strong')).forEach(function(el){
      var t = (el.textContent || '').trim().toLowerCase();
      if(t === 'platform fee' || t === 'ghs 3' || t === 'ghs 2' || t.indexOf('provider will send') >= 0 || t.indexOf('platform fee') >= 0){
        var row = el.closest && el.closest('div[style*="justify-content:space-between"], #rc-cash-notice, #fee-reminder-modal');
        if(row) row.style.display = 'none'; else el.style.display = 'none';
      }
    });
    var cash = document.getElementById('cash-booking-notice');
    if(cash) cash.innerHTML = '<div style="font-size:13px;font-weight:700;color:var(--g-main);margin-bottom:6px;">Pay On-Site Details</div><div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">Your booking will be confirmed immediately. Pay the service amount directly to the provider when you arrive.</div>';
  }

  function renderRowPrices(){
    Array.prototype.slice.call(document.querySelectorAll('.service-select-item')).forEach(function(row){
      var s = serviceFromRow(row);
      if(!s) return;
      var pricePs = ps(s.price);
      row.setAttribute('data-id', String(s.id));
      row.setAttribute('data-price', String(pricePs));
      row.setAttribute('data-name', s.name || 'Service');
      row.setAttribute('data-duration', String(s.duration_minutes || s.duration || 60));
      Array.prototype.slice.call(row.children).forEach(function(child){
        if(child.classList && child.classList.contains('sl-booking-price')) return;
        var t = (child.textContent || '').trim();
        if(t === '0' || /^GHS\s*\d+$/i.test(t) || /^\d+$/.test(t)) child.classList.add('sl-old-price');
      });
      var priceEl = row.querySelector('.sl-booking-price');
      if(!priceEl){ priceEl = document.createElement('span'); priceEl.className = 'sl-booking-price'; row.appendChild(priceEl); }
      if(pricePs > 0){ row.classList.remove('sl-price-unavailable'); priceEl.textContent = moneyPs(pricePs); }
      else { row.classList.add('sl-price-unavailable'); priceEl.textContent = 'Price not set'; }
    });
  }

  function loadServices(){
    return fetch('/api/providers/' + encodeURIComponent(pid()) + '?ts=' + Date.now(), { cache:'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(data){
        serviceById = {};
        ((data && data.services) || []).forEach(function(s){ serviceById[String(s.id)] = s; });
        servicesLoaded = true;
        renderRowPrices();
        var selected = document.querySelector('.service-select-item.selected');
        if(selected) setSelected(serviceFromRow(selected));
      })
      .catch(function(e){ console.error('stable booking price load error', e); });
  }

  function validSelection(){
    if(window.selectedService && Number(window.selectedService.pricePs || 0) > 0) return true;
    var selected = document.querySelector('.service-select-item.selected');
    var s = serviceFromRow(selected);
    if(s && setSelected(s)) return true;
    toast('Please choose a service with a valid price.','error');
    return false;
  }

  function patch(){
    if(window.__stableBookingPricePatched) return;
    window.__stableBookingPricePatched = true;
    var oldSelect = window.selectSvc;
    if(typeof oldSelect === 'function'){
      window.selectSvc = function(row){
        var s = serviceFromRow(row);
        if(s && ps(s.price) <= 0){ toast('This service has no price yet. Please choose another service.','error'); return; }
        var result = oldSelect.apply(this, arguments);
        if(s) setSelected(s); else setTimeout(loadServices, 50);
        cleanFeeDisplay();
        return result;
      };
    }
    var oldGoStep = window.goStep;
    if(typeof oldGoStep === 'function'){
      window.goStep = function(n){ if(Number(n) > 1 && !validSelection()) return; return oldGoStep.apply(this, arguments); };
    }
    var oldProceed3 = window.proceedToStep3;
    if(typeof oldProceed3 === 'function') window.proceedToStep3 = function(){ if(!validSelection()) return; return oldProceed3.apply(this, arguments); };
    var oldProceed4 = window.proceedToStep4;
    if(typeof oldProceed4 === 'function') window.proceedToStep4 = function(){ if(!validSelection()) return; var result = oldProceed4.apply(this, arguments); setTimeout(function(){setSelected(window.selectedService);cleanFeeDisplay();},30); return result; };
    var oldConfirm = window.confirmBooking;
    if(typeof oldConfirm === 'function') window.confirmBooking = function(){ if(!validSelection()) return; return oldConfirm.apply(this, arguments); };
    var oldReceipt = window.showReceipt;
    if(typeof oldReceipt === 'function') window.showReceipt = function(){ var result = oldReceipt.apply(this, arguments); setTimeout(function(){setSelected(window.selectedService);cleanFeeDisplay();},30); return result; };
  }

  function run(){ patch(); loadServices().then(cleanFeeDisplay); }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 150); setTimeout(run, 900); });
  document.addEventListener('click', function(){ setTimeout(run, 120); }, true);
  setTimeout(run, 1800);
})();
</script>`;

  return html.replace('</body>', patch + '</body>')
}
