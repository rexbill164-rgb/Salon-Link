-- Add reminder_sent flag to bookings
ALTER TABLE bookings ADD COLUMN reminder_sent INTEGER DEFAULT 0;
