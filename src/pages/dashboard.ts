import { baseHead, mobileNav, globalScripts } from '../utils/layout'

export const dashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('My Activity', `
<style>
/* ── Fresha Activity-style dashboard ── */
body { background: #F5F5F5; }

/* Topbar */
.act-topbar {
  position: sticky; top: 0; z-index: 300;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--i-faint);
  padding: 0 20px; height: 58px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
}

/* Activity empty state */
.empty-activity {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 32px; text-align: center;
}
.empty-calendar-icon {
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg, #F0ECFF 0%, #E8E0FF 100%);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px; font-size: 38px;
  box-shadow: 0 4px 20px rgba(108,71,255,0.15);
}

/* Tab row */
.act-tabs { display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; }
.act-tabs::-webkit-scrollbar { display:none; }
.atab {
  flex-shrink:0; padding:9px 20px; border-radius:100px;
  font-size:12px; font-weight:700;
  cursor:pointer; transition:all 0.25s;
  border:1.5px solid var(--i-faint); background:#FFFFFF;
  color:var(--t-secondary); white-space:nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.atab.active { background:var(--g-main); border-color:var(--g-main); color:#FFFFFF; box-shadow:0 4px 14px rgba(108,71,255,0.28); }

/* Booking card – Fresha style */
.bk-card {
  background: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--i-faint);
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: box-shadow 0.25s;
}
.bk-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.10); }

/* Left status stripe */
.bk-stripe {
  width: 4px; border-radius: 2px; flex-shrink: 0; align-self: stretch;
  min-height: 60px;
}
.stripe-confirmed { background: #00C853; }
.stripe-pending   { background: var(--s-amber); }
.stripe-completed { background: var(--s-blue); }
.stripe-cancelled { background: #FF3B30; }
.stripe-no_show   { background: #AAAAAA; }

/* Stats row */
.stat-mini {
  background: #FFFFFF; border-radius: 16px; border: 1px solid var(--i-faint);
  padding: 16px 20px; text-align: center; flex: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-mini-val { font-size: 24px; font-weight: 800; color: var(--g-main); margin-bottom: 2px; }
.stat-mini-lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--t-muted); }

/* Rating modal */
.rating-modal { border-radius: 28px 28px 0 0; }
@media(min-width:600px){ .rating-modal { border-radius: 28px; } }
</style>
`)}
</head>
<body>

<!-- ── Sticky Topbar ── -->
<div class="act-topbar">
  <a href="/" style="display:flex;align-items:center;gap:9px;text-decoration:none;">
    <div style="width:32px;height:32px;border-radius:9px;background:var(--g-main);display:flex;align-items:center;justify-content:center;">
      <i class="fas fa-spa" style="color:#FFFFFF;font-size:13px;"></i>
    </div>
    <span style="font-size:17px;font-weight:800;color:var(--t-primary);">Salon<span style="color:var(--g-main);">Link</span></span>
  </a>
  <div style="display:flex;align-items:center;gap:10px;">
    <a href="/discover" style="background:var(--g-main);color:#FFFFFF;border:none;border-radius:100px;padding:9px 20px;font-size:12px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;">
      <i class="fas fa-plus" style="font-size:10px;"></i> Book
    </a>
    <button onclick="logout()" style="background:none;border:none;color:var(--t-muted);cursor:pointer;font-size:13px;padding:8px;font-weight:500;">Sign out</button>
  </div>
</div>

