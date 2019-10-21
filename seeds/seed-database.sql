BEGIN;

TRUNCATE
  "table",
  "language",
  "user";
INSERT INTO table(id, title, ingredients) VALUES
(),
()



SELECT setval('table_id_seq', (SELECT MAX(id) from "table"));

COMMIT;
