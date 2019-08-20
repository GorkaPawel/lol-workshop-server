const path = require("path");
const express = require("express");
const itemController = require(path.normalize(
  "../controllers/item.controller"
));

router = express.Router();

router.get("/items", itemController.getItems);
router.get("/item/:itemId", itemController.getItem);

module.exports = router;
