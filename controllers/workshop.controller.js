const path = require("path");
const User = require(path.normalize("../models/user.model"));

getChampion = async (userId, championName) => {
  const user = await User.findById(userId);

  let champion = user.champions.find(champion => {
    return champion.name === championName;
  });
  if (!champion) {
    user.champions.push({ name: championName });
    champion = user.champions.find(champion => {
      return champion.name === championName;
    });
  }
  return { user, champion };
};
exports.updateBuild = async (req, res, next) => {
  const { userId, build, championName } = req.body;
  const { champion, user } = await getChampion(userId, championName);

  if (!build._id) {
    champion.builds.push(build);
  } else {
    const foundBuild = champion.builds.find(someBuild => {
      return someBuild._id.toString() === build._id.toString();
    });
    foundBuild.items = build.items;
    foundBuild.buildName = build.buildName;
  }
  user
    .save()
    .then(updatedUserDoc => {
      const builds = champion.builds;
      res.status(200).json(builds);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};
exports.updateNote = async (req, res, next) => {
  const { userId, title, note, _id, championName } = req.body;
  const { champion, user } = await getChampion(userId, championName);
  if (!_id) {
    champion.notes.push({ note, title });
  } else {
    const foundNote = champion.notes.find(someNote => {
      return someNote._id.toString() === _id.toString();
    });
    foundNote.title = title;
    foundNote.note = note;
  }
  user
    .save()
    .then(updatedUserDoc => {
      const notes = champion.notes;
      res.status(200).json(notes);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

exports.getUserChampion = (req, res, next) => {
  const userId = req.body.userId;
  const championName = req.params.championName;
  let champion;
  User.findById(userId)
    .then(user => {
      champion = user.champions.find(champion => {
        return champion.name === championName;
      });
      res.status(200).json(champion);
    })
    .catch(err => {
      res.status(500).json("Temp error: internal error");
    });
};
exports.getUserChampionList = (req, res, next) => {
  const userId = req.body.userId;
  User.findById(userId)
    .then(user => {
      const champions = user.champions.map(champion => {
        return { _id: champion._id, key: champion.ApiId, name: champion.name };
      });
      res.status(200).json(champions);
    })
    .catch(err => {
      next(err);
    });
};
