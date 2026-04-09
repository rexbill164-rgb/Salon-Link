import { baseHead, globalScripts } from '../utils/layout'

export const providerDashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Dashboard', `
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
/* ── Layout ── */
.pdash { display:flex; min-height:100vh; }
.sidebar { width:240px; background:#fff; border-right:1px solid var(--i-faint); flex-shrink:0; display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:300; overflow-y:auto; transition:transform 0.3s var(--ease-luxury); }
.main-wrap { flex:1; margin-left:240px; display:flex; flex-direction:column; min-height:100vh; }
.topbar { padding:14px 20px; background:#fff; border-bottom:1px solid var(--i-faint); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:200; backdrop-filter:blur(20px); }
.content-pad { padding:20px; padding-bottom:80px; }
/* ── Section ── */
.section { display:none; }
.section.active { display:block; }
/* Override global reveal inside dashboard sections - elements already visible */
.pdash .reveal { opacity:1 !important; transform:none !important; }
/* ── Cards ── */
.kpi-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:20px; }
.kpi-card { background:#fff; border:1px solid var(--i-faint); border-radius:16px; padding:16px; position:relative; overflow:hidden; }
.kpi-card::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--g-deep),var(--g-main),var(--g-light)); }
.kpi-val { font-family:'Poppins',sans-serif; font-size:22px; font-weight:800; background:linear-gradient(135deg,var(--g-deep),var(--g-main)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:2px; }
.kpi-lbl { font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--t-muted); }
.card { background:#fff; border:1px solid var(--i-faint); border-radius:16px; padding:18px; margin-bottom:16px; }
.card-title { font-size:13px; font-weight:700; margin-bottom:14px; color:var(--t-primary); display:flex; align-items:center; justify-content:space-between; }
/* ── Appt rows ── */
.appt-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--i-faint); }
.appt-row:last-child { border-bottom:none; }
.mini-avatar { width:38px; height:38px; border-radius:12px; background:linear-gradient(135deg,var(--g-dim),rgba(131,58,180,0.1)); border:1px solid var(--g-border); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:var(--g-main); flex-shrink:0; }
/* ── Sidebar items ── */
.sidebar-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; font-size:13px; font-weight:500; color:var(--t-secondary); transition:all 0.2s; }
.sidebar-item:hover { background:var(--g-dim); color:var(--g-main); }
.sidebar-item.active { background:var(--g-dim); color:var(--g-main); font-weight:700; border:1px solid var(--g-border); }
.sidebar-item .icon { width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
/* ── Status toggle ── */
.toggle-wrap { display:flex; align-items:center; gap:8px; }
.toggle { position:relative; width:44px; height:24px; }
.toggle input { opacity:0; width:0; height:0; }
.toggle-slider { position:absolute; inset:0; background:#ddd; border-radius:24px; cursor:pointer; transition:0.3s; }
.toggle-slider:before { content:''; position:absolute; width:18px; height:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.3s; box-shadow:0 1px 4px rgba(0,0,0,0.2); }
input:checked + .toggle-slider { background:linear-gradient(135deg,var(--g-deep),var(--g-main)); }
input:checked + .toggle-slider:before { transform:translateX(20px); }
/* ── Mobile bottom nav ── */
.mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:rgba(255,255,255,0.97); backdrop-filter:blur(24px); border-top:1px solid var(--i-faint); z-index:500; padding:6px 0 env(safe-area-inset-bottom,8px); }
.mob-nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:6px 4px; cursor:pointer; border:none; background:none; color:var(--t-muted); font-size:9px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; transition:color 0.2s; }
.mob-nav-item.active { color:var(--g-main); }
/* ── Menu toggle ── */
.menu-btn { display:none; width:38px; height:38px; border-radius:10px; border:1px solid var(--i-faint); background:#fff; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
/* ── Overlay ── */
.sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:299; }
/* ── Forms ── */
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px; }
.form-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px; }
/* ── Pending banner ── */
.pending-banner { background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(131,58,180,0.06)); border:1px solid var(--g-border); border-radius:16px; padding:16px; margin-bottom:20px; display:none; }
/* ── Mobile responsive ── */
@media(max-width:768px){
  .sidebar { transform:translateX(-100%); }
  .sidebar.open { transform:translateX(0); }
  .sidebar-overlay.open { display:block; }
  .main-wrap { margin-left:0; }
  .menu-btn { display:flex; }
  .mob-nav { display:flex; }
  .content-pad { padding:14px; padding-bottom:90px; }
  .kpi-grid { grid-template-columns:repeat(2,1fr); gap:10px; }
  .topbar { padding:10px 14px; }
  .form-row-3 { grid-template-columns:1fr; }
  .form-row { grid-template-columns:1fr; }
}
@media(min-width:769px){
  .kpi-grid { grid-template-columns:repeat(4,1fr); }
}
</style>
`)}
</head>
<body style="background:#FAFAFA;">

<div class="pdash">

  <!-- Sidebar overlay (mobile) -->
  <div class="sidebar-overlay" id="sb-overlay" onclick="closeSidebar()"></div>

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="sidebar" id="sidebar">
    <!-- Logo -->
    <div style="padding:18px 16px;border-bottom:1px solid var(--i-faint);display:flex;align-items:center;justify-content:space-between;">
      <a href="/" style="display:flex;align-items:center;gap:9px;text-decoration:none;">
        <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(225,48,108,0.35);">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="10" rx="5.5" ry="6" fill="white"/><path d="M8 26c0-5 3.6-8 8-8s8 3 8 8" fill="white"/><path d="M10.5 8 Q9 4 13 3 Q16 2 19 3 Q23 4 21.5 8" fill="rgba(255,255,255,0.6)"/><path d="M23 16.5c-2.2 0-4 1.8-4 4 0 3 4 7.5 4 7.5s4-4.5 4-7.5c0-2.2-1.8-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="white"/></svg>
        </div>
        <span style="font-family:'Poppins',sans-serif;font-size:16px;font-weight:800;background:linear-gradient(135deg,#833AB4,#E1306C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Salon<em style="font-weight:500;font-style:italic;">Link</em></span>
      </a>
      <button onclick="closeSidebar()" style="background:none;border:none;cursor:pointer;color:var(--t-muted);font-size:20px;display:none;" id="sb-close">✕</button>
    </div>

    <!-- Provider info -->
    <div style="padding:14px 16px;border-bottom:1px solid var(--i-faint);">
      <div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--g-dim);border:1px solid var(--g-border);border-radius:12px;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,rgba(131,58,180,0.1),rgba(225,48,108,0.1));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;" id="sb-avatar">💇‍♀️</div>
        <div style="min-width:0;">
          <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;" id="sb-name">Loading...</div>
          <span class="badge badge-pending" style="font-size:9px;margin-top:3px;display:inline-flex;" id="sb-badge">⏳ Pending</span>
        </div>
      </div>
      <!-- Accepting toggle -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:0 4px;">
        <span style="font-size:11px;color:var(--t-secondary);">Accepting Bookings</span>
        <label class="toggle"><input type="checkbox" id="accepting-toggle"/><span class="toggle-slider"></span></label>
      </div>
    </div>

    <!-- Nav items -->
    <nav style="flex:1;padding:10px;overflow-y:auto;">
      ${[
        {icon:'📊', label:'Overview',     id:'overview'},
        {icon:'📅', label:'Appointments', id:'appts'},
        {icon:'✂️', label:'My Services',  id:'services'},
        {icon:'📸', label:'Gallery',      id:'gallery'},
        {icon:'📍', label:'Location',     id:'location'},
        {icon:'⭐', label:'Reviews',      id:'reviews'},
        {icon:'💰', label:'Earnings',     id:'earnings'},
        {icon:'🪪', label:'KYC Status',   id:'kyc'},
        {icon:'⚙️', label:'Settings',     id:'settings'},
      ].map((l,i)=>`
        <button onclick="showSection('${l.id}',this)" class="sidebar-item ${i===0?'active':''}" id="nav-${l.id}">
          <span class="icon">${l.icon}</span>
          <span>${l.label}</span>
        </button>
      `).join('')}
    </nav>

    <!-- Bottom -->
    <div style="padding:10px;border-top:1px solid var(--i-faint);">
      <button id="view-profile-btn" onclick="viewPublicProfile()" class="sidebar-item">
        <span class="icon">👁️</span><span>View Public Profile</span>
      </button>
      <button onclick="logout()" class="sidebar-item" style="color:var(--s-red)!important;">
        <span class="icon">🚪</span><span>Sign Out</span>
      </button>
    </div>
  </aside>

  <!-- ═══ MAIN ═══ -->
  <div class="main-wrap">

    <!-- Topbar -->
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="menu-btn" onclick="openSidebar()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--t-primary);" id="sec-title">Overview</div>
          <div style="font-size:10px;color:var(--t-muted);">Provider Dashboard</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="badge badge-live" id="topbar-status" style="font-size:10px;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open
        </span>
        <button onclick="showSection('settings',document.getElementById('nav-settings'))" class="btn-icon" style="width:36px;height:36px;border-radius:10px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2"/></svg>
        </button>
      </div>
    </div>

    <div class="content-pad">

      <!-- Pending approval banner -->
      <div class="pending-banner" id="pending-banner">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <span style="font-size:24px;">⏳</span>
          <div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px;">Pending Admin Approval</div>
            <div style="font-size:12px;color:var(--t-secondary);margin-bottom:10px;">Your profile is set up. Customers can find and book you once admin approves. While waiting, upload photos and set your location.</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button onclick="showSection('gallery',document.getElementById('nav-gallery'))" style="padding:7px 16px;border-radius:100px;font-size:11px;font-weight:700;background:var(--g-main);color:white;border:none;cursor:pointer;">📸 Upload Photos</button>
              <button onclick="showSection('location',document.getElementById('nav-location'))" style="padding:7px 16px;border-radius:100px;font-size:11px;font-weight:700;background:transparent;border:1.5px solid var(--g-border);color:var(--g-main);cursor:pointer;">📍 Set Location</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ OVERVIEW ══ -->
      <div id="sec-overview" class="section active">
        <div class="kpi-grid">
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">📅</div><div class="kpi-val" id="kpi-today">0</div><div class="kpi-lbl">Today's Bookings</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">💰</div><div class="kpi-val" id="kpi-revenue">GHS 0</div><div class="kpi-lbl">Week Revenue</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">👥</div><div class="kpi-val" id="kpi-clients">0</div><div class="kpi-lbl">Total Clients</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">⭐</div><div class="kpi-val" id="kpi-rating">—</div><div class="kpi-lbl">Avg Rating</div></div>
        </div>

        <!-- Today's Appointments -->
        <div class="card">
          <div class="card-title">
            Today's Appointments
            <button onclick="showSection('appts',document.getElementById('nav-appts'))" class="btn-ghost" style="padding:6px 14px;font-size:10px;">View All</button>
          </div>
          <div id="today-appts"><div style="text-align:center;color:var(--t-muted);padding:20px;font-size:13px;">Loading...</div></div>
        </div>

        <!-- Quick actions -->
        <div class="card">
          <div class="card-title">Quick Actions</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            ${[
              {icon:'✂️',label:'Add Service',  action:"showSection('services',document.getElementById('nav-services'))"},
              {icon:'📸',label:'Add Photo',    action:"showSection('gallery',document.getElementById('nav-gallery'))"},
              {icon:'📍',label:'Set Location', action:"showSection('location',document.getElementById('nav-location'))"},
            ].map(a=>`
              <button onclick="${a.action}" style="padding:14px 8px;border-radius:12px;border:1px solid var(--i-faint);background:#fff;cursor:pointer;text-align:center;transition:all 0.2s;" onmouseover="this.style.borderColor='var(--g-border)';this.style.background='var(--g-dim)'" onmouseout="this.style.borderColor='var(--i-faint)';this.style.background='#fff'">
                <div style="font-size:22px;margin-bottom:4px;">${a.icon}</div>
                <div style="font-size:10px;font-weight:600;color:var(--t-secondary);">${a.label}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- ══ APPOINTMENTS ══ -->
      <div id="sec-appts" class="section">
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:16px;">
          ${['All','Today','Pending','Confirmed','Completed'].map((s,i)=>`
            <button onclick="filterAppts(this,'${s}')" style="padding:8px 16px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;background:${i===0?'var(--g-dim)':'transparent'};border:${i===0?'1px solid var(--g-border)':'1px solid var(--i-faint)'};color:${i===0?'var(--g-main)':'var(--t-secondary)'};">${s}</button>
          `).join('')}
        </div>
        <div id="appts-list"><div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading appointments...</div></div>
      </div>

      <!-- ══ SERVICES ══ -->
      <div id="sec-services" class="section">
        <div class="card">
          <div class="card-title">
            My Services
            <button onclick="showAddSvcForm()" class="btn-primary" style="padding:8px 16px;font-size:11px;">+ Add Service</button>
          </div>
          <!-- Add form -->
          <div id="add-svc-form" style="display:none;background:var(--c-raise);border:1px solid var(--i-faint);border-radius:12px;padding:14px;margin-bottom:14px;">
            <div class="form-row">
              <input type="text" id="new-svc-name" class="input" placeholder="Service name e.g. Box Braids" style="font-size:13px;"/>
              <input type="number" id="new-svc-price" class="input" placeholder="Price (GHS)" min="1" style="font-size:13px;"/>
            </div>
            <div class="form-row">
              <input type="number" id="new-svc-duration" class="input" placeholder="Duration (mins)" value="60" min="10" step="5" style="font-size:13px;"/>
              <input type="text" id="new-svc-desc" class="input" placeholder="Short description (optional)" style="font-size:13px;"/>
            </div>
            <div style="display:flex;gap:10px;">
              <button onclick="saveNewService()" class="btn-primary" style="padding:10px 20px;font-size:12px;">Save Service</button>
              <button onclick="document.getElementById('add-svc-form').style.display='none'" class="btn-ghost" style="padding:10px 20px;font-size:12px;">Cancel</button>
            </div>
          </div>
          <div id="my-services-list"><div style="text-align:center;color:var(--t-muted);padding:20px;font-size:13px;">Loading services...</div></div>
        </div>
      </div>

      <!-- ══ GALLERY ══ -->
      <div id="sec-gallery" class="section">
        <div class="card">
          <div class="card-title">
            <div>
              <div>My Gallery</div>
              <div style="font-size:11px;font-weight:400;color:var(--t-muted);" id="gallery-count-label">Free plan: 0/5 images</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button onclick="triggerLogoUpload()" class="btn-ghost" style="padding:8px 14px;font-size:11px;">📷 Logo</button>
              <button onclick="triggerGalleryUpload()" class="btn-primary" style="padding:8px 14px;font-size:11px;" id="upload-gallery-btn">➕ Add Photo</button>
            </div>
          </div>

          <!-- Upgrade banner -->
          <div id="pro-banner" style="background:linear-gradient(135deg,rgba(193,68,178,0.1),rgba(131,58,180,0.08));border:1px solid rgba(193,68,178,0.25);border-radius:12px;padding:14px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-size:13px;font-weight:700;margin-bottom:2px;">🚀 Upgrade to Gallery Pro</div>
              <div style="font-size:11px;color:var(--t-secondary);">Upload up to 10 photos · GHS 10/month</div>
            </div>
            <button onclick="upgradeGallery()" style="background:linear-gradient(135deg,#833ab4,#c144b2);color:white;border:none;padding:8px 18px;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;">Upgrade</button>
          </div>

          <!-- Logo preview -->
          <div style="margin-bottom:20px;">
            <div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Business Logo</div>
            <div id="logo-preview" style="width:90px;height:90px;border-radius:14px;background:var(--c-surface);border:2px dashed var(--i-faint);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;" onclick="triggerLogoUpload()">
              <div style="text-align:center;color:var(--t-muted);"><div style="font-size:24px;">📷</div><div style="font-size:9px;margin-top:4px;">Add Logo</div></div>
            </div>
          </div>

          <!-- Gallery grid -->
          <div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Work Photos</div>
          <div id="gallery-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
            <div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;font-size:12px;">Loading gallery...</div>
          </div>

          <!-- Hidden inputs -->
          <input type="file" id="gallery-file-input" accept="image/*" style="display:none;" onchange="uploadGalleryImage(this)"/>
          <input type="file" id="logo-file-input" accept="image/*" style="display:none;" onchange="uploadLogoImage(this)"/>
        </div>
      </div>

      <!-- ══ LOCATION ══ -->
      <div id="sec-location" class="section">
        <div class="card">
          <div class="card-title">📍 Your Business Location</div>
          <div style="font-size:12px;color:var(--t-secondary);margin-bottom:14px;">Pin your exact location so customers can find you on the map. Click the map or use your device GPS.</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <button onclick="useMyLocation()" style="padding:10px 18px;border-radius:100px;font-size:12px;font-weight:700;background:linear-gradient(135deg,#833ab4,#E1306C);color:white;border:none;cursor:pointer;">📍 Use My GPS</button>
            <button onclick="saveLocation()" class="btn-primary" style="padding:10px 18px;font-size:12px;" id="save-location-btn" disabled>💾 Save Location</button>
          </div>
          <div id="location-coords" style="font-size:12px;color:var(--t-muted);margin-bottom:10px;">No location set. Click the map below or tap GPS button.</div>
          <div id="location-picker-map" style="width:100%;height:280px;border-radius:12px;border:1px solid var(--i-faint);overflow:hidden;"></div>
          <div style="font-size:11px;color:var(--t-muted);margin-top:8px;">💡 Drag the marker to fine-tune your exact position.</div>
        </div>
      </div>

      <!-- ══ REVIEWS ══ -->
      <div id="sec-reviews" class="section">
        <div class="card">
          <div class="card-title">Customer Reviews</div>
          <div id="reviews-list"><div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading reviews...</div></div>
        </div>
      </div>

      <!-- ══ EARNINGS ══ -->
      <div id="sec-earnings" class="section">
        <div class="kpi-grid">
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">💵</div><div class="kpi-val" id="earn-total">GHS 0</div><div class="kpi-lbl">Total Earned</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">📅</div><div class="kpi-val" id="earn-month">GHS 0</div><div class="kpi-lbl">This Month</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">⏳</div><div class="kpi-val" id="fees-pending-amt">GHS 0</div><div class="kpi-lbl">Pending Fees</div></div>
          <div class="kpi-card"><div style="font-size:20px;margin-bottom:8px;">✅</div><div class="kpi-val" id="fees-paid-amt">GHS 0</div><div class="kpi-lbl">Fees Paid</div></div>
        </div>
        <div class="card">
          <div class="card-title">Fee History <span style="font-size:10px;font-weight:400;color:var(--t-muted);">GHS 3 per booking</span></div>
          <div id="fees-warning" style="display:none;background:rgba(224,112,112,0.08);border:1px solid rgba(224,112,112,0.25);border-radius:10px;padding:12px;margin-bottom:12px;font-size:12px;color:var(--s-red);">⚠️ You have pending fees. Contact admin to settle your balance.</div>
          <div id="fees-table-body"><div style="text-align:center;color:var(--t-muted);padding:24px;font-size:12px;">No fee history yet. Fees appear after your first booking.</div></div>
        </div>
      </div>

      <!-- ══ KYC ══ -->
      <div id="sec-kyc" class="section">
        <div class="card" id="kyc-content">
          <div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Loading KYC status...</div>
        </div>
      </div>

      <!-- ══ SETTINGS ══ -->
      <div id="sec-settings" class="section">
        <div class="card">
          <div class="card-title">Edit Profile</div>
          <div class="form-row">
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Business Name</label><input type="text" id="set-business-name" class="input" placeholder="Your salon name" style="font-size:13px;width:100%;"/></div>
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Phone Number</label><input type="text" id="set-phone" class="input" placeholder="+233..." style="font-size:13px;width:100%;"/></div>
          </div>
          <div class="form-row">
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">City</label><input type="text" id="set-city" class="input" placeholder="Accra" style="font-size:13px;width:100%;"/></div>
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Address</label><input type="text" id="set-address" class="input" placeholder="Street address" style="font-size:13px;width:100%;"/></div>
          </div>
          <div style="margin-bottom:10px;"><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Bio</label><textarea id="set-bio" class="input" rows="3" placeholder="Tell customers about yourself and your services..." style="font-size:13px;width:100%;resize:none;height:80px;"></textarea></div>
          <div class="form-row" style="margin-bottom:14px;">
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Min Price (GHS)</label><input type="number" id="set-price-min" class="input" placeholder="20" style="font-size:13px;width:100%;"/></div>
            <div><label style="font-size:11px;font-weight:600;color:var(--t-muted);display:block;margin-bottom:4px;">Max Price (GHS)</label><input type="number" id="set-price-max" class="input" placeholder="500" style="font-size:13px;width:100%;"/></div>
          </div>
          <button onclick="saveProfile()" class="btn-primary" style="padding:12px 28px;font-size:13px;">Save Changes</button>
        </div>
      </div>

    </div><!-- /content-pad -->
  </div><!-- /main-wrap -->
