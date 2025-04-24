// data/cryptos.js
//import connectToDb from "../config/mongoConnections.js";

import {cryptoRatings, financialData, offsetData} from "../config/mongoCollections.js";

import { getNews } from "./news.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export async function getCryptoScore(cryptos) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
          {
              role: "user",
              content: 
              `You are a JSON API. Return only a valid JSON array. Do not include any text, formatting, or code blocks.
              
              For the following cryptocurrencies: ${cryptos}, provide a 0-10 sustainability rating for each, where 10 means no environmental harm and 0 means extreme environmental harm. Include a brief explanation for each rating.
              
              Output the result as a valid JSON array with the following structure:
              [
                {
                  "crypto": "CryptoName",
                  "score": 0-10,
                  "explanation": "Brief explanation of the rating."
                },
                ...
              ]
              
              Respond ONLY with the JSON array. Do not include any other text. The response MUST start with "[" and end with "]"`,
          },
      ],
  });
    console.log("Raw OpenAI Response:", completion.choices[0].message.content);
    let score = JSON.parse(completion.choices[0].message.content);
    let carbonOffset = completion.choices[0].message.content.length();
    totalTokens = completion.usage.total_tokens;
    carbonOffset = totalTokens * (1.33 * 0.0000108);
    offsetDataCollection = await offsetData();
    await offsetDataCollection.deleteMany({});
    await offsetDataCollection.insertOne({ carbonOffset: carbonOffset });
    return score;
  } catch (error) {
    console.error("Error fetching sustainability score:", error);
    throw error;
  }
}

export async function getCryptoData(perPage, page) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;
  const options = { method: 'GET', headers: { accept: 'application/json' } };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error fetching crypto data for page ${page}:`, err);
    throw err;
  }
}

export async function getJustNames(perPage, page) {
  let data = await getCryptoData(perPage, page);
  if (!Array.isArray(data)) {
    throw new TypeError("Expected data to be an array, but got: " + typeof data);
}
  let names = data.map(crypto => crypto.name);
  return names;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function saveSustainabilityToDb(number) {
  const cryptoRatingsCollection = await cryptoRatings();
  try {
    await cryptoRatingsCollection.deleteMany({});
    for (let i = 1; i <= number; i++) {
      let cryptos = await getCryptoScore(await getJustNames(5, i));
      await cryptoRatingsCollection.insertMany(cryptos);
      console.log(`Inserted ${cryptos.length} records from page ${i + 1}`);
      await sleep(15000) 
    }
    return("Data saved to database");
  }
  catch (e) {
    console.error(e);
  }
}

export async function saveFinancialDataToDb(number) {
  const financialDataCollection = await financialData();
  try {
    await financialDataCollection.deleteMany({});
    for (let i = 1; i <= number; i++) {
      let cryptos = await getCryptoData(5, i);
      await financialDataCollection.insertMany(cryptos);
      console.log(`Inserted ${cryptos.length} records from page ${i + 1}`);
      await sleep(20000) 
    }
    return("Data saved to database");
  }
  catch (e) {
    console.error(e);
  }
}

export async function getSpecificListing(name) {
  const financialDataCollection = await financialData();
  const crypto = await financialDataCollection.findOne({name: name});
  const news = await getNews(name);
  const cryptoRatingsCollection = await cryptoRatings();
  const sustainability = await cryptoRatingsCollection.findOne({
    crypto: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  return  {
    crypto,
    news,
    sustainability
  };
}

// export async function getAllCryptos() {
//   const db = await connectToDb();
//   const cryptosCollection = await db.collection(collections.cryptos);
//   let cryptos = await cryptosCollection.find({}).toArray();
//   // Sort by sustainabilityScore in descending order (highest score first)
//   cryptos.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
//   return cryptos;
// }