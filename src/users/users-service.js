/* eslint-disable indent */
'use strict';
const xss = require('xss');
const bcrypt = require('bcryptjs');


const UsersService = {
  checkPassword(password) {
    if(password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (password.length < 8 || password.length > 72) {
      return 'Password must be between 8 and 72 characters';
    }
    let str = password.replace(/[^\x00-\x7F]/g, '');
    if(str !== password){
      return 'Password cannot contain non-ascii characters'
    }
    return null;
  },
  chechUsername(username){
    let str = username.replace(/[^\x00-\x7F]/g, '');
    if(str !== username){
      return 'Username cannot contain non-ascii characters'
    }
    if (username.length > 72 || username.length < 4){
      return 'Username must be between 4 and 72 characters'
    }
    return null;
  },
  hasUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .into('users')
      .insert(newUser)
      .returning('*')
      .then(user => user[0]);
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name)
    };
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
};

module.exports = UsersService;