</div><!-- /pdash -->

<!-- Mobile bottom nav -->
<nav class="mob-nav" id="mob-nav">
  ${[
    {icon:'📊',label:'Overview',id:'overview'},
    {icon:'📅',label:'Appts',   id:'appts'},
    {icon:'✂️',label:'Services',id:'services'},
    {icon:'📸',label:'Gallery', id:'gallery'},
    {icon:'⚙️',label:'Settings',id:'settings'},
  ].map((l,i)=>`
    <button onclick="showSection('${l.id}',document.getElementById('nav-${l.id}'))" class="mob-nav-item ${i===0?'active':''}" id="mob-${l.id}">
      <span style="font-size:18px;">${l.icon}</span>
      <span>${l.label}</span>
    </button>
  `).join('')}
</nav>

${globalScripts()}
<script>
var providerIdGlobal = null;
var allAppts = [];
var locationMap = null, locationMarker = null, pickedLat = null, pickedLng = null;

/* ── Sidebar open/close ── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sb-overlay').classList.add('open');
  var btn = document.getElementById('sb-close');
  if(btn) btn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-overlay').classList.remove('open');
}

/* ── Section navigation ── */
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.sidebar-item').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.mob-nav-item').forEach(function(b){ b.classList.remove('active'); });
  var sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  var mobBtn = document.getElementById('mob-' + id);
  if (mobBtn) mobBtn.classList.add('active');
  var titles = {overview:'Overview',appts:'Appointments',services:'My Services',gallery:'Gallery',location:'Location',reviews:'Reviews',earnings:'Earnings',kyc:'KYC Status',settings:'Settings'};
  var t = document.getElementById('sec-title'); if(t) t.textContent = titles[id]||id;
  closeSidebar();
  // Load section data
  var token = localStorage.getItem('sl_token');
  if (id==='gallery' && providerIdGlobal && token) loadGallery(token);
  if (id==='earnings') loadFees();
  if (id==='appts') loadAllAppts(token);
  if (id==='reviews') loadReviews(token);
  if (id==='location') { setTimeout(function(){ initLocationMap(pickedLat, pickedLng); }, 200); }
  if (id==='kyc') loadKyc(token);
  if (id==='settings') loadSettings(token);
}

