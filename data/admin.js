import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export async function apiUpdate(mode = 'full') {
  const cryptoCollection = await cryptoRatings();
  const dbCryptos = await cryptoCollection.find().toArray();
  const dbCount = dbCryptos.length;

  let cryptos = [];
  let page = 1;
  const perPage = 25;

  while (true) {
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

    if (!Array.isArray(response.data)) throw new Error('Invalid API response format');

    cryptos = cryptos.concat(response.data);
    page++;

    if (response.data.length < perPage) break;
  }

  const validCryptos = validateCryptoData(cryptos);

  if (mode === 'full') {
    if (validCryptos.length > 0) {
      await cryptoCollection.deleteMany({});
      await cryptoCollection.insertMany(validCryptos);
    }
    return { inserted: validCryptos.length };
  }

  if (mode === 'incremental') {
    const updated = [];
    const inserted = [];

    for (const crypto of validCryptos) {
      const existing = dbCryptos.find(c => c.id === crypto.id);
      const { _id, ...cryptoWithoutId } = crypto;

      if (existing) {
        await cryptoCollection.updateOne(
          { id: crypto.id },
          { $set: cryptoWithoutId }
        );
        updated.push(crypto.id);
      } else {
        await cryptoCollection.insertOne(crypto);
        inserted.push(crypto.id);
      }
    }

    return {
      mode: 'incremental',
      updated: updated.length,
      inserted: inserted.length,
      insertedIds: inserted
    };
  }

  throw new Error('Invalid update mode. Must be "full" or "incremental".');
}

export async function manualUpdateFromFile(filePath, mode = 'full') {
  const cryptoCollection = await cryptoRatings();
  let fileData;

  try {
    fileData = await fs.readFile(filePath, 'utf-8');
  } catch {
    throw new Error('Unable to read file or file not found.');
  }

  let jsonData;
  try {
    jsonData = JSON.parse(fileData);
  } catch {
    throw new Error('Invalid JSON format.');
  }

  if (!Array.isArray(jsonData)) throw new Error('JSON must be an array of objects.');

  const validCryptos = validateCryptoData(jsonData);

  if (mode === 'full') {
    if (validCryptos.length > 0) {
      await cryptoCollection.deleteMany({});
      await cryptoCollection.insertMany(validCryptos);
    }
    return { inserted: validCryptos.length };
  }

  if (mode === 'incremental') {
    for (const crypto of validCryptos) {
      const { _id, ...cryptoWithoutId } = crypto;
      await cryptoCollection.updateOne(
        { id: crypto.id },
        { $set: cryptoWithoutId },
        { upsert: true }
      );
    }
    return { processed: validCryptos.length };
  }

  throw new Error('Invalid update mode. Must be "full" or "incremental".');
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
        throw new Error(`Missing field '${field}' in crypto object at index ${idx}`);
      }
    }

    return {
      ...crypto,
      _id: new ObjectId()
    };
  });
}
