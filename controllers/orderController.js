const handleFactory = require('../controllers/handlerFactory');
const Order = require('../models/orderModel');

exports.addOrder = handleFactory.addOne(Order);