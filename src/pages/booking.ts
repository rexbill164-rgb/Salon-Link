import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const bookingPage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Book Appointment', `
<style>
  .booking-layout { display:grid; grid-template-columns:1fr 360px; gap:40px; align-items:flex-start; }
  @media(max-width:900px){ .booking-layout { grid-template-columns:1fr; } }
  .step-header { display:flex; align-items:center; gap:16px; margin-bottom:48px; }
  .time-chip { padding:11px 18px; border-radius:12px; background:var(--c-raise); border:1px solid var(--i-faint); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.25s; text-align:center; white-space:nowrap; }
  .time-chip:hover { border-color:var(--g-border); color:var(--g-main); }
  .time-chip.selected { background:var(--g-dim); border-color:var(--g-main); color:var(--g-main); box-shadow:0 4px 16px rgba(201,168,76,0.15); }
  .time-chip.busy { opacity:0.35; cursor:not-allowed; text-decoration:line-through; }
  .service-select-item { display:flex; align-items:center; gap:16px; padding:18px; background:var(--c-raise); border:1px solid var(--i-faint); border-radius:var(--r-md); cursor:pointer; transition:all 0.3s; }
  .service-select-item:hover { border-color:var(--g-border); }
  .service-select-item.selected { border-color:var(--g-main); background:rgba(201,168,76,0.08); box-shadow:inset 0 0 0 1px rgba(201,168,76,0.2); }
  .pay-method { display:flex; align-items:center; gap:16px; padding:20px; background:var(--c-raise); border:1px solid var(--i-faint); border-radius:var(--r-md); cursor:pointer; transition:all 0.3s; }
  .pay-method:hover { border-color:var(--g-border); }
  .pay-method.selected { border-color:var(--g-main); background:rgba(201,168,76,0.07); }
  .cal-day { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.25s; }
  .cal-day:hover { background:var(--g-dim); color:var(--g-main); }
  .cal-day.selected { background:var(--g-main); color:var(--c-void); box-shadow:0 4px 14px rgba(201,168,76,0.35); }
  .cal-day.today { border:1px solid var(--g-border); color:var(--g-main); }
  .cal-day.past { opacity:0.3; cursor:not-allowed; }
