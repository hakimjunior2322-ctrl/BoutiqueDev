-- =====================================================
-- JuDev Database Schema - PostgreSQL
-- =====================================================

-- 1. TABLE: Users (Admin)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLE: Boutiques (Projects/Shops)
CREATE TABLE IF NOT EXISTS boutiques (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  features TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABLE: Avis (Reviews/Testimonials)
CREATE TABLE IF NOT EXISTS avis (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business VARCHAR(255),
  email VARCHAR(255),
  text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  status VARCHAR(50) DEFAULT 'pending',
  access_code VARCHAR(50),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLE: Tarifs (Pricing Plans)
CREATE TABLE IF NOT EXISTS tarifs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT,
  currency VARCHAR(10) DEFAULT 'EUR',
  period VARCHAR(50) DEFAULT 'month',
  description TEXT,
  features TEXT,
  highlighted BOOLEAN DEFAULT FALSE,
  cta_text VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLE: Devis (Quotes/Requests)
CREATE TABLE IF NOT EXISTS devis (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  budget INT,
  project_type VARCHAR(100),
  timeline VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. TABLE: Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

INSERT INTO users (username, password, email, role) 
VALUES ('admin', 'admin123', 'admin@judev.com', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO tarifs (name, price, currency, period, description, features, highlighted, cta_text, status) 
VALUES
  ('Starter', 499, 'EUR', 'once', 'Parfait pour débuter', '5 pages max, Design responsive, SEO basique, Support email, SSL gratuit', FALSE, 'Démarrer', 'active'),
  ('Pro', 999, 'EUR', 'once', 'Pour croître', 'Pages illimitées, Design custom, SEO avancé, Support 24/7, Analytics, Intégrations', TRUE, 'Choisir', 'active'),
  ('Enterprise', NULL, 'EUR', 'custom', 'Pour grandes structures', 'Tout illimité, Support dédié, API custom, Infrastructure privée, SLA garanti', FALSE, 'Contacter', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO avis (name, business, email, text, rating, status) 
VALUES
  ('Karim D.', 'Fashion Boutique', 'karim@example.com', 'JuDev a transformé ma présence en ligne. Ventes +150%!', 5, 'approved'),
  ('Fatima M.', 'Restaurant Delice', 'fatima@example.com', 'Professionnel, réactif, résultats au rendez-vous.', 5, 'approved'),
  ('Ahmed S.', 'Salon Excellence', 'ahmed@example.com', 'Le site est magnifique et les clients adorent!', 5, 'approved'),
  ('Zainab L.', 'Shop Electronique', 'zainab@example.com', 'Excellent rapport qualité-prix. Vraiment très satisfaite!', 4, 'approved')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_boutiques_status ON boutiques(status);
CREATE INDEX IF NOT EXISTS idx_avis_status ON avis(status);
CREATE INDEX IF NOT EXISTS idx_devis_status ON devis(status);
CREATE INDEX IF NOT EXISTS idx_tarifs_status ON tarifs(status);
CREATE INDEX IF NOT EXISTS idx_avis_created ON avis(created_at);
CREATE INDEX IF NOT EXISTS idx_devis_created ON devis(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);
