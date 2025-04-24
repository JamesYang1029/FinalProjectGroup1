<<<<<<< Updated upstream
// routes/cryptos.js
import express from "express";
import { getCryptoScore, getCryptoData, getJustNames, saveSustainabilityToDb, saveFinancialDataToDb, getSpecificListing } from "../data/cryptos.js";
import { getNews } from "../data/news.js";
import { cryptoRatings } from "../config/mongoCollections.js";
=======
import express from 'express';
import { getAllCryptoData } from '../data/cryptos.js';
>>>>>>> Stashed changes
const router = express.Router();

// Route to get all cryptos or search by name
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';  // Get search query from the URL
    const cryptos = await getAllCryptoData(searchQuery);  // Pass searchQuery to filter if provided
    res.render('scanner', {
      title: 'Crypto Screener',
      cryptos,
      searchQuery
    });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', error: e.message });
  }
});

<<<<<<< Updated upstream

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
=======
export default router;
>>>>>>> Stashed changes
