/**
 * Needs testing
 */

const RecipeService = {
  getRecipeByName(db, name){
    return db('recipes')
      .where({name})
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
  }

}

module.exports = RecipeService