export function withDiscoveryCardClickFix(html: string): string {
  const script = `
<script id="discovery-card-click-fix">
(function(){
  if (location.pathname !== '/discover') return;

  function providerIdFromCard(card){
    if (!card) return '';
    var direct = card.getAttribute('data-provider-id');
    if (direct) return direct;
    var onclick = card.getAttribute('onclick') || '';
    var match = onclick.match(/goToProvider\((\d+)\)/);
    return match ? match[1] : '';
  }

  function tagCards(){
    Array.prototype.slice.call(document.querySelectorAll('.provider-card')).forEach(function(card){
      if (card.getAttribute('data-provider-id')) return;
      var id = providerIdFromCard(card);
      if (id) card.setAttribute('data-provider-id', id);
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
    });
  }

  document.addEventListener('click', function(event){
    var card = event.target && event.target.closest ? event.target.closest('.provider-card') : null;
    if (!card) return;
    var id = providerIdFromCard(card);
    if (!id) return;
    event.preventDefault();
    event.stopPropagation();
    location.href = '/provider/' + encodeURIComponent(id);
  }, true);

  document.addEventListener('keydown', function(event){
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var card = event.target && event.target.closest ? event.target.closest('.provider-card') : null;
    if (!card) return;
    var id = providerIdFromCard(card);
    if (!id) return;
    event.preventDefault();
    location.href = '/provider/' + encodeURIComponent(id);
  }, true);

  document.addEventListener('DOMContentLoaded', function(){
    tagCards();
    setTimeout(tagCards, 500);
    setTimeout(tagCards, 1500);
  });

  if (window.MutationObserver) {
    new MutationObserver(tagCards).observe(document.documentElement, { childList:true, subtree:true });
  }
})();
</script>`
  if (html.includes('discovery-card-click-fix')) return html
  return html.replace('</body>', script + '</body>')
}
