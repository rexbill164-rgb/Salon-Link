import { baseHead, navbar, mobileNav, toastScript } from '../utils/layout'
export const settingsPage = () => `<!DOCTYPE html>
<html lang="en"><head>${baseHead('Settings')}</head>
<body>
${navbar('settings')}
<div style="min-height:calc(100vh-64px);background:#0F0A1E;padding:32px 16px 80px">
<div class="max-w-2xl mx-auto">
  <h1 class="font-display font-bold text-3xl mb-8">Settings</h1>
  <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;overflow:hidden">
    ${[
      {section:'Profile',items:[{icon:'fas fa-user',label:'Edit Profile',action:"showToast('Profile updated','success')"},{icon:'fas fa-phone',label:'Change Phone Number',action:"showToast('OTP sent','info')"},{icon:'fas fa-envelope',label:'Change Email',action:"showToast('Verification sent','info')"}]},
      {section:'Security',items:[{icon:'fas fa-lock',label:'Change Password',action:"showToast('Password updated','success')"},{icon:'fas fa-shield-alt',label:'Two-Factor Auth',action:"showToast('2FA enabled','success')"},{icon:'fas fa-sign-out-alt',label:'Logout',action:"logout()"}]},
      {section:'Notifications',items:[{icon:'fas fa-bell',label:'Push Notifications',action:"showToast('Notifications toggled','info')"},{icon:'fas fa-sms',label:'SMS Reminders',action:"showToast('SMS preferences saved','success')"}]},
      {section:'Support',items:[{icon:'fas fa-question-circle',label:'Help Center',action:"showToast('Opening help center','info')"},{icon:'fas fa-flag',label:'Report an Issue',action:"showToast('Report submitted','info')"}]},
    ].map((section,si)=>`
      <div class="${si>0?'border-t':''}\" style="${si>0?'border-color:#2D2250':''}">
        <p class="px-6 py-3 text-xs font-bold uppercase tracking-wider" style="color:#9D8EC0;background:#0F0A1E">${section.section}</p>
        ${section.items.map(item=>`
          <button onclick="${item.action}" class="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-purple-900 transition border-b" style="border-color:#2D2250">
            <div style="width:36px;height:36px;border-radius:10px;background:#7C3AED22;display:flex;align-items:center;justify-content:center">
              <i class="${item.icon} text-sm" style="color:#7C3AED"></i>
            </div>
            <span class="flex-1 text-sm font-medium">${item.label}</span>
            <i class="fas fa-chevron-right text-xs" style="color:#9D8EC0"></i>
          </button>
        `).join('')}
      </div>
    `).join('')}
  </div>
  <p class="text-center text-xs mt-8" style="color:#9D8EC0">SalonLink v1.0.0 • Made with 💜 in Ghana</p>
</div>
</div>
${mobileNav('settings')}${toastScript()}
</body></html>`
