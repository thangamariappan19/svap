-- ============================================
-- Smart Visa Assistant Platform (SVAP)
-- PostgreSQL Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ──
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nationality VARCHAR(100),
  passport_number VARCHAR(50),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Countries ──
CREATE TABLE countries (
  id          VARCHAR(10) PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  code        CHAR(2) UNIQUE NOT NULL,
  flag        VARCHAR(10),
  region      VARCHAR(100),
  popular     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Visa Types ──
CREATE TABLE visa_types (
  id                VARCHAR(50) PRIMARY KEY,
  country_id        VARCHAR(10) REFERENCES countries(id) ON DELETE CASCADE,
  type              VARCHAR(50) NOT NULL CHECK (type IN ('tourist','business','student','transit','work')),
  label             VARCHAR(100) NOT NULL,
  validity          VARCHAR(100),
  processing_time   VARCHAR(100),
  fee               DECIMAL(10,2),
  fee_currency      CHAR(3),
  entry_type        VARCHAR(20) CHECK (entry_type IN ('single','double','multiple')),
  stay_duration     VARCHAR(100),
  official_url      TEXT,
  on_arrival        BOOLEAN DEFAULT FALSE,
  e_visa            BOOLEAN DEFAULT FALSE,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Visa Requirements ──
CREATE TABLE visa_requirements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_type_id  VARCHAR(50) REFERENCES visa_types(id) ON DELETE CASCADE,
  requirement   TEXT NOT NULL,
  sort_order    INT DEFAULT 0
);

-- ── Document Templates ──
CREATE TABLE document_templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) CHECK (category IN ('identity','financial','travel','accommodation','employment','other')),
  required      BOOLEAN DEFAULT TRUE,
  tips          TEXT,
  applies_to    VARCHAR(50)[] DEFAULT '{}',  -- employment statuses
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Applications ──
CREATE TABLE applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  country_id      VARCHAR(10) REFERENCES countries(id),
  visa_type_id    VARCHAR(50) REFERENCES visa_types(id),
  status          VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
    'draft','documents_gathering','submitted','under_review',
    'additional_docs_required','approved','rejected','passport_dispatched'
  )),
  submitted_date  DATE,
  expected_date   DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Application Steps ──
CREATE TABLE application_steps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id  UUID REFERENCES applications(id) ON DELETE CASCADE,
  label           VARCHAR(255) NOT NULL,
  description     TEXT,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  sort_order      INT DEFAULT 0
);

-- ── Chat Sessions ──
CREATE TABLE chat_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Chat Messages ──
CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        VARCHAR(20) CHECK (role IN ('user','assistant')),
  content     TEXT NOT NULL,
  sources     TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_visa_types_country ON visa_types(country_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_countries_region ON countries(region);
CREATE INDEX idx_countries_code ON countries(code);

-- ── Updated At Trigger ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_visa_types_updated_at BEFORE UPDATE ON visa_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Seed Data ──
INSERT INTO countries (id, name, code, flag, region, popular) VALUES
  ('sgp', 'Singapore', 'SG', '🇸🇬', 'Southeast Asia', TRUE),
  ('jpn', 'Japan', 'JP', '🇯🇵', 'East Asia', TRUE),
  ('tha', 'Thailand', 'TH', '🇹🇭', 'Southeast Asia', TRUE),
  ('usa', 'United States', 'US', '🇺🇸', 'North America', TRUE),
  ('gbr', 'United Kingdom', 'GB', '🇬🇧', 'Europe', TRUE),
  ('fra', 'France', 'FR', '🇫🇷', 'Europe', TRUE),
  ('aus', 'Australia', 'AU', '🇦🇺', 'Oceania', TRUE),
  ('can', 'Canada', 'CA', '🇨🇦', 'North America', TRUE),
  ('mys', 'Malaysia', 'MY', '🇲🇾', 'Southeast Asia', TRUE),
  ('uae', 'Dubai (UAE)', 'AE', '🇦🇪', 'Middle East', TRUE);
