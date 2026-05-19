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
  .admin-table { width:100%; border-collapse:collapse; min-width:600px; }
  .admin-table th { font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:var(--t-muted); padding:14px 20px; border-bottom:1px solid var(--i-faint); text-align:left; white-space:nowrap; }
  .admin-table td { padding:14px 20px; border-bottom:1px solid var(--i-faint); font-size:13px; color:var(--t-secondary); }
  .admin-table tr:hover td { background:var(--c-raise); }
  .table-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:var(--r-xl); border:1px solid var(--i-faint); background:var(--c-surface); }
  .admin-table { min-width:580px; }
  .admin-menu-btn { display:none; width:38px; height:38px; border-radius:10px; border:1px solid var(--i-faint); background:var(--c-raise); align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .admin-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:299; }
  .admin-mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--c-deep); border-top:1px solid var(--i-faint); z-index:400; padding:6px 0 env(safe-area-inset-bottom,8px); overflow-x:auto; }
  .admin-mob-nav-inner { display:flex; min-width:max-content; padding:0 8px; gap:2px; }
  .amob-btn { display:flex; flex-direction:column; align-items:center; gap:2px; padding:6px 10px; cursor:pointer; border:none; background:none; color:var(--t-muted); font-size:8px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; border-radius:10px; white-space:nowrap; }
  .amob-btn.active { color:var(--g-main); background:var(--g-dim); }
  .amob-btn .aico { font-size:16px; }
  @media(max-width:768px){
    .admin-sidebar { position:fixed; top:0; left:0; bottom:0; z-index:300; transform:translateX(-100%); transition:transform 0.3s; }
    .admin-sidebar.open { transform:translateX(0); }
    .admin-overlay.open { display:block; }
    .admin-menu-btn { display:flex; }
    .admin-mob-nav { display:flex; }
    .admin-main { margin-left:0 !important; }
    .admin-topbar { padding:10px 12px; }
    .admin-topbar .font-display { font-size:14px !important; }
    div[style*="padding:32px"] { padding:12px !important; padding-bottom:90px !important; }
    .kpi { padding:14px !important; }
    .kpi .font-display { font-size:20px !important; }
    .admin-kpi-grid { grid-template-columns:repeat(2,1fr) !important; gap:10px !important; }
    .admin-charts-grid { grid-template-columns:1fr !important; }
    .admin-actions-grid { grid-template-columns:repeat(2,1fr) !important; gap:8px !important; }
    .admin-fees-grid { grid-template-columns:1fr 1fr 1fr !important; gap:8px !important; }
    div[style*="grid-template-columns:repeat(4,1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
    .eyebrow { font-size:10px !important; }
    /* Reconcile summary */
    #reconcile-summary { grid-template-columns:repeat(2,1fr) !important; gap:8px !important; }
  }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<div class="admin-layout">

  <!-- Mobile overlay -->
  <div class="admin-overlay" id="admin-overlay" onclick="closeAdminSidebar()"></div>

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="admin-sidebar" id="admin-sidebar">
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
        {id:'overview',    icon:'⬡',  label:'Overview'},
        {id:'users',       icon:'👥', label:'Users'},
        {id:'providers',   icon:'💇', label:'Providers'},
        {id:'bookings',    icon:'📅', label:'Bookings'},
        {id:'kyc',         icon:'🪪', label:'KYC Queue'},
        {id:'payments',    icon:'💰', label:'Payments'},
        {id:'fees',        icon:'🧾', label:'Platform Fees'},
        {id:'registrants', icon:'📋', label:'Registrants'},
        {id:'reconcile',   icon:'🔄', label:'Daily Reconcile'},
        {id:'reports',     icon:'📊', label:'Reports'},
        {id:'security',    icon:'🔒', label:'Security'},
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
      <div style="display:flex;align-items:center;gap:10px;">
        <button class="admin-menu-btn" onclick="openAdminSidebar()" aria-label="Menu">☰</button>
        <div>
          <div class="font-display" style="font-size:18px;font-weight:500;" id="admin-title">Platform Overview</div>
          <div style="font-size:11px;color:var(--t-muted);">SalonLink Admin</div>
        </div>
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
        <div class="admin-kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;">
          <div class="kpi" style="--accent:var(--g-main)">
            <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;" id="kpi-users">—</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">Total Users</div>
            <div style="font-size:11px;color:var(--t-muted);" id="kpi-users-sub">Loading...</div>
          </div>
          <div class="kpi" style="--accent:var(--s-green)">
            <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;" id="kpi-providers">—</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">Active Providers</div>
            <div style="font-size:11px;color:var(--t-muted);" id="kpi-providers-sub">Loading...</div>
          </div>
          <div class="kpi" style="--accent:var(--s-blue)">
            <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;" id="kpi-bookings">—</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">Total Bookings</div>
            <div style="font-size:11px;color:var(--t-muted);" id="kpi-bookings-sub">Loading...</div>
          </div>
          <div class="kpi" style="--accent:var(--g-deep)">
            <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;" id="kpi-revenue">—</div>
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);margin-bottom:6px;">Gross Revenue</div>
            <div style="font-size:11px;color:var(--t-muted);" id="kpi-revenue-sub">Loading...</div>
          </div>
        </div>

        <!-- Revenue Summary (simple, no charts) -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:24px;margin-bottom:24px;">
          <div class="eyebrow" style="margin-bottom:6px;">Platform Revenue</div>
          <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;" id="chart-revenue-label">GHS 0</div>
          <div style="font-size:12px;color:var(--t-muted);" id="chart-revenue-sub">Total earnings from bookings</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px;">
            <div style="background:var(--c-raise);border-radius:12px;padding:14px;text-align:center;">
              <div style="font-size:10px;color:var(--t-muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.08em;">Fee / Booking</div>
              <div style="font-size:18px;font-weight:700;color:var(--g-main);">GHS 3</div>
            </div>
            <div style="background:var(--c-raise);border-radius:12px;padding:14px;text-align:center;">
              <div style="font-size:10px;color:var(--t-muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.08em;">Platform Cut</div>
              <div style="font-size:18px;font-weight:700;color:#5DC98A;">3 GHS each</div>
            </div>
            <div style="background:var(--c-raise);border-radius:12px;padding:14px;text-align:center;">
              <div style="font-size:10px;color:var(--t-muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.08em;">Model</div>
              <div style="font-size:14px;font-weight:700;color:var(--t-primary);">Flat Fee</div>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;">
          <div class="eyebrow" style="margin-bottom:20px;">Quick Actions</div>
          <div class="admin-actions-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            ${[
              {icon:'🔍',label:'Review KYC Queue',sub:'Check queue',  action:'kyc'},
              {icon:'⚠️',label:'Fraud Alerts',    sub:'Security log', action:'security'},
              {icon:'📊',label:'View Reports',    sub:'Analytics',    action:'reports'},
              {icon:'👥',label:'Manage Users',    sub:'All accounts', action:'users'},
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
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Verified</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody id="users-tbody">
              <tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">Select Users tab to load data</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── KYC QUEUE ── -->
      <div id="admin-kyc" class="admin-section">
        <div class="eyebrow" style="margin-bottom:24px;">KYC Verification Queue</div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Business / Provider</th><th>Email</th><th>Category</th><th>Documents</th><th>Actions</th></tr></thead>
            <tbody id="kyc-tbody"><tr><td colspan="5" style="text-align:center;padding:32px;color:var(--t-muted);">Select KYC tab to load queue</td></tr></tbody>
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
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Business</th><th>Email</th><th>Category</th><th>Rating</th><th>KYC</th><th>City</th><th>Actions</th></tr></thead>
            <tbody id="providers-tbody"><tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">Select Providers tab to load</td></tr></tbody>
          </table>
        </div>
      </div>
      <div id="admin-bookings" class="admin-section">
        <div class="eyebrow" style="margin-bottom:20px;">All Bookings</div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>#ID</th><th>Customer</th><th>Provider</th><th>Service</th><th>Date & Time</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody id="bookings-tbody"><tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">Loading...</td></tr></tbody>
          </table>
        </div>
      </div>
      <!-- ══ PAYMENTS / PAYSTACK SECTION ══ -->
      <div id="admin-payments" class="admin-section">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div class="eyebrow">Paystack Payments & Payouts</div>
          <button onclick="loadPaymentSummary()" style="padding:8px 18px;border-radius:100px;font-size:11px;font-weight:700;background:var(--g-main);color:white;border:none;cursor:pointer;">🔄 Refresh</button>
        </div>

        <!-- KPI Cards -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;" id="pay-kpi-grid">
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:18px;text-align:center;">
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-bottom:6px;">Total Gross</div>
            <div id="pay-kpi-gross" class="font-display" style="font-size:22px;font-weight:700;color:var(--t-primary);">—</div>
          </div>
          <div style="background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(131,58,180,0.05));border:1px solid var(--g-border);border-radius:var(--r-lg);padding:18px;text-align:center;">
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-bottom:6px;">Platform Revenue</div>
            <div id="pay-kpi-platform" class="font-display gold-gradient" style="font-size:22px;font-weight:700;">—</div>
            <div style="font-size:9px;color:var(--t-muted);margin-top:3px;">GHS 3 × bookings</div>
          </div>
          <div style="background:rgba(224,112,112,0.06);border:1px solid rgba(224,112,112,0.2);border-radius:var(--r-lg);padding:18px;text-align:center;">
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-bottom:6px;">Pending Payouts</div>
            <div id="pay-kpi-pending" class="font-display" style="font-size:22px;font-weight:700;color:#E07070;">—</div>
          </div>
          <div style="background:rgba(93,201,138,0.06);border:1px solid rgba(93,201,138,0.2);border-radius:var(--r-lg);padding:18px;text-align:center;">
            <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-bottom:6px;">Paid Out</div>
            <div id="pay-kpi-paidout" class="font-display" style="font-size:22px;font-weight:700;color:#5DC98A;">—</div>
          </div>
        </div>

        <!-- Provider Payout Table -->
        <div style="margin-bottom:24px;">
          <div style="font-size:12px;font-weight:700;color:var(--t-secondary);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">Providers Owed Payment</div>
          <div class="table-scroll">
            <table class="admin-table">
              <thead><tr><th>Provider</th><th>MoMo Number</th><th>Pending Count</th><th>Amount Owed</th><th>Action</th></tr></thead>
              <tbody id="payout-list-tbody"><tr><td colspan="5" style="text-align:center;padding:24px;color:var(--t-muted);">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
          <div style="font-size:12px;font-weight:700;color:var(--t-secondary);text-transform:uppercase;letter-spacing:0.08em;">All Transactions</div>
          <select id="pay-filter-provider" onchange="filterTransactions()" style="padding:6px 12px;border-radius:8px;border:1px solid var(--i-faint);font-size:12px;background:var(--c-surface);color:var(--t-primary);">
            <option value="">All Providers</option>
          </select>
          <select id="pay-filter-status" onchange="filterTransactions()" style="padding:6px 12px;border-radius:8px;border:1px solid var(--i-faint);font-size:12px;background:var(--c-surface);color:var(--t-primary);">
            <option value="">All Status</option>
            <option value="pending">Pending Payout</option>
            <option value="paid">Paid Out</option>
          </select>
          <button onclick="exportTransactions()" style="padding:6px 14px;border-radius:8px;border:1px solid var(--i-faint);font-size:11px;font-weight:600;background:var(--c-surface);color:var(--t-secondary);cursor:pointer;">⬇ Export CSV</button>
        </div>

        <!-- Transactions Table -->
        <div class="table-scroll">
          <table class="admin-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="select-all-txn" onchange="toggleAllTxn(this)"></th>
                <th>Date</th><th>Customer</th><th>Provider</th><th>Service</th>
                <th>Gross (GHS)</th><th>Platform Fee</th><th>Provider Earns</th>
                <th>Payout</th><th>Reference</th>
              </tr>
            </thead>
            <tbody id="transactions-tbody"><tr><td colspan="10" style="text-align:center;padding:32px;color:var(--t-muted);">Loading...</td></tr></tbody>
          </table>
        </div>

        <!-- Bulk Action -->
        <div style="margin-top:12px;display:flex;align-items:center;gap:10px;">
          <span id="selected-count" style="font-size:12px;color:var(--t-muted);">0 selected</span>
          <button onclick="bulkMarkPaid()" style="padding:8px 18px;border-radius:100px;font-size:11px;font-weight:700;background:#5DC98A;color:white;border:none;cursor:pointer;">✅ Mark Selected as Paid</button>
        </div>
      </div>
      <div id="admin-reports"   class="admin-section"><div class="eyebrow">Reports</div><p style="color:var(--t-secondary);margin-top:16px;">Reports & analytics panel loading...</p></div>

      <!-- ── PLATFORM FEES SECTION ── -->
      <div id="admin-fees" class="admin-section">
        <div class="eyebrow" style="margin-bottom:8px;">Platform Service Fees (GHS 3/booking)</div>
        <div style="font-size:12px;color:var(--t-muted);margin-bottom:20px;">Track fees owed by providers. Due by midnight of each booking day.</div>
        <div class="admin-fees-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:20px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--g-main);" id="admin-fees-pending-amt">GHS 0</div>
            <div style="font-size:11px;color:var(--t-muted);">Total Pending</div>
          </div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:20px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--s-green);" id="admin-fees-paid-amt">GHS 0</div>
            <div style="font-size:11px;color:var(--t-muted);">Total Collected</div>
          </div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:20px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--s-red);" id="admin-fees-overdue">0</div>
            <div style="font-size:11px;color:var(--t-muted);">Overdue Fees</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:16px;">
          <button onclick="loadFees('pending')" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:var(--g-dim);border:1px solid var(--g-border);color:var(--g-main);">Pending</button>
          <button onclick="loadFees('paid')" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid var(--i-faint);color:var(--t-secondary);">Paid</button>
          <button onclick="loadFees('')" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid var(--i-faint);color:var(--t-secondary);">All</button>
        </div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Provider</th><th>Email</th><th>Booking Date</th><th>Fee</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody id="fees-tbody"><tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">Click a filter above to load fees</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- ── REGISTRANTS SECTION ── -->
      <div id="admin-registrants" class="admin-section">
        <div class="eyebrow" style="margin-bottom:8px;">All Registrants</div>
        <div style="font-size:12px;color:var(--t-muted);margin-bottom:20px;">Track all customer and provider sign-ups. Approve providers here.</div>
        <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">
          <button onclick="loadRegistrants(7)" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid var(--i-faint);color:var(--t-secondary);">Last 7 days</button>
          <button onclick="loadRegistrants(30)" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:var(--g-dim);border:1px solid var(--g-border);color:var(--g-main);">Last 30 days</button>
          <button onclick="loadRegistrants(90)" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid var(--i-faint);color:var(--t-secondary);">Last 90 days</button>
          <button onclick="loadRegistrants(365)" style="padding:8px 18px;border-radius:100px;font-size:11px;cursor:pointer;background:transparent;border:1px solid var(--i-faint);color:var(--t-secondary);">All time</button>
        </div>
        <div id="reg-count-summary" style="margin-bottom:16px;font-size:13px;color:var(--t-secondary);"></div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Business</th><th>KYC</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody id="registrants-tbody"><tr><td colspan="8" style="text-align:center;padding:32px;color:var(--t-muted);">Loading registrants...</td></tr></tbody>
          </table>
        </div>
      </div>

      <!-- ── DAILY RECONCILIATION ── -->
      <div id="admin-reconcile" class="admin-section">
        <div class="eyebrow" style="margin-bottom:8px;">Daily Fee Reconciliation</div>
        <div style="font-size:12px;color:var(--t-muted);margin-bottom:20px;">Check which providers have paid their GHS 3/booking fees for any given day. All fees are due by midnight.</div>
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
          <input type="date" id="reconcile-date" style="padding:10px 14px;border-radius:10px;background:var(--c-surface);border:1px solid var(--i-faint);color:var(--t-primary);font-size:12px;" />
          <button onclick="loadReconcile()" style="padding:10px 24px;border-radius:100px;font-size:12px;cursor:pointer;background:linear-gradient(135deg,var(--g-deep),var(--g-main));color:white;border:none;font-weight:700;">Load Report</button>
        </div>
        <div id="reconcile-summary" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:16px;text-align:center;"><div style="font-size:20px;font-weight:800;" id="rec-total-fees">-</div><div style="font-size:11px;color:var(--t-muted);">Total Fees</div></div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:16px;text-align:center;"><div style="font-size:20px;font-weight:800;color:var(--s-green);" id="rec-paid">-</div><div style="font-size:11px;color:var(--t-muted);">Paid</div></div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:16px;text-align:center;"><div style="font-size:20px;font-weight:800;color:var(--s-red);" id="rec-pending">-</div><div style="font-size:11px;color:var(--t-muted);">Pending</div></div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:16px;text-align:center;"><div style="font-size:20px;font-weight:800;color:var(--g-main);" id="rec-amount">-</div><div style="font-size:11px;color:var(--t-muted);">Total Amount</div></div>
        </div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Provider</th><th>Email / Phone</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead>
            <tbody id="reconcile-tbody"><tr><td colspan="5" style="text-align:center;padding:32px;color:var(--t-muted);">Select a date and click Load Report</td></tr></tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Mobile bottom nav -->
