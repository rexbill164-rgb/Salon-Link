export function withProviderRevenueFix(html: string): string {
  if (html.includes('provider-revenue-fix-script')) return html

  const patch = `
<script id="provider-revenue-fix-script">
(function(){
  if(location.pathname !== '/provider/dashboard') return;
  function token(){return localStorage.getItem('sl_token')||localStorage.getItem('token')||''}
  function headers(){return {Authorization:'Bearer '+token()}}
  function money(v){return 'GHS '+Math.round(Number(v||0)/100)}
  function parseDate(value){
    var date = new Date(String(value||'') + 'T00:00:00');
    return isNaN(date.getTime()) ? null : date;
  }
  function isWithinLast7Days(value){
    var date = parseDate(value);
    if(!date) return false;
    var today = new Date();
    today.setHours(0,0,0,0);
    var start = new Date(today);
    start.setDate(start.getDate() - 6);
    return date >= start && date <= today;
  }
  function calcCompletedWeekRevenue(rows){
    return (rows||[]).filter(function(b){
      return String(b.status||'').toLowerCase() === 'completed' && isWithinLast7Days(b.booking_date);
    }).reduce(function(sum,b){ return sum + Number(b.total_amount||0); }, 0);
  }
  function calcCompletedTodayRevenue(rows){
    var today = new Date().toISOString().split('T')[0];
    return (rows||[]).filter(function(b){
      return String(b.status||'').toLowerCase() === 'completed' && String(b.booking_date||'') === today;
    }).reduce(function(sum,b){ return sum + Number(b.total_amount||0); }, 0);
  }
  function updateRevenueKpi(){
    if(!token()) return;
    axios.get('/api/bookings/provider?ts=' + Date.now(), {headers:headers()}).then(function(res){
      var rows = (res.data && res.data.bookings) || [];
      var weekRevenue = calcCompletedWeekRevenue(rows);
      var todayRevenue = calcCompletedTodayRevenue(rows);
      var kpi = document.getElementById('kpi-revenue');
      if(kpi) kpi.textContent = money(weekRevenue);
      var label = kpi && kpi.parentNode ? kpi.parentNode.querySelector('.kpi-lbl') : null;
      if(label) label.textContent = 'Completed Sales - 7 Days';
      var existing = document.getElementById('completed-today-sales-note');
      if(!existing && kpi && kpi.parentNode){
        existing = document.createElement('div');
        existing.id = 'completed-today-sales-note';
        existing.style.cssText = 'font-size:10px;color:var(--t-muted);margin-top:4px;';
        kpi.parentNode.appendChild(existing);
      }
      if(existing) existing.textContent = 'Today completed: ' + money(todayRevenue);
    }).catch(function(error){ console.error('Completed week revenue load error', error); });
  }
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(updateRevenueKpi, 900); setTimeout(updateRevenueKpi, 2400); });
  document.addEventListener('click', function(){ setTimeout(updateRevenueKpi, 1000); }, true);
  setInterval(updateRevenueKpi, 15000);
})();
</script>`

  return html.replace('</body>', patch + '</body>')
}
