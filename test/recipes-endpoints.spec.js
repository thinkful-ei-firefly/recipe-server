const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Recipe Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const testRecipes = helpers.makeRecipeArray()
  const testRecipe = testRecipes[0]

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/recipes', () => {
    context('GET All recipes Successful', () => {
      beforeEach('Fill recipe', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Recipe Successful', () => {
        return supertest(app)
          .get('/api/recipes')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

  describe(`POST /api/recipes`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['name', 'description', 'ingredients', 'instructions', 'category', 'time_to_make' ]

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        ...testRecipe
      }
      delete loginAttemptBody.id

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/recipes')
          .set('Authorization', helpers.makeAuthHeader())
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it('Respons 200 when created', () => {
      return supertest(app)
        .post('/api/recipes')
        .set('Authorization', helpers.makeAuthHeader())
        .send(testRecipe)
        .expect(200)
    })
  })

  describe('GET /api/recipes/:id', () => {
    context('GET specific recipe Successful', () => {
      beforeEach('Fill recipe', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Recipe unsuccessful', () => {
        return supertest(app)
          .get('/api/recipes/2')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(400)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })

      it('Recipe Successful', () => {
        return supertest(app)
          .get('/api/recipes/1')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

  describe('PATCH /:id', () => {
    context('PATCH recipe Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Respons 200 when modified', () => {
        const newProduct = {
            name: 'Food 3',
            public: true,
            category: 'Thai 1',
            imageurl: 'image2.png',
            description: 'desc 3',
            ingredients: '{"Ingredient 111" , "Ingredient 222"}',
            instructions: '{"Instruction 111" , "Instruction 222"}',
            time_to_make: 5
        }
        return supertest(app)
          .patch('/api/recipes/1')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(204)
          .expect(res => {

          })
      })
    })
  })

  describe('DELETE /api/recipes/:id', () => {
    context('DELETE recipe Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Ingredient deleted failed', () => {
        return supertest(app)
          .delete('/api/recipes/2')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(404)
      })

      it('Ingredient deleted successful', () => {
        return supertest(app)
          .delete('/api/recipes/1')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(204)
      })
    })
  })

  describe('GET /api/recipes/public', () => {
    context('GET All public recipes Successful', () => {
      beforeEach('Fill recipe', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Recipe Successful', () => {
        return supertest(app)
          .get('/api/recipes/public')
          .expect(200)
        /*.expect(res => {
          console.log(res.body);
        })*/
      })
    })
  })

  describe('GET /api/recipes/public/:id', () => {
    context('GET specific public recipe Successful', () => {
      beforeEach('Fill recipe', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Public recipe unsuccessful', () => {
        return supertest(app)
          .get('/api/recipes/public/2')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(400)
      })

      it('Public recipe Successful', () => {
        return supertest(app)
          .get('/api/recipes/public/1')
          .set('Authorization', helpers.makeAuthHeader())
          .expect(200)
      })
    })
  })

  describe('POST /api/recipes/clone', () => {
    context('POST recipe Successful', () => {
      beforeEach('Fill roles', () => {
        return helpers.seedUsers(db, testUsers)
          .then(() => helpers.seedRecipes(db, testRecipes))
      })

      it('Respons 400 when no id', () => {
        const newProduct = {
        }
        return supertest(app)
          .post('/api/recipes/clone')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(400)
      })

      it('Respons 200 when modified', () => {
        const newProduct = {
            id:1
        }
        return supertest(app)
          .post('/api/recipes/clone')
          .set('Authorization', helpers.makeAuthHeader())
          .send(newProduct)
          .expect(200)
          .expect(res => {

          })
      })
    })
  })

})
