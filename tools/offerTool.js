import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createModel } from "../utils/aiModelsManager.js";

export default function offers() {
  return new DynamicStructuredTool({
    name: "offers",
    description: "gives offers related to the restaurant",
    schema: z.object({}),

    func: async () => {
      const model = createModel();

      const result = await model.invoke([
        {
          role: "system",
          content: `You're a friendly assistant for a restaurant named Dhaba Delicious.
                  When the user wants to know about offers being provided.Currently tell that restaurant is providing 25% offer on the menu on wednesday and saturday.Use emoji's whereever needed.
                  Use a casual tone and include emojis.`,
        },
        {
          role: "user",
          content: "can i have discount!",
        },
      ]);
      return result.content;
    },
  });
}
