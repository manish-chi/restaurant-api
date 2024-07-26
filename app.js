let express = require("express");
let dotenv = require("dotenv");
let morgan = require("morgan");

dotenv.config({ path: "./config.env" });

let app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan);
}

module.exports = app;
