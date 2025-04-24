// routes/cryptos.js
import express from "express";
import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "../data/cryptos.js";
import { getNews } from "../data/news.js";
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


router.get("/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const financialData = await getSpecificListing(name);
    res.json(financialData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cryptocurrency data" });
  }
});

// router.get("/crypto-details/:name", async (req, res) => {
//   const name = req.params.name;
//   try {
//     const crypto = await getSpecificListing(name);
//     if (!crypto) {
//       return res.status(404).render("error", { message: "Crypto not found" });
//     }
//     res.render("crypto-details", { crypto });
//   } catch (error) {
//     res.status(500).render("error", { message: "Error loading crypto details" });
//   }
// });

export default router;