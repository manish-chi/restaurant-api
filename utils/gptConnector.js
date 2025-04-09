import { AzureChatOpenAI } from "@langchain/openai";
import offers from "../tools/offerTool.js";
import welcome from "../tools/welcome.js";
import { addToCart, showCart } from "../tools/cartTool.js";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { BufferMemory } from "langchain/memory";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import {RunnableSequence } from "@langchain/core/runnables";

let llm = null;
let sessionId = null;

function generateSessionId() {
  return crypto.randomUUID();
}

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

async function createGPTTurboConnector(sessionId) {
  let llm = await createModel();

  let tools = [offers(), welcome(), addToCart(), showCart()];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a agent of Dabha Delicious Restaurant."],
    ["human", "{input}"],
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
  });

  const messageHistory = new UpstashRedisChatMessageHistory({
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
    getMemoryValue: async (key, config) => {
      const sessionId = config?.configurable?.sessionId;
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const value = await redis.get(`custom:${sessionId}:${key}`);
      return value ? JSON.parse(value) : undefined;
    },
    setMemoryValue: async (key, value, config) => {
      const sessionId = config?.configurable?.sessionId;
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      await redis.set(`custom:${sessionId}:${key}`, JSON.stringify(value));
    },
  });

  return agentExecutorWithMemory;
}

export async function callAgent(input) {
  try {
    if (!llm) {
      sessionId = generateSessionId();
      llm = await createGPTTurboConnector(sessionId);
    }

    console.log(sessionId);

    const config = {
      configurable: { sessionId: sessionId, cart: [] },
    };

    const result = await llm.invoke({ input }, config);

    return result.output;
  } catch (err) {
    console.log(err);
  }
}
