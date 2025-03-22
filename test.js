import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "./data/cryptos.js";

console.log(await getSpecificListing("Bitcoin"));