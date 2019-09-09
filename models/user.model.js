const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildSchema = new Schema({
  buildName: String,
  items: []
});
const noteSchema = new Schema({
  title: String,
  note: String
});
const runePageSchema = new Schema({
  pageName: String,
  primaryPath: Object,
  primaryRunes: [Object],
  secondaryPath: Object,
  secondaryRunes: [Object]
});
const championSchema = new Schema({
  name: String,
  notes: [noteSchema],
  builds: [buildSchema],
  runes: [runePageSchema]
});
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String,
  tokenExpires: Number,
  champions: [championSchema]
});

module.exports = mongoose.model("User", userSchema);
