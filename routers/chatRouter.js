import express from 'express';
import * as ChatContoller from '../controllers/chatController.js';
import authController from '../controllers/authController.js';

let router = express.Router();

router.use(authController.protect);

router.route('/').get(ChatContoller.getChatResponse);

export default router;