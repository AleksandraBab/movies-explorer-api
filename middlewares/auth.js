const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { ERROR_MESSAGE_UNAUTH } = require('../utils/constans');
const { JWT } = require('../utils/config');

const { JWT_SECRET = JWT } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ERROR_MESSAGE_UNAUTH));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new UnauthorizedError(ERROR_MESSAGE_UNAUTH));
  }

  req.user = payload;
  return next();
};
