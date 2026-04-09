import { baseHead, globalScripts } from '../utils/layout'

export const providerDashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Dashboard', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
/* ─ Layout ─ */
.pdash { display:flex; min-height:100vh; background:var(--c-void); }
.sidebar {
  width:240px; background:var(--c-deep); border-right:1px solid var(--i-faint);
  flex-shrink:0; display:flex; flex-direction:column;
  position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:300;
  transition:transform 0.3s ease;
}
.main-area { flex:1; min-width:0; margin-left:240px; }
.topbar {
  padding:14px 20px; background:var(--c-deep); border-bottom:1px solid var(--i-faint);
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; z-index:200; backdrop-filter:blur(20px);
}
.content-pad { padding:20px; padding-bottom:90px; }
/* ─ Sidebar items ─ */
.sidebar-item {
  display:flex; align-items:center; gap:10px; padding:11px 14px;
  border-radius:12px; cursor:pointer; transition:all 0.2s;
  background:none; border:none; width:100%; text-align:left;
  color:var(--t-secondary); font-size:13px; font-weight:500;
}
.sidebar-item:hover { background:var(--i-ghost); color:var(--t-primary); }
.sidebar-item.active { background:var(--g-dim); border:1px solid var(--g-border); color:var(--g-main); }
.sidebar-item .icon { width:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
/* ─ Sections ─ */
.section { display:none; }
.section.active { display:block; }
/* ─ Cards ─ */
.kpi-card {
  background:var(--c-surface); border:1px solid var(--i-faint); border-radius:16px;
  padding:18px; position:relative; overflow:hidden; transition:all 0.3s;
}
.kpi-card:hover { border-color:var(--g-border); transform:translateY(-2px); }
.kpi-val { font-family:'Playfair Display',serif; font-size:26px; background:linear-gradient(90deg,var(--g-deep),var(--g-main)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:4px; }
.kpi-lbl { font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--t-muted); }
.kpi-sub { font-size:11px; color:var(--s-green); margin-top:4px; }
.kpi-icon { font-size:22px; margin-bottom:10px; }
/* ─ Appointment row ─ */
.appt-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; cursor:pointer; transition:background 0.2s; flex-wrap:wrap; }
.appt-row:hover { background:var(--i-ghost); }
.mini-avatar { width:38px; height:38px; border-radius:12px; background:linear-gradient(135deg,var(--c-mist),var(--g-dim)); border:1px solid var(--g-border); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:15px; color:var(--g-main); flex-shrink:0; }
/* ─ Mobile bottom nav ─ */
.mob-nav {
  display:none; position:fixed; bottom:0; left:0; right:0; z-index:400;
  background:var(--c-deep); border-top:1px solid var(--i-faint);
  padding:8px 0 env(safe-area-inset-bottom,8px);
  backdrop-filter:blur(20px);
}
.mob-nav-inner { display:flex; align-items:center; justify-content:space-around; }
.mob-nav-btn {
  display:flex; flex-direction:column; align-items:center; gap:3px;
  background:none; border:none; cursor:pointer; padding:6px 10px;
  color:var(--t-muted); font-size:9px; font-weight:600; letter-spacing:0.06em;
  text-transform:uppercase; transition:color 0.2s;
}
.mob-nav-btn.active { color:var(--g-main); }
.mob-nav-btn svg { width:20px; height:20px; }
/* ─ Overlay for mobile sidebar ─ */
.sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:299; }
/* ─ Forms ─ */
.form-grid { display:grid; grid-template-columns:1fr 110px 130px; gap:10px; margin-bottom:10px; }
/* ─ Mobile responsive ─ */
@media(max-width:768px){
  .sidebar { transform:translateX(-100%); }
  .sidebar.open { transform:translateX(0); }
  .sidebar-overlay.open { display:block; }
  .main-area { margin-left:0; }
  .kpi-grid { grid-template-columns:repeat(2,1fr) !important; }
  .chart-grid { grid-template-columns:1fr !important; }
  .mob-nav { display:block; }
  .desktop-topbar-extra { display:none; }
  .form-grid { grid-template-columns:1fr; }
  .content-pad { padding:14px; padding-bottom:90px; }
  .appt-actions { width:100%; justify-content:flex-end; }
}
@media(min-width:769px){
  .mob-nav { display:none !important; }
}
/* ─ Toggle switch ─ */
.toggle-wrap { display:flex; align-items:center; gap:10px; }
.toggle { position:relative; display:inline-block; width:44px; height:24px; }
.toggle input { opacity:0; width:0; height:0; }
.toggle-slider { position:absolute; cursor:pointer; inset:0; background:var(--c-raise); border-radius:34px; transition:0.3s; }
.toggle-slider:before { position:absolute; content:''; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.3s; }
input:checked + .toggle-slider { background:var(--s-green); }
input:checked + .toggle-slider:before { transform:translateX(20px); }
/* ─ Service list item ─ */
.svc-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--c-raise); border-radius:12px; margin-bottom:8px; }
</style>
`)}
</head>
<body style="background:var(--c-void);">

<!-- Sidebar overlay (mobile) -->
<div class="sidebar-overlay" id="sb-overlay" onclick="closeSidebar()"></div>

<div class="pdash">

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="sidebar" id="sidebar">
    <!-- Logo -->
    <div style="padding:20px 16px;border-bottom:1px solid var(--i-faint);display:flex;align-items:center;justify-content:space-between;">
      <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
        <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-star" style="color:#fff;font-size:11px;"></i>
        </div>
        <span style="font-family:'Playfair Display',serif;font-size:15px;letter-spacing:0.08em;color:var(--t-primary);">SALONLINK</span>
      </a>
      <button onclick="closeSidebar()" style="background:none;border:none;color:var(--t-muted);cursor:pointer;display:none;" id="close-sb-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Provider info -->
    <div style="padding:14px 12px;border-bottom:1px solid var(--i-faint);">
      <div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:12px;">
        <div style="width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;" id="sb-avatar">💇‍♀️</div>
        <div style="min-width:0;flex:1;">
          <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" id="sb-name">Loading...</div>
          <span class="badge badge-pending" style="font-size:9px;margin-top:3px;display:inline-flex;" id="sb-badge">⏳ Pending</span>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav style="flex:1;padding:10px;overflow-y:auto;">
      ${[
        {icon:'🏠', label:'Overview',      id:'overview'},
        {icon:'📅', label:'Appointments',  id:'appts'},
        {icon:'✂️', label:'My Services',   id:'settings'},
        {icon:'🖼️', label:'My Gallery',    id:'gallery'},
        {icon:'📍', label:'Location',      id:'location'},
        {icon:'💰', label:'Platform Fees', id:'fees'},
        {icon:'🪪', label:'KYC Status',    id:'kyc'},
        {icon:'👥', label:'Clients',       id:'clients'},
      ].map((l,i)=>`
        <button onclick="showSection('${l.id}',this)" class="sidebar-item ${i===0?'active':''}" id="nav-${l.id}">
          <span class="icon">${l.icon}</span>
          <span>${l.label}</span>
        </button>
      `).join('')}
    </nav>

    <!-- Bottom -->
    <div style="padding:10px;border-top:1px solid var(--i-faint);">
      <button onclick="viewPublicProfile()" class="sidebar-item">
        <span class="icon">🔗</span><span>View My Profile</span>
      </button>
      <button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;">
        <span class="icon">🚪</span><span>Sign Out</span>
      </button>
    </div>
  </aside>

  <!-- ═══ MAIN ═══ -->
  <div class="main-area">

    <!-- Topbar -->
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:12px;">
        <!-- Hamburger (mobile) -->
        <button onclick="openSidebar()" id="hamburger" style="background:none;border:none;cursor:pointer;padding:4px;color:var(--t-primary);display:none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--t-primary);" id="sec-title">Overview</div>
          <div style="font-size:11px;color:var(--t-muted);">Provider Dashboard</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;" class="desktop-topbar-extra">
        <div class="toggle-wrap">
          <span style="font-size:11px;color:var(--t-muted);">Accepting Bookings</span>
          <label class="toggle">
            <input type="checkbox" id="accepting-toggle" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="content-pad">

      <!-- ── OVERVIEW ── -->
      <div id="sec-overview" class="section active">

        <!-- Pending banner -->
        <div id="pending-banner" style="display:none;background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05));border:1px solid rgba(201,168,76,0.3);border-radius:14px;padding:16px 18px;margin-bottom:20px;">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <span style="font-size:24px;">⏳</span>
            <div>
              <div style="font-size:14px;font-weight:700;margin-bottom:4px;">Pending Admin Approval</div>
              <div style="font-size:12px;color:var(--t-secondary);line-height:1.6;">Your profile is ready. You'll be visible to customers once admin approves your account. Use this time to upload photos, set your location and add services.</div>
            </div>
          </div>
        </div>

        <!-- KPI row -->
        <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
          <div class="kpi-card"><div class="kpi-icon">📅</div><div class="kpi-val" id="kpi-today">0</div><div class="kpi-lbl">Today's Bookings</div></div>
          <div class="kpi-card"><div class="kpi-icon">💰</div><div class="kpi-val" id="kpi-revenue">GHS 0</div><div class="kpi-lbl">Week Revenue</div></div>
          <div class="kpi-card"><div class="kpi-icon">👥</div><div class="kpi-val" id="kpi-clients">0</div><div class="kpi-lbl">Total Clients</div></div>
          <div class="kpi-card"><div class="kpi-icon">⭐</div><div class="kpi-val" id="kpi-rating">—</div><div class="kpi-lbl">Avg Rating</div></div>
        </div>

        <!-- Today's appointments -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;margin-bottom:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div style="font-size:13px;font-weight:700;">Today's Appointments</div>
            <button onclick="showSection('appts',document.getElementById('nav-appts'))" style="font-size:11px;color:var(--g-main);background:none;border:none;cursor:pointer;font-weight:600;">View All →</button>
          </div>
          <div id="today-appts">
            <div style="text-align:center;padding:24px;color:var(--t-muted);font-size:12px;">Loading...</div>
          </div>
        </div>

        <!-- Mobile accepting toggle -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:14px;padding:16px;display:none;" id="mob-toggle-card" class="mobile-only">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:13px;font-weight:700;">Accepting Bookings</div>
              <div style="font-size:11px;color:var(--t-muted);margin-top:2px;">Toggle to start or stop accepting new bookings</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="accepting-toggle-mob" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- ── APPOINTMENTS ── -->
      <div id="sec-appts" class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <div style="font-size:13px;font-weight:700;color:var(--t-primary);">All Appointments</div>
          <div style="display:flex;gap:8px;overflow-x:auto;flex-wrap:nowrap;">
            ${['All','Pending','Confirmed','Completed'].map((s,i)=>`<button onclick="filterAppts(this,'${s}')" style="padding:7px 16px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all 0.2s;background:${i===0?'var(--g-dim)':'transparent'};border:${i===0?'1px solid var(--g-border)':'1px solid var(--i-faint)'};color:${i===0?'var(--g-main)':'var(--t-secondary)'};">${s}</button>`).join('')}
          </div>
        </div>
        <div id="appts-list">
          <div style="text-align:center;padding:32px;color:var(--t-muted);">Loading appointments...</div>
        </div>
      </div>

      <!-- ── SERVICES / SETTINGS ── -->
      <div id="sec-settings" class="section">
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-size:14px;font-weight:700;">My Services</div>
              <div style="font-size:11px;color:var(--t-muted);margin-top:2px;">Add or remove services you offer</div>
            </div>
            <button onclick="showAddSvcForm()" class="btn-primary" style="padding:9px 18px;font-size:12px;">+ Add Service</button>
          </div>
          <!-- Add form -->
          <div id="add-svc-form" style="display:none;background:var(--c-raise);border:1px solid var(--i-faint);border-radius:12px;padding:14px;margin-bottom:14px;">
            <div class="form-grid">
              <input type="text" id="new-svc-name" class="input" placeholder="Service name" style="font-size:13px;" />
              <input type="number" id="new-svc-price" class="input" placeholder="GHS price" min="1" style="font-size:13px;" />
              <input type="number" id="new-svc-duration" class="input" placeholder="Duration (mins)" value="60" min="5" step="5" style="font-size:13px;" />
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;">
              <button onclick="saveNewService()" class="btn-primary" style="padding:9px 18px;font-size:12px;">Save</button>
              <button onclick="document.getElementById('add-svc-form').style.display='none'" class="btn-ghost" style="padding:9px 18px;font-size:12px;">Cancel</button>
            </div>
          </div>
          <div id="my-services-list">
            <div style="text-align:center;color:var(--t-muted);padding:20px;">Loading services...</div>
          </div>
        </div>

        <!-- Business Info -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;margin-top:16px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:14px;">Business Info</div>
          <div style="display:grid;gap:12px;">
            <div>
              <label style="font-size:11px;color:var(--t-muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;">Business Name</label>
              <input type="text" id="edit-biz-name" class="input" placeholder="e.g. Glam Studio GH" style="font-size:13px;width:100%;box-sizing:border-box;" />
            </div>
            <div>
              <label style="font-size:11px;color:var(--t-muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;">Bio</label>
              <textarea id="edit-bio" class="input" rows="3" placeholder="Tell customers about yourself..." style="font-size:13px;width:100%;box-sizing:border-box;resize:vertical;"></textarea>
            </div>
            <div>
              <label style="font-size:11px;color:var(--t-muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;">Phone</label>
              <input type="text" id="edit-phone" class="input" placeholder="+233 20 000 0000" style="font-size:13px;width:100%;box-sizing:border-box;" />
            </div>
            <div>
              <label style="font-size:11px;color:var(--t-muted);text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:5px;">City</label>
              <input type="text" id="edit-city" class="input" placeholder="e.g. Accra" style="font-size:13px;width:100%;box-sizing:border-box;" />
            </div>
            <button onclick="saveProfile()" class="btn-primary" style="padding:11px;font-size:12px;justify-content:center;">Save Changes</button>
          </div>
        </div>
      </div>

      <!-- ── GALLERY ── -->
      <div id="sec-gallery" class="section">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-size:14px;font-weight:700;">My Gallery</div>
            <div style="font-size:11px;color:var(--t-muted);margin-top:2px;" id="gallery-count-label">Free plan: 0/5 photos</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button onclick="triggerLogoUpload()" class="btn-ghost" style="padding:9px 16px;font-size:12px;">📸 Logo</button>
            <button onclick="triggerGalleryUpload()" class="btn-primary" style="padding:9px 16px;font-size:12px;">+ Add Photo</button>
          </div>
        </div>

        <!-- Pro Banner -->
        <div id="pro-banner" style="background:linear-gradient(135deg,rgba(193,68,178,0.1),rgba(131,58,180,0.1));border:1px solid rgba(193,68,178,0.25);border-radius:14px;padding:16px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div>
            <div style="font-size:13px;font-weight:700;margin-bottom:3px;">🚀 Upgrade to Gallery Pro</div>
            <div style="font-size:11px;color:var(--t-secondary);">Upload up to 10 photos · GHS 10/month</div>
          </div>
          <button onclick="upgradeGallery()" style="background:linear-gradient(135deg,#833ab4,#c144b2);color:white;border:none;padding:9px 18px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;">Upgrade</button>
        </div>

        <!-- Logo preview -->
        <div style="margin-bottom:20px;">
          <div style="font-size:11px;font-weight:600;color:var(--t-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Business Logo</div>
          <div id="logo-preview" style="width:100px;height:100px;border-radius:14px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;" onclick="triggerLogoUpload()">
            <div style="text-align:center;color:var(--t-muted);"><div style="font-size:24px;">📷</div><div style="font-size:10px;margin-top:4px;">Add Logo</div></div>
          </div>
        </div>

        <!-- Gallery grid -->
        <div style="font-size:11px;font-weight:600;color:var(--t-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Salon Photos</div>
        <div id="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">
          <div style="aspect-ratio:1;border-radius:14px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:11px;color:var(--t-muted);" onclick="triggerGalleryUpload()">
            <div style="font-size:24px;margin-bottom:6px;">➕</div>Add Photo
          </div>
        </div>

        <input type="file" id="gallery-upload-input" accept="image/*" style="display:none;" />
        <input type="file" id="logo-upload-input" accept="image/*" style="display:none;" />
      </div>

      <!-- ── LOCATION ── -->
      <div id="sec-location" class="section">
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:6px;">📍 Your Business Location</div>
          <div style="font-size:12px;color:var(--t-muted);margin-bottom:16px;">Pin your exact location so customers can find you on the map.</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
            <button onclick="useMyLocation()" style="padding:10px 18px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#833ab4,#e1306c);color:white;border:none;">
              📍 Use My Location
            </button>
            <button onclick="saveLocation()" class="btn-primary" style="padding:10px 18px;font-size:12px;" id="save-location-btn" disabled>Save Location</button>
          </div>
          <div id="location-coords" style="font-size:12px;color:var(--t-muted);margin-bottom:12px;">No location set. Click the map or use the button above.</div>
          <div id="location-picker-map" style="width:100%;height:300px;border-radius:14px;border:1px solid var(--i-faint);overflow:hidden;"></div>
          <div style="font-size:11px;color:var(--t-muted);margin-top:8px;">💡 Drag the pin to fine-tune your exact location.</div>
        </div>
      </div>

      <!-- ── FEES ── -->
      <div id="sec-fees" class="section">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;" class="kpi-grid">
          <div class="kpi-card"><div class="kpi-icon">⏳</div><div class="kpi-val" id="fees-pending-amt">GHS 0</div><div class="kpi-lbl">Pending Fees</div></div>
          <div class="kpi-card"><div class="kpi-icon">✅</div><div style="font-family:'Playfair Display',serif;font-size:26px;color:var(--s-green);" id="fees-paid-amt">GHS 0</div><div class="kpi-lbl">Total Paid</div></div>
          <div class="kpi-card"><div class="kpi-icon">📋</div><div style="font-family:'Playfair Display',serif;font-size:26px;" id="fees-total-count">0</div><div class="kpi-lbl">Total Bookings</div></div>
        </div>
        <div id="fees-warning" style="display:none;background:rgba(224,112,112,0.1);border:1px solid rgba(224,112,112,0.3);border-radius:12px;padding:14px 16px;margin-bottom:18px;">
          <div style="font-size:13px;font-weight:700;color:var(--s-red);">⚠️ Pending Fees Due Tonight</div>
          <div style="font-size:12px;color:var(--t-secondary);margin-top:4px;">Contact admin to settle your balance and avoid service interruption.</div>
        </div>
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;overflow:hidden;">
          <div style="padding:16px 18px;border-bottom:1px solid var(--i-faint);display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:13px;font-weight:700;">Fee History</div>
            <span style="font-size:11px;color:var(--t-muted);">GHS 3 per booking</span>
          </div>
          <div id="fees-table-body" style="padding:14px;">
            <div style="text-align:center;color:var(--t-muted);padding:24px;">Loading fees...</div>
          </div>
        </div>
      </div>

      <!-- ── KYC ── -->
      <div id="sec-kyc" class="section">
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;" id="kyc-content">
          <div style="text-align:center;padding:24px;color:var(--t-muted);">Loading KYC status...</div>
        </div>
      </div>

      <!-- ── CLIENTS ── -->
      <div id="sec-clients" class="section">
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:16px;padding:20px;">
          <div style="font-size:14px;font-weight:700;margin-bottom:14px;">My Clients</div>
          <div id="clients-list">
            <div style="text-align:center;padding:32px;color:var(--t-muted);">Loading clients...</div>
          </div>
        </div>
      </div>

    </div><!-- /content-pad -->
  </div><!-- /main-area -->
</div><!-- /pdash -->

<!-- Mobile Bottom Nav -->
<div class="mob-nav">
  <div class="mob-nav-inner">
    ${[
      {id:'overview', icon:'🏠', label:'Home'},
      {id:'appts',    icon:'📅', label:'Bookings'},
      {id:'settings', icon:'✂️', label:'Services'},
      {id:'gallery',  icon:'🖼️', label:'Gallery'},
      {id:'location', icon:'📍', label:'Location'},
    ].map((l,i)=>`
      <button class="mob-nav-btn ${i===0?'active':''}" id="mob-nav-${l.id}" onclick="showSection('${l.id}',document.getElementById('nav-${l.id}'));updateMobNav('${l.id}');">
        <span style="font-size:18px;">${l.icon}</span>
        <span>${l.label}</span>
      </button>
    `).join('')}
  </div>
</div>

${globalScripts()}
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
/* ─── Sidebar ─── */
function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sb-overlay').classList.add('open');
  document.getElementById('close-sb-btn').style.display='block';
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-overlay').classList.remove('open');
}
// Show hamburger on mobile
if(window.innerWidth<=768){
  var hb=document.getElementById('hamburger'); if(hb) hb.style.display='block';
  var mc=document.getElementById('mob-toggle-card'); if(mc) mc.style.display='block';
}

/* ─── Section switching ─── */
var activeSectionId = 'overview';
function showSection(id, btn){
  document.querySelectorAll('.section').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.sidebar-item').forEach(function(b){ b.classList.remove('active'); });
  var sec=document.getElementById('sec-'+id);
  if(sec) sec.classList.add('active');
  if(btn) btn.classList.add('active');
  var titles={overview:'Overview',appts:'Appointments',settings:'My Services',gallery:'My Gallery',location:'Location',fees:'Platform Fees',kyc:'KYC Status',clients:'Clients'};
  var t=document.getElementById('sec-title'); if(t) t.textContent=titles[id]||id;
  activeSectionId=id;
  closeSidebar();
  // Load section data
  var tok=localStorage.getItem('sl_token');
  if(id==='gallery' && tok) loadGallery(tok);
  if(id==='fees') loadFees();
  if(id==='settings' && tok) loadMyServices(tok);
  if(id==='location') initMap();
  if(id==='kyc') loadKYC();
  if(id==='clients' && tok) loadClients(tok);
  if(id==='appts' && tok) loadAllAppts(tok,'All');
}
function updateMobNav(id){
  document.querySelectorAll('.mob-nav-btn').forEach(function(b){ b.classList.remove('active'); });
  var mb=document.getElementById('mob-nav-'+id); if(mb) mb.classList.add('active');
}

/* ─── Dashboard load ─── */
var providerIdGlobal=null;
var allApptsData=[];

(function init(){
  var tok=localStorage.getItem('sl_token');
  var usr=JSON.parse(localStorage.getItem('sl_user')||'{}');
  if(!tok||usr.role!=='provider'){ window.location.href='/login'; return; }

  axios.get('/api/providers/me/dashboard',{headers:{Authorization:'Bearer '+tok}})
    .then(function(res){
      var d=res.data, p=d.provider, st=d.stats||{};
      providerIdGlobal=p.id;

      // Sidebar
      var nm=document.getElementById('sb-name'); if(nm) nm.textContent=p.business_name||'My Salon';
      var bd=document.getElementById('sb-badge');
      if(bd){
        if(p.is_verified){ bd.className='badge badge-verified'; bd.textContent='✓ Verified'; }
        else { bd.className='badge badge-pending'; bd.textContent='⏳ Pending'; }
      }

      // Pending banner
      if(!p.is_verified){
        var pb=document.getElementById('pending-banner'); if(pb) pb.style.display='block';
      }

      // KPIs
      var setEl=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
      setEl('kpi-today', st.today_bookings||0);
      setEl('kpi-revenue','GHS '+(Math.round((st.week_revenue||0)/100)));
      setEl('kpi-clients', st.total_clients||0);
      setEl('kpi-rating',  st.rating||'—');

      // Gallery count
      var gcl=document.getElementById('gallery-count-label');
      if(gcl){ var mx=p.has_pro_gallery?10:5; gcl.textContent=(p.has_pro_gallery?'Pro':'Free')+' plan: '+(p.gallery_count||0)+'/'+mx+' photos'; }
      if(p.has_pro_gallery){ var pb2=document.getElementById('pro-banner'); if(pb2) pb2.style.display='none'; }

      // Logo preview
      if(p.avatar_url){
        var lp=document.getElementById('logo-preview');
        if(lp) lp.innerHTML='<img src="'+p.avatar_url+'" style="width:100%;height:100%;object-fit:cover;" />';
      }

      // Today's appointments
      var ta=document.getElementById('today-appts');
      var appts=d.today_appointments||[];
      if(ta){
        if(!appts.length){ ta.innerHTML='<div style="text-align:center;padding:24px;color:var(--t-muted);font-size:12px;">No appointments today ✦</div>'; }
        else {
          ta.innerHTML=appts.map(function(a){
            var bc=a.status==='confirmed'?'badge-verified':a.status==='completed'?'badge-success':'badge-pending';
            return '<div class="appt-row">'+
              '<div class="mini-avatar">'+(a.first_name||'C').charAt(0)+'</div>'+
              '<div style="flex:1;min-width:0;">'+
                '<div style="font-size:13px;font-weight:700;">'+(a.first_name||'')+' '+(a.last_name||'')+'</div>'+
                '<div style="font-size:11px;color:var(--t-muted);">'+(a.service_name||'')+' · '+(a.booking_time||'')+'</div>'+
              '</div>'+
              '<span class="badge '+bc+'" style="font-size:9px;">'+a.status+'</span>'+
              '<div class="appt-actions" style="display:flex;gap:6px;">'+
                (a.status==='pending'?'<button onclick="updateAppt('+a.id+',\'confirmed\')" class="btn-primary" style="padding:6px 12px;font-size:10px;">Confirm</button>':'')+
                (a.status==='confirmed'?'<button onclick="updateAppt('+a.id+',\'completed\')" style="padding:6px 12px;font-size:10px;background:none;border:1px solid var(--g-border);color:var(--g-main);border-radius:8px;cursor:pointer;">Done</button>':'')+
              '</div>'+
            '</div>';
          }).join('');
        }
      }

      // Accepting toggle
      var tog=document.getElementById('accepting-toggle');
      var togM=document.getElementById('accepting-toggle-mob');
      var setToggle=function(el){
        if(!el) return;
        el.checked=p.is_accepting_bookings===1;
        el.onchange=function(){
          axios.put('/api/providers/me',{is_accepting_bookings:this.checked},{headers:{Authorization:'Bearer '+tok}})
            .then(function(){ showToast('Status updated ✦','success'); })
            .catch(function(){ showToast('Update failed','error'); });
        };
      };
      setToggle(tog); setToggle(togM);

      // View profile link
      window._providerIdForProfile=p.id;

      // Pre-fill settings
      var bn=document.getElementById('edit-biz-name'); if(bn) bn.value=p.business_name||'';
      var bio=document.getElementById('edit-bio'); if(bio) bio.value=p.bio||'';
      var ph=document.getElementById('edit-phone'); if(ph) ph.value=p.phone||'';
      var ct=document.getElementById('edit-city'); if(ct) ct.value=p.city||'';

      // Load services immediately
      loadMyServices(tok);
    })
    .catch(function(e){ if(e.response&&e.response.status===401) window.location.href='/login'; });
})();

function viewPublicProfile(){
  if(window._providerIdForProfile) window.open('/provider/'+window._providerIdForProfile,'_blank');
  else showToast('Profile loading...','info');
}

/* ─── Load all appointments ─── */
function loadAllAppts(tok, filter){
  var el=document.getElementById('appts-list');
  if(!el) return;
  el.innerHTML='<div style="text-align:center;padding:24px;color:var(--t-muted);">Loading...</div>';
  axios.get('/api/bookings/provider',{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){
      allApptsData=r.data.bookings||[];
      renderAppts(allApptsData, filter||'All');
    }).catch(function(){
      el.innerHTML='<div style="text-align:center;padding:24px;color:var(--t-muted);">No appointments yet.</div>';
    });
}
function filterAppts(btn, s){
  document.querySelectorAll('#sec-appts button').forEach(function(b){ b.style.background='transparent'; b.style.borderColor='var(--i-faint)'; b.style.color='var(--t-secondary)'; });
  btn.style.background='var(--g-dim)'; btn.style.borderColor='var(--g-border)'; btn.style.color='var(--g-main)';
  renderAppts(allApptsData, s);
}
function renderAppts(list, filter){
  var el=document.getElementById('appts-list'); if(!el) return;
  var filtered=filter==='All'?list:list.filter(function(b){ return b.status===filter.toLowerCase(); });
  if(!filtered.length){ el.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">No '+filter.toLowerCase()+' appointments.</div>'; return; }
  el.innerHTML=filtered.map(function(b){
    var bc=b.status==='confirmed'?'badge-verified':b.status==='completed'?'badge-success':b.status==='cancelled'?'badge-error':'badge-pending';
    return '<div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'+
      '<div class="mini-avatar">'+(b.first_name||'C').charAt(0)+'</div>'+
      '<div style="flex:1;min-width:120px;">'+
        '<div style="font-size:13px;font-weight:700;">'+(b.first_name||'')+' '+(b.last_name||'')+'</div>'+
        '<div style="font-size:12px;color:var(--t-muted);">'+(b.service_name||'')+'</div>'+
        '<div style="font-size:11px;color:var(--t-faint);margin-top:2px;">'+(b.booking_date||'')+' · '+(b.booking_time||'')+'</div>'+
      '</div>'+
      '<div style="text-align:right;">'+
        '<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--g-main);">GHS '+(Math.round((b.total_amount||0)/100))+'</div>'+
        '<span class="badge '+bc+'" style="font-size:9px;margin-top:4px;display:inline-block;">'+b.status+'</span>'+
      '</div>'+
      '<div style="display:flex;gap:6px;width:100%;justify-content:flex-end;">'+
        (b.status==='pending'?'<button onclick="updateAppt('+b.id+',\'confirmed\')" class="btn-primary" style="padding:6px 14px;font-size:10px;">Confirm</button>':'') +
        (b.status==='confirmed'?'<button onclick="updateAppt('+b.id+',\'completed\')" style="padding:6px 14px;font-size:10px;background:none;border:1px solid var(--g-border);color:var(--g-main);border-radius:8px;cursor:pointer;">Mark Done</button>':'') +
        (b.status==='pending'||b.status==='confirmed'?'<button onclick="updateAppt('+b.id+',\'cancelled\')" style="padding:6px 14px;font-size:10px;background:none;border:1px solid rgba(224,112,112,0.3);color:var(--s-red);border-radius:8px;cursor:pointer;">Decline</button>':'')+
      '</div>'+
    '</div>';
  }).join('');
}
function updateAppt(id,status){
  var tok=localStorage.getItem('sl_token');
  axios.patch('/api/bookings/'+id+'/status',{status:status},{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Booking '+status+' ✦','success'); var t=localStorage.getItem('sl_token'); loadAllAppts(t,'All'); })
    .catch(function(){ showToast('Update failed','error'); });
}

/* ─── Services ─── */
function showAddSvcForm(){ document.getElementById('add-svc-form').style.display='block'; document.getElementById('new-svc-name').focus(); }
function saveNewService(){
  var tok=localStorage.getItem('sl_token');
  var name=document.getElementById('new-svc-name').value.trim();
  var price=parseInt(document.getElementById('new-svc-price').value)||0;
  var dur=parseInt(document.getElementById('new-svc-duration').value)||60;
  if(!name){ showToast('Enter a service name','error'); return; }
  if(!price){ showToast('Enter a price','error'); return; }
  axios.post('/api/providers/me/services',{name:name,price:price*100,duration:dur},{headers:{Authorization:'Bearer '+tok}})
    .then(function(){
      showToast('Service added ✦','success');
      document.getElementById('add-svc-form').style.display='none';
      document.getElementById('new-svc-name').value='';
      document.getElementById('new-svc-price').value='';
      document.getElementById('new-svc-duration').value='60';
      loadMyServices(tok);
    }).catch(function(e){ showToast(e.response?e.response.data.error:'Save failed','error'); });
}
function deleteService(id){
  if(!confirm('Delete this service?')) return;
  var tok=localStorage.getItem('sl_token');
  axios.delete('/api/providers/me/services/'+id,{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Service deleted','info'); loadMyServices(tok); })
    .catch(function(){ showToast('Delete failed','error'); });
}
function loadMyServices(tok){
  axios.get('/api/providers/me/services',{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){
      var el=document.getElementById('my-services-list'); if(!el) return;
      var svcs=r.data.services||[];
      if(!svcs.length){ el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;">No services yet. Add your first service above.</div>'; return; }
      el.innerHTML=svcs.map(function(s){
        return '<div class="svc-item">'+
          '<div style="flex:1;min-width:0;">'+
            '<div style="font-size:13px;font-weight:700;">'+(s.name||'')+'</div>'+
            '<div style="font-size:11px;color:var(--t-muted);margin-top:2px;">'+(s.duration||60)+' mins</div>'+
          '</div>'+
          '<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--g-main);margin-right:12px;">GHS '+(Math.round((s.price||0)/100))+'</div>'+
          '<button onclick="deleteService('+s.id+')" style="background:none;border:none;color:var(--s-red);cursor:pointer;padding:6px;border-radius:8px;" title="Delete">✕</button>'+
        '</div>';
      }).join('');
    }).catch(function(){ });
}
function saveProfile(){
  var tok=localStorage.getItem('sl_token');
  var payload={
    business_name: document.getElementById('edit-biz-name').value.trim(),
    bio: document.getElementById('edit-bio').value.trim(),
    phone: document.getElementById('edit-phone').value.trim(),
    city: document.getElementById('edit-city').value.trim(),
  };
  axios.put('/api/providers/me',payload,{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Profile saved ✦','success'); var nm=document.getElementById('sb-name'); if(nm&&payload.business_name) nm.textContent=payload.business_name; })
    .catch(function(){ showToast('Save failed','error'); });
}

/* ─── Fees ─── */
function loadFees(){
  var tok=localStorage.getItem('sl_token');
  var usr=JSON.parse(localStorage.getItem('sl_user')||'{}');
  if(!usr.provider_id) return;
  axios.get('/api/admin/provider-fees/'+usr.provider_id,{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){
      var s=r.data.summary||{};
      var pe=document.getElementById('fees-pending-amt'); if(pe) pe.textContent='GHS '+((s.pending_amount||0)/100).toFixed(2);
      var pa=document.getElementById('fees-paid-amt');    if(pa) pa.textContent='GHS '+((s.paid_amount||0)/100).toFixed(2);
      var tc=document.getElementById('fees-total-count'); if(tc) tc.textContent=s.total_bookings||0;
      var w=document.getElementById('fees-warning'); if(w&&(s.pending_amount||0)>0) w.style.display='block';
      var body=document.getElementById('fees-table-body'); if(!body) return;
      var fees=r.data.fees||[];
      if(!fees.length){ body.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:24px;">No bookings yet.</div>'; return; }
      body.innerHTML=fees.map(function(f){
        var ov=f.status==='pending'&&new Date(f.due_date)<new Date();
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;">'+
          '<div style="flex:1;min-width:120px;"><div style="font-size:12px;font-weight:600;">Booking on '+f.booking_date+'</div><div style="font-size:11px;color:var(--t-muted);">Due: '+f.due_date+(ov?' — <span style=\'color:var(--s-red)\'>OVERDUE</span>':'')+'</div></div>'+
          '<div style="font-size:14px;font-weight:700;color:var(--g-main);">GHS '+((f.fee_amount||0)/100).toFixed(2)+'</div>'+
          '<span class="badge '+(f.status==='paid'?'badge-verified':ov?'':'badge-pending')+'">'+(f.status==='paid'?'✓ Paid':ov?'⚠ Overdue':'⏳ Pending')+'</span>'+
        '</div>';
      }).join('');
    }).catch(function(){ var body=document.getElementById('fees-table-body'); if(body) body.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:24px;">Fees appear after your first booking.</div>'; });
}

/* ─── KYC ─── */
function loadKYC(){
  var tok=localStorage.getItem('sl_token');
  axios.get('/api/providers/me/dashboard',{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){
      var p=r.data.provider;
      var el=document.getElementById('kyc-content'); if(!el) return;
      var ks=p.kyc_status||'not_submitted';
      if(ks==='approved'){
        el.innerHTML='<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;"><div style="width:48px;height:48px;border-radius:14px;background:rgba(93,201,138,0.15);display:flex;align-items:center;justify-content:center;font-size:22px;">✓</div><div><div style="font-size:15px;font-weight:700;color:#5DC98A;">Identity Verified</div><div style="font-size:12px;color:var(--t-muted);">Your Ghana Card has been verified</div></div></div>'+
          '<div style="padding:14px;background:rgba(93,201,138,0.08);border-radius:12px;"><div style="font-size:12px;color:var(--t-secondary);">Ghana Card: <strong>'+(p.kyc_id_number||'On file')+'</strong></div></div>';
      } else if(ks==='pending') {
        el.innerHTML='<div style="text-align:center;padding:32px;"><div style="font-size:36px;margin-bottom:12px;">⏳</div><div style="font-size:15px;font-weight:700;margin-bottom:8px;">KYC Under Review</div><div style="font-size:12px;color:var(--t-muted);">Admin is reviewing your Ghana Card. You\'ll be notified once approved.</div></div>';
      } else {
        el.innerHTML='<div style="text-align:center;padding:32px;"><div style="font-size:36px;margin-bottom:12px;">🪪</div><div style="font-size:15px;font-weight:700;margin-bottom:8px;">KYC Not Submitted</div><div style="font-size:12px;color:var(--t-muted);margin-bottom:20px;">Please complete identity verification to get verified status.</div><a href="/provider/onboarding" class="btn-primary" style="display:inline-flex;">Complete Verification</a></div>';
      }
    });
}

/* ─── Clients ─── */
function loadClients(tok){
  var el=document.getElementById('clients-list'); if(!el) return;
  axios.get('/api/bookings/provider',{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){
      var bookings=r.data.bookings||[];
      var seen={}, clients=[];
      bookings.forEach(function(b){
        if(!seen[b.customer_id]){ seen[b.customer_id]=true; clients.push(b); }
      });
      if(!clients.length){ el.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">No clients yet.</div>'; return; }
      el.innerHTML=clients.map(function(c){
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--i-faint);">'+
          '<div class="mini-avatar">'+(c.first_name||'C').charAt(0)+'</div>'+
          '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">'+(c.first_name||'')+' '+(c.last_name||'')+'</div><div style="font-size:11px;color:var(--t-muted);">Last visit: '+c.booking_date+'</div></div>'+
        '</div>';
      }).join('');
    }).catch(function(){ el.innerHTML='<div style="text-align:center;padding:32px;color:var(--t-muted);">No clients yet.</div>'; });
}

/* ─── Gallery ─── */
function triggerGalleryUpload(){ document.getElementById('gallery-upload-input').click(); }
function triggerLogoUpload(){ document.getElementById('logo-upload-input').click(); }
function loadGallery(tok){
  if(!providerIdGlobal) return;
  axios.get('/api/uploads/provider-gallery/'+providerIdGlobal)
    .then(function(r){
      var photos=r.data.gallery||[];
      var grid=document.getElementById('gallery-grid'); if(!grid) return;
      var html=photos.map(function(p){
        return '<div style="position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;background:var(--c-surface);">'+
          '<img src="'+p.image_url+'" style="width:100%;height:100%;object-fit:cover;" />'+
          '<button onclick="deleteGalleryImage('+p.id+')" style="position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,0.6);border:none;color:white;cursor:pointer;font-size:11px;">✕</button>'+
        '</div>';
      }).join('');
      html+='<div onclick="triggerGalleryUpload()" style="aspect-ratio:1;border-radius:14px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:11px;color:var(--t-muted);"><div style="font-size:22px;margin-bottom:6px;">➕</div>Add Photo</div>';
      grid.innerHTML=html;
    });
}
function deleteGalleryImage(id){
  if(!confirm('Remove this photo?')) return;
  var tok=localStorage.getItem('sl_token');
  axios.delete('/api/uploads/gallery/'+id,{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Photo removed','info'); loadGallery(tok); })
    .catch(function(){ showToast('Delete failed','error'); });
}
function upgradeGallery(){
  var ref='GALLERY-'+Date.now();
  if(!confirm('Upgrade Gallery Pro for GHS 10/month? Ref: '+ref)) return;
  var tok=localStorage.getItem('sl_token');
  axios.post('/api/uploads/subscribe-gallery',{payment_reference:ref},{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Gallery Pro activated ✦','success'); var pb=document.getElementById('pro-banner'); if(pb) pb.style.display='none'; })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upgrade failed','error'); });
}
document.getElementById('gallery-upload-input').addEventListener('change',function(){
  var file=this.files[0]; if(!file) return;
  var tok=localStorage.getItem('sl_token');
  var fd=new FormData(); fd.append('image',file);
  showToast('Uploading...','info');
  axios.post('/api/uploads/gallery',fd,{headers:{Authorization:'Bearer '+tok,'Content-Type':'multipart/form-data'}})
    .then(function(){ showToast('Photo uploaded ✦','success'); loadGallery(tok); })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upload failed','error'); });
  this.value='';
});
document.getElementById('logo-upload-input').addEventListener('change',function(){
  var file=this.files[0]; if(!file) return;
  var tok=localStorage.getItem('sl_token');
  var fd=new FormData(); fd.append('image',file);
  showToast('Uploading logo...','info');
  axios.post('/api/uploads/logo',fd,{headers:{Authorization:'Bearer '+tok,'Content-Type':'multipart/form-data'}})
    .then(function(r){
      showToast('Logo updated ✦','success');
      var lp=document.getElementById('logo-preview');
      if(lp&&r.data.url) lp.innerHTML='<img src="'+r.data.url+'" style="width:100%;height:100%;object-fit:cover;" />';
    })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upload failed','error'); });
  this.value='';
});

/* ─── Location ─── */
var locationMap=null, locationMarker=null, pickedLat=null, pickedLng=null;
function initMap(){
  if(locationMap) return; // already initialised
  var tok=localStorage.getItem('sl_token');
  axios.get('/api/providers/me/dashboard',{headers:{Authorization:'Bearer '+tok}})
    .then(function(r){ var p=r.data.provider; setupMap(p.location_lat,p.location_lng); })
    .catch(function(){ setupMap(null,null); });
}
function setupMap(provLat, provLng){
  var lat=provLat||5.6037, lng=provLng||-0.187;
  var mapEl=document.getElementById('location-picker-map');
  if(!mapEl||locationMap) return;
  locationMap=L.map('location-picker-map').setView([lat,lng],15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(locationMap);
  var icon=L.divIcon({html:'<div style="background:linear-gradient(135deg,var(--g-deep),var(--g-main));width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>',iconSize:[26,26],iconAnchor:[13,26],className:''});
  if(provLat&&provLng){
    pickedLat=provLat; pickedLng=provLng;
    locationMarker=L.marker([provLat,provLng],{icon:icon,draggable:true}).addTo(locationMap);
    updateCoords(provLat,provLng);
    document.getElementById('save-location-btn').disabled=false;
  }
  locationMap.on('click',function(e){
    pickedLat=e.latlng.lat; pickedLng=e.latlng.lng;
    if(locationMarker){ locationMarker.setLatLng(e.latlng); }
    else { locationMarker=L.marker(e.latlng,{icon:icon,draggable:true}).addTo(locationMap); locationMarker.on('dragend',function(ev){ pickedLat=ev.target.getLatLng().lat; pickedLng=ev.target.getLatLng().lng; updateCoords(pickedLat,pickedLng); }); }
    updateCoords(pickedLat,pickedLng);
    document.getElementById('save-location-btn').disabled=false;
  });
  if(locationMarker) locationMarker.on('dragend',function(ev){ pickedLat=ev.target.getLatLng().lat; pickedLng=ev.target.getLatLng().lng; updateCoords(pickedLat,pickedLng); });
}
function updateCoords(lat,lng){ var el=document.getElementById('location-coords'); if(el) el.innerHTML='📍 Lat: <strong>'+lat.toFixed(5)+'</strong> · Lng: <strong>'+lng.toFixed(5)+'</strong>'; }
function useMyLocation(){
  if(!navigator.geolocation){ showToast('Geolocation not supported','error'); return; }
  showToast('Getting your location...','info');
  navigator.geolocation.getCurrentPosition(function(pos){
    pickedLat=pos.coords.latitude; pickedLng=pos.coords.longitude;
    if(locationMap){ locationMap.setView([pickedLat,pickedLng],16); updateCoords(pickedLat,pickedLng); document.getElementById('save-location-btn').disabled=false; }
    showToast('Location found! Click Save to confirm ✦','success');
  },function(){ showToast('Could not get location. Please allow location access.','error'); });
}
function saveLocation(){
  if(!pickedLat||!pickedLng){ showToast('Please pick a location first','error'); return; }
  var tok=localStorage.getItem('sl_token');
  axios.put('/api/providers/me',{location_lat:pickedLat,location_lng:pickedLng},{headers:{Authorization:'Bearer '+tok}})
    .then(function(){ showToast('Location saved ✦ Customers can now find you!','success'); })
    .catch(function(){ showToast('Save failed','error'); });
}
</script>
</body></html>`
