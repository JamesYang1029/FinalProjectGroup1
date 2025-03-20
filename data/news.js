// data/news.js
import connectToDb from "../config/mongoConnections.js";
import collections from "../config/mongoCollections.js";

export async function getAllNews() {
  const db = await connectToDb();
  const newsCollection = await db.collection(collections.news);
  const newsArticles = await newsCollection.find({}).toArray();
  return newsArticles;
}