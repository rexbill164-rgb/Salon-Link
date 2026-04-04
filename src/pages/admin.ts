import { baseHead, toastScript } from '../utils/layout'

export const adminPanelPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Admin Panel')}</head>
<body style="display:flex;min-height:100vh;background:#0F0A1E">
<div style="width:240px;background:#1A1033;border-right:1px solid #2D2250;flex-shrink:0;display:flex;flex-direction:column">
  <div class="p-5 border-b" style="border-color:#2D2250">
    <div class="flex items-center gap-3">
      <div style="width:36px;height:36px;border-radius:10px;background:#7C3AED;display:flex;align-items:center;justify-content:center">✂️</div>
      <div><div class="font-bold text-sm">SalonLink</div><div class="text-xs" style="color:#F59E0B">Admin Panel</div></div>
    </div>
  </div>
  <nav class="flex-1 p-3">
    ${[
      {icon:'fas fa-chart-pie',label:'Overview',id:'overview'},
      {icon:'fas fa-users',label:'Users',id:'users'},
      {icon:'fas fa-store',label:'Providers',id:'providers'},
      {icon:'fas fa-calendar-check',label:'Bookings',id:'bookings'},
      {icon:'fas fa-id-card',label:'KYC Queue',id:'kyc'},
      {icon:'fas fa-flag',label:'Flagged',id:'flagged'},
      {icon:'fas fa-chart-bar',label:'Reports',id:'reports'},
    ].map((l,i)=>`
      <button onclick="showSection('${l.id}',this)" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-1 text-sm font-medium transition text-left ${i===0?'active-nav':''}\" style="${i===0?'background:#7C3AED22;color:#C4B5FD;border:1px solid #7C3AED22':'color:#9D8EC0'}">
        <i class="${l.icon} w-4"></i> ${l.label}
      </button>
    `).join('')}
  </nav>
  <div class="p-3 border-t" style="border-color:#2D2250">
    <a href="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style="color:#9D8EC0"><i class="fas fa-home w-4"></i> Back to App</a>
    <button onclick="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-left" style="color:#EF4444"><i class="fas fa-sign-out-alt w-4"></i> Logout</button>
  </div>
</div>

