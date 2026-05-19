export function withSettingsRewardsLink(html: string): string {
  if (html.includes('settings-rewards-link-script')) return html

  const patch = `
<style id="settings-rewards-link-style">
  .sl-reward-card{background:linear-gradient(135deg,#fff7ed,#fdf2f8 52%,#eef4ff);border:1px solid rgba(0,0,0,.06);border-radius:24px;padding:28px;margin:0 0 24px;box-shadow:0 8px 24px rgba(0,0,0,.04)}
  .sl-reward-card h2{font-size:24px;font-weight:900;letter-spacing:-.03em;margin:6px 0 8px;color:#111}.sl-reward-card p{font-size:13px;color:#555;line-height:1.7;margin:0 0 16px}.sl-reward-pill{display:inline-flex;align-items:center;gap:8px;background:#111;color:#fff;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:800}.sl-reward-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}@media(max-width:640px){.sl-reward-card{padding:22px}}
</style>
<script id="settings-rewards-link-script">
(function(){
  function insertRewards(){
    if(location.pathname !== '/settings') return;
    if(document.getElementById('sl-reward-card')) return;
    var host = document.querySelector('.container-sm') || document.querySelector('.container') || document.body;
    if(!host) return;
    var card = document.createElement('section');
    card.id = 'sl-reward-card';
    card.className = 'sl-reward-card';
    card.innerHTML = '<div class="eyebrow">Provider Rewards</div><h2>SalonLink Surprise Shop</h2><p>Providers earn points when customers complete appointments and leave genuine ratings and comments. Points can later be used to claim salon gadgets and reward items.</p><div class="sl-reward-actions"><span class="sl-reward-pill">3 points per completed review</span><a href="/surprise-shop" class="btn-primary" style="font-size:12px;padding:11px 20px;text-decoration:none;">Claim Gift</a></div>';
    var firstCard = host.querySelector('div[style*="background:var(--c-surface)"]');
    if(firstCard && firstCard.parentNode) firstCard.parentNode.insertBefore(card, firstCard);
    else host.insertBefore(card, host.firstChild);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insertRewards); else insertRewards();
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
