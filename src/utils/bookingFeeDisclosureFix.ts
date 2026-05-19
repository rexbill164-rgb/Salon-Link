export function withBookingFeeDisclosureFix(html: string): string {
  if (html.includes('booking-fee-disclosure-fix-script')) return html

  const patch = `
<script id="booking-fee-disclosure-fix-script">
(function(){
  function cleanText(){
    var replacements = [
      ['Your provider will send a GHS 3 platform fee to SalonLink after your appointment.', 'Your booking will be confirmed immediately. Pay the service amount directly to the provider when you arrive.'],
      ['Your provider will send a GHS 2 platform fee to SalonLink after your appointment.', 'Your booking will be confirmed immediately. Pay the service amount directly to the provider when you arrive.'],
      ['Platform Fee Reminder', 'Booking Reminder'],
      ['GHS 3.00', ''],
      ['GHS 2.00', ''],
      ['platform fee', ''],
      ['Platform Fee', '']
    ];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var text = node.nodeValue || '';
      replacements.forEach(function(pair){ text = text.split(pair[0]).join(pair[1]); });
      node.nodeValue = text;
    });
  }
  cleanText();
  document.addEventListener('DOMContentLoaded', cleanText);
  setTimeout(cleanText, 300);
  setTimeout(cleanText, 1200);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
