// data/cryptos.js
import connectToDb from "../config/mongoConnections.js";
import collections from "../config/mongoCollections.js";

export async function getAllCryptos() {
  const db = await connectToDb();
  const cryptosCollection = await db.collection(collections.cryptos);
  let cryptos = await cryptosCollection.find({}).toArray();
  // Sort by sustainabilityScore in descending order (highest score first)
  cryptos.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  return cryptos;
}