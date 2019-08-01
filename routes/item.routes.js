const path = require("path");
const express = require("express");
const itemController = require(path.normalize(
  "../controllers/item.controller"
));

router = express.Router();

/*router.get("/items/:searchTerm", itemController.getItems);
router.get("/item", itemController.getItem);*/
module.exports = router;
