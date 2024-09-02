const handleFactory = require('../controllers/handlerFactory');

exports.getDateTimeCard = handleFactory.getCard(`../dev-data/restaurants/date-time-card.json`);

exports.getNearestRestaurantCard = handleFactory.getCard(`../dev-data/restaurants/near-restau-cards.json`);

exports.getMenuCard = handleFactory.getCard('../dev-data/menu/menu-item-card.json');

