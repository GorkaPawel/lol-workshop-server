const path = require("path");
const UserModel = require(path.normalize("../models/user.model"));
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");
const refreshTokens = {};

exports.register = (req, res, next) => {};
exports.login = (req, res, next) => {};
