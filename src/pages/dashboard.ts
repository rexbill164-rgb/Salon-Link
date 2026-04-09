import { baseHead, mobileNav, globalScripts } from '../utils/layout'

export const dashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('My Dashboard', `
<style>
/* ── Mobile-first base ── */
.dash-container { padding: 16px; max-width: 900px; margin: 0 auto; padding-bottom: 100px; }
.dash-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
.dash-title { font-size:22px; font-family:'Playfair Display',serif; }
.stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:28px; }
.stat-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:16px; padding:16px; }
.stat-val { font-family:'Playfair Display',serif; font-size:24px; background:linear-gradient(90deg,var(--g-deep),var(--g-main)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:4px; }
.stat-lbl { font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--t-muted); }
.filter-row { display:flex; gap:8px; flex-wrap:nowrap; overflow-x:auto; margin-bottom:20px; padding-bottom:4px; }
.tab-btn { padding:8px 18px; border-radius:100px; font-size:11px; font-weight:700; letter-spacing:0.06em; cursor:pointer; transition:all 0.3s; border:1px solid var(--i-faint); background:transparent; color:var(--t-secondary); white-space:nowrap; flex-shrink:0; }
.tab-btn.active { background:var(--g-dim); border-color:var(--g-border); color:var(--g-main); }
.booking-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:16px; padding:16px; margin-bottom:12px; position:relative; overflow:hidden; transition:all 0.3s; }
.booking-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:2px 0 0 2px; }
.bc-confirmed::before { background:#5DC98A; }
.bc-pending::before { background:var(--g-main); }
.bc-completed::before { background:#3A72C0; }
.bc-cancelled::before { background:#E07070; }
.bc-no_show::before { background:#999; }
.booking-inner { display:flex; align-items:flex-start; gap:12px; }
.booking-avatar { width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,var(--c-mist),var(--g-dim)); border:1px solid var(--i-faint); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.booking-info { flex:1; min-width:0; }
.booking-name { font-size:14px; font-weight:700; margin-bottom:2px; color:var(--t-primary); }
.booking-svc { font-size:12px; color:var(--t-secondary); margin-bottom:4px; }
.booking-meta { font-size:11px; color:var(--t-muted); display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.booking-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
.booking-price { font-family:'Playfair Display',serif; font-size:18px; background:linear-gradient(90deg,var(--g-deep),var(--g-main)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.booking-actions { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; margin-top:10px; padding-top:10px; border-top:1px solid var(--i-faint); }
.action-btn { padding:7px 14px; border-radius:100px; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.2s; border:1px solid var(--i-faint); background:transparent; color:var(--t-secondary); }
.action-btn.danger { color:var(--s-red); border-color:rgba(224,112,112,0.25); }
.action-btn.primary { background:linear-gradient(135deg,var(--g-deep),var(--g-main)); color:#fff; border:none; }
.empty-state { text-align:center; padding:48px 20px; color:var(--t-muted); }
.section-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:16px; padding:20px; margin-bottom:16px; }
.section-title { font-size:14px; font-weight:700; color:var(--t-primary); margin-bottom:16px; display:flex; align-items:center; gap:8px; }
/* ── Topbar ── */
.topbar { background:var(--c-deep); border-bottom:1px solid var(--i-faint); padding:14px 16px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:200; backdrop-filter:blur(20px); }
.topbar-logo { font-family:'Playfair Display',serif; font-size:16px; letter-spacing:0.08em; color:var(--t-primary); text-decoration:none; }
/* ── Tabs ── */
.bottom-tabs { display:none; }
/* Desktop: wider cards */
@media(min-width:640px){
  .dash-container { padding:32px 24px 80px; }
  .stats-grid { grid-template-columns:repeat(4,1fr); gap:16px; }
  .dash-title { font-size:30px; }
  .booking-inner { align-items:center; }
}
</style>
`)}
</head>
<body style="background:var(--c-deep);">

<!-- Topbar -->
<div class="topbar">
  <a href="/" class="topbar-logo">✦ SALONLINK</a>
  <div style="display:flex;align-items:center;gap:10px;">
    <a href="/discover" class="btn-primary" style="font-size:11px;padding:10px 18px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Book
    </a>
    <button onclick="logout()" style="background:none;border:none;color:var(--t-muted);cursor:pointer;font-size:12px;padding:8px;">Sign out</button>
  </div>
</div>

