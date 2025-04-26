// data/scanner.js
import { cryptoRatings } from '../config/mongoCollections.js';

export const getFilteredCryptos = async ({
  priceMin,
  priceMax,
  marketCapMin,
  marketCapMax,
  athMin,
  athMax,
  atlMin,
  atlMax,
  sustainability_score,
  page,
  sortBy,
  sortOrder
}) => {
  const collection = await cryptoRatings();
  const filter = {};

  if (priceMin !== undefined || priceMax !== undefined) {
    filter.current_price = {};
    if (priceMin !== undefined) filter.current_price.$gte = priceMin;
    if (priceMax !== undefined) filter.current_price.$lte = priceMax;
  }
  if (marketCapMin !== undefined || marketCapMax !== undefined) {
    filter.market_cap = {};
    if (marketCapMin !== undefined) filter.market_cap.$gte = marketCapMin;
    if (marketCapMax !== undefined) filter.market_cap.$lte = marketCapMax;
  }
  if (athMin !== undefined || athMax !== undefined) {
    filter.ath = {};
    if (athMin !== undefined) filter.ath.$gte = athMin;
    if (athMax !== undefined) filter.ath.$lte = athMax;
  }
  if (atlMin !== undefined || atlMax !== undefined) {
    filter.atl = {};
    if (atlMin !== undefined) filter.atl.$gte = atlMin;
    if (atlMax !== undefined) filter.atl.$lte = atlMax;
  }
  const sortOrderNum = sortOrder === 'asc' ? 1 : -1;

  const totalCryptos = await collection.countDocuments(filter);
  const totalPages = Math.ceil(totalCryptos / 10);

  const cryptos = await collection
    .find(filter)
    .sort({ [sortBy]: sortOrderNum })
    .skip((page - 1) * 10)
    .limit(10)
    .toArray();

  return {
    cryptos,
    totalPages,
    total: totalCryptos  // Optional if you want to use it on frontend
  };
};