<nav class="admin-mob-nav">
  <div class="admin-mob-nav-inner">
    ${[
      {id:'overview',icon:'⬡',label:'Overview'},
      {id:'users',icon:'👥',label:'Users'},
      {id:'providers',icon:'💇',label:'Providers'},
      {id:'bookings',icon:'📅',label:'Bookings'},
      {id:'kyc',icon:'🪪',label:'KYC'},
      {id:'fees',icon:'🧾',label:'Fees'},
      {id:'registrants',icon:'📋',label:'Registrants'},
      {id:'reports',icon:'📊',label:'Reports'},
    ].map((l,i)=>`
      <button class="amob-btn ${i===0?'active':''}" id="amob-${l.id}" onclick="adminSection('${l.id}',document.getElementById('admin-nav-${l.id}'))">
        <span class="aico">${l.icon}</span>${l.label}
      </button>
    `).join('')}
  </div>
</nav>

${globalScripts()}
<script>
function openAdminSidebar() {
  document.getElementById('admin-sidebar').classList.add('open');
  document.getElementById('admin-overlay').classList.add('open');
}
function closeAdminSidebar() {
  document.getElementById('admin-sidebar').classList.remove('open');
  document.getElementById('admin-overlay').classList.remove('open');
}

function adminSection(id, btn) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.amob-btn').forEach(b => b.classList.remove('active'));
  var sec = document.getElementById('admin-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  var mobBtn = document.getElementById('amob-' + id);
  if (mobBtn) mobBtn.classList.add('active');
  var titles = {overview:'Platform Overview',users:'User Management',providers:'Provider Management',bookings:'Booking Management',kyc:'KYC Verification Queue',payments:'Payment Management',reports:'Reports & Analytics',security:'Security & Fraud',fees:'Platform Service Fees',registrants:'Registrants Tracker',reconcile:'Daily Fee Reconciliation'};
  document.getElementById('admin-title').textContent = titles[id] || id;
  closeAdminSidebar();
  if (id === 'fees') { loadFeeSummary(); loadFees('pending'); }
  if (id === 'registrants') loadRegistrants(30);
  if (id === 'payments') loadPaymentSummary();
  if (id === 'users') loadUsers();
  if (id === 'providers') loadProviders();
  if (id === 'kyc') loadKyc();
  if (id === 'bookings') loadBookings();
  if (id === 'reconcile') {
    var dateInput = document.getElementById('reconcile-date');
    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
  }
}

