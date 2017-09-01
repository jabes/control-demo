'use strict';

class Response {

  static throwError(reject, code, message) {
    reject({
      error: true,
      code,
      message,
    });
  }

  static throwValidationError(reject, key, message) {
    reject({
      error: true,
      validation: {
        errors: [{
          key,
          message,
        }]
      }
    });
  }

}

module.exports = Response;
