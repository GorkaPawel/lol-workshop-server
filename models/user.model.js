const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildSchema = new Schema({
  buildName: String,
  item0: {
    ApiID: String
  },
  item1: {
    ApiID: String
  },
  item2: {
    ApiID: String
  },
  item3: {
    ApiID: String
  },
  item4: {
    ApiID: String
  },
  item5: {
    ApiID: String
  }
});
const noteSchema = new Schema({
  content: String
});
const championSchema = new Schema({
  ApiId: String,
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