<div class="flex-1 overflow-auto">
  <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:#2D2250;background:#1A1033">
    <h1 class="font-display font-bold text-xl" id="section-title">Platform Overview</h1>
    <div class="flex items-center gap-3">
      <span class="text-xs px-3 py-1 rounded-full" style="background:#10B98122;color:#10B981">● Live</span>
      <span class="text-sm" style="color:#9D8EC0">${new Date().toLocaleDateString('en-GH',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
    </div>
  </div>

  <div class="p-6">
    <!-- Overview Section -->
    <div id="section-overview">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        ${[
          {label:'Total Users',val:'1,248',icon:'fas fa-users',color:'#7C3AED',change:'+48 this week'},
          {label:'Providers',val:'312',icon:'fas fa-store',color:'#EC4899',change:'+12 pending KYC'},
          {label:'Total Bookings',val:'8,942',icon:'fas fa-calendar',color:'#3B82F6',change:'+234 today'},
          {label:'Revenue (GHS)',val:'284,600',icon:'fas fa-coins',color:'#F59E0B',change:'+GHS 12,400 today'},
        ].map(s=>`
          <div class="stat-card p-5 rounded-2xl">
            <div style="width:40px;height:40px;border-radius:12px;background:${s.color}22;display:flex;align-items:center;justify-content:center;margin-bottom:12px">
              <i class="${s.icon}" style="color:${s.color}"></i>
            </div>
            <div class="font-display font-bold text-2xl mb-1">${s.val}</div>
            <div class="text-xs font-medium mb-1" style="color:#9D8EC0">${s.label}</div>
            <div class="text-xs" style="color:#10B981">${s.change}</div>
          </div>
        `).join('')}
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2" style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:24px">
          <h3 class="font-semibold mb-4">Booking Trends (Last 7 days)</h3>
          <canvas id="bookings-chart" height="100"></canvas>
        </div>
        <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:24px">
          <h3 class="font-semibold mb-4">Alerts</h3>
          ${[
            {icon:'🔴',label:'Flagged Accounts',val:'5',action:'flagged'},
            {icon:'🟡',label:'Pending KYC',val:'23',action:'kyc'},
            {icon:'🟠',label:'Dispute Reports',val:'3',action:'reports'},
            {icon:'🟢',label:'Active Providers',val:'289',action:'providers'},
          ].map(a=>`
            <div onclick="showSection('${a.action}')" class="flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer hover:bg-purple-900 transition" style="background:#0F0A1E;border:1px solid #2D2250">
              <span class="text-sm">${a.icon} ${a.label}</span>
              <span class="font-bold text-sm" style="color:#C4B5FD">${a.val}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Users Section -->
    <div id="section-users" style="display:none">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-semibold text-lg">All Users</h2>
        <input type="text" placeholder="Search users..." class="px-4 py-2 rounded-xl text-sm" style="background:#1A1033;border:1px solid #2D2250;width:240px"/>
      </div>
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:16px;overflow:hidden">
        <table class="w-full">
          <thead>
            <tr style="border-bottom:1px solid #2D2250">
              <th class="text-left p-4 text-sm font-semibold" style="color:#9D8EC0">User</th>
              <th class="text-left p-4 text-sm font-semibold" style="color:#9D8EC0">Role</th>
              <th class="text-left p-4 text-sm font-semibold" style="color:#9D8EC0">Status</th>
              <th class="text-left p-4 text-sm font-semibold" style="color:#9D8EC0">Joined</th>
              <th class="text-left p-4 text-sm font-semibold" style="color:#9D8EC0">Actions</th>
            </tr>
          </thead>
          <tbody id="users-table">
            ${[
              {name:'Demo Customer',email:'customer@demo.com',role:'customer',status:'active',joined:'Jan 15, 2025'},
              {name:'Glam Studio GH',email:'provider@demo.com',role:'provider',status:'active',joined:'Feb 2, 2025'},
              {name:'KutzByKofi',email:'kofi@demo.com',role:'provider',status:'active',joined:'Feb 10, 2025'},
              {name:'Jane Stylist',email:'jane@demo.com',role:'provider',status:'pending',joined:'Mar 20, 2025'},
              {name:'Flagged User',email:'flagged@demo.com',role:'customer',status:'flagged',joined:'Mar 25, 2025'},
            ].map(u=>`
              <tr style="border-bottom:1px solid #2D2250">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold">${u.name[0]}</div>
                    <div><div class="text-sm font-medium">${u.name}</div><div class="text-xs" style="color:#9D8EC0">${u.email}</div></div>
                  </div>
                </td>
                <td class="p-4"><span class="tag capitalize">${u.role}</span></td>
                <td class="p-4"><span class="text-xs px-2 py-1 rounded-full capitalize" style="background:${u.status==='active'?'#10B98122':u.status==='pending'?'#F59E0B22':'#EF444422'};color:${u.status==='active'?'#10B981':u.status==='pending'?'#F59E0B':'#EF4444'}">${u.status}</span></td>
                <td class="p-4 text-sm" style="color:#9D8EC0">${u.joined}</td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <button onclick="showToast('User details viewed','info')" class="text-xs px-3 py-1.5 rounded-lg" style="background:#7C3AED22;color:#C4B5FD">View</button>
                    ${u.status!=='flagged'?`<button onclick="showToast('User suspended','warning')" class="text-xs px-3 py-1.5 rounded-lg" style="background:#EF444422;color:#EF4444">Suspend</button>`:'<button onclick="showToast(\'Account reinstated\',\'success\')" class="text-xs px-3 py-1.5 rounded-lg" style="background:#10B98122;color:#10B981">Reinstate</button>'}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- KYC Section -->
    <div id="section-kyc" style="display:none">
      <h2 class="font-semibold text-lg mb-6">KYC Verification Queue</h2>
      <div class="flex flex-col gap-4">
        ${[
          {name:'Jane Stylist',biz:'Jane Hair Studio',submitted:'2 hours ago',type:'Hair Salon'},
          {name:'Kofi Barber',biz:'Kofi Kutz',submitted:'5 hours ago',type:'Barbershop'},
          {name:'Abena Nails',biz:'Nails by Abena Plus',submitted:'1 day ago',type:'Nail Tech'},
        ].map(k=>`
          <div style="background:#1A1033;border:1px solid #2D2250;border-radius:16px;padding:20px">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-weight:bold">${k.name[0]}</div>
                <div>
                  <p class="font-semibold">${k.name}</p>
                  <p class="text-sm" style="color:#9D8EC0">${k.biz} · ${k.type}</p>
                  <p class="text-xs" style="color:#9D8EC0">Submitted ${k.submitted}</p>
                </div>
              </div>
              <span class="text-xs px-3 py-1 rounded-full" style="background:#F59E0B22;color:#F59E0B">Pending Review</span>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div style="background:#0F0A1E;border:1px solid #2D2250;border-radius:12px;padding:16px;text-align:center">
                <i class="fas fa-id-card text-2xl mb-2" style="color:#7C3AED"></i>
                <p class="text-xs" style="color:#9D8EC0">Ghana Card</p>
                <p class="text-xs font-medium" style="color:#10B981">Uploaded ✓</p>
              </div>
              <div style="background:#0F0A1E;border:1px solid #2D2250;border-radius:12px;padding:16px;text-align:center">
                <i class="fas fa-user-circle text-2xl mb-2" style="color:#EC4899"></i>
                <p class="text-xs" style="color:#9D8EC0">Live Selfie</p>
                <p class="text-xs font-medium" style="color:#10B981">Captured ✓</p>
              </div>
              <div style="background:#0F0A1E;border:1px solid #2D2250;border-radius:12px;padding:16px;text-align:center">
                <i class="fas fa-fingerprint text-2xl mb-2" style="color:#F59E0B"></i>
                <p class="text-xs" style="color:#9D8EC0">Face Match</p>
                <p class="text-xs font-medium" style="color:#F59E0B">Pending</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button onclick="approveKYC(this)" class="flex-1 py-2.5 rounded-xl text-sm font-semibold" style="background:#10B98122;color:#10B981;border:1px solid #10B98133">
                <i class="fas fa-check mr-2"></i>Approve & Verify
              </button>
              <button onclick="rejectKYC(this)" class="flex-1 py-2.5 rounded-xl text-sm font-semibold" style="background:#EF444422;color:#EF4444;border:1px solid #EF444433">
                <i class="fas fa-times mr-2"></i>Reject
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Providers + Bookings + Flagged + Reports sections -->
    <div id="section-providers" style="display:none">
      <h2 class="font-semibold text-lg mb-4">All Providers</h2>
      <p style="color:#9D8EC0">312 registered providers. Use filters to manage.</p>
    </div>
    <div id="section-bookings" style="display:none">
      <h2 class="font-semibold text-lg mb-4">All Bookings</h2>
      <p style="color:#9D8EC0">8,942 total bookings. Export and manage here.</p>
    </div>
    <div id="section-flagged" style="display:none">
      <h2 class="font-semibold text-lg mb-4">Flagged Accounts</h2>
      <p style="color:#9D8EC0">5 accounts flagged for review (fake bookings, repeated cancellations).</p>
    </div>
    <div id="section-reports" style="display:none">
      <h2 class="font-semibold text-lg mb-4">Reports & Analytics</h2>
      <canvas id="revenue-chart" height="80"></canvas>
    </div>
  </div>
</div>

${toastScript()}
<script>
function showSection(id, btn) {
  document.querySelectorAll('[id^="section-"]').forEach(s=>s.style.display='none');
  document.getElementById('section-'+id).style.display='block';
  document.querySelectorAll('.active-nav, nav button').forEach(b=>{b.style.background='transparent';b.style.color='#9D8EC0';b.style.border='none';});
  if(btn){btn.style.background='#7C3AED22';btn.style.color='#C4B5FD';btn.style.border='1px solid #7C3AED22';}
  const titles={overview:'Platform Overview',users:'User Management',providers:'Provider Management',bookings:'Booking Management',kyc:'KYC Verification Queue',flagged:'Flagged Accounts',reports:'Reports & Analytics'};
  document.getElementById('section-title').textContent=titles[id]||id;
}
function approveKYC(btn) { btn.closest('[style*="border-radius:16px"]').style.borderColor='#10B98144'; showToast('Provider verified successfully! ✅','success'); }
function rejectKYC(btn) { showToast('KYC rejected. Provider notified.','warning'); }

// Charts
document.addEventListener('DOMContentLoaded',()=>{
  const ctx = document.getElementById('bookings-chart');
  if(ctx) new Chart(ctx,{
    type:'line',
    data:{
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[{label:'Bookings',data:[45,62,58,80,72,95,68],borderColor:'#7C3AED',backgroundColor:'#7C3AED22',fill:true,tension:0.4,borderWidth:2}]
    },
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{color:'#2D2250'},ticks:{color:'#9D8EC0'}},y:{grid:{color:'#2D2250'},ticks:{color:'#9D8EC0'}}}}
  });
});
</script>
</body></html>`
