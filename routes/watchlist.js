// routes/watchlist.js
import express from 'express';
import { ObjectId } from 'mongodb';
import { requireAuth } from '../middleware/auth.js';
import { users, cryptos } from '../config/mongoCollections.js';

const router = express.Router();

// POST /watchlist/add/:id
router.post('/watchlist/add/:id', requireAuth, async (req, res) => {
  try {
    const cryptoId = req.params.id;
    if (!ObjectId.isValid(cryptoId)) {
      return res.status(400).json({ error: 'Invalid crypto ID' });
    }

    const userCollection = await users();
    const cryptoCollection = await cryptos();

    const crypto = await cryptoCollection.findOne({ _id: new ObjectId(cryptoId) });
    if (!crypto) {
      return res.status(404).json({ error: 'Crypto not found' });
    }

    const userId = new ObjectId(req.session.user._id);
    const user = await userCollection.findOne({ _id: userId });

    if (!user.watchlist.includes(cryptoId)) {
      await userCollection.updateOne(
        { _id: userId },
        { $addToSet: { watchlist: cryptoId } }
      );
    }

    res.status(200).json({ message: 'Crypto added to watchlist' });
  } catch (error) {
    console.error('Watchlist add error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  // POST /watchlist/remove/:id
router.post('/watchlist/remove/:id', requireAuth, async (req, res) => {
    try {
      const cryptoId = req.params.id;
      if (!ObjectId.isValid(cryptoId)) {
        return res.status(400).json({ error: 'Invalid crypto ID' });
      }
  
      const userCollection = await users();
      const userId = new ObjectId(req.session.user._id);
  
      await userCollection.updateOne(
        { _id: userId },
        { $pull: { watchlist: cryptoId } }
      );
  
      res.status(200).json({ message: 'Crypto removed from watchlist' });
    } catch (error) {
      console.error('Watchlist remove error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // GET /watchlist
  router.get('/watchlist', requireAuth, async (req, res) => {
    try {
      const userId = req.session.user._id;
      const watchlist = await watchlistData.getUserWatchlist(userId);
      const averageScore = await watchlistData.getWatchlistScoreAverage(userId);
      res.render('watchlist', { watchlist, averageScore });
    } catch (err) {
      console.error('Watchlist fetch error:', err);
      res.status(500).render('error', { error: 'Unable to load watchlist.' });
    }
});

export default router;
