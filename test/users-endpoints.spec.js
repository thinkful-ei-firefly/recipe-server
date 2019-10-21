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
            error: `Missing '${field}' in requrest`,
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

    /*it(`responds 400 error when password isn't complex enough`, () => {
      const userPasswordNotComplex = {
        user_name: 'test user_name',
        password: '11AAaabb'
      }
      return supertest(app)
        .post('/api/users')
        .send(userPasswordNotComplex)
        .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
    })*/

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

    describe(`Given a valid users`, () => {
      it(`responds 201, serialized users with no password`, () => {
        const newUser = {
          user_name: 'test user_name',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            console.log('sdfsdfsdfsd',res.body);
            expect(res.body).to.have.property('id')
            expect(res.body.user_name).to.eql(newUser.user_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
      })

      it(`stores the new users in db with bcryped password`, () => {
        const newUser = {
          user_name: 'test user_name',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name)
                expect(row.name).to.eql(newUser.name)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})