/* ── View public profile ── */
function viewPublicProfile() {
  if (providerIdGlobal) window.open('/provider/' + providerIdGlobal, '_blank');
}

/* ── Load main dashboard ── */
(function init() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!token || user.role !== 'provider') { window.location.href = '/login'; return; }

  axios.get('/api/providers/me/dashboard', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(res) {
      var d = res.data, p = d.provider, stats = d.stats;
      providerIdGlobal = p.id;
      pickedLat = p.location_lat; pickedLng = p.location_lng;

      // Sidebar name + badge
      var nameEl = document.getElementById('sb-name');
      if (nameEl) nameEl.textContent = p.business_name || 'My Salon';
      var badge = document.getElementById('sb-badge');
      if (badge) {
        if (p.is_verified) { badge.className='badge badge-verified'; badge.textContent='✓ Verified'; }
        else { badge.className='badge badge-pending'; badge.textContent='⏳ Pending Approval'; }
      }

      // Pending banner
      if (!p.is_verified) {
        var banner = document.getElementById('pending-banner');
        if (banner) banner.style.display='block';
      }

      // Gallery pro banner
      if (p.has_pro_gallery) {
        var pb = document.getElementById('pro-banner'); if(pb) pb.style.display='none';
        var gcl = document.getElementById('gallery-count-label');
        if(gcl) gcl.textContent = 'Pro plan: '+(p.gallery_count||0)+'/10 images';
      } else {
        var gcl = document.getElementById('gallery-count-label');
        if(gcl) gcl.textContent = 'Free plan: '+(p.gallery_count||0)+'/5 images';
      }

      // KPIs
      var setEl = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
      setEl('kpi-today', stats.today_bookings||0);
      setEl('kpi-revenue', 'GHS '+ Math.round((stats.week_revenue||0)/100));
      setEl('kpi-clients', stats.total_clients||0);
      setEl('kpi-rating', stats.rating ? parseFloat(stats.rating).toFixed(1) : '—');

      // Accepting toggle
      var tog = document.getElementById('accepting-toggle');
      if (tog) {
        tog.checked = p.is_accepting_bookings===1 || p.is_accepting_bookings===true;
        var ts = document.getElementById('topbar-status');
        if(ts) ts.innerHTML = tog.checked
          ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open'
          : '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#E07070;margin-right:4px;"></span>Closed';
        tog.onchange = function() {
          axios.put('/api/providers/me', { is_accepting_bookings: this.checked }, { headers: { Authorization: 'Bearer ' + token } })
            .then(function() {
              showToast('Status updated ✦', 'success');
              var ts = document.getElementById('topbar-status');
              if(ts) ts.innerHTML = tog.checked
                ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open'
                : '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#E07070;margin-right:4px;"></span>Closed';
            })
            .catch(function(){ showToast('Update failed', 'error'); });
        };
      }

      // Today appts
      renderTodayAppts(d.today_appointments||[]);
      allAppts = (d.today_appointments||[]).concat(d.pending_bookings||[]);

      // Load services too
      loadMyServices(token);
    })
    .catch(function(e) {
      if (e.response && e.response.status===401) window.location.href='/login';
      else showToast('Could not load dashboard data', 'error');
    });
})();

