const path = require("path");
const { HttpError, ValidationError } = require(path.normalize(
  "../types/Errors"
));

exports.handleError = (error, res, next) => {
  if (error instanceof HttpError || error instanceof ValidationError) {
    return res.status(error.statusCode).json(error);
  }
  return next(error);
};
