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