<div class="dash-container">

  <!-- Header -->
  <div class="dash-header afu">
    <div>
      <div class="eyebrow" style="margin-bottom:8px;">Your Account</div>
      <h1 class="dash-title font-display">My <em class="gold-gradient">Bookings</em></h1>
    </div>
  </div>

  <!-- Stats -->
  <div class="stats-grid afu-1">
    <div class="stat-card">
      <div style="font-size:20px;margin-bottom:8px;">📅</div>
      <div class="stat-val" id="stat-total">0</div>
      <div class="stat-lbl">Total Bookings</div>
    </div>
    <div class="stat-card">
      <div style="font-size:20px;margin-bottom:8px;">✅</div>
      <div class="stat-val" id="stat-completed">0</div>
      <div class="stat-lbl">Completed</div>
    </div>
    <div class="stat-card">
      <div style="font-size:20px;margin-bottom:8px;">🕐</div>
      <div class="stat-val" id="stat-upcoming">0</div>
      <div class="stat-lbl">Upcoming</div>
    </div>
    <div class="stat-card">
      <div style="font-size:20px;margin-bottom:8px;">✂️</div>
      <div class="stat-val" id="stat-services">—</div>
      <div class="stat-lbl">Services Done</div>
    </div>
  </div>

  <!-- Filter tabs -->
  <div class="filter-row afu-2">
    ${['All','Upcoming','Completed','Cancelled'].map((t,i)=>`<button onclick="filterBookings('${t}',this)" class="tab-btn ${i===0?'active':''}">${t}</button>`).join('')}
  </div>

  <!-- Bookings list -->
  <div id="bookings-list">
    <div class="empty-state">
      <div style="font-size:32px;margin-bottom:12px;">📭</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:8px;">Loading your bookings...</div>
    </div>
  </div>

</div>

<!-- Rating Modal -->
<div id="rating-modal" class="modal-overlay" style="display:none;" onclick="if(this===event.target)closeModal()">
  <div class="modal">
    <button onclick="closeModal()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--t-faint);font-size:22px;cursor:pointer;">×</button>
    <div class="eyebrow" style="margin-bottom:12px;">Rate Your Experience</div>
    <h3 class="font-display" style="font-size:20px;margin-bottom:20px;">How was your appointment?</h3>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;" id="star-rating">
      ${[1,2,3,4,5].map(n=>`<span onclick="setRating(${n})" style="font-size:36px;cursor:pointer;transition:transform 0.2s;color:var(--i-faint);" id="star-${n}" onmouseover="hoverRating(${n})" onmouseout="unhoverRating()">★</span>`).join('')}
    </div>
    <textarea id="review-text" class="input" rows="3" placeholder="Tell us about your experience..." style="margin-bottom:16px;resize:none;height:80px;width:100%;box-sizing:border-box;"></textarea>
    <button onclick="submitRating()" class="btn-primary" style="width:100%;justify-content:center;padding:14px;font-size:13px;">Submit Review</button>
  </div>
</div>

${mobileNav('dashboard')}
${globalScripts()}

<script>
var currentRating = 0;
var currentBookingId = null;
var allBookings = [];

function fmtMoney(p) { return 'GHS\u00a0' + (p/100).toFixed(0); }
function fmtDate(d) {
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-GH',{weekday:'short',month:'short',day:'numeric'}); }
  catch(e) { return d; }
}
function getCategoryEmoji(cat) {
  if (!cat) return '💇';
  var c = cat.toLowerCase();
  if (c.includes('hair') || c.includes('braid') || c.includes('loc')) return '💇‍♀️';
  if (c.includes('barb') || c.includes('cut') || c.includes('kut')) return '💈';
  if (c.includes('nail')) return '💅';
  if (c.includes('massage') || c.includes('spa')) return '💆';
  if (c.includes('make') || c.includes('glam') || c.includes('brow')) return '💄';
  return '✂️';
}

function renderBookings(list) {
  var grid = document.getElementById('bookings-list');
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><div style="font-size:40px;margin-bottom:16px;">📭</div><div style="font-size:15px;font-weight:700;margin-bottom:8px;color:var(--t-primary);">No bookings yet</div><div style="font-size:13px;margin-bottom:24px;">Book your first appointment with a top provider.</div><a href="/discover" class="btn-primary" style="display:inline-flex;">Browse Providers</a></div>';
    return;
  }
  grid.innerHTML = list.map(function(b) {
    var sc = 'bc-' + b.status;
    var bc = b.status==='confirmed'?'badge-verified':b.status==='pending'?'badge-pending':b.status==='completed'?'badge-success':'badge-error';
    var emoji = getCategoryEmoji(b.category);
    var canCancel = b.status==='confirmed'||b.status==='pending';
    var canRate = b.status==='completed';
    return '<div class="booking-card '+sc+'" id="bc-'+b.id+'">' +
      '<div class="booking-inner">' +
        '<div class="booking-avatar">'+emoji+'</div>' +
        '<div class="booking-info">' +
          '<div class="booking-name">'+(b.business_name||'Provider')+'</div>' +
          '<div class="booking-svc">'+(b.service_name||'Service')+'</div>' +
          '<div class="booking-meta">' +
            '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            fmtDate(b.booking_date) + ' · ' + (b.booking_time||'') +
          '</div>' +
        '</div>' +
        '<div class="booking-right">' +
          '<div class="booking-price">'+fmtMoney(b.total_amount||0)+'</div>' +
          '<span class="badge '+bc+'" style="font-size:9px;">'+b.status+'</span>' +
        '</div>' +
      '</div>' +
      '<div class="booking-actions">' +
        '<a href="/provider/'+b.provider_id+'" class="action-btn">View Provider</a>' +
        (b.payment_status==='unpaid'&&(b.status==='pending'||b.status==='confirmed')?'<a href="/payment/pay?booking_id='+b.id+'" class="action-btn primary" style="background:linear-gradient(135deg,var(--g-deep),var(--g-main));color:white;text-decoration:none;">💳 Pay Now</a>':'') +
        (canCancel?'<button onclick="cancelBooking('+b.id+')" class="action-btn danger">Cancel</button>':'') +
        (canRate?'<button onclick="openReview('+b.id+')" class="action-btn primary">⭐ Rate</button>':'') +
      '</div>' +
    '</div>';
  }).join('');
}

