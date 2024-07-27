let express = require("express");
let dotenv = require("dotenv");
let morgan = require("morgan");
let globalErrorHandler = require("./controllers/errorController");
let restaurantRouter = require("./routers/restaurantRouter");

dotenv.config({ path: "./config.env" });

let app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan);
}

app.use(express.json());

app.use("/api/v1/restaurants", restaurantRouter);

app.use(globalErrorHandler);

module.exports = app;
