export function withProviderGalleryDeleteFix(html: string): string {
  const script = `
<script id="provider-gallery-delete-fix">
(function(){
  if (location.pathname !== '/provider/dashboard') return;
  function token(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function headers(){ return { Authorization: 'Bearer ' + token() }; }
  function toast(message, type){ if (window.showToast) window.showToast(message, type || 'info'); else console.log(message); }
  function galleryGrid(){ return document.getElementById('gallery-grid'); }
  function providerId(){ return window.providerIdGlobal; }
  function ax(){ return window.axios; }

  function renderGallery(photos, isPro){
    var grid = galleryGrid();
    if (!grid) return;
    var visible = (photos || []).filter(function(p){ return !p.is_logo; });
    var label = document.getElementById('gallery-count-label');
    if (label) label.textContent = (isPro ? 'Pro' : 'Free') + ' plan: ' + visible.length + '/' + (isPro ? 10 : 5) + ' images';
    var html = visible.map(function(p){
      return '<div style="position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--c-surface);">' +
        '<img src="' + p.image_url + '" style="width:100%;height:100%;object-fit:cover;"/>' +
        '<button type="button" class="provider-gallery-delete-btn" data-gallery-id="' + p.id + '" style="position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.65);border:none;color:white;cursor:pointer;font-size:14px;line-height:1;">×</button>' +
      '</div>';
    }).join('');
    html += '<div onclick="triggerGalleryUpload()" class="gallery-add-btn"><div style="font-size:24px;">➕</div><div style="font-size:10px;color:var(--t-muted);margin-top:4px;">Add Photo</div></div>';
    grid.innerHTML = html;
  }

  window.loadGallery = function(){
    if (!ax() || !providerId()) return;
    var grid = galleryGrid();
    if (grid) grid.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;font-size:12px;">Loading gallery...</div>';
    ax().get('/api/uploads/provider-gallery/' + encodeURIComponent(providerId()), { headers: headers() })
      .then(function(res){ var data = res.data || {}; renderGallery(data.photos || data.gallery || [], !!data.is_pro); })
      .catch(function(){ if (grid) grid.innerHTML = '<div style="text-align:center;color:var(--t-muted);padding:20px;grid-column:1/-1;">Could not load gallery.</div>'; });
  };

  window.deleteGalleryImage = function(id){
    if (!id) return;
    if (!confirm('Delete this photo?')) return;
    ax().delete('/api/uploads/provider-gallery/' + encodeURIComponent(id), { headers: headers() })
      .then(function(){ toast('Photo deleted', 'success'); window.loadGallery(); })
      .catch(function(error){
        var data = error && error.response && error.response.data ? error.response.data : {};
        toast(data.error || 'Delete failed', 'error');
      });
  };

  document.addEventListener('click', function(event){
    var btn = event.target.closest && event.target.closest('.provider-gallery-delete-btn');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    window.deleteGalleryImage(btn.getAttribute('data-gallery-id'));
  }, true);
})();
</script>`
  if (html.includes('provider-gallery-delete-fix')) return html
  return html.replace('</body>', script + '</body>')
}
