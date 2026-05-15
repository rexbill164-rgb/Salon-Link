import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = { DB: D1Database; JWT_SECRET?: string }

const messages = new Hono<{ Bindings: Bindings }>()

function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}

async function getUser(c: any) {
  try {
    const auth = c.req.header('Authorization')
    if (!auth?.startsWith('Bearer ')) return null
    return await verify(auth.split(' ')[1], getJwtSecret(c), 'HS256') as any
  } catch { return null }
}

function userId(user: any): number { return Number(user?.sub || user?.id || 0) }

function messagesSchemaError(error: any): boolean {
  const message = String(error?.message || error || '').toLowerCase()
  return message.includes('no such table: messages') || message.includes('no column named') || message.includes('no such column') || message.includes('not null constraint failed')
}

async function getMessageColumns(c: any): Promise<string[]> {
  const columns = await c.env.DB.prepare('PRAGMA table_info(messages)').all()
  return (columns.results || []).map((col: any) => String(col.name))
}

async function addColumnIfMissing(c: any, columnName: string, columnSql: string) {
  const columns = await getMessageColumns(c)
  if (!columns.some((name) => name.toLowerCase() === columnName.toLowerCase())) {
    await c.env.DB.prepare(`ALTER TABLE messages ADD COLUMN ${columnSql}`).run()
  }
}

async function ensureMessagesSchema(c: any) {
  await c.env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      sender_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      provider_id INTEGER,
      booking_id INTEGER,
      message TEXT,
      message_text TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run()
  await addColumnIfMissing(c, 'conversation_id', 'conversation_id TEXT')
  await addColumnIfMissing(c, 'sender_id', 'sender_id INTEGER')
  await addColumnIfMissing(c, 'receiver_id', 'receiver_id INTEGER')
  await addColumnIfMissing(c, 'provider_id', 'provider_id INTEGER')
  await addColumnIfMissing(c, 'booking_id', 'booking_id INTEGER')
  await addColumnIfMissing(c, 'message', 'message TEXT')
  await addColumnIfMissing(c, 'message_text', 'message_text TEXT')
  await addColumnIfMissing(c, 'is_read', 'is_read INTEGER DEFAULT 0')
  await addColumnIfMissing(c, 'created_at', 'created_at DATETIME DEFAULT CURRENT_TIMESTAMP')
  await c.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)').run()
  await c.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)').run()
  await c.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id)').run()
  await c.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_provider_id ON messages(provider_id)').run()
  await c.env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)').run()
}

async function retryWithSchema(c: any, fn: () => Promise<any>) {
  try { return await fn() } catch (error) {
    if (!messagesSchemaError(error)) throw error
    await ensureMessagesSchema(c)
    return await fn()
  }
}

function makeConversationId(providerId: number, customerId: number): string { return `provider:${providerId}:customer:${customerId}` }
function parseConversationId(conversationId: string) {
  const match = String(conversationId || '').match(/^provider:(\d+):customer:(\d+)$/)
  if (!match) return null
  return { providerId: Number(match[1]), customerId: Number(match[2]) }
}
async function providerForUser(c: any, providerUserId: number) {
  return await c.env.DB.prepare('SELECT id, user_id, business_name FROM providers WHERE user_id = ?').bind(providerUserId).first() as any
}
async function providerById(c: any, providerId: number) {
  return await c.env.DB.prepare('SELECT id, user_id, business_name FROM providers WHERE id = ?').bind(providerId).first() as any
}

async function canAccessConversation(c: any, user: any, conversationId: string): Promise<boolean> {
  const currentUserId = userId(user)
  const existing = await retryWithSchema(c, async () => await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM messages WHERE conversation_id = ? AND (sender_id = ? OR receiver_id = ?)
  `).bind(conversationId, currentUserId, currentUserId).first() as any)
  if (Number(existing?.count || 0) > 0) return true
  const parsed = parseConversationId(conversationId)
  if (!parsed) return false
  if (parsed.customerId === currentUserId) return true
  if (user.role === 'provider') {
    const provider = await providerForUser(c, currentUserId)
    return !!provider && Number(provider.id) === parsed.providerId
  }
  return false
}

async function bookingBelongsToConversation(c: any, bookingId: number, providerId: number, customerId: number) {
  const booking = await c.env.DB.prepare('SELECT id FROM bookings WHERE id = ? AND provider_id = ? AND customer_id = ?').bind(bookingId, providerId, customerId).first()
  return !!booking
}

function messageSelectExpression() { return 'COALESCE(m.message, m.message_text, "") as message' }
function inboxMessageExpression() { return 'COALESCE(latest.message, latest.message_text, "") as last_message' }

messages.post('/send', async (c) => {
  try {
    await ensureMessagesSchema(c)
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const currentUserId = userId(user)
    const body = await c.req.json()
    const text = String(body.message || body.message_text || '').trim()
    if (!text) return c.json({ success: false, error: 'Message is required' }, 400)
    if (text.length > 2000) return c.json({ success: false, error: 'Message is too long' }, 400)

    const requestedProviderId = body.provider_id ? Number(body.provider_id) : 0
    const requestedReceiverId = body.receiver_id ? Number(body.receiver_id) : 0
    const bookingId = body.booking_id ? Number(body.booking_id) : null
    let providerId = requestedProviderId
    let receiverId = requestedReceiverId
    let customerId = currentUserId

    if (user.role === 'provider') {
      const provider = await providerForUser(c, currentUserId)
      if (!provider) return c.json({ success: false, error: 'Provider profile not found' }, 404)
      if (requestedProviderId && Number(provider.id) !== requestedProviderId) return c.json({ success: false, error: 'Cannot send messages for another provider' }, 403)
      if (!requestedReceiverId) return c.json({ success: false, error: 'Receiver is required' }, 400)
      const receiver = await c.env.DB.prepare('SELECT id, role FROM users WHERE id = ? AND is_active = 1').bind(requestedReceiverId).first() as any
      if (!receiver) return c.json({ success: false, error: 'Receiver not found' }, 404)
      if (receiver.role !== 'customer') return c.json({ success: false, error: 'Providers can only reply to customers' }, 403)
      providerId = Number(provider.id); receiverId = Number(receiver.id); customerId = receiverId
    } else {
      if (!requestedProviderId) return c.json({ success: false, error: 'Provider is required' }, 400)
      const provider = await providerById(c, requestedProviderId)
      if (!provider) return c.json({ success: false, error: 'Provider not found' }, 404)
      if (!provider.user_id) return c.json({ success: false, error: 'Provider account is not linked to a user yet' }, 409)
      providerId = Number(provider.id); receiverId = Number(provider.user_id); customerId = currentUserId
      if (requestedReceiverId && requestedReceiverId !== receiverId) return c.json({ success: false, error: 'Receiver does not match provider' }, 403)
    }

    if (bookingId) {
      const bookingOk = await bookingBelongsToConversation(c, bookingId, providerId, customerId)
      if (!bookingOk) return c.json({ success: false, error: 'Booking does not belong to this conversation' }, 403)
    }

    const conversationId = makeConversationId(providerId, customerId)
    const result = await retryWithSchema(c, async () => await c.env.DB.prepare(`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, provider_id, booking_id, message, message_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(conversationId, currentUserId, receiverId, providerId, bookingId, text, text).run())

    const message = await c.env.DB.prepare(`
      SELECT m.*, ${messageSelectExpression()}, su.first_name as sender_first_name, su.last_name as sender_last_name
      FROM messages m LEFT JOIN users su ON su.id = m.sender_id WHERE m.id = ?
    `).bind(result.meta.last_row_id).first()
    return c.json({ success: true, conversation_id: conversationId, message })
  } catch (error: any) {
    console.error('MESSAGES SEND ERROR:', error)
    return c.json({ success: false, error: error?.message || 'Failed to send message' }, 500)
  }
})

