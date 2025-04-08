const intentSchema = {
  name: "classify_user_intent",
  description: "Classify the user's intent as one of the restaurant's actions",
  parameters: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["orderFood", "locate", "offers","reserveTable","AddItems","ViewCart","ProceedToPayment"],
      },
      foodItems:{
        type : ["string"],
      },
      quantity:{
        type : Number,
      },
    },
    required: ["intent","foodItems"],
  },
};
export default intentSchema;