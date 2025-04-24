import express from 'express';
import { getCryptoDetail } from '../data/details.js';
const router = express.Router();

// Route to get a single cryptocurrency by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const crypto = await getCryptoDetail(id);

    if (!crypto) {
      return res.status(404).render('error', { title: 'Error', error: 'Crypto not found' });
    }

    res.render('cryptoDetail', { title: 'Crypto Detail', crypto });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', error: e.message });
  }
});

export default router;
