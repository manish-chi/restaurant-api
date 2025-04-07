import express from "express";
import authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/update-password").patch(authController.updatePassword);
router
  .route("/:id")
  .get(userController.getOne)
  .delete(userController.deleteOne);

export default  router;
