import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";
import Formatter from "../utils/formatter.js";

import CartManager from "../utils/cartManager.js";

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
        let cartManager = new CartManager();

        await cartManager.addToCart(items, config);

        let summary = new Formatter().getAddToCartSummary(cartManager);

        return JSON.stringify({ summary: summary, items: cartManager.cart });
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
      try {
        const cartManager = new CartManager();

        await cartManager.getCart(config);

        let summary = await new Formatter().getCartSummary(cartManager);

        return JSON.stringify({ summary: summary, items: cartManager.cart });
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
      let cartManager = new CartManager();

      await cartManager.removeFromCart(items, config);

      return await new Formatter().getCartSummary(cartManager);
    },
  });
}
