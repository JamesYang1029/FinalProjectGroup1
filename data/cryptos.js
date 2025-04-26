// data/cryptos.js
//import connectToDb from "../config/mongoConnections.js";
import { cryptoRatings, financialData, sustainability } from "../config/mongoCollections.js";
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
              `For the following cryptocurrencies: ${cryptos}, provide a 0-10 sustainability rating for each, where 10 means no environmental harm and 0 means extreme environmental harm. Include a brief explanation for each rating.
              
              Output the result as a valid JSON array with the following structure:
              [
                {
                  "crypto": "CryptoName",
                  "score": 0-10,
                  "explanation": "Brief explanation of the rating."
                },
                ...
              ]
              
              Do not include any additional text, Markdown, or formatting. Only output the raw JSON array.`,
          },
      ],
  });
    console.log("Raw OpenAI Response:", completion.choices[0].message.content);
    let score = JSON.parse(completion.choices[0].message.content);
    return score;
  } catch (error) {
    console.error("Error fetching sustainability score:", error);
    throw error;
  }
}

export async function getCryptoData(number) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${number}&page=1&sparkline=false`;
  const options = {method: 'GET', headers: {accept: 'application/json'}};

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching crypto data:', err);
    throw err;
  }
}

export async function getJustNames(number) {
  let data = await getCryptoData(number);
  let names = data.map(crypto => crypto.name);
  return names;
}

export async function saveSustainabilityToDb(number) {
  const cryptoRatingsCollection = await sustainability();
  let cryptos = await getCryptoScore(await getJustNames(number))
  try {
    await cryptoRatingsCollection.deleteMany({});
    await cryptoRatingsCollection.insertMany(cryptos);
    return("Data saved to database");
  }
  catch (e) {
    console.error(e);
  }
}

export async function saveFinancialDataToDb(number) {
  const financialDataCollection = await financialData();
  let cryptos = await getCryptoData(number);
  try {
    await financialDataCollection.deleteMany({});
    await financialDataCollection.insertMany(cryptos);
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
  const cryptoRatingsCollection = await sustainability();
  name = name.trim()
  const sustainabilityData = await cryptoRatingsCollection.findOne({
    crypto: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  return  {
    crypto,
    news,
    sustainabilityData
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