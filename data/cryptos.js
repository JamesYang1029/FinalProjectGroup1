// data/cryptos.js
import connectToDb from "../config/mongoConnections.js";
import collections from "../config/mongoCollections.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getCryptoScore(cryptos) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
          {
              role: "user",
              content: `Rank the following cryptos based on sustainability ${cryptos}.`,
          },
      ],
  });
    let score = completion.choices[0].message.content;

    return score;
  } catch (error) {
    console.error("Error fetching sustainability score:", error);
    throw error;
  }
}


export async function getAllCryptos() {
  const db = await connectToDb();
  const cryptosCollection = await db.collection(collections.cryptos);
  let cryptos = await cryptosCollection.find({}).toArray();
  // Sort by sustainabilityScore in descending order (highest score first)
  cryptos.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  return cryptos;
}