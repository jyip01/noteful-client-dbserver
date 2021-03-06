require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const folderRouter = require('./folders/folder-router');
const noteRouter = require('./notes/note-router');

const app = express();
//const bodyParser = require('body-parser');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

  /*app.use(bodyParser.urlencoded({
    extended: true
  }));*/

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/folders', folderRouter);
app.use('/api/notes', noteRouter);

//error handling middleware
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});


module.exports = app;
