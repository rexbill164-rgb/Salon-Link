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
      return '<div style="border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;background:#fff;">' +
        '<div style="aspect-ratio:1;overflow:hidden;">' +
          '<img src="' + p.image_url + '" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy"/>' +
        '</div>' +
        '<div style="display:flex;justify-content:center;padding:6px;background:#f9fafb;border-top:1px solid #e5e7eb;">' +
          '<button type="button" data-gallery-id="' + p.id + '" onclick="window.deleteGalleryImage&&window.deleteGalleryImage(' + p.id + ')" style="display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:7px;border:none;background:#dc2626;color:#fff;font-size:11px;font-weight:600;cursor:pointer;touch-action:manipulation;">Delete</button>' +
        '</div>' +
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
