const handleFactory = require('../controllers/handlerFactory');

exports.getDateTimeCard = handleFactory.getCard(`../restaurant-api/dev-data/restaurants/date-time-card.json`);

exports.getNearestRestaurantCard = handleFactory.getCard(`../restaurant-api/dev-data/restaurants/near-restau-cards.json`);

exports.getMenuCard = handleFactory.getCard('../restaurant-api/dev-data/menu/menu.json');