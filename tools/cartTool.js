import { DynamicStructuredTool } from "@langchain/core/tools";
import foodModel from "../models/menuModel.js";
import z from "zod";
import { Redis } from "@upstash/redis";
import food from "../models/menuModel.js";

export let redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

let cartMemory = new Map();

export function addToCart() {
  return new DynamicStructuredTool({
    name: "addToCart",
    description:
      "Adds one or more food items to the cart. Trigger this when the user says things like 'add', 'order', 'want', 'get', or 'have' followed by a dish name.",
    schema: z.object({
      items: z
        .array(
          z.object({
            dish: z.string().describe("Name of the food dish"),
            quantity: z.number().min(1).describe("how many units of dish"),
          })
        )
        .describe("List of dishes and their quantities"),
    }),
    func: async ({ items }, config) => {
      try {
        let messagesAdded = [];
        const rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        const cart = rawCart ? JSON.parse(rawCart) : [];

        for (let item of items) {
          let foodItem = await foodModel
            .findOne({
              name: { $regex: new RegExp(`^${item.dish}$`, "i") },
            })
            .select("name price_in_INR")
            .lean();

          if (!foodItem) {
            messagesAdded.push(`${item.name} is not served here.`);
            continue;
          }

          const itemPrice = foodItem.price_in_INR;

          foodItem.price = item.quantity * itemPrice;

          let existing = cart.find(
            (c) => c.name.toLowerCase() === item.dish.toLowerCase()
          );

          if (existing) {
            existing.quanity += item.quanity;
            cart.quanity = existing.quanity;
          } else {
            foodItem.quantity = item.quantity;
            cart.push(foodItem);
          }
        }

        // Build summary
        let summary = "🛒 Here's your updated cart:\n";
        let totalItems = 0;

        cart.forEach((item, idx) => {
          summary += `${idx + 1}. ${item.quanity} x ${item.name} = ${
            item.price
          }🍽️\n`;
          totalItems += 1;
        });

        console.log(cart);

        await redis.set(
          `cart:${config.metadata.sessionId}`,
          JSON.stringify(cart)
        );

        summary += `❌${messagesAdded.join(
          ","
        )}\n\n✅ Total items: ${totalItems}\n🧾 You can proceed to checkout or add more items?`;

        return summary;
      } catch (err) {
        console.log(err);
      }
    },
  });
}

export function showCart() {
  return new DynamicStructuredTool({
    name: "showCart",
    description: "shows the cart to the user",
    schema: z.object({}),
    func: async (input, config) => {
      try {
        const rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        let cart = [];

        if (rawCart) {
          cart = typeof rawCart === "string" ? JSON.parse(rawCart) : rawCart;
        }

        if (cart.length == 0) return `Oops! cart 🛒 seems empty! ❗`;

        let totalCost = 0;
        let summary = cart.map((item, idex) => {
          totalCost = totalCost + item.price * item.quantity;
          return `${idex + 1}. ${item.name} x ${
            item.quantity
          } = ${totalCost}\n`;
          totalCost = 0;
        });

        return `${summary}\n 💰Total Amount = ₹${totalCost}`;
      } catch (err) {
        console.log(err);
      }
    },
  });
}
