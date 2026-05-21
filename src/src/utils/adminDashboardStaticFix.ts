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
  function money(v){ return 'GHS ' + Math.round(Number(v||0)/100).toLocaleString(); }

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

  window.adminSection = function(id, btn){
    Array.prototype.slice.call(document.querySelectorAll('.admin-section')).forEach(function(s){s.classList.remove('active');});
    Array.prototype.slice.call(document.querySelectorAll('.sidebar-item')).forEach(function(b){b.classList.remove('active');});
    Array.prototype.slice.call(document.querySelectorAll('.amob-btn')).forEach(function(b){b.classList.remove('active');});

    var sec=q('admin-'+id); if(sec)sec.classList.add('active');
    var nav=q('admin-nav-'+id); if(nav)nav.classList.add('active');
    if(btn)btn.classList.add('active');
    var mob=q('amob-'+id); if(mob)mob.classList.add('active');

    var titles={
      overview:'Platform Overview',
      users:'User Management',
      providers:'Provider Management',
      bookings:'Booking Management',
      kyc:'KYC Verification Queue',
      payments:'Payment Management',
      fees:'Platform Service Fees',
      registrants:'Registrants Tracker',
      reconcile:'Daily Fee Reconciliation',
      reports:'Reports & Analytics',
      security:'Security & Fraud',
      rewards:'Reward Items',
      points:'Provider Points'
    };
    set('admin-title',titles[id]||id);
    window.closeAdminSidebar();

    try{
      if(id==='overview') loadAdminStatsSafe();
      if(id==='users' && typeof loadUsers==='function') loadUsers();
      if(id==='providers' && typeof loadProviders==='function') loadProviders();
      if(id==='bookings' && typeof loadBookings==='function') loadBookings();
      if(id==='kyc' && typeof loadKyc==='function') loadKyc();
      if(id==='payments' && typeof loadPaymentSummary==='function') loadPaymentSummary();
      if(id==='fees'){
        if(typeof loadFeeSummary==='function') loadFeeSummary();
        if(typeof loadFees==='function') loadFees('pending');
      }
      if(id==='registrants' && typeof loadRegistrants==='function') loadRegistrants(30);
      if(id==='rewards' && typeof loadRewards==='function') loadRewards();
      if(id==='points' && typeof loadPointsSection==='function') loadPointsSection();
      if(id==='reconcile'){
        var d=q('reconcile-date');
        if(d && !d.value)d.value=new Date().toISOString().split('T')[0];
      }
    }catch(e){
      console.error('Admin section failed:',e);
      toast('Admin section opened but some data could not load.','error');
    }
  };

  function loadAdminStatsSafe(){
    if(!ax())return;
    if(!token()){ location.href='/login'; return; }

    set('kpi-users','…');
    set('kpi-providers','…');
    set('kpi-bookings','…');
    set('kpi-revenue','…');

    ax().get('/api/admin/stats?ts='+Date.now(),{headers:headers()}).then(function(res){
      var s=(res.data&&res.data.stats)||{};
      var rev=money(s.total_revenue||0);

      set('kpi-users',s.total_users||0);
      set('kpi-providers',s.total_providers||0);
      set('kpi-bookings',s.total_bookings||0);
      set('kpi-revenue',rev);
      set('chart-revenue-label',rev);

      set('kpi-users-sub',(s.total_users||0)>0?s.total_users+' registered':'No users yet');
      set('kpi-providers-sub',(s.total_providers||0)>0?s.total_providers+' on platform':'No providers yet');
      set('kpi-bookings-sub',(s.total_bookings||0)>0?'all time':'No bookings yet');
      set('kpi-revenue-sub',(s.total_revenue||0)>0?'total earned':'No revenue yet');
      set('chart-revenue-sub',(s.total_revenue||0)>0?'total earned':'Total earnings from bookings');
    }).catch(function(e){
      console.error('Admin stats failed:',e);
      set('kpi-users','—');
      set('kpi-providers','—');
      set('kpi-bookings','—');
      set('kpi-revenue','—');
      set('kpi-users-sub','Refresh to reload');
      set('kpi-providers-sub','Refresh to reload');
      set('kpi-bookings-sub','Refresh to reload');
      set('kpi-revenue-sub','Refresh to reload');
    });
  }

  window.loadAdminStatsSafe=loadAdminStatsSafe;

  document.addEventListener('DOMContentLoaded',function(){
    if(!token()){ location.href='/login'; return; }

    setTimeout(function(){
      var splash=q('sl-launch-splash');
      if(splash&&splash.parentNode)splash.parentNode.removeChild(splash);
      document.documentElement.classList.remove('sl-splash-lock');
    },1500);

    setTimeout(loadAdminStatsSafe,250);
  });
})();
</script>`

  if (html.includes('admin-dashboard-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}
