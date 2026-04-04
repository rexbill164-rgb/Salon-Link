import { baseHead, toastScript } from '../utils/layout'

export const providerDashboardPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Provider Dashboard')}</head>
<body style="display:flex;min-height:100vh;background:#0F0A1E">

<!-- Sidebar -->
<div class="sidebar hidden md:flex flex-col" style="background:#1A1033;border-right:1px solid #2D2250;width:260px;flex-shrink:0">
  <div class="p-6 border-b" style="border-color:#2D2250">
    <div class="flex items-center gap-3">
      <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#EC4899);display:flex;align-items:center;justify-content:center;font-size:22px">💇‍♀️</div>
      <div>
        <div class="font-bold text-sm" id="biz-name">Glam Studio GH</div>
        <div class="text-xs flex items-center gap-1" style="color:#10B981"><i class="fas fa-check-circle"></i> Verified</div>
      </div>
    </div>
  </div>
  <nav class="flex-1 p-4">
    ${[
      {icon:'fas fa-chart-line',label:'Dashboard',href:'#',active:true},
      {icon:'fas fa-calendar-alt',label:'Appointments',href:'#appointments'},
      {icon:'fas fa-users',label:'Clients',href:'#clients'},
      {icon:'fas fa-images',label:'Style History',href:'/hairstyle-history'},
      {icon:'fas fa-star',label:'Reviews',href:'#reviews'},
      {icon:'fas fa-wallet',label:'Earnings',href:'#earnings'},
      {icon:'fas fa-id-card',label:'KYC Verification',href:'#kyc'},
      {icon:'fas fa-cog',label:'Settings',href:'/settings'},
    ].map(l=>`
      <a href="${l.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition ${l.active?'':'hover:bg-purple-900'}" style="${l.active?'background:#7C3AED22;color:#C4B5FD;border:1px solid #7C3AED33':'color:#9D8EC0'}">
        <i class="${l.icon} w-5"></i> ${l.label}
      </a>
    `).join('')}
  </nav>
  <div class="p-4 border-t" style="border-color:#2D2250">
    <a href="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style="color:#9D8EC0">
      <i class="fas fa-globe w-5"></i> View Public Profile
    </a>
    <button onclick="logout()" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full" style="color:#EF4444">
      <i class="fas fa-sign-out-alt w-5"></i> Logout
    </button>
  </div>
</div>

