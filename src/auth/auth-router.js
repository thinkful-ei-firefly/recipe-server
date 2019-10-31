/* eslint-disable indent */
'use strict';

const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');
const authRouter = express.Router();

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const loginUser = { user_name, password };

    for (const [key, value] of Object.entries(loginUser)) {
      if (value === null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }
    }
    AuthService.getUserWithUsername(req.app.get('db'), user_name)
      .then(user => {
        if (!user) {
          return res.status(400).json({error: 'Incorrect user_name or password'});
        }
        return AuthService.comparePasswords(password, user.password)
          .then(comparison => {
            if(!comparison) {
              return res.status(400).json({error: 'Incorrect user_name or password'});
            }
            const payload = { user_id: user.id };
            const subject = user.user_name;
            res.send({ authToken: AuthService.createJwt(subject, payload), id: user.id} );
          });
      })
      .catch(next);
  })
  .post('/googlelogin', jsonBodyParser, (req, res, next) => {
    
    const {
      token,
      isNewUser,
      fullName,
      email,
      accountCreated,
      lastLogin
    } = req.body;

    const loginUser = {token, isNewUser, fullName, email, accountCreated, lastLogin};

    for (const [key, value] of Object.entries(loginUser)) {
      if (value === null) {
        return res.status(400).json({error: `Missing '${key}' in request body`});
      }
    }

    AuthService.getUserWithUsername(req.app.get('db'), loginUser.email)
      .then(user => {
        if (!user) {
          return res.status(400).json({error: 'Incorrect user_name or password'});
        }
        AuthService.verifyGoogleToken(loginUser.token)
          .then(() => {
            const payload = { user_id: user.id };
            const subject = user.user_name;
            res.send({ authToken: AuthService.createJwt(subject, payload), id: user.id} );
          });
      })
      .catch(next);
  })
  .put(requireAuth, (req, res) => {
    const sub = req.user.user_name;
    const payload = {
      user_id: req.user.id
    };
    res.send({
      authToken: authService.createJwt(sub, payload), id: req.user.id
    });
  });

  module.exports = authRouter;
