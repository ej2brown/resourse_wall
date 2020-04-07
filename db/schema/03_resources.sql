CREATE TABLE resources ( 
    id SERIAL PRIMARY KEY NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    url VARCHAR(255) NOT NULL
    );