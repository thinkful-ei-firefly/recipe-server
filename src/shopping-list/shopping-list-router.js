const express = require('express');
const xss = require('xss');

const ShoppingListService = require('./shopping-list-service')
const { requireAuth } = require('../middleware/jwt-auth');

const shoppingListRouter = express.Router();
const jsonBodyParser = express.json();

shoppingListRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    ShoppingListService.getUsersList(req.app.get('db'), req.user.id)
      .then(list => res.json(list))
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
    ShoppingListService.addItem(req.app.get('db'), newIngredient)
      .then(item => res.json(item))
      .catch(next)
  })  
  .delete(requireAuth, (req, res, next) => {
    ShoppingListService.deleteList(req.app.get('db'), req.user.id)
      .then(deleted => {
        if (!deleted) return res.status(404).json({ error: 'User has no list to delete'})
        return res.status(204).end()
      })
      .catch(next)
  })

shoppingListRouter
.route('/crossed')
.delete(requireAuth, (req, res, next) => {
  ShoppingListService.deleteCrossed(req.app.get('db'), req.user.id)
    .then(deleted => res.status(204).end())
    .catch(next)
})

shoppingListRouter
  .route('/:id')
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const {crossed} = req.body
    if (crossed === true) {
      ShoppingListService.strikeItem(req.app.get('db'), req.params.id)
        .then(crossed => {
          if (!crossed) return res.status(404).json({ error: 'shopping list item not found' })
          return res.status(204).end()
        })
        .catch(next)
    } else if (crossed === false) {
      ShoppingListService.unstrikeItem(req.app.get('db'), req.params.id)
        .then(crossed => {
          if (!crossed) return res.status(404).json({ error: 'shopping list item not found' })
          return res.status(204).end()
        })
        .catch(next)
    } else {
      return res.status(400).json({ error: 'Request must include the key "crossed" with a value of true or false'})
    }
  })
  .delete(requireAuth, (req, res, next) => {
    ShoppingListService.deleteItem(req.app.get('db'), req.params.id, req.user.id)
      .then(deleted => {
        if (!deleted) return res.status(404).json({ error: 'shopping list item not found' })
        return res.status(204).end()
      })
      .catch(next)
  })

  module.exports = shoppingListRouter;