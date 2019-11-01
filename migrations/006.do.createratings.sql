CREATE TABLE ratings (
	id SERIAL PRIMARY KEY,
	recipe_id INTEGER REFERENCES recipes(id),
  user_id INTEGER REFERENCES users(id),
  score INTEGER NOT NULL
);