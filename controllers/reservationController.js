let handlerFactory = require("../controllers/handlerFactory");
let Reservation = require("../models/reservationModel");
let AppError = require("../utils/appError");
const Restaurant = require("../models/restaurantModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/mailer");
const userController = require("../controllers/userController");

exports.MakeReservation = catchAsync(async (req, res, next) => {
  let { user, restaurant, datetime } = { ...req.body };

  const retrivedUser = await User.findById(user);
  const retrivedRestaurant = await Restaurant.findById(restaurant);

  if (!retrivedUser) next(new AppError(404, `User with ID ${user} not found!`));
  if (!retrivedRestaurant)
    next(new AppError(404, `Restaurant with ID ${restaurant} not found!`));

  handlerFactory.addOne(Reservation);

  req.user = retrivedUser;
  req.restaurant = retrivedRestaurant;
  req.datetime = datetime;

  next();
});

exports.GetReservation = handlerFactory.getOne(Reservation);

exports.sendConfirmationMailAfterReservation = catchAsync(
  async (req, res, next) => {
    let options = {
      email: req.user.email,
      subject: `Your Table Reservation has been confirmed @ ${req.restaurant.name}`,
      message: `Hi ${req.user.name}👋, Your reservation has been confirmed.  \nTime : ${req.datetime}`,
    };

    try {
      await sendMail(options);
      return res.status(200).json({
        status: "success",
      });
    } catch (err) {
      return next(new AppError(500, err.message));
    }
  }
);
