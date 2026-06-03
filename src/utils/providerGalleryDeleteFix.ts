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
      return '<div style="position:relative;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;background:#fff;aspect-ratio:1;">' +
        '<img src="' + p.image_url + '" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy"/>' +
        '<button type="button" class="sl-gallery-delete-btn" data-gallery-id="' + p.id + '" onclick="window.deleteGalleryImage&&window.deleteGalleryImage(' + p.id + ')" aria-label="Delete photo" style="position:absolute;top:8px;right:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;cursor:pointer;background:rgba(220,38,38,0.9);color:#fff;border:2px solid rgba(255,255,255,0.85);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);touch-action:manipulation;">\\u2715</button>' +
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
