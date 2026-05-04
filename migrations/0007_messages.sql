-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0007: Messages / Conversations
-- Creates the messages table and all required indexes for the chat feature.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id  TEXT    NOT NULL,
  sender_id        INTEGER NOT NULL,
  receiver_id      INTEGER NOT NULL,
  provider_id      INTEGER,
  message_text     TEXT    NOT NULL,
  message_type     TEXT    NOT NULL DEFAULT 'text',   -- text | image | booking_card
  is_read          INTEGER NOT NULL DEFAULT 0,
  attachment_url   TEXT,
  metadata         TEXT,                               -- JSON blob for booking_card data
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes required by the app
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id     ON messages (receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_provider_id     ON messages (provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at      ON messages (created_at);
