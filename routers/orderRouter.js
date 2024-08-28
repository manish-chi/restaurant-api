const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.route('/').post(orderController.addOrder);

router.route('/top-3-orders').get(orderController.top3Orders);

module.exports = router;