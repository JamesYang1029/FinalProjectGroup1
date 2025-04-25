import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "./data/cryptos.js";
import { getNews } from "./data/news.js";
import {cryptoRatings, financialData} from "./config/mongoCollections.js";

console.log(await saveFinancialDataToDb(25));
