const { Error } = require('mongoose');

class ConflictingRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictingRequestError;
