export function withProviderDashboardActionFix(html: string): string {
  const script = `
<script id="provider-dashboard-action-fix">
(function(){
  if (location.pathname !== '/provider/dashboard') return;

  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function ax(){ return window.axios || null; }
  function toast(message, type){ if (typeof window.showToast === 'function') window.showToast(message, type || 'info'); else console.log('[SalonLink]', message); }
  function el(id){ return document.getElementById(id); }
  function providerId(){ return window.providerIdGlobal || null; }

  function fileToBase64(file, cb){
    var reader = new FileReader();
    reader.onload = function(event){ cb(event.target.result); };
    reader.onerror = function(){ toast('Could not read image file', 'error'); };
    reader.readAsDataURL(file);
  }

  function upload(endpoint, payload, successMessage, done){
    var http = ax();
    if (!http) { toast('Network library not ready. Refresh and try again.', 'error'); return; }
    http.post(endpoint, payload, { headers: headers() })
      .then(function(res){ toast(successMessage, 'success'); if (done) done(res.data || {}); })
      .catch(function(error){
        var data = error && error.response && error.response.data ? error.response.data : {};
        toast(data.error || data.message || 'Upload failed', 'error');
      });
  }

  window.triggerGalleryUpload = function(){ var input = el('gallery-file-input'); if (input) input.click(); };
  window.triggerLogoUpload = function(){ var input = el('logo-file-input'); if (input) input.click(); };
  window.triggerCoverUpload = function(){ var input = el('cover-file-input'); if (input) input.click(); };

  window.uploadGalleryImage = function(input){
    if (!input || !input.files || !input.files[0]) return;
    var file = input.files[0];
    if (file.size > 10 * 1024 * 1024) { toast('Image too large. Maximum is 10MB.', 'error'); input.value = ''; return; }
    toast('Uploading photo...', 'info');
    fileToBase64(file, function(base64){
      upload('/api/uploads/provider-gallery', { image_url: base64, caption: '' }, 'Photo uploaded', function(){
        input.value = '';
        if (typeof window.loadGallery === 'function') window.loadGallery(token());
        else fallbackLoadGallery();
      });
    });
  };

  window.uploadLogoImage = function(input){
    if (!input || !input.files || !input.files[0]) return;
    var file = input.files[0];
    if (file.size > 10 * 1024 * 1024) { toast('Logo too large. Maximum is 10MB.', 'error'); input.value = ''; return; }
    toast('Uploading logo...', 'info');
    fileToBase64(file, function(base64){
      upload('/api/uploads/provider-logo', { image_url: base64 }, 'Logo uploaded', function(data){
        input.value = '';
        var preview = el('logo-preview');
        var imageUrl = data.url || base64;
        if (preview) preview.innerHTML = '<img src="' + imageUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>';
        var avatar = el('sb-avatar');
        if (avatar) avatar.innerHTML = '<img src="' + imageUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>';
      });
    });
  };

  window.uploadCoverImage = function(input){
    if (!input || !input.files || !input.files[0]) return;
    var file = input.files[0];
    if (file.size > 10 * 1024 * 1024) { toast('Cover image too large. Maximum is 10MB.', 'error'); input.value = ''; return; }
    toast('Uploading cover...', 'info');
    fileToBase64(file, function(base64){
      upload('/api/uploads/provider-cover', { image_url: base64 }, 'Cover photo uploaded', function(){
        input.value = '';
        var preview = el('cover-preview');
        if (preview) {
          preview.style.backgroundImage = 'url(' + base64 + ')';
          preview.style.backgroundSize = 'cover';
          preview.style.backgroundPosition = 'center';
          preview.innerHTML = '<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.5);color:white;font-size:9px;padding:4px 8px;border-radius:100px;font-weight:600;">Change Cover</div>';
        }
        fallbackLoadGallery();
      });
    });
  };

  function fallbackLoadGallery(){
    var http = ax();
    var pid = providerId();
    var grid = el('gallery-grid');
    if (!http || !pid || !grid) return;
    http.get('/api/uploads/provider-gallery/' + encodeURIComponent(pid), { headers: headers() })
      .then(function(res){
        var data = res.data || {};
        var allPhotos = data.photos || data.gallery || [];
        var photos = allPhotos.filter(function(photo){ return !photo.is_logo; });
        var max = data.is_pro ? 10 : 5;
        var label = el('gallery-count-label');
        if (label) label.textContent = (data.is_pro ? 'Pro' : 'Free') + ' plan: ' + photos.length + '/' + max + ' images';
        if (!photos.length) {
          grid.innerHTML = '<div onclick="triggerGalleryUpload()" class="gallery-add-btn" style="grid-column:1/-1;min-height:120px;"><div style="font-size:24px;">➕</div><div style="font-size:10px;color:var(--t-muted);margin-top:4px;">Add Photo</div></div>';
          return;
        }
        grid.innerHTML = photos.map(function(photo){
          return '<div style="position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--c-surface);">' +
            '<img src="' + photo.image_url + '" style="width:100%;height:100%;object-fit:cover;"/>' +
            '<button type="button" data-gallery-id="' + photo.id + '" class="pdash-delete-gallery sl-gallery-delete-btn" style="position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:rgba(220,38,38,0.9);border:2px solid rgba(255,255,255,0.85);color:#fff;cursor:pointer;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;">\\u2715</button>' +
          '</div>';
        }).join('') + '<div onclick="triggerGalleryUpload()" class="gallery-add-btn"><div style="font-size:24px;">➕</div><div style="font-size:10px;color:var(--t-muted);margin-top:4px;">Add Photo</div></div>';
      })
      .catch(function(){ if (grid) grid.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;">Could not load gallery.</div>'; });
  }
  window.loadGallery = window.loadGallery || function(){ fallbackLoadGallery(); };

  window.deleteGalleryImage = window.deleteGalleryImage || function(id){
    if (!confirm('Delete this photo?')) return;
    var http = ax(); if (!http) return;
    http.delete('/api/uploads/provider-gallery/' + encodeURIComponent(id), { headers: headers() })
      .then(function(){ toast('Photo deleted', 'info'); fallbackLoadGallery(); })
      .catch(function(){ toast('Delete failed', 'error'); });
  };

  function ensureLeaflet(cb){
    if (window.L) { cb(window.L); return; }
    var existing = document.getElementById('pdash-leaflet-js');
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    }
    if (existing) { existing.addEventListener('load', function(){ if (window.L) cb(window.L); }); return; }
    var script = document.createElement('script');
    script.id = 'pdash-leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = function(){ if (window.L) cb(window.L); else toast('Map library could not load', 'error'); };
    script.onerror = function(){ toast('Map library could not load', 'error'); };
    document.head.appendChild(script);
  }

  window.initLocationMap = function(lat, lng){
    var mapEl = el('location-picker-map');
    if (!mapEl) return;
    ensureLeaflet(function(L){
      if (window.locationMap && typeof window.locationMap.remove === 'function') {
        try { window.locationMap.remove(); } catch(e) {}
      }
      var startLat = Number(lat || window.pickedLat || 5.6037);
      var startLng = Number(lng || window.pickedLng || -0.1870);
      window.pickedLat = isFinite(startLat) ? startLat : 5.6037;
      window.pickedLng = isFinite(startLng) ? startLng : -0.1870;
      window.locationMap = L.map('location-picker-map').setView([window.pickedLat, window.pickedLng], lat && lng ? 16 : 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OSM', maxZoom:19 }).addTo(window.locationMap);
      var markerIcon = L.divIcon({ html:'<div style="background:#111;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>', iconSize:[28,28], iconAnchor:[14,28], className:'' });
      function setPicked(position){
        window.pickedLat = position.lat;
        window.pickedLng = position.lng;
        if (window.locationMarker) window.locationMarker.setLatLng(position);
        else window.locationMarker = L.marker(position, { icon: markerIcon, draggable:true }).addTo(window.locationMap);
        window.locationMarker.off('dragend').on('dragend', function(event){ setPicked(event.target.getLatLng()); });
        var coords = el('location-coords');
        if (coords) coords.innerHTML = '📍 <strong>Lat:</strong> ' + window.pickedLat.toFixed(5) + ', <strong>Lng:</strong> ' + window.pickedLng.toFixed(5);
        var saveBtn = el('save-location-btn'); if (saveBtn) saveBtn.disabled = false;
      }
      setPicked({ lat: window.pickedLat, lng: window.pickedLng });
      window.locationMap.on('click', function(event){ setPicked(event.latlng); });
      setTimeout(function(){ window.locationMap.invalidateSize(); }, 250);
    });
  };

  window.useMyLocation = function(){
    if (!navigator.geolocation) { toast('Location not supported on this device', 'error'); return; }
    toast('Getting your location...', 'info');
    navigator.geolocation.getCurrentPosition(function(pos){
      window.pickedLat = pos.coords.latitude;
      window.pickedLng = pos.coords.longitude;
      window.initLocationMap(window.pickedLat, window.pickedLng);
      toast('Location found. Tap Save Location.', 'success');
    }, function(){ toast('Could not get location. Please allow location access.', 'error'); }, { enableHighAccuracy:true, timeout:12000, maximumAge:60000 });
  };

  window.saveLocation = function(){
    var http = ax();
    if (!http) return;
    if (!window.pickedLat || !window.pickedLng) { toast('Please pick a location first', 'error'); return; }
    http.put('/api/providers/me', { location_lat: window.pickedLat, location_lng: window.pickedLng }, { headers: headers() })
      .then(function(){ toast('Location saved. Customers can now find you on the map.', 'success'); })
      .catch(function(){ toast('Could not save location', 'error'); });
  };

  window.saveProfile = window.saveProfile || function(){
    var http = ax(); if (!http) return;
    function value(id){ var node = el(id); return node ? node.value.trim() : ''; }
    var payload = {
      business_name: value('set-business-name') || undefined,
      phone: value('set-phone') || undefined,
      city: value('set-city') || undefined,
      address: value('set-address') || undefined,
      bio: value('set-bio') || undefined,
      price_from: value('set-price-min') ? Math.round(Number(value('set-price-min')) * 100) : undefined,
      price_to: value('set-price-max') ? Math.round(Number(value('set-price-max')) * 100) : undefined
    };
    http.put('/api/providers/me', payload, { headers: headers() })
      .then(function(){ toast('Profile saved', 'success'); })
      .catch(function(){ toast('Could not save profile', 'error'); });
  };

  document.addEventListener('click', function(event){
    var deleteBtn = event.target.closest && event.target.closest('.pdash-delete-gallery');
    if (deleteBtn) window.deleteGalleryImage(deleteBtn.getAttribute('data-gallery-id'));
  });

  document.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
      var gallery = el('gallery-file-input'); if (gallery) gallery.onchange = function(){ window.uploadGalleryImage(gallery); };
      var logo = el('logo-file-input'); if (logo) logo.onchange = function(){ window.uploadLogoImage(logo); };
      var cover = el('cover-file-input'); if (cover) cover.onchange = function(){ window.uploadCoverImage(cover); };
      if (document.getElementById('sec-location') && document.getElementById('sec-location').classList.contains('active')) window.initLocationMap(window.pickedLat, window.pickedLng);
    }, 500);
  });
})();
</script>`

  if (html.includes('provider-dashboard-action-fix')) return html
  return html.replace('</body>', script + '</body>')
}
