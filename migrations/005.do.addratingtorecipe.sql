ALTER TABLE recipes
ADD rating NUMERIC DEFAULT 0;
ALTER TABLE recipes
ADD times_rated INT DEFAULT 0;