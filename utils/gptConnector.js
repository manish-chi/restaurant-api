import { AzureChatOpenAI } from "@langchain/openai";
import offers from "../tools/offerTool.js";
import { addToCart, showCart, removeFromCart } from "../tools/cartTool.js";
import { userValidationTool } from "../tools/userValidationTool.js";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { getMenuByCategory, getMenuItems } from "../tools/getMenuByCategory.js";
import { locateToolRestaurant } from "../tools/locationTool.js";
import { generatePaymentLink, paymentSuccess } from "../tools/paymentTool.js";
import crypto from "crypto";

let llm = null;
let messageHistory = null;

export async function createModel() {
  // LangChain Azure OpenAI client
  const llm = new AzureChatOpenAI({
    temperature: 1,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_VERSION,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_RESPONSE_API_KEY,
    azureEndpoint: process.env.AZURE_OPENAI_CHATCOMPLETION_ENDPOINT,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESPONSE_INSTANCE_NAME,
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_RESPONSE_DEPLOYMENT_NAME, // e.g. "gpt-35-turbo"
  });

  return llm;
}

export async function createGPTConnector(sessionId) {
  let llm = await createModel();

  let tools = [
    offers(),
    userValidationTool(),
    locateToolRestaurant(),
    addToCart(),
    showCart(),
    removeFromCart(),
    generatePaymentLink(),
    paymentSuccess(),
    //getMenuByCategory(),
    getMenuItems(),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a restaurant assistant for Dhaba Delicious. ONLY use tools to retrieve real menu items instead of making them up.",
    ],
    ["human", "{input}"],
    ["placeholder", "{chat_history}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  console.log(
    "🔧 Loaded tools:",
    tools.map((t) => t.name)
  );

  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: true,
  });

  messageHistory = new UpstashRedisChatMessageHistory({
    sessionId,
    config: {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
  });

  const agentExecutorWithMemory = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history", // Must match BufferMemory's key
    getMessageHistory: async () => messageHistory,
  });

  return agentExecutorWithMemory;
}

export async function callAgent(input, sessionIdFromBot) {
  try {
  
    let llm = await createGPTConnector(sessionIdFromBot);
    
    await messageHistory.addUserMessage(input);

    const config = {
      configurable: { sessionId: sessionIdFromBot },
    };

    const result = await llm.invoke({ input }, config);

    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}
