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

  function hideOldUpgrade(){ var b=document.getElementById('pro-banner'); if(b) b.style.display='none'; }

  function loadPaystack(cb){
    if (window.PaystackPop) { cb(); return; }
    var s = document.getElementById('paystack-inline-js');
    if (s){ s.addEventListener('load', cb); return; }
    s = document.createElement('script'); s.id='paystack-inline-js';
    s.src='https://js.paystack.co/v1/inline.js'; s.onload=cb;
    s.onerror=function(){ toast('Could not load secure checkout. Check your connection.','error'); };
    document.head.appendChild(s);
  }

  function verify(ref, btn){
    btn.textContent='Verifying...';
    window.axios.post('/api/subscriptions/verify', { reference: ref }, { headers: h() })
      .then(function(r){
        var ch=(r.data&&r.data.billing_channel)||'';
        toast(ch==='card'?'Activated! Your card auto-renews monthly. \\u2728':'Activated! \\u2728','success');
        var o=document.getElementById('sl-paywall-overlay'); if(o) o.remove();
      })
      .catch(function(e){
        var d=e&&e.response&&e.response.data?e.response.data:{};
        toast(d.error||'We could not confirm your payment. Contact support with your reference.','error');
        btn.disabled=false; btn.textContent='Pay GHS 10';
      });
  }

  function payCard(cfg, btn){
    btn.disabled=true; btn.textContent='Opening secure checkout...';
    loadPaystack(function(){
      if(!window.PaystackPop || !cfg.public_key || !cfg.plan_code){
        toast('Card checkout unavailable right now. Try Mobile Money or retry shortly.','error');
        btn.disabled=false; btn.textContent='Pay GHS 10'; return;
      }
      var handler = window.PaystackPop.setup({
        key: cfg.public_key,
        email: cfg.email || ('provider+'+(cfg.provider_id||'x')+'@salonlink.it.com'),
        plan: cfg.plan_code,
        channels: ['card'],
        ref: 'SUBC-'+Date.now()+'-'+Math.floor(Math.random()*1e6),
        callback: function(resp){ verify(resp.reference, btn); },
        onClose: function(){ btn.disabled=false; btn.textContent='Pay GHS 10'; }
      });
      handler.openIframe();
    });
  }

  function payMomo(cfg, btn){
    btn.disabled=true; btn.textContent='Opening Mobile Money...';
    loadPaystack(function(){
      if(!window.PaystackPop || !cfg.public_key){
        toast('Checkout unavailable right now. Please retry shortly.','error');
        btn.disabled=false; btn.textContent='Pay GHS 10'; return;
      }
      var handler = window.PaystackPop.setup({
        key: cfg.public_key,
        email: cfg.email || ('provider+'+(cfg.provider_id||'x')+'@salonlink.it.com'),
        amount: cfg.amount || 1000,
        currency: 'GHS',
        channels: ['mobile_money'],
        ref: 'SUBM-'+Date.now()+'-'+Math.floor(Math.random()*1e6),
        callback: function(resp){ verify(resp.reference, btn); },
        onClose: function(){ btn.disabled=false; btn.textContent='Pay GHS 10'; }
      });
      handler.openIframe();
    });
  }

  function showPaywall(cfg, lapsed){
    if (document.getElementById('sl-paywall-overlay')) return;
    var ov=document.createElement('div'); ov.id='sl-paywall-overlay';
    ov.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(10,10,15,0.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;';
    var headline = lapsed ? 'Renew your subscription' : 'Activate your business account';
    var sub = lapsed
      ? 'Your monthly GHS 10 subscription has lapsed. Renew to stay listed and keep taking bookings.'
      : 'A <strong>GHS 10/month</strong> subscription unlocks your SalonLink listing, bookings, and the Pro photo gallery.';
    ov.innerHTML =
      '<div style="background:#fff;max-width:400px;width:100%;border-radius:20px;padding:26px 22px;box-shadow:0 24px 60px rgba(0,0,0,0.35);text-align:center;font-family:inherit;">' +
        '<div style="font-size:32px;margin-bottom:4px;">\\u2728</div>' +
        '<div style="font-size:19px;font-weight:800;color:#1a1a1a;margin-bottom:6px;">'+headline+'</div>' +
        '<div style="font-size:13px;color:#666;line-height:1.6;margin-bottom:16px;">'+sub+'</div>' +
        '<div style="background:#F7F4EC;border:1px solid #E7DFC8;border-radius:14px;padding:12px;margin-bottom:16px;">' +
          '<div style="font-size:28px;font-weight:800;color:#8B6914;">GHS 10.00<span style="font-size:13px;font-weight:600;color:#b09a5e;">/month</span></div>' +
        '</div>' +
        '<button id="sl-pay-card" style="width:100%;padding:14px;border-radius:12px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#fff;border:none;font-size:14px;font-weight:800;cursor:pointer;margin-bottom:10px;">\\uD83D\\uDCB3 Pay with Card \\u00b7 auto-renews monthly</button>' +
        '<button id="sl-pay-momo" style="width:100%;padding:14px;border-radius:12px;background:#fff;color:#8B6914;border:1.5px solid #C9A84C;font-size:14px;font-weight:800;cursor:pointer;">\\uD83D\\uDCF1 Pay with Mobile Money \\u00b7 renew monthly</button>' +
        '<div style="font-size:11px;color:#aaa;margin-top:12px;line-height:1.5;">Card auto-renews each month. Mobile Money is renewed by you monthly \\u2014 we\\u2019ll remind you. Secured by Paystack.</div>' +
      '</div>';
    document.body.appendChild(ov);
    document.getElementById('sl-pay-card').onclick = function(){ payCard(cfg, this); };
    document.getElementById('sl-pay-momo').onclick = function(){ payMomo(cfg, this); };
  }

  function gate(){
    if (!t()){ if (onDashboard) location.href='/login'; return; }
    if (!window.axios){ setTimeout(gate,200); return; }
    window.axios.get('/api/subscriptions/config',{headers:h()})
      .then(function(r){
        var cfg=r.data||{};
        if (cfg.subscribed) return;
        if (!cfg.configured){ toast('Activation is being set up. Please try again shortly.','info'); return; }
        showPaywall(cfg, onDashboard);
      })
      .catch(function(){ /* network hiccup — retry on reload */ });
  }

  document.addEventListener('DOMContentLoaded', function(){
    hideOldUpgrade(); setTimeout(hideOldUpgrade,600); setTimeout(gate,400);
  });
})();
</script>`
  if (html.includes('provider-subscription-paywall')) return html
  return html.replace('</body>', script + '</body>')
}
