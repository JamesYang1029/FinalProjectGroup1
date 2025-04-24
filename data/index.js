<<<<<<< Updated upstream
<<<<<<< HEAD
import * as cryptoDataFunctions from './cryptos.js';
import * as adminDataFunctions from './admin.js';
import * as scanner from './scanner.js';

export const cryptoData = cryptoDataFunctions;
export const adminData = adminDataFunctions;
export const scannerData = scanner;
=======
import cryptoDataFunctions from './cryptos.js';
import adminDataFunctions from './admin.js';

export const cryptoData = cryptoDataFunctions;
export const adminData = adminDataFunctions;
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
=======
// data/index.js
import { getAllCryptoData } from './cryptos.js';
import { getCryptoDetail } from './details.js';
import { getAllCryptoData as getAllCryptoDataFromScanner } from './scanner.js';

// Export all data functions so that they can be accessed from the routes easily
export {
  getAllCryptoData,
  getCryptoDetail,
  getAllCryptoDataFromScanner
};
>>>>>>> Stashed changes
