import { DynamicStructuredTool } from "@langchain/core/tools";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createSessionUrl } from "../utils/paymentGateway.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/menuModel.js";
import food from "../models/menuModel.js";

let redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export function generatePaymentLink() {
  return new DynamicStructuredTool({
    name: "generatePaymentLink",
    description:
      "Generates a secure Stripe payment link for the user's order so they can complete the payment online.",
    schema: z.object({}),
    func: async ({}, config) => {
      try {
        let cart = [];
        console.log(config);
        let rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        if (rawCart) {
          cart = typeof rawCart == "string" ? JSON.parse(rawCart) : rawCart;
        }

        if (cart.length == 0)
          return `❌ 🛒 cart is currently empty. Please first add some items in cart and try again!`;

        const paymentLink = await createSessionUrl(cart);
        return `Ok please go ahead and click and pay using 💳 ${paymentLink}`;
      } catch (err) {
        console.log(err);
      }
    },
  });
}

export function paymentSuccess() {
  return new DynamicStructuredTool({
    name: "paymentSuccess",
    description:
      "displays necessary messages after payment is successful.Only run this method when you receive input as `paymentsuccessfrombot`",
    schema: z.object({}),
    func: async ({}, config) => {
      try {
        let message = "✅ Payment successful! Thank you for your order.";

        let cart = [];
        let rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        if (rawCart) {
          cart = typeof rawCart == "string" ? JSON.parse(rawCart) : rawCart;
        }

        let foodItems = await Promise.all(
          cart.map(async (cartItem) => {
            let food = await foodModel.findOne({
              name: { $regex: new RegExp(`^${cartItem.name}$`, "i") },
            });
            return food._doc;
          })
        );

        let itemIds = [];
        let restaurantIds = new Set();

        foodItems.forEach((item) => {
          itemIds.push(item._id.toString());
          item.restaurants.forEach((rest) => {
            restaurantIds.add(rest._id.toString());
          });
        });

        let createdOrder = await orderModel.create({
          restaurant: Array.from(restaurantIds),
          customer: config.metadata.userId,
          items: itemIds,
        });

        const itemList = cart
          .map(
            (item, index) => `  ${index + 1}. ${item.name} x ${item.quantity}`
          )
          .join("\n");

        message += `\n🛒 Order Summary with Order Id : ${createdOrder._id.ToString()}:\n${itemList}`;

        return message;
      } catch (err) {
        console.log(err);
      }
    },
  });
}
