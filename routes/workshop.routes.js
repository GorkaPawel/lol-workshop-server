const path = require("path");
const express = require("express");
const workshopController = require(path.normalize(
  "../controllers/workshop.controller"
));
const auth = require(path.normalize("../middleware/tokenAuth"));

router = express.Router();

router.get("/account/champions", auth, workshopController.getUserChampionList);
router.get(
  "/account/champion/:championName",
  auth,
  workshopController.getUserChampion
);
router.put("/account/build", auth, workshopController.updateBuild);
router.post("/account/note", auth, workshopController.updateNote);

module.exports = router;
