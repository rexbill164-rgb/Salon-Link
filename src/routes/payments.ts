import { Hono } from 'hono'

const payments = new Hono()

payments.post('/initialize', async (c) => {
  try {
    const { email, amount, bookingId, callbackUrl } = await c.req.json()
    // In production: call Paystack API here
    // const res = await fetch('https://api.paystack.co/transaction/initialize', { method:'POST', headers:{'Authorization':'Bearer '+PAYSTACK_SECRET,'Content-Type':'application/json'}, body: JSON.stringify({email, amount: amount*100, reference: bookingId, callback_url: callbackUrl}) })
    const demoRef = 'SL_PAY_' + Date.now()
    return c.json({
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: 'https://checkout.paystack.com/demo_' + demoRef,
        access_code: demoRef,
        reference: demoRef
      }
    })
  } catch (e) {
    return c.json({ error: 'Payment init failed' }, 500)
  }
})

payments.post('/verify', async (c) => {
  try {
    const { reference } = await c.req.json()
    // In production: verify with Paystack
    return c.json({ status: true, message: 'Verification successful', data: { status: 'success', reference, amount: 8200, currency: 'GHS' } })
  } catch (e) {
    return c.json({ error: 'Verification failed' }, 500)
  }
})

payments.get('/history', (c) => {
  return c.json([
    { id: 'PAY-001', bookingId: 'SL-10001', amount: 82, method: 'MTN MoMo', status: 'success', date: new Date().toISOString() },
    { id: 'PAY-002', bookingId: 'SL-10003', amount: 62, method: 'Visa Card', status: 'success', date: new Date(Date.now()-86400000*5).toISOString() },
  ])
})

export default payments
