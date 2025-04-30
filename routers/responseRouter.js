import express from "express";
import * as responseController from "../controllers/responseController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.use(authController.protect);


router
  .route("/get-welcome-response")
  .get(responseController.getFreshWelcomeResponse);

router.route('/get-intent-response').get(responseController.getIntentResponse);

router.route('/get-default-response').get(responseController.getDefaultResponse);

router.route('/get-reengagement-response').get(responseController.getReEngageResponse);

router.route('/get-preorder-response').get(responseController.getPreOrderResponse);

// router.route('/add-fooditems-response').post(responseController.addToCart);

export default router;
