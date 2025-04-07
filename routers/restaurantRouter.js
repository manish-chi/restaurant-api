import express from "express";
import * as restaurantController from "../controllers/restaurantController.js";
import authController from "../controllers/authController.js";
import menuRouter from "../routers/menuRouter.js";

const router = express.Router();

router.use(authController.protect);

router.route('/nearby-restaurants').get(restaurantController.getNearestRestaurants);

router
.route("/")
.get(restaurantController.getRestaurantUsingMenuItemNames)
.get(restaurantController.getAllRestaurants)
.post(restaurantController.addRestaurant);



router
.route("/:id")
.get(restaurantController.getRestaurant)
.delete(restaurantController.deleteRestaurant)
.patch(restaurantController.updateRestaurant);

router.use('/:restaurantId/menu',menuRouter);

export default router;
