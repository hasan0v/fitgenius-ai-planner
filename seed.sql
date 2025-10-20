-- Test data for development
INSERT OR IGNORE INTO users (email, name, age, gender, height, current_weight, target_weight, activity_level, dietary_preferences, questionnaire_data, user_path) VALUES 
  ('test@example.com', 'Test User', 30, 'Female', 165, 70, 60, 'moderate', 'none', '{}', 'beginner'),
  ('demo@fitgenius.top', 'Demo User', 25, 'Male', 180, 85, 75, 'active', 'vegetarian', '{}', 'intermediate');

-- Test orders
INSERT OR IGNORE INTO orders (user_id, plan_type, amount, status) VALUES 
  (1, 'basic', 9.90, 'paid'),
  (2, 'premium', 14.90, 'pending');