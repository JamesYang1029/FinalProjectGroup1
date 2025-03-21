import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb } from "./data/cryptos.js";

console.log(await saveFinancialDataToDb());