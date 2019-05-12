const path = require("path");
const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require(path.normalize("../models/user.model"));
const { body, validationResult } = require("express-validator/check");
const { ApplicationError } = require(path.normalize("../types/Errors.js"));

exports.register = async (req, res, next) => {
  //check for validation errors
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApplicationError(errors.array(true)[0].msg, 422);
    }
    //If no validation errors did occur, hash password and push user to the database
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      email: email,
      password: passwordHash
    });
    //If db error occurs
    if (!newUser) {
      throw new Error();
    }

    res.status(201).json({ msg: "User registered." });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if user with given email is registered
    const registeredUser = await UserModel.findOne({ where: { email } });
    if (!registeredUser) {
      throw new ApplicationError("Invalid login credentials.", 401);
    }

    //check if given password corresponds with the one stored in DB
    const paswordCompareResult = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!paswordCompareResult) {
      throw new ApplicationError("Invalid login credentials.", 401);
    }

    //create access token if user's credentials are valid
    const userId = registeredUser.id;
    const token = jwt.sign({ userId: userId }, process.env.SECRET, {
      expiresIn: process.env.TOKEN_LIFESPAN
    });
    //create refresh token and store it in DB
    const refreshToken = randToken.uid(256);
    const expiryDate =
      Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFESPAN);

    registeredUser.update({
      refreshToken: refreshToken,
      tokenExpires: expiryDate
    });
    //send both tokens to client
    res.status(200).json({
      token: token,
      tokenRefresh: refreshToken
    });
  } catch (error) {
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    let user = await UserModel.findOne({ where: { id: userId } });
    // delete refreshToken and reset expiry date
    user = await user.update({
      refreshToken: null,
      tokenExpires: 0
    });
    res.status(204);
  } catch (error) {
    next(error);
  }
};
exports.refresh = async (req, res, next) => {
  try {
    // check if recieved refreshToken exists in db and if it hasnt expired
    const tokenRefresh = req.body.tokenRefresh;
    if (!tokenRefresh || typeof tokenRefresh != "string") {
      throw new ApplicationError("Unauthorized.", 401);
    }
    const user = await UserModel.findOne({
      where: { refreshToken: tokenRefresh }
    });
    if (!user || Date.now() >= user.tokenExpires) {
      req.userId = null;
      throw new ApplicationError("Unauthorized.", 401);
    }
    const userId = user.id;
    const token = jwt.sign({ userId: userId }, process.env.SECRET, {
      expiresIn: process.env.TOKEN_LIFESPAN
    });
    //create refresh token and store it in DB
    const refreshToken = randToken.uid(256);
    const updateSuccess = await user.update({
      refreshToken: refreshToken,
      tokenExpires: Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFESPAN)
    });
    if (!updateSuccess) {
      throw new Error();
    }
    // send new token and refreshToken back to client
    res.status(200).json({
      token: token,
      tokenRefresh: refreshToken
    });
  } catch (error) {
    next(error);
  }
};
//an object containing validators
exports.validators = {
  //email validator
  email: body("email", "Please enter a valid email.")
    .trim()
    .isEmail()
    //check if email already exists in database
    .custom(async (value, { req }) => {
      const isEmailUsed = await UserModel.findOne({
        where: { email: req.body.email }
      });

      if (isEmailUsed) {
        throw new Error("Email is already in use");
      }
    })
    .normalizeEmail(),
  //password validator
  password: body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password has to have a minimum of five characters")
    .isAlphanumeric(),
  //pssword confirmation validation
  passwordConfirm: body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    })
};
