export function withAppLaunchSplash(html: string): string {
  const splash = `
<style id="sl-launch-splash-style">
  #sl-launch-splash{position:fixed;inset:0;z-index:999999;background:#40546c;display:flex;align-items:center;justify-content:center;transition:opacity .35s ease,visibility .35s ease}
  #sl-launch-splash.hide{opacity:0;visibility:hidden;pointer-events:none}
  .sl-splash-logo{font-family:'Poppins',Arial,sans-serif;font-size:clamp(40px,12vw,74px);font-weight:900;letter-spacing:-.08em;color:#fff;text-shadow:0 5px 0 #000,0 10px 24px rgba(0,0,0,.35);line-height:1}
  .sl-splash-logo em{font-style:italic;font-weight:700;letter-spacing:-.09em}
  @media(prefers-reduced-motion:reduce){#sl-launch-splash{transition:none}}
</style>
<div id="sl-launch-splash" aria-hidden="true"><div class="sl-splash-logo">Salon<em>Link</em></div></div>
<script id="sl-launch-splash-script">
(function(){
  function hide(){var s=document.getElementById('sl-launch-splash'); if(s)s.classList.add('hide');}
  window.addEventListener('load',function(){setTimeout(hide,650);});
  setTimeout(hide,1800);
})();
</script>`
  if (html.includes('sl-launch-splash')) return html
  return html.replace('<body', '<body').replace('</body>', splash + '</body>')
}
