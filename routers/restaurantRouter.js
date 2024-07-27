let express = require("express");
let router = express.Router();
let restaurantController = require("../controllers/restaurantController");

router
  .route("/")
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.addRestaurant);

router
  .route("/:id")
  .get(restaurantController.getRestaurant)
  .delete(restaurantController.deleteRestaurant)
  .patch(restaurantController.updateRestaurant);

module.exports = router;
