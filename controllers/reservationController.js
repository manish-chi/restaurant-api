let handlerFactory = require("../controllers/handlerFactory");
let Reservation = require('../models/reservationModel');
let AppError = require('../utils/appError');
const Restaurant = require("../models/restaurantModel");
const User = require('../models/userModel');

exports.MakeReservation = handlerFactory.addOne(Reservation);

exports.GetReservation = handlerFactory.getOne(Reservation);
