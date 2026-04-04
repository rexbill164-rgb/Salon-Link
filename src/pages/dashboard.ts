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
<body class="bg-grain">
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
        {val:'12',  label:'Total Bookings',icon:'📅'},
        {val:'8',   label:'Completed',     icon:'✅'},
        {val:'2',   label:'Upcoming',      icon:'🔜'},
        {val:'4.8', label:'Avg Rating Given',icon:'⭐'},
      ].map(s=>`
        <div class="stat-card">
          <div style="font-size:24px;margin-bottom:10px;">${s.icon}</div>
          <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;">${s.val}</div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">${s.label}</div>
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
        {id:1,provider:'Glam Studio GH',  emoji:'💇‍♀️',service:'Natural Twist',   date:'Fri Apr 5, 2026', time:'9:00 AM', price:'GHS 80',  status:'confirmed', rating:null},
        {id:2,provider:'Glam Studio GH',  emoji:'💇‍♀️',service:'Box Braids',      date:'Mon Apr 8, 2026', time:'2:00 PM', price:'GHS 200', status:'pending',   rating:null},
        {id:3,provider:'KutzByKofi',       emoji:'✂️',  service:'Taper Fade',       date:'Wed Mar 27, 2026',time:'11:00 AM',price:'GHS 40',  status:'completed', rating:5},
        {id:4,provider:'Nails by Abena',   emoji:'💅',  service:'Gel Manicure',     date:'Sat Mar 22, 2026',time:'1:00 PM', price:'GHS 60',  status:'completed', rating:5},
        {id:5,provider:'Relax & Revive',   emoji:'💆',  service:'Swedish Massage',  date:'Mon Mar 10, 2026',time:'3:00 PM', price:'GHS 120', status:'completed', rating:4},
        {id:6,provider:'Faces by Ama',     emoji:'💄',  service:'Evening Glam',     date:'Sat Feb 15, 2026',time:'6:00 PM', price:'GHS 150', status:'cancelled', rating:null},
      ].map(b=>`
        <div class="booking-card bc-${b.status}">
          <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <!-- Provider -->
            <div style="width:56px;height:56px;border-radius:18px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;">${b.emoji}</div>
            <div style="flex:1;min-width:180px;">
              <div style="font-size:15px;font-weight:700;margin-bottom:3px;">${b.provider}</div>
              <div style="font-size:13px;color:var(--t-secondary);">${b.service}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style="font-size:11px;color:var(--t-muted);">${b.date} · ${b.time}</span>
              </div>
            </div>
            <!-- Price & status -->
            <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
              <div style="text-align:right;">
                <div class="font-display gold-gradient" style="font-size:22px;">${b.price}</div>
                ${b.rating ? `<div class="stars" style="font-size:12px;margin-top:3px;">${'★'.repeat(b.rating)}</div>` : ''}
              </div>
              <span class="badge ${b.status==='confirmed'?'badge-verified':b.status==='pending'?'badge-pending':b.status==='completed'?'badge-success':'badge-error'}">${b.status}</span>
              <div style="display:flex;gap:8px;">
                ${b.status==='upcoming'||b.status==='confirmed'||b.status==='pending'
                  ? `<button onclick="showToast('Cancellation sent','info')" class="btn-ghost" style="padding:8px 16px;font-size:11px;color:var(--s-red);border-color:rgba(192,72,72,0.2);">Cancel</button>`
                  : ''}
                ${b.status==='completed' && !b.rating
                  ? `<button onclick="showRatingModal(${b.id})" class="btn-outline" style="padding:8px 16px;font-size:11px;">Rate</button>`
                  : ''}
                <a href="/provider/${b.id}" class="btn-ghost" style="padding:8px 16px;font-size:11px;">View</a>
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
  showToast('Review submitted! Thank you ✦', 'success');
  closeModal();
}
</script>
</body></html>`
