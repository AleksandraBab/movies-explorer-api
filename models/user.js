const mongoose = require('mongoose');
const validator = require('validator');
const { ERROR_MESSAGE_EMAIL } = require('../utils/constans');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        validator.isEmail(v);
      },
      message: ERROR_MESSAGE_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, 'Имя пользователя должно быть больше одного символа'],
    maxlength: [30, 'Имя пользователя должно быть короче 30 символов'],
  },
});

module.exports = mongoose.model('user', userSchema);
