const express = require("express");
const reservationController = require("../controllers/reservationController");
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect);

router.route("/:id").get(reservationController.GetReservation);

router.route('/').post(
  reservationController.MakeReservation,reservationController.sendConfirmationMailAfterReservation
);

module.exports = router;
