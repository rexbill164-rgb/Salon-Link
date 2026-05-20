export function withSettingsPointsGatheredUi(html: string): string {
  const style = `
<style id="points-gathered-ui-style">
.points-trigger-card{display:none;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:20px;padding:18px;margin-bottom:16px;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 10px 28px rgba(0,0,0,.04)}
.points-trigger-card .pt-icon{width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#fff7ed,#fdf2f8);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.points-trigger-card h3{font-size:16px;font-weight:900;margin:0 0 3px}.points-trigger-card p{font-size:12px;color:#666;margin:0;line-height:1.5}.points-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;padding:16px;align-items:flex-end;justify-content:center}.points-modal.open{display:flex}.points-modal-panel{background:#fff;border-radius:28px 28px 18px 18px;width:100%;max-width:560px;max-height:90vh;overflow:auto;padding:22px;box-shadow:0 30px 90px rgba(0,0,0,.25)}.points-rule{display:flex;gap:10px;padding:12px;border-radius:16px;background:#fafafa;border:1px solid rgba(0,0,0,.06);margin-bottom:8px}.points-rule b{width:26px;height:26px;border-radius:50%;background:#111;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.points-rule span{font-size:13px;line-height:1.55;color:#444}@media(min-width:700px){.points-modal{align-items:center}.points-modal-panel{border-radius:28px}}@media(max-width:640px){.points-trigger-card{padding:14px}.points-modal-panel{padding:18px}.points-rule span{font-size:12px}}
</style>`

  const trigger = `
<section id="points-gathered-trigger" class="points-trigger-card">
  <div style="display:flex;align-items:center;gap:12px;min-width:0;">
    <div class="pt-icon">🏆</div>
    <div style="min-width:0;">
      <h3>Points Gathered</h3>
      <p>View accumulated points, rules, and claimable reward items.</p>
    </div>
  </div>
  <button type="button" onclick="openPointsGatheredModal()" class="btn-primary" style="font-size:12px;padding:10px 16px;white-space:nowrap;">Open</button>
</section>`

  const modal = `
<div id="points-gathered-modal" class="points-modal" onclick="if(event.target===this)closePointsGatheredModal()">
  <div class="points-modal-panel">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">
      <div>
        <div class="eyebrow" style="margin-bottom:6px;">Provider Rewards</div>
        <h2 style="font-size:24px;font-weight:900;letter-spacing:-.03em;margin:0;">Points Gathered</h2>
      </div>
      <button type="button" onclick="closePointsGatheredModal()" style="width:38px;height:38px;border-radius:50%;border:1px solid rgba(0,0,0,.08);background:#fafafa;font-size:18px;">×</button>
    </div>
    <div style="background:linear-gradient(135deg,#fff7ed,#fdf2f8 52%,#eef4ff);border:1px solid rgba(0,0,0,.06);border-radius:22px;padding:18px;margin-bottom:16px;">
      <div style="font-size:12px;color:#555;margin-bottom:8px;">Admin will review your page performance and award points.</div>
      <div style="display:flex;align-items:baseline;gap:8px;"><span id="points-modal-balance" style="font-size:42px;font-weight:900;line-height:1;">0</span><span style="font-size:13px;color:#666;">points accumulated</span></div>
    </div>
    <div style="font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:10px;">Rules for earning points</div>
    <div class="points-rule"><b>1</b><span>You confirm a client’s booking.</span></div>
    <div class="points-rule"><b>2</b><span>You complete the job, confirm completion on the page, and upload client pictures to your profile. Minimum 1 picture, maximum 2 pictures.</span></div>
    <div class="points-rule"><b>3</b><span>You pay your weekly or monthly service charge.</span></div>
    <div class="points-rule"><b>4</b><span>At the end of the month, you can use your points to claim any listed reward item.</span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;">
      <a href="/surprise-shop" class="btn-primary" style="font-size:12px;padding:12px 18px;text-decoration:none;">View items to claim</a>
      <button type="button" onclick="document.getElementById('points-section')?.scrollIntoView({behavior:'smooth'});closePointsGatheredModal();" class="btn-ghost" style="font-size:12px;padding:12px 18px;">View points history</button>
    </div>
  </div>
</div>`

  const script = `
<script id="points-gathered-ui-script">
function openPointsGatheredModal(){var m=document.getElementById('points-gathered-modal'); if(m)m.classList.add('open'); var b=document.getElementById('points-balance'); var mb=document.getElementById('points-modal-balance'); if(b&&mb)mb.textContent=b.textContent||'0';}
function closePointsGatheredModal(){var m=document.getElementById('points-gathered-modal'); if(m)m.classList.remove('open');}
(function(){
  try{
    var user=JSON.parse(localStorage.getItem('sl_user')||'{}');
    if(user.role==='provider'){
      var t=document.getElementById('points-gathered-trigger'); if(t)t.style.display='flex';
      var old=document.querySelector('section.reward-card'); if(old)old.style.display='none';
    }
  }catch(e){}
})();
</script>`

  return html
    .replace('</head>', `${style}\n</head>`)
    .replace('<!-- Points Gathered — providers only -->', `${trigger}\n<!-- Points Gathered — providers only -->`)
    .replace('</body>', `${modal}\n${script}\n</body>`)
}
