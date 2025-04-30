import orderModel from "../models/orderModel.js";
import { Redis } from "@upstash/redis";
import foodModel from '../models/menuModel.js';

class OrderManager {
  constructor() {
    this.restaurantIds = new Set();
    this.itemIds = [];
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async createOrder(cartManager, user) {
    try {
      await this.#prepareOrder(cartManager);

      let createdOrder = await orderModel.create({
        restaurant: Array.from(this.restaurantIds),
        customer: user._id.toString(),
        items: this.itemIds,
      });

      return createdOrder;
    } catch (err) {
      console.log(err);
    }
  }

  async #prepareOrder(cartManager) {
    let foodItems = await Promise.all(
      cartManager.cart.map(async (cartItem) => {
        let food = await foodModel.findOne({
          name: { $regex: new RegExp(`^${cartItem.name}$`, "i") },
        });
        return food._doc;
      })
    );

    foodItems.forEach((item) => {
      this.itemIds.push(item._id.toString());
      item.restaurants.forEach((rest) => {
        this.restaurantIds.add(rest._id.toString());
      });
    });
  }
}

export default OrderManager;
