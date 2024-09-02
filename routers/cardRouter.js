const express = require('express');
const Router = express.Router();
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');


Router.use(authController.protect);
Router.route('/datetime-card').get(cardController.getDateTimeCard);
Router.route('/nearest-restaurants-card').get(cardController.getNearestRestaurantCard);
Router.route('/menu-card').get(cardController.getMenuCard);

module.exports = Router;