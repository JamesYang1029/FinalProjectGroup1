// data/users.js
import { users } from '../config/mongoCollections.js';

const exportedMethods = {
  async getUserByUsername(username) {
    const userCollection = await users();
    return await userCollection.findOne({ username });
  },

  async createUser(username, hashedPassword) {
    const userCollection = await users();
    const result = await userCollection.insertOne({ username, password: hashedPassword, watchlist: [] });
    return result.insertedId;
  }
};

export default exportedMethods;