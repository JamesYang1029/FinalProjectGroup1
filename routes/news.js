import express from "express";
import {getNews} from "../data/news.js";
const router = express.Router();

router.get("/:name", 
  async (req, res) => {
  try {
    const news = await getNews(name);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});