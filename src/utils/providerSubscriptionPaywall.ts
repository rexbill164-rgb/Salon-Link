export function withProviderSubscriptionPaywall(html: string): string {
  const script = `
<script id="provider-subscription-paywall">
(function(){
  var path = location.pathname;
  var onOnboarding = (path === '/provider/onboarding');
  var onDashboard = (path === '/provider/dashboard');
  if (!onOnboarding && !onDashboard) return;

  function t(){ return localStorage.getItem('sl_token') || localStorage.getItem('token') || ''; }
  function h(){ return { Authorization: 'Bearer ' + t() }; }
  function toast(m,k){ if (window.showToast) window.showToast(m, k||'info'); else console.log(m); }

  // Hide the old standalone "Upgrade to Gallery Pro" banner everywhere —
  // pro gallery is now included with the GHS 10 activation paid at signup.
  function hideOldUpgrade(){
    var b = document.getElementById('pro-banner');
    if (b) b.style.display = 'none';
  }

  function loadPaystack(cb){
    if (window.PaystackPop) { cb(); return; }
    var s = document.getElementById('paystack-inline-js');
    if (s) { s.addEventListener('load', cb); return; }
    s = document.createElement('script');
    s.id = 'paystack-inline-js';
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = cb;
    s.onerror = function(){ toast('Could not load secure checkout. Check your connection.', 'error'); };
    document.head.appendChild(s);
  }

  function showPaywall(cfg){
    if (document.getElementById('sl-paywall-overlay')) return;
    var ov = document.createElement('div');
    ov.id = 'sl-paywall-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(10,10,15,0.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;';
    ov.innerHTML =
      '<div style="background:#fff;max-width:380px;width:100%;border-radius:20px;padding:28px 24px;box-shadow:0 24px 60px rgba(0,0,0,0.35);text-align:center;font-family:inherit;">' +
        '<div style="font-size:34px;margin-bottom:6px;">\\u2728</div>' +
        '<div style="font-size:19px;font-weight:800;color:#1a1a1a;margin-bottom:6px;">Activate your business account</div>' +
        '<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:18px;">A one-time <strong>GHS 10</strong> activation unlocks your SalonLink listing, bookings, and the Pro photo gallery (up to 10 photos).</div>' +
        '<div style="background:#F7F4EC;border:1px solid #E7DFC8;border-radius:14px;padding:14px;margin-bottom:18px;">' +
          '<div style="font-size:30px;font-weight:800;color:#8B6914;">GHS 10.00</div>' +
          '<div style="font-size:11px;color:#999;margin-top:2px;">Mobile Money or Card \\u00b7 secured by Paystack</div>' +
        '</div>' +
        '<button id="sl-paywall-pay" style="width:100%;padding:15px;border-radius:12px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#fff;border:none;font-size:15px;font-weight:800;cursor:pointer;">Pay GHS 10 &amp; Activate</button>' +
        '<div id="sl-paywall-note" style="font-size:11px;color:#aaa;margin-top:12px;">You can\\u2019t set up your salon until activation is complete.</div>' +
      '</div>';
    document.body.appendChild(ov);

    document.getElementById('sl-paywall-pay').onclick = function(){
      var btn = this;
      btn.disabled = true; btn.textContent = 'Opening secure checkout...';
      loadPaystack(function(){
        if (!window.PaystackPop || !cfg.public_key){
          toast('Checkout unavailable right now. Please try again shortly.', 'error');
          btn.disabled = false; btn.textContent = 'Pay GHS 10 & Activate';
          return;
        }
        var ref = 'SUB-' + Date.now() + '-' + Math.floor(Math.random()*1e6);
        var handler = window.PaystackPop.setup({
          key: cfg.public_key,
          email: cfg.email || ('provider+' + (cfg.provider_id||'x') + '@salonlink.it.com'),
          amount: cfg.amount || 1000,
          currency: 'GHS',
          ref: ref,
          metadata: { custom_fields: [{ display_name: 'Purpose', variable_name: 'purpose', value: 'provider_activation' }] },
          callback: function(resp){
            btn.textContent = 'Verifying...';
            (window.axios).post('/api/subscriptions/verify', { reference: resp.reference }, { headers: h() })
              .then(function(){
                toast('Account activated! \\u2728', 'success');
                var o = document.getElementById('sl-paywall-overlay'); if (o) o.remove();
              })
              .catch(function(e){
                var d = e && e.response && e.response.data ? e.response.data : {};
                toast(d.error || 'We could not confirm your payment. Contact support with your reference.', 'error');
                btn.disabled = false; btn.textContent = 'Pay GHS 10 & Activate';
              });
          },
          onClose: function(){
            btn.disabled = false; btn.textContent = 'Pay GHS 10 & Activate';
          }
        });
        handler.openIframe();
      });
    };
  }

  function gate(){
    if (!t()){ if (onDashboard) location.href = '/login'; return; }
    if (!window.axios) { setTimeout(gate, 200); return; }
    window.axios.get('/api/subscriptions/config', { headers: h() })
      .then(function(r){
        var cfg = r.data || {};
        if (cfg.subscribed) return; // already paid — nothing to do
        if (onDashboard){
          // Provider reached dashboard without paying — send back to activate
          location.href = '/provider/onboarding';
          return;
        }
        if (!cfg.configured){
          toast('Activation is being set up. Please try again shortly.', 'info');
          return;
        }
        showPaywall(cfg);
      })
      .catch(function(){ /* network hiccup — don't hard-block, let them retry on reload */ });
  }

  document.addEventListener('DOMContentLoaded', function(){
    hideOldUpgrade();
    setTimeout(hideOldUpgrade, 600);
    setTimeout(gate, 400);
  });
})();
</script>`
  if (html.includes('provider-subscription-paywall')) return html
  return html.replace('</body>', script + '</body>')
}
