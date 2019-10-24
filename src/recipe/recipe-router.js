const express = require('express');
const xss = require('xss');

const RecipeService = require('./recipe-service')
const { requireAuth } = require('../middleware/jwt-auth');

const recipeRouter = express.Router();
const jsonBodyParser = express.json();

recipeRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    RecipeService.getUsersRecipes(req.app.get('db'), req.user.id)
      .then(recipes => res.json(recipes))
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const unverifiedRecipe = req.body;
    const requiredKeys = ['name', 'ingredients', 'instructions', 'time_to_make', 'imageurl', 'public', 'category', 'description']
    requiredKeys.forEach(key => {
      if (!(key in req.body)) {
        return res.status(400).json({ error: 'Request body must include '+key})
      }
    })
    const recipe = {
      owner: req.user.id
    }
    requiredKeys.forEach(key => {
      if (key in req.body) {
        recipe[key] = xss(unverifiedRecipe[key])
      }
    })
    RecipeService.addRecipe(req.app.get('db'), recipe)
      .then(newItem => res.json(newItem))
      .catch(next)
  })

recipeRouter
  .route('/:id')
  .get((req, res, next) => {
    RecipeService.getRecipeById(req.app.get('db'), req.params.id)
      .then(recipe => {
        if(!recipe) return res.status(404).json({ error: 'Found no recipe with that id'})
        return res.json(recipe)
      })
      .catch(next)
  })
  .delete(requireAuth, (req, res, next) => {
    RecipeService.deleteRecipe(req.app.get('db'), req.params.id, req.user.id)
      .then((deleted) => {
        if (!deleted) return res.status(404).json({ error: 'Found no recipe with that id' })
        return res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const unverifiedRecipe = req.body;
    let recipe = {}
    const possibleKeys = ['name', 'ingredients', 'instructions', 'time_to_make', 'category', 'description']
    possibleKeys.forEach(key => {
      if (key in req.body) {
        recipe[key] = xss(unverifiedRecipe[key])
      }
    })
    RecipeService.editRecipe(req.app.get('db'), req.params.id, req.user.id, recipe)
      .then((edited) => {
        console.log(edited)
        if (!edited) return res.status(404).json({ error: 'Found no recipe with that id' })
        return res.status(204).end()
      })
      .catch(next)
  })

  module.exports = recipeRouter;
