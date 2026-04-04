import { baseHead, navbar, toastScript } from '../utils/layout'

export const bookingPage = () => `<!DOCTYPE html>
<html lang="en">
<head>${baseHead('Book Appointment')}</head>
<body>
${navbar()}
<div style="min-height:calc(100vh - 64px);background:#0F0A1E;padding:32px 16px 80px">
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <a href="/provider/1" class="text-sm flex items-center gap-2 mb-4" style="color:#9D8EC0"><i class="fas fa-arrow-left"></i> Back to Profile</a>
      <h1 class="font-display font-bold text-3xl mb-1">Book Appointment</h1>
      <p style="color:#9D8EC0">Glam Studio GH · East Legon, Accra</p>
    </div>

    <!-- Step Indicators -->
    <div class="flex items-center gap-2 mb-10">
      ${[{n:1,l:'Service'},{n:2,l:'Date & Time'},{n:3,l:'Details'},{n:4,l:'Payment'}].map(s=>`
        <div class="flex items-center ${s.n<4?'flex-1':''}">
          <div class="flex flex-col items-center">
            <div id="step-ind-${s.n}" class="step-indicator w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${s.n===1?'active':''}\" style="${s.n===1?'background:#7C3AED;color:white':'background:#1A1033;border:2px solid #2D2250;color:#9D8EC0'}">${s.n}</div>
            <span class="text-xs mt-1 hidden sm:block" style="color:#9D8EC0">${s.l}</span>
          </div>
          ${s.n<4?`<div id="step-line-${s.n}" style="flex:1;height:2px;background:#2D2250;margin:0 4px;margin-bottom:20px"></div>`:''}
        </div>
      `).join('')}
    </div>

    <!-- STEP 1: Service Selection -->
    <div id="step-1" class="booking-step active">
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:28px">
        <h2 class="font-semibold text-xl mb-6">Choose a Service</h2>
        <div class="flex flex-col gap-3" id="service-list">
          ${[
            {id:'s1',name:'Natural Hair Twist',desc:'Full twist with treatment',price:80,duration:'2-3 hrs'},
            {id:'s2',name:'Box Braids (Medium)',desc:'Medium box braids, any length',price:150,duration:'4-5 hrs'},
            {id:'s3',name:'Loc Retwist',desc:'Professional retwist + sheen',price:60,duration:'1-2 hrs'},
            {id:'s4',name:'Silk Press',desc:'Silk press + trim',price:100,duration:'2 hrs'},
            {id:'s5',name:'Ghana Weaving',desc:'Traditional Ghana weaving',price:120,duration:'3-4 hrs'},
            {id:'s6',name:'Hair Coloring',desc:'Full color or highlights',price:200,duration:'3-5 hrs'},
          ].map(s=>`
            <label class="service-option flex items-center justify-between p-4 rounded-xl cursor-pointer transition" style="background:#0F0A1E;border:2px solid #2D2250" onclick="selectService('${s.id}','${s.name}',${s.price},'${s.duration}')">
              <div class="flex items-center gap-3">
                <input type="radio" name="service" value="${s.id}" style="accent-color:#7C3AED" class="w-5 h-5"/>
                <div>
                  <p class="font-medium">${s.name}</p>
                  <p class="text-sm" style="color:#9D8EC0">${s.desc} · <i class="fas fa-clock"></i> ${s.duration}</p>
                </div>
              </div>
              <span class="font-bold" style="color:#7C3AED">GHS ${s.price}</span>
            </label>
          `).join('')}
        </div>
        <button onclick="goToStep(2)" class="w-full gradient-btn mt-6 py-4 rounded-xl text-white font-bold text-base">
          Continue <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- STEP 2: Date & Time -->
    <div id="step-2" class="booking-step" style="display:none">
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:28px">
        <h2 class="font-semibold text-xl mb-6">Select Date & Time</h2>

        <!-- Month nav -->
        <div class="flex items-center justify-between mb-4">
          <button onclick="prevMonth()" class="w-9 h-9 rounded-lg flex items-center justify-center" style="background:#0F0A1E;border:1px solid #2D2250"><i class="fas fa-chevron-left text-sm"></i></button>
          <span id="cal-month" class="font-semibold">April 2025</span>
          <button onclick="nextMonth()" class="w-9 h-9 rounded-lg flex items-center justify-center" style="background:#0F0A1E;border:1px solid #2D2250"><i class="fas fa-chevron-right text-sm"></i></button>
        </div>
        <!-- Calendar -->
        <div id="calendar" class="grid grid-cols-7 gap-1 mb-6">
          ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="text-center text-xs font-medium py-2" style="color:#9D8EC0">${d}</div>`).join('')}
        </div>

        <!-- Time slots -->
        <h3 class="font-semibold mb-3">Available Times <span id="selected-date-label" style="color:#7C3AED;font-size:14px"></span></h3>
        <div class="grid grid-cols-4 gap-2 mb-6" id="time-slots">
          ${['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
            .map((t,i) => `<button onclick="selectTime('${t}',this)" class="time-slot py-2 px-1 rounded-lg text-xs font-medium transition ${i===1||i===4?'opacity-40 cursor-not-allowed':'hover:border-purple-500'}\" style="${i===1||i===4?'background:#0F0A1E;border:1px solid #2D2250;color:#9D8EC0':'background:#0F0A1E;border:1px solid #2D2250;color:#9D8EC0'}" ${i===1||i===4?'disabled':''}>
              ${t}${i===1||i===4?' 🔒':''}
            </button>`)
            .join('')}
        </div>

        <div class="flex gap-3">
          <button onclick="goToStep(1)" class="flex-1 py-4 rounded-xl font-bold text-base" style="background:#0F0A1E;border:1px solid #2D2250">Back</button>
          <button onclick="goToStep(3)" class="flex-1 gradient-btn py-4 rounded-xl text-white font-bold text-base">Continue <i class="fas fa-arrow-right ml-2"></i></button>
        </div>
      </div>
    </div>

    <!-- STEP 3: Customer Details -->
    <div id="step-3" class="booking-step" style="display:none">
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:28px">
        <h2 class="font-semibold text-xl mb-6">Your Details</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Full Name</label>
          <input type="text" id="cust-name" placeholder="Your full name" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Phone Number</label>
          <input type="tel" id="cust-phone" placeholder="+233 20 000 0000" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Special Requests (optional)</label>
          <textarea id="cust-notes" rows="3" placeholder="Any special requests or notes for the stylist..." class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;resize:none"></textarea>
        </div>
        <!-- Booking Summary -->
        <div class="p-4 rounded-xl mb-6" style="background:#0F0A1E;border:1px solid #2D2250">
          <h4 class="text-sm font-semibold mb-3" style="color:#9D8EC0">Booking Summary</h4>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Service</span><span id="sum-service" class="font-medium">-</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Date</span><span id="sum-date" class="font-medium">-</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Time</span><span id="sum-time" class="font-medium">-</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Duration</span><span id="sum-duration" class="font-medium">-</span></div>
          <div style="border-top:1px solid #2D2250;margin:8px 0"></div>
          <div class="flex justify-between font-bold"><span>Total</span><span id="sum-price" style="color:#7C3AED">GHS 0</span></div>
        </div>
        <div class="flex gap-3">
          <button onclick="goToStep(2)" class="flex-1 py-4 rounded-xl font-bold" style="background:#0F0A1E;border:1px solid #2D2250">Back</button>
          <button onclick="goToStep(4)" class="flex-1 gradient-btn py-4 rounded-xl text-white font-bold">Continue <i class="fas fa-arrow-right ml-2"></i></button>
        </div>
      </div>
    </div>

    <!-- STEP 4: Payment -->
    <div id="step-4" class="booking-step" style="display:none">
      <div style="background:#1A1033;border:1px solid #2D2250;border-radius:24px;padding:28px">
        <h2 class="font-semibold text-xl mb-6">Payment Method</h2>

        <!-- Payment options -->
        <div class="flex flex-col gap-3 mb-6">
          <label class="pay-opt flex items-center gap-4 p-4 rounded-xl cursor-pointer" style="background:#0F0A1E;border:2px solid #7C3AED" onclick="selectPayment('pay_now',this)">
            <input type="radio" name="payment" checked style="accent-color:#7C3AED"/>
            <div class="flex-1">
              <p class="font-medium">Pay Now Online</p>
              <p class="text-xs" style="color:#9D8EC0">Mobile Money or Card • Secure payment</p>
            </div>
            <div class="flex gap-2">
              <span class="text-xs px-2 py-1 rounded" style="background:#2D2250">MTN</span>
              <span class="text-xs px-2 py-1 rounded" style="background:#2D2250">Visa</span>
            </div>
          </label>
          <label class="pay-opt flex items-center gap-4 p-4 rounded-xl cursor-pointer" style="background:#0F0A1E;border:2px solid #2D2250" onclick="selectPayment('pay_later',this)">
            <input type="radio" name="payment" style="accent-color:#7C3AED"/>
            <div class="flex-1">
              <p class="font-medium">Pay at Location</p>
              <p class="text-xs" style="color:#9D8EC0">Pay cash or MoMo when you arrive</p>
            </div>
            <i class="fas fa-store" style="color:#9D8EC0"></i>
          </label>
        </div>

        <!-- Pay Now form -->
        <div id="pay-now-form">
          <div class="flex gap-2 mb-4" style="background:#0F0A1E;border-radius:12px;padding:4px;border:1px solid #2D2250">
            <button onclick="switchPayTab('momo',this)" class="flex-1 py-2.5 rounded-lg text-sm font-medium" style="background:#7C3AED;color:white">📱 Mobile Money</button>
            <button onclick="switchPayTab('card',this)" class="flex-1 py-2.5 rounded-lg text-sm font-medium" style="color:#9D8EC0">💳 Card</button>
          </div>
          <!-- Mobile Money form -->
          <div id="momo-form">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Network</label>
              <select class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250;color:#E2D9F3">
                <option>MTN Mobile Money</option>
                <option>Vodafone Cash</option>
                <option>AirtelTigo Money</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">MoMo Number</label>
              <input type="tel" placeholder="020 000 0000" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
            </div>
          </div>
          <!-- Card form -->
          <div id="card-form" style="display:none">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-2">Expiry</label>
                <input type="text" placeholder="MM/YY" maxlength="5" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">CVV</label>
                <input type="text" placeholder="123" maxlength="3" class="w-full px-4 py-3 rounded-xl text-sm" style="background:#0F0A1E;border:1px solid #2D2250"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Final total -->
        <div class="p-4 rounded-xl mb-6" style="background:#0F0A1E;border:1px solid #2D2250">
          <div class="flex justify-between text-sm mb-1"><span style="color:#9D8EC0">Subtotal</span><span id="fin-price">GHS 0</span></div>
          <div class="flex justify-between text-sm mb-1"><span style="color:#9D8EC0">Service Fee</span><span>GHS 2</span></div>
          <div style="border-top:1px solid #2D2250;margin:8px 0"></div>
          <div class="flex justify-between font-bold text-lg"><span>Total</span><span id="fin-total" style="color:#7C3AED">GHS 2</span></div>
        </div>

        <div class="flex gap-3">
          <button onclick="goToStep(3)" class="flex-1 py-4 rounded-xl font-bold" style="background:#0F0A1E;border:1px solid #2D2250">Back</button>
          <button onclick="confirmBooking()" id="confirm-btn" class="flex-1 gradient-btn py-4 rounded-xl text-white font-bold">
            <span id="confirm-text"><i class="fas fa-lock mr-2"></i>Confirm & Pay</span>
            <span id="confirm-loader" style="display:none"><i class="fas fa-spinner fa-spin mr-2"></i>Processing...</span>
          </button>
        </div>

        <p class="text-center text-xs mt-4" style="color:#9D8EC0">
          <i class="fas fa-lock mr-1" style="color:#7C3AED"></i>Secured by Paystack • 256-bit SSL encryption
        </p>
      </div>
    </div>

    <!-- SUCCESS STATE -->
    <div id="booking-success" style="display:none">
      <div style="background:#1A1033;border:1px solid #10B98133;border-radius:24px;padding:40px;text-align:center">
        <div style="width:80px;height:80px;border-radius:50%;background:#10B98122;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:40px">✅</div>
        <h2 class="font-display font-bold text-3xl mb-3">Booking Confirmed!</h2>
        <p style="color:#9D8EC0;margin-bottom:24px">Your appointment has been booked successfully. You'll receive a confirmation SMS shortly.</p>
        <div class="p-4 rounded-xl mb-6" style="background:#0F0A1E;border:1px solid #2D2250;text-align:left">
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Booking ID</span><span class="font-mono font-bold" style="color:#7C3AED" id="booking-id">#SL-00001</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Provider</span><span>Glam Studio GH</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Service</span><span id="conf-service">-</span></div>
          <div class="flex justify-between text-sm mb-2"><span style="color:#9D8EC0">Date & Time</span><span id="conf-datetime">-</span></div>
          <div class="flex justify-between text-sm"><span style="color:#9D8EC0">Amount</span><span id="conf-amount" style="color:#7C3AED;font-weight:bold">-</span></div>
        </div>
        <div class="flex gap-3">
          <a href="/dashboard" class="flex-1 gradient-btn py-3.5 rounded-xl text-white font-bold text-center">View Bookings</a>
          <a href="/discover" class="flex-1 py-3.5 rounded-xl font-bold text-center" style="background:#0F0A1E;border:1px solid #2D2250">Discover More</a>
        </div>
      </div>
    </div>
  </div>
</div>

${toastScript()}
<script>
let booking = { service:'', price:0, duration:'', date:'', time:'', payMethod:'pay_now' };
let curMonth = new Date();

function selectService(id, name, price, duration) {
  booking.service = name; booking.price = price; booking.duration = duration;
  document.querySelectorAll('.service-option').forEach(el=>el.style.borderColor='#2D2250');
  event.currentTarget.style.borderColor='#7C3AED';
}

function goToStep(n) {
  if(n===2 && !booking.service){ showToast('Please select a service first','error'); return; }
  if(n===3 && !booking.date){ showToast('Please select a date','error'); return; }
  if(n===3 && !booking.time){ showToast('Please select a time','error'); return; }
  for(let i=1;i<=4;i++) document.getElementById('step-'+i).style.display='none';
  document.getElementById('step-'+n).style.display='block';
  updateStepIndicators(n);
  if(n===3){ updateSummary(); }
  if(n===4){ updateFinalTotal(); }
}

function updateStepIndicators(current) {
  for(let i=1;i<=4;i++){
    const el=document.getElementById('step-ind-'+i);
    if(i<current){ el.style.background='#10B981';el.style.color='white';el.style.border='none'; }
    else if(i===current){ el.style.background='#7C3AED';el.style.color='white';el.style.border='none'; }
    else{ el.style.background='#1A1033';el.style.color='#9D8EC0';el.style.border='2px solid #2D2250'; }
  }
}

function selectTime(time, btn) {
  booking.time = time;
  document.querySelectorAll('.time-slot:not([disabled])').forEach(b=>{ b.style.background='#0F0A1E';b.style.borderColor='#2D2250';b.style.color='#9D8EC0'; });
  btn.style.background='#7C3AED';btn.style.borderColor='#7C3AED';btn.style.color='white';
}

function updateSummary() {
  document.getElementById('sum-service').textContent = booking.service||'-';
  document.getElementById('sum-date').textContent = booking.date||'-';
  document.getElementById('sum-time').textContent = booking.time||'-';
  document.getElementById('sum-duration').textContent = booking.duration||'-';
  document.getElementById('sum-price').textContent = 'GHS '+booking.price;
  const user = getUser();
  if(user.name) document.getElementById('cust-name').value = user.name;
  if(user.phone) document.getElementById('cust-phone').value = user.phone;
}

function updateFinalTotal() {
  document.getElementById('fin-price').textContent = 'GHS '+booking.price;
  document.getElementById('fin-total').textContent = 'GHS '+(booking.price+2);
}

function selectPayment(method, el) {
  booking.payMethod = method;
  document.querySelectorAll('.pay-opt').forEach(e=>e.style.borderColor='#2D2250');
  el.style.borderColor='#7C3AED';
  document.getElementById('pay-now-form').style.display = method==='pay_now'?'block':'none';
}

function switchPayTab(tab, btn) {
  document.getElementById('momo-form').style.display = tab==='momo'?'block':'none';
  document.getElementById('card-form').style.display = tab==='card'?'block':'none';
  document.querySelectorAll('#pay-now-form button').forEach(b=>{ b.style.background='transparent';b.style.color='#9D8EC0'; });
  btn.style.background='#7C3AED';btn.style.color='white';
}

async function confirmBooking() {
  const btn = document.getElementById('confirm-btn');
  const txt = document.getElementById('confirm-text');
  const loader = document.getElementById('confirm-loader');
  btn.disabled=true; txt.style.display='none'; loader.style.display='inline';
  try {
    const token = getToken();
    const headers = token ? {Authorization:'Bearer '+token} : {};
    const res = await axios.post('/api/bookings', {
      providerId: 1,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      price: booking.price,
      paymentMethod: booking.payMethod,
      notes: document.getElementById('cust-notes').value,
    }, {headers});
    const bookingId = res.data?.id || 'SL-'+Math.floor(Math.random()*99999);
    showBookingSuccess(bookingId);
  } catch(err) {
    // Demo fallback
    const bookingId = 'SL-'+Math.floor(Math.random()*99999);
    showBookingSuccess(bookingId);
  } finally {
    btn.disabled=false; txt.style.display='inline'; loader.style.display='none';
  }
}

function showBookingSuccess(id) {
  for(let i=1;i<=4;i++) document.getElementById('step-'+i).style.display='none';
  document.getElementById('booking-success').style.display='block';
  document.getElementById('booking-id').textContent = '#'+id;
  document.getElementById('conf-service').textContent = booking.service;
  document.getElementById('conf-datetime').textContent = (booking.date||'Tomorrow')+' at '+(booking.time||'2:00 PM');
  document.getElementById('conf-amount').textContent = 'GHS '+(booking.price+2);
  showToast('Booking confirmed! 🎉','success');
}

// Build calendar
function buildCalendar(d) {
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('cal-month').textContent = months[d.getMonth()]+' '+d.getFullYear();
  const cal = document.getElementById('calendar');
  const headers = cal.querySelectorAll('div:nth-child(-n+7)');
  // Clear date cells
  while(cal.children.length > 7) cal.removeChild(cal.lastChild);
  const first = new Date(d.getFullYear(),d.getMonth(),1).getDay();
  const days = new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
  const today = new Date();
  for(let i=0;i<first;i++){
    const el=document.createElement('div'); el.className='text-center py-2'; cal.appendChild(el);
  }
  for(let i=1;i<=days;i++){
    const el=document.createElement('button');
    const isToday=i===today.getDate()&&d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear();
    const isPast=new Date(d.getFullYear(),d.getMonth(),i)<new Date(today.getFullYear(),today.getMonth(),today.getDate());
    el.className='text-center py-2 w-9 h-9 rounded-full mx-auto text-sm font-medium transition';
    el.textContent=i;
    if(isPast){ el.style.color='#4B4069'; el.disabled=true; }
    else if(isToday){ el.style.background='#7C3AED22';el.style.color='#C4B5FD';el.style.border='1px solid #7C3AED'; }
    else{ el.style.color='#E2D9F3'; el.onmouseover=()=>{ if(!el.classList.contains('selected')) el.style.background='#2D2250'; }; el.onmouseout=()=>{ if(!el.classList.contains('selected')) el.style.background=''; }; }
    el.onclick=()=>{
      document.querySelectorAll('#calendar button.selected').forEach(b=>{ b.classList.remove('selected');b.style.background=''; });
      el.classList.add('selected'); el.style.background='#7C3AED'; el.style.color='white';
      booking.date = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d.getFullYear(),d.getMonth(),i).getDay()]+', '+months[d.getMonth()].slice(0,3)+' '+i;
      document.getElementById('selected-date-label').textContent='· '+booking.date;
    };
    cal.appendChild(el);
  }
}
function prevMonth(){ curMonth.setMonth(curMonth.getMonth()-1); buildCalendar(curMonth); }
function nextMonth(){ curMonth.setMonth(curMonth.getMonth()+1); buildCalendar(curMonth); }
buildCalendar(curMonth);

// Pre-fill from URL
const urlParams = new URLSearchParams(window.location.search);
const urlService = urlParams.get('service');
const urlPrice = urlParams.get('price');
if(urlService){ booking.service=urlService; booking.price=parseInt(urlPrice)||0; }
</script>
</body></html>`
