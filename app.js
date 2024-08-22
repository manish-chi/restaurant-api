let express = require("express");
let dotenv = require("dotenv");
let morgan = require("morgan");
let globalErrorHandler = require("./controllers/errorController");
let restaurantRouter = require("./routers/restaurantRouter");
let userRouter = require('./routers/userRouter');
let reservationRouter = require('./routers/reservationRouter');
let cors = require('cors');
let path = require('path');
let paymentRouter = require('./routers/paymentRouter');
let cardRouter = require('./routers/cardRouter');
let menuRouter = require('./routers/menuRouter');
let orderRouter = require('./routers/orderRouter');
let authRouter = require('./routers/authRouter');


dotenv.config({ path: "./config.env" });

let app = express();

//Push again!
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// // For any route, serve the React index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use('/config',authRouter);
app.use('/api/v1/users',userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use('/api/v1/reservations',reservationRouter);
app.use('/api/v1/payments',paymentRouter);
app.use('/api/v1/cards',cardRouter);
app.use('/api/v1/menu',menuRouter);
app.use('/api/v1/orders',orderRouter);

app.use(globalErrorHandler);

module.exports = app;
