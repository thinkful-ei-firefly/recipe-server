const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('User Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  /**
   * @description Register a users and populate their fields
   **/
  describe(`POST /api/users`, () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        user_name: 'test user_name',
        password: 'test password'
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/users')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
      const userShortPassword = {
        user_name: 'test user_name',
        password: '1234567'
      }
      return supertest(app)
        .post('/api/users')
        .send(userShortPassword)
        .expect(400, { error: `Password must be between 8 and 72 characters` })
    })

    it(`responds 400 'Password be less than 72 characters' when long password`, () => {
      const userLongPassword = {
        user_name: 'test user_name',
        password: '*'.repeat(73)
      }
      return supertest(app)
        .post('/api/users')
        .send(userLongPassword)
        .expect(400, { error: `Password must be between 8 and 72 characters` })
    })

    it(`responds 400 error when password starts with spaces`, () => {
      const userPasswordStartsSpaces = {
        user_name: 'test user_name',
        password: ' 1Aa!2Bb@'
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 error when password ends with spaces`, () => {
      const userPasswordEndsSpaces = {
        user_name: 'test user_name',
        password: '1Aa!2Bb@ '
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: `Password must not start or end with empty spaces` })
    })

    it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
      const duplicateUser = {
        user_name: testUser.user_name,
        password: '11AAaa!!',
      }
      return supertest(app)
        .post('/api/users')
        .send(duplicateUser)
        .expect(400, { error: `That username is already taken` })
    })
  })
  describe(`POST /api/users/google`, () => {
    beforeEach('insert google users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['token', 'isNewUser', 'fullName', 'email', 'accountCreated', 'lastLogin']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        token: 'ssfdfsdfsdfsdfs',
        isNewUser: true,
        fullName: 'Nameee',
        email: 'fsdfs@fdsf.com',
        accountCreated: 'today',
        lastLogin: 'yesterday'
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/users/google')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
      const duplicateUser = {
        token: 'ssfdfsdfsdfsdfs',
        isNewUser: true,
        fullName: 'Nameee',
        email: testUser.user_name,
        accountCreated: 'today',
        lastLogin: 'yesterday'
      }
      return supertest(app)
        .post('/api/users/google')
        .send(duplicateUser)
        .expect(400, { error: `That username is already taken` })
    })
  })
  describe(`POST /api/users/facebook`, () => {
    beforeEach('insert google users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['token', 'isNewUser', 'fullName', 'email', 'accountCreated', 'lastLogin']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        token: 'ssfdfsdfsdfsdfs',
        isNewUser: true,
        fullName: 'Nameee',
        email: 'fsdfs@fdsf.com',
        accountCreated: 'today',
        lastLogin: 'yesterday'
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field]

        return supertest(app)
          .post('/api/users/facebook')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
      const duplicateUser = {
        token: 'ssfdfsdfsdfsdfs',
        isNewUser: true,
        fullName: 'Nameee',
        email: testUser.user_name,
        accountCreated: 'today',
        lastLogin: 'yesterday'
      }
      return supertest(app)
        .post('/api/users/facebook')
        .send(duplicateUser)
        .expect(400, { error: `That username is already taken` })
    })
  })
})
