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
    const requiredKeys = ['name', 'amount', 'unit']
    requiredKeys.forEach(key => {
      if (!(key in req.body)) {
        return res.status(400).json({ error: 'Request body must include '+key})
      }
    })
    const newIngredient = {
      owner: req.user.id
    }
    requiredKeys.forEach(key => {
      if (key in req.body) {
        newIngredient[key] = xss(unverifiedIngredient[key])
      }
    })
    IngredientsService.addIngredient(req.app.get('db'), newIngredient)
      .then(ingredient => res.json(ingredient))
      .catch(next)
  })

  module.exports = ingredientsRouter;
