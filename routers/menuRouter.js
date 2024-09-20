let express = require('express');
let menuController = require('../controllers/menuController');
const router = express.Router({mergeParams : true});

router.route('/').get(menuController.getMenuItemsByName);
router.route('/').post(menuController.addDish);
//router.route('/:name').get(menuController.getMenuItemByName);
//router.route('/top-3-dishes').get(menuController.getTop3dishes);

module.exports = router;