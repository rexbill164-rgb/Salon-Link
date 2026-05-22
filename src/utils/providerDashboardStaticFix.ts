export function withProviderDashboardStaticFix(html: string): string {
  const script = `
<script id="provider-dashboard-static-rescue">
(function(){
  if (location.pathname !== '/provider/dashboard') return;
  function t(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function h(){ return { Authorization: 'Bearer ' + t() }; }
  function a(){ return window.axios || null; }
  function q(id){ return document.getElementById(id); }
  function toast(m,k){ if (window.showToast) window.showToast(m,k||'info'); else console.log(m); }
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100); }
  function asB64(file, cb){ var r=new FileReader(); r.onload=function(e){ cb(e.target.result); }; r.onerror=function(){ toast('Could not read image','error'); }; r.readAsDataURL(file); }

  window.openSidebar=function(){ var s=q('sidebar'), o=q('sb-overlay'); if(s)s.classList.add('open'); if(o)o.classList.add('open'); };
  window.closeSidebar=function(){ var s=q('sidebar'), o=q('sb-overlay'); if(s)s.classList.remove('open'); if(o)o.classList.remove('open'); };
  window.logout=function(){ localStorage.removeItem('sl_token'); localStorage.removeItem('sl_user'); localStorage.removeItem('token'); localStorage.removeItem('user'); location.href='/login'; };
  window.viewPublicProfile=function(){ if(window.providerIdGlobal) window.open('/provider/'+window.providerIdGlobal,'_blank'); else toast('Provider profile is still loading'); };

  window.showSection=function(id,btn){
    Array.prototype.slice.call(document.querySelectorAll('.section')).forEach(function(x){x.classList.remove('active');});
    Array.prototype.slice.call(document.querySelectorAll('.sidebar-item,.mob-nav-item')).forEach(function(x){x.classList.remove('active');});
    var sec=q('sec-'+id); if(sec)sec.classList.add('active');
    var nav=q('nav-'+id); if(nav)nav.classList.add('active');
    var mob=q('mob-'+id); if(mob)mob.classList.add('active');
    if(btn)btn.classList.add('active');
    var titles={overview:'Overview',appts:'Appointments',services:'My Services',gallery:'Gallery',location:'Location',reviews:'Reviews',earnings:'Earnings',kyc:'KYC Status',settings:'Settings'};
    var title=q('sec-title'); if(title)title.textContent=titles[id]||id;
    window.closeSidebar();
    if(id==='overview') loadDash();
    if(id==='services') loadServices();
    if(id==='appts') loadAppts();
    if(id==='gallery') loadGallerySafe();
    if(id==='location') setTimeout(function(){ window.initLocationMap(window.pickedLat,window.pickedLng); },100);
    if(id==='settings') loadSettings();
  };

  function loadDash(){ var x=a(); if(!x||!t())return; x.get('/api/providers/me/dashboard',{headers:h()}).then(function(r){
    var d=r.data||{}, p=d.provider||{}, s=d.stats||{}; window.providerIdGlobal=p.id||window.providerIdGlobal; window.pickedLat=p.location_lat; window.pickedLng=p.location_lng;
    var n=q('sb-name'); if(n)n.textContent=p.business_name||'My Salon';
    var b=q('sb-badge'); if(b){ b.className=p.is_verified?'badge badge-verified':'badge badge-pending'; b.textContent=p.is_verified?'✓ Verified':'⏳ Pending Approval'; }
    var pen=q('pending-banner'); if(pen&&!p.is_verified)pen.style.display='block';
    var tog=q('accepting-toggle'); if(tog)tog.checked=p.is_accepting_bookings===1||p.is_accepting_bookings===true;
    set('kpi-today',s.today_bookings||0); set('kpi-revenue',money(s.week_revenue||0)); set('kpi-clients',s.total_clients||0); set('kpi-rating',s.rating?Number(s.rating).toFixed(1):'—');
    renderToday(d.today_appointments||[]); loadServices();
  }).catch(function(e){ if(e&&e.response&&e.response.status===401) location.href='/login'; else toast('Dashboard could not load','error'); }); }
  function set(id,v){ var e=q(id); if(e)e.textContent=v; }
  function renderToday(rows){ var e=q('today-appts'); if(!e)return; if(!rows.length){e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No appointments today ✦</div>';return;} e.innerHTML=rows.map(function(r){return '<div class="appt-row"><div class="mini-avatar">'+String(r.first_name||'?').charAt(0)+'</div><div style="flex:1"><div style="font-size:13px;font-weight:700;">'+(r.first_name||'')+' '+(r.last_name||'')+'</div><div style="font-size:11px;color:var(--t-muted);">'+(r.service_name||'')+'</div></div><div style="text-align:right"><div style="font-size:12px;font-weight:700;color:var(--g-main);">'+(r.booking_time||'')+'</div><span class="badge badge-pending" style="font-size:9px;">'+(r.status||'pending')+'</span></div></div>';}).join(''); }
  function loadAppts(){ var x=a(), e=q('appts-list'); if(e)e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading appointments...</div>'; if(!x)return; x.get('/api/bookings/provider',{headers:h()}).then(function(r){ var rows=(r.data||{}).bookings||[]; if(!rows.length){e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No appointments found.</div>';return;} e.innerHTML=rows.map(function(b){return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;"><div class="mini-avatar">'+String(b.first_name||'?').charAt(0)+'</div><div style="flex:1;min-width:120px;"><div style="font-size:13px;font-weight:700;">'+(b.first_name||'')+' '+(b.last_name||'')+'</div><div style="font-size:11px;color:var(--t-muted);">'+(b.service_name||'')+' · '+(b.booking_date||'')+' '+(b.booking_time||'')+'</div></div><div style="font-weight:700;color:var(--g-main);">'+money(b.total_amount)+'</div><span class="badge badge-pending" style="font-size:9px;">'+(b.status||'pending')+'</span></div>';}).join('');}).catch(function(){ if(e)e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No appointments found.</div>'; }); }
  function loadServices(){ var x=a(), e=q('my-services-list'); if(!x||!e)return; x.get('/api/providers/me/services',{headers:h()}).then(function(r){ var rows=(r.data||{}).services||[]; window._sl_services=rows; if(!rows.length){e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No services yet. Add your first service above.</div>';return;} e.innerHTML=rows.map(function(s,i){return '<div style="border:1px solid #e5e7eb;border-radius:14px;margin-bottom:10px;overflow:hidden;background:#fff;"><div style="display:flex;align-items:center;gap:12px;padding:14px;"><div style="flex:1"><div style="font-size:14px;font-weight:700;color:#111;">'+(s.name||'Service')+'</div><div style="font-size:11px;color:#6b7280;margin-top:2px;">'+(s.duration_minutes||60)+' min'+(s.description?' · '+s.description:'')+'</div></div><div style="font-size:16px;font-weight:800;color:#1d4ed8;">'+money(s.price)+'</div></div><div style="display:flex;border-top:1px solid #e5e7eb;"><button onclick="window.openEditService&&window.openEditService(window._sl_services['+i+'])" style="flex:1;padding:10px;background:#2563eb;border:none;border-right:1px solid #1d4ed8;color:#000;font-size:11px;font-weight:600;cursor:pointer;font-size:11px;">Edit</button><button onclick="window.deleteSvcByIndex&&window.deleteSvcByIndex('+i+')" style="flex:1;padding:10px;background:#dc2626;border:none;color:#000;font-size:11px;font-weight:600;cursor:pointer;font-size:11px;">Delete</button></div></div>';}).join(''); }).catch(function(){e.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">Could not load services.</div>';}); }
  window.showAddSvcForm=function(){ var f=q('add-svc-form'); if(f)f.style.display=f.style.display==='block'?'none':'block'; };
  // ── Service edit / delete (defined here so they work when loadServices() renders buttons) ──
  window.deleteSvcByIndex = function(i) {
    var svcs = window._sl_services || [];
    var svc = svcs[i];
    if (!svc) return;
    if (!confirm('Delete "' + (svc.name || 'this service') + '"?\nThis cannot be undone.')) return;
    var x = a();
    if (!x) return;
    x.delete('/api/providers/me/services/' + svc.id, { headers: h() })
      .then(function() { toast('Service deleted', 'success'); loadServices(); })
      .catch(function(e) {
        var msg = e && e.response && e.response.data && e.response.data.error ? e.response.data.error : 'Delete failed';
        toast(msg, 'error');
      });
  };

  window.openEditService = function(svc) {
    if (!svc) return;
    window._editingSvcId = svc.id;
    var modal = document.getElementById('edit-svc-modal');
    if (!modal) { toast('Edit form not found — please refresh', 'error'); return; }
    var setVal = function(id, v) { var el = document.getElementById(id); if (el) el.value = v || ''; };
    setVal('edit-svc-name', svc.name);
    setVal('edit-svc-price', Math.round((svc.price || 0) / 100));
    setVal('edit-svc-duration', svc.duration_minutes || svc.duration || 60);
    setVal('edit-svc-desc', svc.description);
    modal.style.display = 'flex';
  };

  window.saveEditService = function() {
    var id = window._editingSvcId;
    if (!id) return;
    var x = a();
    if (!x) return;
    var getVal = function(elId) { var el = document.getElementById(elId); return el ? el.value : ''; };
    var name = getVal('edit-svc-name').trim();
    var price = parseFloat(getVal('edit-svc-price')) || 0;
    var duration = parseInt(getVal('edit-svc-duration')) || 60;
    var description = getVal('edit-svc-desc').trim();
    if (!name || !price) { toast('Name and price are required', 'error'); return; }
    x.put('/api/providers/me/services/' + id, { name: name, price: price * 100, duration: duration, description: description }, { headers: h() })
      .then(function() {
        toast('Service updated ✓', 'success');
        var modal = document.getElementById('edit-svc-modal');
        if (modal) modal.style.display = 'none';
        window._editingSvcId = null;
        loadServices();
      })
      .catch(function(e) {
        var msg = e && e.response && e.response.data && e.response.data.error ? e.response.data.error : 'Update failed';
        toast(msg, 'error');
      });
  };

  window.closeEditService = function() {
    var modal = document.getElementById('edit-svc-modal');
    if (modal) modal.style.display = 'none';
    window._editingSvcId = null;
  };

  window.saveNewService=function(){ var x=a(); if(!x)return; var name=(q('new-svc-name')||{}).value||'', price=Number((q('new-svc-price')||{}).value||0), dur=Number((q('new-svc-duration')||{}).value||60), desc=(q('new-svc-desc')||{}).value||''; if(!name.trim()){toast('Please enter a service name','error');return;} if(!price){toast('Please enter a price','error');return;} x.post('/api/providers/me/services',{name:name.trim(),price:Math.round(price*100),duration:dur,description:desc.trim()},{headers:h()}).then(function(){toast('Service added','success');loadServices();}).catch(function(){toast('Could not add service','error');}); };

  window.triggerGalleryUpload=function(){ var i=q('gallery-file-input'); if(i)i.click(); }; window.triggerLogoUpload=function(){ var i=q('logo-file-input'); if(i)i.click(); }; window.triggerCoverUpload=function(){ var i=q('cover-file-input'); if(i)i.click(); };
  window.uploadGalleryImage=function(input){ uploadInput(input,'/api/uploads/provider-gallery','Photo uploaded',function(){loadGallerySafe();}); };
  window.uploadLogoImage=function(input){ uploadInput(input,'/api/uploads/provider-logo','Logo uploaded',function(data,b64){ var p=q('logo-preview'); if(p)p.innerHTML='<img src="'+(data.url||b64)+'" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>'; }); };
  window.uploadCoverImage=function(input){ uploadInput(input,'/api/uploads/provider-cover','Cover uploaded',function(data,b64){ var p=q('cover-preview'); if(p){p.style.backgroundImage='url('+b64+')';p.style.backgroundSize='cover';p.style.backgroundPosition='center';p.innerHTML='';} }); };
  function uploadInput(input,url,msg,done){ if(!input||!input.files||!input.files[0])return; var file=input.files[0]; if(file.size>10*1024*1024){toast('Image too large. Maximum is 10MB.','error');input.value='';return;} toast('Uploading...','info'); asB64(file,function(b64){ var body=url.indexOf('gallery')>-1?{image_url:b64,caption:''}:{image_url:b64}; a().post(url,body,{headers:h()}).then(function(r){toast(msg,'success');input.value=''; if(done)done(r.data||{},b64);}).catch(function(e){var d=e&&e.response&&e.response.data?e.response.data:{}; toast(d.error||'Upload failed','error');}); }); }
  function loadGallerySafe(){ var x=a(), pid=window.providerIdGlobal, grid=q('gallery-grid'); if(!x||!pid||!grid)return; x.get('/api/uploads/provider-gallery/'+pid,{headers:h()}).then(function(r){ var data=r.data||{}, photos=(data.photos||data.gallery||[]).filter(function(p){return !p.is_logo;}); var lab=q('gallery-count-label'); if(lab)lab.textContent=(data.is_pro?'Pro':'Free')+' plan: '+photos.length+'/'+(data.is_pro?10:5)+' images'; var html=photos.map(function(p){return '<div style="border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;background:#fff;"><div style="aspect-ratio:1;overflow:hidden;"><img src="'+p.image_url+'" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy"/></div><div style="display:flex;justify-content:center;padding:6px;background:#f9fafb;border-top:1px solid #e5e7eb;"><button onclick="window.deleteGalleryImage&&window.deleteGalleryImage('+p.id+')" style="display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:7px;border:none;background:#dc2626;color:#000;font-size:11px;font-weight:700;cursor:pointer;">Delete</button></div></div>';}).join(''); grid.innerHTML=html+'<div onclick="triggerGalleryUpload()" class="gallery-add-btn" style="min-height:80px;"><div style="font-size:24px;">➕</div><div style="font-size:10px;color:var(--t-muted);margin-top:4px;">Add Photo</div></div>';}).catch(function(){grid.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;">Could not load gallery.</div>';}); }
  window.loadGallery=window.loadGallery||loadGallerySafe;

  function ensureMap(cb){ if(window.L){cb(window.L);return;} if(!document.querySelector('link[href*="leaflet.css"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(l);} var s=document.getElementById('pdash-leaflet-js')||document.createElement('script'); if(!s.id){s.id='pdash-leaflet-js';s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';document.head.appendChild(s);} s.onload=function(){if(window.L)cb(window.L);}; }
  window.initLocationMap=function(lat,lng){ var box=q('location-picker-map'); if(!box)return; ensureMap(function(L){ if(window.locationMap&&window.locationMap.remove)try{window.locationMap.remove();}catch(e){} var la=Number(lat||window.pickedLat||5.6037), ln=Number(lng||window.pickedLng||-0.1870); window.pickedLat=la; window.pickedLng=ln; window.locationMap=L.map('location-picker-map').setView([la,ln],lat&&lng?16:12); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM',maxZoom:19}).addTo(window.locationMap); function mark(p){window.pickedLat=p.lat;window.pickedLng=p.lng;if(window.locationMarker)window.locationMarker.setLatLng(p);else window.locationMarker=L.marker(p,{draggable:true}).addTo(window.locationMap); window.locationMarker.off('dragend').on('dragend',function(e){mark(e.target.getLatLng());}); var c=q('location-coords'); if(c)c.innerHTML='📍 <strong>Lat:</strong> '+window.pickedLat.toFixed(5)+', <strong>Lng:</strong> '+window.pickedLng.toFixed(5); var sv=q('save-location-btn'); if(sv)sv.disabled=false;} mark({lat:la,lng:ln}); window.locationMap.on('click',function(e){mark(e.latlng);}); setTimeout(function(){window.locationMap.invalidateSize();},250); }); };
  window.useMyLocation=function(){ if(!navigator.geolocation){toast('Location not supported','error');return;} navigator.geolocation.getCurrentPosition(function(p){window.pickedLat=p.coords.latitude;window.pickedLng=p.coords.longitude;window.initLocationMap(window.pickedLat,window.pickedLng);toast('Location found. Tap Save Location.','success');},function(){toast('Could not get location. Allow location access.','error');},{enableHighAccuracy:true,timeout:12000,maximumAge:60000}); };
  window.saveLocation=function(){ if(!window.pickedLat||!window.pickedLng){toast('Pick a location first','error');return;} a().put('/api/providers/me',{location_lat:window.pickedLat,location_lng:window.pickedLng},{headers:h()}).then(function(){toast('Location saved','success');}).catch(function(){toast('Could not save location','error');}); };
  function loadSettings(){ var x=a(); if(!x)return; x.get('/api/providers/me/dashboard',{headers:h()}).then(function(r){var p=(r.data||{}).provider||{}; function v(id,val){var e=q(id); if(e)e.value=val||'';} v('set-business-name',p.business_name);v('set-phone',p.phone);v('set-city',p.city);v('set-address',p.address);v('set-bio',p.bio);v('set-price-min',p.price_from?Math.round(p.price_from/100):'');v('set-price-max',p.price_to?Math.round(p.price_to/100):'');}); }
  window.saveProfile=function(){ var x=a(); if(!x)return; function val(id){var e=q(id);return e?e.value.trim():'';} var body={business_name:val('set-business-name')||undefined,phone:val('set-phone')||undefined,city:val('set-city')||undefined,address:val('set-address')||undefined,bio:val('set-bio')||undefined,price_from:val('set-price-min')?Number(val('set-price-min'))*100:undefined,price_to:val('set-price-max')?Number(val('set-price-max'))*100:undefined}; x.put('/api/providers/me',body,{headers:h()}).then(function(){toast('Profile saved','success');}).catch(function(){toast('Could not save profile','error');}); };

  document.addEventListener('DOMContentLoaded',function(){ if(!t()){location.href='/login';return;} setTimeout(function(){ var g=q('gallery-file-input'); if(g)g.onchange=function(){window.uploadGalleryImage(g);}; var l=q('logo-file-input'); if(l)l.onchange=function(){window.uploadLogoImage(l);}; var c=q('cover-file-input'); if(c)c.onchange=function(){window.uploadCoverImage(c);}; loadDash(); },300); });
})();
</script>`
  if (html.includes('provider-dashboard-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}
