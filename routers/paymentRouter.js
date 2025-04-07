import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.protect);

router.route('/create-cart-session').post(paymentController.createSessionUrl);

export default router;