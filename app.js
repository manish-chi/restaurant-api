import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import globalErrorHandler from "./controllers/errorController.js";
import restaurantRouter from "./routers/restaurantRouter.js";
import userRouter from "./routers/userRouter.js";
import reservationRouter from "./routers/reservationRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import paymentRouter from "./routers/paymentRouter.js";
import cardRouter from "./routers/cardRouter.js";
import menuRouter from "./routers/menuRouter.js";
import orderRouter from "./routers/orderRouter.js";
import authRouter from "./routers/authRouter.js";
import navigationRouter from "./routers/navigationRouter.js";
import responseRouter from "./routers/responseRouter.js";
import chatRouter from "./routers/chatRouter.js";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config.env" });

let app = express();

let sessionMapper = new Map();

//Push again!
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// // For any route, serve the React index.html file
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
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

app.get("/", function (req, res, next) {
  Task.find()
    .then((tasks) => {
      const currentTasks = tasks.filter((task) => !task.completed);
      const completedTasks = tasks.filter((task) => task.completed === true);

      console.log(
        `Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`
      );
      res.render("index", {
        currentTasks: currentTasks,
        completedTasks: completedTasks,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

app.use((req, res, next) => {
  if (!sessionMapper.has("sessionId")) {
    let sessionId = crypto.randomUUID();
    console.log(`Session ID is : ${sessionId}`);
    sessionMapper.set("sessionId", sessionId);
  }

  req.sessionId = sessionMapper.get("sessionId");

  console.log(`request session id : ${req.sessionId}`);
  next();
});

app.use("/config", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/reservations", reservationRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/cards", cardRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/main-menu-options", navigationRouter);
app.use("/api/v1/response", responseRouter);
app.use("/api/v1/chat", chatRouter);
app.use(globalErrorHandler);

export default app;
