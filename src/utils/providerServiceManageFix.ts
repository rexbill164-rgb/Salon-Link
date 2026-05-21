export function withProviderServiceManageFix(html: string): string {
  const script = `
<script id="provider-service-manage-fix">
(function(){
  if (location.pathname !== '/provider/dashboard') return;
  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function api(){ return window.axios || null; }
  function el(id){ return document.getElementById(id); }
  function toast(m,t){ if(window.showToast) window.showToast(m,t||'info'); else console.log(m); }
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100); }
  function clean(v){ return String(v||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]||c}); }

  function render(rows){
    var box=el('my-services-list');
    if(!box) return;
    if(!rows.length){ box.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No services yet. Add your first service above.</div>'; return; }
    box.innerHTML=rows.map(function(s){
      var ghs=Math.round(Number(s.price||0)/100);
      return '<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;">'
      + '<div style="flex:1;min-width:150px;"><div style="font-size:13px;font-weight:800;">'+clean(s.name||'Service')+'</div><div style="font-size:11px;color:var(--t-muted);">'+(s.duration_minutes||60)+' min</div></div>'
      + '<div style="font-size:15px;font-weight:800;color:var(--g-main);">'+money(s.price)+'</div>'
      + '<button type="button" class="sl-svc-edit" data-id="'+s.id+'" data-name="'+clean(s.name||'')+'" data-price="'+ghs+'" data-duration="'+(s.duration_minutes||60)+'" data-desc="'+clean(s.description||'')+'" style="padding:7px 11px;border-radius:999px;border:1px solid var(--i-faint);background:#fff;font-size:11px;font-weight:800;cursor:pointer;">Edit</button>'
      + '<button type="button" class="sl-svc-remove" data-id="'+s.id+'" style="padding:7px 11px;border-radius:999px;border:1px solid rgba(180,35,24,.25);background:rgba(180,35,24,.06);color:#b42318;font-size:11px;font-weight:800;cursor:pointer;">Remove</button>'
      + '</div>';
    }).join('');
  }

  function load(){
    var box=el('my-services-list');
    if(!api() || !box) return;
    api().get('/api/providers/me/services?ts='+Date.now(),{headers:headers()}).then(function(r){render((r.data||{}).services||[]);}).catch(function(){toast('Could not load services','error');});
  }

  function edit(btn){
    var id=btn.getAttribute('data-id');
    var name=prompt('Service name',btn.getAttribute('data-name')||''); if(name===null)return; name=name.trim(); if(!name){toast('Service name required','error');return;}
    var price=Number(prompt('Price in GHS',btn.getAttribute('data-price')||'0')); if(!price){toast('Valid price required','error');return;}
    var duration=Number(prompt('Duration in minutes',btn.getAttribute('data-duration')||'60'))||60;
    var description=prompt('Description',btn.getAttribute('data-desc')||'')||'';
    api().put('/api/providers/me/services/'+encodeURIComponent(id),{name:name,price:Math.round(price*100),duration:duration,description:description},{headers:headers()}).then(function(){toast('Service updated','success');load();}).catch(function(e){var d=e&&e.response&&e.response.data?e.response.data:{};toast(d.error||'Could not update service','error');});
  }

  function remove(btn){
    var id=btn.getAttribute('data-id'); if(!id)return;
    if(!confirm('Remove this service?')) return;
    api().delete('/api/providers/me/services/'+encodeURIComponent(id),{headers:headers()}).then(function(){toast('Service removed','success');load();}).catch(function(e){var d=e&&e.response&&e.response.data?e.response.data:{};toast(d.error||'Could not remove service','error');});
  }

  document.addEventListener('click',function(ev){
    var eb=ev.target.closest&&ev.target.closest('.sl-svc-edit'); if(eb){ev.preventDefault();ev.stopPropagation();edit(eb);return;}
    var rb=ev.target.closest&&ev.target.closest('.sl-svc-remove'); if(rb){ev.preventDefault();ev.stopPropagation();remove(rb);return;}
  },true);

  var oldShow=window.showSection;
  window.showSection=function(id,btn){ if(typeof oldShow==='function') oldShow(id,btn); if(id==='services') setTimeout(load,250); };
  window.loadServices=load;
  document.addEventListener('DOMContentLoaded',function(){ setTimeout(load,1000); });
})();
</script>`;
  if(html.includes('provider-service-manage-fix')) return html;
  return html.replace('</body>', script + '</body>');
}
