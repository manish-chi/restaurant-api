const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
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

module.exports = router;
