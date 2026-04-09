-- ============================================================
-- SalonLink Migration 002: Gallery, Service Fees, Subscriptions
-- ============================================================

-- PROVIDER GALLERY TABLE
CREATE TABLE IF NOT EXISTS provider_gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_logo INTEGER DEFAULT 0, -- 1 = logo image
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- PROVIDER SUBSCRIPTIONS TABLE (10 GHS/month for extra gallery)
CREATE TABLE IF NOT EXISTS provider_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  plan TEXT DEFAULT 'free', -- free | gallery_pro
  status TEXT DEFAULT 'active', -- active | expired | cancelled
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  amount_paid INTEGER DEFAULT 0, -- in GHS pesewas (1000 = 10 GHS)
  payment_reference TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- SERVICE FEES TABLE (3 GHS platform fee per booking)
CREATE TABLE IF NOT EXISTS service_fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL UNIQUE,
  provider_id INTEGER NOT NULL,
  fee_amount INTEGER NOT NULL DEFAULT 300, -- 3 GHS in pesewas
  status TEXT DEFAULT 'pending', -- pending | paid | waived
  due_date TEXT NOT NULL, -- YYYY-MM-DD (booking date)
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- Add service_fee column to bookings (3 GHS platform fee shown to customer)
ALTER TABLE bookings ADD COLUMN service_fee INTEGER DEFAULT 300;

-- Add logo_url to providers table
ALTER TABLE providers ADD COLUMN logo_url TEXT;
ALTER TABLE providers ADD COLUMN gallery_count INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN has_pro_gallery INTEGER DEFAULT 0;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_gallery_provider ON provider_gallery(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_fees_provider ON service_fees(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_fees_status ON service_fees(status);
CREATE INDEX IF NOT EXISTS idx_service_fees_due ON service_fees(due_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON provider_subscriptions(provider_id);
