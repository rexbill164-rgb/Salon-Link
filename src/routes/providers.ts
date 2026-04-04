import { Hono } from 'hono'

const providers = new Hono()

const providerData = [
  { id: 1, name: 'Glam Studio GH', type: 'Hair Salon', rating: 4.9, reviews: 128, price: 80, location: 'East Legon, Accra', distance: 1.2, verified: true, emoji: '💇‍♀️', tags: ['Braiding', 'Natural Hair', 'Locs'], open: true, phone: '+233201234567', email: 'glam@demo.com', about: 'Premier hair salon in East Legon specializing in natural hair.', workingHours: 'Mon–Sat: 8am–7pm', lat: 5.6037, lng: -0.1870, services: [{name:'Natural Twist',price:80,duration:'2-3hrs'},{name:'Box Braids',price:150,duration:'4-5hrs'},{name:'Loc Retwist',price:60,duration:'1-2hrs'},{name:'Silk Press',price:100,duration:'2hrs'}] },
  { id: 2, name: 'KutzByKofi', type: 'Barbershop', rating: 4.8, reviews: 96, price: 40, location: 'Osu, Accra', distance: 2.1, verified: true, emoji: '✂️', tags: ['Fade', 'Lineup', 'Dreads'], open: true, phone: '+233209876543', email: 'kutz@demo.com', about: 'Top barbershop in Osu. Clean cuts, fresh fades.', workingHours: 'Mon–Sun: 7am–8pm', lat: 5.5560, lng: -0.1969, services: [{name:'Fade Cut',price:40,duration:'45min'},{name:'Lineup',price:20,duration:'20min'},{name:'Dreads Retwist',price:80,duration:'2hrs'}] },
  { id: 3, name: 'Nails by Abena', type: 'Nail Tech', rating: 5.0, reviews: 64, price: 60, location: 'Airport Area, Accra', distance: 3.4, verified: true, emoji: '💅', tags: ['Gel', 'Acrylics', 'Nail Art'], open: false, phone: '+233203456789', email: 'nails@demo.com', about: 'Nail technician with 6+ years experience.', workingHours: 'Tue–Sat: 9am–6pm', lat: 5.6052, lng: -0.1718, services: [{name:'Gel Manicure',price:60,duration:'1hr'},{name:'Acrylic Set',price:90,duration:'1.5hrs'},{name:'Nail Art',price:80,duration:'1hr'}] },
  { id: 4, name: 'Relax & Revive', type: 'Massage', rating: 4.7, reviews: 52, price: 120, location: 'Cantonments, Accra', distance: 4.2, verified: true, emoji: '💆', tags: ['Swedish', 'Deep Tissue'], open: true, phone: '+233204567890', email: 'relax@demo.com', about: 'Professional massage therapy in a relaxing setting.', workingHours: 'Mon–Sat: 9am–7pm', lat: 5.5760, lng: -0.1944, services: [{name:'Swedish Massage',price:120,duration:'1hr'},{name:'Deep Tissue',price:150,duration:'1hr'},{name:'Hot Stone',price:180,duration:'90min'}] },
  { id: 5, name: 'Faces by Ama', type: 'Makeup Artist', rating: 4.8, reviews: 87, price: 150, location: 'Labone, Accra', distance: 5.1, verified: true, emoji: '💄', tags: ['Bridal', 'Evening', 'Natural'], open: true, phone: '+233205678901', email: 'faces@demo.com', about: 'Award-winning makeup artist for all occasions.', workingHours: 'By appointment', lat: 5.5614, lng: -0.1782, services: [{name:'Bridal Makeup',price:300,duration:'2hrs'},{name:'Evening Glam',price:150,duration:'1.5hrs'},{name:'Natural Beat',price:100,duration:'1hr'}] },
]

providers.get('/', (c) => {
  const { service, sort, lat, lng, maxDist, minRating } = c.req.query()
  let data = [...providerData]
  if (service) data = data.filter(p => p.type.toLowerCase().includes(service.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(service.toLowerCase())))
  if (minRating) data = data.filter(p => p.rating >= parseFloat(minRating))
  if (sort === 'rating') data.sort((a, b) => b.rating - a.rating)
  else if (sort === 'price_asc') data.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') data.sort((a, b) => b.price - a.price)
  else if (sort === 'distance') data.sort((a, b) => a.distance - b.distance)
  return c.json(data)
})

providers.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const p = providerData.find(p => p.id === id)
  if (!p) return c.json({ error: 'Provider not found' }, 404)
  return c.json(p)
})

providers.post('/:id/favourite', (c) => c.json({ message: 'Added to favourites' }))

providers.get('/:id/availability', (c) => {
  const slots = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
  const booked = ['10:00 AM','2:00 PM']
  return c.json({ available: slots.filter(s => !booked.includes(s)), booked })
})

export default providers
