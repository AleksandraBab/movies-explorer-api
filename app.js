require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found');
const { ERROR_MESSAGE_404 } = require('./utils/constans');
const { MONGO } = require('./utils/config');
const { ratelimiter } = require('./utils/ratelimiter');
const mainRouter = require('./routes/index');

const allowedCors = [
  'localhost:3000',
  'http://localhost:3000',
];
const limiter = rateLimit(ratelimiter);
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

mongoose.connect(MONGO, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.status(200).send();
  }

  return next();
});

app.use('/', mainRouter);
app.use(errorLogger);
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGE_404));
});
app.use(error);

app.listen(PORT);
