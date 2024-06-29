import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.G_API_KEY);

export async function generateEmbeddings(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001"});

  const result = await model.embedContent(text);
  const embedding = result.embedding;
  console.log(embedding.values);
}

//Can be used to optimize our conversation with the llm but haven't been implemented completely yet. Have to use a vector store db and stuff. Figuring out, haven't done yet.