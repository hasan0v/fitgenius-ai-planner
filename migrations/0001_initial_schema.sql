-- Users table for storing questionnaire responses and user data
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  height REAL,
  current_weight REAL,
  target_weight REAL,
  activity_level TEXT,
  dietary_preferences TEXT,
  health_conditions TEXT,
  questionnaire_data TEXT,
  user_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table for payment tracking
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AZN',
  status TEXT DEFAULT 'pending',
  epoint_transaction_id TEXT,
  ai_plan_content TEXT,
  pdf_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Questionnaire sessions for temporary data storage
CREATE TABLE IF NOT EXISTS questionnaire_sessions (
  id TEXT PRIMARY KEY,
  current_step INTEGER DEFAULT 1,
  responses TEXT,
  user_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (datetime('now', '+24 hours'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_epoint_transaction ON orders(epoint_transaction_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_expires ON questionnaire_sessions(expires_at);