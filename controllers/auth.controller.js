const path = require("path");
const UserModel = require(path.normalize("../models/user.model"));
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const { HttpError, ValidationError } = require(path.normalize(
  "../models/Errors"
));
const refreshTokens = {};

exports.register = async (req, res, next) => {
  //check for validation errors
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError("Validation failed", 422, errors.array());
    }
    //If no validation errors occured, hash password and push user to the database
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
    res.status(error.statusCode).json(error);
  }
};
exports.login = (req, res, next) => {};

//an array containing validators
exports.validators = [
  body("email", "Please enter a valid email.")
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
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password has to have a minimum of five characters")
    .isAlphanumeric(),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    })
];
