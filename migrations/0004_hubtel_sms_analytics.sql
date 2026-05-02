-- ============================================================
-- SalonLink Hubtel SMS / OTP / Customer Analytics Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS customer_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  preferred_channel TEXT DEFAULT 'sms',
  preferred_city TEXT,
  preferred_services TEXT,
  marketing_opt_in INTEGER DEFAULT 1,
  first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  welcome_sms_sent_at DATETIME,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  channel TEXT DEFAULT 'sms',
  purpose TEXT DEFAULT 'login',
  otp_hash TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INTEGER DEFAULT 0,
  is_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);

CREATE TABLE IF NOT EXISTS sms_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  phone TEXT NOT NULL,
  provider TEXT DEFAULT 'hubtel',
  message_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  provider_message_id TEXT,
  provider_response TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_user ON sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON sms_logs(phone);
CREATE INDEX IF NOT EXISTS idx_sms_logs_type ON sms_logs(message_type);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created ON sms_logs(created_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_source TEXT DEFAULT 'web',
  page_path TEXT,
  service_category TEXT,
  provider_id INTEGER,
  booking_id INTEGER,
  metadata TEXT,
  city TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_provider ON analytics_events(provider_id);

CREATE TABLE IF NOT EXISTS automation_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  channel TEXT DEFAULT 'sms',
  trigger_event TEXT NOT NULL,
  message_template TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  cooldown_hours INTEGER DEFAULT 720,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO automation_rules (rule_key, name, channel, trigger_event, message_template, cooldown_hours)
VALUES (
  'welcome_sms_on_login',
  'Welcome SMS after sign-in',
  'sms',
  'user_login',
  'Welcome to SalonLink, {{name}}. Discover verified beauty providers near you and manage your bookings easily.',
  720
);
