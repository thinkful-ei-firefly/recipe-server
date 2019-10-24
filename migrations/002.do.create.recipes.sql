CREATE TABLE recipes(
  id SERIAL PRIMARY KEY,
  owner INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  public BOOL DEFAULT FALSE,
  cuisine TEXT,
  imageURL TEXT,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  date_added DATE DEFAULT CURRENT_TIMESTAMP,
  time_to_make INTEGER
);
/*
ingredients array setup: ["food item, amount", "food item, amount", etc]
text array setup: [step 1, step 2, etc]
*/

CREATE TABLE ingredients(
  id SERIAL PRIMARY KEY,
  owner INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  amount INT NOT NULL,
  unit TEXT NOT NULL,
  date_added DATE DEFAULT CURRENT_TIMESTAMP
);

