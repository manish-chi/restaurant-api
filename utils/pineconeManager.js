import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { createEmbeddingModel } from "../utils/aiModelsManager.js";

class PineconeManager {
  /**
   *
   */
  constructor() {
    let pineCone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    this.index = pineCone.Index(process.env.PINECONE_INDEX_NAME);
  }

  async #createVectorStore() {
    let embeddings = createEmbeddingModel();

    let vectoreStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: this.index,
      textKey: "text",
    });

    return vectoreStore;
  }

  async queryIndex(query) {
    let vectorStore = await this.#createVectorStore();
    const results = await vectorStore.similaritySearch(query);
    return results;
  }
}

export default PineconeManager;
