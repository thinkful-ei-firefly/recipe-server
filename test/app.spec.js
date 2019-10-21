const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 and the string "TEST"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'TEST');
  })
})