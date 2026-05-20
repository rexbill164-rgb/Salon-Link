-- Migration 0009: Loyalty Points & Rewards System
-- loyalty_points column may already exist — only add if missing
-- (SQLite does not support IF NOT EXISTS for ALTER TABLE ADD COLUMN in older versions)
-- Skipping ALTER TABLE here; column was added in a prior migration run.

-- Point transactions log
CREATE TABLE IF NOT EXISTS point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  provider_id INTEGER,
  points INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  admin_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- Reward items catalogue
CREATE TABLE IF NOT EXISTS reward_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  points_required INTEGER NOT NULL,
  quantity_available INTEGER DEFAULT NULL,
  is_active INTEGER DEFAULT 1,
  category TEXT DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reward claims by providers
CREATE TABLE IF NOT EXISTS reward_claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  reward_item_id INTEGER NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (reward_item_id) REFERENCES reward_items(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_provider ON point_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_provider ON reward_claims(provider_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_status ON reward_claims(status);
