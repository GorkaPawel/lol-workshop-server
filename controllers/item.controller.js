const path = require("path");
const kayn = require(path.normalize("../config/kayn"));
const search = require(path.normalize("../shared/functions")).search;

exports.getItems = async (req, res, next) => {
  const items = await kayn.DDragon.Item.list();
  const term =
    req.params.searchTerm.charAt(0).toUpperCase() +
    req.params.searchTerm.slice(1);

  const itemList = [];
  for (const item in items.data) {
    if (items.data[item].maps["11"]) {
      itemList.push({ id: item, name: items.data[item].name });
    }
  }

  const searchResults = search(term, itemList);

  res.status(200).json(searchResults);
};

exports.getItem = async (req, res, next) => {
  const items = await kayn.DDragon.Item.list();
  const id = req.params.itemId;

  res.status(200).json(items.data[id]);
};
