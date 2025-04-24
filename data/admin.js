<<<<<<< Updated upstream
<<<<<<< HEAD
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export async function apiUpdate(mode = 'full') {
  const cryptoCollection = await cryptoRatings();
  const dbCryptos = await cryptoCollection.find().toArray(); // Get all cryptos from DB
  const dbCount = dbCryptos.length;

  let cryptos = [];
  let page = 1;
  const perPage = 25;
  
  // Loop through pages until all records are fetched from the API
  while (cryptos.length < dbCount) {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: perPage,
          page: page,
          sparkline: false
        }
      }
    );

    if (!Array.isArray(response.data)) throw 'Invalid API response format';

    cryptos = cryptos.concat(response.data);  // Accumulate the response data
    page++;
    
    if (response.data.length < perPage) {
      break;  // Exit the loop if fewer records are returned than requested (end of API data)
    }
  }

  const validCryptos = validateCryptoData(cryptos);

  if (mode === 'full') {
    // Full mode: Clear the collection and insert all valid cryptos
    await cryptoCollection.deleteMany({});
    await cryptoCollection.insertMany(validCryptos);
  } else if (mode === 'incremental') {
    const updated = [];
    const skipped = [];

    // Update or insert the cryptos
    for (const crypto of validCryptos) {
      const existingCrypto = dbCryptos.find(c => c.id === crypto.id);

      if (existingCrypto) {
        // Exclude the _id from the update to avoid modifying it
        const { _id, ...cryptoWithoutId } = crypto;

        // Update the existing record in DB, without modifying _id
        await cryptoCollection.updateOne(
          { id: crypto.id },
          { $set: cryptoWithoutId }
        );
        updated.push(crypto.id);  // Track updated records
      } else {
        // Insert new record into DB
        await cryptoCollection.insertOne(crypto);
        skipped.push(crypto.id);  // Track new records added
      }
    }

    return {
      mode: 'incremental',
      updated: updated.length,
      skipped: skipped.length,
      skippedIds: skipped
    };
  } else {
    throw 'Invalid update mode. Must be "full" or "incremental".';
  }

  return { inserted: validCryptos.length };
}

export async function manualUpdateFromFile(filePath, mode = 'full') {
  const cryptoCollection = await cryptoRatings();


  const fileData = await fs.readFile(filePath, 'utf-8');
  let jsonData;
  try {
    jsonData = JSON.parse(fileData);
  } catch (e) {
    throw 'Invalid JSON format.';
  }

  if (!Array.isArray(jsonData)) throw 'JSON must be an array of objects.';

  const validCryptos = validateCryptoData(jsonData, mode === 'full');

  if (mode === 'full') {
    await cryptoCollection.deleteMany({});
    await cryptoCollection.insertMany(validCryptos);
  } else if (mode === 'incremental') {
    for (const crypto of validCryptos) {
      const { _id, ...cryptoWithoutId } = crypto;

      await cryptoCollection.updateOne(
        { id: crypto.id },
        { $set: cryptoWithoutId },
        { upsert: true }
      );
    }
  } else {
    throw 'Invalid update mode. Must be "full" or "incremental".';
  }

  return { processed: validCryptos.length };
}

function validateCryptoData(data) {
  const requiredFields = [
    'id', 'symbol', 'name', 'image', 'current_price', 'market_cap', 'market_cap_rank',
    'fully_diluted_valuation', 'total_volume', 'high_24h', 'low_24h', 'price_change_24h',
    'price_change_percentage_24h', 'market_cap_change_24h', 'market_cap_change_percentage_24h',
    'circulating_supply', 'total_supply', 'max_supply', 'ath', 'ath_change_percentage',
    'ath_date', 'atl', 'atl_change_percentage', 'atl_date', 'roi', 'last_updated'
  ];

  return data.map((crypto, idx) => {
    for (const field of requiredFields) {
      if (!(field in crypto)) {
        throw `Missing field '${field}' in crypto object at index ${idx}`;
      }
    }

    return {
      ...crypto,
      _id: new ObjectId() // Only used on initial insert
    };
  });
}
=======
import { cryptoRatings, financialData } from '../config/mongoCollections.js';
import fs from 'fs';
import path from 'path';
=======
import axios from "axios";
import { cryptoRatings, financialData } from "../config/mongoCollections.js";
import { dbConnection } from "../config/mongoConnections.js";
>>>>>>> Stashed changes