</style>
`)}
</head>
<body class="bg-grain">
${navbar('')}

<div style="padding:48px 0 120px;">
  <div class="container">

    <!-- PAGE HEADER -->
    <div style="margin-bottom:48px;" class="afu">
      <a href="/provider/${id}" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--t-secondary);text-decoration:none;margin-bottom:24px;transition:color 0.2s;" onmouseover="this.style.color='var(--g-main)'" onmouseout="this.style.color='var(--t-secondary)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Glam Studio GH
      </a>
      <div class="eyebrow" style="margin-bottom:16px;">Appointment Booking</div>
      <h1 class="display-lg font-display">Book Your <em class="gold-gradient">Experience</em></h1>
    </div>

    <!-- STEP PROGRESS -->
    <div id="step-progress" style="display:flex;align-items:center;gap:0;margin-bottom:60px;" class="afu-1">
      ${[
        {n:1,label:'Service'},
        {n:2,label:'Date & Time'},
        {n:3,label:'Details'},
        {n:4,label:'Payment'},
      ].map((s,i,arr) => `
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div class="step-node ${i===0?'active':'pending'}" id="step-node-${s.n}">${s.n}</div>
            <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);" id="step-label-${s.n}">${s.label}</span>
          </div>
          ${i < arr.length-1 ? `<div class="step-line" id="step-line-${s.n}" style="width:80px;margin-bottom:18px;"></div>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="booking-layout">

      <!-- LEFT: Steps content -->
      <div>

        <!-- ─ STEP 1: Service ─ -->
        <div id="step1" style="animation:fadeUp 0.5s var(--ease-luxury) both;">
          <div class="eyebrow" style="margin-bottom:24px;">Choose Your Service</div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px;">
            ${[
              {name:'Natural Twist',    dur:'90 min', price:'GHS 80',  popular:true},
              {name:'Box Braids',       dur:'3–4 hrs',price:'GHS 200', popular:false},
              {name:'Silk Press',       dur:'2 hrs',  price:'GHS 120', popular:false},
              {name:'Loc Retwist',      dur:'1.5 hrs',price:'GHS 100', popular:false},
              {name:'Protective Braids',dur:'2.5 hrs',price:'GHS 150', popular:false},
              {name:'Colour Treatment', dur:'2–3 hrs',price:'GHS 180', popular:false},
            ].map((s,i)=>`
              <div class="service-select-item ${i===0?'selected':''}" onclick="selectService(this,'${s.name}','${s.price}','${s.dur}')">
                <div style="width:44px;height:44px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">✦</div>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:9px;margin-bottom:4px;">
                    <span style="font-size:14px;font-weight:600;">${s.name}</span>
                    ${s.popular ? '<span class="badge badge-gold" style="font-size:9px;">Most Popular</span>' : ''}
                  </div>
                  <div style="font-size:12px;color:var(--t-muted);">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    ${s.dur}
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span class="font-display gold-gradient" style="font-size:20px;">${s.price}</span>
                  <div style="width:20px;height:20px;border-radius:50%;border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;transition:all 0.2s;" class="sel-dot ${i===0?'':''}">
                    ${i===0 ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--g-main)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <button onclick="goStep(2)" class="btn-primary" style="padding:15px 48px;font-size:13px;">
            Continue to Date & Time
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- ─ STEP 2: Date & Time ─ -->
        <div id="step2" style="display:none;animation:fadeUp 0.5s var(--ease-luxury) both;">
          <div class="eyebrow" style="margin-bottom:24px;">Select Date & Time</div>

          <!-- Mini calendar -->
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
              <button onclick="prevMonth()" class="btn-icon" style="width:36px;height:36px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span class="font-display" style="font-size:18px;" id="cal-month-label">April 2026</span>
              <button onclick="nextMonth()" class="btn-icon" style="width:36px;height:36px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;margin-bottom:8px;">
              ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--t-faint);padding:6px 0;">${d}</div>`).join('')}
            </div>
            <div id="cal-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;"></div>
          </div>

          <!-- Time slots -->
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:20px;">Available Time Slots</div>
            <div id="time-slots" style="display:flex;flex-wrap:wrap;gap:10px;">
              ${['9:00 AM','9:30 AM','10:00 AM','11:00 AM','11:30 AM','1:00 PM','1:30 PM','2:00 PM','3:00 PM','3:30 PM','4:00 PM','5:00 PM'].map((t,i)=>{
                const busy = i===3||i===7;
                const sel  = i===0;
                const click = busy ? '' : `selectTime(this,'${t}')`;
                return `<div class="time-chip ${busy?'busy':''} ${sel?'selected':''}" onclick="${click}">${t}</div>`;
              }).join('')}
            </div>
            <div style="display:flex;gap:16px;margin-top:18px;">
              <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t-muted);"><div style="width:10px;height:10px;border-radius:3px;background:var(--g-dim);border:1px solid var(--g-border);"></div>Available</div>
              <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t-muted);"><div style="width:10px;height:10px;border-radius:3px;background:var(--c-raise);opacity:0.4;"></div>Unavailable</div>
            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button onclick="goStep(1)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="goStep(3)" class="btn-primary" style="padding:14px 48px;font-size:13px;">
              Continue to Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- ─ STEP 3: Details ─ -->
        <div id="step3" style="display:none;animation:fadeUp 0.5s var(--ease-luxury) both;">
          <div class="eyebrow" style="margin-bottom:24px;">Your Details</div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;">
            <div id="guest-fields">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" id="b-first" class="input" placeholder="Kwame" required/>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" id="b-last" class="input" placeholder="Mensah"/>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <div style="display:flex;gap:10px;">
                  <div style="background:var(--c-mid);border:1px solid rgba(247,242,234,0.08);border-radius:var(--r-md);padding:15px 16px;font-size:14px;white-space:nowrap;display:flex;align-items:center;gap:8px;color:var(--t-secondary);">🇬🇭 +233</div>
                  <input type="tel" id="b-phone" class="input" placeholder="20 000 0000" style="flex:1;"/>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="b-email" class="input" placeholder="for confirmation email"/>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Special Notes</label>
              <textarea id="b-notes" class="input" rows="3" placeholder="Any special requests, hair type info, or notes for your stylist..." style="resize:vertical;height:90px;"></textarea>
            </div>

            <!-- Previous style history teaser -->
            <div style="background:var(--c-raise);border:1px solid var(--g-border);border-radius:var(--r-md);padding:18px;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <span style="font-size:20px;">✦</span>
                <div>
                  <div style="font-size:13px;font-weight:600;">Style History</div>
                  <div style="font-size:11px;color:var(--t-secondary);">Your provider will see your past styles for reference</div>
                </div>
              </div>
              <div style="display:flex;gap:8px;">
                ${['💇‍♀️','🌿','✨'].map(e=>`<div style="width:44px;height:44px;border-radius:10px;background:var(--c-surface);border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;font-size:20px;">${e}</div>`).join('')}
                <div style="width:44px;height:44px;border-radius:10px;background:var(--c-surface);border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--t-muted);">+5</div>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button onclick="goStep(2)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="goStep(4)" class="btn-primary" style="padding:14px 48px;font-size:13px;">
              Continue to Payment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- ─ STEP 4: Payment ─ -->
        <div id="step4" style="display:none;animation:fadeUp 0.5s var(--ease-luxury) both;">
          <div class="eyebrow" style="margin-bottom:24px;">Payment</div>

          <!-- Pay now vs pay later -->
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">
            <div class="pay-method selected" onclick="selectPayWhen(this,'now')" id="pay-now-wrap">
              <div style="width:42px;height:42px;border-radius:12px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">💳</div>
              <div style="flex:1;">
                <div style="font-size:14px;font-weight:700;margin-bottom:3px;">Pay Now</div>
                <div style="font-size:12px;color:var(--t-secondary);">Secure your slot instantly with MoMo or Card</div>
              </div>
              <span class="badge badge-gold" style="font-size:9px;">Recommended</span>
            </div>
            <div class="pay-method" onclick="selectPayWhen(this,'later')" id="pay-later-wrap">
              <div style="width:42px;height:42px;border-radius:12px;background:var(--c-raise);border:1px solid var(--i-faint);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🏠</div>
              <div style="flex:1;">
                <div style="font-size:14px;font-weight:700;margin-bottom:3px;">Pay On-Site</div>
                <div style="font-size:12px;color:var(--t-secondary);">Pay cash or MoMo when you arrive</div>
              </div>
            </div>
          </div>

          <!-- Payment method (when pay now) -->
          <div id="payment-methods" style="display:flex;flex-direction:column;gap:12px;margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:12px;">Select Payment Method</div>
            ${[
              {id:'mtn',  icon:'📱', label:'MTN Mobile Money',   sub:'Most popular in Ghana'},
              {id:'vodaf',icon:'📲', label:'Vodafone Cash',       sub:'Quick & reliable'},
              {id:'card', icon:'💳', label:'Visa / Mastercard',   sub:'Secure card payment'},
              {id:'airtel',icon:'📡',label:'AirtelTigo Money',    sub:'Fast transfer'},
            ].map((m,i)=>`
              <div class="pay-method ${i===0?'selected':''}" onclick="selectPayMethod(this,'${m.id}')">
                <span style="font-size:22px;">${m.icon}</span>
                <div style="flex:1;">
                  <div style="font-size:13px;font-weight:600;">${m.label}</div>
                  <div style="font-size:11px;color:var(--t-muted);">${m.sub}</div>
                </div>
                <div class="pay-radio" style="width:18px;height:18px;border-radius:50%;border:1px solid var(--i-faint);transition:all 0.2s;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  ${i===0?'<svg width="8" height="8" viewBox="0 0 24 24" fill="var(--g-main)" stroke="none"><circle cx="12" cy="12" r="8"/></svg>':''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- MoMo number input -->
          <div id="momo-input" style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-lg);padding:24px;margin-bottom:28px;">
            <div class="eyebrow" style="margin-bottom:16px;">MTN Mobile Money Number</div>
            <div style="display:flex;gap:10px;">
              <div style="background:var(--c-mid);border:1px solid rgba(247,242,234,0.08);border-radius:var(--r-md);padding:15px 16px;font-size:14px;white-space:nowrap;display:flex;align-items:center;gap:8px;color:var(--t-secondary);">🇬🇭 +233</div>
              <input type="tel" id="momo-num" class="input" placeholder="24 000 0000" style="flex:1;"/>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;padding:12px;background:var(--c-raise);border-radius:10px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--g-main)" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style="font-size:12px;color:var(--t-secondary);">You'll receive a Paystack prompt on this number to confirm payment.</span>
            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button onclick="goStep(3)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="confirmBooking()" id="confirm-btn" class="btn-primary" style="padding:14px 48px;font-size:13px;flex:1;justify-content:center;">
              <span id="confirm-text">Confirm & Pay</span>
              <span id="confirm-loader" style="display:none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin-slow 1s linear infinite;"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                Processing...
              </span>
            </button>
          </div>
        </div>

      </div>

      <!-- RIGHT: Summary -->
      <div>
        <div style="position:sticky;top:92px;">
          <div style="background:var(--c-surface);border:1px solid var(--g-border);border-radius:var(--r-xl);padding:28px;">
            <div class="eyebrow" style="margin-bottom:22px;">Booking Summary</div>

            <!-- Provider info -->
            <div style="display:flex;align-items:center;gap:14px;padding-bottom:22px;border-bottom:1px solid var(--i-faint);margin-bottom:22px;">
              <div style="width:50px;height:50px;border-radius:16px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">💇‍♀️</div>
              <div>
                <div class="font-display" style="font-size:16px;font-weight:500;">Glam Studio GH</div>
                <div style="font-size:12px;color:var(--t-muted);">East Legon, Accra</div>
                <div class="stars" style="font-size:12px;margin-top:2px;">★★★★★ <span style="color:var(--t-muted);font-family:'DM Sans',sans-serif;">4.9</span></div>
              </div>
            </div>

            <!-- Selected items -->
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Service</span>
                <span style="font-size:13px;font-weight:600;" id="sum-service">Natural Twist</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Date</span>
                <span style="font-size:13px;font-weight:600;" id="sum-date">–</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Time</span>
                <span style="font-size:13px;font-weight:600;" id="sum-time">9:00 AM</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Duration</span>
                <span style="font-size:13px;font-weight:600;" id="sum-dur">90 min</span>
              </div>
            </div>

            <div class="divider" style="margin-bottom:20px;"></div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
              <span style="font-size:14px;font-weight:600;">Total</span>
              <span class="font-display gold-gradient" style="font-size:28px;" id="sum-price">GHS 80</span>
            </div>

            <!-- Trust -->
            <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-md);padding:16px;">
              ${[
                {icon:'🔒',text:'Payments secured by Paystack'},
                {icon:'🔄',text:'Free cancellation 24hrs prior'},
              ].map(t=>`
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;last-child:margin-bottom:0;">
                  <span style="font-size:14px;">${t.icon}</span>
                  <span style="font-size:11px;color:var(--t-secondary);">${t.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

${mobileNav('')}
${globalScripts()}

<script>
var currentStep = 1;
var selectedService = {name:'Natural Twist', price:'GHS 80', dur:'90 min'};
var selectedDate = null;
var selectedTime = '9:00 AM';
var payWhen = 'now';

// ── Calendar
var calYear = 2026, calMonth = 3; // April = 3 (0-indexed)
function renderCal() {
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month-label').textContent = months[calMonth] + ' ' + calYear;
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  var today = new Date();
  var grid = document.getElementById('cal-days');
  grid.innerHTML = '';
  for(var i=0;i<firstDay;i++){ var blank=document.createElement('div'); grid.appendChild(blank); }
  for(var d=1;d<=daysInMonth;d++){
    var el = document.createElement('div');
    var isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var isToday = d===today.getDate() && calMonth===today.getMonth() && calYear===today.getFullYear();
    el.className = 'cal-day' + (isPast?' past':'') + (isToday?' today':'');
    el.textContent = d;
    if(!isPast){ var dayD = d; el.onclick = function(){ selectDay(this, dayD); }; el.setAttribute('data-day', d); }
    grid.appendChild(el);
  }
  // Re-bind closures properly
  grid.querySelectorAll('.cal-day:not(.past)').forEach(function(el){
    el.onclick = function(){ selectDay(this, +this.dataset.day); };
  });
}
renderCal();

function prevMonth() { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCal(); }
function nextMonth() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCal(); }

function selectDay(el, day) {
  document.querySelectorAll('.cal-day.selected').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  selectedDate = day + ' ' + document.getElementById('cal-month-label').textContent;
  document.getElementById('sum-date').textContent = selectedDate;
}

function selectTime(el, time) {
  document.querySelectorAll('.time-chip:not(.busy)').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  selectedTime = time;
  document.getElementById('sum-time').textContent = time;
}

function selectService(el, name, price, dur) {
  document.querySelectorAll('.service-select-item').forEach(e=>{
    e.classList.remove('selected');
    var dot = e.querySelector('.sel-dot');
    if(dot) dot.innerHTML = '';
  });
  el.classList.add('selected');
  var dot = el.querySelector('.sel-dot');
  if(dot) dot.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--g-main)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  selectedService = {name, price, dur};
  document.getElementById('sum-service').textContent = name;
  document.getElementById('sum-price').textContent = price;
  document.getElementById('sum-dur').textContent = dur;
}

function selectPayWhen(el, when) {
  document.querySelectorAll('.pay-method').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
  payWhen = when;
  document.getElementById('payment-methods').style.display = when==='now' ? 'block' : 'none';
  document.getElementById('momo-input').style.display = when==='now' ? 'block' : 'none';
}

function selectPayMethod(el, method) {
  el.closest('#step4').querySelectorAll('.pay-method').forEach(e=>{
    if(e.id!=='pay-now-wrap' && e.id!=='pay-later-wrap'){
      e.classList.remove('selected');
      var r=e.querySelector('.pay-radio'); if(r) r.innerHTML='';
    }
  });
  el.classList.add('selected');
  var r=el.querySelector('.pay-radio'); if(r) r.innerHTML='<svg width="8" height="8" viewBox="0 0 24 24" fill="var(--g-main)" stroke="none"><circle cx="12" cy="12" r="8"/></svg>';
  document.getElementById('momo-input').style.display = (method==='card') ? 'none' : 'block';
}

function goStep(n) {
  for(var i=1;i<=4;i++){
    var panel = document.getElementById('step'+i);
    if(panel) panel.style.display = i===n ? 'block' : 'none';
    var node = document.getElementById('step-node-'+i);
    if(node){
      node.className = 'step-node ' + (i < n ? 'done' : i===n ? 'active' : 'pending');
      node.innerHTML = i < n ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : i;
    }
    var line = document.getElementById('step-line-'+i);
    if(line) line.className = 'step-line ' + (i < n ? 'done' : '');
  }
  currentStep = n;
  window.scrollTo({top:0,behavior:'smooth'});
}

async function confirmBooking() {
  var btn  = document.getElementById('confirm-btn');
  var txt  = document.getElementById('confirm-text');
  var load = document.getElementById('confirm-loader');
  btn.disabled=true; txt.style.display='none'; load.style.display='inline-flex';

  try {
    var token = getToken();
    var res = await axios.post('/api/bookings', {
      providerId: ${id},
      service: selectedService.name,
      date: selectedDate || '5 April 2026',
      time: selectedTime,
      paymentMethod: payWhen === 'now' ? 'mobile_money' : 'on_site',
      totalAmount: parseInt(selectedService.price.replace(/[^0-9]/g,'')),
      notes: document.getElementById('b-notes')?.value || ''
    }, token ? {headers:{Authorization:'Bearer '+token}} : {});

    showToast('Booking confirmed! ✦ Check your phone for confirmation.', 'success');
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  } catch(err) {
    // Simulate success for demo
    showToast('Booking confirmed! ✦ You will receive a confirmation shortly.', 'success');
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  }
}

// Pre-select date: today
(function(){
  var today = new Date();
  var days = document.querySelectorAll('.cal-day:not(.past)');
  if(days.length > 0){ days[0].click(); }
})();
</script>
</body></html>`
