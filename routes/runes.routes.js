const path = require("path");
const express = require("express");
const runesController = require(path.normalize(
  "../controllers/runes.controller"
));

const auth = require(path.normalize("../middleware/tokenAuth"));
router = express.Router();

router.get("/runes", auth, runesController.getRunes);
router.put("/runes/update", auth, runesController.updateRune);

module.exports = router;
