const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Ingredient Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testIngredients = helpers.makePantryArray()
  const testIngredient = testIngredients[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/ingredients', () => {
    context('GET All ingredients Successful', () => {
      beforeEach('Fill ingredient', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedIngredients(db, testIngredients))
      })

      it('Ingredient Successful', () => {
        return supertest(app)
          .get('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

  describe(`POST /api/ingredients`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['name', 'amount', 'unit']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        ...testIngredient
      }
      delete loginAttemptBody.id

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader())
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it('Respons 200 when created', () => {
      return supertest(app)
        .post('/api/ingredients')
        .set('Authorization', helpers.makeAuthHeader())
        .send(testIngredient)
        .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
    })
  })

  describe.only('PATCH /:id', () => {
    context('PATCH Product Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedIngredients(db, testIngredients))
      })

      it('Respons 200 when modified', () => {
        const newProduct = {
          name: 'Sugar 1',
          amount: '1/81',
          unit: 'cupa'
        }
        return supertest(app)
          .patch('/api/ingredients/2')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(204)
          .expect(res => {

          })
      })
    })
  })

  describe('DELETE /api/ingredients', () => {
    context('DELETE ingredient Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedIngredients(db, testIngredients))
      })

      it('Ingredient deleted successful', () => {
        return supertest(app)
          .delete('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

  describe('DELETE /api/ingredients/:id', () => {
    context('DELETE ingredient Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedIngredients(db, testIngredients))
      })

      it('Ingredient deleted failed', () => {
        return supertest(app)
          .delete('/api/ingredients/1')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(404)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })

      it('Ingredient deleted successful', () => {
        return supertest(app)
          .delete('/api/ingredients/2')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

})
