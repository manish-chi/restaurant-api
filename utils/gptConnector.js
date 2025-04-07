import { AzureChatOpenAI } from "@langchain/openai";

class GPTConnector {
  createGPTTurboConnector() {
    // LangChain Azure OpenAI client
    const llm = new AzureChatOpenAI({
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_VERSION,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureEndpoint: process.env.AZURE_OPENAI_RESPONSE_ENDPOINT,
      azureOpenAIApiInstanceName:
        process.env.AZURE_OPENAI_RESPONSE_INSTANCE_NAME,
      azureOpenAIApiDeploymentName:
        process.env.AZURE_OPENAI_RESPONSE_DEPLOYMENT_NAME, // e.g. "gpt-35-turbo"
    });

    return llm;
  }
}

export default GPTConnector;
