import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";
import foodModel from "../models/menuModel.js";
import { validateHeaderValue } from "node:http";

export function getMenuByCategory() {
  return new DynamicStructuredTool({
    name: "getMenuByCategory",
    description:
      "Fetch menu items based on category like 'tandoor', 'main course', 'drinks', or 'tiffins' and also invoke if the user asks for menu related queries or its type.",
    schema: z.object({
      category: z
        .string()
        .describe(
          "identify if user is asking for category such as 'tandoor,main course,beverages'"
        ),
    }),
    func: async ({ category }, config) => {
      const lower = category.toLowerCase();

      let val;
      let query = {};
      if (lower.includes("drink") || lower.includes("beverage")) {
        val = "beverages";
      }
      if (lower.includes("tiffin" || "breakfast")) {
        val = "tiffins";
      }

      if (lower.includes("tandoor")) {
        val = "tandoor";
      }
      if (lower.includes("main course")) {
        val = "main course";
      }

      if (query.length == 0) {
        return "Please specify a valid category like drinks, tandoor, tiffins, or main course.";
      }

      query = { category: { $regex: new RegExp(`${val}`, "i") } };

      const items = await foodModel
        .find(query)
        .select("name price_in_INR description");

      if (!items.length) return "No items found in that category.";

      return items
        .map(
          (item) =>
            `${item.name} - Rs. ${item.price_in_INR}\n${item.description}`
        )
        .join("\n\n");
    },
  });
}

export function getMenuItems() {
  return new DynamicStructuredTool({
    name: "getMenuItems",
    description:
      "Fetch real dishes by name, category, or keyword to avoid hallucination",
    schema: z.object({
      value: z
        .string()
        .describe(
          "identify if user is asking for category such as 'tandoor,main course,beverages,breakfast or asking randomly about the food items. Also always replace drinks with beverages  and also replace tiffins with breakfast!"
        ),
    }),
    func: async ({ value }, config) => {
      const keywords = value.toLowerCase().split(" ").filter(Boolean);

      if (keywords.contains("breakfast"))
        keywords.replace("breakfast", "tiffins");

      const query = {
        $or: [
          { name: { $regex: keywords.join("|"), $options: "i" } },
          { description: { $regex: keywords.join("|"), $options: "i" } },
          { category: { $regex: keywords.join("|"), $options: "i" } },
        ],
      };

      const items = await foodModel
        .find(query)
        .select("name price_in_INR description");

      if (!items.length)
        return "Sorry, I couldn't find any items matching that.";

      return items
        .map(
          (item) =>
            `🍽️ ${item.name} - Rs. ${item.price_in_INR}\n${item.description}`
        )
        .join("\n\n");
    },
  });
}
