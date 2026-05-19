export function withBookingServicePriceBindingFix(html: string): string {
  if (html.includes('booking-service-price-binding-fix-script')) return html

  const patch = `
<style id="booking-service-price-binding-fix-style">
  .sl-bound-service-price{margin-left:auto!important;font-size:20px!important;font-weight:500!important;color:#101010!important;white-space:nowrap!important;display:inline-flex!important;align-items:center!important;justify-content:flex-end!important;min-width:78px!important}.sl-price-missing{opacity:.55!important;cursor:not-allowed!important;border-style:dashed!important}.sl-price-missing .sl-bound-service-price{color:#b42318!important;font-size:12px!important;font-weight:800!important}
</style>
<script id="booking-service-price-binding-fix-script">
(function(){
  if(location.pathname.indexOf('/book/') !== 0) return;

  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function ghs(pricePs){ return Math.round((Number(pricePs)||0)/100); }
  function money(pricePs){ return 'GHS ' + ghs(pricePs); }
  function norm(value){ return String(value||'').trim().toLowerCase(); }
  function parsePrice(service){
    var raw = service && (service.price !== undefined ? service.price : service.price_ps !== undefined ? service.price_ps : service.amount !== undefined ? service.amount : 0);
    var value = Number(raw || 0);
    return isFinite(value) ? value : 0;
  }
  function durationText(minutes){
    var dur = Number(minutes || 60);
    return dur >= 60 ? (Math.floor(dur/60)) + ' hr' + (dur >= 120 ? 's' : '') + (dur % 60 > 0 ? ' ' + (dur % 60) + 'm' : '') : dur + ' min';
  }
  function setText(id,value){ var el=document.getElementById(id); if(el) el.textContent=value; }
  function setSelectedSummary(service){
    if(!service) return;
    var pricePs = parsePrice(service);
    var priceGhs = ghs(pricePs);
    window.selectedService = { id:Number(service.id), name:service.name || 'Service', pricePs:pricePs, priceGhs:priceGhs, dur:durationText(service.duration_minutes || service.duration || 60) };
    setText('sum-service', window.selectedService.name);
    setText('sum-service-price', money(pricePs));
    setText('sum-price', money(pricePs));
    setText('sum-dur', window.selectedService.dur);
    setText('recap-service', window.selectedService.name);
    setText('recap-total', money(pricePs));
    setText('pm-total', money(pricePs));
    setText('rc-total', money(pricePs));
  }
  function ensurePriceElement(row){
    var priceEl = row.querySelector('.sl-bound-service-price');
    if(priceEl) return priceEl;
    var last = row.lastElementChild;
    if(last && (last.textContent||'').match(/GHS|^\s*\d+\s*$/)) {
      priceEl = last;
    } else {
      priceEl = document.createElement('span');
      row.appendChild(priceEl);
    }
    priceEl.classList.add('sl-bound-service-price');
    return priceEl;
  }
  function updateRow(row, service){
    if(!row || !service) return;
    var pricePs = parsePrice(service);
    row.setAttribute('data-price', String(pricePs));
    row.setAttribute('data-id', String(service.id || row.getAttribute('data-id') || ''));
    row.setAttribute('data-name', service.name || row.getAttribute('data-name') || 'Service');
    row.setAttribute('data-duration', String(service.duration_minutes || service.duration || row.getAttribute('data-duration') || 60));
    var priceEl = ensurePriceElement(row);
    priceEl.textContent = pricePs > 0 ? money(pricePs) : 'Price not set';
    if(pricePs <= 0){ row.classList.add('sl-price-missing'); row.setAttribute('aria-disabled','true'); }
    else { row.classList.remove('sl-price-missing'); row.removeAttribute('aria-disabled'); }
  }
  function bindPrices(services){
    services = Array.isArray(services) ? services : [];
    if(!services.length) return;
    var byId = {}, byName = {};
    services.forEach(function(s){ byId[String(s.id)] = s; byName[norm(s.name)] = s; });
    var rows = Array.prototype.slice.call(document.querySelectorAll('.service-select-item'));
    rows.forEach(function(row){
      var label = row.getAttribute('data-name') || (row.querySelector('span') && row.querySelector('span').textContent) || '';
      var service = byId[String(row.getAttribute('data-id')||'')] || byName[norm(label)];
      updateRow(row, service);
    });
    var selected = document.querySelector('.service-select-item.selected') || rows.find(function(row){ return Number(row.getAttribute('data-price')||0) > 0; });
    if(selected){
      var svc = byId[String(selected.getAttribute('data-id')||'')] || byName[norm(selected.getAttribute('data-name'))];
      if(svc && parsePrice(svc) > 0) setSelectedSummary(svc);
    }
  }
  function refetchAndBind(){
    var id = providerId();
    if(!id) return;
    fetch('/api/providers/' + encodeURIComponent(id) + '?ts=' + Date.now(), {cache:'no-store'})
      .then(function(res){ return res.json(); })
      .then(function(data){ bindPrices((data && data.services) || []); })
      .catch(function(err){ console.error('service price binding error', err); });
  }
  function patchSelect(){
    if(window.__bookingServicePriceBindingPatched) return;
    window.__bookingServicePriceBindingPatched = true;
    var oldSelect = window.selectSvc;
    if(typeof oldSelect === 'function'){
      window.selectSvc = function(row){
        var result = oldSelect.apply(this, arguments);
        setTimeout(refetchAndBind, 0);
        setTimeout(refetchAndBind, 250);
        return result;
      };
    }
    var oldProceedToStep4 = window.proceedToStep4;
    if(typeof oldProceedToStep4 === 'function'){
      window.proceedToStep4 = function(){ refetchAndBind(); return oldProceedToStep4.apply(this, arguments); };
    }
  }
  function run(){ patchSelect(); refetchAndBind(); }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 120); setTimeout(run, 700); setTimeout(run, 1500); });
  document.addEventListener('click', function(){ setTimeout(run, 120); setTimeout(run, 500); }, true);
  setInterval(run, 4000);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
