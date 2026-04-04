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
  .admin-table td { padding:14px 20px; border-bottom:1px solid rgba(247,242,234,0.04); font-size:13px; color:var(--t-secondary); }
  .admin-table tr:hover td { background:var(--i-ghost); }
  @media(max-width:768px){ .admin-sidebar{display:none;} }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<div class="admin-layout">

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="admin-sidebar">
    <div style="padding:22px 18px;border-bottom:1px solid var(--i-faint);display:flex;align-items:center;gap:10px;">
      <div style="width:32px;height:32px;border:1px solid var(--g-border);border-radius:9px;background:var(--g-dim);display:flex;align-items:center;justify-content:center;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--g-main)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      </div>
      <span style="font-family:'Playfair Display',serif;font-size:16px;letter-spacing:0.08em;">SALONLINK</span>
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
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${[
                {name:'Akosua Mensah',email:'akosua@example.com',role:'customer',joined:'Mar 2026',active:true},
                {name:'Kofi Asante',  email:'kofi@example.com',  role:'provider',joined:'Jan 2026',active:true},
                {name:'Demo Customer',email:'customer@demo.com', role:'customer',joined:'Apr 2026',active:true},
                {name:'Yaa Boateng',  email:'yaa@example.com',   role:'customer',joined:'Feb 2026',active:false},
                {name:'Demo Provider',email:'provider@demo.com', role:'provider',joined:'Apr 2026',active:true},
              ].map(u=>`
                <tr>
                  <td style="font-weight:600;color:var(--t-primary);">${u.name}</td>
                  <td>${u.email}</td>
                  <td><span class="badge ${u.role==='provider'?'badge-gold':'badge-pending'}" style="font-size:9px;">${u.role}</span></td>
                  <td>${u.joined}</td>
                  <td><span class="badge ${u.active?'badge-verified':'badge-error'}" style="font-size:9px;">${u.active?'Active':'Suspended'}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button onclick="showToast('User details opened','info')" class="btn-ghost" style="padding:6px 14px;font-size:10px;">View</button>
                      <button onclick="showToast('${u.active?'User suspended':'User reactivated'}','${u.active?'error':'success'}')" style="padding:6px 14px;border-radius:100px;font-size:10px;cursor:pointer;background:transparent;border:1px solid ${u.active?'rgba(192,72,72,0.3)':'rgba(61,170,110,0.3)'};color:${u.active?'var(--s-red)':'var(--s-green)'};">${u.active?'Suspend':'Restore'}</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── KYC QUEUE ── -->
      <div id="admin-kyc" class="admin-section">
        <div class="eyebrow" style="margin-bottom:24px;">KYC Verification Queue</div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${[
            {name:'Adjoa Mensah',    biz:'Glam Studio GH',     submitted:'2 hours ago',  status:'pending'},
            {name:'Kweku Sarpong',   biz:'KutzByKweku',         submitted:'5 hours ago',  status:'pending'},
            {name:'Efua Tetteh',     biz:'Efua Glam',           submitted:'1 day ago',    status:'review'},
          ].map(k=>`
            <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
              <div style="width:50px;height:50px;border-radius:16px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">🪪</div>
              <div style="flex:1;min-width:200px;">
                <div style="font-size:15px;font-weight:700;margin-bottom:3px;">${k.name}</div>
                <div style="font-size:13px;color:var(--t-secondary);">${k.biz} · Submitted ${k.submitted}</div>
              </div>
              <span class="badge badge-pending">${k.status}</span>
              <div style="display:flex;gap:10px;">
                <button onclick="showToast('Opening KYC documents for ${k.name}','info')" class="btn-ghost" style="font-size:11px;padding:8px 20px;">Review</button>
                <button onclick="this.parentElement.parentElement.style.opacity='0.4';showToast('KYC approved for ${k.name} ✓','success')" class="btn-primary" style="font-size:11px;padding:8px 22px;">Approve</button>
                <button onclick="this.parentElement.parentElement.style.opacity='0.4';showToast('KYC rejected for ${k.name}','error')" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);">Reject</button>
              </div>
            </div>
          `).join('')}
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
      <div id="admin-providers" class="admin-section"><div class="eyebrow">Providers</div><p style="color:var(--t-secondary);margin-top:16px;">Provider management panel loading...</p></div>
      <div id="admin-bookings"  class="admin-section"><div class="eyebrow">Bookings</div><p style="color:var(--t-secondary);margin-top:16px;">Booking management panel loading...</p></div>
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
          x: { grid: { color: 'rgba(247,242,234,0.04)' }, ticks: { color: '#7A6E62', font: { size: 10 } } },
          y: { grid: { color: 'rgba(247,242,234,0.04)' }, ticks: { color: '#7A6E62', font: { size: 10 }, callback: v => 'GHS ' + (v/1000) + 'K' } }
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
</script>
</body></html>`
