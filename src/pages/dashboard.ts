import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'

export const dashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('My Bookings')}</head>
<body>
${navbar('dashboard')}
<div style="min-height:calc(100vh-64px);background:#0F0A1E;padding:32px 16px 80px">
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display font-bold text-3xl">My <span class="gradient-text">Bookings</span></h1>
        <p style="color:#9D8EC0" id="greeting">Manage your appointments</p>
      </div>
      <a href="/discover" class="gradient-btn px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2">
        <i class="fas fa-plus"></i> New Booking
      </a>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      ${[
        {label:'Total Bookings',val:'12',icon:'fas fa-calendar-check',color:'#7C3AED'},
        {label:'Completed',val:'8',icon:'fas fa-check-circle',color:'#10B981'},
        {label:'Upcoming',val:'2',icon:'fas fa-clock',color:'#3B82F6'},
        {label:'Total Spent',val:'GHS 680',icon:'fas fa-wallet',color:'#F59E0B'},
      ].map(s=>`
        <div class="stat-card p-4 rounded-2xl">
          <i class="${s.icon} text-xl mb-2 block" style="color:${s.color}"></i>
          <div class="font-bold text-xl">${s.val}</div>
          <div class="text-xs" style="color:#9D8EC0">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6" style="background:#1A1033;border-radius:12px;padding:4px;border:1px solid #2D2250;width:fit-content">
      ${['All','Upcoming','Completed','Cancelled'].map((tab,i)=>
        `<button onclick="filterBookings('${tab.toLowerCase()}',this)" class="booking-tab px-5 py-2.5 rounded-lg text-sm font-medium transition ${i===0?'active':''}\" style="${i===0?'background:#7C3AED;color:white':'color:#9D8EC0'}">${tab}</button>`
      ).join('')}
    </div>

    <!-- Bookings List -->
    <div id="bookings-list" class="flex flex-col gap-4">
      ${generateBookingCards()}
    </div>
  </div>
</div>
${mobileNav('dashboard')}
${toastScript()}
<script>
async function loadBookings() {
  try {
    const token = getToken();
    const res = await axios.get('/api/bookings', { headers: token ? {Authorization:'Bearer '+token} : {} });
    if (res.data && res.data.length > 0) renderBookings(res.data);
  } catch(e) {}
}
function renderBookings(data) {
  const statusColors = {pending:'#F59E0B',confirmed:'#3B82F6',completed:'#10B981',cancelled:'#EF4444'};
  const list = document.getElementById('bookings-list');
  list.innerHTML = data.map(b => \`
    <div class="booking-card p-5 rounded-2xl" data-status="\${b.status}" style="background:#1A1033;border:1px solid #2D2250">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold">\${b.providerName}</h3>
          <p class="text-sm" style="color:#9D8EC0">\${b.service}</p>
        </div>
        <span class="text-xs px-3 py-1 rounded-full font-medium" style="background:\${statusColors[b.status]}22;color:\${statusColors[b.status]}">\${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span>
      </div>
      <div class="flex gap-4 text-sm mb-4" style="color:#9D8EC0">
        <span><i class="fas fa-calendar mr-1"></i>\${b.date}</span>
        <span><i class="fas fa-clock mr-1"></i>\${b.time}</span>
        <span><i class="fas fa-tag mr-1" style="color:#7C3AED"></i>GHS \${b.total}</span>
      </div>
      <div class="flex gap-2">
        \${b.status==='pending'||b.status==='confirmed'?'<button onclick="cancelBooking(\\''+b.id+'\\',this)" class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#EF444422;color:#EF4444;border:1px solid #EF444433">Cancel</button>':''}
        \${b.status==='completed'?'<a href="/provider/'+b.providerId+'" class="px-4 py-2 rounded-xl text-sm font-medium gradient-btn text-white">Rebook</a>':''}
        \${b.status==='completed'?'<button onclick="showReview(\\''+b.id+'\\',\\''+b.providerName+'\\')" class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#7C3AED22;color:#C4B5FD;border:1px solid #7C3AED33">Rate</button>':''}
      </div>
    </div>
  \`).join('');
}
function filterBookings(status, btn) {
  document.querySelectorAll('.booking-tab').forEach(b=>{b.style.background='transparent';b.style.color='#9D8EC0';});
  btn.style.background='#7C3AED';btn.style.color='white';
  document.querySelectorAll('.booking-card').forEach(c=>{
    if(status==='all'||c.dataset.status===status) c.style.display='block';
    else c.style.display='none';
  });
}
async function cancelBooking(id, btn) {
  if(!confirm('Cancel this booking?')) return;
  try {
    await axios.post('/api/bookings/'+id+'/cancel', {}, {headers:{Authorization:'Bearer '+getToken()}});
    showToast('Booking cancelled','info');
    loadBookings();
  } catch(e) { showToast('Cancelled (demo)','info'); btn.closest('.booking-card').querySelector('[data-status]');}
}
function showReview(id, name) {
  const rating = prompt('Rate '+name+' from 1-5 stars:');
  if(rating) { showToast('Thanks for your review! ⭐','success'); }
}
const user = getUser();
if(user.name) document.getElementById('greeting').textContent = 'Welcome back, '+user.name.split(' ')[0]+'!';
loadBookings();
</script>
</body></html>`

function generateBookingCards() {
  const bookings = [
    {id:'SL-10001',provider:'Glam Studio GH',service:'Natural Hair Twist',date:'Tomorrow',time:'2:00 PM',total:82,status:'confirmed',providerId:1},
    {id:'SL-10002',provider:'KutzByKofi',service:'Fade Cut',date:'Apr 10, 2025',time:'10:00 AM',total:42,status:'pending',providerId:2},
    {id:'SL-10003',provider:'Nails by Abena',service:'Gel Manicure',date:'Mar 28, 2025',time:'11:00 AM',total:62,status:'completed',providerId:3},
  ]
  const colors: Record<string,string> = {pending:'#F59E0B',confirmed:'#3B82F6',completed:'#10B981',cancelled:'#EF4444'}
  return bookings.map(b=>`
    <div class="booking-card p-5 rounded-2xl" data-status="${b.status}" style="background:#1A1033;border:1px solid #2D2250">
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold">${b.provider}</h3>
          <p class="text-sm" style="color:#9D8EC0">${b.service}</p>
        </div>
        <span class="text-xs px-3 py-1 rounded-full font-medium capitalize" style="background:${colors[b.status]}22;color:${colors[b.status]}">${b.status}</span>
      </div>
      <div class="flex flex-wrap gap-4 text-sm mb-4" style="color:#9D8EC0">
        <span><i class="fas fa-calendar mr-1"></i>${b.date}</span>
        <span><i class="fas fa-clock mr-1"></i>${b.time}</span>
        <span><i class="fas fa-tag mr-1" style="color:#7C3AED"></i>GHS ${b.total}</span>
      </div>
      <div class="flex gap-2 flex-wrap">
        ${b.status==='pending'||b.status==='confirmed' ? `<button class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#EF444422;color:#EF4444;border:1px solid #EF444433">Cancel</button>` : ''}
        ${b.status==='completed' ? `<a href="/provider/${b.providerId}" class="gradient-btn px-4 py-2 rounded-xl text-white text-sm font-medium">Rebook</a><button onclick="showToast('Rate & review submitted! ⭐','success')" class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#7C3AED22;color:#C4B5FD;border:1px solid #7C3AED33">Rate</button>` : ''}
      </div>
    </div>
  `).join('')
}
