import express from 'express';
import cardController from '../controllers/cardController.js';
import authController from '../controllers/authController.js';

const Router = express.Router();


Router.use(authController.protect);
Router.route('/datetime-card').get(cardController.getDateTimeCard);
Router.route('/nearest-restaurants-card').get(cardController.getNearestRestaurantCard);
Router.route('/menu-card').get(cardController.getMenuCard);

export default Router;