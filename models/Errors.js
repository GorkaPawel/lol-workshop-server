class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
class ValidationError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
    this.data = data;
  }
}
module.exports = { HttpError, ValidationError };