// Charts removed — using simple stat cards instead

// Load real admin data
document.addEventListener('DOMContentLoaded', function() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!token || user.role !== 'admin') { window.location.href = '/login'; return; }
  var h = { Authorization: 'Bearer ' + token };
  window._adminToken = token;
  window._adminH = h;

  // Load only stats on init (lightweight)
  axios.get('/api/admin/stats', { headers: h }).then(function(res) {
    var s = res.data.stats || {};
    var set = function(id, v) { var el = document.getElementById(id); if(el) el.textContent = v; };
    set('kpi-users',     s.total_users || 0);
    set('kpi-providers', s.total_providers || 0);
    set('kpi-bookings',  s.total_bookings || 0);
    var rev = 'GHS ' + Math.round((s.total_revenue||0)/100).toLocaleString();
    set('kpi-revenue', rev);
    set('chart-revenue-label', rev);
    set('kpi-users-sub',    s.total_users > 0 ? s.total_users + ' registered' : 'No users yet');
    set('kpi-providers-sub',s.total_providers > 0 ? s.total_providers + ' on platform' : 'No providers yet');
    set('kpi-bookings-sub', s.total_bookings > 0 ? 'all time' : 'No bookings yet');
    set('kpi-revenue-sub',  (s.total_revenue||0) > 0 ? 'total earned' : 'No revenue yet');
    set('chart-revenue-sub',(s.total_revenue||0) > 0 ? 'total earned' : 'No revenue yet');
  }).catch(function(e) {
    console.error('Stats error:', e);
    ['kpi-users','kpi-providers','kpi-bookings','kpi-revenue'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.textContent = '—';
    });
  });
});

