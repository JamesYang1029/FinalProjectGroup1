import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "./data/cryptos.js";
import { getNews } from "./data/news.js";
console.log(await getSpecificListing("Bitcoin"));