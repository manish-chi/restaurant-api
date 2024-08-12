let express = require('express');
let menuController = require('../controllers/menuController');
const router = express.Router({mergeParams : true});

router.route('/').get(menuController.getMenuItemsByName);
router.route('/').post(menuController.addDish);
module.exports = router;