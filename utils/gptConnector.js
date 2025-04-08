import { AzureChatOpenAI } from "@langchain/openai";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import offers from "../tools/offerTool.js";
import welcome from "../tools/welcome.js";
import { BufferMemory } from "langchain/memory";
// import { reserveTable } from "../tools/reserveTable.js";
// import { orderFood } from "../tools/orderFood.js";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import * as cart from "../tools/cartTool.js";
import foodModel from "../models/menuModel.js";

let llm = null;

export async function createModel() {
  // LangChain Azure OpenAI client
  const llm = new AzureChatOpenAI({
    temperature: 0.3,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_VERSION,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureEndpoint: process.env.AZURE_OPENAI_RESPONSE_ENDPOINT,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESPONSE_INSTANCE_NAME,
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_RESPONSE_DEPLOYMENT_NAME, // e.g. "gpt-35-turbo"
  });

  return llm;
}

async function createGPTTurboConnector() {
  let llm = await createModel();

  let tools = [offers(), welcome(), cart.addToCart(foodModel), cart.showCart()];

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a agent of Dabha Delicious Restaurant."],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  const agent = createToolCallingAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  let memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
  });

  const config = {
    configurable: { sessionId: "test-session" },
  };

  const agentExecutorWithMemory = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (_sessionId) => memory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    config,
  });

  return agentExecutorWithMemory;
}

export async function callAgent(input) {
  if (!llm) llm = await createGPTTurboConnector();

  console.log(input);

  const result = await llm.invoke({ input });

  return result.output;
}
