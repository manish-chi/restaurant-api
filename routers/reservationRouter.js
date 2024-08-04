let express = require("express");
let reservationController = require("../controllers/reservationController");
let router = express.Router();

router.route("/:id").get(reservationController.GetReservation);

router.route('/').post(
  reservationController.MakeReservation
);

module.exports = router;
