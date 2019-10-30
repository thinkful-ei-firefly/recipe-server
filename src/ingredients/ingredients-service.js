
const IngredientsService = {
  getUsersIngredients(db, user_id) {
    return db('pantry')
      .select('*')
      .where({ owner: user_id })
  },
  addIngredient(db, ingredient) {
    return db('pantry')
      .insert(ingredient)
      .returning('*')
      .then(ingredients => ingredients[0])
  },
  addMultipleIngredient(db, ingredients) {
    return db('pantry')
      .insert(ingredients)
      .returning('*')
      .then(ingredients => ingredients)
  },
  removeIngredient(db, id, user_id) {
    return db('pantry')
      .delete()
      .where({ id, owner: user_id })
  },
  editIngredient(db, id, user_id, newInfo) {
    return db('pantry')
      .update(newInfo)
      .where({ id, owner: user_id })
  },
  deleteUsersIngredients(db, user_id) {
    return db('pantry')
      .delete()
      .where({ owner: user_id })
  }
}

module.exports = IngredientsService