// API URL for fetching crypto market data
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";

/**
 * Generates the entire database:
 * - Deletes old data
 * - Fetches new data from CoinGecko
 * - Stores it in MongoDB
 */
export const generateDatabase = async () => {
    const db = await dbConnection();
    const cryptoInfoCollection = await cryptoRatings();
    const ohlcCollection = await financialData();

    // Delete old data
    await cryptoInfoCollection.deleteMany({});
    await ohlcCollection.deleteMany({});

    // Fetch new cryptocurrency data
    const response = await axios.get(API_URL);
    const cryptoData = response.data;

    // Prepare data for database storage
    const cryptoInfoDocs = cryptoData.map(crypto => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        market_cap: crypto.market_cap,
        current_price: crypto.current_price,
        circulating_supply: crypto.circulating_supply,
        total_supply: crypto.total_supply,
        ath: crypto.ath,
        ath_date: crypto.ath_date,
        last_updated: new Date()
    }));

    // Store general crypto information
    await cryptoInfoCollection.insertMany(cryptoInfoDocs);

    // Fetch and store OHLC data (past year) for each crypto
    for (let crypto of cryptoData) {
        const ohlcUrl = `https://api.coingecko.com/api/v3/coins/${crypto.id}/ohlc?vs_currency=usd&days=365`;
        try {
            const ohlcResponse = await axios.get(ohlcUrl);
            const ohlcData = ohlcResponse.data;

            await ohlcCollection.insertOne({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol.toUpperCase(),
                ohlc: ohlcData,
                last_updated: new Date()
            });
        } catch (error) {
            console.error(`Error fetching OHLC for ${crypto.id}:`, error.message);
        }
    }

    console.log("Database successfully generated!");
    return { message: "Database successfully generated!" };
};

/**
 * Updates market data daily:
 * - Updates price, market cap, and supply details
 * - Keeps existing OHLC data
 */
export const updateDailyData = async () => {
    const cryptoInfoCollection = await cryptoRatings();

    // Fetch new cryptocurrency data
    const response = await axios.get(API_URL);
    const cryptoData = response.data;

<<<<<<< Updated upstream
// Helper function to update the last update timestamp
async function updateLastUpdateTimestamp() {
  // Implement logic to update the last update timestamp in your metadata
}
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
=======
    for (let crypto of cryptoData) {
        await cryptoInfoCollection.updateOne(
            { id: crypto.id },
            {
                $set: {
                    market_cap: crypto.market_cap,
                    current_price: crypto.current_price,
                    circulating_supply: crypto.circulating_supply,
                    total_supply: crypto.total_supply,
                    last_updated: new Date()
                }
            }
        );
    }

    console.log("Daily data update completed!");
    return { message: "Daily data update completed!" };
};

/**
 * Modifies a specific cryptocurrency's data manually
 * @param {string} id - The ID of the cryptocurrency
 * @param {Object} updates - The updated fields and values
 */
export const modifyCryptoData = async (id, updates) => {
    const cryptoInfoCollection = await cryptoRatings();
    
    // Ensure valid update fields
    const validFields = ["market_cap", "current_price", "circulating_supply", "total_supply", "ath", "ath_date"];
    const filteredUpdates = {};
    for (let key in updates) {
        if (validFields.includes(key)) {
            filteredUpdates[key] = updates[key];
        }
    }

    if (Object.keys(filteredUpdates).length === 0) {
        throw new Error("No valid fields provided for update.");
    }

    // Perform the update
    const result = await cryptoInfoCollection.updateOne(
        { id },
        { $set: { ...filteredUpdates, last_updated: new Date() } }
    );

    if (result.modifiedCount === 0) {
        throw new Error("Crypto ID not found or no changes applied.");
    }

    console.log(`Crypto ${id} updated successfully.`);
    return { message: `Crypto ${id} updated successfully.` };
};

/**
 * Fetches all stored crypto data, optionally filtered by asset name.
 * @param {string} name (optional) - Filter results by asset name
 */
export const getAllCryptoData = async (name = "") => {
    const cryptoInfoCollection = await cryptoRatings();
    let query = name ? { name: new RegExp(name, "i") } : {}; // Case-insensitive search
    return await cryptoInfoCollection.find(query).toArray();
};
>>>>>>> Stashed changes
