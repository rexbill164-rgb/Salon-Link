import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const hairstyleHistoryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Style History', `
<style>
  .history-card { background:var(--c-surface); border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; cursor:pointer; transition:all 0.45s var(--ease-luxury); }
  .history-card:hover { border-color:var(--g-border); transform:translateY(-6px); box-shadow:0 30px 60px rgba(0,0,0,0.4); }
  .history-card:hover .h-img { transform:scale(1.06); }
  .h-img { transition:transform 0.6s var(--ease-luxury); }
</style>
`)}</head>
<body class="bg-grain">
${navbar('history')}

<div style="padding:48px 0 120px;">
  <div class="container">

    <div style="margin-bottom:52px;" class="afu">
      <div class="eyebrow" style="margin-bottom:16px;">Your Journey</div>
      <h1 class="display-lg font-display">Style <em class="gold-gradient">History</em></h1>
      <p style="font-size:15px;color:var(--t-secondary);margin-top:16px;max-width:480px;line-height:1.8;font-weight:300;">
        Every appointment, every transformation — your complete beauty timeline, stored beautifully for you and your providers.
      </p>
    </div>

    <!-- Timeline stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:60px;" class="afu-1">
      ${[
        {val:'18',label:'Total Styles',icon:'✦'},
        {val:'6',  label:'Providers',  icon:'👤'},
        {val:'2y', label:'Journey',    icon:'🗓️'},
        {val:'4.9',label:'Avg Rating', icon:'⭐'},
      ].map(s=>`
        <div class="stat-card">
          <div style="font-size:24px;margin-bottom:10px;">${s.icon}</div>
          <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;">${s.val}</div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Filter row -->
    <div style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:40px;" class="afu-2">
      ${['All Styles','2026','2025','Hair','Nails','Makeup'].map((t,i)=>`
        <button onclick="filterHistory('${t}',this)" style="padding:9px 22px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.3s;background:${i===0?'var(--g-dim)':'transparent'};border:${i===0?'1px solid var(--g-border)':'1px solid var(--i-faint)'};color:${i===0?'var(--g-main)':'var(--t-secondary)'};">${t}</button>
      `).join('')}
    </div>

    <!-- History grid -->
    <div class="grid-3">
      ${[
        {emoji:'💇‍♀️',style:'Natural Twist',       provider:'Glam Studio GH',   date:'Apr 2, 2026',   rating:5,  tags:['Natural','Twist']},
        {emoji:'✂️',  style:'Taper Fade',           provider:'KutzByKofi',        date:'Mar 27, 2026',  rating:5,  tags:['Fade','Short']},
        {emoji:'💅',  style:'Gel Manicure',          provider:'Nails by Abena',    date:'Mar 22, 2026',  rating:5,  tags:['Gel','Pink']},
        {emoji:'💇‍♀️',style:'Box Braids',            provider:'Glam Studio GH',   date:'Feb 14, 2026',  rating:5,  tags:['Braids','Long']},
        {emoji:'💆',  style:'Swedish Massage',       provider:'Relax & Revive',    date:'Jan 30, 2026',  rating:4,  tags:['Massage','Relax']},
        {emoji:'💄',  style:'Evening Glam Makeup',   provider:'Faces by Ama',      date:'Dec 31, 2025',  rating:5,  tags:['Glam','Evening']},
        {emoji:'🌿',  style:'Loc Retwist',           provider:'Glam Studio GH',   date:'Nov 20, 2025',  rating:5,  tags:['Locs','Natural']},
        {emoji:'👁️', style:'Lash Extensions',        provider:'LashQueen Studio',  date:'Oct 15, 2025',  rating:5,  tags:['Lashes','Volume']},
        {emoji:'💇‍♀️',style:'Silk Press',            provider:'Glam Studio GH',   date:'Sep 8, 2025',   rating:4,  tags:['Silk Press','Straight']},
      ].map(h=>`
        <div class="history-card reveal" onclick="showToast('Opening full style details','info')">
          <div class="h-img" style="height:180px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));display:flex;align-items:center;justify-content:center;font-size:72px;border-bottom:1px solid var(--i-faint);position:relative;">
            ${h.emoji}
            <div style="position:absolute;bottom:12px;right:12px;"><span class="stars" style="font-size:13px;">${'★'.repeat(h.rating)}</span></div>
          </div>
          <div style="padding:22px;">
            <div class="font-display" style="font-size:18px;font-weight:500;margin-bottom:5px;">${h.style}</div>
            <div style="font-size:12px;color:var(--t-muted);margin-bottom:12px;">${h.provider}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
              ${h.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:11px;color:var(--t-faint);">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${h.date}
              </span>
              <button onclick="event.stopPropagation();showToast('Opening full gallery','info')" class="btn-ghost" style="font-size:10px;padding:6px 14px;">View</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

  </div>
</div>

${mobileNav('history')}
${globalScripts()}
<script>
function filterHistory(t, btn) {
  document.querySelectorAll('[onclick*="filterHistory"]').forEach(b => {
    b.style.background = 'transparent';
    b.style.borderColor = 'var(--i-faint)';
    b.style.color = 'var(--t-secondary)';
  });
  btn.style.background = 'var(--g-dim)';
  btn.style.borderColor = 'var(--g-border)';
  btn.style.color = 'var(--g-main)';
  showToast('Filtered: ' + t, 'info');
}
</script>
</body></html>`
