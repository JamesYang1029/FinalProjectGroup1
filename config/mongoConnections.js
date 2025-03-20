// config/mongoConnections.js
import { MongoClient } from "mongodb";
import settings from "./settings.js";

const connectionUrl = settings.mongoConfig.serverUrl;
const dbName = settings.mongoConfig.database;

let _connection;
let _db;

export default async function connectToDb() {
  if (!_connection) {
    _connection = await MongoClient.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    _db = _connection.db(dbName);
  }
  return _db;
}