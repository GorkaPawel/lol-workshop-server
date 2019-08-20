const jwt = require("jsonwebtoken");
const path = require("path");
const { ApplicationError } = require(path.normalize("../types/Errors.js"));

module.exports = (req, res, next) => {
  try {
    //check if header with tokens is even provided
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw new ApplicationError("No authorization header provided.", 401);
    }

    // TODO this might break the app if someone sets wrong header (?)
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET,
      (error, decoded) => {
        if (error) {
          switch (error.name) {
            case "TokenExpiredError": {
              error.status = 403;
              throw error;
            }
            case "JsonWebTokenError": {
              error.status = 401;
              throw error;
            }
            default: {
              throw error;
            }
          }
        }
        return decoded;
      }
    );

    if (!decodedToken) {
      throw new ApplicationError("Unauthorized.", 401);
    }

    //If verified, attach user id to request, so you can use it to fetch user specific data
    req.body.userId = decodedToken.userId;
    next();

    //pass errors to central handler
  } catch (error) {
    next(error);
  }
};
