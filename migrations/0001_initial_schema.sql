-- ============================================================
-- SalonLink Database Schema
-- ============================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer', -- customer | provider | admin
  avatar_url TEXT,
  is_verified INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  service_category TEXT NOT NULL, -- hair_salon | barbershop | nail_tech | massage | makeup | lash_tech
  bio TEXT,
  address TEXT,
  city TEXT DEFAULT 'Accra',
  location_lat REAL,
  location_lng REAL,
  price_from INTEGER DEFAULT 0, -- in GHS pesewas
  price_to INTEGER DEFAULT 0,
  rating REAL DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  is_verified INTEGER DEFAULT 0,
  is_accepting_bookings INTEGER DEFAULT 1,
  kyc_status TEXT DEFAULT 'pending', -- pending | submitted | approved | rejected
  avatar_url TEXT,
  cover_url TEXT,
  working_hours TEXT DEFAULT '{"mon":"9:00-18:00","tue":"9:00-18:00","wed":"9:00-18:00","thu":"9:00-18:00","fri":"9:00-18:00","sat":"9:00-16:00","sun":"closed"}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SERVICES TABLE (services offered by a provider)
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in GHS pesewas
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  booking_date TEXT NOT NULL, -- YYYY-MM-DD
  booking_time TEXT NOT NULL, -- HH:MM
  status TEXT DEFAULT 'pending', -- pending | confirmed | completed | cancelled | no_show
  total_amount INTEGER NOT NULL, -- in GHS pesewas
  payment_status TEXT DEFAULT 'unpaid', -- unpaid | paid | refunded
  payment_reference TEXT,
  notes TEXT,
  cancellation_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- HAIRSTYLE HISTORY TABLE
CREATE TABLE IF NOT EXISTS hairstyle_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  provider_id INTEGER,
  booking_id INTEGER,
  style_name TEXT,
  image_url TEXT NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info | booking | payment | review | system
  is_read INTEGER DEFAULT 0,
  action_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- in GHS pesewas
  currency TEXT DEFAULT 'GHS',
  payment_method TEXT DEFAULT 'paystack', -- paystack | cash | momo
  reference TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | success | failed | refunded
  paystack_data TEXT, -- JSON string of paystack response
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id)
);

-- SESSIONS TABLE (JWT refresh tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(service_category);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
