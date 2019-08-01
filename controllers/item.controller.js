const path = require("path");
const kayn = require(path.normalize("../config/kayn"));
const search = require(path.normalize("../shared/functions")).search;

/*exports.getItems = async (req, res, next) => {
  const items = await kayn.DDragon.Item.list();

  const itemList = [];
  for (const item in items.data) {
    itemList.push({ id: item, name: items.data[item].name });
  }
  res.status(200).json(itemList);
};
exports.getItem = async (req, res, next) => {
  const items = await kayn.DDragon.Item.list();

  res.status(200).json(items.data);
};*/