/* ── Today's appointments ── */
function renderTodayAppts(appts) {
  var el = document.getElementById('today-appts');
  if (!el) return;
  if (!appts.length) { el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No appointments today ✦</div>'; return; }
  el.innerHTML = appts.map(function(a) {
    var bc = a.status==='confirmed'?'badge-verified':a.status==='completed'?'badge-success':'badge-pending';
    return '<div class="appt-row">' +
      '<div class="mini-avatar">'+(a.first_name||'?').charAt(0)+'</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:700;">'+(a.first_name||'')+' '+(a.last_name||'')+'</div>' +
        '<div style="font-size:11px;color:var(--t-muted);">'+(a.service_name||'')+'</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
        '<div style="font-size:12px;font-weight:700;color:var(--g-main);">'+(a.booking_time||'')+'</div>' +
        '<span class="badge '+bc+'" style="font-size:9px;">'+a.status+'</span>' +
      '</div>' +
      (a.status==='pending'?'<button onclick="updateAppt('+a.id+',\'confirmed\')" class="btn-primary" style="padding:6px 12px;font-size:10px;margin-left:8px;">Confirm</button>':'') +
    '</div>';
  }).join('');
}

/* ── All appointments ── */
function loadAllAppts(token) {
  if (!token) return;
  axios.get('/api/bookings/provider', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      allAppts = r.data.bookings||[];
      renderApptsList(allAppts);
    })
    .catch(function() { renderApptsList([]); });
}

