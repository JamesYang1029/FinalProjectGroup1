// data/watchlist.js
import { users } from '../config/mongoCollections.js';
import { cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export async function addToWatchlist(userId, cryptoId) {
  const userCol = await users();
  // addToSet prevents duplicates
  await userCol.updateOne(
    { _id: new ObjectId(userId) },
    { $addToSet: { watchlist: cryptoId } }
  );
}

export async function getWatchlist(userId) {
  const userCol = await users();
  const user = await userCol.findOne({ _id: new ObjectId(userId) });
  if (!user || !user.watchlist) return [];
  // fetch full crypto docs for each saved id
  const cryptoCol = await cryptoRatings();
  const objs = await cryptoCol
    .find({ _id: { $in: user.watchlist.map(id => new ObjectId(id)) } })
    .toArray();
  return objs;
}