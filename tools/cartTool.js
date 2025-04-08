import { DynamicStructuredTool } from "@langchain/core/tools";
import foodModel from "../models/menuModel.js";
//import memory from "../utils/gptConnector.js";
import z from "zod";

export const addToCart = () => {
  return new DynamicStructuredTool({
    name: "addToCart",
    description:
      "adds multiple dishes to the cart after verifying they're available in the menu.",
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
      let messagesAdded = [];
      let memory = config?.configurable?.memory;

      let cart = [];

      let currentCart = await memory?.getMemoryValue("cart");

      if (currentCart) cart = currentCart;

      for (let item of items) {
        let foodItem = await foodModel
          .find({ name: { $regex: new RegExp(`^${item.dish}$`, "i") } })
          .select("name price");


        if (foodItem.length == 0) {
          messagesAdded.push(`${item.name} is not served here.`);
          continue;
        }

        let existing = cart.find({ name: item.dish });

        if (existing) {
          existing.quanity += item.quanity;
        } else {
          cart.push(foodItem);
        }

        foodItem.price = item.quantity * item.price;
        return foodItem;
      }

      // Build summary
      let summary = "🛒 Here's your updated cart:\n";
      let totalItems = 0;

      cart.forEach((item, idx) => {
        summary += `${idx + 1}. ${item.quanity} x ${item.name} = ${
          item.price
        }🍽️\n`;
        totalItems += items.quanity;
      });

      await config.configurable.setMemoryValue("cart", cart);

      summary += `❌${messagesAdded.join(
        ","
      )}\n\n✅ Total items: ${totalItems}\n🧾 You can proceed to checkout or add more items?`;

      return summary;
    },
  });
};

export const showCart = (config) => {
  return new DynamicStructuredTool({
    name: "showCart",
    description: "shows the cart to the user",
    schema: z.object({}),
    func: async () => {
      let cart = [];
      console.log(await config?.configurable.getMemoryValue("cart"));
      let currentCart = await config?.configurable.getMemoryValue("cart");
      if (currentCart) cart = currentCart;

      if (cart.length == 0) return `Oops! cart 🛒 seems empty! ❗`;

      let totalCost = 0;
      let summary = cart.map((item, idex) => {
        totalCost += item.price * item.quanity;
        return `${idex + 1}. ${item.name} x ${item.quanity} = ${item.price} * ${
          item.quantity
        }\n`;
      });

      return `${summary}\n 💰Total Amount = ₹${totalCost}`;
    },
  });
};
