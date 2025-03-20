// routes/cryptos.js
import express from "express";
import data from "../data/index.js";

const router = express.Router();

// GET /api/cryptos - Return a ranked list of cryptocurrencies by sustainability score
router.get("/", async (req, res) => {
  try {
    const cryptos = await data.cryptos.getAllCryptos();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cryptocurrencies" });
  }
});

export default router;