<!-- Main content -->
<div class="flex-1 overflow-auto">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:#2D2250;background:#1A1033">
    <div>
      <h1 class="font-display font-bold text-xl">Provider Dashboard</h1>
      <p class="text-sm" style="color:#9D8EC0">Manage your salon and bookings</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs px-3 py-1 rounded-full" style="background:#10B98122;color:#10B981;border:1px solid #10B98133">● Open for Bookings</span>
      <button class="w-9 h-9 rounded-xl glass flex items-center justify-center relative" style="border:1px solid #2D2250">
        <i class="fas fa-bell"></i>
        <span style="position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#EF4444;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center">3</span>
      </button>
    </div>
  </div>

  <div class="p-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${[
        {label:"Today's Bookings",val:'6',icon:'fas fa-calendar-day',color:'#7C3AED',change:'+2 from yesterday'},
        {label:"This Week's Revenue",val:'GHS 2,480',icon:'fas fa-coins',color:'#F59E0B',change:'+18% vs last week'},
        {label:'Total Clients',val:'248',icon:'fas fa-users',color:'#10B981',change:'+12 this month'},
        {label:'Avg Rating',val:'4.9 ★',icon:'fas fa-star',color:'#EC4899',change:'Based on 128 reviews'},
      ].map(s=>`
        <div class="stat-card p-5 rounded-2xl">
          <div class="flex items-center justify-between mb-3">
            <div style="width:40px;height:40px;border-radius:12px;background:${s.color}22;display:flex;align-items:center;justify-content:center">
              <i class="${s.icon}" style="color:${s.color}"></i>
            </div>
          </div>
          <div class="font-display font-bold text-2xl mb-1">${s.val}</div>
          <div class="text-xs font-medium mb-1" style="color:#9D8EC0">${s.label}</div>
          <div class="text-xs" style="color:#10B981">${s.change}</div>
        </div>
      `).join('')}
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Today's Schedule -->
      <div class="lg:col-span-2">
        <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:24px">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-semibold text-lg">Today's Schedule</h2>
            <span class="text-sm" style="color:#9D8EC0">${new Date().toLocaleDateString('en-GH',{weekday:'long',day:'numeric',month:'long'})}</span>
          </div>
          ${[
            {time:'9:00 AM',client:'Akosua Mensah',service:'Natural Hair Twist',duration:'2-3 hrs',status:'confirmed',price:80},
            {time:'11:30 AM',client:'Efua Tetteh',service:'Box Braids (Medium)',duration:'4-5 hrs',status:'confirmed',price:150},
            {time:'2:00 PM',client:'Ama Darko',service:'Silk Press',duration:'2 hrs',status:'pending',price:100},
            {time:'4:30 PM',client:'Maame Asante',service:'Loc Retwist',duration:'1.5 hrs',status:'confirmed',price:60},
          ].map(a=>`
            <div class="flex items-center gap-4 p-4 rounded-xl mb-3" style="background:#0F0A1E;border:1px solid #2D2250">
              <div style="text-align:center;min-width:56px">
                <div class="text-xs font-bold" style="color:#7C3AED">${a.time}</div>
              </div>
              <div style="width:3px;height:50px;border-radius:2px;background:${a.status==='confirmed'?'#10B981':'#F59E0B'}"></div>
              <div class="flex-1">
                <p class="font-semibold text-sm">${a.client}</p>
                <p class="text-xs" style="color:#9D8EC0">${a.service} · ${a.duration}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-sm" style="color:#7C3AED">GHS ${a.price}</div>
                <span class="text-xs px-2 py-0.5 rounded-full capitalize" style="background:${a.status==='confirmed'?'#10B98122':'#F59E0B22'};color:${a.status==='confirmed'?'#10B981':'#F59E0B'}">${a.status}</span>
              </div>
              <div class="flex gap-1">
                <button onclick="showToast('Appointment confirmed ✓','success')" class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#10B98122;color:#10B981"><i class="fas fa-check text-xs"></i></button>
                <button onclick="showToast('Client messaged','info')" class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#3B82F622;color:#3B82F6"><i class="fas fa-comment text-xs"></i></button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Actions + KYC status -->
      <div class="flex flex-col gap-4">
        <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:24px">
          <h3 class="font-semibold mb-4">Quick Actions</h3>
          ${[
            {icon:'fas fa-calendar-plus',label:'Add Booking',color:'#7C3AED',action:"window.location.href='/book/1'"},
            {icon:'fas fa-images',label:'Upload Style Photo',color:'#EC4899',action:"showUploadModal()"},
            {icon:'fas fa-clock',label:'Update Hours',color:'#F59E0B',action:"showToast('Hours updated!','success')"},
            {icon:'fas fa-share-alt',label:'Share Profile',color:'#10B981',action:"navigator.clipboard?.writeText(window.location.origin+'/provider/1');showToast('Profile link copied!','success')"},
          ].map(a=>`
            <button onclick="${a.action}" class="flex items-center gap-3 w-full p-3 rounded-xl mb-2 text-left hover:bg-purple-900 transition" style="background:#0F0A1E;border:1px solid #2D2250">
              <div style="width:36px;height:36px;border-radius:10px;background:${a.color}22;display:flex;align-items:center;justify-content:center">
                <i class="${a.icon} text-sm" style="color:${a.color}"></i>
              </div>
              <span class="text-sm font-medium">${a.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- KYC Status Card -->
        <div style="background:linear-gradient(135deg,#10B98122,#10B98111);border:1px solid #10B98133;border-radius:20px;padding:20px">
          <div class="flex items-center gap-3 mb-3">
            <div style="width:40px;height:40px;border-radius:50%;background:#10B98133;display:flex;align-items:center;justify-content:center;font-size:18px">✅</div>
            <div>
              <p class="font-semibold text-sm">KYC Verified</p>
              <p class="text-xs" style="color:#10B981">Ghana Card • Face Match</p>
            </div>
          </div>
          <p class="text-xs" style="color:#9D8EC0">Your identity has been verified. Customers can trust and book you with confidence.</p>
        </div>

        <!-- Revenue mini chart -->
        <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;padding:20px">
          <h4 class="font-semibold text-sm mb-3">Weekly Revenue</h4>
          <div class="flex items-end gap-2" style="height:60px">
            ${[40,65,45,80,55,90,70].map((h,i)=>`
              <div style="flex:1;background:${i===5?'#7C3AED':'#2D2250'};height:${h}%;border-radius:4px 4px 0 0;transition:0.3s" title="${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}"></div>
            `).join('')}
          </div>
          <div class="flex justify-between mt-1">
            ${['M','T','W','T','F','S','S'].map(d=>`<span class="text-xs" style="color:#9D8EC0;flex:1;text-align:center">${d}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Upload Modal -->
<div id="upload-modal" class="modal-overlay" style="display:none">
  <div class="modal-box">
    <h3 class="font-display font-bold text-xl mb-4">Upload Style Photo</h3>
    <p class="text-sm mb-4" style="color:#9D8EC0">Upload a photo after completing a client's service.</p>
    <select class="w-full px-4 py-3 rounded-xl text-sm mb-4" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3">
      <option>Select Client</option>
      <option>Akosua Mensah</option>
      <option>Efua Tetteh</option>
      <option>Ama Darko</option>
    </select>
    <div style="border:2px dashed #2D2250;border-radius:16px;padding:40px;text-align:center;cursor:pointer;margin-bottom:16px" onclick="document.getElementById('photo-input').click()">
      <i class="fas fa-camera text-3xl mb-3" style="color:#7C3AED"></i>
      <p class="text-sm" style="color:#9D8EC0">Click to upload or take photo</p>
      <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhotoUpload(this)"/>
    </div>
    <div class="flex gap-3">
      <button onclick="document.getElementById('upload-modal').style.display='none'" class="flex-1 py-3 rounded-xl" style="background:#0F0A1E;border:1px solid #2D2250">Cancel</button>
      <button onclick="uploadStylePhoto()" class="flex-1 gradient-btn py-3 rounded-xl text-white font-semibold">Upload Photo</button>
    </div>
  </div>
</div>

${toastScript()}
<script>
function showUploadModal() { document.getElementById('upload-modal').style.display='flex'; }
function handlePhotoUpload(input) { if(input.files[0]) showToast('Photo selected: '+input.files[0].name,'info'); }
async function uploadStylePhoto() {
  try {
    await axios.post('/api/uploads/hairstyle', {}, {headers:{Authorization:'Bearer '+getToken()}});
    showToast('Style photo uploaded successfully! 📸','success');
    document.getElementById('upload-modal').style.display='none';
  } catch(e) { showToast('Photo uploaded (demo)','success'); document.getElementById('upload-modal').style.display='none'; }
}
const user = getUser();
if(user.businessName || user.name) document.getElementById('biz-name').textContent = user.businessName || user.name;
</script>
</body></html>`
