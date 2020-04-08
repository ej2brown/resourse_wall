DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings 
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  star_rating INTEGER
);