<div style="max-width:680px;margin:0 auto;padding:24px 16px 140px;">

  <!-- ── Header ── -->
  <div style="margin-bottom:24px;" class="afu">
    <h1 style="font-size:26px;font-weight:800;color:var(--t-primary);margin-bottom:4px;">Activity</h1>
    <p id="greeting-sub" style="font-size:14px;color:var(--t-muted);">Your bookings and appointments</p>
  </div>

  <!-- ── Stats row ── -->
  <div style="display:flex;gap:10px;margin-bottom:24px;" class="afu-1">
    <div class="stat-mini">
      <div class="stat-mini-val" id="stat-total">—</div>
      <div class="stat-mini-lbl">Total</div>
    </div>
    <div class="stat-mini">
      <div class="stat-mini-val" id="stat-upcoming" style="color:#FF9500;">—</div>
      <div class="stat-mini-lbl">Upcoming</div>
    </div>
    <div class="stat-mini">
      <div class="stat-mini-val" id="stat-completed" style="color:#00C853;">—</div>
      <div class="stat-mini-lbl">Done</div>
    </div>
    <div class="stat-mini">
      <div class="stat-mini-val" id="stat-services" style="color:#007AFF;">—</div>
      <div class="stat-mini-lbl">Services</div>
    </div>
  </div>

  <!-- ── Filter tabs ── -->
  <div class="act-tabs afu-2" style="margin-bottom:20px;">
    ${['All','Upcoming','Completed','Cancelled'].map((t,i)=>`<button onclick="filterBookings('${t}',this)" class="atab ${i===0?'active':''}">${t}</button>`).join('')}
  </div>

  <!-- ── Bookings list ── -->
  <div id="bookings-list">
    <div class="empty-activity">
      <div class="empty-calendar-icon">📅</div>
      <p style="font-size:15px;font-weight:600;color:var(--t-secondary);margin-bottom:6px;">Loading bookings...</p>
    </div>
  </div>

</div>

<!-- Rating Modal (Fresha bottom-sheet style) -->
<div id="rating-modal" class="modal-overlay" style="display:none;" onclick="if(this===event.target)closeModal()">
  <div class="modal rating-modal" style="max-width:440px;">
    <div style="width:40px;height:4px;background:var(--i-faint);border-radius:2px;margin:0 auto 24px;"></div>
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:32px;margin-bottom:10px;">⭐</div>
      <h3 style="font-size:20px;font-weight:800;color:var(--t-primary);margin-bottom:6px;">Rate your experience</h3>
      <p style="font-size:14px;color:var(--t-muted);">How was your appointment?</p>
    </div>
    <div style="display:flex;gap:6px;justify-content:center;margin-bottom:20px;" id="star-rating">
      ${[1,2,3,4,5].map(n=>`<span onclick="setRating(${n})" style="font-size:40px;cursor:pointer;transition:transform 0.15s;color:#E0E0E0;" id="star-${n}" onmouseover="hoverRating(${n})" onmouseout="unhoverRating()">★</span>`).join('')}
    </div>
    <textarea id="review-text" placeholder="Tell us about your experience (optional)..." style="width:100%;min-height:90px;padding:14px 16px;border:1.5px solid var(--i-faint);border-radius:14px;font-family:'Poppins',sans-serif;font-size:14px;resize:none;outline:none;margin-bottom:16px;color:var(--t-primary);transition:border-color 0.2s;" onfocus="this.style.borderColor='var(--g-main)'" onblur="this.style.borderColor='var(--i-faint)'"></textarea>
    <button onclick="submitRating()" style="width:100%;background:var(--g-main);color:#FFFFFF;border:none;border-radius:100px;padding:15px;font-size:14px;font-weight:700;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='var(--g-deep)'" onmouseout="this.style.background='var(--g-main)'">Submit Review</button>
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
function getCatEmoji(cat) {
  if (!cat) return '💇';
  var c = cat.toLowerCase();
  if (c.includes('hair')||c.includes('braid')||c.includes('loc')) return '💇‍♀️';
  if (c.includes('barb')||c.includes('cut')||c.includes('fade')) return '💈';
  if (c.includes('nail')) return '💅';
  if (c.includes('mass')||c.includes('spa')) return '💆';
  if (c.includes('make')||c.includes('glam')) return '💄';
  if (c.includes('lash')||c.includes('brow')) return '👁️';
  return '✂️';
}
function getStatusColor(s){
  return s==='confirmed'?'#00C853':s==='pending'?'#FF9500':s==='completed'?'#007AFF':s==='cancelled'?'#FF3B30':'#AAAAAA';
}
function getStatusBg(s){
  return s==='confirmed'?'rgba(0,200,83,0.10)':s==='pending'?'rgba(255,149,0,0.10)':s==='completed'?'rgba(0,122,255,0.10)':s==='cancelled'?'rgba(255,59,48,0.08)':'rgba(0,0,0,0.04)';
}

