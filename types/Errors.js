exports.HttpError = class extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
};
exports.ValidationError = class extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.name = "ValidationError";
    this.statusCode = statusCode;
  }
};
