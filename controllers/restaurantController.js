let handlerFactory = require("../controllers/handlerFactory");
let Restaurant = require("../models/restaurantModel");
let catchAsync = require("../utils/catchAsync");
let AppError = require("../utils/appError");
let Menu = require("../models/menuModel");
let sendMail = require("../utils/mailer");
const mongoose = require("mongoose");
let fs = require("fs");

exports.verifyRestaurant = catchAsync(async(req,res,next) => {
  let { restaurant } = { ...req.body };

  const retrivedRestaurant = await Restaurant.findById(restaurant);

  if (!retrivedRestaurant)
    next(new AppError(404, `Restaurant with ID ${restaurant} not found!`));

  next();
 
});

exports.getAllRestaurants = handlerFactory.getAll(Restaurant);

exports.getRestaurant = handlerFactory.getOne(Restaurant);

exports.addRestaurant = handlerFactory.addOne(Restaurant);

exports.updateRestaurant = handlerFactory.updateOne(Restaurant);

exports.deleteRestaurant = handlerFactory.deleteOne(Restaurant);

exports.getNearestRestaurants = catchAsync(async (req, res, next) => {
  let user = { lat: "17.51547032483256", longi: "78.49404345991756" };

  // Restaurant.createIndex( { "location.cordinates": "2dsphere" } );

  var restaurants = await Restaurant.find({
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [user.lat, user.longi],
        },
        $maxDistance: 4000,
      },
    },
  });

  restaurants = restaurants.slice(0, 3);

  if (!restaurants)
    throw new AppError(404, "Sorry,Couldn't find nearby Restaurants!");

  return res.status(200).json({
    status: "Success",
    data: restaurants,
  });
});

exports.getRestaurantUsingMenuItemNames = catchAsync(async (req, res, next) => {
  let items = JSON.parse(req.query.menuItemNames);

  let restaurantsData = await Promise.all(
    items.map(async (item) => {
      let query = Menu.find({ name: { $regex: `${item}.*`, $options: "i" } });
      query = query.distinct("restaurants");
      return await query;
    })
  );

  let uniqueRestaurantIdSet = new Set();

  restaurantsData.forEach((restaurants) => {
    restaurants.forEach((id) => {
      uniqueRestaurantIdSet.add(id.toString());
    });
  });

  let uniqueRestaurantArray = Array.from(uniqueRestaurantIdSet);

  let restaurants = await Restaurant.find({_id : {$in : uniqueRestaurantArray}});

  return res.status(200).json({
    status: "success",
    data: restaurants,
  });
});
