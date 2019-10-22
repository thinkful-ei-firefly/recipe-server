CREATE TABLE recipes(
  id SERIAL PRIMARY KEY,
  owner INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  ingregients TEXT[],
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
  food TEXT[]
);
/*
food array setup: [{food name, date added, amount}, {food name, date added, amount}]
*/

