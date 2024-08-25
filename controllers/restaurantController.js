let handlerFactory = require("../controllers/handlerFactory");
let Restaurant = require("../models/restaurantModel");
let catchAsync = require('../utils/catchAsync');
let AppError = require('../utils/appError');
let sendMail = require('../utils/mailer');
let fs = require('fs');

exports.getAllRestaurants = handlerFactory.getAll(Restaurant);

exports.getRestaurant = handlerFactory.getOne(Restaurant);

exports.addRestaurant = handlerFactory.addOne(Restaurant);

exports.updateRestaurant = handlerFactory.updateOne(Restaurant);

exports.deleteRestaurant = handlerFactory.deleteOne(Restaurant);

exports.getNearestRestaurants = catchAsync(async (req,res,next) => {

    let user = { lat : '17.51547032483256' , longi : '78.49404345991756'};

    // Restaurant.createIndex( { "location.cordinates": "2dsphere" } );

            
    var restaurants = await Restaurant.find({"location.coordinates" : {
        $near : {
           $geometry : {
              type : "Point",
              coordinates : [ user.lat, user.longi ]
           },
           $maxDistance : 4000
        }
      }});

      restaurants = restaurants.slice(0,3);
      
    if(!restaurants) throw new AppError(404,"Sorry,Couldn't find nearby Restaurants!");
     
    return res.status(200).json({
        status : 'Success',
        data : restaurants,
    });
});