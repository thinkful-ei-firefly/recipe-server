require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

const app = express();
const { NODE_ENV } = require('./config')

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const recipeRouter = require('./recipe/recipe-router');
const ingredientsRouter = require('./ingredients/ingredients-router');
const shoppingListRouter = require('./shopping-list/shopping-list-router');
const ratingsRouter = require('./ratings/ratings-router')
const uploadRouter = require('./recipe/upload-aws')

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(fileUpload());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipeRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/list', shoppingListRouter)
app.use('/api/upload', uploadRouter);
app.use('/api/ratings', ratingsRouter);

app.get('/', (req, res) => {
  res.send('TEST')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = {message: error.message, error };
  }
  res.status(500).json(response);
})

module.exports = app