function renderApptsList(list) {
  var el = document.getElementById('appts-list'); if(!el) return;
  if (!list.length) { el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No appointments found.</div>'; return; }
  el.innerHTML = list.map(function(a) {
    var bc = a.status==='confirmed'?'badge-verified':a.status==='completed'?'badge-success':a.status==='pending'?'badge-pending':'badge-error';
    return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--i-faint);flex-wrap:wrap;">' +
      '<div class="mini-avatar">'+(a.first_name||'?').charAt(0)+'</div>' +
      '<div style="flex:1;min-width:120px;">' +
        '<div style="font-size:13px;font-weight:700;">'+(a.first_name||'')+' '+(a.last_name||'')+'</div>' +
        '<div style="font-size:11px;color:var(--t-muted);">'+(a.service_name||'')+' · '+(a.booking_date||'')+'</div>' +
      '</div>' +
      '<div style="text-align:right;">' +
        '<div style="font-size:13px;font-weight:700;color:var(--g-main);">GHS '+Math.round((a.total_amount||0)/100)+'</div>' +
        '<span class="badge '+bc+'" style="font-size:9px;">'+a.status+'</span>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
        (a.status==='pending'?'<button onclick="updateAppt('+a.id+',\'confirmed\')" class="btn-primary" style="padding:6px 12px;font-size:10px;">Confirm</button>':'') +
        (a.status==='confirmed'?'<button onclick="updateAppt('+a.id+',\'completed\')" style="padding:6px 12px;font-size:10px;border-radius:8px;border:1px solid var(--g-border);background:var(--g-dim);color:var(--g-main);cursor:pointer;">Done</button>':'') +
        (a.status==='pending'||a.status==='confirmed'?'<button onclick="updateAppt('+a.id+',\'cancelled\')" style="padding:6px 12px;font-size:10px;border-radius:8px;border:1px solid rgba(224,112,112,0.3);background:transparent;color:var(--s-red);cursor:pointer;">Cancel</button>':'') +
      '</div>' +
    '</div>';
  }).join('');
}

function filterAppts(btn, status) {
  document.querySelectorAll('#sec-appts button').forEach(function(b){ b.style.background='transparent'; b.style.borderColor='var(--i-faint)'; b.style.color='var(--t-secondary)'; });
  btn.style.background='var(--g-dim)'; btn.style.borderColor='var(--g-border)'; btn.style.color='var(--g-main)';
  var filtered = status==='All' ? allAppts :
    status==='Today' ? allAppts.filter(function(a){ return a.booking_date===new Date().toISOString().split('T')[0]; }) :
    allAppts.filter(function(a){ return a.status===status.toLowerCase(); });
  renderApptsList(filtered);
}

