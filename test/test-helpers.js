const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
    },
  ]
}

function makeRecipeArray(){
  return [
    {
      id: 1,
      owner: 1,
      name: 'Food 1',
      ingredients: '{"Ingredient 1" , "Ingredient 2"}',
      instructions: '{"Instruction 1" , "Instruction 2"}',
      time_to_make: 4
    },
    {
      id: 2,
      owner: 2,
      name: 'Food 2',
      ingredients: '{"Ingredient 2-1" , "Ingredient 2-2"}',
      instructions: '{"Instruction 2-1" , "Instruction 2-2"}',
      time_to_make: 2
    }
  ]
}

function makePantryArray(){
  return [
    {
      id: 1,
      owner: 2,
      name: 'Sugar',
      amount: '1/8',
      unit: 'cup'
    },
    {
      id: 2,
      owner: 1,
      name: 'Salt',
      amount: '1/4',
      unit: 'Tbs'
    }
  ]
}

function makeRatingArray(){
  return [
    {
      id: 1,
      recipe_id: 2,
      user_id: 1,
      score: 2
    },
    {
      id: 2,
      recipe_id: 2,
      user_id: 1,
      score: 3
    },
    {
      id: 3,
      recipe_id: 2,
      user_id: 1,
      score: 4
    }
  ]
}

/*function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  console.log(process.env.JWT_SECRET);
  console.log(user);
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}*/

function makeAuthHeader(userAux, secret = process.env.JWT_SECRET) {
  let user = makeUsersArray()[0];
  user.id=1;
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "users",
        "recipes",
        "pantry",
        "shopping_list",
        "ratings"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE recipes_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE pantry_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE shopping_list_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE ratings_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('recipes_id_seq', 0)`),
          trx.raw(`SELECT setval('pantry_id_seq', 0)`),
          trx.raw(`SELECT setval('shopping_list_id_seq', 0)`),
          trx.raw(`SELECT setval('ratings_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }))
  return db
    .into('users')
    .insert(preppedUsers);
}

function seedIngredients(db, ingredients) {
  return db
    .into('pantry')
    .insert(ingredients);
}

function seedRecipes(db, recipes) {
  return db
    .into('recipes')
    .insert(recipes);
}

function seedRatings(db, ratings) {
  return db
    .into('ratings')
    .insert(ratings);
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeRecipeArray,
  makePantryArray,
  makeRatingArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedIngredients,
  seedRecipes,
  seedRatings
}
