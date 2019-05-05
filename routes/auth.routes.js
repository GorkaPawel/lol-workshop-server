const path = require("path");
const express = require("express");
const authController = require(path.normalize(
  "../controllers/auth.controller"
));
const tokenAuth = require(path.normalize("../middleware/tokenAuth"));

router = express.Router();

router.post(
  "/register",
  authController.validators.email,
  authController.register
);
router.post("/login", authController.login);
router.get("/logout", tokenAuth, authController.logout);
router.post("/refresh", authController.refresh);

module.exports = router;
