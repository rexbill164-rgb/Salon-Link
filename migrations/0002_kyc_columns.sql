-- Add KYC image columns to providers table
ALTER TABLE providers ADD COLUMN kyc_card_number TEXT;
ALTER TABLE providers ADD COLUMN kyc_front_url TEXT;
ALTER TABLE providers ADD COLUMN kyc_back_url TEXT;
ALTER TABLE providers ADD COLUMN kyc_selfie_url TEXT;
