import express from "express";
import * as responseController from "../controllers/responseController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.protect);

router.route("/food-response").get(responseController.getFoodResponseToUser);

router
  .route("/get-welcome-response")
  .get(responseController.getFreshWelcomeResponse);

router.route('/get-intent-response').get(responseController.getIntentResponse);

router.route('/get-default-response').get(responseController.getDefaultResponse);

export default router;
