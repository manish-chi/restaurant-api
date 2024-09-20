const handlerFactory = require("../controllers/handlerFactory");
const Reservation = require("../models/reservationModel");

exports.MakeReservation = handlerFactory.addOne(Reservation);

exports.GetReservation = handlerFactory.getOne(Reservation);

