-- ============================================================
-- SalonLink: Paystack Payment System Migration
-- ============================================================

-- TRANSACTIONS TABLE (core payment settlement records)
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,        -- total in pesewas (e.g. 10000 = GHS 100)
  platform_fee INTEGER NOT NULL DEFAULT 300, -- always 300 pesewas = GHS 3
  provider_earning INTEGER NOT NULL,   -- amount_paid - platform_fee (pesewas)
  payout_status TEXT NOT NULL DEFAULT 'pending', -- pending | paid
  payment_reference TEXT UNIQUE NOT NULL,
  paystack_event_id TEXT,              -- Paystack transaction ID for dedup
  paid_out_at DATETIME,               -- when admin marked as paid
  paid_out_by INTEGER,                -- admin user_id who marked paid
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Add momo_number to providers if not exists
ALTER TABLE providers ADD COLUMN momo_number TEXT;
ALTER TABLE providers ADD COLUMN momo_name TEXT;
ALTER TABLE providers ADD COLUMN bank_name TEXT;
ALTER TABLE providers ADD COLUMN bank_account TEXT;

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider ON transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payout_status ON transactions(payout_status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(payment_reference);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
