const RecipeService = {
  getRecipesRatings(db, recipe_id) {
    return db('ratings')
      .select('*')
      .where({ recipe_id })
  },
  checkRatingExists(db, user_id, recipe_id) {
    return db('ratings')
      .select('*')
      .where({ recipe_id, user_id })
      .first()
  },
  updateRating(db, id, newRating) {
    return db('ratings')
      .update(newRating)
      .where({ id })
      .returning('*')
      .then(newRating => newRating[0])
  },
  addRating(db, newRating) {
    return db('ratings')
      .insert(newRating)
      .returning('*')
      .then(newRating => newRating[0])
  }
}

module.exports = RecipeService