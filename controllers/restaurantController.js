let handlerFactory = require("../controllers/handlerFactory");
let Restaurant = require("../models/restaurantModel");

exports.getAllRestaurants = handlerFactory.getAll(Restaurant);

exports.getRestaurant = handlerFactory.getOne(Restaurant);

exports.addRestaurant = handlerFactory.addOne(Restaurant);

exports.updateRestaurant = handlerFactory.updateOne(Restaurant);

exports.deleteRestaurant = handlerFactory.deleteOne(Restaurant);