function renderBookings(list) {
  var grid = document.getElementById('bookings-list');
  if (!list.length) {
    grid.innerHTML = '<div class="empty-activity">' +
      '<div class="empty-calendar-icon">📭</div>' +
      '<div style="font-size:18px;font-weight:700;color:var(--t-primary);margin-bottom:8px;">No activity yet</div>' +
      '<div style="font-size:14px;color:var(--t-muted);margin-bottom:28px;max-width:280px;line-height:1.6;">Your bookings and appointments will appear here once you book a service.</div>' +
      '<a href="/discover" style="background:var(--g-main);color:#FFFFFF;border:none;border-radius:100px;padding:14px 36px;font-size:14px;font-weight:700;text-decoration:none;display:inline-block;">Search venues</a>' +
      '<a href="/register" style="display:block;margin-top:14px;font-size:13px;color:var(--g-main);text-decoration:none;font-weight:600;">Log in or sign up</a>' +
    '</div>';
    return;
  }
  grid.innerHTML = list.map(function(b) {
    var canCancel = b.status==='confirmed'||b.status==='pending';
    var canRate   = b.status==='completed';
    var isUnpaid  = b.payment_status==='unpaid'&&(b.status==='pending'||b.status==='confirmed');
    var sc = getStatusColor(b.status);
    var sbg = getStatusBg(b.status);
    var emoji = getCatEmoji(b.category);
    return '<div class="bk-card">' +
      '<div style="display:flex;gap:0;">' +
        '<div class="bk-stripe stripe-'+b.status+'"></div>' +
        '<div style="flex:1;padding:16px 16px 0;">' +
          '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">' +
            '<div style="width:52px;height:52px;border-radius:14px;background:'+sbg+';display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">'+emoji+'</div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:15px;font-weight:700;color:var(--t-primary);margin-bottom:2px;">'+(b.business_name||'Provider')+'</div>' +
              '<div style="font-size:13px;color:var(--t-muted);margin-bottom:6px;">'+(b.service_name||'Service')+'</div>' +
              '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t-muted);">' +
                '<i class="far fa-calendar" style="font-size:10px;"></i>' +
                fmtDate(b.booking_date)+' at '+(b.booking_time||'') +
              '</div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">' +
              '<div style="font-size:17px;font-weight:800;color:var(--t-primary);">'+fmtMoney(b.total_amount||0)+'</div>' +
              '<span style="background:'+sbg+';color:'+sc+';font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;text-transform:capitalize;">'+b.status+'</span>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;padding:12px 0;border-top:1px solid var(--i-faint);flex-wrap:wrap;">' +
            '<a href="/provider/'+b.provider_id+'" style="padding:8px 14px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid var(--i-faint);background:transparent;color:var(--t-secondary);text-decoration:none;transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--g-border)\';this.style.color=\'var(--g-main)\'" onmouseout="this.style.borderColor=\'var(--i-faint)\';this.style.color=\'var(--t-secondary)\'">View Venue</a>' +
            (isUnpaid?'<a href="/payment/pay?booking_id='+b.id+'" style="padding:8px 16px;border-radius:100px;font-size:11px;font-weight:700;background:var(--g-main);color:#FFFFFF;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background=\'var(--g-deep)\'" onmouseout="this.style.background=\'var(--g-main)\'">💳 Pay Now</a>':'') +
            (canCancel?'<button onclick="cancelBooking('+b.id+')" style="padding:8px 14px;border-radius:100px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid rgba(255,59,48,0.2);background:transparent;color:#FF3B30;transition:all 0.2s;" onmouseover="this.style.background=\'rgba(255,59,48,0.08)\'" onmouseout="this.style.background=\'transparent\'">Cancel</button>':'') +
            (canRate?'<button onclick="openReview('+b.id+')" style="padding:8px 16px;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;background:var(--g-main);color:#FFFFFF;border:none;transition:background 0.2s;" onmouseover="this.style.background=\'var(--g-deep)\'" onmouseout="this.style.background=\'var(--g-main)\'">⭐ Rate</button>':'') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function filterBookings(status, btn) {
  document.querySelectorAll('.atab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var filtered = status==='All' ? allBookings :
    status==='Upcoming' ? allBookings.filter(function(b){ return b.status==='confirmed'||b.status==='pending'; }) :
    allBookings.filter(function(b){ return b.status===status.toLowerCase(); });
  renderBookings(filtered);
}

function openReview(id) { currentBookingId=id; showModal(); }
function showModal() {
  var m=document.getElementById('rating-modal'); m.style.display='flex'; setTimeout(function(){ m.classList.add('open'); },10);
}
function closeModal() {
  var m=document.getElementById('rating-modal'); m.classList.remove('open'); setTimeout(function(){ m.style.display='none'; },300);
}
function setRating(n) {
  currentRating=n;
  for(var i=1;i<=5;i++) document.getElementById('star-'+i).style.color = i<=n?'#FFB800':'#E0E0E0';
}
function hoverRating(n) {
  for(var i=1;i<=5;i++){
    document.getElementById('star-'+i).style.color = i<=n?'#FFB800':'#E0E0E0';
    document.getElementById('star-'+i).style.transform = i<=n?'scale(1.15)':'scale(1)';
  }
}
function unhoverRating() {
  for(var i=1;i<=5;i++){
    document.getElementById('star-'+i).style.color = i<=currentRating?'#FFB800':'#E0E0E0';
    document.getElementById('star-'+i).style.transform='scale(1)';
  }
}
function submitRating() {
  if(!currentRating){ showToast('Please select a rating','error'); return; }
  var token=localStorage.getItem('sl_token');
  if(!token){ showToast('Please log in','error'); return; }
  axios.post('/api/bookings/'+currentBookingId+'/review',
    { rating:currentRating, comment:document.getElementById('review-text').value },
    { headers:{Authorization:'Bearer '+token} })
    .then(function(){ showToast('Review submitted! Thank you ✦','success'); closeModal(); loadDashboard(); })
    .catch(function(){ showToast('Could not submit review','error'); });
}
function cancelBooking(id) {
  if(!confirm('Cancel this booking?')) return;
  var token=localStorage.getItem('sl_token');
  axios.patch('/api/bookings/'+id+'/status',
    { status:'cancelled', cancellation_reason:'Cancelled by customer' },
    { headers:{Authorization:'Bearer '+token} })
    .then(function(){ showToast('Booking cancelled','info'); loadDashboard(); })
    .catch(function(){ showToast('Could not cancel booking','error'); });
}

function loadDashboard() {
  var token=localStorage.getItem('sl_token');
  var user=JSON.parse(localStorage.getItem('sl_user')||'{}');
  if(!token){ window.location.href='/login'; return; }
  if(user.role==='provider'){ window.location.href='/provider/dashboard'; return; }
  if(user.first_name){
    var sub=document.getElementById('greeting-sub');
    if(sub) sub.textContent='Welcome back, '+user.first_name+'! 👋';
  }
  axios.get('/api/bookings/my',{headers:{Authorization:'Bearer '+token}})
    .then(function(res){
      allBookings=res.data.bookings||[];
      renderBookings(allBookings);
      var completed=allBookings.filter(function(b){return b.status==='completed';}).length;
      var upcoming=allBookings.filter(function(b){return b.status==='confirmed'||b.status==='pending';}).length;
      function setEl(id,val){ var e=document.getElementById(id); if(e) e.textContent=val; }
      setEl('stat-total',allBookings.length);
      setEl('stat-upcoming',upcoming);
      setEl('stat-completed',completed);
      setEl('stat-services',allBookings.length);
      if (!sessionStorage.getItem('sl_review_prompted')) {
        var needsReview=allBookings.find(function(b){ return b.status==='completed'&&!b.has_review; });
        if (needsReview) {
          sessionStorage.setItem('sl_review_prompted','1');
          setTimeout(function(){ openReview(needsReview.id); },1800);
        }
      }
    })
    .catch(function(){ window.location.href='/login'; });
}

document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
  var tok=localStorage.getItem('sl_token');
  if(tok){
    setTimeout(function(){
      fetch('/api/bookings/send-reminders',{method:'POST',headers:{Authorization:'Bearer '+tok}}).catch(function(){});
    },4000);
  }
});
</script>
</body></html>`
