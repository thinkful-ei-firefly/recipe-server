process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
//process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '3m'
process.env.DATABASE_URL = 'postresql://postgres@localhost/recipedb-test'

require('dotenv').config()

const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
