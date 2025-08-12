import { AzureChatOpenAI } from "@langchain/openai";
import { AzureOpenAIEmbeddings } from "@langchain/openai";

export function createModel() {
  // LangChain Azure OpenAI client
  const chatModel = new AzureChatOpenAI({
    temperature: 1,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_VERSION,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureEndpoint: process.env.AZURE_OPENAI_CHATCOMPLETION_ENDPOINT,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_RESPONSE_INSTANCE_NAME,
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_RESPONSE_DEPLOYMENT_NAME, // e.g. "gpt-35-turbo"
  });

  return chatModel;
}

export function createEmbeddingModel() {
  const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureEndpoint : process.env.AZURE_OPENAI_CHATCOMPLETION_ENDPOINT,
    azureOpenAIApiDeploymentName:
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    azureOpenAIApiInstanceName: "dd-openai-x",
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_VERSION,
  });

  return embeddings;
}
