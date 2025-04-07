import {AzureOpenAI} from "@langchain/azure-openai";
import app from "./app.js";
import mongoose from "mongoose";


// LangChain Azure OpenAI client
const llm = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  azureEndpoint: process.env.AZURE_OPENAI_RESPONSE_ENDPOINT,
  deploymentName: process.env.AZURE_OPENAI_RESPONSE_DEPLOYMENT_NAME, // e.g. "gpt-35-turbo"
  modelName: "gpt-35-turbo", // model name must match deployment config in Azure
  temperature: 0.7,
});

process.llm = llm;

let databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

databaseConnection = databaseConnection.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(databaseConnection)
  .then((conn) => {
    console.log("**Connection Successfull!!**");
    console.log(conn);
  })
  .catch((err) => {
    console.log(`There was some error : ${err}`);
  });

let PORT = process.env.PORT || 8000;

let server = app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server successfully started at ${PORT}`);
});
