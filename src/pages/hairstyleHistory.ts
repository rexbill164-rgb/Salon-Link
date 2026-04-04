import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'
export const hairstyleHistoryPage = () => `<!DOCTYPE html>
<html lang="en"><head>${baseHead('Hairstyle History')}</head>
<body>
${navbar()}
<div style="min-height:calc(100vh-64px);background:#0F0A1E;padding:32px 16px 80px">
<div class="max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-8">
    <div><h1 class="font-display font-bold text-3xl">Style <span class="gradient-text">History</span></h1><p style="color:#9D8EC0">Your beauty journey</p></div>
  </div>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${[
      {date:'Mar 28, 2025',service:'Gel Manicure',provider:'Nails by Abena',emoji:'💅',color:'#EC4899'},
      {date:'Mar 10, 2025',service:'Natural Twist',provider:'Glam Studio GH',emoji:'💇‍♀️',color:'#7C3AED'},
      {date:'Feb 22, 2025',service:'Loc Retwist',provider:'Glam Studio GH',emoji:'🌿',color:'#10B981'},
      {date:'Feb 5, 2025',service:'Silk Press',provider:'Glam Studio GH',emoji:'✨',color:'#F59E0B'},
      {date:'Jan 18, 2025',service:'Box Braids',provider:'Glam Studio GH',emoji:'💇',color:'#3B82F6'},
      {date:'Jan 2, 2025',service:'Fade Cut',provider:'KutzByKofi',emoji:'✂️',color:'#8B5CF6'},
    ].map(h=>`
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:20px;overflow:hidden;cursor:pointer" class="card-hover">
        <div style="height:160px;background:linear-gradient(135deg,${h.color}33,${h.color}11);display:flex;align-items:center;justify-content:center;font-size:64px">${h.emoji}</div>
        <div style="padding:16px">
          <p class="font-semibold mb-1">${h.service}</p>
          <p class="text-xs mb-1" style="color:#9D8EC0">${h.provider}</p>
          <p class="text-xs" style="color:#9D8EC0"><i class="fas fa-calendar mr-1"></i>${h.date}</p>
          <button onclick="showToast('Rebooked! ✓','success')" class="w-full mt-3 py-2 rounded-xl text-sm font-medium" style="background:#7C3AED22;color:#C4B5FD;border:1px solid #7C3AED33">Rebook This Style</button>
        </div>
      </div>
    `).join('')}
  </div>
</div>
</div>
${mobileNav()}${toastScript()}
</body></html>`
