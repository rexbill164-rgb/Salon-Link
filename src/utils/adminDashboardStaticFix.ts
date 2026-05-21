export function withAdminDashboardStaticFix(html: string): string {
  const script = `
<script id="admin-dashboard-static-rescue">
(function(){
  if (location.pathname !== '/admin') return;

  function q(id){ return document.getElementById(id); }
  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function ax(){ return window.axios || null; }
  function set(id,v){ var e=q(id); if(e)e.textContent=v; }
  function toast(m,t){ if(window.showToast) window.showToast(m,t||'info'); else console.log(m); }
  function num(v){ var n=Number(v); return isFinite(n) ? n : 0; }
  function money(v){ return 'GHS ' + Math.round(num(v)/100).toLocaleString(); }
  function esc(v){ return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c}); }

  window.openAdminSidebar = function(){
    var s=q('admin-sidebar'), o=q('admin-overlay');
    if(s)s.classList.add('open');
    if(o)o.classList.add('open');
  };

  window.closeAdminSidebar = function(){
    var s=q('admin-sidebar'), o=q('admin-overlay');
    if(s)s.classList.remove('open');
    if(o)o.classList.remove('open');
  };

  function loadAdminStatsSafe(){
    if(!ax())return;
    if(!token()){ location.href='/login'; return; }

    set('kpi-users','...');
    set('kpi-providers','...');
    set('kpi-bookings','...');
    set('kpi-revenue','...');

    ax().get('/api/admin/stats?ts='+Date.now(),{headers:headers()}).then(function(res){
      var s=(res.data&&res.data.stats)||{};
      var rev=money(s.total_revenue||0);
      set('kpi-users',num(s.total_users));
      set('kpi-providers',num(s.total_providers));
      set('kpi-bookings',num(s.total_bookings));
      set('kpi-revenue',rev);
      set('chart-revenue-label',rev);
      set('kpi-users-sub',num(s.total_users)>0?num(s.total_users)+' registered':'No users yet');
      set('kpi-providers-sub',num(s.total_providers)>0?num(s.total_providers)+' on platform':'No providers yet');
      set('kpi-bookings-sub',num(s.total_bookings)>0?'all time':'No bookings yet');
      set('kpi-revenue-sub',num(s.total_revenue)>0?'total earned':'No revenue yet');
      set('chart-revenue-sub',num(s.total_revenue)>0?'total earned':'Total earnings from bookings');
    }).catch(function(e){
      console.error('Admin stats failed:',e);
      set('kpi-users','-'); set('kpi-providers','-'); set('kpi-bookings','-'); set('kpi-revenue','-');
      set('kpi-users-sub','Refresh to reload'); set('kpi-providers-sub','Refresh to reload'); set('kpi-bookings-sub','Refresh to reload'); set('kpi-revenue-sub','Refresh to reload');
    });
  }

  function loadProvidersSafe(){
    var table=q('providers-tbody');
    if(!table || !ax()) return;
    table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--t-muted);">Loading providers...</td></tr>';
    ax().get('/api/admin/providers?ts='+Date.now(),{headers:headers()}).then(function(res){
      var rows=(res.data&&res.data.providers)||[];
      if(!rows.length){ table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">No providers found</td></tr>'; return; }
      table.innerHTML=rows.map(function(p){
        var rating=num(p.rating).toFixed(1);
        var kyc=p.kyc_status||'pending';
        var badge=kyc==='approved'?'badge-verified':kyc==='rejected'?'badge-error':'badge-pending';
        return '<tr>'+
          '<td style="font-weight:700;">'+esc(p.business_name||'—')+'<div style="font-size:10px;color:#888;">'+esc((p.first_name||'')+' '+(p.last_name||''))+'</div></td>'+
          '<td style="font-size:12px;">'+esc(p.email||'')+'<div style="font-size:10px;color:#888;">'+esc(p.phone||'')+'</div></td>'+
          '<td>'+esc(String(p.service_category||'').replace(/_/g,' '))+'</td>'+
          '<td>'+rating+' ★<div style="font-size:10px;color:#888;">'+num(p.total_reviews)+' reviews</div></td>'+
          '<td><span class="badge '+badge+'">'+esc(kyc)+'</span></td>'+
          '<td style="font-size:11px;">'+esc(p.city||'')+'</td>'+
          '<td>'+
            '<button onclick="viewProviderKyc('+p.id+')" style="padding:5px 10px;font-size:10px;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.25);color:#2563eb;border-radius:8px;cursor:pointer;margin-bottom:4px;display:block;width:100%;">View KYC</button>'+
            (kyc!=='approved'?'<button onclick="approveKyc('+p.id+')" class="btn-primary" style="padding:5px 10px;font-size:10px;margin-bottom:4px;display:block;width:100%;">Approve</button>':'<span style="font-size:10px;color:var(--s-green);display:block;text-align:center;margin-bottom:4px;">Approved</span>')+
            (kyc!=='rejected'&&kyc!=='approved'?'<button onclick="rejectKyc('+p.id+')" style="padding:5px 10px;font-size:10px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;display:block;width:100%;">Reject</button>':'')+
          '</td>'+
        '</tr>';
      }).join('');
    }).catch(function(e){
      console.error('Admin providers failed:',e);
      var msg=e&&e.response&&e.response.status===403?'Session expired — please log in again':'Failed to load providers';
      table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--s-red);">'+msg+'</td></tr>';
    });
  }

  function loadKycSafe(){
    var table=q('kyc-tbody');
    if(!table || !ax()) return;
    table.innerHTML='<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--t-muted);">Loading KYC queue...</td></tr>';
    ax().get('/api/admin/providers?ts='+Date.now(),{headers:headers()}).then(function(res){
      var rows=((res.data&&res.data.providers)||[]).filter(function(p){return p.kyc_status!=='approved'&&p.kyc_status!=='rejected';});
      if(!rows.length){ table.innerHTML='<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--t-muted);">All providers are reviewed — no pending KYC</td></tr>'; return; }
      table.innerHTML=rows.map(function(p){
        return '<tr id="kyc-row-'+p.id+'">'+
          '<td><div style="font-weight:700;font-size:13px;">'+esc(p.business_name||'—')+'</div><div style="font-size:11px;color:#888;">'+esc((p.first_name||'')+' '+(p.last_name||''))+'</div><div style="font-size:10px;color:#888;margin-top:2px;">Card: '+esc(p.kyc_card_number||'Not submitted')+'</div></td>'+
          '<td style="font-size:12px;">'+esc(p.email||'')+'<div style="font-size:10px;color:#888;">'+esc(p.phone||'')+'</div></td>'+
          '<td>'+esc(String(p.service_category||'').replace(/_/g,' '))+'</td>'+
          '<td><button onclick="viewProviderKyc('+p.id+')" style="padding:7px 14px;font-size:11px;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.25);color:#2563eb;border-radius:8px;cursor:pointer;font-weight:700;">View Documents</button></td>'+
          '<td><button onclick="approveKyc('+p.id+')" class="btn-primary" style="padding:6px 14px;font-size:11px;margin-bottom:4px;display:block;width:100%;">Approve</button><button onclick="rejectKyc('+p.id+')" style="padding:6px 14px;font-size:11px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;display:block;width:100%;">Reject</button></td>'+
        '</tr>';
      }).join('');
    }).catch(function(e){
      console.error('Admin KYC failed:',e);
      table.innerHTML='<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--s-red);">Failed to load KYC data</td></tr>';
    });
  }

  function loadBookingsSafe(){
    var table=q('bookings-tbody');
    if(!table || !ax()) return;
    table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--t-muted);">Loading bookings...</td></tr>';
    ax().get('/api/admin/bookings?ts='+Date.now(),{headers:headers()}).then(function(res){
      var rows=(res.data&&res.data.bookings)||[];
      if(!rows.length){ table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">No bookings found</td></tr>'; return; }
      table.innerHTML=rows.slice(0,50).map(function(b){
        return '<tr><td>#'+esc(b.id)+'</td><td>'+esc((b.customer_first_name||'')+' '+(b.customer_last_name||''))+'</td><td style="font-weight:700;">'+esc(b.business_name||'')+'</td><td>'+esc(b.service_name||'')+'</td><td style="font-size:12px;">'+esc((b.booking_date||'')+' '+(b.booking_time||''))+'</td><td>'+money(b.total_amount||0)+'</td><td><span class="badge badge-pending">'+esc(b.status||'pending')+'</span></td></tr>';
      }).join('');
    }).catch(function(e){
      console.error('Admin bookings failed:',e);
      table.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--s-red);">Failed to load bookings</td></tr>';
    });
  }

  window.loadAdminStatsSafe=loadAdminStatsSafe;
  window.loadProviders=loadProvidersSafe;
  window.loadKyc=loadKycSafe;
  window.loadBookings=loadBookingsSafe;

  window.adminSection = function(id, btn){
    Array.prototype.slice.call(document.querySelectorAll('.admin-section')).forEach(function(s){s.classList.remove('active');});
    Array.prototype.slice.call(document.querySelectorAll('.sidebar-item')).forEach(function(b){b.classList.remove('active');});
    Array.prototype.slice.call(document.querySelectorAll('.amob-btn')).forEach(function(b){b.classList.remove('active');});
    var sec=q('admin-'+id); if(sec)sec.classList.add('active');
    var nav=q('admin-nav-'+id); if(nav)nav.classList.add('active');
    if(btn)btn.classList.add('active');
    var mob=q('amob-'+id); if(mob)mob.classList.add('active');
    var titles={overview:'Platform Overview',users:'User Management',providers:'Provider Management',bookings:'Booking Management',kyc:'KYC Verification Queue',payments:'Payment Management',fees:'Platform Service Fees',registrants:'Registrants Tracker',reconcile:'Daily Fee Reconciliation',reports:'Reports & Analytics',security:'Security & Fraud',rewards:'Reward Items',points:'Provider Points'};
    set('admin-title',titles[id]||id);
    if(window.closeAdminSidebar) window.closeAdminSidebar();
    if(id==='overview') loadAdminStatsSafe();
    if(id==='providers') loadProvidersSafe();
    if(id==='kyc') loadKycSafe();
    if(id==='bookings') loadBookingsSafe();
    if(id==='users' && typeof window.loadUsers==='function') window.loadUsers();
    if(id==='payments' && typeof window.loadPaymentSummary==='function') window.loadPaymentSummary();
    if(id==='fees'){ if(typeof window.loadFeeSummary==='function') window.loadFeeSummary(); if(typeof window.loadFees==='function') window.loadFees('pending'); }
    if(id==='registrants' && typeof window.loadRegistrants==='function') window.loadRegistrants(30);
    if(id==='rewards' && typeof window.loadRewards==='function') window.loadRewards();
    if(id==='points' && typeof window.loadPointsSection==='function') window.loadPointsSection();
    if(id==='reconcile'){ var d=q('reconcile-date'); if(d&&!d.value)d.value=new Date().toISOString().split('T')[0]; }
  };

  document.addEventListener('DOMContentLoaded',function(){
    if(!token()){ location.href='/login'; return; }
    setTimeout(function(){ var splash=q('sl-launch-splash'); if(splash&&splash.parentNode)splash.parentNode.removeChild(splash); document.documentElement.classList.remove('sl-splash-lock'); },1500);
    setTimeout(loadAdminStatsSafe,250);
  });
})();
</script>`

  if (html.includes('admin-dashboard-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}