function adminHeaders() {
  var t = localStorage.getItem('sl_token');
  return t ? { Authorization: 'Bearer ' + t } : null;
}

function loadUsers() {
  var h = adminHeaders();
  if (!h) { window.location.href = '/login'; return; }
  var tbody = document.getElementById('users-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--t-muted);">Loading...</td></tr>';
  axios.get('/api/admin/users', { headers: h }).then(function(res) {
    if (!tbody) return;
    var rows = (res.data.users || []);
    tbody.innerHTML = rows.length ? rows.map(function(u) {
      return '<tr>' +
        '<td style="font-weight:600;">' + (u.first_name||'') + ' ' + (u.last_name||'') + '</td>' +
        '<td style="font-size:12px;">' + (u.email||'') + '</td>' +
        '<td><span class="badge ' + (u.role==='admin'?'badge-error':u.role==='provider'?'badge-verified':'badge-pending') + '">' + u.role + '</span></td>' +
        '<td><span class="badge ' + (u.is_verified?'badge-verified':'badge-pending') + '">' + (u.is_verified?'Yes':'No') + '</span></td>' +
        '<td style="font-size:12px;">' + new Date(u.created_at).toLocaleDateString() + '</td>' +
        '<td><button onclick="toggleUser(' + u.id + ')" class="btn-ghost" style="padding:5px 12px;font-size:10px;color:' + (u.is_active?'var(--s-red)':'var(--s-green)') + ';">' + (u.is_active?'Deactivate':'Activate') + '</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--t-muted);">No users found</td></tr>';
  }).catch(function(e) { if(tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--s-red);">Failed to load users: ' + (e.message||'') + '</td></tr>'; });
}

function loadProviders() {
  var h = adminHeaders();
  if (!h) { window.location.href='/login'; return; }
  var tbody = document.getElementById('providers-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--t-muted);">Loading...</td></tr>';
  axios.get('/api/admin/providers', { headers: h }).then(function(res) {
    if (!tbody) return;
    var rows = (res.data.providers || []);
    tbody.innerHTML = rows.length ? rows.map(function(p) {
      var kycBadge = p.kyc_status==='approved' ? 'badge-verified' : p.kyc_status==='rejected' ? 'badge-error' : 'badge-pending';
      return '<tr>' +
        '<td style="font-weight:600;">' + (p.business_name||'—') + '<div style="font-size:10px;color:#888;">' + (p.first_name||'') + ' ' + (p.last_name||'') + '</div></td>' +
        '<td style="font-size:12px;">' + (p.email||'') + '<div style="font-size:10px;color:#888;">' + (p.phone||'') + '</div></td>' +
        '<td>' + (p.service_category||'').replace(/_/g,' ') + '</td>' +
        '<td>' + (p.rating||0).toFixed(1) + ' ★<div style="font-size:10px;color:#888;">' + (p.total_reviews||0) + ' reviews</div></td>' +
        '<td><span class="badge ' + kycBadge + '">' + (p.kyc_status||'pending') + '</span></td>' +
        '<td style="font-size:11px;">' + (p.city||'') + '</td>' +
        '<td>' +
          '<button onclick="viewProviderKyc(' + p.id + ')" style="padding:5px 10px;font-size:10px;background:rgba(160,120,48,0.1);border:1px solid rgba(160,120,48,0.3);color:#a0793c;border-radius:8px;cursor:pointer;margin-bottom:4px;display:block;width:100%;">🪪 View KYC</button>' +
          (p.kyc_status !== 'approved' ? '<button onclick="approveKyc(' + p.id + ')" class="btn-primary" style="padding:5px 10px;font-size:10px;margin-bottom:4px;display:block;width:100%;">✓ Approve</button>' : '<span style="font-size:10px;color:var(--s-green);display:block;text-align:center;margin-bottom:4px;">✓ Approved</span>') +
          (p.kyc_status !== 'rejected' && p.kyc_status !== 'approved' ? '<button onclick="rejectKyc(' + p.id + ')" style="padding:5px 10px;font-size:10px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;display:block;width:100%;">✗ Reject</button>' : '') +
        '</td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">No providers found</td></tr>';
  }).catch(function(e) {
    var msg = e.response && e.response.status === 403 ? 'Session expired — please log in again' : (e.response && e.response.data && e.response.data.error) || 'Failed to load providers';
    if(tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--s-red);">' + msg + '</td></tr>';
    if (e.response && e.response.status === 403) setTimeout(function(){ window.location.href='/login'; }, 2000);
  });
}

function loadKyc() {
  var h = adminHeaders();
  if (!h) { window.location.href='/login'; return; }
  var kyctbody = document.getElementById('kyc-tbody');
  if (kyctbody) kyctbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--t-muted);">Loading KYC queue...</td></tr>';
  axios.get('/api/admin/providers', { headers: h }).then(function(res) {
    if (!kyctbody) return;
    var rows = (res.data.providers || []);
    /* Show all providers that are NOT yet approved or rejected */
    var pending = rows.filter(function(p) { return p.kyc_status !== 'approved' && p.kyc_status !== 'rejected'; });
    kyctbody.innerHTML = pending.length ? pending.map(function(p) {
      var cardNum = p.kyc_card_number ? '<div style="font-size:10px;font-weight:700;color:#a0793c;margin-top:2px;">Card: ' + p.kyc_card_number + '</div>' : '<div style="font-size:10px;color:#bbb;margin-top:2px;">No card # submitted</div>';
      var statusBadge = p.kyc_status === 'submitted' ? '<span class="badge badge-verified" style="font-size:9px;">Submitted</span>' : '<span class="badge badge-pending" style="font-size:9px;">Pending</span>';
      return '<tr id="kyc-row-' + p.id + '">' +
        '<td><div style="font-weight:700;font-size:13px;">' + (p.business_name||'—') + '</div><div style="font-size:11px;color:#888;">' + (p.first_name||'') + ' ' + (p.last_name||'') + '</div>' + cardNum + '<div style="margin-top:4px;">' + statusBadge + '</div></td>' +
        '<td style="font-size:12px;">' + (p.email||'') + '<div style="font-size:10px;color:#888;">' + (p.phone||'') + '</div></td>' +
        '<td>' + (p.service_category||'').replace(/_/g,' ') + '</td>' +
        '<td>' +
          '<button onclick="viewProviderKyc(' + p.id + ')" style="padding:7px 14px;font-size:11px;background:rgba(160,120,48,0.12);border:1px solid rgba(160,120,48,0.35);color:#a0793c;border-radius:8px;cursor:pointer;font-weight:600;">🪪 View Documents</button>' +
        '</td>' +
        '<td>' +
          '<button onclick="approveKyc(' + p.id + ')" class="btn-primary" style="padding:6px 14px;font-size:11px;margin-bottom:4px;display:block;width:100%;">✓ Approve</button>' +
          '<button onclick="rejectKyc(' + p.id + ')" style="padding:6px 14px;font-size:11px;background:none;border:1px solid rgba(192,72,72,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;display:block;width:100%;">✗ Reject</button>' +
        '</td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--t-muted);">✦ All providers are reviewed — no pending KYC</td></tr>';
  }).catch(function(e) {
    var msg = e.response && e.response.status === 403 ? 'Session expired — please log in again' : 'Failed to load KYC data';
    if(kyctbody) kyctbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--s-red);">' + msg + '</td></tr>';
    if (e.response && e.response.status === 403) setTimeout(function(){ window.location.href='/login'; }, 2000);
  });
}

function loadBookings() {
  var h = adminHeaders();
  if (!h) return;
  var tbody = document.getElementById('bookings-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--t-muted);">Loading...</td></tr>';
  axios.get('/api/admin/bookings', { headers: h }).then(function(res) {
    if (!tbody) return;
    var rows = (res.data.bookings || []).slice(0, 50);
    tbody.innerHTML = rows.length ? rows.map(function(b) {
      return '<tr>' +
        '<td>#' + b.id + '</td>' +
        '<td>' + (b.customer_first_name||'') + ' ' + (b.customer_last_name||'') + '</td>' +
        '<td style="font-weight:600;">' + (b.business_name||'') + '</td>' +
        '<td>' + (b.service_name||'') + '</td>' +
        '<td style="font-size:12px;">' + (b.booking_date||'') + ' ' + (b.booking_time||'') + '</td>' +
        '<td>GHS ' + Math.round((b.total_amount||0)/100) + '</td>' +
        '<td><span class="badge ' + (b.status==='completed'?'badge-success':b.status==='confirmed'?'badge-verified':b.status==='cancelled'?'badge-error':'badge-pending') + '">' + b.status + '</span></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">No bookings found</td></tr>';
  }).catch(function(e) { if(tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--s-red);">Failed to load bookings</td></tr>'; });
}

function toggleUser(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/users/' + id + '/toggle', {}, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) { showToast(r.data.message + ' ✦', 'success'); setTimeout(function(){location.reload();},1000); })
    .catch(function() { showToast('Action failed', 'error'); });
}

// Close the KYC modal
function closeKycModal() {
  var m = document.getElementById('kyc-modal-overlay');
  if (m) m.remove();
}

// Add a clickable image row to the KYC modal content area using DOM (no innerHTML with quotes)
function addKycImgSection(parent, label, src, isCircle) {
  var wrap = document.createElement('div');
  wrap.style.cssText = 'margin-bottom:20px;';
  var lbl = document.createElement('div');
  lbl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:10px;text-align:left;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;';
  lbl.textContent = label;
  wrap.appendChild(lbl);
  var img = document.createElement('img');
  img.src = src;
  img.title = 'Click to enlarge';
  if (isCircle) {
    img.style.cssText = 'width:160px;height:160px;object-fit:cover;border-radius:50%;cursor:pointer;border:3px solid rgba(255,255,255,0.15);display:block;margin:0 auto;box-shadow:0 8px 32px rgba(0,0,0,0.4);';
  } else {
    img.style.cssText = 'width:100%;max-height:260px;object-fit:contain;border-radius:16px;background:#111;cursor:pointer;border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 32px rgba(0,0,0,0.4);';
  }
  img.addEventListener('click', function(){ viewImg(img.src, label); });
  img.addEventListener('error', function(){
    img.style.display = 'none';
    var errMsg = document.createElement('div');
    errMsg.style.cssText = 'padding:20px 16px;background:rgba(255,59,48,0.08);border:1px dashed rgba(255,59,48,0.3);border-radius:12px;color:rgba(255,100,80,0.9);font-size:12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;';
    errMsg.innerHTML = '<span style="font-size:28px;">🖼</span><span style="font-weight:600;">Image could not be displayed</span><span style="color:rgba(255,255,255,0.35);font-size:11px;">The document was uploaded but may be too large to display, or the format is unsupported. The provider may need to re-submit.</span>';
    wrap.appendChild(errMsg);
  });
  wrap.appendChild(img);
  parent.appendChild(wrap);
}

// View full KYC documents in a modal — built entirely with DOM, zero innerHTML with quotes
function viewProviderKyc(providerId) {
  var token = localStorage.getItem('sl_token');
  closeKycModal(); // remove any existing modal

  // Overlay
  var overlay = document.createElement('div');
  overlay.id = 'kyc-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  // Card
  var card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(160deg,#18181f 0%,#1f1f2a 100%);border-radius:24px;padding:32px;max-width:720px;width:100%;max-height:92vh;overflow-y:auto;position:relative;border:1px solid rgba(255,255,255,0.06);box-shadow:0 40px 100px rgba(0,0,0,0.6);';

  // Close button — uses named function, no inline quote issues
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'position:absolute;top:18px;right:18px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;';
  closeBtn.addEventListener('click', closeKycModal);
  card.appendChild(closeBtn);

  // Title
  var title = document.createElement('div');
  title.style.cssText = 'font-size:17px;font-weight:700;color:#FFFFFF;margin-bottom:24px;display:flex;align-items:center;gap:10px;letter-spacing:-0.01em;';
  title.innerHTML = '<span style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#2a2a2a,#111);display:inline-flex;align-items:center;justify-content:center;font-size:17px;">🪪</span> KYC Verification';
  card.appendChild(title);

  // Content area
  var content = document.createElement('div');
  content.id = 'kyc-modal-content';
  content.style.cssText = 'text-align:center;color:#888;padding:20px;';
  content.textContent = 'Loading documents...';
  card.appendChild(content);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Fetch images
  axios.get('/api/admin/providers/' + providerId + '/kyc-images', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      var imgs = r.data.images || {};
      var ct = document.getElementById('kyc-modal-content');
      if (!ct) return;
      ct.innerHTML = '';
      ct.style.textAlign = 'left';
      ct.style.padding = '0';

      var hasAny = imgs.kyc_front_url || imgs.kyc_back_url || imgs.kyc_selfie_url;
      if (!hasAny && !imgs.kyc_card_number) {
        ct.style.textAlign = 'center'; ct.style.padding = '40px 20px';
        var noDocDiv = document.createElement('div');
        noDocDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;';
        noDocDiv.innerHTML =
          '<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:4px;">📋</div>' +
          '<div style="font-size:16px;font-weight:700;color:#FFFFFF;">No documents uploaded</div>' +
          '<div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;max-width:300px;">This provider hasn\'t submitted KYC documents yet.</div>' +
          '<div style="margin-top:8px;padding:10px 20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);border-radius:100px;font-size:12px;color:rgba(255,255,255,0.5);">Status: Awaiting Submission</div>';
        ct.appendChild(noDocDiv);
        return;
      }
      if (imgs.kyc_card_number) {
        var cardBox = document.createElement('div');
        cardBox.style.cssText = 'margin-bottom:24px;padding:16px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:16px;';
        var cardLbl = document.createElement('div');
        cardLbl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.08em;';
        cardLbl.textContent = 'Ghana Card Number';
        var cardVal = document.createElement('div');
        cardVal.style.cssText = 'font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:0.08em;font-family:monospace;';
        cardVal.textContent = imgs.kyc_card_number;
        cardBox.appendChild(cardLbl); cardBox.appendChild(cardVal);
        ct.appendChild(cardBox);
      }
      // Helper — normalise any stored image value to a usable src
      function normImgSrc(src) {
        if (!src || typeof src !== 'string' || src.trim() === '') return null;
        var s = src.trim();
        // Already a proper data URL or HTTP URL
        if (s.startsWith('data:image') || s.startsWith('http')) return s;
        // Raw base64 without the data: prefix — reconstruct it
        if (/^[A-Za-z0-9+/=]{20,}/.test(s)) return 'data:image/jpeg;base64,' + s;
        return null;
      }
      var frontSrc  = normImgSrc(imgs.kyc_front_url);
      var backSrc   = normImgSrc(imgs.kyc_back_url);
      var selfieSrc = normImgSrc(imgs.kyc_selfie_url);
      if (frontSrc)  addKycImgSection(ct, 'GHANA CARD — FRONT', frontSrc, false);
      else if (imgs.kyc_front_url) addKycImgSection(ct, 'GHANA CARD — FRONT (unreadable)', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', false);
      if (backSrc)   addKycImgSection(ct, 'GHANA CARD — BACK', backSrc, false);
      else if (imgs.kyc_back_url)  addKycImgSection(ct, 'GHANA CARD — BACK (unreadable)',  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', false);
      if (selfieSrc) addKycImgSection(ct, 'LIVE SELFIE', selfieSrc, true);
      else if (imgs.kyc_selfie_url) addKycImgSection(ct, 'LIVE SELFIE (unreadable)',        'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', true);
    })
    .catch(function(e) {
      var ct = document.getElementById('kyc-modal-content');
      if (ct) { ct.style.color='var(--s-red)'; ct.textContent = 'Failed to load documents.' + (e.response && e.response.status===403 ? ' Session expired.' : ''); }
    });
}

// Legacy alias
function loadKycImages(providerId) { viewProviderKyc(providerId); }

// View KYC image in lightbox
function viewImgBtn(el) {
  viewImg(el.src, el.getAttribute('data-caption') || 'Image');
}
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
    .then(function() {
      showToast('Provider approved ✦', 'success');
      // Remove from KYC queue immediately
      var row = document.getElementById('kyc-row-' + id);
      if (row) row.remove();
      // Update provider table action buttons without full reload
      loadProviders();
    })
    .catch(function() { showToast('Action failed', 'error'); });
}

function rejectKyc(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/providers/' + id + '/kyc', { kyc_status: 'rejected', is_verified: false }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() {
      showToast('Provider rejected', 'info');
      var row = document.getElementById('kyc-row-' + id);
      if (row) row.remove();
      loadProviders();
    })
    .catch(function() { showToast('Action failed', 'error'); });
}

// ── PLATFORM FEES ──
function loadFeeSummary() {
  var token = localStorage.getItem('sl_token');
  var h = { Authorization: 'Bearer ' + token };
  axios.get('/api/admin/service-fees?status=pending', { headers: h }).then(function(r) {
    var s = r.data.summary || {};
    var pa = document.getElementById('admin-fees-pending-amt');
    var od = document.getElementById('admin-fees-overdue');
    if (pa) pa.textContent = 'GHS ' + ((s.total_pending_amount || 0) / 100).toFixed(2);
    if (od) od.textContent = s.overdue_count || 0;
  }).catch(function(){});
  axios.get('/api/admin/service-fees?status=paid', { headers: h }).then(function(r) {
    var s = r.data.summary || {};
    var pa = document.getElementById('admin-fees-paid-amt');
    if (pa) pa.textContent = 'GHS ' + ((s.total_pending_amount || 0) / 100).toFixed(2);
  }).catch(function(){});
}

function loadFees(status) {
  var token = localStorage.getItem('sl_token');
  var url = '/api/admin/service-fees' + (status ? '?status=' + status : '');
  axios.get(url, { headers: { Authorization: 'Bearer ' + token } }).then(function(r) {
    var tbody = document.getElementById('fees-tbody');
    if (!tbody) return;
    var fees = r.data.fees || [];
    if (!fees.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--t-muted);">No fees found</td></tr>'; return; }
    tbody.innerHTML = fees.map(function(f) {
      var isOverdue = f.status === 'pending' && new Date(f.due_date) < new Date();
      return '<tr>' +
        '<td style="font-weight:700;">' + f.business_name + '</td>' +
        '<td style="font-size:11px;">' + f.provider_email + '</td>' +
        '<td>' + f.booking_date + '</td>' +
        '<td style="font-weight:700;color:var(--g-main);">GHS ' + ((f.fee_amount||0)/100).toFixed(2) + '</td>' +
        '<td>' + f.due_date + '</td>' +
        '<td><span class="badge ' + (f.status==='paid'?'badge-verified':isOverdue?'':'badge-pending') + '" style="' + (isOverdue?'background:rgba(224,112,112,0.15);color:var(--s-red);border-color:rgba(224,112,112,0.3);':'') + '">' + (f.status==='paid'?'✓ Paid':isOverdue?'⚠ Overdue':'⏳ Pending') + '</span></td>' +
        '<td>' + (f.status !== 'paid' ? '<button onclick="markFeePaid(' + f.id + ')" class="btn-primary" style="padding:5px 12px;font-size:10px;">Mark Paid</button>' : '—') + '</td>' +
      '</tr>';
    }).join('');
  }).catch(function(){});
}

function markFeePaid(id) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/service-fees/' + id + '/pay', {}, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Fee marked as paid ✦', 'success'); loadFees('pending'); loadFeeSummary(); })
    .catch(function() { showToast('Action failed', 'error'); });
}

// ── REGISTRANTS ──
function loadRegistrants(days) {
  var token = localStorage.getItem('sl_token');
  axios.get('/api/admin/registrants?days=' + days, { headers: { Authorization: 'Bearer ' + token } }).then(function(r) {
    var summary = document.getElementById('reg-count-summary');
    var counts = r.data.counts || [];
    var countMap = {};
    counts.forEach(function(c) { countMap[c.role] = c.count; });
    if (summary) {
      summary.innerHTML = '📊 Last ' + days + ' days: <strong>' + (countMap.customer || 0) + ' customers</strong>, <strong>' + (countMap.provider || 0) + ' providers</strong>, <strong>' + (countMap.admin || 0) + ' admins</strong>';
    }
    var tbody = document.getElementById('registrants-tbody');
    if (!tbody) return;
    var regs = r.data.registrants || [];
    if (!regs.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--t-muted);">No registrations in this period</td></tr>'; return; }
    tbody.innerHTML = regs.map(function(u) {
      return '<tr>' +
        '<td style="font-weight:700;">' + u.first_name + ' ' + u.last_name + '</td>' +
        '<td style="font-size:11px;">' + u.email + '</td>' +
        '<td style="font-size:11px;">' + (u.phone || '—') + '</td>' +
        '<td><span class="badge ' + (u.role==='provider'?'badge-live':u.role==='admin'?'badge-verified':'badge-pending') + '">' + u.role + '</span></td>' +
        '<td style="font-size:11px;">' + (u.business_name || '—') + '</td>' +
        '<td><span class="badge ' + (u.kyc_status==='approved'?'badge-verified':u.kyc_status==='rejected'?'badge-error':'badge-pending') + '">' + (u.kyc_status || (u.role === 'customer' ? 'auto' : 'pending')) + '</span></td>' +
        '<td style="font-size:11px;">' + new Date(u.created_at).toLocaleDateString() + '</td>' +
        '<td>' + (u.role === 'provider' && u.kyc_status !== 'approved' ? '<button onclick="quickApprove(' + (u.provider_id || 0) + ')" class="btn-primary" style="padding:5px 12px;font-size:10px;">Approve</button>' : u.role === 'customer' ? '<span style="color:var(--s-green);font-size:11px;">✓ Auto</span>' : '—') + '</td>' +
      '</tr>';
    }).join('');
  }).catch(function(){});
}

function quickApprove(providerId) {
  if (!providerId) return;
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/admin/providers/' + providerId + '/approve', {}, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Provider approved! ✦', 'success'); loadRegistrants(30); })
    .catch(function() { showToast('Approval failed', 'error'); });
}

// ── DAILY RECONCILIATION ──
function loadReconcile() {
  var token = localStorage.getItem('sl_token');
  var date = document.getElementById('reconcile-date').value;
  if (!date) { showToast('Please select a date', 'error'); return; }
  axios.get('/api/admin/daily-reconciliation?date=' + date, { headers: { Authorization: 'Bearer ' + token } }).then(function(r) {
    var s = r.data.summary || {};
    document.getElementById('rec-total-fees').textContent = s.total_fees || 0;
    document.getElementById('rec-paid').textContent = s.paid_count || 0;
    document.getElementById('rec-pending').textContent = s.pending_count || 0;
    document.getElementById('rec-amount').textContent = 'GHS ' + ((s.total_amount || 0) / 100).toFixed(2);

    var tbody = document.getElementById('reconcile-tbody');
    if (!tbody) return;
    var fees = r.data.fees || [];
    if (!fees.length) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--t-muted);">No bookings on ' + date + '</td></tr>'; return; }
    tbody.innerHTML = fees.map(function(f) {
      var isPaid = f.status === 'paid';
      return '<tr>' +
        '<td style="font-weight:700;">' + f.business_name + '</td>' +
        '<td style="font-size:11px;">' + f.email + '<br><span style="color:var(--t-muted);">' + (f.phone||'') + '</span></td>' +
        '<td style="font-weight:700;color:var(--g-main);">GHS ' + ((f.fee_amount||0)/100).toFixed(2) + '</td>' +
        '<td><span class="badge ' + (isPaid?'badge-verified':'badge-pending') + '">' + (isPaid?'✓ Paid':'⏳ Pending') + '</span></td>' +
        '<td>' + (!isPaid ? '<button onclick="markFeePaid(' + f.id + ')" class="btn-primary" style="padding:5px 12px;font-size:10px;">Mark Paid</button>' : '✓') + '</td>' +
      '</tr>';
    }).join('');
  }).catch(function(e) { showToast('Failed to load reconciliation', 'error'); });
}

// ══════════════════════════════════════════════════════════════
// PAYMENT DASHBOARD FUNCTIONS
// ══════════════════════════════════════════════════════════════
var _allTransactions = [];
var _selectedTxnIds = new Set();

function ghs(pesewas) {
  return 'GHS ' + ((pesewas||0)/100).toFixed(2);
}

function loadPaymentSummary() {
  var token = localStorage.getItem('sl_token');
  // Load summary KPIs
  axios.get('/api/payments/admin/summary', { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) {
      var s = r.data.summary || {};
      document.getElementById('pay-kpi-gross').textContent    = ghs(s.total_gross);
      document.getElementById('pay-kpi-platform').textContent = ghs(s.total_platform_revenue);
      document.getElementById('pay-kpi-pending').textContent  = ghs(s.pending_payouts);
      document.getElementById('pay-kpi-paidout').textContent  = ghs(s.paid_out);

      // Payout list
      var provs = r.data.by_provider || [];
      var sel = document.getElementById('pay-filter-provider');
      sel.innerHTML = '<option value="">All Providers</option>';
      provs.forEach(function(p) {
        sel.innerHTML += '<option value="'+p.provider_id+'">'+p.business_name+'</option>';
      });
      renderPayoutList(provs);

      // Recent transactions
      _allTransactions = r.data.recent_transactions || [];
      renderTransactions(_allTransactions);
    })
    .catch(function(e) { showToast('Failed to load payment data','error'); });
}

function renderPayoutList(provs) {
  var tb = document.getElementById('payout-list-tbody');
  var pending = provs.filter(function(p) { return (p.pending_amount||0) > 0; });
  if (!pending.length) {
    tb.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--t-muted);">No pending payouts 🎉</td></tr>';
    return;
  }
  tb.innerHTML = pending.map(function(p) {
    var safeName = (p.business_name||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return '<tr>' +
      '<td><strong>'+p.business_name+'</strong></td>' +
      '<td>'+(p.momo_number ? '<span style="font-family:monospace;">'+p.momo_number+'</span><br><small style="color:var(--t-muted);">'+(p.momo_name||'')+'</small>' : '<span style="color:#E07070;font-size:11px;">⚠ No MoMo set</span>')+'</td>' +
      '<td style="text-align:center;"><span style="background:rgba(224,112,112,0.1);color:#E07070;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;">'+p.pending_count+' txns</span></td>' +
      '<td><strong style="color:#E07070;">'+ghs(p.pending_amount)+'</strong></td>' +
      '<td><button onclick="markProviderPaid('+p.provider_id+')" data-pname="'+safeName+'" style="padding:6px 14px;border-radius:100px;font-size:11px;font-weight:700;background:#5DC98A;color:white;border:none;cursor:pointer;">✅ Pay All</button></td>' +
    '</tr>';
  }).join('');
}

function renderTransactions(txns) {
  _selectedTxnIds.clear();
  document.getElementById('selected-count').textContent = '0 selected';
  var tb = document.getElementById('transactions-tbody');
  if (!txns.length) {
    tb.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--t-muted);">No transactions found</td></tr>';
    return;
  }
  tb.innerHTML = txns.map(function(t) {
    var isPaid = t.payout_status === 'paid';
    var dt = new Date(t.created_at).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'});
    return '<tr>' +
      '<td><input type="checkbox" class="txn-check" data-id="'+t.id+'" '+(isPaid?'disabled':'')+' onchange="toggleTxn(this)"></td>' +
      '<td style="white-space:nowrap;font-size:11px;">'+dt+'</td>' +
      '<td>'+t.first_name+' '+t.last_name+'<br><small style="color:var(--t-muted);">'+t.customer_email+'</small></td>' +
      '<td><strong>'+t.business_name+'</strong>'+(t.momo_number?'<br><small style="color:var(--t-muted);font-family:monospace;">'+t.momo_number+'</small>':'')+'</td>' +
      '<td style="font-size:12px;">'+t.service_name+'<br><small style="color:var(--t-muted);">'+t.booking_date+'</small></td>' +
      '<td style="font-weight:700;">'+ghs(t.amount_paid)+'</td>' +
      '<td style="color:var(--g-main);font-weight:600;">'+ghs(t.platform_fee)+'</td>' +
      '<td style="color:#5DC98A;font-weight:600;">'+ghs(t.provider_earning)+'</td>' +
      '<td><span style="padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;background:'+(isPaid?'rgba(93,201,138,0.12)':'rgba(224,112,112,0.1)')+';color:'+(isPaid?'#5DC98A':'#E07070')+';">'+(isPaid?'✅ Paid':'⏳ Pending')+'</span></td>' +
      '<td style="font-size:10px;font-family:monospace;color:var(--t-muted);">'+t.payment_reference+'</td>' +
    '</tr>';
  }).join('');
}

function filterTransactions() {
  var provId = document.getElementById('pay-filter-provider').value;
  var status = document.getElementById('pay-filter-status').value;
  var token = localStorage.getItem('sl_token');
  var params = new URLSearchParams();
  if (provId) params.set('provider_id', provId);
  if (status) params.set('payout_status', status);
  axios.get('/api/payments/admin/transactions?'+params.toString(), { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) { _allTransactions = r.data.transactions||[]; renderTransactions(_allTransactions); })
    .catch(function() { showToast('Filter failed','error'); });
}

function toggleTxn(checkbox) {
  var id = parseInt(checkbox.getAttribute('data-id'));
  if (checkbox.checked) _selectedTxnIds.add(id);
  else _selectedTxnIds.delete(id);
  document.getElementById('selected-count').textContent = _selectedTxnIds.size + ' selected';
}

function toggleAllTxn(master) {
  document.querySelectorAll('.txn-check:not(:disabled)').forEach(function(cb) {
    cb.checked = master.checked;
    var id = parseInt(cb.getAttribute('data-id'));
    if (master.checked) _selectedTxnIds.add(id);
    else _selectedTxnIds.delete(id);
  });
  document.getElementById('selected-count').textContent = _selectedTxnIds.size + ' selected';
}

function bulkMarkPaid() {
  if (_selectedTxnIds.size === 0) { showToast('Select at least one transaction','error'); return; }
  if (!confirm('Mark '+_selectedTxnIds.size+' transaction(s) as paid out?')) return;
  var token = localStorage.getItem('sl_token');
  axios.post('/api/payments/admin/payout', { transaction_ids: Array.from(_selectedTxnIds) }, { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) { showToast(r.data.message || 'Marked as paid','success'); loadPaymentSummary(); })
    .catch(function(e) { showToast(e.response?.data?.error||'Failed','error'); });
}

function markProviderPaid(providerId, name) {
  if (!name) {
    var btn = document.querySelector('[onclick*="markProviderPaid('+providerId+')"]');
    name = (btn && btn.getAttribute('data-pname')) || 'this provider';
  }
  if (!confirm('Mark ALL pending transactions for '+name+' as paid out?')) return;
  var token = localStorage.getItem('sl_token');
  axios.post('/api/payments/admin/payout', { provider_id: providerId, notes:'Bulk payout by admin' }, { headers:{ Authorization:'Bearer '+token }})
    .then(function(r) { showToast('All paid for '+name,'success'); loadPaymentSummary(); })
    .catch(function(e) { showToast(e.response?.data?.error||'Failed','error'); });
}

function exportTransactions() {
  var headers = ['Date','Customer','Customer Email','Provider','MoMo','Service','Booking Date','Gross GHS','Platform Fee GHS','Provider Earning GHS','Payout Status','Reference'];
  var rows = _allTransactions.map(function(t) {
    return [
      t.created_at, t.first_name+' '+t.last_name, t.customer_email,
      t.business_name, t.momo_number||'', t.service_name, t.booking_date,
      (t.amount_paid/100).toFixed(2), (t.platform_fee/100).toFixed(2),
      (t.provider_earning/100).toFixed(2), t.payout_status, t.payment_reference
    ].join(',');
  });
  var csv = [headers.join(',')].concat(rows).join('\\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'salonlink-transactions-'+new Date().toISOString().split('T')[0]+'.csv';
  a.click();
  showToast('CSV exported','success');
}
</script>
</body></html>`
