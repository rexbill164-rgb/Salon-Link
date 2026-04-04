import { Hono } from 'hono'
const uploads = new Hono()
uploads.post('/hairstyle', async (c) => {
  return c.json({ message: 'Photo uploaded successfully', url: 'https://via.placeholder.com/400x400/7C3AED/ffffff?text=Hairstyle', id: 'img_' + Date.now() })
})
uploads.post('/kyc', async (c) => {
  return c.json({ message: 'KYC documents uploaded', status: 'pending', verificationId: 'KYC_' + Date.now() })
})
uploads.post('/portfolio', async (c) => {
  return c.json({ message: 'Portfolio image uploaded', url: 'https://via.placeholder.com/400x400/EC4899/ffffff?text=Portfolio', id: 'img_' + Date.now() })
})
export default uploads
