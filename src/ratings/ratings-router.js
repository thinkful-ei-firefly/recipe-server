const express = require('express');
const xss = require('xss');

const RatingsService = require('./ratings-service')
const RecipeService = require('../recipe/recipe-service')
const { requireAuth } = require('../middleware/jwt-auth');

const ratingsRouter = express.Router();
const jsonBodyParser = express.json();

ratingsRouter
  .route('/:recipe_id')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { rating } = req.body
    if (!rating) return res.status(400).json({ error: "Request must include a rating key"})
    if (isNaN(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be a number between 1 and 5"})
    newRating = {
      score: xss(rating),
      user_id: req.user.id,
      recipe_id: req.params.recipe_id
    }
    RatingsService.checkRatingExists(req.app.get('db'), req.user.id, req.params.recipe_id)
      .then(rating => {
        if(rating) {
          const oldRating = rating.score
          RatingsService.updateRating(req.app.get('db'), rating.id, newRating)
            .then(updatedRating => {
              RecipeService.getRating(req.app.get('db'), req.params.recipe_id)
                .then(recipe => {
                  const newRating = {
                    rating: (recipe.rating * recipe.times_rated + updatedRating.score - oldRating)/(recipe.times_rated)
                  }
                  RecipeService.editRecipeRating(req.app.get('db'), req.params.recipe_id, {name: 4})
                    .then(recipe => res.json(newRating))
                })
            })
        } else {
          RatingsService.addRating(req.app.get('db'), newRating)
            .then(addedRating => {
              RecipeService.getRating(req.app.get('db'), req.params.recipe_id)
                .then(recipe => {
                  const newRating = {
                    rating: (recipe.rating * recipe.times_rated + addedRating.score)/(recipe.times_rated + 1),
                    times_rated: recipe.times_rated + 1
                  }
                  RecipeService.editRecipeRating(req.app.get('db'), req.params.recipe_id, newRating)
                    .then(recipe => res.json(newRating))
                })
            })
        }
      })
      .catch(next)
  })

module.exports = ratingsRouter;