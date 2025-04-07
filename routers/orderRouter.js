import express from "express";
import * as orderController from "../controllers/orderController.js";
import  authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.protect);

router.route("/").post(orderController.addOrder);

router.route("/top-3-orders/:restaurantId").get(orderController.top3Orders);

export default router;
