const { Joi } = require('celebrate');
const validator = require('validator');
const { ERROR_MESSAGE_EMAIL, ERROR_MESSAGE_LINK } = require('./constans');

const isEmail = (value) => {
  const isValid = validator.isEmail(value);
  if (isValid) {
    return value;
  }
  throw new Error(ERROR_MESSAGE_EMAIL);
};

const isURL = (value) => {
  const isValid = validator.isURL(value);
  if (isValid) {
    return value;
  }
  throw new Error(ERROR_MESSAGE_LINK);
};

const signin = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }).unknown(true),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(isEmail),
    password: Joi.string().required(),
  }).unknown(true),
};

const moviePost = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isURL),
    trailer: Joi.string().required().custom(isURL),
    thumbnail: Joi.string().required().custom(isURL),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
};

const movieDelete = {
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
};

const userPatch = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().custom(isEmail),
  }).unknown(true),
};

module.exports = {
  signin,
  signup,
  moviePost,
  movieDelete,
  userPatch,
};
