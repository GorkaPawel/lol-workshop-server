const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//routes imports
const authRoutes = require(path.join(__dirname, "routes", "auth.routes"));
const championRoutes = require(path.join(
  __dirname,
  "routes",
  "champion.routes"
));
const itemRoutes = require(path.join(__dirname, "routes", "item.routes"));
const app = express();

//every request goes through this middleware
app.use(express.json());
app.use(cors());
app.use(authRoutes);
app.use(championRoutes);
app.use(itemRoutes);

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

mongoose
  .connect(process.env.DB_HOST, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => {
    console.log(err);
  });
