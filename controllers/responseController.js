import * as embedDocuments from "../utils/embed-documents.js";
import catchAsync from "../utils/catchAsync.js"; // Make sure the filename matches ("catchAsync", not "catchASync")
import Formatter from "../utils/formatter.js";
import { PromptTemplate } from "@langchain/core/prompts";
import { createGPTConnector, createModel } from "../utils/gptConnector.js";
import intentSchema from "../models/intentModel.js";
import foodModel from "../models/menuModel.js";

export const getFreshWelcomeResponse = catchAsync(async (req, res, next) => {
  const llm = await createModel();

  const response = await llm.invoke(
    [
      {
        role: "system",
        content:
          "You are a cheerful and helpful restaurant chatbot for 'Dhaba Delicious'. Greet users warmly with a short message (1–2 sentences, under 35 words) using friendly emojis 😊🍽️ Also, show Order Food, Locate us and Offer as options to choose from(add emoji's to all these options), Then, kindly ask for their name to get started.",
      },
      {
        role: "user",
        content: "user will provide name",
      },
    ],
    {
      configurable: {
        sessionId: req.query.sessionId,
      },
    }
  );

  return res.status(200).json({
    status: "success",
    data: response.content,
  });
});

export const getIntentResponse = catchAsync(async (req, res, next) => {
  const userMessage = req.body.query;

  const response = await createModel().invoke(
    [
      {
        role: "system",
        content: `You are an intent classifier for a restaurant chatbot. Extract food items and quantity from the user's message. Return it as JSON array like: 
          1. "offers"
          2. "locate"
          3. "orderFood"
          4. "addItems"
          5. "proceedToPayment" 
          6. "viewCart"

          [

  { intent : "orderFood" ,[{"item": "Butter Naan", "quantity": 1},{"item": "Paneer Butter Masala", "quantity": 2}] }
          ]
          
          User Input: ${userMessage}
          `,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    {
      functions: [intentSchema],
      function_call: "auto",
    }
  );

  const parsed = JSON.parse(
    response.content.replace(/```(?:json)?\n?/g, "").replace(/```$/, "")
  );

  console.log(parsed[0]);

  return res.status(200).json({
    status: "success",
    intent: parsed[0].intent,
    foodItems: parsed[0].items,
  });
});

export const getDefaultResponse = catchAsync(async (req, res, next) => {
  const userMessage = req.body.query;

  const response = await createModel().invoke([
    {
      role: "system",
      content: `You're a helpful restaurant assistant for Dhaba Delicious. 
If the user asks something off-topic, respond politely and guide them back to ordering, locating the restaurant, or viewing offers.`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ]);

  return res.status(200).json({
    status: "success",
    data: response.content,
  });
});

export const getReEngageResponse = catchAsync(async (req, res, next) => {
  const userMessage = req.body.query;

  const response = await createModel().invoke([
    {
      role: "system",
      content: `You're a helpful restaurant assistant for Dhaba Delicious. 
If the user completes order redirect them to ordering, locating the restaurant, or viewing offers.Keep the prompt more user enganging that use will feel it as continuous prompt.`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ]);

  return res.status(200).json({
    status: "success",
    data: response.content,
  });
});

export const getPreOrderResponse = catchAsync(async (req, res, next) => {
  const mealType = new Formatter().MenuTimeOfDay();
  console.log(mealType);

  const foodItems = await foodModel
    .aggregate([
      {
        $match: { mealType: mealType },
      },
      { $sample: { size: 2 } },
    ])
    .limit(3);

  //console.log(foodItems);

  const sortedList = foodItems
    .map((item) => `${item.name} - ${item.description}`)
    .join(",");

  console.log(sortedList);

  const response = await createModel().invoke([
    {
      role: "system",
      content: `You're a friendly assistant for a restaurant named Dhaba Delicious.
When the user wants to order food, recommend special items from the current time's menu.
Use a casual tone and include emojis.`,
    },
    {
      role: "user",
      content: `Suggest something great for ${mealType}. Here are a few dishes: ${sortedList}.Keep this sentence as short as possible mostly till 30 words.Take ${sortedList} and form a sentence.`,
    },
  ]);

  return res.status(200).json({
    status: "success",
    data: response.content,
    items: foodItems,
  });
});
