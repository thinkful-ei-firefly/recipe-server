server repo: https://github.com/thinkful-ei-firefly/recipe-server
client repo: https://github.com/thinkful-ei-firefly/recipe-client
Live app: https://good-meal-client.herokuapp.com/

# Good Meal Server

## Endpoints

### Auth /api/auth

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

# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.