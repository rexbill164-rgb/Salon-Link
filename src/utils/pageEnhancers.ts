export function withProviderUxFixes(html: string): string {
  const style = `
<style id="provider-mobile-service-fixes">
  @media(max-width:640px){
    .container{padding-bottom:130px!important;}
    #services-grid{padding-bottom:105px!important;}
    .service-item{gap:10px!important;align-items:flex-start!important;padding:14px 0!important;}
    .service-item > div:first-child{min-width:0!important;flex:1!important;}
    .service-item > div:first-child > div:last-child{min-width:0!important;flex:1!important;}
    .service-item span{word-break:normal!important;}
    .service-item span[style*="font-size:14px"],
    .service-item span[style*="font-size: 14px"]{
      display:-webkit-box!important;
      -webkit-line-clamp:2!important;
      -webkit-box-orient:vertical!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      max-width:170px!important;
      line-height:1.25!important;
      font-size:13px!important;
    }
    .service-item > div:last-child{flex-shrink:0!important;min-width:86px!important;justify-content:flex-end!important;gap:7px!important;}
    .service-item > div:last-child span{font-size:16px!important;white-space:nowrap!important;}
  }
</style>`
  const script = `
<script id="provider-chat-button-fix">
(function(){
  function providerId(){ return location.pathname.split('/').filter(Boolean).pop() || ''; }
  function wire(){
    if (!location.pathname.startsWith('/provider/')) return;
    Array.prototype.slice.call(document.querySelectorAll('button,a')).forEach(function(el){
      var txt=(el.textContent||'').trim().toLowerCase();
      if(txt.indexOf('message provider')>=0 || txt==='message'){
        el.onclick=function(e){ e.preventDefault(); location.href='/messages?provider_id='+encodeURIComponent(providerId()); };
        el.style.cursor='pointer';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', wire);
  document.addEventListener('click', function(){ setTimeout(wire,250); }, true);
})();
</script>`
  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}

export function withDiscoveryNearby(html: string): string {
  const script = `
<script id="nearby-providers-panel">
(function(){
  if(location.pathname !== '/discover') return;
  function esc(s){return String(s||'').replace(/[&<>\"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[c];});}
  function money(v){return v?('GHS '+Math.round(Number(v)/100)):'From price';}
  function panel(){
    var grid=document.getElementById('providers-grid');
    if(!grid || document.getElementById('nearby-panel')) return;
    var div=document.createElement('div');
    div.id='nearby-panel';
    div.style.cssText='background:#fff;border:1px solid #eee;border-radius:22px;padding:18px;margin:0 0 18px;box-shadow:0 8px 24px rgba(0,0,0,.06);';
    div.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;"><div><div style="font-weight:900;font-size:16px;color:#111;">Providers near you</div><div id="nearby-sub" style="font-size:12px;color:#777;margin-top:3px;">Allow location to see providers around you.</div></div><button id="nearby-btn" style="border:none;background:#111;color:#fff;border-radius:999px;padding:10px 14px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap;">Use location</button></div><div id="nearby-list" style="display:none;margin-top:14px;gap:10px;overflow-x:auto;"></div>';
    grid.parentNode.insertBefore(div, grid);
    div.querySelector('#nearby-btn').onclick=loadNearby;
  }
  function loadNearby(){
    var btn=document.getElementById('nearby-btn'), sub=document.getElementById('nearby-sub'), list=document.getElementById('nearby-list');
    if(!navigator.geolocation){sub.textContent='Location is not supported on this device.';return;}
    btn.textContent='Loading...'; btn.disabled=true;
    navigator.geolocation.getCurrentPosition(function(pos){
      fetch('/api/providers/nearby?lat='+encodeURIComponent(pos.coords.latitude)+'&lng='+encodeURIComponent(pos.coords.longitude)+'&limit=10')
        .then(function(r){return r.json();}).then(function(data){
          var providers=data.providers||[];
          sub.textContent=providers.length?('Showing '+providers.length+' nearby providers'):'No nearby providers found yet';
          list.style.display='flex';
          list.innerHTML=providers.map(function(p){
            var d=p.distance_km&&p.distance_km<9999?(p.distance_km<1?Math.round(p.distance_km*1000)+'m':p.distance_km.toFixed(1)+'km'):(p.city||'Accra');
            return '<button onclick="location.href=\'/provider/'+p.id+'\'" style="min-width:210px;text-align:left;border:1px solid #eee;background:#fafafa;border-radius:18px;padding:14px;cursor:pointer;"><div style="font-weight:900;font-size:13px;color:#111;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(p.business_name)+'</div><div style="font-size:11px;color:#777;margin-bottom:8px;">'+esc((p.service_category||'Beauty').replace(/_/g,' '))+' • '+esc(d)+'</div><div style="font-size:12px;font-weight:800;color:#111;">'+money(p.price_from)+' →</div></button>';
          }).join('');
          btn.textContent='Refresh'; btn.disabled=false;
        }).catch(function(){ sub.textContent='Could not load nearby providers.'; btn.textContent='Try again'; btn.disabled=false; });
    }, function(){ sub.textContent='Location permission denied. Allow location to see nearby providers.'; btn.textContent='Use location'; btn.disabled=false; });
  }
  document.addEventListener('DOMContentLoaded', panel);
})();
</script>`
  return html.replace('</body>', script + '</body>')
}

