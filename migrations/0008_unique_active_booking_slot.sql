-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 0008: Unique active booking slot index
-- Prevents double-bookings: a provider cannot have two non-cancelled bookings
-- for the same date + time slot.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking_slot
  ON bookings (provider_id, booking_date, booking_time)
  WHERE status NOT IN ('cancelled', 'rejected');
