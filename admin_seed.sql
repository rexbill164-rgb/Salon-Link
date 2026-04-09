-- Insert admin user (password: Admin@SalonLink2026!)
INSERT OR IGNORE INTO users (email, phone, password_hash, first_name, last_name, role, is_verified)
VALUES (
  'admin@salonlink.it.com',
  '+233000000000',
  '127e0541e41dee728659a11db3ae73226b46b4e6e1393e5fd03f01add8f65e45',
  'SalonLink',
  'Admin',
  'admin',
  1
);
