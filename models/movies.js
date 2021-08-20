const mongoose = require('mongoose');
const validator = require('validator');
const { ERROR_MESSAGE_LINK } = require('../utils/constans');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Укажите страну'],
  },
  director: {
    type: String,
    required: [true, 'Укажите режиссёра'],
  },
  duration: {
    type: Number,
    required: [true, 'Укажите продолжительность'],
  },
  year: {
    type: Number,
    required: [true, 'Укажите год создания'],
  },
  description: {
    type: String,
    required: [true, 'Укажите описание'],
  },
  image: {
    type: String,
    required: [true, 'Ссылка на постер обязательна'],
    validate: {
      validator: (v) => {
        validator.isURL(v);
      },
      message: ERROR_MESSAGE_LINK,
    },
  },
  trailer: {
    type: String,
    required: [true, 'Ссылка на трейлер обязательна'],
    validate: {
      validator: (v) => {
        validator.isURL(v);
      },
      message: ERROR_MESSAGE_LINK,
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Ссылка на миниатюру обязательна'],
    validate: {
      validator: (v) => {
        validator.isURL(v);
      },
      message: ERROR_MESSAGE_LINK,
    },
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: String,
    required: [true, 'Укажите id'],
  },
  nameRU: {
    type: String,
    required: [true, 'Укажите название на русском'],
  },
  nameEN: {
    type: String,
    required: [true, 'Укажите навзание на английском'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
