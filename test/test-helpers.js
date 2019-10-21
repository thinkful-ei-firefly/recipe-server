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

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
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

/**
 * generate fixtures of languages and words for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(languages, words)} - arrays of languages and words
 */

function makeRecipeArray(){
  return [
    {
      id: 1,
      owner: 1,
      name: 'Food 1',
      ingregients: '{"Ingredient 1" , "Ingredient 2"}',
      instructions: '{"Instruction 1" , "Instruction 2"}',
      time_to_make: 4
    },
    {
      id: 2,
      owner: 2,
      name: 'Food 2',
      ingregients: '{"Ingredient 2-1" , "Ingredient 2-2"}',
      instructions: '{"Instruction 2-1" , "Instruction 2-2"}',
      time_to_make: 2
    }
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  console.log(process.env.JWT_SECRET);
  console.log(user);
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "users",
        "recipes",
        "ingredients"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE recipes_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE ingredients_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('recipes_id_seq', 0)`),
          trx.raw(`SELECT setval('ingredients_id_seq', 0)`),
        ])
      )
  )
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10)
  }))
  return db.transaction(async trx => {
    await trx.into('users').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

/**
 * seed the databases with words and update sequence counter
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @param {array} languages - array of languages objects for insertion
 * @param {array} words - array of words objects for insertion
 * @returns {Promise} - when all tables seeded
 */
/*async function seedUsersLanguagesWords(db, users, languages, words) {
  await seedUsers(db, users)

  await db.transaction(async trx => {
    await trx.into('language').insert(languages)
    await trx.into('word').insert(words)

    const languageHeadWord = words.find(
      w => w.language_id === languages[0].id
    )

    await trx('language')
      .update({ head: languageHeadWord.id })
      .where('id', languages[0].id)

    await Promise.all([
      trx.raw(
        `SELECT setval('language_id_seq', ?)`,
        [languages[languages.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('word_id_seq', ?)`,
        [words[words.length - 1].id],
      ),
    ])
  })
}*/

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeRecipeArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  //seedUsersLanguagesWords,
}
