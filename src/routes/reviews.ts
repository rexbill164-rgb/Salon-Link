import { Hono } from 'hono'
const reviews = new Hono()
const store: any[] = [
  { id: 1, providerId: 1, customerId: 1, customerName: 'Akosua M.', rating: 5, text: 'Absolutely love my locs! Maame is so skilled.', service: 'Loc Retwist', createdAt: new Date(Date.now()-86400000*2).toISOString() },
  { id: 2, providerId: 1, customerId: 2, customerName: 'Efua T.', rating: 5, text: 'Box braids came out perfect!', service: 'Box Braids', createdAt: new Date(Date.now()-86400000*7).toISOString() },
]
let nid = 3
reviews.get('/provider/:id', (c) => c.json(store.filter(r => r.providerId === parseInt(c.req.param('id')))))
reviews.post('/', async (c) => {
  const body = await c.req.json()
  const r = { id: nid++, ...body, createdAt: new Date().toISOString() }
  store.push(r)
  return c.json(r, 201)
})
export default reviews
