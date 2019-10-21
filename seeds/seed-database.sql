BEGIN;

TRUNCATE
  "users",
  "recipes",
  "ingredients";

INSERT INTO users(id, user_name, password) VALUES
  (
    1,
    'admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    2,
    'demo',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO recipes(id, owner, name, ingregients, instructions, time_to_make) VALUES
  (
    1,
    1,
    'Garlic and Onion Burgers',
    '{"2 pounds ground beef",
    "1 tablespoon Worcestershire sauce",
    "3 cloves garlic, minced",
    "1/2 cup minced onion"}',
    '{"In a large bowl, mix together the beef, Worcestershire sauce, garlic, onion, salt, pepper and Italian seasoning. Refrigerate for 2 to 4 hours.",
    "Preheat grill for high heat.",
    "Form burgers into 1/2 inch thick patties. Lightly oil grate. Place burgers on grill. Cook for approximately 6 minutes, turning once."}',
    4
  ),
  (
    2,
    2,
    'Grilled Chicken Teriyaki',
    '{"12 bamboo skewers",
    "2 pounds skinless, boneless chicken thighs",
    "1/2 cup soy sauce",
    "1/2 cup sake"}',
    '{"Soak bamboo skewers in water.",
    "Combine mayonnaise, sour cream, buttermilk, and miso in a bowl. Add green onion, garlic, tarragon, dill, and chives. Season with black pepper and cayenne. Whisk dressing until thoroughly combined.",
    "Thread chicken pieces onto skewers. Strain marinade into a saucepan and bring to a boil to make the glaze.",
    "Preheat a grill for medium-high heat. Grill skewers, basting with some of the reserved marinade, until meat firms up and springs back to the touch, 4 to 5 minutes per side."}',
    5
  ),
  (
    3,
    1,
    'Lasagna Alfredo',
    '{"1 (16 ounce) package lasagna noodles",
    "1 (10 ounce) package frozen chopped spinach",
    "3 cooked, boneless chicken breast halves, diced",
    "2 (16 ounce) jars Alfredo-style pasta sauce",
    "4 cups shredded mozzarella cheese"}',
    '{"Preheat oven to 350 degrees F (175 degrees C).",
    "Bring a large pot of lightly salted water to a boil. Add pasta and cook for 8 to 10 minutes or until al dente; drain. Cook spinach according to package directions; drain.",
    "In a medium bowl, combine chicken and one jar of Alfredo sauce, stir together. In a separate bowl, combine ricotta and drained, cooked spinach, and stir.",
    "Bake 50 to 60 minutes, until top is brown and bubbly."}',
    4
  );

SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));
SELECT setval('recipes_id_seq', (SELECT MAX(id) from "recipes"));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) from "ingredients"));

COMMIT;
