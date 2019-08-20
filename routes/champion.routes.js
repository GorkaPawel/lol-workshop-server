const path = require("path");
const express = require("express");
const championController = require(path.normalize(
  "../controllers/champion.controller"
));
router = express.Router();

router.get("/champion/:championName", championController.getChampion);
router.get("/champions", championController.getChampionList);
module.exports = router;
