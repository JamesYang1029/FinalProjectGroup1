// data/watchlist.js
import { users, cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import sustainabilityData from '../config/sustainability.json' with { type: "json" };

// Add a crypto snapshot into user's watchlist
export async function addToWatchlist(userId, cryptoId) {
  const userCol = await users();
  const cryptoCol = await cryptoRatings();

  // 1. Find the crypto you want to add
  const crypto = await cryptoCol.findOne({ _id: new ObjectId(cryptoId) });
  if (!crypto) throw new Error('Crypto not found');
  // 2. Find existing user watchlist
  const user = await userCol.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  // 3. Check if the crypto already exists in watchlist
  const exists = (user.watchlist || []).some(item => {
    return item._id && item._id.toString() === cryptoId;
  });
  if (exists) {
    console.log("Already in watchlist, skip adding.");
    return;
  }
  // 🔥 Exact match by name (not symbol), no toLowerCase
  const sustainability = sustainabilityData.find(entry =>
    entry?.crypto === crypto?.name);

  const entry = {
    _id: crypto._id,
    name: crypto.name,
    symbol: crypto.symbol,
    price: crypto.current_price,
    marketCap: crypto.market_cap,
    change24h: crypto.price_change_percentage_24h,
    sustainabilityScore: sustainability?.score ?? 'N/A',
    savedAt: new Date()
  };

  await userCol.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { watchlist: entry } }
  );
}

// Directly return the saved watchlist
export async function getWatchlist(userId) {
  const userCol = await users();
  const user = await userCol.findOne({ _id: new ObjectId(userId) });

  return user?.watchlist || [];
}