const express = require('express');
const path = require('path');

const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service')

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name } = req.body;
    console.log('password is '+password)
    const requiredFields = ['user_name', 'password'];

    for(const field of requiredFields) {
      if (!req.body[field])
        return res.status(400).json({ error: `Missing '${field}' in requrest` });
    }

    const passwordError = UsersService.checkPassword(password);
    if(passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    UsersService.hasUserWithUserName(req.app.get('db'), user_name)
      .then(userExists => {
        if (userExists) {
          return res.status(400).json({ error: 'That username is already taken' });
        }
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword
            }
            return UsersService.insertUser(req.app.get('db'), newUser)
              .then(user => {
                const userInfo = UsersService.serializeUser(user)
                const payload = { user_id: userInfo.id };
                const subject = userInfo.user_name;
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json({ authToken: AuthService.createJwt(subject, payload), id: userInfo.id})
              })
          })
      })
      .catch(next)
  })

  module.exports = usersRouter;