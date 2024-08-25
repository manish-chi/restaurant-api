const handlerFactory = require('../controllers/handlerFactory');
const User = require('../models/userModel');

exports.deleteOne = handlerFactory.deleteOne(User);

exports.getOne = handlerFactory.getOne(User);