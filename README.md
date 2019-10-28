server repo: https://github.com/thinkful-ei-firefly/recipe-server
client repo: https://github.com/thinkful-ei-firefly/recipe-client
Live app: https://good-meal-client.herokuapp.com/

# Good Meal Server

## Endpoints

### Auth /api/auth

user validation. POST username and passoword. Returns a "bad login request" or an auth token

### Ingredients /api/ingredients

### Recipe /api/recipes

#### '/' get

Returns a user's recipes(id, name, time_to_make, category, description, imageurl, incredients, public )

#### '/' post

Posts a recipe created by a user.

#### '/' patch

#### '/pubic' get

Gets all recipes where public === true

#### '/:id' get

#### '/:id' delete

### Shopping List /api/list

### Users /api/list

### Up Load /api/upload

