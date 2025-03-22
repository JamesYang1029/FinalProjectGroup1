// data/cryptos.js
//import connectToDb from "../config/mongoConnections.js";
import {cryptoRatings, financialData} from "../config/mongoCollections.js";
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
              `Give a 0-10 rating of the following cryptos based on their 
              relative sustainability with 10 being no environmental harm and 0 being 
              extreme evironmental harm: ${cryptos}. Also provide a breif explanation of each
              rating. Output the result in JSON format with the keys "crypto", "score", and 
              "explaination. Output the result as raw JSON only, without any additional text or formatting. 
              Do not include Markdown or code block formatting.".`,
          },
      ],
  });
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

export async function saveSustainabilityToDb() {
  const cryptoRatingsCollection = await cryptoRatings();
  let cryptos = await getCryptoScore(await getJustNames(5))
  try {
    await cryptoRatingsCollection.deleteMany({});
    await cryptoRatingsCollection.insertMany(cryptos);
    return("Data saved to database");
  }
  catch (e) {
    console.error(e);
  }
}

export async function saveFinancialDataToDb() {
  const financialDataCollection = await financialData();
  let cryptos = await getCryptoData(5);
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
  return crypto;
}

// export async function getAllCryptos() {
//   const db = await connectToDb();
//   const cryptosCollection = await db.collection(collections.cryptos);
//   let cryptos = await cryptosCollection.find({}).toArray();
//   // Sort by sustainabilityScore in descending order (highest score first)
//   cryptos.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
//   return cryptos;
// }