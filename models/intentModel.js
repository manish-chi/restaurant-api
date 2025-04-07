const intentSchema = {
  name: "classify_user_intent",
  description: "Classify the user's intent as one of the restaurant's actions",
  parameters: {
    type: "object",
    properties: {
      intent: {
        type: "string",
        enum: ["orderFood", "locate", "offers","reserveTable"],
      },
    },
    required: ["intent"],
  },
};
export default intentSchema;