messages.get('/conversation/:conversation_id', async (c) => {
  try {
    await ensureMessagesSchema(c)
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const conversationId = decodeURIComponent(c.req.param('conversation_id'))
    const allowed = await canAccessConversation(c, user, conversationId)
    if (!allowed) return c.json({ success: false, error: 'Conversation not found' }, 404)
    const result = await retryWithSchema(c, async () => await c.env.DB.prepare(`
      SELECT m.*, ${messageSelectExpression()}, su.first_name as sender_first_name, su.last_name as sender_last_name,
        ru.first_name as receiver_first_name, ru.last_name as receiver_last_name, p.business_name, p.logo_url
      FROM messages m
      LEFT JOIN users su ON su.id = m.sender_id
      LEFT JOIN users ru ON ru.id = m.receiver_id
      LEFT JOIN providers p ON p.id = m.provider_id
      WHERE m.conversation_id = ? ORDER BY m.created_at ASC, m.id ASC
    `).bind(conversationId).all())
    return c.json({ success: true, conversation_id: conversationId, messages: result.results })
  } catch (error: any) {
    console.error('MESSAGES CONVERSATION ERROR:', error)
    return c.json({ success: false, error: error?.message || 'Failed to load conversation' }, 500)
  }
})

messages.get('/inbox', async (c) => {
  try {
    await ensureMessagesSchema(c)
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const currentUserId = userId(user)
    const result = await retryWithSchema(c, async () => await c.env.DB.prepare(`
      SELECT latest.conversation_id, latest.id as last_message_id, latest.sender_id, latest.receiver_id,
        latest.provider_id, latest.booking_id, ${inboxMessageExpression()}, latest.created_at,
        grouped.unread_count, other.id as other_user_id, other.first_name as other_first_name, other.last_name as other_last_name,
        other.avatar_url as other_avatar_url, p.business_name, p.logo_url
      FROM (
        SELECT conversation_id, MAX(id) as last_id, SUM(CASE WHEN receiver_id = ? AND is_read = 0 THEN 1 ELSE 0 END) as unread_count
        FROM messages WHERE sender_id = ? OR receiver_id = ? GROUP BY conversation_id
      ) grouped
      JOIN messages latest ON latest.id = grouped.last_id
      LEFT JOIN users other ON other.id = CASE WHEN latest.sender_id = ? THEN latest.receiver_id ELSE latest.sender_id END
      LEFT JOIN providers p ON p.id = latest.provider_id
      ORDER BY latest.created_at DESC, latest.id DESC
    `).bind(currentUserId, currentUserId, currentUserId, currentUserId).all())
    return c.json({ success: true, conversations: result.results })
  } catch (error: any) {
    console.error('MESSAGES INBOX ERROR:', error)
    return c.json({ success: false, error: error?.message || 'Failed to load inbox' }, 500)
  }
})

messages.patch('/read/:conversation_id', async (c) => {
  try {
    await ensureMessagesSchema(c)
    const user = await getUser(c)
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401)
    const conversationId = decodeURIComponent(c.req.param('conversation_id'))
    const allowed = await canAccessConversation(c, user, conversationId)
    if (!allowed) return c.json({ success: false, error: 'Conversation not found' }, 404)
    await retryWithSchema(c, async () => await c.env.DB.prepare('UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND receiver_id = ?').bind(conversationId, userId(user)).run())
    return c.json({ success: true })
  } catch (error: any) {
    console.error('MESSAGES READ ERROR:', error)
    return c.json({ success: false, error: error?.message || 'Failed to mark messages as read' }, 500)
  }
})

export default messages
