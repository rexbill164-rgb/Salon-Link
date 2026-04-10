-- Add payment_method column to bookings (cash | momo | card | paystack)
ALTER TABLE bookings ADD COLUMN payment_method TEXT DEFAULT NULL;
-- Add reminder_sent if not already present (idempotent)
ALTER TABLE bookings ADD COLUMN reminder_sent INTEGER DEFAULT 0;
