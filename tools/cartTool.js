import { DynamicStructuredTool } from "@langchain/core/tools";
import foodModel from "../models/menuModel.js";
import z from "zod";
import { Redis } from "@upstash/redis";
import Formatter from "../utils/formatter.js";
import { RequestsToolkit } from "langchain/agents";

export let redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CartItemSchema = z.object({
  name: z.string().describe("The name of the product in the cart."),
  image: z
    .string()
    .optional()
    .describe("The URL or path to the product's image."),
  price: z.number().optional().describe("The price of the product."),
});

const AddToCartOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A summary of the current cart, including the number of items and subtotal."
    ),
  cart_items: z
    .array(CartItemSchema)
    .describe("An array of items currently in the shopping cart."),
});

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
    returnType: AddToCartOutputSchema,
    func: async ({ items }, config) => {
      try {
        let messagesAdded = [];
        let cart = [];
        let foundItems = [];

        const rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        if (rawCart) {
          cart = typeof rawCart == "string" ? JSON.parse(rawCart) : rawCart;
        }

        for (let item of items) {
          let foodItem = await foodModel
            .findOne({
              name: { $regex: new RegExp(`^${item.dish}$`, "i") },
            })
            .select("name price_in_INR image type")
            .lean();

          if (!foodItem) {
            messagesAdded.push(`${item.name} is not served here.`);
            continue;
          }

          foundItems.push(foodItem);

          const itemPrice = foodItem.price_in_INR;

          foodItem.price = item.quantity * itemPrice;

          let existing = cart.find(
            (c) => c.name.toLowerCase() === item.dish.toLowerCase()
          );

          if (existing) {
            existing.quanity += item.quantity;
            cart.quantity = existing.quanity;
          } else {
            foodItem.quantity = item.quantity;
            cart.push(foodItem);
          }
        }

        // Build summary
        let summary = "🛒 Here's your updated cart:\n";
        let totalItems = 0;

        cart.forEach((item, idx) => {
          summary += `${item.type} == "veg" ? "🟢" : "🔴" ${idx + 1}. ${
            item.quantity
          } x ${item.name} = ${item.price}🍽️\n`;
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

        return JSON.stringify({ summary: summary, items: foundItems });
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
    func: async ({}, config) => {
      let failedMessages = [];

      try {
        const rawCart = await redis.get(`cart:${config.metadata.sessionId}`);
        let cart = [];

        if (rawCart) {
          cart = typeof rawCart === "string" ? JSON.parse(rawCart) : rawCart;
        }

        let summary = await new Formatter().getCartSummary(
          config,
          redis,
          failedMessages,
          cart
        );
        return JSON.stringify({ summary: summary, items: cart });
      } catch (err) {
        console.log(err);
      }
    },
  });
}

export function removeFromCart() {
  return new DynamicStructuredTool({
    name: "removeFromCart",
    description:
      "extracts the food items and quantity and removes it from the cart",
    schema: z.object({
      items: z.array(
        z.object({
          dish: z.string().describe("Name of the food dish"),
          quantity: z.number().min(1).describe("how many units of dish"),
        })
      ),
    }),
    func: async ({ items }, config) => {
      let cart = [];

      let rawCart = await redis.get(`cart:${config.metadata.sessionId}`);

      if (rawCart) {
        cart = typeof rawCart == "string" ? JSON.parse(rawCart) : rawCart;
      }

      console.log(items);

      let failedMessages = [];

      let updatedCart = [];

      items.forEach((item) => {
        let foundFoodItem = cart.find(
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

      cart = cart.filter((cartItem) => {
        let updatedItem = updatedCart.find(
          (x) =>
            x.name.toLowerCase().trim() === cartItem.name.toLowerCase().trim()
        );
        if (updatedItem) {
          return updatedItem.quantity != 0;
        }
        return cartItem;
      });

      await redis.set(
        `cart:${config.metadata.sessionId}`,
        JSON.stringify(cart)
      );

      return await new Formatter().getCartSummary(
        config,
        redis,
        failedMessages
      );
    },
  });
}
