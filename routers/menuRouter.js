import express from 'express';
import * as  menuController from '../controllers/menuController.js';
import authController from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });


router.use(authController.protect);
router.route('/').get(menuController.getMenuItemsByName);
router.route('/').post(menuController.addDish);
router.route('/search').get(menuController.getMenuBySearch);
//router.route('/:name').get(menuController.getMenuItemByName);
//router.route('/top-3-dishes').get(menuController.getTop3dishes);

export default router;