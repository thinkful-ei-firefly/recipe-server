server repo: https://github.com/thinkful-ei-firefly/recipe-server
client repo: https://github.com/thinkful-ei-firefly/recipe-client
Live app: https://good-meal-client.herokuapp.com/

# Good Meal Server

## Endpoints

### Auth /api/auth

#### '/' post

User validation. POST username and passoword. Returns a "bad login request" or an auth token

### Ingredients /api/ingredients

#### '/' get

Returns the ingredients the user currently has

#### '/' post

Verifys and adds an ingredient to a users cabinet/ storage

#### '/' delete

Removes all ingredients from a users cabinet

#### '/:id' delete

Removes selected ingredient from users cabinet

#### '/:id' patch

Edits selected ingredient with new information

### Recipe /api/recipes

#### '/' get

Returns a user's recipes(id, name, time_to_make, category, description, imageurl, incredients, public )

#### '/' post

Posts a recipe created by a user.

#### '/' patch

#### '/pubic' get

Gets all recipes where public === true

#### '/public/:id'

Gets all details for specified public recipe

#### '/:id' get

Gets specified recipe owned by that user

#### '/:id' delete

Removes specified recipe from users book.

#### '/:id' patch

Edits information of specified recipe

### Shopping List /api/list

#### '/' GET

Returns a list of things currently on a users shopping list

#### '/' POST

Adds an item to a users shopping list

#### '/' DELETE

Removes all items from users shopping list

#### '/crossed' DELETE

Removes all crossed off items from a users shopping list

#### '/:id' PATCH

Checks or unchecks selected item from users shopping list

#### '/:id' DELETE

Removes specified item from users shopping list

### Users /api/list



### Up Load /api/upload

