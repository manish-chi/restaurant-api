const express = require('express');
let Router = express.Router();
let cardController = require('../controllers/cardController');

Router.route('/datetime-card').get(cardController.getDateTimeCard);
Router.route('/nearest-restaurants-card').get(cardController.getNearestRestaurantCard);
Router.route('/menu-card').get(cardController.getMenuCard);

module.exports = Router;