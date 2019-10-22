
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
  },
  removeIngredient(db, id, user_id) {
    return db('ingredients')
      .delete()
      .where({ id, owner: user_id })
  },
  editIngredient(db, id, user_id, newInfo) {
    return db('ingredients')
      .update(newInfo)
      .where({ id, owner: user_id })
  },
}

module.exports = IngredientsService