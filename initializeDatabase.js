import { MongoClient } from "mongodb";
import axios from "axios";
import bcrypt from "bcrypt";
import testUsers from "./config/testUsers.json" with { type: "json" };

// MongoDB URI and Database Name
const uri = "mongodb://localhost:27017";
const dbName = "terrabaseDB";

// API URL for fetching crypto market data
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";

// Function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createDatabase() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the database
    await client.connect();
    console.log("Connected to MongoDB!");

    // Access the database
    const db = client.db(dbName);

    // Collections
    const cryptoRatings = db.collection("cryptoRatings");
    const financialData = db.collection("financialData");
    const userCol = db.collection("users");

    // Clear existing data
    await cryptoRatings.deleteMany({});
    await financialData.deleteMany({});
    await userCol.deleteMany({});

    // Seed test users
    console.log(" Seeding test users...");
    for (const u of testUsers) {
      const username = u.username.trim().toLowerCase();
      const password = await bcrypt.hash(u.password, 10);
      await userCol.insertOne({
        username,
        password,
        watchlist: [],
        role: u.role
      });
    }
    console.log(" Seeded test users");

    // Fetch cryptocurrency data
    const response = await axios.get(API_URL);
    const cryptoData = response.data;

    // Prepare data for the cryptoRatings collection
    const cryptoInfoDocs = cryptoData.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      market_cap: crypto.market_cap,
      current_price: crypto.current_price,
      circulating_supply: crypto.circulating_supply,
      total_supply: crypto.total_supply,
      ath: crypto.ath,
      ath_date: crypto.ath_date,
      last_updated: new Date(),
    }));

    // Insert crypto data into cryptoRatings collection
    await cryptoRatings.insertMany(cryptoInfoDocs);
    console.log("Crypto data successfully populated!");

    // Function to fetch OHLC data with retries
    const fetchOhlcData = async (cryptoId) => {
      const ohlcUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}/ohlc?vs_currency=usd&days=365`;
      let retries = 3;
      while (retries > 0) {
        try {
          const ohlcResponse = await axios.get(ohlcUrl);
          return ohlcResponse.data;
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.log(`Rate limit exceeded for ${cryptoId}. Retrying...`);
            await delay(5000); // Wait 5 seconds before retrying
            retries -= 1;
          } else {
            console.error(`Error fetching OHLC for ${cryptoId}:`, error.message);
            return null;
          }
        }
      }
      return null;
    };

    // Fetch and store OHLC data for each crypto
    for (let crypto of cryptoData) {
      const ohlcData = await fetchOhlcData(crypto.id);
      if (ohlcData) {
        // Prepare data for the financialData collection
        const financialDataDocs = {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol.toUpperCase(),
          ohlc: ohlcData,
          last_updated: new Date(),
        };

        // Insert OHLC data into financialData collection
        await financialData.insertOne(financialDataDocs);
        console.log(`OHLC data for ${crypto.name} successfully populated!`);
      }
    }

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Error setting up the database:", error);
  } finally {
    await client.close();
  }
}

createDatabase();
