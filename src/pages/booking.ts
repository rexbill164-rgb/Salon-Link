import { baseHead, navbar, mobileNav, globalScripts } from '../utils/layout'

export const bookingPage = (id: string) => `<!DOCTYPE html>
<html lang="en">
<head>
${baseHead('Book Appointment', `
<style>
  .booking-layout { display:grid; grid-template-columns:1fr 360px; gap:40px; align-items:flex-start; }
  @media(max-width:900px){ .booking-layout { grid-template-columns:1fr; } }
  .time-chip { padding:11px 18px; border-radius:12px; background:var(--c-raise); border:1px solid var(--i-faint); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.25s; text-align:center; white-space:nowrap; }
  .time-chip:hover { border-color:var(--g-border); color:var(--g-main); }
  .time-chip.selected { background:var(--g-dim); border-color:var(--g-main); color:var(--g-main); box-shadow:0 4px 16px rgba(201,168,76,0.15); }
  .time-chip.busy { opacity:0.35; cursor:not-allowed; text-decoration:line-through; }
  .service-select-item { display:flex; align-items:center; gap:16px; padding:18px; background:var(--c-raise); border:1px solid var(--i-faint); border-radius:var(--r-md); cursor:pointer; transition:all 0.3s; margin-bottom:10px; }
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
  .step-panel { display:none; animation:fadeUp 0.5s var(--ease-luxury) both; }
  .step-panel.active { display:block; }
