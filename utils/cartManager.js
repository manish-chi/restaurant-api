import { Redis } from "@upstash/redis";
import foodModel from "../models/menuModel.js";

class cartManager {
  constructor() {
    this.cart = [];
    this.notFoundItemsMessages = [];
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async addToCart(items, config) {
    await this.getCart(config);

    for (let userAskedItem of items) {
      let retrivedFoodItem = await foodModel
        .findOne({
          name: { $regex: new RegExp(`^${userAskedItem.dish}$`, "i") },
        })
        .select("name price_in_INR image type")
        .lean();

      if (!retrivedFoodItem) {
        this.notFoundItemsMessages.push(
          `${userAskedItem.name} is not served here.`
        );
        continue;
      }

      this.#addFoundItem(retrivedFoodItem, userAskedItem);
    }

    await this.redis.set(
      `cart:${config.metadata.sessionId}`,
      JSON.stringify(this.cart)
    );
  }

  async removeFromCart(items, config) {
    await this.getCart(config);

    let updatedCart = [];

    items.forEach((item) => {
      let foundFoodItem = this.cart.find(
        (x) => x.name.toLowerCase().trim() == item.dish.toLowerCase().trim()
      );

      if (!foundFoodItem)
        failedMessages.push(`❌ ${item.dish} is not present in the cart!`);

      let updatedQuantity = foundFoodItem.quantity - item.quantity;
      if (updatedQuantity < 0)
        failedMessages.push(
          `❌ quantity provided is far higher than cart quantity for ${cartItem.name}`
        );

      foundFoodItem.price = foundFoodItem.price_in_INR * updatedQuantity;
      foundFoodItem.quantity = updatedQuantity;
      updatedCart.push(foundFoodItem);
    });

    this.cart = this.cart.filter((cartItem) => {
      let updatedItem = updatedCart.find(
        (x) =>
          x.name.toLowerCase().trim() === cartItem.name.toLowerCase().trim()
      );
      if (updatedItem) {
        return updatedItem.quantity != 0;
      }
      return cartItem;
    });

    await this.redis.set(
      `cart:${config.metadata.sessionId}`,
      JSON.stringify(this.cart)
    );
  }

  async getCart(config) {
    const rawCart = await this.redis.get(`cart:${config.metadata.sessionId}`);

    if (rawCart) {
      this.cart = typeof rawCart === "string" ? JSON.parse(rawCart) : rawCart;
    }
  }

  #addFoundItem(retrivedFoodItem, userAskedItem) {
    const itemPrice = retrivedFoodItem.price_in_INR;

    retrivedFoodItem.price = userAskedItem.quantity * itemPrice;

    this.#addIfExisistingItem(retrivedFoodItem, userAskedItem);
  }

  #addIfExisistingItem(retrivedFoodItem, userAskedItem) {
    let existing = this.cart.find((c) => {
      if (!c?.name || !userAskedItem?.dish) {
        return false;
      }
      return c.name.toLowerCase() === userAskedItem.dish.toLowerCase();
    });

    if (existing) {
      existing.quanity += userAskedItem.quantity;
      this.cart = this.cart.filter(
        (item) => item?.name.toLowerCase() === existing.name
      );
      this.cart.push(existing);
    } else {
      retrivedFoodItem.quantity = userAskedItem.quantity;
      this.cart.push(retrivedFoodItem);
    }
  }
}

export default cartManager;
