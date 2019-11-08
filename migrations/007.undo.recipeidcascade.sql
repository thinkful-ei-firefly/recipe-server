BEGIN;
ALTER TABLE ratings DROP CONSTRAINT ratings_recipe_id_fkey;
ALTER TABLE ratings ADD FOREIGN KEY (recipe_id) REFERENCES recipes(id);
COMMIT;