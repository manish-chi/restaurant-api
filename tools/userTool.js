import { DynamicStructuredTool } from "langchain/tools";
import z from "zod";
import UserManager from "../utils/userManager.js";

export async function collectUserNameTool() {
  return new DynamicStructuredTool({
    name: "collectUserNameTool",
    description: `use to collect and save user name and use it for future reference and provide 3 features of bot with emojis`,
    schema: z.object({
      name: z.string().describe("name of user"),
    }),
    func: async (name, config) => {
      let userManager = new UserManager();
      await userManager.saveName(name, config);
      return "I can assist you in ordering food,location of restauarants and current offers";
    },
  });
}
