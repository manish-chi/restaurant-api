let express = require("express");
let dotenv = require("dotenv");
let morgan = require("morgan");
let globalErrorHandler = require("./controllers/errorController");
let restaurantRouter = require("./routers/restaurantRouter");
let userRouter = require('./routers/userRouter');
let reservationRouter = require('./routers/reservationRouter');
let cors = require('cors');

dotenv.config({ path: "./config.env" });

let app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(cors());

app.use('/api/v1/users',userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use('/api/v1/reservations',reservationRouter);

app.use(globalErrorHandler);

module.exports = app;
