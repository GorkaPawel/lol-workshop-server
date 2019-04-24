const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const sequelize = require(path.join(__dirname, "config", "database"));
const cors = require("cors");

//routes imports
const authRoutes = require(path.join(__dirname, "routes", "auth.routes"));

const app = express();

//every request goes through this middleware
app.use(express.json());
app.use(cors());
app.use(authRoutes);

//Unrecognized errors handler
app.use((error, req, res, next) => {
  res.status(500).json({ error, message: "Something went wrong" });
});
//database models syncing
sequelize
  .sync()
  .then(() => app.listen(process.env.PORT || 8080))
  .catch(error => {
    console.log(error);
  });
