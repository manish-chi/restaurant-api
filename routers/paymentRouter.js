const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.route('/create-card-session').post(paymentController.createSessionUrl);

module.exports = router;