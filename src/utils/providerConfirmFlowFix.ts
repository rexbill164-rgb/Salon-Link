export function withProviderConfirmFlowFix(html: string): string {
  if (html.includes('provider-confirm-flow-fix-script')) return html

  const patch = `
<style id="provider-confirm-flow-fix-style">
  .sl-confirm-note{background:#fff7ed;border:1px solid #fed7aa;color:#7c2d12;border-radius:14px;padding:12px 14px;margin:0 0 14px;font-size:12px;line-height:1.5}.sl-confirm-note strong{color:#111}.sl-appt-order{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
</style>
<script id="provider-confirm-flow-fix-script">
(function(){
  if(location.pathname !== '/provider/dashboard') return;
  function token(){return localStorage.getItem('sl_token')||localStorage.getItem('token')||''}
  function headers(){return {Authorization:'Bearer '+token()}}
  function toast(m,t){if(window.showToast) window.showToast(m,t||'info')}
  function toMinutes(t){var m=String(t||'').match(/(\d+):(\d+)\s*(AM|PM)?/i); if(!m)return 0; var h=Number(m[1]), min=Number(m[2]); var ap=(m[3]||'').toUpperCase(); if(ap==='PM'&&h!==12)h+=12; if(ap==='AM'&&h===12)h=0; return h*60+min}
  function firstComeSort(rows){return (rows||[]).slice().sort(function(a,b){var ad=String(a.booking_date||''), bd=String(b.booking_date||''); if(ad!==bd)return ad<bd?-1:1; var at=toMinutes(a.booking_time), bt=toMinutes(b.booking_time); if(at!==bt)return at-bt; return String(a.created_at||'').localeCompare(String(b.created_at||''));})}
  function badge(status){return status==='confirmed'?'badge-verified':status==='completed'?'badge-success':status==='cancelled'?'badge-error':'badge-pending'}
  function money(v){return 'GHS '+Math.round(Number(v||0)/100)}
  function renderRows(rows,targetId){var el=document.getElementById(targetId); if(!el)return; rows=firstComeSort(rows); if(!rows.length){el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No appointments found.</div>';return} el.innerHTML='<div class="sl-confirm-note"><strong>First come, first served:</strong> New bookings stay pending until you confirm them.</div>'+rows.map(function(a,i){var st=a.status||'pending';return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;"><div class="mini-avatar">'+String(a.first_name||'?').charAt(0)+'</div><div style="flex:1;min-width:140px;"><div style="font-size:13px;font-weight:700;">'+(a.first_name||'')+' '+(a.last_name||'')+'</div><div style="font-size:11px;color:var(--t-muted);">'+(a.service_name||'')+' · '+(a.booking_date||'')+' @ '+(a.booking_time||'')+'</div><div class="sl-appt-order">Queue #'+(i+1)+'</div></div><div style="text-align:right"><div style="font-size:13px;font-weight:700;color:var(--g-main);">'+money(a.total_amount)+'</div><span class="badge '+badge(st)+'" style="font-size:9px;">'+st+'</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;">'+(st==='pending'?'<button data-id="'+a.id+'" data-status="confirmed" onclick="updateApptBtn(this)" class="btn-primary" style="padding:6px 12px;font-size:10px;">Confirm client</button>':'')+(st==='confirmed'?'<button data-id="'+a.id+'" data-status="completed" onclick="updateApptBtn(this)" style="padding:6px 12px;font-size:10px;border-radius:8px;border:1px solid var(--g-border);background:var(--g-dim);color:var(--g-main);cursor:pointer;">Service complete</button>':'')+((st==='pending'||st==='confirmed')?'<button data-id="'+a.id+'" data-status="cancelled" onclick="updateApptBtn(this)" style="padding:6px 12px;font-size:10px;border-radius:8px;border:1px solid rgba(224,112,112,.3);background:transparent;color:var(--s-red);cursor:pointer;">Cancel</button>':'')+'</div></div>'}).join('')}
  window.showFeeReminder=function(){toast('Service marked complete. Customer can now leave a review.','success')}
  window.closeFeeReminder=function(){var m=document.getElementById('fee-reminder-modal'); if(m)m.remove()}
  window.updateAppt=function(id,status){axios.patch('/api/bookings/'+id+'/status',{status:status},{headers:headers()}).then(function(){toast(status==='confirmed'?'Client confirmed':status==='completed'?'Service marked complete':'Booking '+status,'success');setTimeout(function(){loadProviderAppointmentsFixed()},700)}).catch(function(e){toast((e.response&&e.response.data&&e.response.data.error)||'Update failed','error')})}
  window.updateApptBtn=function(btn){window.updateAppt(btn.getAttribute('data-id'),btn.getAttribute('data-status'))}
  window.loadProviderAppointmentsFixed=function(){if(!token())return;axios.get('/api/bookings/provider',{headers:headers()}).then(function(r){var rows=firstComeSort((r.data||{}).bookings||[]);window.allAppts=rows;renderRows(rows,'appts-list');var today=new Date().toISOString().split('T')[0];renderRows(rows.filter(function(a){return a.booking_date===today}).slice(0,5),'today-appts')}).catch(function(){})}
  var oldFilter=window.filterAppts;
  window.filterAppts=function(btn,status){if(btn){document.querySelectorAll('#sec-appts button').forEach(function(b){b.style.background='transparent';b.style.borderColor='var(--i-faint)';b.style.color='var(--t-secondary)'});btn.style.background='var(--g-dim)';btn.style.borderColor='var(--g-border)';btn.style.color='var(--g-main)'}var rows=window.allAppts||[];var filtered=status==='All'?rows:status==='Today'?rows.filter(function(a){return a.booking_date===new Date().toISOString().split('T')[0]}):rows.filter(function(a){return String(a.status||'pending')===String(status).toLowerCase()});renderRows(filtered,'appts-list')}
  document.addEventListener('DOMContentLoaded',function(){setTimeout(window.loadProviderAppointmentsFixed,1200);setInterval(window.loadProviderAppointmentsFixed,20000)})
})();
</script>`
  return html.replace('</body>', patch + '</body>')
}
