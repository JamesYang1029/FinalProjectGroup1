// routes/watchlist.js
import express from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist} from "../data/watchlist.js";
import { cryptoRatings } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Add a crypto to the user’s watchlist
router.post(
  "/watchlist/add/:id",
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      await addToWatchlist(req.session.user._id, req.params.id);
      res.redirect("/scanner"); // back to scanner page
    } catch (e) {
      next(e);
    }
  }
);

// Display the watchlist page
router.get(
  "/watchlist",
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const list = await getWatchlist(req.session.user._id);
      // Calculate the average sustainability score
    let totalScore = 0;
    let count = 0;
    for (const crypto of list) {
      if (crypto.sustainabilityScore && !isNaN(crypto.sustainabilityScore)) {
        totalScore += crypto.sustainabilityScore;
        count++;
      }
    }
    const averageScore = count > 0 ? (totalScore / count).toFixed(2) : "N/A";
      res.render('watchlist', { watchlist: list, averageScore });
    } catch (e) {
      next(e);
    }
  }
);

// POST /watchlist/remove/:id
router.post('/watchlist/remove/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    await removeFromWatchlist(req.session.user._id, req.params.id);
    res.redirect('/watchlist');
  } catch (e) {
    next(e);
  }
});

export default router;
