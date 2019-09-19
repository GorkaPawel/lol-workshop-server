const path = require("path");
const kayn = require(path.normalize("../config/kayn"));

exports.getRunes = async (req, res, next) => {
  try {
    const data = await kayn.DDragon.RunesReforged.list().version("9.16.1");
    if (!data) {
      throw new Error("Could not get runes.");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateRune = async (req, res, next) => {
  const { userId, runePage, championName } = req.body;
  const { champion, user } = await getChampion(userId, championName);
  _id = runePage._id;
  if (!_id) {
    champion.runes.push(runePage);
  } else {
    const page = champion.runes.find(somePage => {
      return somePage._id.toString() === _id.toString();
    });
    page.primaryPath = runePage.primaryPath;
    page.primaryRunes = runePage.primaryRunes;
    page.secondaryPath = runePage.secondaryPath;
    page.secondaryRunes = runePage.secondaryRunes;
  }
  user
    .save()
    .then(updatedUserDoc => {
      const runes = champion.runes;
      res.status(200).json(runes);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};
