export function withProviderDashboardStaticFix(html: string): string {
  const script = `
<script id="provider-dashboard-static-rescue">
(function(){
  if (location.pathname !== '/provider/dashboard') return;

  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function user(){ try { return JSON.parse(localStorage.getItem('sl_user') || localStorage.getItem('user') || '{}'); } catch(e){ return {}; } }
  function authHeaders(){ return { Authorization: 'Bearer ' + token() }; }
  function setText(id, value){ var el = document.getElementById(id); if (el) el.textContent = value; }
  function money(value){ return 'GHS ' + Math.round(Number(value || 0) / 100); }
  function safeToast(message, type){ if (typeof window.showToast === 'function') window.showToast(message, type || 'info'); else console.log('[SalonLink]', message); }
  function getAxios(){ return window.axios || null; }

  window.openSidebar = function(){
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('sb-overlay');
    if (sb) sb.classList.add('open');
    if (ov) ov.classList.add('open');
  };
  window.closeSidebar = function(){
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('sb-overlay');
    if (sb) sb.classList.remove('open');
    if (ov) ov.classList.remove('open');
  };
  window.logout = function(){
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.href = '/login';
  };
  window.viewPublicProfile = function(){
    if (window.providerIdGlobal) window.open('/provider/' + window.providerIdGlobal, '_blank');
    else safeToast('Provider profile is still loading', 'info');
  };

  window.showSection = function(id, btn){
    Array.prototype.slice.call(document.querySelectorAll('.section')).forEach(function(sec){ sec.classList.remove('active'); });
    Array.prototype.slice.call(document.querySelectorAll('.sidebar-item')).forEach(function(item){ item.classList.remove('active'); });
    Array.prototype.slice.call(document.querySelectorAll('.mob-nav-item')).forEach(function(item){ item.classList.remove('active'); });

    var sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
    if (btn) btn.classList.add('active');
    var nav = document.getElementById('nav-' + id); if (nav) nav.classList.add('active');
    var mob = document.getElementById('mob-' + id); if (mob) mob.classList.add('active');

    var titles = {overview:'Overview',appts:'Appointments',services:'My Services',gallery:'Gallery',location:'Location',reviews:'Reviews',earnings:'Earnings',kyc:'KYC Status',settings:'Settings'};
    setText('sec-title', titles[id] || id);
    window.closeSidebar();

    if (id === 'services') rescueLoadServices();
    if (id === 'appts') rescueLoadAppointments();
    if (id === 'settings') rescueLoadSettings();
    if (id === 'overview') rescueLoadDashboard();
  };

  function renderToday(appts){
    var el = document.getElementById('today-appts');
    if (!el) return;
    if (!appts || !appts.length) {
      el.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No appointments today ✦</div>';
      return;
    }
    el.innerHTML = appts.map(function(a){
      return '<div class="appt-row"><div class="mini-avatar">' + String(a.first_name || '?').charAt(0) + '</div>' +
        '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:700;">' + (a.first_name || '') + ' ' + (a.last_name || '') + '</div>' +
        '<div style="font-size:11px;color:var(--t-muted);">' + (a.service_name || '') + '</div></div>' +
        '<div style="text-align:right;"><div style="font-size:12px;font-weight:700;color:var(--g-main);">' + (a.booking_time || '') + '</div>' +
        '<span class="badge badge-pending" style="font-size:9px;">' + (a.status || 'pending') + '</span></div></div>';
    }).join('');
  }

  function renderAppointments(bookings){
    var el = document.getElementById('appts-list');
    if (!el) return;
    if (!bookings || !bookings.length) {
      el.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No appointments found.</div>';
      return;
    }
    el.innerHTML = bookings.map(function(a){
      return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;">' +
        '<div class="mini-avatar">' + String(a.first_name || '?').charAt(0) + '</div>' +
        '<div style="flex:1;min-width:120px;"><div style="font-size:13px;font-weight:700;">' + (a.first_name || '') + ' ' + (a.last_name || '') + '</div>' +
        '<div style="font-size:11px;color:var(--t-muted);">' + (a.service_name || '') + ' · ' + (a.booking_date || '') + ' ' + (a.booking_time ? '@ ' + a.booking_time : '') + '</div></div>' +
        '<div style="font-size:13px;font-weight:700;color:var(--g-main);">' + money(a.total_amount || 0) + '</div>' +
        '<span class="badge badge-pending" style="font-size:9px;">' + (a.status || 'pending') + '</span></div>';
    }).join('');
  }

  function renderServices(services){
    var el = document.getElementById('my-services-list');
    if (!el) return;
    if (!services || !services.length) {
      el.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No services yet. Add your first service above.</div>';
      return;
    }
    el.innerHTML = services.map(function(s){
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--i-faint);">' +
        '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">' + (s.name || 'Service') + '</div>' +
        '<div style="font-size:11px;color:var(--t-muted);">' + (s.duration_minutes || s.duration || 60) + ' min</div></div>' +
        '<div style="font-size:15px;font-weight:700;color:var(--g-main);">' + money(s.price || 0) + '</div></div>';
    }).join('');
  }

  function rescueLoadDashboard(){
    var ax = getAxios();
    if (!ax || !token()) return;
    ax.get('/api/providers/me/dashboard', { headers: authHeaders() })
      .then(function(res){
        var d = res.data || {};
        var p = d.provider || {};
        var stats = d.stats || {};
        window.providerIdGlobal = p.id || window.providerIdGlobal;
        setText('sb-name', p.business_name || 'My Salon');
        setText('kpi-today', stats.today_bookings || 0);
        setText('kpi-revenue', money(stats.week_revenue || 0));
        setText('kpi-clients', stats.total_clients || 0);
        setText('kpi-rating', stats.rating ? Number(stats.rating).toFixed(1) : '—');
        var badge = document.getElementById('sb-badge');
        if (badge) {
          badge.className = p.is_verified ? 'badge badge-verified' : 'badge badge-pending';
          badge.textContent = p.is_verified ? '✓ Verified' : '⏳ Pending Approval';
        }
        var banner = document.getElementById('pending-banner');
        if (banner && !p.is_verified) banner.style.display = 'block';
        var tog = document.getElementById('accepting-toggle');
        if (tog) tog.checked = p.is_accepting_bookings === 1 || p.is_accepting_bookings === true;
        renderToday(d.today_appointments || []);
        rescueLoadServices();
      })
      .catch(function(err){
        if (err && err.response && err.response.status === 401) location.href = '/login';
        else safeToast('Provider dashboard could not load. Please refresh.', 'error');
      });
  }

  function rescueLoadAppointments(){
    var ax = getAxios();
    if (!ax || !token()) return;
    var el = document.getElementById('appts-list');
    if (el) el.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading appointments...</div>';
    ax.get('/api/bookings/provider', { headers: authHeaders() })
      .then(function(res){ renderAppointments((res.data || {}).bookings || []); })
      .catch(function(){ renderAppointments([]); });
  }

  function rescueLoadServices(){
    var ax = getAxios();
    if (!ax || !token()) return;
    ax.get('/api/providers/me/services', { headers: authHeaders() })
      .then(function(res){ renderServices((res.data || {}).services || []); })
      .catch(function(){ renderServices([]); });
  }

  function rescueLoadSettings(){
    var ax = getAxios();
    if (!ax || !token()) return;
    ax.get('/api/providers/me/dashboard', { headers: authHeaders() })
      .then(function(res){
        var p = (res.data || {}).provider || {};
        function setVal(id, value){ var el = document.getElementById(id); if (el) el.value = value || ''; }
        setVal('set-business-name', p.business_name);
        setVal('set-phone', p.phone);
        setVal('set-city', p.city);
        setVal('set-address', p.address);
        setVal('set-bio', p.bio);
        setVal('set-price-min', p.price_from ? Math.round(p.price_from / 100) : '');
        setVal('set-price-max', p.price_to ? Math.round(p.price_to / 100) : '');
      })
      .catch(function(){});
  }

  window.showAddSvcForm = window.showAddSvcForm || function(){
    var f = document.getElementById('add-svc-form');
    if (!f) return;
    f.style.display = f.style.display === 'block' ? 'none' : 'block';
  };

  window.saveNewService = window.saveNewService || function(){
    var ax = getAxios();
    if (!ax || !token()) return;
    var nameEl = document.getElementById('new-svc-name');
    var priceEl = document.getElementById('new-svc-price');
    var durEl = document.getElementById('new-svc-duration');
    var descEl = document.getElementById('new-svc-desc');
    var name = nameEl ? nameEl.value.trim() : '';
    var price = priceEl ? Number(priceEl.value || 0) : 0;
    if (!name) { safeToast('Please enter a service name', 'error'); return; }
    if (!price) { safeToast('Please enter a price', 'error'); return; }
    ax.post('/api/providers/me/services', {
      name: name,
      price: Math.round(price * 100),
      duration: durEl ? Number(durEl.value || 60) : 60,
      description: descEl ? descEl.value.trim() : ''
    }, { headers: authHeaders() })
      .then(function(){ safeToast('Service added', 'success'); rescueLoadServices(); })
      .catch(function(){ safeToast('Could not add service', 'error'); });
  };

  document.addEventListener('DOMContentLoaded', function(){
    var currentUser = user();
    if (!token() || currentUser.role !== 'provider') {
      location.href = '/login';
      return;
    }
    rescueLoadDashboard();
    Array.prototype.slice.call(document.querySelectorAll('[id^="nav-"]')).forEach(function(btn){
      var id = btn.id.replace('nav-', '');
      btn.addEventListener('click', function(){ window.showSection(id, btn); });
    });
    Array.prototype.slice.call(document.querySelectorAll('[id^="mob-"]')).forEach(function(btn){
      var id = btn.id.replace('mob-', '');
      btn.addEventListener('click', function(){ window.showSection(id, document.getElementById('nav-' + id)); });
    });
  });
})();
</script>`

  if (html.includes('provider-dashboard-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}
