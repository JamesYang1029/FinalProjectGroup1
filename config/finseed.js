import { cryptoRatings, financialData, sustainability } from "./mongoCollections.js";
import { readFile } from 'fs/promises';
const dataString = await readFile('./config/financial.json', 'utf-8');

const cryptoSustainabilityCollection = await sustainability();
const cryptoRatingsCollection = await cryptoRatings();
// import financialDataJson from "./financial.json" assert { type: "json" };
import { EJSON } from 'bson';

const parsedFin = EJSON.parse(dataString);


export async function finSeedStart() {
    try {
        await cryptoRatingsCollection.deleteMany({});
        await cryptoRatingsCollection.insertMany(parsedFin);
        return("Sustainability data saved to database");
    } catch (e) {
        console.error(e);
    }
}

