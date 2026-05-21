-- Migration 0009: Ensure point_transactions and reward_items have all required columns

-- Add missing columns to point_transactions if they don't exist
ALTER TABLE point_transactions ADD COLUMN reason TEXT;
ALTER TABLE point_transactions ADD COLUMN created_by TEXT;

-- Add missing columns to reward_items if they don't exist
ALTER TABLE reward_items ADD COLUMN image_url TEXT;
ALTER TABLE reward_items ADD COLUMN description TEXT;
ALTER TABLE reward_items ADD COLUMN is_available INTEGER DEFAULT 1;

-- Add missing column to providers if not present
ALTER TABLE providers ADD COLUMN loyalty_points INTEGER DEFAULT 0;
