import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const providerProfilePage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Provider Profile', `
<style>
  .hero-cover { height:320px; background:linear-gradient(135deg,var(--c-dark) 0%,var(--c-mist) 100%); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:100px; }
  .avatar-ring { width:90px; height:90px; border-radius:26px; background:linear-gradient(135deg,var(--c-mist),var(--g-dim)); border:2px solid var(--g-border); display:flex; align-items:center; justify-content:center; font-size:40px; position:relative; }
  .avatar-ring::after { content:''; position:absolute; inset:-3px; border-radius:28px; background:linear-gradient(135deg,var(--g-main),transparent,var(--g-main)); z-index:-1; }
  .service-item { display:flex; align-items:center; justify-content:space-between; padding:18px 0; border-bottom:1px solid var(--i-faint); cursor:pointer; transition:padding-left 0.3s; }
  .service-item:hover { padding-left:6px; }
  .service-item:last-child { border-bottom:none; }
  .time-slot { padding:10px 16px; border-radius:10px; background:var(--c-raise); border:1px solid var(--i-faint); font-size:13px; font-weight:500; cursor:pointer; transition:all 0.25s; text-align:center; }
  .time-slot:hover, .time-slot.selected { background:var(--g-dim); border-color:var(--g-main); color:var(--g-main); }
  .time-slot.disabled { opacity:0.3; cursor:not-allowed; background:var(--c-dark); }
  .portfolio-item { aspect-ratio:1; border-radius:14px; overflow:hidden; background:var(--c-raise); cursor:pointer; transition:all 0.35s var(--ease-luxury); display:flex; align-items:center; justify-content:center; font-size:36px; border:1px solid var(--i-faint); }
  .portfolio-item:hover { transform:scale(1.04); border-color:var(--g-border); }
