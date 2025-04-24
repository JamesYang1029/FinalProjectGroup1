import { MongoClient } from "mongodb";
import settings from "./settings.js";

const mongoConfig = settings.mongoConfig;
let _connection = undefined;
let _db = undefined;

/**
 * Establishes a database connection.
 * @returns {Promise<Db>} MongoDB database instance.
 */
export const dbConnection = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        _db = await _connection.db(mongoConfig.database);
    }
    return _db;
};

/**
 * Closes the database connection.
 */
export const closeConnection = async () => {
    if (_connection) {
        await _connection.close();
        _connection = undefined;
        _db = undefined;
    }
};
