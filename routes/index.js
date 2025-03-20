// routes/index.js
import express from "express";
const router = express.Router();

// A default route for testing the API
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Terrabase API" });
});

export default router;