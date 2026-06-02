// Global, app-wide icon styling: any filled, square icon "badge" (a rounded
// square whose only content is a Font Awesome glyph) is repainted to a soft
// blue tile (#eef4ff) with a blue (#2563eb) icon — matching the dashboard.
// Circles (FABs, avatars, icon buttons), badges with text, and bare inline
// icons are deliberately left untouched.
export const cleanIconTilesScript = `
<script id="sl-clean-icon-tiles">
(function(){
  var TILE_BG = '#eef4ff', ICON = '#2563eb';

  function radiusPx(cs, size){
    var r = parseFloat((cs.borderTopLeftRadius || '0').toString());
    if (isNaN(r)) return 0;
    return r;
  }
  function hasFill(cs){
    var bg = cs.backgroundColor || '';
    var img = cs.backgroundImage || 'none';
    if (img && img !== 'none') return true;            // gradient/image fill
    var m = bg.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return false;
    var parts = m[1].split(',').map(function(x){return parseFloat(x);});
    var a = parts.length > 3 ? parts[3] : 1;
    return a > 0.04;                                    // not transparent
  }
  function isTile(el){
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (tag !== 'DIV' && tag !== 'SPAN') return false;
    if ((el.textContent || '').trim() !== '') return false;        // icon only
    if (el.querySelectorAll('i').length !== 1) return false;       // one icon
    var cs = getComputedStyle(el);
    var w = parseFloat(cs.width), h = parseFloat(cs.height);
    if (!w || !h) return false;
    if (Math.abs(w - h) > 8) return false;                         // square-ish
    if (w < 26 || w > 66) return false;                            // badge size
    var r = radiusPx(cs, w);
    if (r < 6) return false;                                       // rounded
    if (r >= (Math.min(w, h) / 2) - 1) return false;               // not a circle
    return hasFill(cs);
  }
  function paint(el){
    var icon = el.querySelector('i');
    el.style.setProperty('background', TILE_BG, 'important');
    el.style.setProperty('background-image', 'none', 'important');
    el.style.setProperty('color', ICON, 'important');
    el.style.setProperty('border', 'none', 'important');
    el.style.setProperty('box-shadow', 'none', 'important');
    if (icon) icon.style.setProperty('color', ICON, 'important');
    el.setAttribute('data-sl-tiled', '1');
  }
  function scan(root){
    try {
      var icons = (root || document).querySelectorAll('i[class*="fa-"]');
      for (var i = 0; i < icons.length; i++){
        var el = icons[i].parentElement, depth = 0;
        while (el && depth < 2){
          if (el.getAttribute && el.getAttribute('data-sl-tiled')) break;
          if (isTile(el)){ paint(el); break; }
          el = el.parentElement; depth++;
        }
      }
    } catch(e){}
  }

  var pending = false;
  function schedule(){
    if (pending) return; pending = true;
    setTimeout(function(){ pending = false; scan(document); }, 120);
  }

  function start(){
    scan(document);
    setTimeout(function(){ scan(document); }, 500);
    setTimeout(function(){ scan(document); }, 1500);
    try {
      var mo = new MutationObserver(function(muts){
        for (var i = 0; i < muts.length; i++){ if (muts[i].addedNodes && muts[i].addedNodes.length){ schedule(); break; } }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch(e){}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
</script>`
