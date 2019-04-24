const jwt = require("jsonwebtoken");
const path = require("path");
const { HttpError } = require(path.normalize("../types/Errors"));
const { Bearer } = require(path.normalize("../types/Bearer"));
const { handleError } = require(path.normalize("../helpers/helpers"));

module.exports = (req, res, next) => {
  try {
    console.log(req.get("Authorization"));

    //check if header with tokens is even provided
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw new HttpError("No authorization header provided.", 400);
    }
    const tokenBearer = authHeader.split(" ")[1];
    if (!(tokenBearer instanceof Bearer)) {
      throw new HttpError(
        "Invalid request format, expects {token, tokenRefresh}",
        400
      );
    }

    //verify token against server's secret

    const accessToken = tokenBearer.token;
    const decodedToken = jwt.verify(
      accessToken,
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
