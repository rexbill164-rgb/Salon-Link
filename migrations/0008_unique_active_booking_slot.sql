-- Migration 0008: Prevent duplicate active booking slots
--
-- This index is the database-level race guard for simultaneous booking requests.
-- It allows cancelled or rejected bookings to release the slot, while pending,
-- confirmed, in_progress, completed, no_show, and null statuses still block it.
--
-- Before applying this migration to a live database, check for existing duplicates:
-- SELECT provider_id, service_id, booking_date, booking_time, COUNT(*) AS duplicate_count
-- FROM bookings
-- WHERE COALESCE(status, 'pending') NOT IN ('cancelled', 'rejected')
-- GROUP BY provider_id, service_id, booking_date, booking_time
-- HAVING COUNT(*) > 1;
--
-- If that query returns rows, resolve those duplicates first; SQLite/D1 will not
-- create the unique index while duplicate active rows already exist.

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking_slot
ON bookings (provider_id, service_id, booking_date, booking_time)
WHERE COALESCE(status, 'pending') NOT IN ('cancelled', 'rejected');
