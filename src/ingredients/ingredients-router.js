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

ingredientsRouter
  .route('/:id')
  .delete(requireAuth, (req,res, next) => {
    IngredientsService.removeIngredient(req.app.get('db'), req.params.id, req.user.id)
      .then((deleted) => {
        if (!deleted) return res.status(404).json({ error: 'Found no ingredient with that id' })
        return res.status(204).end()
      })
      .catch(next)
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const unverifiedIngredient = req.body;
    let ingredient = {}
    const possibleKeys = ['name', 'amount', 'unit']
    possibleKeys.forEach(key => {
      if (key in req.body) {
        ingredient[key] = xss(unverifiedIngredient[key])
      }
    })
    IngredientsService.editIngredient(req.app.get('db'), req.params.id, req.user.id, ingredient)
      .then((edited) => {
        console.log(edited)
        if (!edited) return res.status(404).json({ error: 'Found no ingredient with that id' })
        return res.status(204).end()
      })
      .catch(next)
  })

  module.exports = ingredientsRouter;
