import {dbConnection} from './mongoConnections.js';

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
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

/* Now, you can list your collections here:
NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */
export const cryptoRatings = getCollectionFn('cryptoRatings');
export const financialData = getCollectionFn('financialData');
export const newsData = getCollectionFn('newsData');
export const users = getCollectionFn('users');
