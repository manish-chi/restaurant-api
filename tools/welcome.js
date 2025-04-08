import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createModel } from "../utils/gptConnector.js";

export default function welcome() {
  return new DynamicStructuredTool({
    name: "getWelcomeMessage",
    description: "get welcome message from the user",
    schema: z.object({}),
    func: async () => {
      const model = await createModel();

      const result = await model.invoke(
        {
          role: "system",
          content:
            "You are a friendly restaurant bot for 'Dhaba Delicious' that helps users order food, book tables, and explore offers. Greet the user with a short, cheerful message (1-2 sentences, max 35 words). Use emojis. After greeting, show 3 navigation options: Order Food, Locate Us, and Offers, clearly as buttons or bullet points and add emojis",
        }
      );
      return result.content;
    },
  });
}
