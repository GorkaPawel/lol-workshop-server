const jwt = require("jsonwebtoken");
const path = require("path");
const { HttpError } = require(path.normalize("../types/Errors"));
const { handleError } = require(path.normalize("../helpers/helpers"));

module.exports = (req, res, next) => {
  try {
    //check if header with tokens is even provided
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw new HttpError("No authorization header provided.", 400);
    }
    const { token, tokenRefresh } = JSON.parse(authHeader.split(" ")[1]);
    if (typeof token != "string" || typeof tokenRefresh != "string") {
      throw new HttpError(
        "Invalid request format, expects {token: string, tokenRefresh: string}",
        400
      );
    }

    //verify token against server's secret

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET,
      (err, decoded) => {
        if (err) {
          throw err;
        }
        return decoded;
      }
    );
    if (!decodedToken) {
      throw new HttpError("Unauthorized.", 403);
    }

    //If verified, attach user id to request, so you can use it to fetch user specific data
    req.userId = decodedToken.userId;
    next();

    //handle recognized errors, pass unrecognized to another handler
  } catch (error) {
    handleError(error, res, next);
  }
};
