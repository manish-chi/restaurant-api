import * as handlerFactory from "../controllers/handlerFactory.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const verifyUser = catchAsync(async (req, res, next) => {
  let { user } = { ...req.body };

  const retrivedUser = await User.findById(user);

  if (!retrivedUser) next(new AppError(404, `User with ID ${user} not found!`));

  next();
});

export const deleteOne = handlerFactory.deleteOne(User);

export const getOne = handlerFactory.getOne(User);
