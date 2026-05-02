(function () {
  function $(id) { return document.getElementById(id); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function safeToast(message, type) {
    if (typeof window.showToast === 'function') return window.showToast(message, type || 'info');
    console.log('[SalonLink]', message);
  }

  window.openAdminSidebar = window.openAdminSidebar || function () {
    var sidebar = $('admin-sidebar');
    var overlay = $('admin-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
  };

  window.closeAdminSidebar = window.closeAdminSidebar || function () {
    var sidebar = $('admin-sidebar');
    var overlay = $('admin-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  window.adminSection = window.adminSection || function (id, btn) {
    all('.admin-section').forEach(function (section) { section.classList.remove('active'); });
    var target = $('admin-' + id);
    if (target) target.classList.add('active');

    all('.sidebar-item, .amob-btn').forEach(function (item) { item.classList.remove('active'); });
    if (btn && btn.classList) btn.classList.add('active');
    var nav = $('admin-nav-' + id);
    if (nav) nav.classList.add('active');

    var title = $('admin-title');
    if (title) title.textContent = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');

    window.closeAdminSidebar();

    try {
      if (id === 'users' && typeof window.loadUsers === 'function') window.loadUsers();
      if (id === 'providers' && typeof window.loadProviders === 'function') window.loadProviders();
      if (id === 'bookings' && typeof window.loadBookings === 'function') window.loadBookings();
      if (id === 'kyc' && typeof window.loadKycQueue === 'function') window.loadKycQueue();
      if (id === 'payments' && typeof window.loadPaymentSummary === 'function') window.loadPaymentSummary();
      if (id === 'fees' && typeof window.loadFees === 'function') window.loadFees('pending');
      if (id === 'reconcile' && typeof window.loadReconcile === 'function') window.loadReconcile();
    } catch (err) {
      console.error('Admin section load error:', err);
      safeToast('Could not load this section. Check console for details.', 'error');
    }
  };

  window.selectProviderTab = window.selectProviderTab || function (id, btn) {
    all('.provider-section, .provider-tab-section, .dashboard-section').forEach(function (section) {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    var ids = [id, 'provider-' + id, 'dashboard-' + id, id + '-section'];
    ids.forEach(function (targetId) {
      var el = $(targetId);
      if (el) { el.classList.add('active'); el.style.display = 'block'; }
    });

    all('.provider-tab, .dashboard-tab, .sidebar-item').forEach(function (item) { item.classList.remove('active'); });
    if (btn && btn.classList) btn.classList.add('active');
  };

  window.providerSection = window.providerSection || window.selectProviderTab;
  window.showProviderSection = window.showProviderSection || window.selectProviderTab;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    if (href.charAt(0) === '/' && !link.target) {
      e.preventDefault();
      window.location.href = href;
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function () {
    if (location.pathname === '/admin' && !$('admin-overview')?.classList.contains('active')) {
      window.adminSection('overview', $('admin-nav-overview'));
    }
  });
})();
