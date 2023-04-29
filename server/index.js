import Typesense from "typesense";
import { getVector } from "./getVector.js";

import * as dotenv from "dotenv";
dotenv.config();

const { TYPESENSE_ADMIN_KEY, OPENAI_API_KEY, SBERT_API_KEY } = process.env;

let typesense = new Typesense.Client({
  nodes: [
    {
      host: "typesense.signalwerk.ch", // For Typesense Cloud use xxx.a1.typesense.net
      port: "443", // For Typesense Cloud use 443
      protocol: "https", // For Typesense Cloud use https
    },
  ],
  apiKey: TYPESENSE_ADMIN_KEY,
  connectionTimeoutSeconds: 20,
});

const data = [
  { id: "1", title: "Banana" },
  { id: "2", title: "Bonobo" },
  { id: "3", title: "Chimpanzee" },
  { id: "4", title: "Gorilla" },
  { id: "5", title: "Monkey" },
  { id: "6", title: "Watermelon" },
];

async function populateIndex({ indexName, API_URL, API_KEY, API_MODEL }) {
  const documents = [];

  const promises = data.map(async (item) => {
    const vector = await getVector({
      API_URL,
      API_KEY,
      API_MODEL,
      text: item.title,
    });
    return vector;
  });

  const vectors = await Promise.all(promises);

  data.forEach((item, index) => {
    documents.push({ ...item, vector: vectors[index] });
  });

  let results = await typesense
    .collections(indexName)
    .documents()
    .import(documents);
  console.log(results);
}

// SBERT Embeddings API
populateIndex({
  indexName: "test-sbert",
  API_URL: "https://embeddings.srv.signalwerk.ch/v1/embeddings",
  API_KEY: SBERT_API_KEY,
  API_MODEL: "text-embedding-multilingual-001",
});

// OpenAI Embeddings API
populateIndex({
  indexName: "test",
  API_KEY: OPENAI_API_KEY,
});
