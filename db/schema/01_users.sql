-- Drop and recreate Users table (Example)
<<<<<<< HEAD
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
=======
DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS resources CASCADE; 
DROP TABLE IF EXISTS categories CASCADE; 
DROP TABLE IF EXISTS likes CASCADE; 

>>>>>>> 0d4d40d416153ce572c73a5ab014e3e53693f0b5

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    );

CREATE TABLE categories (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
    );

CREATE TABLE resources (
    id SERIAL PRIMARY KEY NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    url VARCHAR(255) NOT NULL
    );


<<<<<<< HEAD
-- CREATE TABLE likes (
--     id SERIAL PRIMARY KEY NOT NULL,
--     user_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
--     resource_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
-- );
=======
CREATE TABLE likes ( 
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    resource_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);
>>>>>>> 0d4d40d416153ce572c73a5ab014e3e53693f0b5
