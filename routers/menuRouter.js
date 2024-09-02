const express = require('express');
const menuController = require('../controllers/menuController');
const router = express.Router({mergeParams : true});
const authController = require('../controllers/authController');

router.use(authController.protect);
router.route('/').get(menuController.getMenuItemsByName);
router.route('/').post(menuController.addDish);

//router.route('/top-3-dishes').get(menuController.getTop3dishes);

module.exports = router;