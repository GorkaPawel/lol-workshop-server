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

//Main handler, might need fallback to express's internal handler for some cases
app.use((error, req, res, next) => {
  if (!error.status) {
    error.status = 500;
    error.message = "Internal sever error";
  }
  res
    .status(error.status)
    .json({ error: error.message, callstack: error.stack });
});
//database models syncing
sequelize
  .sync()
  .then(() => app.listen(process.env.PORT || 8080))
  .catch(error => {
    console.log(error);
  });
