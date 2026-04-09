import { baseHead, globalScripts } from '../utils/layout'

export const providerDashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Dashboard', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  .dash-layout { display:flex; min-height:100vh; }
  .sidebar { width:260px; background:var(--c-deep); border-right:1px solid var(--i-faint); flex-shrink:0; display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .main-area { flex:1; overflow:auto; min-width:0; }
  .topbar { padding:16px 36px; background:var(--c-deep); border-bottom:1px solid var(--i-faint); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; backdrop-filter:blur(20px); }
  .section { display:none; }
  .section.active { display:block; }
  .kpi-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-lg); padding:24px; position:relative; overflow:hidden; transition:all 0.3s var(--ease-luxury); }
  .kpi-card:hover { border-color:var(--g-border); transform:translateY(-3px); }
  .kpi-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .kpi-card:nth-child(1)::after { background:linear-gradient(90deg, var(--g-main), var(--g-light)); }
  .kpi-card:nth-child(2)::after { background:linear-gradient(90deg, var(--s-green), #7DD4A4); }
  .kpi-card:nth-child(3)::after { background:linear-gradient(90deg, var(--s-blue), #7AA0E0); }
  .kpi-card:nth-child(4)::after { background:linear-gradient(90deg, var(--g-deep), var(--g-main)); }
  .appt-row { display:flex; align-items:center; gap:16px; padding:16px 20px; border-radius:14px; transition:background 0.2s; cursor:pointer; }
  .appt-row:hover { background:var(--i-ghost); }
  .mini-avatar { width:42px; height:42px; border-radius:14px; background:linear-gradient(135deg,var(--c-mist),var(--g-dim)); border:1px solid var(--g-border); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:17px; color:var(--g-main); flex-shrink:0; }
  @media(max-width:768px){ .sidebar{display:none;} }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<div class="dash-layout">

  <!-- ═══════════════ SIDEBAR ═══════════════ -->
  <aside class="sidebar">
    <!-- Logo -->
    <div style="padding:24px 20px;border-bottom:1px solid var(--i-faint);">
      <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(160,120,48,0.3);">
          <i class="fas fa-star" style="color:#FFFFFF;font-size:12px;"></i>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:17px;letter-spacing:0.08em;color:var(--t-primary);">SALONLINK</span>
      </a>
    </div>

    <!-- Provider info -->
    <div style="padding:16px 20px;border-bottom:1px solid var(--i-faint);">
      <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:14px;">
        <div style="width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">💇‍♀️</div>
        <div style="min-width:0;">
          <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" id="sb-name">Glam Studio GH</div>
          <span class="badge badge-verified" style="font-size:9px;margin-top:4px;display:inline-flex;">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4"/></svg> Verified
          </span>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav style="flex:1;padding:12px;overflow-y:auto;">
      ${[
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',  label:'Overview',     id:'overview'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', label:'Appointments', id:'appts'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', label:'Clients',       id:'clients'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',                             label:'Style History', id:'styles'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',                                      label:'Reviews',      id:'reviews'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',                                               label:'Earnings',     id:'earnings'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',                                                         label:'KYC Status',   id:'kyc'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>', label:'My Gallery',   id:'gallery'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',  label:'Platform Fees', id:'fees'},
        {icon:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2"/></svg>', label:'Settings',     id:'settings'},
      ].map((l,i)=>`
        <button onclick="showSection('${l.id}',this)" class="sidebar-item ${i===0?'active':''}" id="nav-${l.id}">
          <span class="icon">${l.icon}</span>
          <span>${l.label}</span>
        </button>
      `).join('')}
    </nav>

    <!-- Bottom -->
    <div style="padding:12px;border-top:1px solid var(--i-faint);">
      <a href="/provider/1" class="sidebar-item">
        <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
        <span>View Public Profile</span>
      </a>
      <button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;">
        <span class="icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>

  <!-- ═══════════════ MAIN ═══════════════ -->
  <div class="main-area">

    <!-- Topbar -->
    <div class="topbar">
      <div>
        <div class="font-display" style="font-size:20px;font-weight:500;" id="sec-title">Overview</div>
        <div style="font-size:12px;color:var(--t-muted);">Provider Dashboard</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="badge badge-live">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#5DC98A;margin-right:5px;animation:pulse-ring 2s infinite;"></span>
          Accepting Bookings
        </span>
        <button onclick="showToast('3 new notifications','info')" class="btn-icon" style="position:relative;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style="position:absolute;top:9px;right:9px;width:6px;height:6px;background:var(--g-main);border-radius:50%;"></span>
        </button>
      </div>
    </div>

    <div style="padding:36px;">

      <!-- ── OVERVIEW ── -->
      <div id="sec-overview" class="section active">

        <!-- Pending approval banner (shown only for unverified providers) -->
        <div id="pending-approval-banner" style="display:none;background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.06));border:1px solid rgba(201,168,76,0.35);border-radius:16px;padding:20px 24px;margin-bottom:28px;display:none;">
          <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
            <span style="font-size:28px;flex-shrink:0;">⏳</span>
            <div style="flex:1;min-width:200px;">
              <div style="font-size:15px;font-weight:700;color:var(--t-primary);margin-bottom:6px;">Pending Admin Approval</div>
              <div style="font-size:13px;color:var(--t-secondary);line-height:1.7;margin-bottom:12px;">
                Your profile is set up and ready. Customers will be able to find and book you once an admin approves your account. While you wait, you can update your services, upload photos, and set your location.
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="showSection('gallery',null)" style="padding:8px 18px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;background:var(--g-main);color:white;border:none;">📸 Upload Photos</button>
                <button onclick="showSection('settings',null)" style="padding:8px 18px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;border:1.5px solid var(--g-border);color:var(--g-deep);">⚙️ Edit Profile</button>
              </div>
            </div>
          </div>
        </div>

        <!-- KPI Row -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:36px;">
          ${[
            {label:"Today's Bookings",val:'6',  sub:'+2 from yesterday',    icon:'📅'},
            {label:'Week Revenue',    val:'GHS 2,480', sub:'+18% this week',icon:'💰'},
            {label:'Total Clients',   val:'248',sub:'12 new this month',    icon:'👥'},
            {label:'Avg Rating',      val:'4.9',sub:'Based on 128 reviews', icon:'⭐'},
          ].map(k=>`
            <div class="kpi-card">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
                <span style="font-size:22px;">${k.icon}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--s-green)" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
              </div>
              <div class="font-display gold-gradient" style="font-size:30px;margin-bottom:4px;">${k.val}</div>
              <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">${k.label}</div>
              <div style="font-size:11px;color:var(--s-green);">${k.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- Charts row -->
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:36px;">
          <!-- Revenue chart -->
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
              <div>
                <div class="eyebrow" style="margin-bottom:6px;">Revenue Trend</div>
                <div class="font-display gold-gradient" style="font-size:28px;">GHS 12,680</div>
                <div style="font-size:11px;color:var(--s-green);">▲ 23% vs last month</div>
              </div>
              <div style="display:flex;gap:8px;">
                ${['7D','30D','3M'].map((p,i)=>`<button onclick="setRange('${p}')" style="padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;background:${i===1?'var(--g-dim)':'var(--c-raise)'};border:${i===1?'1px solid var(--g-border)':'1px solid var(--i-faint)'};color:${i===1?'var(--g-main)':'var(--t-secondary)'};">${p}</button>`).join('')}
              </div>
            </div>
            <canvas id="revenue-chart" height="120"></canvas>
          </div>
          <!-- Booking status donut -->
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
            <div class="eyebrow" style="margin-bottom:20px;">Booking Status</div>
            <canvas id="status-chart" height="180"></canvas>
            <div style="margin-top:16px;display:flex;flex-direction:column;gap:9px;">
              ${[
                {label:'Confirmed',val:68,color:'#5DC98A'},
                {label:'Pending',  val:20,color:'#C9A84C'},
                {label:'Cancelled',val:12,color:'#E07070'},
              ].map(s=>`
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${s.color};flex-shrink:0;"></div>
                  <span style="font-size:12px;flex:1;">${s.label}</span>
                  <span style="font-size:12px;font-weight:700;color:${s.color};">${s.val}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Today's appointments -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <div class="eyebrow">Today's Appointments</div>
            <button onclick="showSection('appts',document.getElementById('nav-appts'))" class="btn-ghost" style="padding:8px 18px;font-size:11px;">View All</button>
          </div>
          <div id="today-appts">
          ${[
            {time:'9:00 AM', name:'Akosua Mensah',  service:'Natural Twist',    status:'confirmed', price:'GHS 80'},
            {time:'11:30 AM',name:'Efua Tetteh',    service:'Box Braids',       status:'confirmed', price:'GHS 200'},
            {time:'2:00 PM', name:'Ama Darko',      service:'Silk Press',       status:'pending',   price:'GHS 120'},
            {time:'4:00 PM', name:'Abena Owusu',    service:'Loc Retwist',      status:'confirmed', price:'GHS 100'},
          ].map(a=>`
            <div class="appt-row">
              <div class="mini-avatar">${a.name[0]}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${a.name}</div>
                <div style="font-size:12px;color:var(--t-muted);">${a.service}</div>
              </div>
              <div style="text-align:center;min-width:80px;">
                <div style="font-size:12px;font-weight:700;color:var(--g-main);">${a.time}</div>
              </div>
              <span class="badge ${a.status==='confirmed'?'badge-verified':'badge-pending'}">${a.status}</span>
              <span class="font-display" style="font-size:16px;color:var(--g-main);min-width:70px;text-align:right;">${a.price}</span>
            </div>
          `).join('')}
          </div>
        </div>

        <!-- Recent reviews -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
          <div class="eyebrow" style="margin-bottom:22px;">Recent Reviews</div>
          ${[
            {name:'Akosua M.',rating:5,text:'Perfect silk press, exactly what I wanted!',date:'2h ago'},
            {name:'Efua T.',  rating:5,text:'Absolutely love the box braids, came out amazing.',date:'Yesterday'},
          ].map(r=>`
            <div style="padding:16px 0;border-bottom:1px solid var(--i-faint);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div class="mini-avatar" style="width:34px;height:34px;border-radius:10px;font-size:14px;">${r.name[0]}</div>
                  <span style="font-size:13px;font-weight:600;">${r.name}</span>
                  <span class="stars" style="font-size:12px;">${'★'.repeat(r.rating)}</span>
                </div>
                <span style="font-size:11px;color:var(--t-faint);">${r.date}</span>
              </div>
              <p style="font-size:12px;color:var(--t-secondary);font-style:italic;">"${r.text}"</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── APPOINTMENTS ── -->
      <div id="sec-appts" class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
          <div class="eyebrow">All Appointments</div>
          <div style="display:flex;gap:10px;">
            ${['All','Today','Pending','Confirmed','Completed'].map((s,i)=>`<button onclick="filterAppts(this,'${s}')" style="padding:8px 18px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;background:${i===0?'var(--g-dim)':'transparent'};border:${i===0?'1px solid var(--g-border)':'1px solid var(--i-faint)'};color:${i===0?'var(--g-main)':'var(--t-secondary)'};">${s}</button>`).join('')}
          </div>
        </div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <table class="table-luxury">
            <thead>
              <tr><th>Client</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              ${[
                {client:'Akosua Mensah',  svc:'Natural Twist',    dt:'Apr 5 · 9:00 AM',  amt:'GHS 80',  status:'confirmed'},
                {client:'Efua Tetteh',    svc:'Box Braids',       dt:'Apr 5 · 11:30 AM', amt:'GHS 200', status:'confirmed'},
                {client:'Ama Darko',      svc:'Silk Press',       dt:'Apr 5 · 2:00 PM',  amt:'GHS 120', status:'pending'},
                {client:'Abena Owusu',    svc:'Loc Retwist',      dt:'Apr 6 · 10:00 AM', amt:'GHS 100', status:'confirmed'},
                {client:'Kofi Asante',    svc:'Colour Treatment', dt:'Apr 6 · 1:00 PM',  amt:'GHS 180', status:'pending'},
                {client:'Yaa Boateng',    svc:'Natural Twist',    dt:'Apr 7 · 9:00 AM',  amt:'GHS 80',  status:'completed'},
              ].map(a=>`
                <tr>
                  <td style="font-weight:600;color:var(--t-primary);">${a.client}</td>
                  <td>${a.svc}</td>
                  <td style="color:var(--g-main);font-weight:600;">${a.dt}</td>
                  <td class="font-display" style="color:var(--g-main);">${a.amt}</td>
                  <td><span class="badge ${a.status==='confirmed'?'badge-verified':a.status==='completed'?'badge-success':'badge-pending'}">${a.status}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      ${a.status==='pending'?'<button onclick="showToast(\'Appointment confirmed ✓\',\'success\')" class="btn-ghost" style="padding:6px 12px;font-size:10px;">Confirm</button>':''}
                      <button onclick="showToast(\'Details opened\',\'info\')" class="btn-icon" style="width:32px;height:32px;border-radius:8px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── STYLE HISTORY ── -->
      <div id="sec-styles" class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
          <div class="eyebrow">Client Style History</div>
          <button onclick="showToast('Upload feature coming soon','info')" class="btn-primary" style="padding:10px 24px;font-size:12px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload Style Photo
          </button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
          ${['💇‍♀️','🌿','✨','💅','🎀','👑','🌺','💫','🦋','🌸','🍀','⭐'].map((e,i)=>`
            <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);overflow:hidden;cursor:pointer;transition:all 0.35s var(--ease-luxury);" onmouseover="this.style.borderColor='var(--g-border)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.transform='none'">
              <div style="aspect-ratio:1;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));display:flex;align-items:center;justify-content:center;font-size:48px;">${e}</div>
              <div style="padding:12px;">
                <div style="font-size:12px;font-weight:600;margin-bottom:3px;">Style ${i+1}</div>
                <div style="font-size:10px;color:var(--t-muted);">${['Akosua M.','Efua T.','Ama D.','Abena O.','Kofi A.','Yaa B.','Akua A.','Serwa B.','Adwoa C.','Afua D.','Ama E.','Akua F.'][i]} · ${Math.floor(Math.random()*20)+1} days ago</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── EARNINGS ── -->
      <div id="sec-earnings" class="section">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:36px;">
          ${[
            {label:'Total Earned',val:'GHS 48,240',sub:'All time'},
            {label:'This Month',  val:'GHS 4,680', sub:'+23% vs last month'},
            {label:'Pending Payout',val:'GHS 2,480',sub:'Releases Friday'},
          ].map(k=>`
            <div class="kpi-card">
              <div class="font-display gold-gradient" style="font-size:32px;margin-bottom:6px;">${k.val}</div>
              <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">${k.label}</div>
              <div style="font-size:11px;color:var(--t-secondary);margin-top:4px;">${k.sub}</div>
            </div>
          `).join('')}
        </div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
          <div class="eyebrow" style="margin-bottom:22px;">Recent Transactions</div>
          ${[
            {name:'Akosua M.',svc:'Natural Twist',date:'Today',amt:'+GHS 80', status:'paid'},
            {name:'Efua T.',  svc:'Box Braids',   date:'Today',amt:'+GHS 200',status:'paid'},
            {name:'Ama D.',   svc:'Silk Press',   date:'Apr 4', amt:'+GHS 120',status:'paid'},
            {name:'Kofi A.',  svc:'Loc Retwist',  date:'Apr 3', amt:'+GHS 100',status:'paid'},
          ].map(t=>`
            <div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--i-faint);">
              <div class="mini-avatar">${t.name[0]}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:600;">${t.name}</div>
                <div style="font-size:12px;color:var(--t-muted);">${t.svc} · ${t.date}</div>
              </div>
              <span style="font-size:15px;font-weight:700;color:var(--s-green);">${t.amt}</span>
              <span class="badge badge-verified" style="font-size:9px;">${t.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── KYC ── -->
      <div id="sec-kyc" class="section">
        <div style="max-width:560px;">
          <div style="background:rgba(61,170,110,0.08);border:1px solid rgba(61,170,110,0.25);border-radius:var(--r-xl);padding:32px;margin-bottom:24px;">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
              <div style="width:52px;height:52px;border-radius:16px;background:rgba(61,170,110,0.15);display:flex;align-items:center;justify-content:center;font-size:24px;">✓</div>
              <div>
                <div style="font-size:18px;font-weight:700;color:#5DC98A;margin-bottom:4px;">Identity Verified</div>
                <div style="font-size:13px;color:var(--t-secondary);">Your Ghana Card has been verified via Smile Identity</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
              ${[
                {label:'Full Name',val:'Adjoa Mensah',verified:true},
                {label:'Ghana Card',val:'GHA-XXXX-XXXX',verified:true},
                {label:'Facial Match',val:'98.2% confidence',verified:true},
                {label:'Phone',val:'+233 24 000 0000',verified:true},
              ].map(f=>`
                <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(61,170,110,0.05);border-radius:10px;">
                  <span style="font-size:12px;color:var(--t-secondary);">${f.label}</span>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:13px;font-weight:600;">${f.val}</span>
                    <span class="badge badge-verified" style="font-size:9px;">✓</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
            <div class="eyebrow" style="margin-bottom:16px;">Verification Timeline</div>
            ${[
              {step:'Account Created',date:'Mar 15, 2025',done:true},
              {step:'Ghana Card Uploaded',date:'Mar 15, 2025',done:true},
              {step:'Facial Scan Completed',date:'Mar 15, 2025',done:true},
              {step:'KYC Approved',date:'Mar 16, 2025',done:true},
            ].map(s=>`
              <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
                <div style="width:24px;height:24px;border-radius:50%;background:${s.done?'var(--s-green)':'var(--c-raise)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;color:white;">${s.done?'✓':''}</div>
                <div style="flex:1;font-size:13px;">${s.step}</div>
                <div style="font-size:11px;color:var(--t-muted);">${s.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- ── GALLERY ── -->
      <div id="sec-gallery" class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
          <div>
            <div class="eyebrow">My Gallery</div>
            <div style="font-size:12px;color:var(--t-muted);margin-top:4px;" id="gallery-count-label">Free plan: 0/5 images</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button onclick="triggerLogoUpload()" class="btn-ghost" style="padding:10px 20px;font-size:12px;">
              📸 Upload Logo
            </button>
            <button onclick="triggerGalleryUpload()" class="btn-primary" style="padding:10px 20px;font-size:12px;" id="upload-gallery-btn">
              ➕ Add Photo
            </button>
          </div>
        </div>

        <!-- Pro Banner (hidden if already pro) -->
        <div id="pro-banner" style="background:linear-gradient(135deg,rgba(193,68,178,0.12),rgba(131,58,180,0.12));border:1px solid rgba(193,68,178,0.3);border-radius:16px;padding:20px 24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px;">🚀 Upgrade to Gallery Pro</div>
            <div style="font-size:12px;color:var(--t-secondary);">Upload up to <strong>10 photos</strong> · GHS 10/month · Attract more customers</div>
          </div>
          <button onclick="upgradeGallery()" style="background:linear-gradient(135deg,#833ab4,#c144b2);color:white;border:none;padding:10px 22px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;">
            Upgrade Now – GHS 10/month
          </button>
        </div>

        <!-- Logo Preview -->
        <div style="margin-bottom:28px;">
          <div style="font-size:12px;font-weight:600;color:var(--t-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">Business Logo</div>
          <div id="logo-preview" style="width:120px;height:120px;border-radius:16px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;" onclick="triggerLogoUpload()">
            <div style="text-align:center;color:var(--t-muted);">
              <div style="font-size:28px;margin-bottom:6px;">📷</div>
              <div style="font-size:10px;">Add Logo</div>
            </div>
          </div>
        </div>

        <!-- Gallery Grid -->
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--t-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">Salon Photos</div>
          <div id="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;">
            <!-- Add new photo slot -->
            <div onclick="triggerGalleryUpload()" style="aspect-ratio:1;border-radius:16px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--g-border)'" onmouseout="this.style.borderColor='var(--i-faint)'">
              <div style="font-size:28px;margin-bottom:8px;">➕</div>
              <div style="font-size:11px;color:var(--t-muted);">Add Photo</div>
            </div>
          </div>
        </div>

        <!-- Hidden file inputs -->
        <input type="file" id="logo-input" accept="image/*" style="display:none" onchange="handleLogoUpload(this)">
        <input type="file" id="gallery-input" accept="image/*" style="display:none" onchange="handleGalleryUpload(this)">
      </div>

      <!-- ── PLATFORM FEES ── -->
      <div id="sec-fees" class="section">
        <div style="margin-bottom:28px;">
          <div class="eyebrow">Platform Service Fees</div>
          <div style="font-size:12px;color:var(--t-muted);margin-top:6px;">GHS 3 is charged per booking. Fees are due by midnight of the booking day.</div>
        </div>

        <!-- Fee Summary Cards -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;">
          <div class="kpi-card">
            <div style="font-size:22px;margin-bottom:10px;">⏳</div>
            <div class="font-display gold-gradient" style="font-size:28px;" id="fees-pending-amt">GHS 0</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">Pending Fees</div>
          </div>
          <div class="kpi-card">
            <div style="font-size:22px;margin-bottom:10px;">✅</div>
            <div class="font-display" style="font-size:28px;color:var(--s-green);" id="fees-paid-amt">GHS 0</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">Total Paid</div>
          </div>
          <div class="kpi-card">
            <div style="font-size:22px;margin-bottom:10px;">📋</div>
            <div class="font-display" style="font-size:28px;color:var(--t-primary);" id="fees-total-count">0</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">Total Bookings</div>
          </div>
        </div>

        <!-- Warning about pending fees -->
        <div id="fees-warning" style="display:none;background:rgba(224,112,112,0.1);border:1px solid rgba(224,112,112,0.3);border-radius:12px;padding:16px 20px;margin-bottom:24px;">
          <div style="font-size:13px;font-weight:700;color:var(--s-red);margin-bottom:4px;">⚠️ Pending Fees Due Tonight</div>
          <div style="font-size:12px;color:var(--t-secondary);">You have unpaid platform fees due by midnight. Please contact admin to settle your balance to avoid service interruption.</div>
        </div>

        <!-- Fee Table -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;">
          <div style="padding:20px 24px;border-bottom:1px solid var(--i-faint);display:flex;justify-content:space-between;align-items:center;">
            <div class="eyebrow">Fee History</div>
            <span style="font-size:11px;color:var(--t-muted);">GHS 3 per booking</span>
          </div>
          <div id="fees-table-body" style="padding:16px;">
            <div style="text-align:center;color:var(--t-muted);padding:32px;">Loading fee history...</div>
          </div>
        </div>
      </div>

      <!-- ── Other sections (clients, reviews, settings) ── -->
      <div id="sec-clients"  class="section"><div class="eyebrow">Clients</div><p style="color:var(--t-secondary);margin-top:16px;">Client management coming soon.</p></div>
      <div id="sec-reviews"  class="section"><div class="eyebrow">Reviews</div><p style="color:var(--t-secondary);margin-top:16px;">Review management coming soon.</p></div>
      <!-- ── SETTINGS / LOCATION ── -->
      <div id="sec-settings" class="section">
        <div class="eyebrow" style="margin-bottom:24px;">Profile & Location Settings</div>

        <!-- Services Manager -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div>
              <div style="font-size:15px;font-weight:700;">My Services</div>
              <div style="font-size:12px;color:var(--t-muted);margin-top:3px;">Add or remove the services you offer</div>
            </div>
            <button onclick="showAddServiceForm()" class="btn-primary" style="padding:9px 20px;font-size:12px;">+ Add Service</button>
          </div>
          <!-- Add service form (hidden by default) -->
          <div id="add-svc-form" style="display:none;background:var(--c-raise);border:1px solid var(--i-faint);border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="display:grid;grid-template-columns:1fr 120px 130px;gap:10px;margin-bottom:12px;">
              <input type="text" id="new-svc-name" class="input" placeholder="Service name" style="font-size:13px;" />
              <input type="number" id="new-svc-price" class="input" placeholder="GHS price" min="1" style="font-size:13px;" />
              <input type="number" id="new-svc-duration" class="input" placeholder="Duration (mins)" value="60" min="10" step="5" style="font-size:13px;" />
            </div>
            <div style="display:flex;gap:10px;">
              <button onclick="saveNewService()" class="btn-primary" style="padding:9px 20px;font-size:12px;">Save Service</button>
              <button onclick="document.getElementById('add-svc-form').style.display='none'" class="btn-ghost" style="padding:9px 20px;font-size:12px;">Cancel</button>
            </div>
          </div>
          <div id="my-services-list">
            <div style="text-align:center;color:var(--t-muted);padding:20px;">Loading services...</div>
          </div>
        </div>

        <!-- Location Picker -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
          <div style="font-size:15px;font-weight:700;margin-bottom:6px;">📍 Your Business Location</div>
          <div style="font-size:12px;color:var(--t-muted);margin-bottom:16px;">Pin your exact location so customers can find you. Click on the map or use the button below.</div>
          <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
            <button onclick="useMyLocation()" style="padding:10px 20px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#833ab4,#e1306c);color:white;border:none;">
              📍 Use My Current Location
            </button>
            <button onclick="saveLocation()" class="btn-primary" style="padding:10px 20px;font-size:12px;" id="save-location-btn" disabled>Save Location</button>
          </div>
          <div id="location-coords" style="font-size:12px;color:var(--t-muted);margin-bottom:12px;">No location set yet. Click the map or use the button above.</div>
          <div id="location-picker-map" style="width:100%;height:320px;border-radius:14px;border:1px solid var(--i-faint);overflow:hidden;"></div>
          <div style="font-size:11px;color:var(--t-muted);margin-top:8px;">💡 Tip: You can drag the marker to fine-tune your exact position.</div>
        </div>
      </div>

    </div>
  </div>
</div>

${globalScripts()}
<script>
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  var sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  var titles = {overview:'Overview',appts:'Appointments',clients:'Clients',styles:'Style History',reviews:'Reviews',earnings:'Earnings',kyc:'KYC Status',gallery:'My Gallery',fees:'Platform Fees',settings:'Settings'};
  var t = document.getElementById('sec-title');
  if (t) t.textContent = titles[id] || id;
}

function setRange(r) { showToast('Showing ' + r + ' data','info'); }
function filterAppts(btn, s) { showToast('Filtered: ' + s, 'info'); }

// Charts
document.addEventListener('DOMContentLoaded', function() {
  // Revenue chart
  var rCtx = document.getElementById('revenue-chart');
  if (rCtx && window.Chart) {
    new Chart(rCtx, {
      type: 'line',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
          data: [280,420,380,560,490,680,740],
          borderColor: '#C9A84C',
          backgroundColor: 'rgba(201,168,76,0.06)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#C9A84C',
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(58,47,30,0.08)' }, ticks: { color: '#8A7A62', font: { size: 11 } } },
          y: { grid: { color: 'rgba(58,47,30,0.08)' }, ticks: { color: '#8A7A62', font: { size: 11 }, callback: v => 'GHS ' + v } }
        }
      }
    });
  }
  // Status donut
  var sCtx = document.getElementById('status-chart');
  if (sCtx && window.Chart) {
    new Chart(sCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [68, 20, 12],
          backgroundColor: ['rgba(61,170,110,0.8)', 'rgba(201,168,76,0.8)', 'rgba(224,112,112,0.8)'],
          borderColor: 'transparent',
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '72%',
      }
    });
  }
});

// Load real provider dashboard data
(function() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!token || user.role !== 'provider') { window.location.href = '/login'; return; }

  axios.get('/api/providers/me/dashboard', { headers: { Authorization: 'Bearer ' + token } }).then(function(res) {
    var d = res.data;
    var p = d.provider;
    var stats = d.stats;

    // Store provider ID globally for gallery/fees
    providerIdGlobal = p.id;

    // Update gallery count label
    var gcl = document.getElementById('gallery-count-label');
    if (gcl) {
      var maxImg = p.has_pro_gallery ? 10 : 5;
      gcl.textContent = (p.has_pro_gallery ? 'Pro plan' : 'Free plan') + ': ' + (p.gallery_count || 0) + '/' + maxImg + ' images';
      if (p.has_pro_gallery) {
        var proBanner = document.getElementById('pro-banner');
        if (proBanner) proBanner.style.display = 'none';
      }
    }

    // Update sidebar name
    var nameEl = document.getElementById('sb-name');
    if (nameEl) nameEl.textContent = p.business_name;

    // Show pending approval banner for unverified providers
    var banner = document.getElementById('pending-approval-banner');
    if (banner && !p.is_verified) {
      banner.style.display = 'block';
    }

    // Update KPI cards
    var kpis = document.querySelectorAll('.kpi-card');
    if (kpis[0]) { var v = kpis[0].querySelector('.font-display'); if(v) v.textContent = stats.today_bookings; }
    if (kpis[1]) { var v = kpis[1].querySelector('.font-display'); if(v) v.textContent = 'GHS ' + Math.round(stats.week_revenue/100); }
    if (kpis[2]) { var v = kpis[2].querySelector('.font-display'); if(v) v.textContent = stats.total_clients; }
    if (kpis[3]) { var v = kpis[3].querySelector('.font-display'); if(v) v.textContent = stats.rating || '5.0'; }

    // Update today's appointments
    var apptList = document.getElementById('today-appts');
    if (apptList) {
      var appts = d.today_appointments || [];
      if (!appts.length) {
        apptList.innerHTML = '<div style="padding:32px;text-align:center;color:var(--t-muted);font-size:13px;">No appointments today ✦</div>';
      } else {
        apptList.innerHTML = appts.map(function(a) {
          var badgeClass = a.status === 'confirmed' ? 'badge-verified' : a.status === 'pending' ? 'badge-pending' : 'badge-success';
          return '<div class="appt-row">' +
            '<div class="mini-avatar">' + (a.first_name||'C').charAt(0) + '</div>' +
            '<div style="flex:1;">' +
              '<div style="font-size:13px;font-weight:700;">' + (a.first_name||'') + ' ' + (a.last_name||'') + '</div>' +
              '<div style="font-size:11px;color:var(--t-muted);">' + a.service_name + ' · ' + a.booking_time + '</div>' +
            '</div>' +
            '<span class="badge ' + badgeClass + '" style="font-size:10px;">' + a.status + '</span>' +
            '<div style="display:flex;gap:6px;">' +
              (a.status === 'pending' ? '<button onclick="updateAppt(' + a.id + ',\'confirmed\')" class="btn-primary" style="padding:6px 14px;font-size:10px;">Confirm</button>' : '') +
              '<button onclick="updateAppt(' + a.id + ',\'completed\')" class="btn-outline" style="padding:6px 14px;font-size:10px;">Done</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }
    }

    // Update pending bookings tab
    var pendingList = document.getElementById('pending-bookings');
    if (pendingList) {
      var pending = d.pending_bookings || [];
      if (!pending.length) {
        pendingList.innerHTML = '<div style="padding:32px;text-align:center;color:var(--t-muted);">No pending bookings</div>';
      } else {
        pendingList.innerHTML = pending.map(function(b) {
          return '<tr>' +
            '<td>' + (b.first_name||'') + ' ' + (b.last_name||'') + '</td>' +
            '<td>' + b.service_name + '</td>' +
            '<td>' + b.booking_date + ' ' + b.booking_time + '</td>' +
            '<td>GHS ' + Math.round(b.total_amount/100) + '</td>' +
            '<td><span class="badge badge-pending">pending</span></td>' +
            '<td>' +
              '<button onclick="updateAppt(' + b.id + ',\'confirmed\')" class="btn-primary" style="padding:6px 12px;font-size:10px;margin-right:4px;">Confirm</button>' +
              '<button onclick="updateAppt(' + b.id + ',\'cancelled\')" style="padding:6px 12px;font-size:10px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;">Decline</button>' +
            '</td>' +
          '</tr>';
        }).join('');
      }
    }

    // Accepting bookings toggle
    var toggle = document.getElementById('accepting-toggle');
    if (toggle) {
      toggle.checked = p.is_accepting_bookings === 1;
      toggle.onchange = function() {
        axios.put('/api/providers/me', { is_accepting_bookings: this.checked }, { headers: { Authorization: 'Bearer ' + token } })
          .then(function() { showToast('Status updated ✦', 'success'); })
          .catch(function() { showToast('Update failed', 'error'); });
      };
    }
  }).catch(function(e) {
    if (e.response && e.response.status === 401) window.location.href = '/login';
  });
})();

function updateAppt(id, status) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/bookings/' + id + '/status', { status: status }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Booking ' + status + ' ✦', 'success'); setTimeout(function() { location.reload(); }, 1000); })
    .catch(function() { showToast('Update failed', 'error'); });
}

// ── GALLERY FUNCTIONS ──
var providerIdGlobal = null;

function triggerLogoUpload() { document.getElementById('logo-input').click(); }
function triggerGalleryUpload() { document.getElementById('gallery-input').click(); }

function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) { resolve(e.target.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function handleLogoUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  if (file.size > 10 * 1024 * 1024) { showToast('Logo too large. Max 10MB', 'error'); return; }
  var token = localStorage.getItem('sl_token');
  showToast('Uploading logo...', 'info');
  fileToBase64(file).then(function(base64) {
    return axios.post('/api/uploads/provider-logo', { image_url: base64 }, { headers: { Authorization: 'Bearer ' + token } });
  }).then(function(r) {
    showToast('Logo uploaded! ✦', 'success');
    var preview = document.getElementById('logo-preview');
    if (preview) {
      preview.innerHTML = '<img src="' + r.data.url + '" style="width:100%;height:100%;object-fit:cover;" />';
    }
  }).catch(function(e) {
    showToast(e.response ? e.response.data.error : 'Upload failed', 'error');
  });
}

function handleGalleryUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  if (file.size > 10 * 1024 * 1024) { showToast('Image too large. Max 10MB', 'error'); return; }
  var token = localStorage.getItem('sl_token');
  var caption = prompt('Add a caption (optional):') || '';
  showToast('Uploading photo...', 'info');
  fileToBase64(file).then(function(base64) {
    return axios.post('/api/uploads/provider-gallery', { image_url: base64, caption: caption }, { headers: { Authorization: 'Bearer ' + token } });
  }).then(function(r) {
    showToast('Photo added! (' + r.data.count + '/' + r.data.max + ') ✦', 'success');
    loadGallery(token);
  }).catch(function(e) {
    var err = e.response ? e.response.data : {};
    if (err.upgrade_required) {
      showToast('Free limit reached! Upgrade to Gallery Pro for GHS 10/month', 'error');
    } else {
      showToast(err.error || 'Upload failed', 'error');
    }
  });
}

function deleteGalleryImage(id) {
  if (!confirm('Delete this photo?')) return;
  var token = localStorage.getItem('sl_token');
  axios.delete('/api/uploads/provider-gallery/' + id, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Photo deleted', 'success'); loadGallery(token); })
    .catch(function() { showToast('Delete failed', 'error'); });
}

function loadGallery(token) {
  if (!providerIdGlobal) return;
  axios.get('/api/uploads/provider-gallery/' + providerIdGlobal)
    .then(function(r) {
      var items = r.data.gallery || [];
      var logo = items.find(function(i) { return i.is_logo; });
      var photos = items.filter(function(i) { return !i.is_logo; });

      // Update logo preview
      var lp = document.getElementById('logo-preview');
      if (lp && logo) {
        lp.innerHTML = '<img src="' + logo.image_url + '" style="width:100%;height:100%;object-fit:cover;" onclick="triggerLogoUpload()" />';
      }

      // Update gallery grid
      var grid = document.getElementById('gallery-grid');
      if (!grid) return;
      var html = photos.map(function(p) {
        return '<div style="position:relative;aspect-ratio:1;border-radius:16px;overflow:hidden;background:var(--c-surface);">' +
          '<img src="' + p.image_url + '" style="width:100%;height:100%;object-fit:cover;" />' +
          (p.caption ? '<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.6);padding:8px 10px;font-size:10px;color:white;">' + p.caption + '</div>' : '') +
          '<button onclick="deleteGalleryImage(' + p.id + ')" style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.6);border:none;color:white;cursor:pointer;font-size:12px;">✕</button>' +
        '</div>';
      }).join('');
      // Add upload slot at end
      html += '<div onclick="triggerGalleryUpload()" style="aspect-ratio:1;border-radius:16px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;" onmouseover="this.style.borderColor=\'var(--g-border)\'" onmouseout="this.style.borderColor=\'var(--i-faint)\'"><div style="font-size:28px;margin-bottom:8px;">➕</div><div style="font-size:11px;color:var(--t-muted);">Add Photo</div></div>';
      grid.innerHTML = html;
    });
}

function upgradeGallery() {
  var ref = 'GALLERY-' + Date.now();
  if (!confirm('Upgrade to Gallery Pro for GHS 10/month? (Contact admin to pay via MoMo or reference: ' + ref + ')')) return;
  var token = localStorage.getItem('sl_token');
  axios.post('/api/uploads/subscribe-gallery', { payment_reference: ref }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      showToast('Gallery Pro activated! ✦', 'success');
      document.getElementById('pro-banner').style.display = 'none';
    }).catch(function(e) { showToast(e.response ? e.response.data.error : 'Upgrade failed', 'error'); });
}

// ── SERVICE FEES FUNCTION ──
function loadProviderFees() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!user.provider_id) return;
  axios.get('/api/admin/provider-fees/' + user.provider_id, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      var s = r.data.summary || {};
      var pending = (s.pending_amount || 0) / 100;
      var paid = (s.paid_amount || 0) / 100;
      var total = s.total_bookings || 0;

      var pe = document.getElementById('fees-pending-amt');
      var pa = document.getElementById('fees-paid-amt');
      var tc = document.getElementById('fees-total-count');
      if (pe) pe.textContent = 'GHS ' + pending.toFixed(2);
      if (pa) pa.textContent = 'GHS ' + paid.toFixed(2);
      if (tc) tc.textContent = total;

      var warn = document.getElementById('fees-warning');
      if (warn && pending > 0) warn.style.display = 'block';

      var body = document.getElementById('fees-table-body');
      if (!body) return;
      var fees = r.data.fees || [];
      if (!fees.length) {
        body.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:32px;">No bookings yet. Fees will appear here after your first booking.</div>';
        return;
      }
      body.innerHTML = fees.map(function(f) {
        var isOverdue = f.status === 'pending' && new Date(f.due_date) < new Date();
        return '<div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--i-faint);">' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;">Booking on ' + f.booking_date + '</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">Due: ' + f.due_date + ' midnight' + (isOverdue ? ' — <span style=\\"color:var(--s-red)\\">OVERDUE</span>' : '') + '</div>' +
          '</div>' +
          '<div style="font-size:14px;font-weight:700;color:var(--g-main);">GHS ' + ((f.fee_amount || 0) / 100).toFixed(2) + '</div>' +
          '<span class="badge ' + (f.status === 'paid' ? 'badge-verified' : isOverdue ? '' : 'badge-pending') + '" style="' + (isOverdue ? 'background:rgba(224,112,112,0.15);color:var(--s-red);border-color:rgba(224,112,112,0.3);' : '') + '">' + (f.status === 'paid' ? '✓ Paid' : isOverdue ? '⚠ Overdue' : '⏳ Pending') + '</span>' +
        '</div>';
      }).join('');
    }).catch(function() {
      var body = document.getElementById('fees-table-body');
      if (body) body.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:32px;">Fee data will appear once you have bookings</div>';
    });
}

// ── SERVICES MANAGER ──
var locationMap = null;
var locationMarker = null;
var pickedLat = null;
var pickedLng = null;

function showAddServiceForm() {
  document.getElementById('add-svc-form').style.display = 'block';
  document.getElementById('new-svc-name').focus();
}

function saveNewService() {
  var token = localStorage.getItem('sl_token');
  var name = document.getElementById('new-svc-name').value.trim();
  var price = parseInt(document.getElementById('new-svc-price').value) || 0;
  var duration = parseInt(document.getElementById('new-svc-duration').value) || 60;
  if (!name) { showToast('Please enter a service name', 'error'); return; }
  if (!price) { showToast('Please enter a price', 'error'); return; }
  axios.post('/api/providers/me/services', { name, price: price * 100, duration }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() {
      showToast('Service added! ✦', 'success');
      document.getElementById('add-svc-form').style.display = 'none';
      document.getElementById('new-svc-name').value = '';
      document.getElementById('new-svc-price').value = '';
      document.getElementById('new-svc-duration').value = '60';
      loadMyServices(token);
    }).catch(function(e) { showToast(e.response ? e.response.data.error : 'Save failed', 'error'); });
}

function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  var token = localStorage.getItem('sl_token');
  axios.delete('/api/providers/me/services/' + id, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Service deleted', 'info'); loadMyServices(token); })
    .catch(function() { showToast('Delete failed', 'error'); });
}

function loadMyServices(token) {
  axios.get('/api/providers/me/services', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      var list = document.getElementById('my-services-list');
      if (!list) return;
      var svcs = r.data.services || [];
      if (!svcs.length) {
        list.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;">No services yet. Add your first service above.</div>';
        return;
      }
      list.innerHTML = svcs.map(function(s) {
        return '<div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--i-faint);">' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:700;">' + s.name + '</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">⏱ ' + (s.duration_minutes || 60) + ' min</div>' +
          '</div>' +
          '<div style="font-size:15px;font-weight:800;color:var(--g-main);">GHS ' + Math.round((s.price||0)/100) + '</div>' +
          '<button onclick="deleteService(' + s.id + ')" style="width:32px;height:32px;border-radius:50%;background:rgba(224,112,112,0.1);border:none;color:var(--s-red);cursor:pointer;font-size:14px;flex-shrink:0;">✕</button>' +
        '</div>';
      }).join('');
    }).catch(function() {});
}

// ── LOCATION PICKER ──
function initLocationMap(providerLat, providerLng) {
  if (!window.L || locationMap) return;
  // Default to Accra, Ghana if no coords
  var lat = providerLat || 5.6037;
  var lng = providerLng || -0.1870;
  locationMap = L.map('location-picker-map').setView([lat, lng], providerLat ? 15 : 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(locationMap);

  var markerIcon = L.divIcon({
    html: '<div style="background:linear-gradient(135deg,#833ab4,#e1306c);width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>',
    iconSize: [28,28], iconAnchor: [14,28], className: ''
  });

  if (providerLat && providerLng) {
    pickedLat = providerLat; pickedLng = providerLng;
    locationMarker = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(locationMap);
    updateCoordDisplay(lat, lng);
    document.getElementById('save-location-btn').disabled = false;
  }

  // Click on map to set marker
  locationMap.on('click', function(e) {
    pickedLat = e.latlng.lat; pickedLng = e.latlng.lng;
    if (locationMarker) {
      locationMarker.setLatLng(e.latlng);
    } else {
      locationMarker = L.marker(e.latlng, { icon: markerIcon, draggable: true }).addTo(locationMap);
      locationMarker.on('dragend', function(ev) {
        pickedLat = ev.target.getLatLng().lat; pickedLng = ev.target.getLatLng().lng;
        updateCoordDisplay(pickedLat, pickedLng);
      });
    }
    updateCoordDisplay(pickedLat, pickedLng);
    document.getElementById('save-location-btn').disabled = false;
  });

  if (locationMarker) {
    locationMarker.on('dragend', function(ev) {
      pickedLat = ev.target.getLatLng().lat; pickedLng = ev.target.getLatLng().lng;
      updateCoordDisplay(pickedLat, pickedLng);
    });
  }
}

function updateCoordDisplay(lat, lng) {
  var el = document.getElementById('location-coords');
  if (el) el.innerHTML = '📍 <strong>Lat:</strong> ' + lat.toFixed(5) + ', <strong>Lng:</strong> ' + lng.toFixed(5);
}

function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  showToast('Getting your location...', 'info');
  navigator.geolocation.getCurrentPosition(function(pos) {
    pickedLat = pos.coords.latitude; pickedLng = pos.coords.longitude;
    if (locationMap) {
      locationMap.setView([pickedLat, pickedLng], 16);
      var markerIcon = L.divIcon({
        html: '<div style="background:linear-gradient(135deg,#833ab4,#e1306c);width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>',
        iconSize: [28,28], iconAnchor: [14,28], className: ''
      });
      if (locationMarker) {
        locationMarker.setLatLng([pickedLat, pickedLng]);
      } else {
        locationMarker = L.marker([pickedLat, pickedLng], { icon: markerIcon, draggable: true }).addTo(locationMap);
      }
      updateCoordDisplay(pickedLat, pickedLng);
      document.getElementById('save-location-btn').disabled = false;
    }
    showToast('Location detected! ✦ Click Save to confirm.', 'success');
  }, function() { showToast('Could not get location. Please allow location access.', 'error'); });
}

function saveLocation() {
  if (!pickedLat || !pickedLng) { showToast('Please pick a location first', 'error'); return; }
  var token = localStorage.getItem('sl_token');
  axios.put('/api/providers/me', { location_lat: pickedLat, location_lng: pickedLng }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Location saved! ✦ Customers can now find you on the map.', 'success'); })
    .catch(function() { showToast('Save failed', 'error'); });
}

// Hook into section show to load data
var origShowSection = showSection;
showSection = function(id, btn) {
  origShowSection(id, btn);
  if (id === 'gallery') {
    var token = localStorage.getItem('sl_token');
    if (token && providerIdGlobal) loadGallery(token);
  }
  if (id === 'fees') loadProviderFees();
  if (id === 'settings') {
    var token2 = localStorage.getItem('sl_token');
    loadMyServices(token2);
    // Init map after slight delay for DOM render
    setTimeout(function() {
      axios.get('/api/providers/me/dashboard', { headers: { Authorization: 'Bearer ' + token2 } })
        .then(function(r) {
          var p = r.data.provider;
          initLocationMap(p.location_lat, p.location_lng);
        }).catch(function() { initLocationMap(null, null); });
    }, 200);
  }
};
</script>
</body></html>`
