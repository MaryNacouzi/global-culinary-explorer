-- The Global Culinary Explorer & Smart Grocery Assistant
-- Neon PostgreSQL Schema

CREATE TABLE IF NOT EXISTS user_recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(80) NOT NULL,
    category VARCHAR(60) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_time_minutes INTEGER NOT NULL CHECK (prep_time_minutes > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grocery_list (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(120) NOT NULL,
    quantity VARCHAR(40) DEFAULT '1',
    is_checked BOOLEAN NOT NULL DEFAULT FALSE,
    session_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_recipes_category ON user_recipes(category);
CREATE INDEX IF NOT EXISTS idx_grocery_list_checked ON grocery_list(is_checked);
CREATE INDEX IF NOT EXISTS idx_grocery_list_session ON grocery_list(session_id);
