-- ============================================================
-- SalonLink Seed Data
-- ============================================================

-- Admin user (password: Admin@123)
INSERT OR IGNORE INTO users (email, phone, password_hash, first_name, last_name, role, is_verified) VALUES
('admin@salonlink.com', '+233200000000', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Admin', 'SalonLink', 'admin', 1);

-- Demo customers (password: Demo@123)
INSERT OR IGNORE INTO users (email, phone, password_hash, first_name, last_name, role, is_verified) VALUES
('ama@example.com', '+233244111001', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Ama', 'Mensah', 'customer', 1),
('kwame@example.com', '+233244111002', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Kwame', 'Asante', 'customer', 1),
('abena@example.com', '+233244111003', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Abena', 'Boateng', 'customer', 1);

-- Demo providers (password: Demo@123)
INSERT OR IGNORE INTO users (email, phone, password_hash, first_name, last_name, role, is_verified) VALUES
('glam@example.com', '+233244222001', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Gloria', 'Asante', 'provider', 1),
('kofi@example.com', '+233244222002', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Kofi', 'Mensah', 'provider', 1),
('nails@example.com', '+233244222003', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Abena', 'Nkrumah', 'provider', 1),
('massage@example.com', '+233244222004', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Efua', 'Darko', 'provider', 1),
('lash@example.com', '+233244222005', '$2b$10$rQZ8kHWKtGY7vN1mX3pL8.YQZKl9mB2nR4sT6uV8wX0yA1bC3dE5f', 'Akosua', 'Owusu', 'provider', 1);

-- Provider profiles
INSERT OR IGNORE INTO providers (user_id, business_name, service_category, bio, address, city, price_from, price_to, rating, total_reviews, total_bookings, is_verified, kyc_status) VALUES
(5, 'Glam Studio GH', 'hair_salon', 'Premium hair salon in the heart of Accra. We specialize in natural hair, braids, weaves, and coloring. Over 10 years of experience serving Accra''s finest clientele.', 'Airport Residential, Near Stanbic Bank', 'Accra', 15000, 45000, 4.9, 128, 340, 1, 'approved'),
(6, 'KutzByKofi', 'barbershop', 'Accra''s most sought-after barber. Precision cuts, fades, and beard grooming for the modern Ghanaian man. Featured in GQ Africa 2024.', 'Osu Oxford Street, Near Frankie''s', 'Accra', 8000, 20000, 4.8, 95, 520, 1, 'approved'),
(7, 'Nails by Abena', 'nail_tech', 'Luxury nail studio offering gel, acrylic, dip powder, and nail art. We use only premium products for long-lasting results.', 'East Legon, American House', 'Accra', 10000, 30000, 4.9, 74, 210, 1, 'approved'),
(8, 'Serenity Spa & Massage', 'massage', 'Full-body wellness experience in a tranquil environment. Swedish, deep tissue, hot stone, and traditional Ghanaian massage techniques.', 'Cantonments, Near Movenpick Hotel', 'Accra', 20000, 60000, 4.7, 52, 180, 1, 'approved'),
(9, 'LashBar Accra', 'lash_tech', 'Professional lash extensions, lifts, and tints. Classic, hybrid, and volume sets available. Certified by Lash Inc International.', 'Labone, Near Total Filling Station', 'Accra', 15000, 40000, 5.0, 41, 156, 1, 'approved');

-- Services for Glam Studio GH
INSERT OR IGNORE INTO services (provider_id, name, description, price, duration_minutes) VALUES
(1, 'Box Braids (Medium)', 'Classic medium-sized box braids using premium Xpression hair', 25000, 180),
(1, 'Knotless Braids', 'Protective knotless braids — lightweight and natural looking', 35000, 240),
(1, 'Hair Wash & Blowout', 'Shampoo, deep condition, blowout and style', 15000, 90),
(1, 'Full Weave Install', 'Sew-in weave installation with leave-out', 40000, 180),
(1, 'Natural Hair Twist', 'Two-strand twists on natural hair', 18000, 120),
(1, 'Hair Coloring', 'Full hair color with toner and treatment', 45000, 210);

-- Services for KutzByKofi
INSERT OR IGNORE INTO services (provider_id, name, description, price, duration_minutes) VALUES
(2, 'Fresh Cut & Fade', 'Classic haircut with low/mid/high fade', 8000, 45),
(2, 'Shape Up & Line Up', 'Edge up, line up and shaping', 5000, 30),
(2, 'Full Beard Grooming', 'Beard trim, shape and hot towel treatment', 10000, 45),
(2, 'Cut + Beard Combo', 'Full haircut plus complete beard grooming', 16000, 75),
(2, 'Hair Design / Pattern', 'Custom hair design or pattern cut', 20000, 90),
(2, 'Kids Haircut (Under 12)', 'Gentle haircut for kids', 6000, 30);

-- Services for Nails by Abena
INSERT OR IGNORE INTO services (provider_id, name, description, price, duration_minutes) VALUES
(3, 'Gel Manicure', 'Long-lasting gel polish manicure with cuticle care', 10000, 60),
(3, 'Acrylic Full Set', 'Full acrylic nail set with your choice of color', 20000, 90),
(3, 'Nail Art (per nail)', 'Custom nail art design per nail', 3000, 15),
(3, 'Pedicure Deluxe', 'Full pedicure with scrub, massage and gel polish', 15000, 75),
(3, 'Dip Powder Manicure', 'Dip powder nails — stronger than gel, no UV needed', 22000, 75),
(3, 'Nail Removal & Prep', 'Safe removal of previous set with prep for new', 8000, 45);

-- Services for Serenity Spa
INSERT OR IGNORE INTO services (provider_id, name, description, price, duration_minutes) VALUES
(4, 'Swedish Massage (60min)', 'Classic full-body relaxation massage', 20000, 60),
(4, 'Deep Tissue Massage', 'Targeted deep tissue work for tension relief', 30000, 75),
(4, 'Hot Stone Therapy', 'Warm basalt stones combined with massage techniques', 40000, 90),
(4, 'Couples Massage', 'Side-by-side massage for two in private suite', 60000, 60),
(4, 'Traditional Ghanaian Massage', 'Authentic Ghanaian healing massage with shea butter', 25000, 60);

-- Services for LashBar Accra
INSERT OR IGNORE INTO services (provider_id, name, description, price, duration_minutes) VALUES
(5, 'Classic Lash Extensions', '80-100 individual lash extensions for natural look', 15000, 90),
(5, 'Hybrid Lash Set', 'Mix of classic and volume for textured look', 25000, 105),
(5, 'Mega Volume Lashes', 'Full dramatic mega volume fan lashes', 35000, 120),
(5, 'Lash Lift & Tint', 'Natural lash curl and tint — no extensions needed', 18000, 60),
(5, 'Lash Fill (2 weeks)', 'Infill for existing set within 2 weeks', 10000, 60),
(5, 'Lash Removal', 'Safe professional lash extension removal', 8000, 30);

-- Sample bookings
INSERT OR IGNORE INTO bookings (customer_id, provider_id, service_id, booking_date, booking_time, status, total_amount, payment_status) VALUES
(2, 1, 1, '2026-04-10', '10:00', 'confirmed', 25000, 'paid'),
(2, 1, 3, '2026-04-15', '14:00', 'pending', 15000, 'unpaid'),
(3, 2, 7, '2026-04-08', '09:00', 'completed', 8000, 'paid'),
(3, 2, 10, '2026-04-12', '11:00', 'confirmed', 16000, 'paid'),
(4, 3, 13, '2026-04-09', '13:00', 'completed', 10000, 'paid'),
(2, 4, 18, '2026-04-20', '15:00', 'pending', 20000, 'unpaid'),
(4, 5, 22, '2026-04-11', '10:30', 'confirmed', 15000, 'paid');

-- Sample reviews
INSERT OR IGNORE INTO reviews (booking_id, customer_id, provider_id, rating, comment) VALUES
(1, 2, 1, 5, 'Absolutely stunning braids! Gloria is so talented and the studio is immaculate. Will definitely be coming back!'),
(3, 3, 2, 5, 'Best barber in Accra, no debate. Kofi takes his time and the attention to detail is unmatched.'),
(5, 4, 3, 5, 'Abena did my gel manicure and it''s been 3 weeks and still no chips! Incredible work.');

-- Sample notifications
INSERT OR IGNORE INTO notifications (user_id, title, message, type, action_url) VALUES
(2, 'Booking Confirmed!', 'Your appointment at Glam Studio GH on Apr 10 at 10:00 AM is confirmed.', 'booking', '/dashboard'),
(3, 'Booking Confirmed!', 'Your appointment at KutzByKofi on Apr 12 at 11:00 AM is confirmed.', 'booking', '/dashboard'),
(5, 'New Booking!', 'Ama Mensah has booked Box Braids (Medium) for Apr 10 at 10:00 AM.', 'booking', '/provider/dashboard'),
(6, 'New Booking!', 'Kwame Asante has booked Cut + Beard Combo for Apr 12 at 11:00 AM.', 'booking', '/provider/dashboard'),
(2, 'Review Reminder', 'How was your experience at KutzByKofi? Leave a review!', 'review', '/dashboard'),
(2, 'Welcome to SalonLink!', 'Discover hundreds of verified beauty professionals near you.', 'system', '/discover');
