ALTER TABLE users
ADD recipes INTEGER[] REFERENCES recipes(id);