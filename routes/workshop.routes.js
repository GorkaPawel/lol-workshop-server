const path = require("path");
const express = require("express");
const workshopController = require(path.normalize(
  "../controllers/workshop.controller"
));

router = express.Router();

router.get("/account/champions");
router.get("/account/champion/:championId");
router.post("/account/build");
router.post("/account/note");

module.exports = router;
