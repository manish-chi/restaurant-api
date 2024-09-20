const handlerFactory = require("../controllers/handlerFactory");
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.verifyUser = catchAsync(async (req, res, next) => {
  let { user } = { ...req.body };

  const retrivedUser = await User.findById(user);

  if (!retrivedUser) next(new AppError(404, `User with ID ${user} not found!`));

  next();
});

exports.deleteOne = handlerFactory.deleteOne(User);

exports.getOne = handlerFactory.getOne(User);
