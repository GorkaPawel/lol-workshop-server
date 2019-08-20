const path = require("path");
const kayn = require(path.normalize("../config/kayn"));
const search = require(path.normalize("../shared/functions")).search;

exports.getItems = async (req, res, next) => {
  const data = await kayn.DDragon.Item.list();
  const items = data.data;
  const itemList = [];
  for (let id in items) {
    itemList.push({ id, name: items[id].name });
  }
  res.status(200).json(itemList);
};

exports.getItem = async (req, res, next) => {
  const items = await kayn.DDragon.Item.list();
  const id = req.params.itemId;
  const result = items.data[id];
  const item = {
    id: id,
    name: result.name,
    description: result.description,
    plaintext: result.plaintext,
    gold: result.gold
  };
  res.status(200).json(item);
};