</style>
`)}
</head>
<body class="bg-grain">
${navbar('')}

<!-- ── HERO COVER ── -->
<div class="hero-cover">
  <div class="orb" style="width:400px;height:400px;background:radial-gradient(circle,rgba(201,168,76,0.08),transparent);top:-100px;right:-100px;"></div>
  <div style="position:relative;z-index:1;">💇‍♀️</div>
  <div class="bg-grid-fine" style="position:absolute;inset:0;opacity:0.5;"></div>
</div>

<!-- ── PROFILE HEADER ── -->
<div class="container" style="position:relative;">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:-48px;margin-bottom:36px;flex-wrap:wrap;gap:16px;">
    <div style="display:flex;align-items:flex-end;gap:24px;">
      <div class="avatar-ring">💇‍♀️</div>
      <div style="padding-bottom:6px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap;">
          <h1 class="font-display" style="font-size:32px;font-weight:500;">Glam Studio GH</h1>
          <span class="badge badge-verified"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> KYC Verified</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="font-size:14px;color:var(--t-secondary);">Hair Salon &nbsp;·&nbsp; East Legon, Accra</span>
          <div style="display:flex;align-items:center;gap:7px;">
            <span class="stars" style="font-size:14px;">★★★★★</span>
            <span style="font-weight:700;color:var(--g-main);">4.9</span>
            <span style="font-size:12px;color:var(--t-muted);">(128 reviews)</span>
          </div>
          <span class="badge badge-live"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#5DC98A;margin-right:4px;"></span>Open Now · Until 8 PM</span>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:10px;padding-bottom:6px;">
      <button onclick="showToast('Saved to favourites ✦','success')" class="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Save
      </button>
      <a href="/book/${id}" class="btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Book Appointment
      </a>
    </div>
  </div>
</div>

<!-- ── MAIN CONTENT ── -->
<div class="container" style="padding-bottom:120px;">
  <div style="display:grid;grid-template-columns:1fr 380px;gap:40px;" class="profile-layout">

    <!-- LEFT COLUMN -->
    <div>

      <!-- About -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:20px;">About</div>
        <p style="font-size:14px;color:var(--t-secondary);line-height:1.9;font-weight:300;">
          Glam Studio GH is a premium hair salon located in East Legon, Accra. With over 8 years of experience,
          we specialise in natural hair care, braiding, locs, silk press, and protective styles.
          Every client receives a personalised consultation to achieve their perfect look.
        </p>
        <div style="display:flex;gap:24px;margin-top:28px;flex-wrap:wrap;">
          ${[
            {label:'Years Experience',val:'8+'},
            {label:'Clients Served',val:'1,240+'},
            {label:'Repeat Bookings',val:'87%'},
          ].map(s=>`
            <div>
              <div class="font-display gold-gradient" style="font-size:28px;">${s.val}</div>
              <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-muted);margin-top:4px;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Services -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div class="eyebrow" style="margin-bottom:24px;">Services & Pricing</div>
        ${[
          {name:'Natural Twist',    dur:'90 min', price:'GHS 80',  popular:true},
          {name:'Box Braids',       dur:'3–4 hrs',price:'GHS 200', popular:false},
          {name:'Silk Press',       dur:'2 hrs',  price:'GHS 120', popular:false},
          {name:'Loc Retwist',      dur:'1.5 hrs',price:'GHS 100', popular:false},
          {name:'Protective Braids',dur:'2.5 hrs',price:'GHS 150', popular:false},
          {name:'Colour Treatment', dur:'2–3 hrs',price:'GHS 180', popular:false},
        ].map(s=>`
          <div class="service-item" onclick="window.location.href='/book/${id}?service=${encodeURIComponent(s.name)}'">
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="width:36px;height:36px;border-radius:10px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:16px;">✦</div>
              <div>
                <div style="display:flex;align-items:center;gap:9px;">
                  <span style="font-size:14px;font-weight:600;">${s.name}</span>
                  ${s.popular ? '<span class="badge badge-gold" style="font-size:9px;">Popular</span>' : ''}
                </div>
                <div style="font-size:12px;color:var(--t-muted);margin-top:2px;">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  ${s.dur}
                </div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
              <span class="font-display gold-gradient" style="font-size:18px;">${s.price}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t-faint)" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Portfolio -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div class="eyebrow">Portfolio</div>
          <button onclick="showToast('Full portfolio coming soon','info')" class="btn-ghost" style="font-size:11px;padding:8px 18px;">View All</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
          ${['💇‍♀️','🌿','✨','💅','🎀','👑','🌺','💫'].map((e,i)=>`
            <div class="portfolio-item" onclick="showToast('Style ${i+1} preview coming soon','info')">${e}</div>
          `).join('')}
        </div>
      </div>

      <!-- Reviews -->
      <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;" class="reveal">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;">
          <div class="eyebrow">Reviews</div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="font-display gold-gradient" style="font-size:36px;">4.9</div>
            <div>
              <div class="stars" style="font-size:15px;">★★★★★</div>
              <div style="font-size:11px;color:var(--t-muted);">128 reviews</div>
            </div>
          </div>
        </div>

        <!-- Rating bars -->
        <div style="margin-bottom:36px;">
          ${[{stars:5,pct:88},{stars:4,pct:9},{stars:3,pct:2},{stars:2,pct:1},{stars:1,pct:0}].map(r=>`
            <div class="rating-bar-wrap" style="margin-bottom:10px;">
              <span style="font-size:12px;color:var(--t-secondary);min-width:30px;">${r.stars}★</span>
              <div class="rating-bar"><div class="rating-bar-fill" style="width:${r.pct}%;"></div></div>
              <span style="font-size:11px;color:var(--t-muted);min-width:30px;text-align:right;">${r.pct}%</span>
            </div>
          `).join('')}
        </div>

        <!-- Individual reviews -->
        ${[
          {name:'Akosua M.',  date:'2 days ago',  rating:5, comment:'Absolutely stunning silk press! She understood exactly what I wanted. Will definitely be back.'},
          {name:'Efua T.',    date:'1 week ago',  rating:5, comment:'Best box braids in Accra. Very neat, professional, and my style history was ready on arrival. Loved it!'},
          {name:'Ama D.',     date:'2 weeks ago', rating:4, comment:'Great natural twist, took a bit longer than expected but the result was worth it.'},
        ].map(r=>`
          <div style="padding:24px 0;border-top:1px solid var(--i-faint);">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--c-mist),var(--g-dim));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:15px;color:var(--g-main);">${r.name[0]}</div>
                <div>
                  <div style="font-size:14px;font-weight:600;">${r.name}</div>
                  <div class="stars" style="font-size:12px;">${'★'.repeat(r.rating)}</div>
                </div>
              </div>
              <span style="font-size:11px;color:var(--t-faint);">${r.date}</span>
            </div>
            <p style="font-size:13px;color:var(--t-secondary);line-height:1.8;font-style:italic;">"${r.comment}"</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div>
      <div style="position:sticky;top:92px;display:flex;flex-direction:column;gap:20px;">

        <!-- Quick book card -->
        <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:28px;" class="reveal">
          <div class="eyebrow" style="margin-bottom:20px;">Book This Provider</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <span style="font-size:13px;color:var(--t-secondary);">Starting from</span>
            <span class="font-display gold-gradient" style="font-size:28px;">GHS 80</span>
          </div>
          <a href="/book/${id}" class="btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:13px;margin-bottom:12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Appointment
          </a>
          <button onclick="showToast('Sending message...','info')" class="btn-outline" style="width:100%;justify-content:center;padding:12px;font-size:12px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Message Provider
          </button>
        </div>

        <!-- Info card -->
        <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;" class="reveal">
          <div class="eyebrow" style="margin-bottom:20px;">Details</div>
          ${[
            {icon:'📍',label:'Location',val:'East Legon, Accra, Ghana'},
            {icon:'🕐',label:'Hours',val:'Mon–Sat: 8 AM – 8 PM'},
            {icon:'📞',label:'Contact',val:'+233 20 000 0000'},
            {icon:'💳',label:'Payment',val:'MoMo · Card · Cash'},
          ].map(i=>`
            <div style="display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;">
              <span style="font-size:18px;flex-shrink:0;">${i.icon}</span>
              <div>
                <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--t-muted);margin-bottom:3px;">${i.label}</div>
                <div style="font-size:13px;color:var(--t-primary);">${i.val}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Trust signals -->
        <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-lg);padding:22px;" class="reveal">
          ${[
            {icon:'🪪',text:'Identity verified via Ghana Card'},
            {icon:'🔒',text:'Secure payments via Paystack'},
            {icon:'📸',text:'Style history stored per client'},
          ].map(t=>`
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;last-child:margin-bottom:0;">
              <span style="font-size:16px;">${t.icon}</span>
              <span style="font-size:12px;color:var(--t-secondary);">${t.text}</span>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  </div>
</div>

<style>
@media(max-width:900px){
  .profile-layout { grid-template-columns:1fr !important; }
}
</style>

${mobileNav('')}
${globalScripts()}
</body></html>`
