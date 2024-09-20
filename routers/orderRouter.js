const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();
const authController = require("../controllers/authController");

router.use(authController.protect);

router.route("/").post(orderController.addOrder);

router.route("/top-3-orders/:restaurantId").get(orderController.top3Orders);

module.exports = router;
