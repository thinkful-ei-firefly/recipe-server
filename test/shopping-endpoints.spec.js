const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Shopping Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testShoppings = helpers.makeShoppingArray()
  const testShopping = testShoppings[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/list', () => {
    context('GET All shopping lists Successful', () => {
      beforeEach('Fill shopping list', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Shopping Successful', () => {
        return supertest(app)
          .get('/api/list')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(200)
      })
    })
  })

  describe(`POST /api/list`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['name', 'amount', 'unit']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        ...testShopping
      }
      delete loginAttemptBody.id

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/list')
          .set('Authorization', helpers.makeAuthHeader())
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it('Respons 200 when created', () => {
      return supertest(app)
        .post('/api/list')
        .set('Authorization', helpers.makeAuthHeader())
        .send(testShopping)
        .expect(200)
    })
  })

  describe('PATCH /:id', () => {
    context('PATCH Product Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Respons 400 when no crossed', () => {
        const newProduct = {
          name: 'Sugar 1',
          amount: '1/81',
          unit: 'cupa',
        }
        return supertest(app)
          .patch('/api/list/2')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(400)
      })

      it('Respons 200 when modified', () => {
        const newProduct = {
          name: 'Sugar 1',
          amount: '1/81',
          unit: 'cupa',
          crossed: false,
        }
        return supertest(app)
          .patch('/api/list/2')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(204)
          .expect(res => {

          })
      })
    })
  })

  describe('DELETE /api/list', () => {
    context('DELETE shopping list Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Shopping deleted successful', () => {
        return supertest(app)
          .delete('/api/list')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
      })
    })
  })

  describe('DELETE /api/list/crossed', () => {
    context('DELETE shopping list crossed Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Shopping deleted successful', () => {
        return supertest(app)
          .delete('/api/list/crossed')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
      })
    })
  })

  describe('DELETE /api/list/movetopantry', () => {
    context('DELETE shopping list movetopantry Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Shopping movetopantry successful', () => {
        return supertest(app)
          .post('/api/list/movetopantry')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
      })
    })
  })

  describe('DELETE /api/list/:id', () => {
    context('DELETE shopping list Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedShopping(db, testShoppings))
      })

      it('Shopping deleted failed', () => {
        return supertest(app)
          .delete('/api/list/1')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(404)
      })

      it('Shopping deleted successful', () => {
        return supertest(app)
          .delete('/api/list/2')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
      })
    })
  })

})
