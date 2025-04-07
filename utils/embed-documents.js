import mongoose from "mongoose";
import dotenv from "dotenv";
import foodModel from "../models/menuModel.js";
import restaurantModel from "../models/restaurantModel.js";
import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config({ path: "./config.env" });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

let databaseConnection = process.env.DATABASE_CONNECTION.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

databaseConnection = databaseConnection.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(databaseConnection).then((conn) => {
  console.log("Database Connected Successfully");
});

export const searchMenu = async (query) => {
  const embedding = await embedText(query);

  const results = await index.query({
    includeMetadata: true,
    topK: 3,
    vector: embedding,
  });

  const items = results.matches.map((match) => ({
    name: match.metadata.name,
    description: match.metadata.description,
    category: match.metadata.category,
    type: match.metadata.type,
    restaurants: match.metadata.restaurants,
    price_in_INR: match.metadata.price_in_INR,
    image: match.metadata.image,
    score: match.score,
  }));

  return items;
};

async function embedText(text) {
  const res = await axios.post(
    `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/embeddings?api-version=2023-05-15`,
    {
      input: text,
    },
    {
      headers: {
        "api-key": process.env.AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.data[0].embedding;
}

export const embed_docs = async () => {
  const items = await foodModel.find();

  const vectors = await Promise.all(
    items.map(async (item) => {
      const text = `${item.name} - ${item.category} - ${item.type}`;
      const embedding = await embedText(text);
      return {
        id: item._id.toString(),
        values: embedding,
        metadata: {
          name: item.name,
          description: item.description,
          price_in_INR: item.price_in_INR,
          image: item.image,
          restaurants: item.restaurants.map((id) => id.toString()),
          type: item.type,
          category: item.category,
        },
      };
    })
  );

  await index.upsert(vectors);
  console.log("uploaded to pinecone");
  process.exit();
};

if (process.argv[2] == "--import-pinecone") {
  embed_docs();
}
