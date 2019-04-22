const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const sequelize = require(path.join(__dirname, "config", "database"));

//routes imports
const authRoutes = require(path.join(__dirname, "routes", "auth.routes"));

const app = express();

//every request goes through this middleware
app.use(express.json());

app.use(authRoutes);

//database models syncing
sequelize
  .sync()
  .then(() => app.listen(process.env.PORT || 8080))
  .catch(error => {
    console.log(error);
  });
