const express = require('express');
const xss = require('xss');

const IngredientsService = require('./ingredients-service')
const { requireAuth } = require('../middleware/jwt-auth');

const ingredientsRouter = express.Router();
const jsonBodyParser = express.json();

ingredientsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    IngredientsService.getUsersIngredients(req.app.get('db'), req.user.id)
      .then(ingredients => res.json(ingredients))
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const unverifiedIngredient = req.body
    IngredientsService.addIngredient(req.app.get('db'), newIngredient)
  })

  module.exports = recipeRouter;
