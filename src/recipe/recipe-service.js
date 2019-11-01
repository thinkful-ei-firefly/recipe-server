const RecipeService = {
  getUsersRecipes(db, user_id) {
    return db('recipes')
      .select('id', 'name', 'time_to_make', 'category', 'description', 'imageurl', 'ingredients', 'public')
      .where({ owner: user_id })
  },
  getPublic(db){
    return db('recipes')
      .select('id', 'name', 'time_to_make', 'category', 'description', 'imageurl', 'ingredients', 'public', 'rating')
      .where({public: true})
  },
  getRecipeById(db, id) {
    return db('recipes')
      .where({id})
      .first()
  },
  getAllRecipes(db){
    return db('recipes')
      .select('*')
  },
  getUser(db, id){ //should be in different service file
    return db('users')
      .where({id})
  },
  addRecipe(db, recipe) {
    return db('recipes')
      .insert(recipe)
      .returning('*')
      .then(recipe => recipe[0])
  },
  deleteRecipe(db, id, user_id) {
    return db('recipes')
      .delete()
      .where({ id, owner: user_id })
  },
  editRecipe(db, id, user_id, newInfo) {
    return db('recipes')
      .update(newInfo)
      .where({ id, owner: user_id })
  },
  editRecipeRating(db, id, newInfo) {
    return db('recipes')
      .update(newInfo)
      .where({ id })
  },
  getRating(db, id) {
    return db('recipes')
      .select('rating', 'times_rated')
      .where({ id })
      .first()
  }
}

module.exports = RecipeService