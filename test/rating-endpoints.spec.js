const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Rating Endpoints', function () {
    let db

    const testUsers = helpers.makeUsersArray()
    const testRecipes = helpers.makeRecipeArray()
    const testRatings = helpers.makeRatingArray()

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/ratings/:recipe_id`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
                .then(() => helpers.seedRecipes(db, testRecipes))
                .then(() => helpers.seedRatings(db, testRatings))
        )

        it(`responds with 404 when recipe not found`, () => {
            const loginAttemptBody = {}

            return supertest(app)
                .post('/api/ratings/1')
                //.set('Authorization', helpers.makeAuthHeader())
                .send(loginAttemptBody)
                .expect(400, {
                    error: `Request must include a rating key`,
                })
        })

        it(`responds with 400 required error when 'rating' is missing`, () => {
            const loginAttemptBody = {}

            return supertest(app)
                .post('/api/ratings/2')
                //.set('Authorization', helpers.makeAuthHeader())
                .send(loginAttemptBody)
                .expect(400, {
                    error: `Request must include a rating key`,
                })
        })

        it('Respons 200 when created', () => {
            const test = {rating: 2}
            return supertest(app)
                .post('/api/ratings/2')
                //.set('Authorization', helpers.makeAuthHeader())
                .send(test)
                .expect(200)
                /*.expect(res => {
                console.log(res.body);
                })*/
        })
    })

})
