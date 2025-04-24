import { dbConnection } from "./mongoConnections.js";

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }
        return _col;
    };
};

<<<<<<< Updated upstream
/* Now, you can list your collections here:
NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */
export const cryptoRatings = getCollectionFn('cryptoRatings');
export const financialData = getCollectionFn('financialData');
export const newsData = getCollectionFn('newsData');
<<<<<<< HEAD
export const offsetData = getCollectionFn('offsetData');
=======
export const users = getCollectionFn('users');
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
=======
// Define and export the collections
export const cryptoRatings = getCollectionFn("crypto_info");  // General crypto data
export const financialData = getCollectionFn("crypto_OHLC");  // OHLC price history
>>>>>>> Stashed changes
