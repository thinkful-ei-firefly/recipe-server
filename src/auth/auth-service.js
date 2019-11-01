/* eslint-disable indent */
'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const axios = require('axios');

const GOOGLE_TOKEN_AUTH_URL =
  'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=';
const FACEBOOK_TOKEN_AUTH_URL =
  'https://graph.facebook.com/me?access_token=';

const AuthService = {
  getUserWithUsername(db, user_name) {
    return db('users')
      .where({ user_name })
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  async verifyGoogleToken(id_token) {
    const res = await axios(GOOGLE_TOKEN_AUTH_URL + id_token)
    if(res.status !== 200) {
      throw new Error('unable to connect to google servers');
    }
    return res.data;
  },
  async verifyFacebookToken(id_token) {
    const res = await axios(FACEBOOK_TOKEN_AUTH_URL + id_token)
    if(res.status !== 200) {
      throw new Error('unable to connect to google servers');
    }
    return res.data;
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  }
};

module.exports = AuthService;
