

const RecipeService = {
  getUsersRecipes(db, user_id) {
    return db('recipes')
      .select('id', 'name', 'time_to_make')
      .where({ owner: user_id })
  },
  getRecipeById(db, id) {
    return db('recipes')
      .where({id})
      .first()
  },
  addRecipe(db, recipe) {
    return db('recipes')
      .insert(recipe)
      .returning('*')
      .then(recipe => recipe[0])
  },
  deleteRecipe(db, id) {
    return db('recipes')
      .delete()
      .where({ id })
  },
  editRecipe(db, id, newInfo) {
    return db('recipes')
      .update(newInfo)
      .where({ id })
  },
}

module.exports = RecipeService