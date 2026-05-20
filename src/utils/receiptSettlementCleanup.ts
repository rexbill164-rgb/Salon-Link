export function withReceiptSettlementCleanup(html: string): string {
  const script = `
<script id="receipt-settlement-cleanup">
(function(){
  function cleanNodeText(node){
    if(!node || !node.textContent) return;
    var text = node.textContent.toLowerCase();
    var blocked = [
      'send this money to my number',
      'send the money to my number',
      'provider will send',
      'provider would send',
      'provider should send',
      'send money to admin',
      'settle admin number',
      'transfer to my number'
    ];
    var hit = blocked.some(function(p){ return text.indexOf(p) !== -1; });
    if(hit){ node.textContent = 'Payment/settlement instructions are handled securely by SalonLink.'; }
  }
  function sweep(){
    try{
      var nodes = document.querySelectorAll('p,div,span,small,li,strong,em');
      Array.prototype.forEach.call(nodes, cleanNodeText);
    }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep); else sweep();
  setTimeout(sweep, 600);
  setTimeout(sweep, 1800);
})();
</script>`
  return html.replace('</body>', `${script}\n</body>`)
}
