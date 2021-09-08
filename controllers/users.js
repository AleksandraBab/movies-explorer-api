const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found');
const ValidationError = require('../errors/validation-error');
const UnauthorizedError = require('../errors/unauthorized');
const {
  ERROR_MESSAGE_INVALID,
  ERROR_MESSAGE_USERNOTFOUND,
  ERROR_MESSAGE_AUTHORIZATION,
  ERROR_MESSAGE_CREATIONUSER,
  ERROR_MESSAGE_409,
  ERROR_CODE_409,
  ERROR_CODE_400,
  ERROR_MESSAGE_400,
} = require('../utils/constans');
const { JWT } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  if (!email || !password || !name) {
    const err = new Error(ERROR_MESSAGE_CREATIONUSER);
    err.statusCode = ERROR_CODE_400;
    next(err);
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new Error(ERROR_MESSAGE_409);
        err.statusCode = ERROR_CODE_409;
        next(err);
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }))
        .then(({ _id }) => res.status(201).send({
          message: 'Пользователь успешно создан',
          user: { _id, email, name },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError(ERROR_MESSAGE_INVALID));
          }
          next();
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error(ERROR_MESSAGE_400);
    err.statusCode = ERROR_CODE_400;
    next(err);
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError(ERROR_MESSAGE_AUTHORIZATION));
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError(ERROR_MESSAGE_AUTHORIZATION));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : JWT,
            { expiresIn: '7d' },
          );

          res
            .send({ token });
        })
        .catch(() => {
          next();
        });
    })
    .catch(() => {
      next();
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      next(new NotFoundError(ERROR_MESSAGE_USERNOTFOUND));
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(ERROR_MESSAGE_INVALID));
      }
      next();
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const err = new Error(ERROR_MESSAGE_409);
        err.statusCode = ERROR_CODE_409;
        next(err);
      }
      User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        {
          new: true,
          runValidators: true,
          upsert: false,
        },
      )
        .orFail(() => {
          next(new NotFoundError(ERROR_MESSAGE_USERNOTFOUND));
        })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            next(new ValidationError(ERROR_MESSAGE_INVALID));
          }
          next();
        });
    })
    .catch(() => {
      next();
    });
};
