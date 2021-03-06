const { ERROR_MESSAGE_500, ERROR_CODE_500 } = require('../utils/constans');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_CODE_500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_500
        ? ERROR_MESSAGE_500
        : message,
    });
  next();
};
