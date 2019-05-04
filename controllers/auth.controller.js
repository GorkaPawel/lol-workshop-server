const path = require("path");
const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require(path.normalize("../models/user.model"));
const { body, validationResult } = require("express-validator/check");
const { HttpError, ValidationError } = require(path.normalize(
  "../types/Errors"
));
const { handleError } = require(path.normalize("../helpers/helpers"));

exports.register = async (req, res, next) => {
  //check for validation errors
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array(true)[0].msg, 422);
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
      throw new HttpError("Somethig went wrong.", 500);
    }

    res.status(201).json({ msg: "User registered." });
  } catch (error) {
    handleError(error, res, next);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if user with given email is registered
    const registeredUser = await UserModel.findOne({ where: { email } });
    if (!registeredUser) {
      throw new HttpError("Invalid login credentials.", 401);
    }

    //check if given password corresponds with the one stored in DB
    const paswordCompareResult = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!paswordCompareResult) {
      throw new HttpError("Invalid login credentials.", 401);
    }

    //create access token if user's credentials are valid
    const userId = registeredUser.id;
    const token = jwt.sign({ userId: userId }, process.env.SECRET, {
      expiresIn: process.env.TOKEN_LIFESPAN
    });
    //create refresh token and store it in DB
    const refreshToken = randToken.uid(256);
    registeredUser.update({ refreshToken: refreshToken });
    //send both tokens to client
    res.status(200).json({
      token,
      refreshToken
    });
  } catch (error) {
    handleError(error, res, next);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    let user = await UserModel.findOne({ where: { id: userId } });
    user = await user.update({ refreshToken: null });
    if (!user) {
      throw new Error("Database error");
    }
    res.status(200).json({ message: "Logged out." });
  } catch (error) {
    handleError(error, res, next);
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
