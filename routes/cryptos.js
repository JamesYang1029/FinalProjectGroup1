// routes/cryptos.js
import express from "express";
import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "../data/cryptos.js";
import { cryptoRatings } from "../config/mongoCollections.js";
const router = express.Router();

// GET /api/cryptos - Return a ranked list of cryptocurrencies by sustainability score
router.get("/", 
  async (req, res) => {
  try {
    const cryptosRatingCollection = await cryptoRatings();
    const cryptos = await cryptosRatingCollection.find({}).toArray();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cryptocurrencies" });
  }
});

router.get("/:name", 
  async (req, res) => {
  const name = req.params.name;
  try {
    const crypto = await getSpecificListing(name);
    res.json(crypto);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cryptocurrency data in route" });
  }
});

export default router;