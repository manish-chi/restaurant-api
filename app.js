let express = require("express");
let dotenv = require("dotenv");
let morgan = require("morgan");
let globalErrorHandler = require("./controllers/errorController");
let restaurantRouter = require("./routers/restaurantRouter");
let userRouter = require('./routers/userRouter');
let reservationRouter = require('./routers/reservationRouter');
let cors = require('cors');
let paymentRouter = require('./routers/paymentRouter');
let cardRouter = require('./routers/cardRouter');
let menuRouter = require('./routers/menuRouter');
let orderRouter = require('./routers/orderRouter');


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
app.use('/api/v1/payments',paymentRouter);
app.use('/api/v1/cards',cardRouter);
app.use('/api/v1/menu',menuRouter);
app.use('/api/v1/orders',orderRouter);

app.use(globalErrorHandler);

module.exports = app;