function filterBookings(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var filtered = status==='All' ? allBookings :
    status==='Upcoming' ? allBookings.filter(function(b){ return b.status==='confirmed'||b.status==='pending'; }) :
    allBookings.filter(function(b){ return b.status===status.toLowerCase(); });
  renderBookings(filtered);
}

function openReview(id) { currentBookingId=id; showRatingModal(); }

function showRatingModal() {
  var m = document.getElementById('rating-modal');
  m.style.display='flex';
  setTimeout(function(){ m.classList.add('open'); }, 10);
}

function closeModal() {
  var m = document.getElementById('rating-modal');
  m.classList.remove('open');
  setTimeout(function(){ m.style.display='none'; }, 300);
}

function setRating(n) {
  currentRating = n;
  for(var i=1;i<=5;i++) document.getElementById('star-'+i).style.color = i<=n?'var(--g-main)':'var(--i-faint)';
}
function hoverRating(n) {
  for(var i=1;i<=5;i++){
    document.getElementById('star-'+i).style.color = i<=n?'var(--g-light)':'var(--i-faint)';
    document.getElementById('star-'+i).style.transform = i<=n?'scale(1.15)':'scale(1)';
  }
}
function unhoverRating() {
  for(var i=1;i<=5;i++){
    document.getElementById('star-'+i).style.color = i<=currentRating?'var(--g-main)':'var(--i-faint)';
    document.getElementById('star-'+i).style.transform = 'scale(1)';
  }
}
function submitRating() {
  if(!currentRating){ showToast('Please select a rating','error'); return; }
  var token = localStorage.getItem('sl_token');
  if(!token){ showToast('Please log in','error'); return; }
  axios.post('/api/bookings/'+currentBookingId+'/review',
    { rating:currentRating, comment:document.getElementById('review-text').value },
    { headers:{Authorization:'Bearer '+token} })
    .then(function(){ showToast('Review submitted! Thank you ✦','success'); closeModal(); loadDashboard(); })
    .catch(function(){ showToast('Could not submit review','error'); });
}

function cancelBooking(id) {
  if(!confirm('Are you sure you want to cancel this booking?')) return;
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/bookings/'+id+'/status',
    { status:'cancelled', cancellation_reason:'Cancelled by customer' },
    { headers:{Authorization:'Bearer '+token} })
    .then(function(){ showToast('Booking cancelled','info'); loadDashboard(); })
    .catch(function(){ showToast('Could not cancel booking','error'); });
}

function loadDashboard() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user')||'{}');
  if(!token){ window.location.href='/login'; return; }

  // Redirect providers to their dashboard
  if(user.role==='provider'){ window.location.href='/provider/dashboard'; return; }

  // Personalise greeting
  if(user.first_name){
    var h = document.querySelector('h1.font-display');
    if(h) h.innerHTML='Welcome, <em class="gold-gradient">'+user.first_name+'</em>';
  }

  axios.get('/api/bookings/my',{headers:{Authorization:'Bearer '+token}})
    .then(function(res){
      allBookings = res.data.bookings||[];
      renderBookings(allBookings);
      // Stats
      var completed = allBookings.filter(function(b){return b.status==='completed';}).length;
      var upcoming  = allBookings.filter(function(b){return b.status==='confirmed'||b.status==='pending';}).length;
      var setEl = function(id,val){ var e=document.getElementById(id); if(e) e.textContent=val; };
      setEl('stat-total', allBookings.length);
      setEl('stat-completed', completed);
      setEl('stat-upcoming', upcoming);
      setEl('stat-services', allBookings.length);
      // Auto-prompt review for first unreviewed completed booking (once per session)
      if (!sessionStorage.getItem('sl_review_prompted')) {
        var needsReview = allBookings.find(function(b){ return b.status==='completed' && b.payment_status==='paid' && !b.has_review; });
        if (needsReview) {
          sessionStorage.setItem('sl_review_prompted','1');
          setTimeout(function(){ openReview(needsReview.id); }, 1500);
        }
      }
    })
    .catch(function(){ window.location.href='/login'; });
}

document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
  // Silently send reminders for tomorrow's bookings (fire & forget)
  var tok = localStorage.getItem('sl_token');
  if (tok) {
    setTimeout(function() {
      fetch('/api/bookings/send-reminders', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tok }
      }).catch(function(){});
    }, 4000);
  }
});
</script>
</body></html>`
