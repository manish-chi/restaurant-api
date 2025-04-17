import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export function welcome() {
  return new DynamicStructuredTool({
    name: "getWelcomeMessage",
    description:
      "Greets the user and shows available options like food, offers, or reservation with emoticons",
    schema: z.object({}),
    func: async () => {
      return `
      👋 Welcome to **Dabha Delicious Restaurant**!
      
      📍 We are located at: **123 Spice Street, Foodville, FL 45678**
      
      Here are your options:
      1️⃣ **Order Food** - Explore our delicious menu  
      2️⃣ **Offers** - Check out today’s special deals  
      3️⃣ **Reserve Table** - Book a table for your visit
      
      How can I assist you today?
      `;
    },
  });
}
