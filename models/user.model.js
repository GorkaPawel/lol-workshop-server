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
const championSchema = new Schema({
  name: String,
  notes: [noteSchema],
  builds: [buildSchema]
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
