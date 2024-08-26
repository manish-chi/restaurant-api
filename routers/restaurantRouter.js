let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurantController");
let menuRouter = require('../routers/menuRouter');


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
