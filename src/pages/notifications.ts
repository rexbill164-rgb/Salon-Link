import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'
export const notificationsPage = () => `<!DOCTYPE html>
<html lang="en"><head>${baseHead('Notifications')}</head>
<body>
${navbar('notifications')}
<div style="min-height:calc(100vh-64px);background:#0F0A1E;padding:32px 16px 80px">
<div class="max-w-2xl mx-auto">
  <div class="flex items-center justify-between mb-8">
    <h1 class="font-display font-bold text-3xl">Notifications</h1>
    <button onclick="markAllRead()" class="text-sm" style="color:#7C3AED">Mark all read</button>
  </div>
  <div id="notif-list" class="flex flex-col gap-3">
    ${[
      {icon:'✅',title:'Booking Confirmed!',msg:'Your appointment at Glam Studio GH is confirmed for tomorrow 2:00 PM.',time:'1 hour ago',read:false,color:'#10B981'},
      {icon:'⏰',title:'Appointment Reminder',msg:'Come early and get 5% discount! Appointment at 2:00 PM today.',time:'2 hours ago',read:false,color:'#F59E0B'},
      {icon:'🎉',title:'Special Weekend Offer',msg:'KutzByKofi is offering 20% off all cuts this weekend!',time:'1 day ago',read:true,color:'#7C3AED'},
      {icon:'⭐',title:'Rate Your Experience',msg:'How was your Gel Manicure at Nails by Abena? Share your review!',time:'3 days ago',read:true,color:'#EC4899'},
      {icon:'💜',title:'Welcome to SalonLink!',msg:"You're all set! Discover beauty professionals near you.",time:'1 week ago',read:true,color:'#7C3AED'},
    ].map(n=>`
      <div class="flex items-start gap-4 p-5 rounded-2xl transition" style="background:${n.read?'#1A1033':'#7C3AED11'};border:1px solid ${n.read?'#2D2250':'#7C3AED33'}">
        <div style="width:44px;height:44px;border-radius:50%;background:${n.color}22;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px">${n.icon}</div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <p class="font-semibold text-sm">${n.title}</p>
            ${!n.read?'<span class="w-2 h-2 rounded-full" style="background:#7C3AED;flex-shrink:0"></span>':''}
          </div>
          <p class="text-sm mb-1" style="color:#9D8EC0">${n.msg}</p>
          <p class="text-xs" style="color:#4B4069">${n.time}</p>
        </div>
      </div>
    `).join('')}
  </div>
</div>
</div>
${mobileNav()}${toastScript()}
<script>
async function markAllRead() {
  try { await axios.post('/api/notifications/mark-all-read'); } catch(e) {}
  document.querySelectorAll('[style*="7C3AED11"]').forEach(el=>{
    el.style.background='#1A1033';el.style.borderColor='#2D2250';
  });
  document.querySelectorAll('.w-2.h-2.rounded-full').forEach(d=>d.remove());
  showToast('All notifications marked as read','success');
}
async function loadNotifications() {
  try {
    const res = await axios.get('/api/notifications');
    // Would render real data
  } catch(e) {}
}
loadNotifications();
</script>
</body></html>`
