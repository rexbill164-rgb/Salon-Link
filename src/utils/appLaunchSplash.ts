export function withAppLaunchSplash(html: string): string {
  const head = `
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<meta name="theme-color" content="#40546c"/>
<link rel="apple-touch-startup-image" href="/splash.svg"/>
<style id="sl-launch-splash-style">
  html.sl-splash-lock,html.sl-splash-lock body{background:#40546c!important;}
  #sl-launch-splash{position:fixed;inset:0;z-index:2147483647;background:#40546c;display:flex;align-items:center;justify-content:center;transition:opacity .35s ease,visibility .35s ease;transform:translateZ(0)}
  #sl-launch-splash.hide{opacity:0;visibility:hidden;pointer-events:none}
  .sl-splash-logo{font-family:'Poppins',Arial,sans-serif;font-size:clamp(42px,12vw,76px);font-weight:900;letter-spacing:-.08em;color:#fff;text-shadow:0 5px 0 #000,0 10px 24px rgba(0,0,0,.35);line-height:1;white-space:nowrap}
  .sl-splash-logo em{font-style:italic;font-weight:700;letter-spacing:-.09em}
</style>
<script id="sl-launch-splash-head-script">document.documentElement.classList.add('sl-splash-lock');</script>`

  const bodySplash = `<div id="sl-launch-splash" aria-hidden="true"><div class="sl-splash-logo">Salon<em>Link</em></div></div>`
  const tailScript = `
<script id="sl-launch-splash-script">
(function(){
  function hide(){
    document.documentElement.classList.remove('sl-splash-lock');
    var s=document.getElementById('sl-launch-splash');
    if(s){s.classList.add('hide');setTimeout(function(){if(s&&s.parentNode)s.parentNode.removeChild(s);},500);}
  }
  if(document.readyState==='complete') setTimeout(hide,300);
  else window.addEventListener('load',function(){setTimeout(hide,300);});
  setTimeout(hide,900);
})();
</script>`

  if (html.includes('sl-launch-splash')) return html
  let next = html.replace('</head>', head + '</head>')
  next = next.replace(/<body([^>]*)>/i, '<body$1>' + bodySplash)
  next = next.replace('</body>', tailScript + '</body>')
  return next
}
