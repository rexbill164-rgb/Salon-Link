import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const surpriseShopPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('SalonLink Surprise Shop', `
<style>
  body{background:#f7f7f7}.shop-hero{background:linear-gradient(135deg,#fff7ed,#fdf2f8 48%,#eef4ff);border-radius:28px;padding:34px;margin:22px 0;border:1px solid rgba(0,0,0,.06)}.gift-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.gift-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:22px;padding:22px;box-shadow:0 8px 28px rgba(0,0,0,.05)}.points-pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;background:#111;color:#fff;padding:10px 14px;font-size:12px;font-weight:800}.how-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:22px;padding:22px;margin-bottom:14px}@media(max-width:820px){.gift-grid{grid-template-columns:1fr}.shop-hero{margin:14px 0;padding:24px}}
</style>
`)}
</head>
<body>
${navbar('settings')}
<div class="container" style="padding-bottom:120px;">
  <section class="shop-hero">
    <div class="eyebrow" style="margin-bottom:10px;">Provider Rewards</div>
    <h1 style="font-size:clamp(28px,5vw,48px);font-weight:900;letter-spacing:-.04em;line-height:1.05;margin-bottom:14px;">SalonLink Surprise Shop</h1>
    <p style="max-width:720px;color:#555;line-height:1.7;font-size:15px;margin-bottom:18px;">Earn points when customers complete appointments and leave genuine ratings and comments. Use your points later to redeem salon gadgets, tools and business support items.</p>
    <span class="points-pill">3 points per completed review</span>
  </section>

  <section style="margin-bottom:24px;">
    <div class="eyebrow" style="margin-bottom:14px;">How points work</div>
    <div class="how-card"><strong>1. Serve customers through SalonLink</strong><br/><span style="color:#666;font-size:13px;">Encourage customers to book and complete their appointments through the platform.</span></div>
    <div class="how-card"><strong>2. Customer confirms completion and reviews</strong><br/><span style="color:#666;font-size:13px;">A completed booking with a rating and comment earns points for the provider.</span></div>
    <div class="how-card"><strong>3. Redeem points later</strong><br/><span style="color:#666;font-size:13px;">The Surprise Shop will open soon with salon gadgets and reward items.</span></div>
  </section>

  <section>
    <div class="eyebrow" style="margin-bottom:14px;">Coming soon rewards</div>
    <div class="gift-grid">
      <div class="gift-card"><div style="font-size:34px;margin-bottom:12px;">💈</div><h3 style="margin-bottom:8px;">Salon Tools</h3><p style="font-size:13px;color:#666;line-height:1.6;">Redeem points for basic tools and accessories.</p></div>
      <div class="gift-card"><div style="font-size:34px;margin-bottom:12px;">📱</div><h3 style="margin-bottom:8px;">Business Gadgets</h3><p style="font-size:13px;color:#666;line-height:1.6;">Use points toward devices that support your salon operations.</p></div>
      <div class="gift-card"><div style="font-size:34px;margin-bottom:12px;">🎁</div><h3 style="margin-bottom:8px;">Special Gifts</h3><p style="font-size:13px;color:#666;line-height:1.6;">More reward categories will be added as the platform grows.</p></div>
    </div>
  </section>
</div>
${mobileNav('settings')}
${globalScripts()}
</body></html>`
