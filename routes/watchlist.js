// routes/watchlist.js
import express from "express";
import { ensureAuthenticated } from "../middleware/auth.js";
import { addToWatchlist, getWatchlist } from "../data/watchlist.js";
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
      res.render('watchlist', { watchlist: list });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
