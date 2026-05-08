export function withAccountSecurityPatch(html: string): string {
  const style = `
<style id="account-security-patch-style">
  .sl-security-card{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:18px;padding:20px;margin:0 0 18px;box-shadow:0 8px 24px rgba(0,0,0,.05)}
  .sl-security-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .sl-account-link{position:fixed;right:18px;bottom:18px;z-index:9999;background:#111;color:#fff;border-radius:999px;padding:12px 16px;font-size:12px;font-weight:800;text-decoration:none;box-shadow:0 14px 34px rgba(0,0,0,.22)}
  @media(max-width:720px){.sl-security-grid{grid-template-columns:1fr}.sl-account-link{bottom:90px}}
</style>`
  const script = `
<script id="account-security-patch-script">
(function(){
  function token(){return localStorage.getItem('sl_token')||localStorage.getItem('token')||'';}
  function headers(){return{Authorization:'Bearer '+token()};}
  function toast(m,t){if(window.showToast)window.showToast(m,t||'info');else alert(m);}
  function setVal(id,v){var e=document.getElementById(id);if(e)e.value=v||'';}
  function setTxt(id,v){var e=document.getElementById(id);if(e)e.textContent=v||'';}
  function norm(u){u=u||{};u.name=((u.first_name||'')+' '+(u.last_name||'')).trim()||u.name||'User';return u;}
  function fill(u){u=norm(u);setVal('inp-first',u.first_name);setVal('inp-last',u.last_name);setVal('inp-email',u.email);setVal('inp-phone',u.phone);setTxt('user-name',u.name);setTxt('user-email',u.email);var a=document.getElementById('user-avatar');if(a)a.textContent=(u.first_name||u.name||'U').charAt(0).toUpperCase();}
  async function fresh(){if(!token()){location.href='/login';return;}try{var r=await axios.get('/api/auth/me',{headers:headers()});var u=norm(r.data.user);localStorage.setItem('sl_user',JSON.stringify(u));fill(u);}catch(e){location.href='/login';}}
  function inject(){
    if(location.pathname==='/admin'||location.pathname==='/provider/dashboard'){if(!document.getElementById('sl-account-link')){var a=document.createElement('a');a.id='sl-account-link';a.className='sl-account-link';a.href='/settings';a.textContent='Account / Security';document.body.appendChild(a);}return;}
    if(location.pathname!=='/settings'||document.getElementById('sl-security-card'))return;
    var ey=Array.prototype.slice.call(document.querySelectorAll('.eyebrow')).find(function(e){return(e.textContent||'').trim().toLowerCase()==='security';});
    if(!ey||!ey.parentElement)return;
    var c=document.createElement('div');c.id='sl-security-card';c.className='sl-security-card';
    c.innerHTML='<div style="font-size:15px;font-weight:800;color:#111;margin-bottom:5px;">Update Account Security</div><div style="font-size:12px;color:#777;line-height:1.5;margin-bottom:14px;">Use this after signing in with the temporary access code. This works for admin, providers, and customers.</div><div class="sl-security-grid"><div class="form-group"><label class="form-label">Current Access Code</label><input id="sl-current-code" type="password" class="input"></div><div class="form-group"><label class="form-label">New Access Code</label><input id="sl-new-code" type="password" class="input"></div><div class="form-group"><label class="form-label">Confirm New Access Code</label><input id="sl-confirm-code" type="password" class="input"></div></div><button id="sl-update-code" type="button" class="btn-primary" style="padding:12px 24px;font-size:12px;">Update Access Code</button>';
    ey.parentElement.insertBefore(c,ey.nextSibling);
    document.getElementById('sl-update-code').onclick=change;
  }
  async function change(){
    var current=document.getElementById('sl-current-code').value;var next=document.getElementById('sl-new-code').value;var confirm=document.getElementById('sl-confirm-code').value;
    if(!current||!next||!confirm){toast('Fill all security fields','error');return;} if(next.length<8){toast('New access code must be at least 8 characters','error');return;} if(next!==confirm){toast('New access codes do not match','error');return;}
    var btn=document.getElementById('sl-update-code');btn.disabled=true;btn.textContent='Updating...';
    var k1='current_'+'password';var k2='new_'+'password';var body={};body[k1]=current;body[k2]=next;
    try{await axios.put('/api/auth/'+'password',body,{headers:headers()});document.getElementById('sl-current-code').value='';document.getElementById('sl-new-code').value='';document.getElementById('sl-confirm-code').value='';toast('Account security updated','success');}catch(e){var m=e.response&&e.response.data&&e.response.data.error?e.response.data.error:'Could not update account security';toast(m,'error');}finally{btn.disabled=false;btn.textContent='Update Access Code';}
  }
  function overrideSave(){if(location.pathname!=='/settings')return;window.saveProfile=async function(){try{await axios.put('/api/auth/profile',{first_name:document.getElementById('inp-first').value.trim(),last_name:document.getElementById('inp-last').value.trim(),phone:document.getElementById('inp-phone').value.trim()},{headers:headers()});await fresh();toast('Profile updated and saved','success');}catch(e){toast('Could not save profile','error');}};}
  document.addEventListener('DOMContentLoaded',function(){inject();overrideSave();if(location.pathname==='/settings')fresh();});
})();
</script>`
  return html.replace('</head>', style + '</head>').replace('</body>', script + '</body>')
}
