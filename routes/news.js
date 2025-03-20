// routes/news.js
import express from "express";
import data from "../data/index.js";

const router = express.Router();

// GET /api/news - Return a list of crypto sustainability news articles
router.get("/", async (req, res) => {
  try {
    const newsArticles = await data.news.getAllNews();
    res.json(newsArticles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

export default router;