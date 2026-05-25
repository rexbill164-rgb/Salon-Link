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
    if(id==='registrants') rescueLoadRegistrants();
    if(id==='rewards') rescueLoadRewards();
    if(id==='points') rescueLoadPoints();
    if(id==='reconcile'){ var d=q('reconcile-date'); if(d&&!d.value)d.value=new Date().toISOString().split('T')[0]; }
  };

  document.addEventListener('DOMContentLoaded',function(){
    if(!token()){ location.href='/login'; return; }
    setTimeout(function(){ var splash=q('sl-launch-splash'); if(splash&&splash.parentNode)splash.parentNode.removeChild(splash); document.documentElement.classList.remove('sl-splash-lock'); },1500);
    setTimeout(loadAdminStatsSafe,250);
  });

  // ── DIRECT RESCUE LOADERS — bypass page script issues ──
  function rescueLoadRegistrants(){
    var x = ax(); if(!x){ setTimeout(rescueLoadRegistrants, 300); return; }
    var tbody = q('registrants-tbody');
    if(tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:24px;color:#6b7280;">Loading...</td></tr>';
    x.get('/api/admin/registrants?days=3650', {headers:headers()}).then(function(r){
      var rows = (r.data && r.data.registrants) || [];
      var sum = q('reg-count-summary');
      if(sum) sum.textContent = rows.length + ' registrants';
      if(!tbody) return;
      if(!rows.length){ tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:24px;color:#6b7280;">No registrants yet.</td></tr>'; return; }
      tbody.innerHTML = rows.map(function(u){
        var when = u.created_at ? new Date(u.created_at).toLocaleDateString() : '-';
        return '<tr>' +
          '<td><div style="font-weight:600;">'+esc((u.first_name||'')+' '+(u.last_name||''))+'</div></td>' +
          '<td style="font-size:11px;color:#6b7280;">'+esc(u.email||'')+'</td>' +
          '<td style="font-size:11px;">'+esc(u.phone||'-')+'</td>' +
          '<td><span style="font-size:10px;padding:3px 8px;border-radius:100px;background:'+(u.role==='provider'?'#dbeafe':'#fef3c7')+';color:'+(u.role==='provider'?'#1e40af':'#92400e')+';font-weight:600;">'+esc(u.role||'')+'</span></td>' +
          '<td style="font-size:11px;">'+esc(u.business_name||'-')+'</td>' +
          '<td>'+(u.is_verified ? '<span style="color:#059669;">✓</span>' : '<span style="color:#9ca3af;">—</span>')+'</td>' +
          '<td>'+(u.kyc_status ? esc(u.kyc_status) : '-')+'</td>' +
          '<td style="font-size:11px;color:#6b7280;">'+when+'</td>' +
        '</tr>';
      }).join('');
    }).catch(function(){
      if(tbody) tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:24px;color:#dc2626;">Could not load. Please refresh.</td></tr>';
    });
  }

  function rescueLoadRewards(){
    var x = ax(); if(!x){ setTimeout(rescueLoadRewards, 300); return; }
    var el = q('rewards-list');
    if(el) el.innerHTML = '<div style="text-align:center;padding:24px;color:#6b7280;">Loading...</div>';
    x.get('/api/admin/reward-items', {headers:headers()}).then(function(r){
      var items = (r.data && r.data.items) || [];
      if(!el) return;
      if(!items.length){ el.innerHTML='<div style="text-align:center;padding:24px;color:#6b7280;">No reward items yet. Click "+ Add Reward Item" above.</div>'; return; }
      el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">' +
        items.map(function(it){
          var img = it.image_url ? '<img src="'+esc(it.image_url)+'" style="width:100%;height:120px;object-fit:cover;border-radius:12px 12px 0 0;" />' :
            '<div style="width:100%;height:120px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:36px;border-radius:12px 12px 0 0;">🎁</div>';
          return '<div style="border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;background:#fff;">' + img +
            '<div style="padding:12px;">' +
              '<div style="font-size:13px;font-weight:700;color:#111;margin-bottom:4px;">'+esc(it.name)+'</div>' +
              '<div style="font-size:11px;color:#6b7280;margin-bottom:8px;min-height:28px;">'+esc(it.description||'')+'</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<span style="font-size:13px;font-weight:800;color:#C9A84C;">⭐ '+num(it.points_required)+' pts</span>' +
                '<button onclick="window.deleteRewardItem&&window.deleteRewardItem('+it.id+')" style="padding:4px 10px;border-radius:8px;border:none;background:#fee2e2;color:#dc2626;font-size:10px;font-weight:700;cursor:pointer;">Delete</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') + '</div>';
    }).catch(function(){
      if(el) el.innerHTML='<div style="text-align:center;padding:24px;color:#dc2626;">Could not load rewards.</div>';
    });
  }

  function rescueLoadPoints(){
    var x = ax(); if(!x){ setTimeout(rescueLoadPoints, 300); return; }
    var sel = q('pts-provider');
    if(sel) sel.innerHTML = '<option value="">Loading...</option>';
    x.get('/api/admin/providers', {headers:headers()}).then(function(r){
      var providers = (r.data && r.data.providers) || [];
      providers = providers.filter(function(p){ return p.is_verified; });
      if(!sel) return;
      if(!providers.length){ sel.innerHTML='<option value="">No providers</option>'; return; }
      sel.innerHTML = '<option value="">Select provider...</option>' +
        providers.map(function(p){ return '<option value="'+p.id+'">'+esc(p.business_name)+' ('+esc(p.email||'')+')</option>'; }).join('');
    }).catch(function(){
      if(sel) sel.innerHTML='<option value="">Error loading — refresh page</option>';
    });
    var board = q('points-leaderboard');
    if(board) board.innerHTML = '<div style="text-align:center;padding:24px;color:#6b7280;">Loading...</div>';
    x.get('/api/admin/providers/points', {headers:headers()}).then(function(r){
      var providers = (r.data && r.data.providers) || [];
      if(!board) return;
      if(!providers.length){ board.innerHTML='<div style="color:#6b7280;font-size:13px;padding:12px;">No providers with points yet.</div>'; return; }
      board.innerHTML = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f9fafb;"><th style="padding:10px;text-align:left;font-size:11px;color:#6b7280;font-weight:700;">#</th><th style="padding:10px;text-align:left;font-size:11px;color:#6b7280;font-weight:700;">Provider</th><th style="padding:10px;text-align:left;font-size:11px;color:#6b7280;font-weight:700;">Email</th><th style="padding:10px;text-align:left;font-size:11px;color:#6b7280;font-weight:700;">Points</th></tr></thead><tbody>' +
        providers.map(function(p,i){
          return '<tr style="border-top:1px solid #e5e7eb;"><td style="padding:10px;font-weight:700;">'+(i+1)+'</td><td style="padding:10px;">'+esc(p.business_name)+'</td><td style="padding:10px;color:#6b7280;">'+esc(p.email||'')+'</td><td style="padding:10px;font-weight:800;color:#C9A84C;">⭐ '+num(p.loyalty_points)+'</td></tr>';
        }).join('') + '</tbody></table></div>';
    }).catch(function(){
      if(board) board.innerHTML='<div style="color:#dc2626;font-size:13px;padding:12px;">Could not load leaderboard.</div>';
    });
  }


  // ── REWARD MODAL — works regardless of page script ──
  function buildRewardModal(){
    if(q('sl-rescue-reward-modal')) return;
    var m = document.createElement('div');
    m.id = 'sl-rescue-reward-modal';
    m.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;align-items:center;justify-content:center;padding:20px;';
    m.innerHTML = '<div style="background:#fff;border-radius:18px;padding:20px;max-width:440px;width:100%;max-height:90vh;overflow-y:auto;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
        '<h3 style="margin:0;font-size:16px;font-weight:800;">Add Reward Item</h3>' +
        '<button onclick="document.getElementById(\'sl-rescue-reward-modal\').style.display=\'none\'" style="background:none;border:none;font-size:24px;color:#6b7280;cursor:pointer;line-height:1;">×</button>' +
      '</div>' +
      '<div style="margin-bottom:12px;">' +
        '<label style="font-size:11px;font-weight:700;color:#6b7280;display:block;margin-bottom:6px;">NAME *</label>' +
        '<input id="sl-rwd-name" type="text" placeholder="e.g. Hair Dryer" style="width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;box-sizing:border-box;"/>' +
      '</div>' +
      '<div style="margin-bottom:12px;">' +
        '<label style="font-size:11px;font-weight:700;color:#6b7280;display:block;margin-bottom:6px;">DESCRIPTION</label>' +
        '<textarea id="sl-rwd-desc" rows="2" placeholder="Brief description..." style="width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;box-sizing:border-box;resize:vertical;"></textarea>' +
      '</div>' +
      '<div style="margin-bottom:12px;">' +
        '<label style="font-size:11px;font-weight:700;color:#6b7280;display:block;margin-bottom:6px;">POINTS REQUIRED *</label>' +
        '<input id="sl-rwd-points" type="number" placeholder="e.g. 100" style="width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;box-sizing:border-box;"/>' +
      '</div>' +
      '<div style="margin-bottom:14px;">' +
        '<label style="font-size:11px;font-weight:700;color:#6b7280;display:block;margin-bottom:6px;">IMAGE</label>' +
        '<label style="display:inline-block;padding:8px 16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;color:#1d4ed8;font-size:12px;font-weight:600;cursor:pointer;">📷 Upload Image' +
          '<input id="sl-rwd-file" type="file" accept="image/*" style="display:none;" onchange="window.slRwdPreview(this)"/>' +
        '</label>' +
        '<canvas id="sl-rwd-canvas" style="display:none;"></canvas>' +
        '<img id="sl-rwd-preview" style="display:none;width:100%;max-height:160px;object-fit:cover;border-radius:10px;margin-top:10px;border:1px solid #e5e7eb;"/>' +
        '<input id="sl-rwd-image-url" type="hidden" value=""/>' +
      '</div>' +
      '<div style="display:flex;gap:10px;">' +
        '<button onclick="document.getElementById(\'sl-rescue-reward-modal\').style.display=\'none\'" style="flex:1;padding:11px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;color:#374151;font-size:13px;font-weight:600;cursor:pointer;">Cancel</button>' +
        '<button onclick="window.slRwdSave()" style="flex:1;padding:11px;border:none;border-radius:10px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">Save Item</button>' +
      '</div>' +
    '</div>';
    document.body.appendChild(m);
  }

  window.slRwdPreview = function(input){
    var file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('Image too large (max 2MB)', 'error'); input.value=''; return; }
    var reader = new FileReader();
    reader.onload = function(e){
      var img = new Image();
      img.onload = function(){
        try {
          var canvas = q('sl-rwd-canvas');
          var maxSize = 400;
          var ratio = Math.min(maxSize/img.width, maxSize/img.height, 1);
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var compressed = canvas.toDataURL('image/jpeg', 0.6);
          var prev = q('sl-rwd-preview');
          if (prev) { prev.src = compressed; prev.style.display = 'block'; }
          q('sl-rwd-image-url').value = compressed;
        } catch(err) {
          q('sl-rwd-image-url').value = e.target.result;
          var prev = q('sl-rwd-preview');
          if (prev) { prev.src = e.target.result; prev.style.display = 'block'; }
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  window.slRwdSave = function(){
    var name = (q('sl-rwd-name')||{}).value || '';
    var desc = (q('sl-rwd-desc')||{}).value || '';
    var points = parseInt((q('sl-rwd-points')||{}).value) || 0;
    var imgUrl = (q('sl-rwd-image-url')||{}).value || '';
    if (!name.trim()) { toast('Name is required', 'error'); return; }
    if (!points || points <= 0) { toast('Points required must be a positive number', 'error'); return; }
    var x = ax(); if (!x) { toast('Loading... try again', 'error'); return; }
    var btns = document.querySelectorAll('#sl-rescue-reward-modal button');
    Array.prototype.forEach.call(btns, function(b){ b.disabled = true; });
    x.post('/api/admin/reward-items', {
      name: name.trim(), description: desc.trim(), points_required: points, image_url: imgUrl || null, is_available: true
    }, { headers: headers() }).then(function(){
      toast('Reward item added ✓', 'success');
      q('sl-rescue-reward-modal').style.display = 'none';
      q('sl-rwd-name').value = '';
      q('sl-rwd-desc').value = '';
      q('sl-rwd-points').value = '';
      q('sl-rwd-image-url').value = '';
      q('sl-rwd-preview').style.display = 'none';
      rescueLoadRewards();
    }).catch(function(e){
      var msg = (e && e.response && e.response.data && e.response.data.error) || 'Could not save';
      toast(msg, 'error');
    }).finally(function(){
      Array.prototype.forEach.call(btns, function(b){ b.disabled = false; });
    });
  };

  window.deleteRewardItem = function(id){
    if (!confirm('Delete this reward item?')) return;
    var x = ax(); if (!x) return;
    x.delete('/api/admin/reward-items/' + id, { headers: headers() })
      .then(function(){ toast('Deleted', 'success'); rescueLoadRewards(); })
      .catch(function(){ toast('Could not delete', 'error'); });
  };

  // Override openAddRewardModal to use our rescue modal
  window.openAddRewardModal = function(){
    buildRewardModal();
    q('sl-rescue-reward-modal').style.display = 'flex';
  };

})();
</script>`

  if (html.includes('admin-dashboard-static-rescue')) return html
  return html.replace('</body>', script + '</body>')
}