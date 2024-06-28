import { ChatVertexAI } from "@langchain/google-vertexai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Document} from "@langchain/core/documents";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatVertexAI({
  model: "gemini-1.5-pro",
  temperature: 0.6
});
const prompt = ChatPromptTemplate.fromTemplate(`
  You're are provided with a pdf's data in context.
  So, whenever user refers to the pdf it means you've to refer to context data. 
  Answer the user's questions based on context which contains the user's pdf data.
  Give a simple text answer. Don't do any sort of formatting (like, don't use '*' or '\n' etc. )

  Context: {context}
  Question: {input}
  `)
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
})

export async function getAnswer(pdfText, question){
  console.log("No. of Characters in context: ",pdfText.length)
  console.log("--------------------------------------------------------------------------------------------------------------")
  console.log(question)
  console.log("--------------------------------------------------------------------------------------------------------------")
  const parser = new StringOutputParser();
  const doc = new Document({pageContent: pdfText, })
  const response = await chain.invoke({input: question, context: [doc]});
  const ans = await parser.invoke(response);
  console.log(ans);
  return ans;
}