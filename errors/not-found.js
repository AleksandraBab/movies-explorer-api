const { ERROR_CODE_404 } = require('../utils/constans');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_404;
  }
}

module.exports = NotFoundError;
