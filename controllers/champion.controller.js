const path = require("path");
const axios = require("axios");
const kayn = require(path.normalize("../config/kayn"));
const search = require(path.normalize("../shared/functions")).search;

exports.getChampionList = async (req, res, next) => {
  let championList = await kayn.DDragon.Champion.list();

  const entries = Object.entries(championList.data);
  championList = entries.map(entry => {
    return { id: entry[1].key, name: entry[0] };
  });
  res.status(200).json(championList);
};

exports.getChampion = async (req, res, next) => {
  try {
    const championName = req.params.championName;
    const champion = await kayn.DDragon.Champion.get(championName);
    const championId = champion.data[championName].key;

    const advChampion = await axios.get(
      `http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`
    );
    const advSpells = advChampion.data.spells;
    const spells = champion.data[championName].spells;

    for (index in spells) {
      spells[index] = {
        spellKey: advSpells[index].spellKey,
        abilityIconPath: advSpells[index].abilityIconPath,
        abilityVideoPath: advSpells[index].abilityVideoPath,
        abilityVideoImagePath: advSpells[index].abilityVideoImagePath,
        ...spells[index]
      };
    }
    const extChampion = {
      ...champion.data[championName],
      recommended: null,
      spells: spells,
      passive: advChampion.data.passive
    };

    res.status(200).json(extChampion);
  } catch (error) {
    res.status(400).json({ championEndPoint: error });
  }
};
