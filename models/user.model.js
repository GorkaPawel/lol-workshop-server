const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const UserModel = sequelize.define("users", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  tokenExpires: {
    type: Sequelize.BIGINT,
    allowNull: true
  }
});

module.exports = UserModel;
