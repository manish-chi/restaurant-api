import  * as handleFactory from '../controllers/handlerFactory.js';

const getDateTimeCard = handleFactory.getCard(`../restaurant-api/dev-data/restaurants/date-time-card.json`);

const getNearestRestaurantCard = handleFactory.getCard(`../restaurant-api/dev-data/restaurants/near-restau-cards.json`);

const getMenuCard = handleFactory.getCard('../restaurant-api/dev-data/menu/menu-item-card.json');

export default {
    getDateTimeCard,
    getNearestRestaurantCard,
    getMenuCard
}