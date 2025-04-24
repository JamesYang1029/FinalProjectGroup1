import express from 'express';
<<<<<<< Updated upstream
import { getFilteredCryptos } from '../data/scanner.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('scanner', { title: 'Crypto Scanner' });
});


router.get('/scannerTable', async (req, res) => {
    const {
      priceMin,
      priceMax,
      marketCapMin,
      marketCapMax,
      athMin,
      athMax,
      atlMin,
      atlMax,
      page = 1,
      sortBy = 'market_cap',
      sortOrder = 'desc'
    } = req.query;
  
    const filterParams = {
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      marketCapMin: marketCapMin ? Number(marketCapMin) : undefined,
      marketCapMax: marketCapMax ? Number(marketCapMax) : undefined,
      athMin: athMin ? Number(athMin) : undefined,
      athMax: athMax ? Number(athMax) : undefined,
      atlMin: atlMin ? Number(atlMin) : undefined,
      atlMax: atlMax ? Number(atlMax) : undefined
    };
  
    try {
      const { cryptos, totalPages } = await getFilteredCryptos({
        ...filterParams,
        page,
        sortBy,
        sortOrder
      });
  
      res.json({
        cryptos,
        totalPages
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
  

=======
import { getAllCryptoData } from '../data/scanner.js';
const router = express.Router();

// Route to get all cryptocurrencies with search functionality
router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.search || '';  // Get search query from the URL
    const cryptos = await getAllCryptoData(searchQuery);  // Pass searchQuery to filter if provided
    res.render('scanner', {
      title: 'Screener',
      cryptos,
      searchQuery
    });
  } catch (e) {
    res.status(500).render('error', { title: 'Error', error: e.message });
  }
});

>>>>>>> Stashed changes
export default router;
