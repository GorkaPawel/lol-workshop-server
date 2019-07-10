const path = require("path");
const express = require("express");
const championController = require(path.normalize(
  "../controllers/champion.controller"
));
router = express.Router();

router.get("/championList", championController.getChampionList);
module.exports = router;
