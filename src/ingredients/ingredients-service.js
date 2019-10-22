
const IngredientsService = {
  getUsersIngredients(db, user_id) {
    return db('ingredients')
      .select('*')
      .where({ owner: user_id })
  },
  addIngredient(db, ingredient) {
    return db('ingredients')
      .insert(ingredient)
      .returning('*')
      .then(ingredients => ingredients[0])
  }
}

module.exports = IngredientsService