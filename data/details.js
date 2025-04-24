import { cryptoRatings } from '../config/mongoCollections.js';
import { dbConnection } from '../config/mongoConnections.js';

/**
 * Fetches detailed information for a specific cryptocurrency by ID.
 * @param {string} id - The cryptocurrency ID
 */
export const getCryptoDetail = async (id) => {
  const db = await dbConnection();
  const cryptoInfoCollection = await cryptoRatings();

  const crypto = await cryptoInfoCollection.findOne({ id });

  return crypto;
};
