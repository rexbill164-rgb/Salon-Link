import { baseHead, globalScripts } from '../utils/layout'

export const adminPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Admin Panel', `
<style>
  .admin-layout { display:flex; min-height:100vh; }
  .admin-sidebar { width:240px; background:var(--c-deep); border-right:1px solid var(--i-faint); flex-shrink:0; display:flex; flex-direction:column; position:sticky; top:0; height:100vh; }
  .admin-main { flex:1; overflow:auto; min-width:0; background:var(--c-void); }
  .admin-topbar { padding:16px 32px; background:var(--c-deep); border-bottom:1px solid var(--i-faint); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .admin-section { display:none; }
  .admin-section.active { display:block; }
  .kpi { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-lg); padding:22px; position:relative; overflow:hidden; transition:border-color 0.3s; }
  .kpi:hover { border-color:var(--g-border); }
  .kpi::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--accent, var(--g-main)); }
  .admin-table { width:100%; border-collapse:collapse; }
  .admin-table th { font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--t-muted); padding:14px 20px; border-bottom:1px solid var(--i-faint); text-align:left; }
  .admin-table td { padding:14px 20px; border-bottom:1px solid var(--i-faint); font-size:13px; color:var(--t-secondary); }
  .admin-table tr:hover td { background:var(--c-raise); }
  @media(max-width:768px){ .admin-sidebar{display:none;} }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<div class="admin-layout">

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="admin-sidebar">
    <div style="padding:22px 18px;border-bottom:1px solid var(--i-faint);display:flex;align-items:center;gap:10px;">
      <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(160,120,48,0.3);">
        <i class="fas fa-star" style="color:#FFFFFF;font-size:12px;"></i>
      </div>
      <span style="font-family:'Playfair Display',serif;font-size:16px;letter-spacing:0.08em;color:var(--t-primary);">SALONLINK</span>
    </div>
    <div style="padding:12px 10px;border-bottom:1px solid var(--i-faint);">
      <div style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(192,72,72,0.08);border:1px solid rgba(192,72,72,0.2);border-radius:12px;">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(192,72,72,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;">🛡️</div>
        <div>
          <div style="font-size:12px;font-weight:700;">Admin Panel</div>
          <div style="font-size:10px;color:var(--t-muted);">Full Access</div>
        </div>
      </div>
    </div>
    <nav style="flex:1;padding:10px;overflow-y:auto;">
      ${[
        {id:'overview',  icon:'⬡',  label:'Overview'},
        {id:'users',     icon:'👥', label:'Users'},
        {id:'providers', icon:'💇', label:'Providers'},
        {id:'bookings',  icon:'📅', label:'Bookings'},
        {id:'kyc',       icon:'🪪', label:'KYC Queue'},
        {id:'payments',  icon:'💰', label:'Payments'},
        {id:'reports',   icon:'📊', label:'Reports'},
        {id:'security',  icon:'🔒', label:'Security'},
      ].map((l,i)=>`
        <button onclick="adminSection('${l.id}',this)" class="sidebar-item ${i===0?'active':''}" id="admin-nav-${l.id}">
          <span class="icon">${l.icon}</span>
          <span>${l.label}</span>
        </button>
      `).join('')}
    </nav>
    <div style="padding:10px;border-top:1px solid var(--i-faint);">
      <a href="/" class="sidebar-item"><span class="icon">🏠</span><span>Back to App</span></a>
    </div>
  </aside>

  <!-- ═══ MAIN ═══ -->
  <div class="admin-main">
    <div class="admin-topbar">
      <div>
        <div class="font-display" style="font-size:20px;font-weight:500;" id="admin-title">Platform Overview</div>
        <div style="font-size:12px;color:var(--t-muted);">SalonLink Admin · ${new Date().toLocaleDateString('en-GH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="badge badge-live" style="font-size:10px;">
          <span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:5px;"></span>
          System Healthy
        </span>
        <button onclick="showToast('5 new alerts — KYC queue has items','error')" class="btn-icon" style="position:relative;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style="position:absolute;top:8px;right:8px;width:7px;height:7px;background:var(--s-red);border-radius:50%;border:1px solid var(--c-void);"></span>
        </button>
      </div>
    </div>

    <div style="padding:32px;">

      <!-- ── OVERVIEW ── -->
      <div id="admin-overview" class="admin-section active">
        <!-- KPIs -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;">
          ${[
            {val:'12,480',label:'Total Users',     sub:'↑ 23% this month',  accent:'var(--g-main)'},
            {val:'2,406', label:'Active Providers',sub:'↑ 18% verified',    accent:'var(--s-green)'},
            {val:'48,290',label:'Total Bookings',  sub:'↑ 31% this quarter',accent:'var(--s-blue)'},
            {val:'GHS 2.4M',label:'Gross Revenue', sub:'↑ 44% YTD',        accent:'var(--g-deep)'},
          ].map(k=>`
            <div class="kpi" style="--accent:${k.accent}">
              <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;">${k.val}</div>
              <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">${k.label}</div>
              <div style="font-size:11px;color:var(--s-green);">${k.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- Charts -->
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:32px;">
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
              <div>
                <div class="eyebrow" style="margin-bottom:6px;">Platform Revenue</div>
                <div class="font-display gold-gradient" style="font-size:24px;">GHS 2.4M</div>
                <div style="font-size:11px;color:var(--s-green);">▲ 44% year to date</div>
              </div>
            </div>
            <canvas id="admin-revenue" height="120"></canvas>
          </div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
            <div class="eyebrow" style="margin-bottom:20px;">User Roles</div>
            <canvas id="admin-roles" height="160"></canvas>
            <div style="margin-top:16px;display:flex;flex-direction:column;gap:9px;">
              ${[
                {label:'Customers',val:'82%',color:'#C9A84C'},
                {label:'Providers',val:'17%',color:'#5DC98A'},
                {label:'Admins',   val:'1%', color:'#E07070'},
              ].map(s=>`
                <div style="display:flex;align-items:center;gap:8px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0;"></div>
                  <span style="font-size:12px;flex:1;">${s.label}</span>
                  <span style="font-size:12px;font-weight:700;color:${s.color};">${s.val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
          <div class="eyebrow" style="margin-bottom:20px;">Quick Actions</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            ${[
              {icon:'🔍',label:'Review KYC Queue',sub:'3 pending',action:'kyc'},
              {icon:'⚠️',label:'Fraud Alerts',    sub:'2 flagged', action:'security'},
              {icon:'📊',label:'Download Reports',sub:'CSV / PDF',  action:'reports'},
              {icon:'📢',label:'Send Broadcast',  sub:'Push to all',action:'overview'},
            ].map(a=>`
              <button onclick="adminSection('${a.action}',document.getElementById('admin-nav-${a.action}'))" style="padding:20px;border-radius:var(--r-lg);background:var(--c-raise);border:1px solid var(--i-faint);text-align:left;cursor:pointer;transition:all 0.3s;width:100%;" onmouseover="this.style.borderColor='var(--g-border)'" onmouseout="this.style.borderColor='var(--i-faint)'">
                <div style="font-size:24px;margin-bottom:10px;">${a.icon}</div>
                <div style="font-size:13px;font-weight:600;margin-bottom:3px;">${a.label}</div>
                <div style="font-size:11px;color:var(--t-muted);">${a.sub}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- ── USERS ── -->
      <div id="admin-users" class="admin-section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
          <div class="eyebrow">Manage Users</div>
          <div style="display:flex;gap:10px;">
            <input type="search" class="input" placeholder="Search users..." style="width:220px;padding:9px 16px;"/>
            <button onclick="showToast('Export initiated','info')" class="btn-outline" style="font-size:12px;padding:9px 22px;">Export CSV</button>
          </div>
        </div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody id="users-tbody">
              <tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">Loading users...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── KYC QUEUE ── -->
      <div id="admin-kyc" class="admin-section">
        <div class="eyebrow" style="margin-bottom:24px;">KYC Verification Queue</div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>Business / Provider</th><th>Email</th><th>Category</th><th>Ghana Card</th><th>Selfie</th><th>Actions</th></tr></thead>
            <tbody id="kyc-tbody"><tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">Loading KYC queue...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- ── SECURITY ── -->
      <div id="admin-security" class="admin-section">
        <div class="eyebrow" style="margin-bottom:24px;">Fraud & Security Alerts</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${[
            {type:'Cancellation Abuse',  user:'User #4821',       detail:'7 cancellations in 14 days',    severity:'high'},
            {type:'Fake Booking Pattern',user:'Provider #1204',   detail:'Unusual booking spike detected', severity:'medium'},
          ].map(a=>`
            <div style="background:${a.severity==='high'?'rgba(192,72,72,0.06)':'rgba(201,168,76,0.06)'};border:1px solid ${a.severity==='high'?'rgba(192,72,72,0.2)':'rgba(201,168,76,0.2)'};border-radius:var(--r-xl);padding:24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
              <div style="width:46px;height:46px;border-radius:14px;background:${a.severity==='high'?'rgba(192,72,72,0.15)':'rgba(201,168,76,0.12)'};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${a.severity==='high'?'🚨':'⚠️'}</div>
              <div style="flex:1;min-width:200px;">
                <div style="font-size:14px;font-weight:700;margin-bottom:3px;">${a.type}</div>
                <div style="font-size:12px;color:var(--t-secondary);">${a.user} · ${a.detail}</div>
              </div>
              <span class="badge ${a.severity==='high'?'badge-error':'badge-pending'}" style="text-transform:uppercase;">${a.severity}</span>
              <div style="display:flex;gap:8px;">
                <button onclick="showToast('Case reviewed','info')" class="btn-ghost" style="font-size:11px;padding:8px 18px;">Review</button>
                <button onclick="this.parentElement.parentElement.remove();showToast('Account suspended','error')" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);">Suspend</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── Remaining sections ── -->
      <div id="admin-providers" class="admin-section">
        <div class="eyebrow" style="margin-bottom:20px;">Manage Providers</div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>Business</th><th>Email</th><th>Category</th><th>Rating</th><th>KYC</th><th>Actions</th></tr></thead>
            <tbody id="providers-tbody"><tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
      <div id="admin-bookings" class="admin-section">
        <div class="eyebrow" style="margin-bottom:20px;">All Bookings</div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <table class="admin-table">
            <thead><tr><th>#ID</th><th>Customer</th><th>Provider</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody id="bookings-tbody"><tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
      <div id="admin-payments"  class="admin-section"><div class="eyebrow">Payments</div><p style="color:var(--t-secondary);margin-top:16px;">Payment management panel loading...</p></div>
      <div id="admin-reports"   class="admin-section"><div class="eyebrow">Reports</div><p style="color:var(--t-secondary);margin-top:16px;">Reports & analytics panel loading...</p></div>

    </div>
  </div>
</div>

${globalScripts()}
<script>
function adminSection(id, btn) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  var sec = document.getElementById('admin-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  var titles = {overview:'Platform Overview',users:'User Management',providers:'Provider Management',bookings:'Booking Management',kyc:'KYC Verification Queue',payments:'Payment Management',reports:'Reports & Analytics',security:'Security & Fraud'};
  document.getElementById('admin-title').textContent = titles[id] || id;
}

document.addEventListener('DOMContentLoaded', function() {
  if (window.Chart) {
    new Chart(document.getElementById('admin-revenue'), {
      type: 'bar',
      data: {
        labels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
        datasets: [{
          data: [280000,320000,480000,390000,520000,610000,740000],
          backgroundColor: 'rgba(201,168,76,0.25)',
          borderColor: '#C9A84C',
          borderWidth: 2,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(58,47,30,0.08)' }, ticks: { color: '#8A7A62', font: { size: 10 } } },
          y: { grid: { color: 'rgba(58,47,30,0.08)' }, ticks: { color: '#8A7A62', font: { size: 10 }, callback: v => 'GHS ' + (v/1000) + 'K' } }
        }
      }
    });
    new Chart(document.getElementById('admin-roles'), {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [82, 17, 1],
          backgroundColor: ['rgba(201,168,76,0.8)','rgba(61,170,110,0.8)','rgba(224,112,112,0.8)'],
          borderColor: 'transparent',
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '70%'
      }
    });
  }
});

// Load real admin data
(function() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!token || user.role !== 'admin') { window.location.href = '/login'; return; }
  var h = { Authorization: 'Bearer ' + token };

  // Load stats
  axios.get('/api/admin/stats', { headers: h }).then(function(res) {
    var s = res.data.stats;
    var kpis = document.querySelectorAll('.kpi');
    var vals = [s.total_users, s.total_providers, s.total_bookings, 'GHS ' + Math.round(s.total_revenue/100), s.pending_kyc, s.today_bookings];
    kpis.forEach(function(k, i) {
      var v = k.querySelector('.font-display');
      if (v && vals[i] !== undefined) v.textContent = vals[i];
    });
  }).catch(function(){});

  // Load users table
  axios.get('/api/admin/users', { headers: h }).then(function(res) {
    var tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    tbody.innerHTML = (res.data.users || []).map(function(u) {
      return '<tr>' +
        '<td>' + u.first_name + ' ' + u.last_name + '</td>' +
        '<td>' + u.email + '</td>' +
        '<td><span class="badge ' + (u.role==='admin'?'badge-error':u.role==='provider'?'badge-verified':'badge-pending') + '">' + u.role + '</span></td>' +
        '<td><span class="badge ' + (u.is_verified?'badge-verified':'badge-pending') + '">' + (u.is_verified?'Yes':'No') + '</span></td>' +
        '<td>' + new Date(u.created_at).toLocaleDateString() + '</td>' +
        '<td><button onclick="toggleUser(' + u.id + ')" class="btn-ghost" style="padding:5px 12px;font-size:10px;color:' + (u.is_active?'var(--s-red)':'var(--s-green)') + ';">' + (u.is_active?'Deactivate':'Activate') + '</button></td>' +
      '</tr>';
    }).join('');
  }).catch(function(){});

  // Load providers/KYC table
  axios.get('/api/admin/providers', { headers: h }).then(function(res) {
    var tbody = document.getElementById('providers-tbody');
    var kyctbody = document.getElementById('kyc-tbody');
    var rows = (res.data.providers || []);
    if (tbody) {
      tbody.innerHTML = rows.map(function(p) {
        return '<tr>' +
          '<td>' + p.business_name + '</td>' +
          '<td>' + p.email + '</td>' +
          '<td>' + p.service_category.replace('_',' ') + '</td>' +
          '<td>' + p.rating + ' ★</td>' +
          '<td><span class="badge ' + (p.kyc_status==='approved'?'badge-verified':'badge-pending') + '">' + p.kyc_status + '</span></td>' +
          '<td>' +
            '<button onclick="approveKyc(' + p.id + ')" class="btn-primary" style="padding:5px 12px;font-size:10px;margin-right:4px;">Approve</button>' +
            '<button onclick="rejectKyc(' + p.id + ')" style="padding:5px 12px;font-size:10px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;">Reject</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
    if (kyctbody) {
      var pending = rows.filter(function(p) { return p.kyc_status === 'pending' || p.kyc_status === 'submitted'; });
      kyctbody.innerHTML = pending.length ? pending.map(function(p) {
        var frontImg  = p.kyc_front_url  ? '<img src="' + p.kyc_front_url  + '" style="width:70px;height:45px;object-fit:cover;border-radius:6px;cursor:pointer;" onclick="viewImg(this.src,\'Ghana Card Front\')" title="Click to enlarge"/>' : '<span style="color:#bbb;font-size:11px;">Not uploaded</span>';
        var backImg   = p.kyc_back_url   ? '<img src="' + p.kyc_back_url   + '" style="width:70px;height:45px;object-fit:cover;border-radius:6px;cursor:pointer;" onclick="viewImg(this.src,\'Ghana Card Back\')" title="Click to enlarge"/>'  : '<span style="color:#bbb;font-size:11px;">Not uploaded</span>';
        var selfieImg = p.kyc_selfie_url ? '<img src="' + p.kyc_selfie_url + '" style="width:45px;height:45px;object-fit:cover;border-radius:50%;cursor:pointer;" onclick="viewImg(this.src,\'Selfie\')" title="Click to enlarge"/>'             : '<span style="color:#bbb;font-size:11px;">Not taken</span>';
        var cardNum   = p.kyc_card_number ? '<div style="font-size:10px;font-weight:700;color:#a0793c;margin-top:4px;">' + p.kyc_card_number + '</div>' : '';
        return '<tr>' +
          '<td><div style="font-weight:700;">' + (p.business_name || '—') + '</div><div style="font-size:11px;color:#888;">' + p.first_name + ' ' + p.last_name + '</div>' + cardNum + '</td>' +
          '<td style="font-size:12px;">' + p.email + '</td>' +
          '<td>' + (p.service_category||'').replace('_',' ') + '</td>' +
          '<td><div style="display:flex;gap:6px;align-items:center;">' + frontImg + backImg + '</div></td>' +
          '<td>' + selfieImg + '</td>' +
          '<td>' +
            '<button onclick="approveKyc(' + p.id + ')" class="btn-primary" style="padding:6px 14px;font-size:11px;margin-bottom:4px;display:block;width:100%;">✓ Approve</button>' +
            '<button onclick="rejectKyc(' + p.id + ')" style="padding:6px 14px;font-size:11px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;display:block;width:100%;">✗ Reject</button>' +
          '</td>' +
        '</tr>';
      }).join('') : '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">No pending KYC submissions ✦</td></tr>';
    }
  }).catch(function(){});

  // Load bookings
  axios.get('/api/admin/bookings', { headers: h }).then(function(res) {
    var tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;
    tbody.innerHTML = (res.data.bookings || []).slice(0, 50).map(function(b) {
      return '<tr>' +
        '<td>#' + b.id + '</td>' +
        '<td>' + b.customer_first_name + ' ' + b.customer_last_name + '</td>' +
        '<td>' + b.business_name + '</td>' +
        '<td>' + b.service_name + '</td>' +
        '<td>' + b.booking_date + ' ' + b.booking_time + '</td>' +
        '<td>GHS ' + Math.round(b.total_amount/100) + '</td>' +
        '<td><span class="badge ' + (b.status==='completed'?'badge-success':b.status==='confirmed'?'badge-verified':b.status==='cancelled'?'badge-error':'badge-pending') + '">' + b.status + '</span></td>' +
      '</tr>';
    }).join('');
  }).catch(function(){});
})();

function toggleUser(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/users/' + id + '/toggle', {}, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) { showToast(r.data.message + ' ✦', 'success'); setTimeout(function(){location.reload();},1000); })
    .catch(function() { showToast('Action failed', 'error'); });
}

// View KYC image in lightbox
function viewImg(src, title) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';
  overlay.onclick = function(){ document.body.removeChild(overlay); };
  overlay.innerHTML = '<div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:16px;letter-spacing:0.05em;">' + title + ' — Click anywhere to close</div>' +
    '<img src="' + src + '" style="max-width:90vw;max-height:80vh;border-radius:12px;box-shadow:0 0 60px rgba(0,0,0,0.8);"/>';
  document.body.appendChild(overlay);
}

function approveKyc(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/providers/' + id + '/kyc', { kyc_status: 'approved', is_verified: true }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Provider approved ✦', 'success'); setTimeout(function(){location.reload();},1000); })
    .catch(function() { showToast('Action failed', 'error'); });
}

function rejectKyc(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/providers/' + id + '/kyc', { kyc_status: 'rejected', is_verified: false }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Provider rejected', 'info'); setTimeout(function(){location.reload();},1000); })
    .catch(function() { showToast('Action failed', 'error'); });
}
</script>
</body></html>`
