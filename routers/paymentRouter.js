const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/create-cart-session').post(paymentController.createSessionUrl);

module.exports = router;