</style>
`)}
</head>
<body style="background:var(--c-deep);">
${navbar('')}

<div style="padding:48px 0 120px;">
  <div class="container">

    <!-- PAGE HEADER -->
    <div style="margin-bottom:48px;" class="afu">
      <a href="/provider/${id}" style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--t-secondary);text-decoration:none;margin-bottom:24px;transition:color 0.2s;" onmouseover="this.style.color='var(--g-main)'" onmouseout="this.style.color='var(--t-secondary)'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span id="back-link-label">Back to Provider</span>
      </a>
      <div class="eyebrow" style="margin-bottom:16px;">Appointment Booking</div>
      <h1 class="display-lg font-display">Book Your <em class="gold-gradient">Experience</em></h1>
    </div>

    <!-- STEP PROGRESS -->
    <div id="step-progress" style="display:flex;align-items:center;gap:0;margin-bottom:60px;overflow-x:auto;padding-bottom:8px;" class="afu-1">
      ${[
        {n:1,label:'Service'},
        {n:2,label:'Date & Time'},
        {n:3,label:'Details'},
        {n:4,label:'Payment'},
      ].map((s,i,arr) => `
        <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div class="step-node ${i===0?'active':'pending'}" id="step-node-${s.n}">${s.n}</div>
            <span style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--t-faint);" id="step-label-${s.n}">${s.label}</span>
          </div>
          ${i < arr.length-1 ? `<div class="step-line" id="step-line-${s.n}" style="width:60px;margin-bottom:18px;"></div>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="booking-layout">

      <!-- LEFT: Steps content -->
      <div>

        <!-- LOADING STATE -->
        <div id="loading-services" style="text-align:center;padding:40px;color:var(--t-muted);">
          <div style="font-size:32px;margin-bottom:12px;">⏳</div>
          <div>Loading services...</div>
        </div>

        <!-- ERROR STATE -->
        <div id="error-services" style="display:none;text-align:center;padding:40px;color:var(--s-red);">
          <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
          <div id="error-msg">Could not load services. Please go back and try again.</div>
          <a href="/discover" class="btn-ghost" style="margin-top:16px;display:inline-flex;">Browse Providers</a>
        </div>

        <!-- ─ STEP 1: Service ─ -->
        <div id="step1" class="step-panel">
          <div class="eyebrow" style="margin-bottom:24px;">Choose Your Service</div>
          <div id="services-select" style="margin-bottom:40px;">
            <!-- Populated dynamically -->
          </div>
          <button onclick="goStep(2)" class="btn-primary" style="padding:15px 48px;font-size:13px;">
            Continue to Date & Time
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- ─ STEP 2: Date & Time ─ -->
        <div id="step2" class="step-panel">
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
              ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--t-faint);padding:6px 0;">${d}</div>`).join('')}
            </div>
            <div id="cal-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;"></div>
          </div>

          <!-- Time slots -->
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:28px;margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:20px;">Available Time Slots</div>
            <div id="time-slots" style="display:flex;flex-wrap:wrap;gap:10px;">
              <div style="color:var(--t-muted);font-size:13px;">Select a date to see available slots</div>
            </div>
            <div style="display:flex;gap:16px;margin-top:18px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t-muted);"><div style="width:10px;height:10px;border-radius:3px;background:var(--g-dim);border:1px solid var(--g-border);"></div>Available</div>
              <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t-muted);"><div style="width:10px;height:10px;border-radius:3px;background:var(--c-raise);opacity:0.4;"></div>Unavailable</div>
            </div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button onclick="goStep(1)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="proceedToStep3()" class="btn-primary" style="padding:14px 48px;font-size:13px;">
              Continue to Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- ─ STEP 3: Details ─ -->
        <div id="step3" class="step-panel">
          <div class="eyebrow" style="margin-bottom:24px;">Your Details</div>
          <div style="background:var(--c-surface);border:1px solid var(--i-faint);border-radius:var(--r-xl);padding:36px;margin-bottom:28px;">
            <div id="logged-in-details" style="display:none;background:var(--g-dim);border:1px solid var(--g-border);border-radius:12px;padding:16px;margin-bottom:20px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,var(--g-deep),var(--g-main));display:flex;align-items:center;justify-content:center;font-size:16px;color:white;" id="user-initial">?</div>
                <div>
                  <div style="font-size:13px;font-weight:700;" id="user-name-display">Loading...</div>
                  <div style="font-size:11px;color:var(--t-muted);" id="user-email-display"></div>
                </div>
                <span class="badge badge-verified" style="font-size:9px;margin-left:auto;">✓ Logged In</span>
              </div>
            </div>
            <div id="guest-notice" style="background:rgba(201,168,76,0.08);border:1px solid var(--g-border);border-radius:12px;padding:14px;margin-bottom:20px;font-size:12px;color:var(--t-secondary);display:none;">
              ⚠️ You're not logged in. <a href="/login?redirect=/book/${id}" style="color:var(--g-main);font-weight:700;">Sign in</a> to book and track your appointments.
            </div>
            <div class="form-group">
              <label class="form-label">Special Notes <span style="font-weight:400;color:var(--t-muted);">(optional)</span></label>
              <textarea id="b-notes" class="input" rows="3" placeholder="Any special requests, hair type info, or notes for your stylist..." style="resize:vertical;height:90px;"></textarea>
            </div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button onclick="goStep(2)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="proceedToStep4()" class="btn-primary" style="padding:14px 48px;font-size:13px;">
              Continue to Payment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- ─ STEP 4: Payment ─ -->
        <div id="step4" class="step-panel">
          <div class="eyebrow" style="margin-bottom:24px;">Payment</div>

          <!-- Booking summary recap -->
          <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:16px;padding:18px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:var(--t-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em;">Booking Summary</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
              <span style="color:var(--t-muted);">Service</span><span style="font-weight:700;" id="recap-service">—</span>
              <span style="color:var(--t-muted);">Date</span><span style="font-weight:700;" id="recap-date">—</span>
              <span style="color:var(--t-muted);">Time</span><span style="font-weight:700;" id="recap-time">—</span>
              <span style="color:var(--t-muted);">Total</span><span style="font-weight:700;color:var(--g-main);" id="recap-total">—</span>
            </div>
          </div>

          <!-- Pay option -->
          <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;">
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
          <div id="payment-methods" style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px;">
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
            <div class="eyebrow" style="margin-bottom:16px;">Mobile Money Number</div>
            <div style="display:flex;gap:10px;">
              <div style="background:var(--c-mid);border:1.5px solid var(--i-faint);border-radius:var(--r-md);padding:15px 16px;font-size:14px;white-space:nowrap;display:flex;align-items:center;gap:8px;color:var(--t-secondary);">🇬🇭 +233</div>
              <input type="tel" id="momo-num" class="input" placeholder="24 000 0000" style="flex:1;"/>
            </div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button onclick="goStep(3)" class="btn-ghost" style="padding:14px 32px;">Back</button>
            <button onclick="confirmBooking()" id="confirm-btn" class="btn-primary" style="padding:14px 48px;font-size:13px;flex:1;justify-content:center;min-width:180px;">
              <span id="confirm-text">Confirm & Book</span>
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
              <div style="width:50px;height:50px;border-radius:16px;background:linear-gradient(135deg,var(--g-dim),rgba(131,58,180,0.1));border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">💇‍♀️</div>
              <div>
                <div id="sum-provider-name" class="font-display" style="font-size:16px;font-weight:500;">Loading...</div>
                <div id="sum-provider-loc" style="font-size:12px;color:var(--t-muted);">Accra</div>
              </div>
            </div>

            <!-- Selected items -->
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Service</span>
                <span style="font-size:13px;font-weight:600;" id="sum-service">—</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Date</span>
                <span style="font-size:13px;font-weight:600;" id="sum-date">—</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Time</span>
                <span style="font-size:13px;font-weight:600;" id="sum-time">—</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:12px;color:var(--t-muted);">Duration</span>
                <span style="font-size:13px;font-weight:600;" id="sum-dur">—</span>
              </div>
            </div>

            <div class="divider" style="margin-bottom:20px;"></div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;color:var(--t-muted);">Service Price</span>
              <span style="font-size:13px;font-weight:600;" id="sum-service-price">—</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <span style="font-size:12px;color:var(--t-muted);">Platform Fee</span>
              <span style="font-size:13px;color:var(--t-muted);">GHS 3</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
              <span style="font-size:14px;font-weight:600;">Total</span>
              <span class="font-display gold-gradient" style="font-size:28px;" id="sum-price">—</span>
            </div>

            <!-- Trust -->
            <div style="background:var(--g-dim);border:1px solid var(--g-border);border-radius:var(--r-md);padding:16px;">
              ${[
                {icon:'🔒',text:'Payments secured by Paystack'},
                {icon:'🔄',text:'Free cancellation 24hrs prior'},
              ].map(t=>`
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
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

<!-- ══ PAYMENT MODAL ══ -->
<div id="payment-modal" style="display:none;position:fixed;inset:0;background:rgba(26,18,9,0.6);backdrop-filter:blur(12px);z-index:9000;align-items:center;justify-content:center;padding:20px;">
  <div style="background:#fff;border-radius:24px;padding:32px;max-width:420px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.25);">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">💳</div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:6px;">Payment</h3>
      <div style="font-size:13px;color:#666;margin-bottom:4px;">Booking #<span id="pm-ref"></span></div>
      <div style="font-size:13px;color:#666;"><span id="pm-provider"></span> · <span id="pm-service"></span></div>
      <div style="font-size:22px;font-weight:800;color:#C9A84C;margin-top:8px;" id="pm-total"></div>
    </div>
    <!-- MoMo option -->
    <div style="background:#FFF8E6;border:1.5px solid #C9A84C;border-radius:16px;padding:20px;margin-bottom:14px;">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px;">📱 Mobile Money</div>
      <div style="display:flex;gap:10px;align-items:center;">
        <div style="background:#f5f5f5;border:1px solid #ddd;border-radius:10px;padding:11px 14px;font-size:13px;color:#555;white-space:nowrap;">🇬🇭 +233</div>
        <input type="tel" id="pm-momo-num" class="input" placeholder="24 000 0000" style="flex:1;font-size:14px;"/>
      </div>
      <div style="font-size:11px;color:#888;margin-top:8px;">MTN MoMo · Vodafone Cash · AirtelTigo Money</div>
      <button id="pm-momo-btn" onclick="payWithMomo()" style="width:100%;margin-top:14px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;">Send MoMo Prompt</button>
    </div>
    <!-- Cash option -->
    <button onclick="payWithCash()" style="width:100%;background:#f5f5f5;border:1.5px solid #ddd;border-radius:16px;padding:16px;font-size:14px;font-weight:600;cursor:pointer;color:#333;">
      💵 Pay Cash On Arrival
    </button>
    <button onclick="closePaymentModal()" style="width:100%;margin-top:10px;background:none;border:none;color:#999;font-size:12px;cursor:pointer;padding:8px;">Cancel</button>
  </div>
</div>

<!-- ══ RECEIPT MODAL ══ -->
<div id="receipt-modal" style="display:none;position:fixed;inset:0;background:rgba(26,18,9,0.6);backdrop-filter:blur(12px);z-index:9001;align-items:center;justify-content:center;padding:20px;">
  <div style="background:#fff;border-radius:24px;padding:0;max-width:400px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.25);overflow:hidden;">
    <div style="background:linear-gradient(135deg,#833AB4,#E1306C,#FCAF45);padding:28px;text-align:center;color:#fff;">
      <div style="font-size:40px;margin-bottom:8px;">🧾</div>
      <div style="font-size:18px;font-weight:800;letter-spacing:0.02em;">Booking Confirmed!</div>
      <div style="font-size:12px;opacity:0.85;margin-top:4px;">SalonLink · Official Receipt</div>
    </div>
    <div style="padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Reference</span>
        <span style="font-size:13px;font-weight:700;" id="rc-ref"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Provider</span>
        <span style="font-size:13px;font-weight:600;" id="rc-provider"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Service</span>
        <span style="font-size:13px;font-weight:600;" id="rc-service"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Date & Time</span>
        <span style="font-size:13px;font-weight:600;" id="rc-datetime"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:2px solid #E1306C;margin-bottom:12px;">
        <span style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Total</span>
        <span style="font-size:18px;font-weight:800;color:#E1306C;" id="rc-total"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <span style="font-size:11px;color:#aaa;" id="rc-issued"></span>
        <span style="font-size:12px;font-weight:700;" id="rc-status"></span>
      </div>
      <button onclick="window.location.href='/dashboard'" style="width:100%;background:linear-gradient(135deg,#833AB4,#E1306C);color:#fff;border:none;border-radius:14px;padding:14px;font-size:14px;font-weight:700;cursor:pointer;">View My Bookings</button>
    </div>
  </div>
</div>

${mobileNav('')}
${globalScripts()}

<script>
var currentStep = 1;
var selectedService = null; // { id, name, pricePs, priceGhs, dur }
var selectedDate = null;    // YYYY-MM-DD
var selectedTime = null;    // display string like "9:00 AM"
var selectedDateDisplay = '';
var payWhen = 'now';
var _bookingId = null;
var _providerName = 'Provider';
var _bookingRef = '';
window._providerId = parseInt('${id}') || 0;

// ── Auth helpers ──
function getToken() { return localStorage.getItem('sl_token'); }
function getUser()  { try { return JSON.parse(localStorage.getItem('sl_user')||'{}'); } catch(e){ return {}; } }

// ── Calendar ──
var today = new Date();
var calYear = today.getFullYear();
var calMonth = today.getMonth();

function renderCal() {
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month-label').textContent = months[calMonth] + ' ' + calYear;
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  var grid = document.getElementById('cal-days');
  grid.innerHTML = '';
  for(var i=0;i<firstDay;i++){ var blank=document.createElement('div'); grid.appendChild(blank); }
  for(var d=1;d<=daysInMonth;d++){
    var el = document.createElement('div');
    var dt = new Date(calYear, calMonth, d);
    var todayDt = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var isPast = dt < todayDt;
    var isToday = d===today.getDate() && calMonth===today.getMonth() && calYear===today.getFullYear();
    el.className = 'cal-day' + (isPast?' past':'') + (isToday?' today':'');
    el.textContent = d;
    if(!isPast){ el.setAttribute('data-day', d); }
    grid.appendChild(el);
  }
  grid.querySelectorAll('.cal-day:not(.past)').forEach(function(el){
    el.onclick = function(){ selectDay(this, +this.dataset.day); };
  });
}
renderCal();

function prevMonth() {
  var todayDt = new Date(today.getFullYear(), today.getMonth(), 1);
  var targetDt = new Date(calYear, calMonth-1, 1);
  if (targetDt < todayDt) { showToast('Cannot go to past months','error'); return; }
  calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCal();
}
function nextMonth() { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCal(); }

function selectDay(el, day) {
  document.querySelectorAll('.cal-day.selected').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
  var isoDate = calYear + '-' + String(calMonth+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  selectedDate = isoDate;
  var dayName = days[new Date(calYear, calMonth, day).getDay()];
  selectedDateDisplay = dayName + ', ' + day + ' ' + months[calMonth] + ' ' + calYear;
  document.getElementById('sum-date').textContent = day + ' ' + months[calMonth];
  // Load availability
  loadAvailability(isoDate);
}

function loadAvailability(date) {
  var slotsEl = document.getElementById('time-slots');
  slotsEl.innerHTML = '<div style="color:var(--t-muted);font-size:13px;">Loading slots...</div>';
  selectedTime = null;
  document.getElementById('sum-time').textContent = '—';
  axios.get('/api/providers/' + window._providerId + '/availability?date=' + date)
    .then(function(res) {
      var slots = res.data.slots || [];
      if (!slots.length) {
        slotsEl.innerHTML = '<div style="color:var(--t-muted);font-size:13px;padding:12px 0;">No available slots for this date.</div>';
        return;
      }
      slotsEl.innerHTML = slots.map(function(s, i) {
        return '<div class="time-chip' + (!s.available ? ' busy' : '') + '"' +
          (s.available ? ' data-time="' + s.time + '" onclick="selectTimeBtn(this)"' : '') + '>' + s.time + '</div>';
      }).join('');
      // Auto-select first available
      var first = slots.find(function(s){ return s.available; });
      if (first) {
        var firstEl = slotsEl.querySelector('.time-chip:not(.busy)');
        if (firstEl) firstEl.classList.add('selected');
        selectedTime = first.time;
        document.getElementById('sum-time').textContent = first.time;
      }
    })
    .catch(function() {
      // Fallback: show default slots
      var defaultSlots = ['9:00 AM','9:30 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
      slotsEl.innerHTML = defaultSlots.map(function(t, i) {
        return '<div class="time-chip' + (i===0?' selected':'') + '" data-time="' + t + '" onclick="selectTimeBtn(this)">' + t + '</div>';
      }).join('');
      selectedTime = defaultSlots[0];
      document.getElementById('sum-time').textContent = defaultSlots[0];
    });
}

function selectTimeBtn(el) {
  var time = el.getAttribute('data-time');
  selectTime(el, time);
}
function selectTime(el, time) {
  document.querySelectorAll('.time-chip:not(.busy)').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
  selectedTime = time;
  document.getElementById('sum-time').textContent = time;
}

// ── Service selection ──
function selectSvc(el) {
  document.querySelectorAll('.service-select-item').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
  var name = el.getAttribute('data-name');
  var pricePs = parseInt(el.getAttribute('data-price')) || 0;
  var durMins = parseInt(el.getAttribute('data-duration')) || 60;
  var svcId = parseInt(el.getAttribute('data-id'));
  var priceGhs = Math.round(pricePs / 100);
  var durStr = durMins >= 60 ? (Math.floor(durMins/60)) + ' hr' + (durMins>=120?'s':'') + (durMins%60>0?' '+durMins%60+'m':'') : durMins + ' min';
  selectedService = { id: svcId, name: name, pricePs: pricePs, priceGhs: priceGhs, dur: durStr };
  document.getElementById('sum-service').textContent = name;
  document.getElementById('sum-service-price').textContent = 'GHS ' + priceGhs;
  document.getElementById('sum-price').textContent = 'GHS ' + (priceGhs + 3);
  document.getElementById('sum-dur').textContent = durStr;
}

// ── Step navigation ──
function goStep(n) {
  for(var i=1;i<=4;i++){
    var panel = document.getElementById('step'+i);
    if(panel) { panel.classList.toggle('active', i===n); panel.style.display = i===n ? 'block' : 'none'; }
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

function proceedToStep3() {
  if (!selectedDate) { showToast('Please select a date','error'); return; }
  if (!selectedTime) { showToast('Please select a time slot','error'); return; }
  // Populate user info on step 3
  var user = getUser();
  var token = getToken();
  if (token && user && user.first_name) {
    document.getElementById('logged-in-details').style.display = 'block';
    document.getElementById('guest-notice').style.display = 'none';
    document.getElementById('user-initial').textContent = (user.first_name||'?').charAt(0).toUpperCase();
    document.getElementById('user-name-display').textContent = (user.first_name||'') + ' ' + (user.last_name||'');
    document.getElementById('user-email-display').textContent = user.email || '';
  } else {
    document.getElementById('logged-in-details').style.display = 'none';
    document.getElementById('guest-notice').style.display = 'block';
  }
  goStep(3);
}

function proceedToStep4() {
  var token = getToken();
  if (!token) { showToast('Please log in to book an appointment','error'); window.location.href='/login?redirect=/book/${id}'; return; }
  // Populate recap
  if (selectedService) {
    document.getElementById('recap-service').textContent = selectedService.name;
    document.getElementById('recap-date').textContent = selectedDateDisplay || selectedDate || '—';
    document.getElementById('recap-time').textContent = selectedTime || '—';
    document.getElementById('recap-total').textContent = 'GHS ' + (selectedService.priceGhs + 3);
  }
  goStep(4);
}

// ── Payment options ──
function selectPayWhen(el, when) {
  document.querySelectorAll('#pay-now-wrap,#pay-later-wrap').forEach(function(e){ e.classList.remove('selected'); });
  el.classList.add('selected');
  payWhen = when;
  document.getElementById('payment-methods').style.display = when==='now' ? 'flex' : 'none';
  document.getElementById('payment-methods').style.flexDirection = 'column';
  document.getElementById('momo-input').style.display = when==='now' ? 'block' : 'none';
}

function selectPayMethod(el, method) {
  var step4 = document.getElementById('step4');
  step4.querySelectorAll('.pay-method').forEach(function(e){
    if(e.id!=='pay-now-wrap' && e.id!=='pay-later-wrap'){
      e.classList.remove('selected');
      var r=e.querySelector('.pay-radio'); if(r) r.innerHTML='';
    }
  });
  el.classList.add('selected');
  var r=el.querySelector('.pay-radio');
  if(r) r.innerHTML='<svg width="8" height="8" viewBox="0 0 24 24" fill="var(--g-main)" stroke="none"><circle cx="12" cy="12" r="8"/></svg>';
  document.getElementById('momo-input').style.display = (method==='card') ? 'none' : 'block';
}

// ── Confirm booking ──
function confirmBooking() {
  var token = getToken();
  if (!token) { showToast('Please log in to book','error'); window.location.href='/login?redirect=/book/${id}'; return; }
  if (!selectedService || !selectedService.id) { showToast('Please select a service','error'); goStep(1); return; }
  if (!selectedDate) { showToast('Please select a date','error'); goStep(2); return; }
  if (!selectedTime) { showToast('Please select a time','error'); goStep(2); return; }

  var btn = document.getElementById('confirm-btn');
  var txt = document.getElementById('confirm-text');
  var load = document.getElementById('confirm-loader');
  btn.disabled = true; txt.style.display = 'none'; load.style.display = 'inline-flex';

  axios.post('/api/bookings', {
    provider_id: window._providerId,
    service_id: selectedService.id,
    booking_date: selectedDate,
    booking_time: selectedTime,
    notes: document.getElementById('b-notes') ? document.getElementById('b-notes').value.trim() : ''
  }, { headers: { Authorization: 'Bearer ' + token } })
  .then(function(res) {
    _bookingId = res.data.booking_id;
    // Immediately initialize Paystack and redirect
    txt.textContent = 'Redirecting to payment...';
    return axios.post('/api/payments/initialize', { booking_id: _bookingId }, { headers: { Authorization: 'Bearer ' + token } });
  })
  .then(function(payRes) {
    if (payRes.data.authorization_url) {
      window.location.href = payRes.data.authorization_url;
    } else {
      showToast('Could not start payment. Try from your dashboard.', 'error');
      btn.disabled = false; txt.style.display = ''; txt.textContent = 'Confirm & Book'; load.style.display = 'none';
    }
  })
  .catch(function(err) {
    var msg = (err.response && err.response.data && err.response.data.error) || 'Booking failed. Please try again.';
    showToast(msg, 'error');
    btn.disabled = false; txt.style.display = ''; txt.textContent = 'Confirm & Book'; load.style.display = 'none';
  });
}

function showPaymentModal() {
  var modal = document.getElementById('payment-modal');
  document.getElementById('pm-service').textContent = selectedService ? selectedService.name : '';
  document.getElementById('pm-total').textContent = selectedService ? 'GHS ' + (selectedService.priceGhs + 3) : '';
  document.getElementById('pm-provider').textContent = _providerName;
  document.getElementById('pm-ref').textContent = _bookingRef;
  modal.style.display = 'flex';
}

function closePaymentModal() {
  document.getElementById('payment-modal').style.display = 'none';
}

function payWithMomo() {
  var num = document.getElementById('pm-momo-num').value.trim();
  if (!num || num.replace(/\\D/g,'').length < 9) {
    showToast('Please enter a valid MoMo number','error'); return;
  }
  var btn = document.getElementById('pm-momo-btn');
  btn.disabled = true; btn.textContent = 'Processing...';
  setTimeout(function() {
    closePaymentModal();
    showReceipt('momo', '+233 ' + num);
  }, 1800);
}

function payWithCash() {
  closePaymentModal();
  showReceipt('cash', '');
}

function showReceipt(method, momoNum) {
  var token = getToken();
  if (token && _bookingId && method === 'momo') {
    axios.post('/api/payments/mock-success', { booking_id: _bookingId }, { headers: { Authorization: 'Bearer ' + token } }).catch(function(){});
  }
  var svcName = selectedService ? selectedService.name : 'Service';
  var totalGhs = selectedService ? selectedService.priceGhs + 3 : 3;
  var now = new Date();
  var dateStr = now.toLocaleDateString('en-GH', { day:'numeric', month:'long', year:'numeric' });
  var timeStr = now.toLocaleTimeString('en-GH', { hour:'2-digit', minute:'2-digit' });
  document.getElementById('rc-ref').textContent = _bookingRef;
  document.getElementById('rc-provider').textContent = _providerName;
  document.getElementById('rc-service').textContent = svcName;
  document.getElementById('rc-datetime').textContent = (selectedDateDisplay || selectedDate || '—') + ' · ' + (selectedTime || '—');
  document.getElementById('rc-total').textContent = 'GHS ' + totalGhs;
  document.getElementById('rc-issued').textContent = dateStr + ' at ' + timeStr;
  document.getElementById('rc-status').textContent = method === 'momo' ? '✓ PAID' : '⏳ Pay on arrival';
  document.getElementById('rc-status').style.color = method === 'momo' ? '#00C853' : '#C9A84C';
  document.getElementById('receipt-modal').style.display = 'flex';
}

// ── Load provider & services ──
(function(){
  var id = window._providerId;
  var params = new URLSearchParams(window.location.search);
  var preSelectServiceId = params.get('service');

  axios.get('/api/providers/' + id)
    .then(function(res) {
      var p = res.data.provider;
      var services = res.data.services || [];

      if (!p) {
        document.getElementById('loading-services').style.display = 'none';
        document.getElementById('error-services').style.display = 'block';
        document.getElementById('error-msg').textContent = 'Provider not found.';
        return;
      }

      _providerName = p.business_name || 'Provider';

      // Update header back link
      var backLabel = document.getElementById('back-link-label');
      if (backLabel) backLabel.textContent = 'Back to ' + _providerName;

      // Update summary sidebar
      var sumName = document.getElementById('sum-provider-name');
      if (sumName) sumName.textContent = _providerName;
      var sumLoc = document.getElementById('sum-provider-loc');
      if (sumLoc) sumLoc.textContent = (p.city || 'Accra') + (p.address ? ', ' + p.address : '');

      // Check if provider accepting bookings
      if (!p.is_accepting_bookings) {
        document.getElementById('loading-services').style.display = 'none';
        document.getElementById('error-services').style.display = 'block';
        document.getElementById('error-msg').textContent = _providerName + ' is not accepting bookings at the moment.';
        return;
      }

      // Hide loading, show step 1
      document.getElementById('loading-services').style.display = 'none';

      if (!services.length) {
        document.getElementById('error-services').style.display = 'block';
        document.getElementById('error-msg').textContent = _providerName + ' has not listed any services yet.';
        return;
      }

      // Render services list
      var svcContainer = document.getElementById('services-select');
      svcContainer.innerHTML = services.map(function(s, idx) {
        var priceGhs = Math.round((s.price || 0) / 100);
        var durMins = s.duration_minutes || 60;
        var durStr = durMins >= 60 ? (Math.floor(durMins/60)) + ' hr' + (durMins>=120?'s':'') + (durMins%60>0?' '+durMins%60+'m':'') : durMins + ' min';
        var isFirst = !preSelectServiceId && idx === 0;
        var isPreSelected = preSelectServiceId && String(s.id) === String(preSelectServiceId);
        return '<div class="service-select-item' + (isFirst||isPreSelected?' selected':'') + '" data-id="' + s.id + '" data-name="' + s.name + '" data-price="' + s.price + '" data-duration="' + durMins + '" onclick="selectSvc(this)">' +
          '<div style="width:44px;height:44px;border-radius:14px;background:var(--g-dim);border:1px solid var(--g-border);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">✦</div>' +
          '<div style="flex:1;">' +
            '<div style="display:flex;align-items:center;gap:9px;margin-bottom:4px;">' +
              '<span style="font-size:14px;font-weight:600;">' + s.name + '</span>' +
              (idx===0?'<span class="badge badge-gold" style="font-size:9px;">Popular</span>':'') +
            '</div>' +
            '<div style="font-size:12px;color:var(--t-muted);">' +
              (s.description ? s.description + ' · ' : '') + '⏱ ' + durStr +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="font-display gold-gradient" style="font-size:20px;">GHS ' + priceGhs + '</span>' +
          '</div>' +
        '</div>';
      }).join('');

      // Show step 1
      var step1 = document.getElementById('step1');
      step1.style.display = 'block';
      step1.classList.add('active');

      // Auto-select service
      var toClick = null;
      if (preSelectServiceId) {
        toClick = svcContainer.querySelector('[data-id="' + preSelectServiceId + '"]');
      }
      if (!toClick) toClick = svcContainer.querySelector('.service-select-item');
      if (toClick) toClick.click();

      // Auto-select today in calendar
      var todayEl = document.querySelector('.cal-day.today');
      if (todayEl) todayEl.click();
    })
    .catch(function(e) {
      console.error('Provider load error', e);
      document.getElementById('loading-services').style.display = 'none';
      document.getElementById('error-services').style.display = 'block';
    });
})();
</script>
</body></html>`
