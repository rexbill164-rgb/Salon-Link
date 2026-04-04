import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const notificationsPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Notifications')}</head>
<body class="bg-grain">
${navbar('notifications')}

<div style="padding:48px 0 120px;">
  <div class="container-sm">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:48px;" class="afu">
      <div>
        <div class="eyebrow" style="margin-bottom:16px;">Updates</div>
        <h1 class="display-lg font-display">Your <em class="gold-gradient">Alerts</em></h1>
      </div>
      <button onclick="showToast('All notifications marked as read','success')" class="btn-ghost" style="font-size:12px;padding:10px 22px;">Mark All Read</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:3px;">
      ${[
        {type:'booking',icon:'📅',title:'Booking Confirmed',body:'Your appointment at Glam Studio GH on Apr 5 at 9:00 AM has been confirmed.',time:'2 minutes ago',unread:true},
        {type:'reminder',icon:'⏰',title:'Appointment Tomorrow',body:'Reminder: You have a Natural Twist at Glam Studio GH tomorrow at 9:00 AM.',time:'3 hours ago',unread:true},
        {type:'discount',icon:'🎁',title:'Special Offer',body:'KutzByKofi is offering 20% off on all bookings this weekend. Book now!',time:'Yesterday',unread:true},
        {type:'review',icon:'⭐',title:'Leave a Review',body:'How was your experience at Nails by Abena? Rate your appointment.',time:'2 days ago',unread:false},
        {type:'booking',icon:'✅',title:'Appointment Completed',body:'Your appointment at KutzByKofi is marked as completed. Thank you!',time:'3 days ago',unread:false},
        {type:'promo',icon:'✦',title:'Welcome to SalonLink',body:'Discover Ghana\'s most exceptional beauty professionals. Your first booking is waiting.',time:'1 week ago',unread:false},
      ].map(n=>`
        <div onclick="markRead(this)" style="display:flex;align-items:flex-start;gap:18px;padding:22px;border-radius:var(--r-lg);cursor:pointer;transition:background 0.2s;background:${n.unread?'rgba(201,168,76,0.04)':'transparent'};border:1px solid ${n.unread?'rgba(201,168,76,0.1)':'transparent'};" onmouseover="this.style.background='var(--i-ghost)'" onmouseout="this.style.background='${n.unread?'rgba(201,168,76,0.04)':'transparent'}'">
          <div style="width:46px;height:46px;border-radius:14px;background:${n.unread?'var(--g-dim)':'var(--c-surface)'};border:1px solid ${n.unread?'var(--g-border)':'var(--i-faint)'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${n.icon}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:5px;">
              <div style="font-size:14px;font-weight:${n.unread?'700':'500'};display:flex;align-items:center;gap:8px;">
                ${n.title}
                ${n.unread ? '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g-main);flex-shrink:0;"></span>' : ''}
              </div>
              <span style="font-size:11px;color:var(--t-faint);white-space:nowrap;">${n.time}</span>
            </div>
            <p style="font-size:13px;color:var(--t-secondary);line-height:1.7;font-weight:300;">${n.body}</p>
          </div>
        </div>
      `).join('')}
    </div>

  </div>
</div>

${mobileNav('notifications')}
${globalScripts()}
<script>
function markRead(el) {
  el.style.background = 'transparent';
  el.style.borderColor = 'transparent';
  var dot = el.querySelector('[style*="border-radius:50%"]');
  if(dot) dot.remove();
}
</script>
</body></html>`
