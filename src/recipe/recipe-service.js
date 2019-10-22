/**
 * Needs testing
 */

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
  getAllRecipes(db, index){
    return db('recipes')
      .select('*')
  },
  createRecipe(db, object, id){
    return db.into('recipes').insert(
      {owner: id,
      name: object.name,
      category: object.category,
      description: object.description,
      ingredients: object.ingredients,
      instructions: object.instructions,
      time_to_make: object.time_to_make}
    )
  },
  getMyRecipes(db, array){
    let ret = []
    array.map(id => {
      ret.push(db('recipes').where({id}))
    })
    return ret
  },
  getUser(db, id){
    return db('users')
      .where({id})
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