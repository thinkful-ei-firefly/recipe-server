

const RecipeService = {
  getRecipeByName(db, name){
    return db('recipes')
      .where({name})
      .first()
  }

}

module.exports = RecipeService