function updateAppt(id, status) {
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/bookings/'+id+'/status', { status: status }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() { showToast('Booking '+status+' ✦', 'success'); setTimeout(function(){ location.reload(); }, 800); })
    .catch(function() { showToast('Update failed', 'error'); });
}

/* ── Services ── */
function showAddSvcForm() {
  var f = document.getElementById('add-svc-form');
  f.style.display = f.style.display==='none' ? 'block' : 'none';
  if (f.style.display==='block') document.getElementById('new-svc-name').focus();
}

function saveNewService() {
  var token = localStorage.getItem('sl_token');
  var name = document.getElementById('new-svc-name').value.trim();
  var price = parseInt(document.getElementById('new-svc-price').value)||0;
  var duration = parseInt(document.getElementById('new-svc-duration').value)||60;
  var desc = document.getElementById('new-svc-desc').value.trim();
  if (!name) { showToast('Please enter a service name', 'error'); return; }
  if (!price) { showToast('Please enter a price', 'error'); return; }
  axios.post('/api/providers/me/services', { name: name, price: price*100, duration: duration, description: desc }, { headers: { Authorization: 'Bearer ' + token } })
    .then(function() {
      showToast('Service added! ✦', 'success');
      document.getElementById('add-svc-form').style.display='none';
      ['new-svc-name','new-svc-price','new-svc-desc'].forEach(function(id){ document.getElementById(id).value=''; });
      document.getElementById('new-svc-duration').value='60';
      loadMyServices(token);
    })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Save failed', 'error'); });
}

function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  var token = localStorage.getItem('sl_token');
  axios.delete('/api/providers/me/services/'+id, { headers: { Authorization: 'Bearer ' + token } })
    .then(function(){ showToast('Service deleted', 'info'); loadMyServices(token); })
    .catch(function(){ showToast('Delete failed', 'error'); });
}

