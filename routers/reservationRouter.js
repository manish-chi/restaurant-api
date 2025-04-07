import express from "express";
import * as reservationController from "../controllers/reservationController.js";
import  authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import * as restaurantController from "../controllers/restaurantController.js";

const router = express.Router();
router.use(authController.protect);

router.route("/:id").get(reservationController.GetReservation);

router
  .route("/")
  .post(
    userController.verifyUser,
    restaurantController.verifyRestaurant,
    reservationController.MakeReservation
  );

export default router;
