# Good Meal Server

<img src="./images/background1.png" alt="Good Meal" width="auto">

server repo: https://github.com/thinkful-ei-firefly/recipe-server
client repo: https://github.com/thinkful-ei-firefly/recipe-client
Live app: https://good-meal-client.herokuapp.com/

## Installation
* clone github repo
* install node dependencies, "npm install"
* move example.env to .env
* create database and replace example names in .env
* migrate database, "npm run migrate"
* run api, "npm start"

## Endpoints

### Auth /api/auth

#### POST '/'

User validation. POST username and passoword. Returns a "bad login request" or an auth token

#### POST '/googlelogin'

User validation, for login with google users.

#### POST '/facebooklogin'

User validation, for login with facebook users.

### Ingredients /api/ingredients

#### GET '/'

Returns the ingredients the user currently has

#### POST '/'

Verifyies and adds an ingredient to a users cabinet/ storage

#### DELETE '/'

Removes all ingredients from a users cabinet

#### DELETE '/:id'

Removes selected ingredient from users cabinet

#### PATCH '/:id'

Edits selected ingredient with new information


### Recipe /api/recipes

#### GET '/'

Returns a user's recipes(id, name, time_to_make, category, description, imageurl, incredients, public )

#### POST '/'

Posts a recipe created by a user.

#### PATCH '/'

#### GET '/pubic'

Gets all recipes where public === true

#### GET '/public/:id'

Gets all details for specified public recipe

#### GET '/:id'

Gets specified recipe owned by that user

#### DELETE '/:id'

Removes specified recipe from users book.

#### PATCH '/:id'

Edits information of specified recipe


### Shopping List /api/list

#### GET '/'

Returns a list of things currently on a users shopping list

#### POST '/'

Adds an item to a users shopping list

#### DELETE '/'

Removes all items from users shopping list

#### DELETE '/crossed'

Removes all crossed off items from a users shopping list

#### PATCH '/:id'

Checks or unchecks selected item from users shopping list

#### DELETE '/:id'

Removes specified item from users shopping list


### Users /api/users

#### POST '/'

Validates login information and creates a new user account

#### POST '/google'

Validates, 1st time login with google, and creates a new user account

#### POST '/facebook'

Validates, 1st time login with facebook, and creates a new user

### Up Load /api/upload




## Technologies Used

HTML5
CSS3
JavaScript

React.js
Node.js
Express
PostgreSQL

AWS
knex
Chai
Mocha
Supertest
XSS
Jason Web Tokens
Axios