export function withAdminKycViewer(html: string): string {
  const script = `
<script id="admin-kyc-viewer-now">
(function(){
  if(location.pathname !== '/admin') return;
  function token(){return localStorage.getItem('sl_token')||localStorage.getItem('token')||localStorage.getItem('auth_token')||'';}
  function esc(s){return String(s||'').replace(/[&<>\"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[c];});}
  function block(title,value){var img=value&&String(value).trim(); if(!img)return '<div style="border:1px dashed #ddd;border-radius:16px;padding:18px;background:#fafafa;min-height:120px;display:flex;align-items:center;justify-content:center;text-align:center;color:#777;font-size:12px;"><div><b>'+title+'</b><br>Not uploaded</div></div>'; return '<div style="border:1px solid #eee;border-radius:16px;padding:12px;background:#fff;overflow:hidden"><div style="font-size:11px;font-weight:800;color:#777;margin-bottom:10px">'+title+'</div><img src="'+esc(img)+'" style="width:100%;max-height:340px;object-fit:contain;border-radius:12px;background:#f7f7f7"><a href="'+esc(img)+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;font-size:12px;color:#111;font-weight:700">Open full image</a></div>';}
  window.openKycDocuments=async function(id){
    var t=token(); if(!t){alert('Admin login required');return;}
    var modal=document.getElementById('kyc-doc-modal');
    if(!modal){modal=document.createElement('div');modal.id='kyc-doc-modal';modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:999999;display:none;align-items:center;justify-content:center;padding:20px;';modal.innerHTML='<div style="background:#fff;border-radius:24px;max-width:980px;width:100%;max-height:92vh;overflow:auto"><div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #eee"><div><div style="font-size:18px;font-weight:900;color:#111">KYC Documents</div><div id="kyc-doc-sub" style="font-size:12px;color:#777">Loading...</div></div><button onclick="document.getElementById(\'kyc-doc-modal\').style.display=\'none\'" style="width:38px;height:38px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:20px">×</button></div><div id="kyc-doc-body" style="padding:22px">Loading...</div></div>';document.body.appendChild(modal);modal.onclick=function(e){if(e.target===modal)modal.style.display='none';};}
    modal.style.display='flex'; document.getElementById('kyc-doc-sub').textContent='Provider #'+id; document.getElementById('kyc-doc-body').innerHTML='Loading documents...';
    try{var r=await fetch('/api/admin/providers/'+encodeURIComponent(id)+'/kyc-images',{headers:{Authorization:'Bearer '+t}});var d=await r.json();if(!d.success)throw new Error(d.error||'Could not load documents');var img=d.images||{};document.getElementById('kyc-doc-sub').textContent='Ghana Card: '+(img.kyc_card_number||'Not provided');document.getElementById('kyc-doc-body').innerHTML='<div style="background:#f8f8f8;border:1px solid #eee;border-radius:16px;padding:14px;margin-bottom:18px;font-size:13px;color:#333"><b>Ghana Card Number:</b> '+esc(img.kyc_card_number||'Not provided')+'</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">'+block('Ghana Card Front',img.kyc_front_url)+block('Ghana Card Back',img.kyc_back_url)+block('Selfie / Face Photo',img.kyc_selfie_url)+'</div>';}
    catch(e){document.getElementById('kyc-doc-body').innerHTML='<div style="padding:24px;border:1px solid #f2caca;background:#fff5f5;border-radius:16px;color:#9b1c1c">'+esc(e.message||e)+'</div>';}
  };
  function rowId(row){var text=row.innerHTML;var m=text.match(/(?:provider|kyc|approve|reject)[^0-9]*(\d+)/i)||text.match(/\b(\d{1,8})\b/);return m?m[1]:'';}
  function add(){var tb=document.getElementById('kyc-tbody'); if(!tb)return; Array.prototype.slice.call(tb.querySelectorAll('tr')).forEach(function(row){if(row.dataset.kycViewerAdded==='1'||/loading/i.test(row.textContent||''))return;var id=row.getAttribute('data-provider-id')||rowId(row);if(!id)return;row.dataset.kycViewerAdded='1';var cell=row.querySelector('td:last-child')||row.insertCell(-1);var b=document.createElement('button');b.textContent='View Documents';b.style.cssText='margin:4px;padding:8px 12px;border-radius:999px;border:1px solid #111;background:#111;color:#fff;font-size:11px;font-weight:800;cursor:pointer';b.onclick=function(){window.openKycDocuments(id)};cell.appendChild(b);});}
  document.addEventListener('DOMContentLoaded',function(){add();var tb=document.getElementById('kyc-tbody');if(tb)new MutationObserver(add).observe(tb,{childList:true,subtree:true});document.addEventListener('click',function(){setTimeout(add,400)},true);});
})();
</script>`
  return html.replace('</body>', script + '</body>')
}
