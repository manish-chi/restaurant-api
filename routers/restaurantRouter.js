const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const authController = require('../controllers/authController');
const menuRouter = require('../routers/menuRouter');

router.use(authController.protect);

router.route('/nearby-restaurants').get(restaurantController.getNearestRestaurants);

router
.route("/")
.get(restaurantController.getAllRestaurants)
.post(restaurantController.addRestaurant);



router
.route("/:id")
.get(restaurantController.getRestaurant)
.delete(restaurantController.deleteRestaurant)
.patch(restaurantController.updateRestaurant);

router.use('/:restaurantId/menu',menuRouter);

module.exports = router;
