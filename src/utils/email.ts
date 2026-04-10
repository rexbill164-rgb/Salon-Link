// SalonLink Email Utility — sends via Resend (free 3000/mo) or SendGrid
// Set RESEND_API_KEY or SENDGRID_KEY in Cloudflare Pages secrets

export async function sendEmail(env: any, to: string, subject: string, html: string) {
  const resendKey = env.RESEND_API_KEY
  const sendgridKey = env.SENDGRID_KEY
  const fromEmail = 'noreply@salonlink.it.com'
  const fromName = 'SalonLink'

  try {
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `${fromName} <${fromEmail}>`, to: [to], subject, html })
      })
      return res.ok
    }
    if (sendgridKey) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sendgridKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail, name: fromName },
          subject,
          content: [{ type: 'text/html', value: html }]
        })
      })
      return res.ok
    }
  } catch (_) {}
  return false // no key configured — emails silently skip
}

// ── Email Templates ──────────────────────────────────────────────

const base = (content: string) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0d0d1a;margin:0;padding:20px;}
  .wrap{max-width:560px;margin:0 auto;background:#12122a;border-radius:16px;overflow:hidden;border:1px solid rgba(201,168,76,0.15);}
  .hdr{background:linear-gradient(135deg,#c9a84c,#e07048);padding:28px 32px;text-align:center;}
  .hdr h1{margin:0;color:#fff;font-size:22px;letter-spacing:0.03em;}
  .hdr p{margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;}
  .body{padding:28px 32px;color:#e0e0e0;}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px 20px;margin:16px 0;}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .row:last-child{border-bottom:none;}
  .lbl{color:#888;font-size:12px;}
  .val{color:#fff;font-size:13px;font-weight:600;text-align:right;}
  .amt{color:#c9a84c;font-size:18px;font-weight:700;}
  .btn{display:inline-block;background:linear-gradient(135deg,#c9a84c,#e07048);color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-weight:700;font-size:14px;margin:16px 0;}
  .ftr{padding:20px 32px;text-align:center;color:#555;font-size:11px;border-top:1px solid rgba(255,255,255,0.05);}
  .badge{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;}
  .badge-gold{background:rgba(201,168,76,0.15);color:#c9a84c;border:1px solid rgba(201,168,76,0.3);}
  .badge-green{background:rgba(0,200,83,0.12);color:#00c853;border:1px solid rgba(0,200,83,0.25);}
</style></head><body>
<div class="wrap">${content}</div>
</body></html>`

export function bookingConfirmEmail(opts: {
  customerName: string, providerName: string, serviceName: string,
  date: string, time: string, totalGhs: number, bookingId: number | string, paymentMethod?: string
}) {
  const isPaid = opts.paymentMethod === 'momo'
  return base(`
  <div class="hdr">
    <h1>✅ Booking Confirmed!</h1>
    <p>Your appointment is booked, ${opts.customerName.split(' ')[0]}.</p>
  </div>
  <div class="body">
    <div class="card">
      <div class="row"><span class="lbl">Reference</span><span class="val">#SL${String(opts.bookingId).padStart(4,'0')}</span></div>
      <div class="row"><span class="lbl">Provider</span><span class="val">${opts.providerName}</span></div>
      <div class="row"><span class="lbl">Service</span><span class="val">${opts.serviceName}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${opts.date}</span></div>
      <div class="row"><span class="lbl">Time</span><span class="val">${opts.time}</span></div>
      <div class="row"><span class="lbl">Total</span><span class="val amt">GHS ${opts.totalGhs.toFixed(2)}</span></div>
      <div class="row"><span class="lbl">Payment</span><span class="val"><span class="badge ${isPaid?'badge-green':'badge-gold'}">${isPaid?'✓ Paid via MoMo':'Cash on Arrival'}</span></span></div>
    </div>
    ${!isPaid ? `<p style="font-size:12px;color:#888;">Please have cash ready when you arrive at your appointment.</p>` : ''}
    <center><a href="https://project-ba6e9ce4.pages.dev/dashboard" class="btn">View My Bookings →</a></center>
  </div>
  <div class="ftr">SalonLink · Ghana's Beauty Booking Platform · <a href="https://project-ba6e9ce4.pages.dev" style="color:#c9a84c;">salonlink</a></div>
  `)
}

export function bookingReminderEmail(opts: {
  customerName: string, providerName: string, serviceName: string,
  date: string, time: string, address: string
}) {
  return base(`
  <div class="hdr">
    <h1>⏰ Appointment Tomorrow!</h1>
    <p>Don't forget your booking, ${opts.customerName.split(' ')[0]}.</p>
  </div>
  <div class="body">
    <div class="card">
      <div class="row"><span class="lbl">Provider</span><span class="val">${opts.providerName}</span></div>
      <div class="row"><span class="lbl">Service</span><span class="val">${opts.serviceName}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${opts.date}</span></div>
      <div class="row"><span class="lbl">Time</span><span class="val">${opts.time}</span></div>
      ${opts.address ? `<div class="row"><span class="lbl">Location</span><span class="val">${opts.address}</span></div>` : ''}
    </div>
    <center><a href="https://project-ba6e9ce4.pages.dev/dashboard" class="btn">View My Bookings →</a></center>
  </div>
  <div class="ftr">SalonLink · Ghana's Beauty Booking Platform</div>
  `)
}

export function providerNewBookingEmail(opts: {
  providerName: string, customerName: string, serviceName: string,
  date: string, time: string, totalGhs: number, bookingId: number | string
}) {
  return base(`
  <div class="hdr">
    <h1>🎉 New Booking!</h1>
    <p>You have a new appointment, ${opts.providerName}.</p>
  </div>
  <div class="body">
    <div class="card">
      <div class="row"><span class="lbl">Booking #</span><span class="val">#SL${String(opts.bookingId).padStart(4,'0')}</span></div>
      <div class="row"><span class="lbl">Customer</span><span class="val">${opts.customerName}</span></div>
      <div class="row"><span class="lbl">Service</span><span class="val">${opts.serviceName}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${opts.date}</span></div>
      <div class="row"><span class="lbl">Time</span><span class="val">${opts.time}</span></div>
      <div class="row"><span class="lbl">Your Earnings</span><span class="val amt">GHS ${Math.max(0, opts.totalGhs - 3).toFixed(2)}</span></div>
      <div class="row"><span class="lbl">Platform Fee</span><span class="val" style="color:#888;">GHS 3.00 (due after service)</span></div>
    </div>
    <p style="font-size:12px;color:#888;line-height:1.6;">After completing this service, please send the <strong style="color:#c9a84c;">GHS 3.00 platform fee</strong> to:<br>
    <strong style="color:#fff;">Nadia Yartey · MTN MoMo · 0533 675 960</strong></p>
    <center><a href="https://project-ba6e9ce4.pages.dev/provider/dashboard" class="btn">Go to Dashboard →</a></center>
  </div>
  <div class="ftr">SalonLink · Ghana's Beauty Booking Platform</div>
  `)
}

export function paymentReceiptEmail(opts: {
  customerName: string, providerName: string, serviceName: string,
  date: string, time: string, totalGhs: number, bookingId: number | string,
  paymentMethod: string, reference: string, isCash?: boolean
}) {
  const isCash = opts.isCash || opts.paymentMethod === 'cash'
  const method = isCash ? 'Pay On-Site (Cash)' : opts.paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Card'
  const status = isCash ? '⏳ Pay on Arrival' : '✓ Paid'
  const statusClass = isCash ? 'badge-gold' : 'badge-green'
  const cashNotice = isCash ? `
    <div style="background:#FFF8E6;border:1.5px solid #C9A84C;border-radius:12px;padding:16px;margin:16px 0;">
      <div style="font-weight:700;color:#C9A84C;margin-bottom:6px;">💳 Platform Fee Reminder</div>
      <div style="color:#555;font-size:13px;">After your appointment, your provider will send the <strong>GHS 3.00</strong> platform fee to:</div>
      <div style="font-size:16px;font-weight:800;color:#E1306C;margin-top:6px;letter-spacing:0.05em;">0533 675 960</div>
      <div style="font-size:12px;color:#777;">Nadia Yartey · MTN MoMo</div>
    </div>` : ''
  return base(`
  <div class="hdr">
    <h1>${isCash ? '✅ Booking Confirmed!' : '🧾 Payment Receipt'}</h1>
    <p>${isCash ? 'Your booking is confirmed. Remember to pay on arrival.' : 'Thank you for your payment, ' + opts.customerName.split(' ')[0] + '!'}</p>
  </div>
  <div class="body">
    <div class="card">
      <div class="row"><span class="lbl">Reference #</span><span class="val">${opts.reference}</span></div>
      <div class="row"><span class="lbl">Provider</span><span class="val">${opts.providerName}</span></div>
      <div class="row"><span class="lbl">Service</span><span class="val">${opts.serviceName}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${opts.date}</span></div>
      <div class="row"><span class="lbl">Time</span><span class="val">${opts.time}</span></div>
      <div class="row"><span class="lbl">Payment Method</span><span class="val">${method}</span></div>
      <div class="row"><span class="lbl">Total</span><span class="val amt">GHS ${opts.totalGhs.toFixed(2)}</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val"><span class="badge ${statusClass}">${status}</span></span></div>
    </div>
    ${cashNotice}
    <center><a href="https://project-ba6e9ce4.pages.dev/dashboard" class="btn">View My Bookings →</a></center>
  </div>
  <div class="ftr">SalonLink · Ghana's Beauty Booking Platform · Keep this email for your records.</div>
  `)
}
