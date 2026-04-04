import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const hairstyleHistoryPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Style History', `
<style>
  .history-card { background:#FFFFFF; border:1px solid var(--i-faint); border-radius:var(--r-xl); overflow:hidden; cursor:pointer; transition:all 0.45s var(--ease-luxury); box-shadow:0 2px 12px rgba(58,47,30,0.06); }
  .history-card:hover { border-color:var(--g-border); transform:translateY(-6px); box-shadow:0 24px 48px rgba(160,120,48,0.16); }
  .history-card:hover .h-img { transform:scale(1.06); }
  .h-img { transition:transform 0.6s var(--ease-luxury); }
</style>
`)}</head>
<body style="background:var(--c-deep);">
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
        {val:'18',label:'Total Styles',  icon:'fas fa-images',    color:'var(--g-deep)'},
        {val:'6',  label:'Providers',    icon:'fas fa-store',     color:'#3A72C0'},
        {val:'2y', label:'Journey',      icon:'fas fa-road',      color:'#1E8050'},
        {val:'4.9',label:'Avg Rating',   icon:'fas fa-star',      color:'var(--g-deep)'},
      ].map(s=>`
        <div class="stat-card">
          <div style="width:40px;height:40px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <i class="${s.icon}" style="color:${s.color};font-size:16px;"></i>
          </div>
          <div class="font-display gold-gradient" style="font-size:28px;margin-bottom:4px;">${s.val}</div>
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);">${s.label}</div>
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
    <div class="grid-3" id="history-grid">
      ${[
        {img:'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=480&q=75', style:'Natural Twist',       provider:'Glam Studio GH',  date:'Apr 2, 2026',  rating:5, tags:['Natural','Twist']},
        {img:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=480&q=75', style:'Taper Fade',          provider:'KutzByKofi',       date:'Mar 27, 2026', rating:5, tags:['Fade','Short']},
        {img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=480&q=75', style:'Gel Manicure',         provider:'Nails by Abena',   date:'Mar 22, 2026', rating:5, tags:['Gel','Pink']},
        {img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&q=75', style:'Box Braids',           provider:'Glam Studio GH',  date:'Feb 14, 2026', rating:5, tags:['Braids','Long']},
        {img:'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=480&q=75',    style:'Swedish Massage',      provider:'Relax & Revive',   date:'Jan 30, 2026', rating:4, tags:['Massage','Relax']},
        {img:'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=480&q=75', style:'Evening Glam Makeup',  provider:'Faces by Ama',     date:'Dec 31, 2025', rating:5, tags:['Glam','Evening']},
        {img:'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=480&q=75',    style:'Loc Retwist',          provider:'Glam Studio GH',  date:'Nov 20, 2025', rating:5, tags:['Locs','Natural']},
        {img:'https://images.unsplash.com/photo-1583241475880-083f84372725?w=480&q=75', style:'Lash Extensions',      provider:'LashQueen Studio', date:'Oct 15, 2025', rating:5, tags:['Lashes','Volume']},
        {img:'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=480&q=75', style:'Silk Press',           provider:'Glam Studio GH',  date:'Sep 8, 2025',  rating:4, tags:['Silk Press','Straight']},
      ].map(h=>`
        <div class="history-card reveal" onclick="showToast('Opening full style details','info')">
          <div class="h-img" style="height:200px;overflow:hidden;position:relative;">
            <img src="${h.img}" alt="${h.style}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(26,18,9,0.2),transparent);"></div>
            <div style="position:absolute;bottom:12px;right:12px;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border-radius:100px;padding:4px 10px;">
              <span class="stars" style="font-size:11px;">${'★'.repeat(h.rating)}</span>
            </div>
          </div>
          <div style="padding:20px;">
            <div class="font-display" style="font-size:17px;font-weight:600;margin-bottom:4px;color:var(--t-primary);">${h.style}</div>
            <div style="font-size:12px;color:var(--t-muted);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
              <i class="fas fa-store" style="font-size:10px;color:var(--g-main);"></i>${h.provider}
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px;">
              ${h.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:11px;color:var(--t-faint);display:flex;align-items:center;gap:5px;">
                <i class="far fa-calendar" style="font-size:10px;"></i>${h.date}
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

document.addEventListener('DOMContentLoaded', function() {
  var token = localStorage.getItem('sl_token');
  if (!token) { window.location.href = '/login'; return; }
  axios.get('/api/uploads/hairstyle', { headers: { Authorization: 'Bearer ' + token } }).then(function(res) {
    var hist = res.data.history || [];
    var grid = document.getElementById('history-grid');
    if (!grid) return;
    if (!hist.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--t-muted);">No hairstyle history yet. <a href="/discover" style="color:var(--g-main);">Book your first appointment →</a></div>';
      return;
    }
    grid.innerHTML = hist.map(function(h) {
      return '<div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);overflow:hidden;transition:all 0.3s;" onmouseover="this.style.borderColor=\'var(--g-border)\'" onmouseout="this.style.borderColor=\'var(--i-faint)\'">' +
        '<div style="height:200px;background:linear-gradient(135deg,var(--c-dark),var(--c-mist));display:flex;align-items:center;justify-content:center;font-size:60px;">💇‍♀️</div>' +
        '<div style="padding:18px;">' +
          '<div style="font-size:14px;font-weight:700;margin-bottom:4px;">' + (h.style_name || 'Hairstyle') + '</div>' +
          '<div style="font-size:12px;color:var(--t-muted);margin-bottom:8px;">' + (h.business_name || '') + '</div>' +
          '<div style="font-size:11px;color:var(--t-faint);">' + new Date(h.created_at).toLocaleDateString() + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }).catch(function(){});
});
</script>
</body></html>`
