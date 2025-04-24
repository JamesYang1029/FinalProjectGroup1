// data/watchlist.js
import { users, cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const exportedMethods = {
  async getUserWatchlist(userId) {
    if (!ObjectId.isValid(userId)) throw 'Invalid user ID';
    const userCollection = await users();
    const cryptoCollection = await cryptoRatings();

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user || !Array.isArray(user.watchlist)) return [];

    const watchlistIds = user.watchlist.map(id => new ObjectId(id));
    return await cryptoCollection.find({ _id: { $in: watchlistIds } }).toArray();
  },

  async getWatchlistScoreAverage(userId) {
    const watchlist = await this.getUserWatchlist(userId);
    if (!watchlist.length) return 0;

    const total = watchlist.reduce((sum, coin) => sum + (coin.sustainabilityScore || 0), 0);
    return (total / watchlist.length).toFixed(2);
  }
};

export default exportedMethods;