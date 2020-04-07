DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);