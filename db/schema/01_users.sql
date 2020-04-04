-- Drop and recreate Users table (Example)
DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS resources CASCADE; 


CREATE TABLE users ( 
    id SERIAL PRIMARY KEY NOT NULL,   
    name VARCHAR(255) NOT NULL 
    );

CREATE TABLE resources ( 
    id SERIAL PRIMARY KEY NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description 
    );
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY NOT NULL,
--   name VARCHAR(255) NOT NULL, 
--   email VARCHAR(255) NOT NULL,
--   username VARCHAR(255) NOT NULL,
--   password VARCHAR(255) NOT NULL
-- );