import * as embedDocuments from "../utils/embed-documents.js";
import catchAsync from "../utils/catchAsync.js"; // Make sure the filename matches ("catchAsync", not "catchASync")
import Formatter from "../utils/formatter.js";
import { PromptTemplate } from "@langchain/core/prompts";
// import GPTConnector from "../utils/gptConnector.js";
import intentSchema from "../models/intentModel.js";
import foodModel from "../models/menuModel.js";
import json from "json";

export const getFoodResponseToUser = catchAsync(async (req, res, next) => {
  const query = req.body.query;

  const results = await embedDocuments.searchMenu(query);

  const foodItemsText = new Formatter().foodFormatResponse(results);

  // LangChain Prompt Template
  const menuPrompt = new PromptTemplate({
    template: `
  You are a helpful restaurant assistant. The user asked: "{query}"
  
  Here are some relevant menu items from our database:
  {foodItems}
  
  Give a friendly, clear answer. Mention prices and descriptions. If nothing fits, suggest something similar.
  `,
    inputVariables: ["query", "foodItems"],
  });

  const prompt = await menuPrompt.format({
    query,
    foodItems: foodItemsText,
  });

  const response = await new GPTConnector()
    .createGPTTurboConnector()
    .invoke(prompt);

  return res.status(200).json({
    status: "success",
    data: response,
  });
});

export const getFreshWelcomeResponse = catchAsync(async (req, res, next) => {
  const response = await new GPTConnector().createGPTTurboConnector().invoke([
    {
      role: "system",
      content:
        "You are a friendly restaurant bot for 'Dhaba Delicious' that helps users order food, book tables, and explore offers. Greet the user with a short, cheerful message (1–2 sentences, max 35 words). Use emojis. After greeting, show 3 navigation options: Order Food, Locate Us, and Offers, clearly as buttons or bullet points and add emojis",
    },
    {
      role: "user",
      content:
        "Generate a small welcome message for a new user visiting us, mentioning we offer a variety of menu options and provide navigation options.",
    },
  ]);

  return res.status(200).json({
    status: "success",
    data: response.content,
  });
});

export const getIntentResponse = catchAsync(async (req, res, next) => {
  const userMessage = req.body.query;

  const response = await new GPTConnector().createGPTTurboConnector().invoke(
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

  const parsed = JSON.parse(response.content.replace(/```(?:json)?\n?/g, '').replace(/```$/, ''));

  console.log(parsed[0]);

  return res.status(200).json({
    status: "success",
    intent: parsed[0].intent,
    foodItems: parsed[0].items,
  });
});

export const getDefaultResponse = catchAsync(async (req, res, next) => {
  const userMessage = req.body.query;

  const response = await new GPTConnector().createGPTTurboConnector().invoke([
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

  const response = await new GPTConnector().createGPTTurboConnector().invoke([
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

  const response = await new GPTConnector().createGPTTurboConnector().invoke([
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


export const getOfferResponse = catchAsync(async(req,res,next) => {

});