function loadMyServices(token) {
  axios.get('/api/providers/me/services', { headers: { Authorization: 'Bearer ' + token } })
    .then(function(r) {
      var el = document.getElementById('my-services-list'); if(!el) return;
      var svcs = r.data.services||[];
      if (!svcs.length) { el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">No services yet. Add your first service above.</div>'; return; }
      el.innerHTML = svcs.map(function(s) {
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--i-faint);">' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:700;">'+s.name+'</div>' +
            '<div style="font-size:11px;color:var(--t-muted);">'+(s.duration||60)+' min</div>' +
          '</div>' +
          '<div style="font-size:15px;font-weight:700;color:var(--g-main);">GHS '+Math.round((s.price||0)/100)+'</div>' +
          '<button onclick="deleteService('+s.id+')" style="width:28px;height:28px;border-radius:8px;border:1px solid rgba(224,112,112,0.3);background:transparent;color:var(--s-red);cursor:pointer;font-size:12px;">✕</button>' +
        '</div>';
      }).join('');
    }).catch(function(){ document.getElementById('my-services-list').innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;font-size:12px;">Could not load services.</div>'; });
}

/* ── Gallery ── */
function triggerGalleryUpload() { document.getElementById('gallery-file-input').click(); }
function triggerLogoUpload() { document.getElementById('logo-file-input').click(); }

function uploadGalleryImage(input) {
  if (!input.files||!input.files[0]) return;
  var token = localStorage.getItem('sl_token');
  var fd = new FormData(); fd.append('file', input.files[0]); fd.append('type','gallery');
  showToast('Uploading photo...', 'info');
  axios.post('/api/uploads/gallery', fd, { headers:{ Authorization:'Bearer '+token, 'Content-Type':'multipart/form-data' } })
    .then(function(){ showToast('Photo added! ✦', 'success'); loadGallery(token); })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upload failed', 'error'); });
  input.value='';
}

function uploadLogoImage(input) {
  if (!input.files||!input.files[0]) return;
  var token = localStorage.getItem('sl_token');
  var fd = new FormData(); fd.append('file', input.files[0]); fd.append('type','logo');
  showToast('Uploading logo...', 'info');
  axios.post('/api/uploads/logo', fd, { headers:{ Authorization:'Bearer '+token, 'Content-Type':'multipart/form-data' } })
    .then(function(r){
      showToast('Logo updated! ✦', 'success');
      var lp = document.getElementById('logo-preview');
      if (lp && r.data.url) lp.innerHTML='<img src="'+r.data.url+'" style="width:100%;height:100%;object-fit:cover;"/>';
    })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upload failed', 'error'); });
  input.value='';
}

function loadGallery(token) {
  if (!providerIdGlobal) return;
  axios.get('/api/uploads/provider-gallery/'+providerIdGlobal, { headers:{ Authorization:'Bearer '+token } })
    .then(function(r) {
      var photos = r.data.photos||[];
      var grid = document.getElementById('gallery-grid'); if(!grid) return;
      var maxImg = r.data.is_pro ? 10 : 5;
      var gcl = document.getElementById('gallery-count-label');
      if(gcl) gcl.textContent=(r.data.is_pro?'Pro':'Free')+' plan: '+photos.length+'/'+maxImg+' images';
      var html = photos.map(function(p) {
        return '<div style="position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--c-surface);">' +
          '<img src="'+p.image_url+'" style="width:100%;height:100%;object-fit:cover;"/>' +
          (p.caption?'<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.55);padding:6px 8px;font-size:9px;color:white;">'+p.caption+'</div>':'') +
          '<button onclick="deleteGalleryImage('+p.id+')" style="position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.55);border:none;color:white;cursor:pointer;font-size:10px;">✕</button>' +
        '</div>';
      }).join('');
      html += '<div onclick="triggerGalleryUpload()" style="aspect-ratio:1;border-radius:12px;background:#fff;border:2px dashed var(--i-faint);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;" onmouseover="this.style.borderColor=\'var(--g-border)\'" onmouseout="this.style.borderColor=\'var(--i-faint)\'"><div style="font-size:24px;">➕</div><div style="font-size:10px;color:var(--t-muted);margin-top:4px;">Add Photo</div></div>';
      grid.innerHTML = html;
    }).catch(function(){ document.getElementById('gallery-grid').innerHTML='<div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;">Could not load gallery.</div>'; });
}

function deleteGalleryImage(id) {
  if (!confirm('Delete this photo?')) return;
  var token = localStorage.getItem('sl_token');
  axios.delete('/api/uploads/gallery/'+id, { headers:{ Authorization:'Bearer '+token } })
    .then(function(){ showToast('Photo deleted', 'info'); loadGallery(token); })
    .catch(function(){ showToast('Delete failed', 'error'); });
}

function upgradeGallery() {
  var ref = 'GALLERY-' + Date.now();
  if (!confirm('Upgrade to Gallery Pro for GHS 10/month? Reference: '+ref+'\n\nContact admin via MoMo to pay.')) return;
  var token = localStorage.getItem('sl_token');
  axios.post('/api/uploads/subscribe-gallery', { payment_reference: ref }, { headers:{ Authorization:'Bearer '+token } })
    .then(function(){ showToast('Gallery Pro activated! ✦', 'success'); document.getElementById('pro-banner').style.display='none'; })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Upgrade failed', 'error'); });
}

/* ── Location ── */
function initLocationMap(lat, lng) {
  if (!document.getElementById('location-picker-map')) return;
  if (locationMap) { locationMap.remove(); locationMap=null; locationMarker=null; }
  var defaultLat = lat||5.6037, defaultLng = lng||-0.1870;
  locationMap = L.map('location-picker-map').setView([defaultLat, defaultLng], lat?15:13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OSM', maxZoom:19 }).addTo(locationMap);
  var icon = L.divIcon({ html:'<div style="background:linear-gradient(135deg,#833ab4,#E1306C);width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>', iconSize:[28,28], iconAnchor:[14,28], className:'' });
  if (lat && lng) {
    pickedLat=lat; pickedLng=lng;
    locationMarker = L.marker([lat,lng],{icon:icon,draggable:true}).addTo(locationMap);
    updateCoordDisplay(lat,lng);
    document.getElementById('save-location-btn').disabled=false;
  }
  locationMap.on('click', function(e) {
    pickedLat=e.latlng.lat; pickedLng=e.latlng.lng;
    if (locationMarker) locationMarker.setLatLng(e.latlng);
    else { locationMarker=L.marker(e.latlng,{icon:icon,draggable:true}).addTo(locationMap); locationMarker.on('dragend',function(ev){ pickedLat=ev.target.getLatLng().lat; pickedLng=ev.target.getLatLng().lng; updateCoordDisplay(pickedLat,pickedLng); }); }
    updateCoordDisplay(pickedLat,pickedLng);
    document.getElementById('save-location-btn').disabled=false;
  });
  if (locationMarker) locationMarker.on('dragend', function(ev){ pickedLat=ev.target.getLatLng().lat; pickedLng=ev.target.getLatLng().lng; updateCoordDisplay(pickedLat,pickedLng); });
}

function updateCoordDisplay(lat,lng) {
  var el=document.getElementById('location-coords'); if(el) el.innerHTML='📍 <strong>Lat:</strong> '+lat.toFixed(5)+', <strong>Lng:</strong> '+lng.toFixed(5);
}

function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  showToast('Getting your location...', 'info');
  navigator.geolocation.getCurrentPosition(function(pos) {
    pickedLat=pos.coords.latitude; pickedLng=pos.coords.longitude;
    if (locationMap) {
      locationMap.setView([pickedLat,pickedLng],16);
      var icon=L.divIcon({html:'<div style="background:linear-gradient(135deg,#833ab4,#E1306C);width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>',iconSize:[28,28],iconAnchor:[14,28],className:''});
      if (locationMarker) locationMarker.setLatLng([pickedLat,pickedLng]);
      else { locationMarker=L.marker([pickedLat,pickedLng],{icon:icon,draggable:true}).addTo(locationMap); }
      updateCoordDisplay(pickedLat,pickedLng);
      document.getElementById('save-location-btn').disabled=false;
    }
    showToast('Location found! Tap Save to confirm. ✦', 'success');
  }, function(){ showToast('Could not get location. Please allow location access.', 'error'); });
}

function saveLocation() {
  if (!pickedLat||!pickedLng) { showToast('Please pick a location first', 'error'); return; }
  var token=localStorage.getItem('sl_token');
  axios.put('/api/providers/me', { location_lat:pickedLat, location_lng:pickedLng }, { headers:{ Authorization:'Bearer '+token } })
    .then(function(){ showToast('Location saved! ✦ Customers can now find you on the map.', 'success'); })
    .catch(function(){ showToast('Save failed', 'error'); });
}

/* ── Reviews ── */
function loadReviews(token) {
  var el=document.getElementById('reviews-list'); if(!el) return;
  axios.get('/api/providers/me/dashboard', { headers:{ Authorization:'Bearer '+token } })
    .then(function(r) {
      var revs = r.data.recent_reviews||[];
      if (!revs.length) { el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">No reviews yet. Provide great service to get your first review!</div>'; return; }
      el.innerHTML = revs.map(function(rv) {
        return '<div style="padding:14px 0;border-bottom:1px solid var(--i-faint);">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
            '<div class="mini-avatar" style="width:34px;height:34px;border-radius:10px;font-size:13px;">'+(rv.first_name||'?').charAt(0)+'</div>' +
            '<div style="flex:1;"><div style="font-size:13px;font-weight:700;">'+(rv.first_name||'')+' '+(rv.last_name||'')+'</div>' +
            '<span style="color:var(--g-main);font-size:13px;">'+'★'.repeat(rv.rating||5)+'</span></div>' +
            '<span style="font-size:10px;color:var(--t-faint);">'+(rv.created_at||'').split('T')[0]+'</span>' +
          '</div>' +
          '<p style="font-size:12px;color:var(--t-secondary);font-style:italic;">"'+(rv.comment||'Great service!')+ '"</p>' +
        '</div>';
      }).join('');
    }).catch(function(){ el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Could not load reviews.</div>'; });
}

/* ── Fees / Earnings ── */
function loadFees() {
  var token=localStorage.getItem('sl_token');
  var user=JSON.parse(localStorage.getItem('sl_user')||'{}');
  if (!user.provider_id && !providerIdGlobal) return;
  var pid = user.provider_id || providerIdGlobal;
  axios.get('/api/admin/provider-fees/'+pid, { headers:{ Authorization:'Bearer '+token } })
    .then(function(r) {
      var s=r.data.summary||{};
      var setEl=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
      setEl('fees-pending-amt','GHS '+((s.pending_amount||0)/100).toFixed(0));
      setEl('fees-paid-amt','GHS '+((s.paid_amount||0)/100).toFixed(0));
      setEl('earn-total','GHS '+((s.total_earned||0)/100).toFixed(0));
      setEl('earn-month','GHS '+((s.month_earned||0)/100).toFixed(0));
      var warn=document.getElementById('fees-warning');
      if (warn&&(s.pending_amount||0)>0) warn.style.display='block';
      var body=document.getElementById('fees-table-body'); if(!body) return;
      var fees=r.data.fees||[];
      if (!fees.length) { body.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:24px;font-size:12px;">No bookings yet. Fees appear after your first booking.</div>'; return; }
      body.innerHTML = fees.map(function(f) {
        var overdue=f.status==='pending'&&new Date(f.due_date)<new Date();
        return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--i-faint);">' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;">Booking on '+f.booking_date+'</div>' +
            '<div style="font-size:10px;color:var(--t-muted);">Due: '+f.due_date+' midnight'+(overdue?' — <span style=\\"color:var(--s-red)\\">OVERDUE</span>':'')+'</div>' +
          '</div>' +
          '<div style="font-size:14px;font-weight:700;color:var(--g-main);">GHS '+((f.fee_amount||0)/100).toFixed(2)+'</div>' +
          '<span class="badge '+(f.status==='paid'?'badge-verified':overdue?'badge-error':'badge-pending')+'" style="font-size:9px;">'+(f.status==='paid'?'✓ Paid':overdue?'⚠ Overdue':'⏳ Pending')+'</span>' +
        '</div>';
      }).join('');
    }).catch(function(){});
}

/* ── KYC ── */
function loadKyc(token) {
  var el=document.getElementById('kyc-content'); if(!el) return;
  axios.get('/api/providers/me/dashboard', { headers:{ Authorization:'Bearer '+token } })
    .then(function(r) {
      var p=r.data.provider;
      if (p.is_verified) {
        el.innerHTML='<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;"><div style="width:48px;height:48px;border-radius:14px;background:rgba(0,200,83,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;">✅</div><div><div style="font-size:16px;font-weight:700;color:#00C853;">Identity Verified</div><div style="font-size:12px;color:var(--t-secondary);">Your Ghana Card has been verified.</div></div></div>' +
          '<div style="display:flex;flex-direction:column;gap:8px;">' +
            ['Account Created','Ghana Card Submitted','KYC Reviewed','Admin Approved'].map(function(step,i){ return '<div style="display:flex;align-items:center;gap:12px;"><div style="width:24px;height:24px;border-radius:50%;background:var(--s-green);display:flex;align-items:center;justify-content:center;font-size:10px;color:white;flex-shrink:0;">✓</div><span style="font-size:13px;">'+step+'</span></div>'; }).join('') +
          '</div>';
      } else {
        var kycStatus = p.kyc_status||'not_submitted';
        el.innerHTML='<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;"><div style="width:48px;height:48px;border-radius:14px;background:rgba(201,168,76,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;">⏳</div><div><div style="font-size:16px;font-weight:700;color:var(--g-main);">'+(kycStatus==='pending'?'Under Review':'Pending Verification')+'</div><div style="font-size:12px;color:var(--t-secondary);">'+(kycStatus==='pending'?'Your documents are being reviewed by our team.':'Complete your Ghana Card verification to get verified.')+'</div></div></div>' +
          (kycStatus==='not_submitted'?'<a href="/provider/onboarding" class="btn-primary" style="display:inline-flex;padding:12px 24px;font-size:13px;">Complete KYC Verification</a>':'<div style="font-size:12px;color:var(--t-muted);margin-top:8px;">Expected review time: 24-48 hours. You will receive an email once approved.</div>');
      }
    }).catch(function(){ el.innerHTML='<div style="text-align:center;color:var(--t-muted);padding:32px;font-size:13px;">Could not load KYC data.</div>'; });
}

/* ── Settings ── */
function loadSettings(token) {
  axios.get('/api/providers/me/dashboard', { headers:{ Authorization:'Bearer '+token } })
    .then(function(r) {
      var p=r.data.provider;
      var setVal=function(id,v){ var e=document.getElementById(id); if(e) e.value=v||''; };
      setVal('set-business-name', p.business_name);
      setVal('set-phone', p.phone);
      setVal('set-city', p.city);
      setVal('set-address', p.address);
      setVal('set-bio', p.bio);
      setVal('set-price-min', p.price_range_min ? p.price_range_min/100 : '');
      setVal('set-price-max', p.price_range_max ? p.price_range_max/100 : '');
    }).catch(function(){});
}

function saveProfile() {
  var token=localStorage.getItem('sl_token');
  var payload = {
    business_name: document.getElementById('set-business-name').value.trim(),
    phone:         document.getElementById('set-phone').value.trim(),
    city:          document.getElementById('set-city').value.trim(),
    address:       document.getElementById('set-address').value.trim(),
    bio:           document.getElementById('set-bio').value.trim(),
    price_range_min: parseInt(document.getElementById('set-price-min').value||0)*100||undefined,
    price_range_max: parseInt(document.getElementById('set-price-max').value||0)*100||undefined,
  };
  axios.put('/api/providers/me', payload, { headers:{ Authorization:'Bearer '+token } })
    .then(function(){ showToast('Profile saved! ✦', 'success'); })
    .catch(function(e){ showToast(e.response?e.response.data.error:'Save failed','error'); });
}
</script>
</body></html>`
