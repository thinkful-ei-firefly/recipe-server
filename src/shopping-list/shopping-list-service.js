const ShoppingListService = {
  getUsersList(db, user_id) {
    return db('shopping_list')
      .select('*')
      .where({ owner: user_id })
  },
  addItem(db, newItem) {
    return db('shopping_list')
      .insert(newItem)
      .returning('*')
      .then(item => item[0])
  },
  strikeItem(db, id) {
    return db('shopping_list')
      .update({crossed: true})
      .where({ id })
  },
  unstrikeItem(db, id) {
    return db('shopping_list')
      .update({crossed: false})
      .where({ id })
  },
  deleteItem(db, id, user_id) {
    return db('shopping_list')
      .delete()
      .where({ id, owner: user_id })
  },
  deleteList(db, user_id) {
    return db('shopping_list')
      .delete()
      .where({ owner: user_id })
  },
  deleteCrossed(db, user_id) {
    return db('shopping_list')
      .delete()
      .where({ crossed: true, owner: user_id })
  }
}

module.exports = ShoppingListService