const path = require("path");
const express = require("express");
const authController = require(path.normalize(
  "../controllers/auth.controller"
));

router = express.Router();

router.post("/register", authController.validators, authController.register);
router.post("/login", authController.login);

module.exports = router;
