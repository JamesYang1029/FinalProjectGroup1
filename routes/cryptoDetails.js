// routes/cryptoDetails.js
import express from 'express';
import { cryptoRatings } from '../config/mongoCollections.js';

const router = express.Router();


// List all cryptos
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 60;
    const skip = (page - 1) * limit;

    const collection = await cryptoRatings();
    const total = await collection.countDocuments();
    const allCryptos = await collection.find({}).skip(skip).limit(limit).toArray();

    const hasNext = skip + limit < total;
    const hasPrev = page > 1;

    res.render('cryptoDetails', {
      cryptos: allCryptos,
      currentPage: page,
      hasNext,
      hasPrev,
      nextPage: page + 1,
      prevPage: page - 1
    });
  } catch (e) {
    res.status(500).send('Server error loading cryptos');
  }
});

// AJAX API for single crypto
router.get('/:id', async (req, res) => {
  try {
    const collection = await cryptoRatings();
    const crypto = await collection.findOne({ id: req.params.id.toLowerCase() });

    if (!crypto) {
      return res.status(404).json({ error: 'Crypto not found' });
    }

    res.json(crypto);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/X/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return res.status(400).render('error', { message: 'Crypto ID is required' });
    }

    const trimmedId = id.trim();

    if (!/^[a-zA-Z0-9-_]+$/.test(trimmedId)) {
      return res.status(400).render('error', { message: 'Invalid Crypto ID format' });
    }

    const collection = await cryptoRatings();
    const crypto = await collection.findOne({ id: trimmedId.toLowerCase() });

    if (!crypto) {
      return res.status(404).render('error', { message: 'Crypto not found' });
    }

    const {
      _id = 'N/A',
      id: cryptoId = 'N/A',
      name = 'Unknown',
      symbol = 'N/A',
      image = '',
      current_price = 'N/A',
      market_cap = 'N/A',
      market_cap_change_24h = 'N/A',
      market_cap_change_percentage_24h = 'N/A',
      market_cap_rank = 'N/A',
      high_24h = 'N/A',
      low_24h = 'N/A',
      total_volume = 'N/A',
      circulating_supply = 'N/A',
      total_supply = 'N/A',
      max_supply = 'N/A',
      ath = 'N/A',
      ath_change_percentage = 'N/A',
      ath_date = null,
      atl = 'N/A',
      atl_change_percentage = 'N/A',
      atl_date = null,
      price_change_24h = 'N/A',
      price_change_percentage_24h = 'N/A',
      roi = 'N/A',
      fully_diluted_valuation = 'N/A',
      last_updated = null,
    } = crypto;

    res.render('cryptoDetailX', {
      _id,
      cryptoId,
      name,
      symbol,
      image,
      current_price,
      market_cap,
      market_cap_change_24h,
      market_cap_change_percentage_24h,
      market_cap_rank,
      high_24h,
      low_24h,
      total_volume,
      circulating_supply,
      total_supply,
      max_supply,
      ath,
      ath_change_percentage,
      ath_date: ath_date ? new Date(ath_date).toDateString() : 'N/A',
      atl,
      atl_change_percentage,
      atl_date: atl_date ? new Date(atl_date).toDateString() : 'N/A',
      price_change_24h,
      price_change_percentage_24h,
      roi,
      fully_diluted_valuation,
      last_updated: last_updated ? new Date(last_updated).toLocaleString() : 'N/A',
    });

  } catch (e) {
    if (e.name === 'MongoNetworkError') {
      return res.status(500).render('error', { message: 'Database connection error' });
    }
    res.status(500).render('error', { message: 'Internal server error' });
  }
});



export default router;
