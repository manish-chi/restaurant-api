const express = require("express");
const reservationController = require("../controllers/reservationController");
const authController = require("../controllers/authController");
const router = express.Router();
const userController = require("../controllers/userController");
const restaurantController = require("../controllers/restaurantController");

router.use(authController.protect);

router.route("/:id").get(reservationController.GetReservation);

router
  .route("/")
  .post(
    userController.verifyUser,
    restaurantController.verifyRestaurant,
    reservationController.MakeReservation
  );

module.exports = router;
