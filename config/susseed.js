import { cryptoRatings, financialData, sustainability } from "./mongoCollections.js";
const cryptoSustainabilityCollection = await sustainability();
const cryptoRatingsCollection = await cryptoRatings();
import sustainabilityDataJson from "./sustainability.json" assert { type: "json" };

export async function seedStart() {
    try {
        await cryptoSustainabilityCollection.deleteMany({});
        await cryptoSustainabilityCollection.insertMany(sustainabilityDataJson);
        return("Sustainability data saved to database");
    } catch (e) {
        console.error(e);
    }
}
