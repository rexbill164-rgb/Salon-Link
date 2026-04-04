import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const dashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('My Bookings', `
<style>
  .booking-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-xl); padding:24px; transition:all 0.4s var(--ease-luxury); }
  .booking-card:hover { border-color:var(--g-border); transform:translateY(-3px); }
  .booking-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:2px 0 0 2px; }
  .booking-card { position:relative; }
  .bc-confirmed::before { background:var(--s-green); }
  .bc-pending::before { background:var(--g-main); }
  .bc-completed::before { background:var(--s-blue); }
  .bc-cancelled::before { background:var(--s-red); }
  .tab-btn { padding:10px 24px; border-radius:100px; font-size:12px; font-weight:700; letter-spacing:0.06em; cursor:pointer; transition:all 0.3s; border:1px solid var(--i-faint); background:transparent; color:var(--t-secondary); }
  .tab-btn.active { background:var(--g-dim); border-color:var(--g-border); color:var(--g-main); }
</style>
`)}
</head>
<body style="background:var(--c-deep);">
${navbar('dashboard')}

<div style="padding:48px 0 120px;">
  <div class="container">

    <!-- Header -->
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:52px;flex-wrap:wrap;gap:20px;" class="afu">
      <div>
        <div class="eyebrow" style="margin-bottom:16px;">Your Account</div>
        <h1 class="display-lg font-display">My <em class="gold-gradient">Bookings</em></h1>
      </div>
      <a href="/discover" class="btn-primary" style="font-size:12px;padding:13px 30px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Booking
      </a>
    </div>

    <!-- Stats row -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:48px;" class="afu-1">
      ${[
        {val:'12',  label:'Total Bookings',  icon:'far fa-calendar-alt', color:'var(--g-deep)'},
        {val:'8',   label:'Completed',        icon:'fas fa-check-circle', color:'#1E8050'},
        {val:'2',   label:'Upcoming',         icon:'fas fa-clock',        color:'#3A72C0'},
        {val:'4.8', label:'Avg Rating Given', icon:'fas fa-star',         color:'var(--g-deep)'},
      ].map(s=>`
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i class="${s.icon}" style="color:${s.color};font-size:16px;"></i>
          </div>
          <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;">${s.val}</div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Filter tabs -->
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:36px;" class="afu-2">
      ${['All','Upcoming','Completed','Cancelled'].map((t,i)=>`<button onclick="filterBookings('${t}',this)" class="tab-btn ${i===0?'active':''}">${t}</button>`).join('')}
    </div>

    <!-- Bookings list -->
    <div id="bookings-list" style="display:flex;flex-direction:column;gap:16px;">
      ${[
        {id:1,provider:'Glam Studio GH', img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=112&q=70', service:'Natural Twist',  date:'Fri Apr 5, 2026',  time:'9:00 AM',  price:'GHS 80',  status:'confirmed', rating:null},
        {id:2,provider:'Glam Studio GH', img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=112&q=70', service:'Box Braids',     date:'Mon Apr 8, 2026',  time:'2:00 PM',  price:'GHS 200', status:'pending',   rating:null},
        {id:3,provider:'KutzByKofi',      img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=112&q=70', service:'Taper Fade',   date:'Wed Mar 27, 2026', time:'11:00 AM', price:'GHS 40',  status:'completed', rating:5},
        {id:4,provider:'Nails by Abena',  img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=112&q=70', service:'Gel Manicure',  date:'Sat Mar 22, 2026', time:'1:00 PM',  price:'GHS 60',  status:'completed', rating:5},
        {id:5,provider:'Relax & Revive',  img:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=112&q=70', service:'Swedish Massage',date:'Mon Mar 10, 2026', time:'3:00 PM',  price:'GHS 120', status:'completed', rating:4},
        {id:6,provider:'Faces by Ama',    img:'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=112&q=70', service:'Evening Glam',  date:'Sat Feb 15, 2026', time:'6:00 PM',  price:'GHS 150', status:'cancelled', rating:null},
      ].map(b=>`
        <div class="booking-card bc-${b.status}">
          <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
            <!-- Provider image -->
            <div style="width:56px;height:56px;border-radius:16px;overflow:hidden;border:1px solid var(--i-faint);flex-shrink:0;">
              <img src="${b.img}" alt="${b.provider}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
            </div>
            <div style="flex:1;min-width:180px;">
              <div style="font-size:15px;font-weight:700;margin-bottom:3px;color:var(--t-primary);">${b.provider}</div>
              <div style="font-size:13px;color:var(--t-secondary);">${b.service}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                <i class="far fa-clock" style="color:var(--t-faint);font-size:10px;"></i>
                <span style="font-size:11px;color:var(--t-muted);">${b.date} · ${b.time}</span>
              </div>
            </div>
            <!-- Price & status -->
            <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;">
              <div style="text-align:right;">
                <div class="font-display gold-gradient" style="font-size:22px;">${b.price}</div>
                ${b.rating ? `<div class="stars" style="font-size:12px;margin-top:3px;">${'★'.repeat(b.rating)}</div>` : ''}
              </div>
              <span class="badge ${b.status==='confirmed'?'badge-verified':b.status==='pending'?'badge-pending':b.status==='completed'?'badge-success':'badge-error'}">${b.status}</span>
              <div style="display:flex;gap:8px;">
                ${b.status==='upcoming'||b.status==='confirmed'||b.status==='pending'
                  ? `<button onclick="showToast('Cancellation sent','info')" class="btn-ghost" style="padding:8px 16px;font-size:11px;color:var(--s-red);border-color:rgba(192,72,72,0.2);"><i class="fas fa-times" style="font-size:10px;"></i> Cancel</button>`
                  : ''}
                ${b.status==='completed' && !b.rating
                  ? `<button onclick="showRatingModal(${b.id})" class="btn-outline" style="padding:8px 16px;font-size:11px;"><i class="fas fa-star" style="font-size:10px;"></i> Rate</button>`
                  : ''}
                <a href="/provider/${b.id}" class="btn-ghost" style="padding:8px 16px;font-size:11px;"><i class="fas fa-eye" style="font-size:10px;"></i> View</a>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

  </div>
</div>

<!-- Rating Modal -->
<div id="rating-modal" class="modal-overlay" style="display:none;" onclick="if(this===event.target)closeModal()">
  <div class="modal">
    <button onclick="closeModal()" style="position:absolute;top:20px;right:20px;background:none;border:none;color:var(--t-faint);font-size:22px;cursor:pointer;">×</button>
    <div class="eyebrow" style="margin-bottom:16px;">Rate Your Experience</div>
    <h3 class="font-display" style="font-size:22px;margin-bottom:24px;">How was your appointment?</h3>
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:24px;" id="star-rating">
      ${[1,2,3,4,5].map(n=>`<span onclick="setRating(${n})" style="font-size:36px;cursor:pointer;transition:transform 0.2s;color:var(--i-faint);" id="star-${n}" onmouseover="hoverRating(${n})" onmouseout="unhoverRating()">★</span>`).join('')}
    </div>
    <textarea id="review-text" class="input" rows="3" placeholder="Tell us about your experience..." style="margin-bottom:20px;resize:none;height:80px;"></textarea>
    <button onclick="submitRating()" class="btn-primary" style="width:100%;justify-content:center;padding:14px;font-size:13px;">Submit Review</button>
  </div>
</div>

${mobileNav('dashboard')}
${globalScripts()}
<script>
var currentRating = 0;

function filterBookings(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('Showing: ' + status, 'info');
}

function showRatingModal(id) {
  var m = document.getElementById('rating-modal');
  m.style.display = 'flex';
  setTimeout(() => m.classList.add('open'), 10);
}

function closeModal() {
  var m = document.getElementById('rating-modal');
  m.classList.remove('open');
  setTimeout(() => m.style.display = 'none', 300);
}

function setRating(n) {
  currentRating = n;
  for (var i = 1; i <= 5; i++) {
    document.getElementById('star-' + i).style.color = i <= n ? 'var(--g-main)' : 'var(--i-faint)';
  }
}

function hoverRating(n) {
  for (var i = 1; i <= 5; i++) {
    document.getElementById('star-' + i).style.color = i <= n ? 'var(--g-light)' : 'var(--i-faint)';
    document.getElementById('star-' + i).style.transform = i <= n ? 'scale(1.15)' : 'scale(1)';
  }
}

function unhoverRating() {
  for (var i = 1; i <= 5; i++) {
    document.getElementById('star-' + i).style.color = i <= currentRating ? 'var(--g-main)' : 'var(--i-faint)';
    document.getElementById('star-' + i).style.transform = 'scale(1)';
  }
}

function submitRating() {
  if (!currentRating) { showToast('Please select a rating', 'error'); return; }
  var token = localStorage.getItem('sl_token');
  if (!token) { showToast('Please log in', 'error'); return; }
  axios.post('/api/bookings/' + currentBookingId + '/review', { rating: currentRating, comment: document.getElementById('review-text').value }, { headers: { Authorization: 'Bearer ' + token } })
    .then(() => { showToast('Review submitted! Thank you ✦', 'success'); closeModal(); loadDashboard(); })
    .catch(() => showToast('Could not submit review', 'error'));
}

var currentBookingId = null;
var allBookings = [];

function fmtMoney(p) { return 'GHS ' + (p/100).toFixed(0); }
function fmtDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-GH',{weekday:'short',month:'short',day:'numeric',year:'numeric'}); }

function renderBookings(list) {
  var grid = document.getElementById('bookings-list');
  if (!list.length) { grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--t-muted);">No bookings yet. <a href="/discover" class="gold-gradient" style="text-decoration:none;font-weight:700;">Find a provider →</a></div>'; return; }
  grid.innerHTML = list.map(function(b) {
    var statusClass = 'bc-' + b.status;
    var badgeClass = b.status === 'confirmed' ? 'badge-verified' : b.status === 'pending' ? 'badge-pending' : b.status === 'completed' ? 'badge-success' : 'badge-error';
    return '<div class="booking-card ' + statusClass + '">' +
      '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">' +
        '<div style="width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">💇‍♀️</div>' +
        '<div style="flex:1;min-width:180px;">' +
          '<div style="font-size:15px;font-weight:700;margin-bottom:3px;">' + b.business_name + '</div>' +
          '<div style="font-size:13px;color:var(--t-secondary);">' + b.service_name + '</div>' +
          '<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">' +
            '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '<span style="font-size:11px;color:var(--t-muted);">' + fmtDate(b.booking_date) + ' · ' + b.booking_time + '</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">' +
          '<div style="text-align:right;">' +
            '<div class="font-display gold-gradient" style="font-size:22px;">' + fmtMoney(b.total_amount) + '</div>' +
          '</div>' +
          '<span class="badge ' + badgeClass + '">' + b.status + '</span>' +
          '<div style="display:flex;gap:8px;">' +
            (b.status === 'confirmed' || b.status === 'pending' ? '<button onclick="cancelBooking(' + b.id + ')" class="btn-ghost" style="padding:8px 16px;font-size:11px;color:var(--s-red);border-color:rgba(192,72,72,0.2);">Cancel</button>' : '') +
            (b.status === 'pending' && b.payment_status === 'unpaid' ? '<button onclick="payBooking(' + b.id + ')" class="btn-primary" style="padding:8px 16px;font-size:11px;">Pay Now</button>' : '') +
            (b.status === 'completed' ? '<button onclick="openReview(' + b.id + ')" class="btn-outline" style="padding:8px 16px;font-size:11px;">Rate</button>' : '') +
            '<a href="/provider/' + b.provider_id + '" class="btn-ghost" style="padding:8px 16px;font-size:11px;">View</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openReview(id) { currentBookingId = id; showRatingModal(id); }

function cancelBooking(id) {
  if (!confirm('Cancel this booking?')) return;
  var token = localStorage.getItem('sl_token');
  axios.patch('/api/bookings/' + id + '/status', { status: 'cancelled', cancellation_reason: 'Cancelled by customer' }, { headers: { Authorization: 'Bearer ' + token } })
    .then(() => { showToast('Booking cancelled', 'info'); loadDashboard(); })
    .catch(() => showToast('Could not cancel booking', 'error'));
}

function payBooking(id) {
  var token = localStorage.getItem('sl_token');
  axios.post('/api/payments/mock-success', { booking_id: id }, { headers: { Authorization: 'Bearer ' + token } })
    .then(() => { showToast('Payment confirmed! ✦', 'success'); loadDashboard(); })
    .catch(() => showToast('Payment failed', 'error'));
}

function filterBookings(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var filtered = status === 'All' ? allBookings :
    status === 'Upcoming' ? allBookings.filter(function(b) { return b.status === 'confirmed' || b.status === 'pending'; }) :
    allBookings.filter(function(b) { return b.status === status.toLowerCase(); });
  renderBookings(filtered);
}

function loadDashboard() {
  var token = localStorage.getItem('sl_token');
  var user = JSON.parse(localStorage.getItem('sl_user') || '{}');
  if (!token) { window.location.href = '/login'; return; }
  // Update greeting
  if (user.first_name) {
    var h = document.querySelector('h1.display-lg');
    if (h) h.innerHTML = 'Welcome, <em class="gold-gradient">' + user.first_name + '</em>';
  }
  axios.get('/api/bookings/my', { headers: { Authorization: 'Bearer ' + token } }).then(function(res) {
    allBookings = res.data.bookings || [];
    renderBookings(allBookings);
    // Update stats
    var completed = allBookings.filter(function(b) { return b.status === 'completed'; }).length;
    var upcoming = allBookings.filter(function(b) { return b.status === 'confirmed' || b.status === 'pending'; }).length;
    var cards = document.querySelectorAll('.stat-card');
    if (cards[0]) cards[0].querySelector('.font-display').textContent = allBookings.length;
    if (cards[1]) cards[1].querySelector('.font-display').textContent = completed;
    if (cards[2]) cards[2].querySelector('.font-display').textContent = upcoming;
  }).catch(function() { window.location.href = '/login'; });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
</script>
</body></html>`
