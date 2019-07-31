const { Kayn, REGIONS } = require("kayn");
const axios = require("axios");
const kayn = Kayn("RGAPI-5f3d70ee-7bf5-41d6-9aae-0e4547078f2d")({
  region: REGIONS.NORTH_AMERICA,
  locale: "en_US",
  debugOptions: {
    isEnabled: true,
    showKey: false
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
    shouldExitOn403: false
  },
  cacheOptions: {
    cache: null,
    timeToLives: {
      useDefault: false,
      byGroup: {},
      byMethod: {}
    }
  }
});

exports.getChampionList = async (req, res, next) => {
  const championList = await kayn.DDragon.Champion.list();

  const entries = Object.entries(championList.data);
  const list = entries.map(entry => {
    return { championName: entry[0], id: entry[1].key };
  });
  res.status(200).json(list);
};

exports.getChampion = async (req, res, next) => {
  try {
    const championName = req.params.championId;
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
