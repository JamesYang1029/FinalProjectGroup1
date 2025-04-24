<<<<<<< Updated upstream
// data/cryptos.js
//import connectToDb from "../config/mongoConnections.js";
<<<<<<< HEAD
import {cryptoRatings, financialData, offsetData} from "../config/mongoCollections.js";
=======
import {cryptoRatings, financialData} from "../config/mongoCollections.js";
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
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
<<<<<<< HEAD
              `You are a JSON API. Return only a valid JSON array. Do not include any text, formatting, or code blocks.
              
              For the following cryptocurrencies: ${cryptos}, provide a 0-10 sustainability rating for each, where 10 means no environmental harm and 0 means extreme environmental harm. Include a brief explanation for each rating.
=======
              `For the following cryptocurrencies: ${cryptos}, provide a 0-10 sustainability rating for each, where 10 means no environmental harm and 0 means extreme environmental harm. Include a brief explanation for each rating.
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
              
              Output the result as a valid JSON array with the following structure:
              [
                {
                  "crypto": "CryptoName",
                  "score": 0-10,
                  "explanation": "Brief explanation of the rating."
                },
                ...
              ]
              
<<<<<<< HEAD
              Respond ONLY with the JSON array. Do not include any other text. The response MUST start with "[" and end with "]"`,
=======
              Do not include any additional text, Markdown, or formatting. Only output the raw JSON array.`,
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
          },
      ],
  });
    console.log("Raw OpenAI Response:", completion.choices[0].message.content);
    let score = JSON.parse(completion.choices[0].message.content);
<<<<<<< HEAD
    let carbonOffset = completion.choices[0].message.content.length();
    totalTokens = completion.usage.total_tokens;
    carbonOffset = totalTokens * (1.33 * 0.0000108);
    offsetDataCollection = await offsetData();
    await offsetDataCollection.deleteMany({});
    await offsetDataCollection.insertOne({ carbonOffset: carbonOffset });
=======
    

>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
    return score;
  } catch (error) {
    console.error("Error fetching sustainability score:", error);
    throw error;
  }
}

<<<<<<< HEAD
export async function getCryptoData(perPage, page) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;
  const options = { method: 'GET', headers: { accept: 'application/json' } };
=======
export async function getCryptoData(number) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${number}&page=1&sparkline=false`;
  const options = {method: 'GET', headers: {accept: 'application/json'}};
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
<<<<<<< HEAD
    console.error(`Error fetching crypto data for page ${page}:`, err);
=======
    console.error('Error fetching crypto data:', err);
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
    throw err;
  }
}

<<<<<<< HEAD
export async function getJustNames(perPage, page) {
  let data = await getCryptoData(perPage, page);
  if (!Array.isArray(data)) {
    throw new TypeError("Expected data to be an array, but got: " + typeof data);
}
=======
export async function getJustNames(number) {
  let data = await getCryptoData(number);
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
  let names = data.map(crypto => crypto.name);
  return names;
}

<<<<<<< HEAD
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
=======
export async function saveSustainabilityToDb(number) {
  const cryptoRatingsCollection = await cryptoRatings();
  let cryptos = await getCryptoScore(await getJustNames(number))
  try {
    await cryptoRatingsCollection.deleteMany({});
    await cryptoRatingsCollection.insertMany(cryptos);
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
    return("Data saved to database");
  }
  catch (e) {
    console.error(e);
  }
}

export async function saveFinancialDataToDb(number) {
  const financialDataCollection = await financialData();
<<<<<<< HEAD
  try {
    await financialDataCollection.deleteMany({});
    for (let i = 1; i <= number; i++) {
      let cryptos = await getCryptoData(5, i);
      await financialDataCollection.insertMany(cryptos);
      console.log(`Inserted ${cryptos.length} records from page ${i + 1}`);
      await sleep(20000) 
    }
=======
  let cryptos = await getCryptoData(number);
  try {
    await financialDataCollection.deleteMany({});
    await financialDataCollection.insertMany(cryptos);
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
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
=======
import { cryptoRatings } from '../config/mongoCollections.js';
import { dbConnection } from '../config/mongoConnections.js';

/**
 * Fetches all stored crypto data, optionally filtered by asset name.
 * @param {string} name (optional) - Filter results by asset name
 */
export const getAllCryptoData = async (name = "") => {
  const db = await dbConnection();
  const cryptoInfoCollection = await cryptoRatings();

  // If there's a search query, filter by name using regex (case-insensitive)
  let query = name ? { name: new RegExp(name, "i") } : {};

  // Fetch all cryptos matching the query
  const cryptos = await cryptoInfoCollection.find(query).toArray();

  return cryptos;
};
>>>>>>> Stashed changes
