export function withZoomLock(html: string): string {
  const script = `
<style id="sl-zoom-lock-style">
html,body{max-width:100%!important;overflow-x:hidden!important;-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important;touch-action:pan-x pan-y!important}input,textarea,select{font-size:16px!important}img,video,canvas,svg{max-width:100%}
</style>
<script id="sl-zoom-lock-script">
(function(){
  function lock(){
    var content='width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover';
    var metas=[].slice.call(document.querySelectorAll('meta[name="viewport"]'));
    if(metas[0]) metas[0].setAttribute('content',content);
    else { var m=document.createElement('meta'); m.name='viewport'; m.content=content; document.head.appendChild(m); }
    metas.slice(1).forEach(function(m){m.remove();});
    document.documentElement.style.overflowX='hidden';
    document.documentElement.style.maxWidth='100%';
    if(document.body){document.body.style.overflowX='hidden';document.body.style.maxWidth='100%';}
  }
  function block(e){ if(e.touches&&e.touches.length>1)e.preventDefault(); }
  document.addEventListener('gesturestart',function(e){e.preventDefault();},{passive:false,capture:true});
  document.addEventListener('gesturechange',function(e){e.preventDefault();},{passive:false,capture:true});
  document.addEventListener('gestureend',function(e){e.preventDefault();},{passive:false,capture:true});
  document.addEventListener('touchstart',block,{passive:false,capture:true});
  document.addEventListener('touchmove',block,{passive:false,capture:true});
  var last=0; document.addEventListener('touchend',function(e){var now=Date.now(); if(now-last<300)e.preventDefault(); last=now;},{passive:false,capture:true});
  lock(); document.addEventListener('DOMContentLoaded',lock); window.addEventListener('pageshow',lock); window.addEventListener('resize',function(){setTimeout(lock,50);});
})();
</script>`
  let next = html.replace(/<meta name="viewport"[^>]*\/?>/i, '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"/>')
  if (!next.includes('sl-zoom-lock-script')) next = next.replace('</body>', script + '</body>')
  return next
}
