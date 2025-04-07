import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();


router.route('/:id').get(authController.generateDirectLineToken);

export default router;