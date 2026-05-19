export function withBookingServicePriceBindingFix(html: string): string {
  if (html.includes('booking-service-price-binding-fix-script')) return html

  const patch = `
<script id="booking-service-price-binding-fix-script">
(function(){
  if(location.pathname.indexOf('/book/') !== 0) return;

  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function ghs(pricePs){ return Math.round((Number(pricePs)||0)/100); }
  function money(pricePs){ return 'GHS ' + ghs(pricePs); }
  function norm(value){ return String(value||'').trim().toLowerCase(); }
  function toast(message,type){ if(window.showToast) window.showToast(message,type||'info'); }
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
    window.selectedService = {
      id: Number(service.id),
      name: service.name || 'Service',
      pricePs: pricePs,
      priceGhs: priceGhs,
      dur: durationText(service.duration_minutes || service.duration || 60)
    };
    setText('sum-service', window.selectedService.name);
    setText('sum-service-price', money(pricePs));
    setText('sum-price', money(pricePs));
    setText('sum-dur', window.selectedService.dur);
    setText('recap-service', window.selectedService.name);
    setText('recap-total', money(pricePs));
    setText('pm-total', money(pricePs));
    setText('rc-total', money(pricePs));
  }
  function updateRow(row, service){
    if(!row || !service) return;
    var pricePs = parsePrice(service);
    row.setAttribute('data-price', String(pricePs));
    row.setAttribute('data-id', String(service.id || row.getAttribute('data-id') || ''));
    row.setAttribute('data-name', service.name || row.getAttribute('data-name') || 'Service');
    row.setAttribute('data-duration', String(service.duration_minutes || service.duration || row.getAttribute('data-duration') || 60));
    var priceNodes = Array.prototype.slice.call(row.querySelectorAll('.gold-gradient, .font-display, span, div')).filter(function(el){
      return /^(GHS\s*)?\d+$/.test((el.textContent||'').trim()) || (el.textContent||'').indexOf('GHS') >= 0;
    });
    if(priceNodes.length){ priceNodes[priceNodes.length - 1].textContent = money(pricePs); }
    if(pricePs <= 0){ row.classList.add('sl-price-missing'); } else { row.classList.remove('sl-price-missing'); row.removeAttribute('aria-disabled'); }
  }
  function bindPrices(services){
    services = Array.isArray(services) ? services : [];
    if(!services.length) return;
    var byId = {}, byName = {};
    services.forEach(function(s){ byId[String(s.id)] = s; byName[norm(s.name)] = s; });
    var rows = Array.prototype.slice.call(document.querySelectorAll('.service-select-item'));
    rows.forEach(function(row){
      var service = byId[String(row.getAttribute('data-id')||'')] || byName[norm(row.getAttribute('data-name') || row.querySelector('span') && row.querySelector('span').textContent)];
      updateRow(row, service);
    });
    var selected = document.querySelector('.service-select-item.selected') || rows[0];
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
      window.proceedToStep4 = function(){
        refetchAndBind();
        return oldProceedToStep4.apply(this, arguments);
      };
    }
  }
  function run(){ patchSelect(); refetchAndBind(); }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(run, 200); setTimeout(run, 900); });
  document.addEventListener('click', function(){ setTimeout(run, 120); }, true);
  setTimeout(run, 1500);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
