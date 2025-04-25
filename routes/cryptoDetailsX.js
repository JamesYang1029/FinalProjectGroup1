import express from 'express';
import { cryptoRatings, newsCollectionData } from '../config/mongoCollections.js'; // Import collections

const router = express.Router();

// Route to search for a cryptocurrency by name
router.get('/cryptos/search/:name', async (req, res) => {
  const name = req.params.name.toLowerCase(); // Convert to lowercase for case-insensitive search

  try {
    const collection = await cryptoRatings();  // Get the cryptoRatings collection
    const cryptoData = await collection.find({ name: { $regex: name, $options: 'i' } }).toArray();

    if (cryptoData.length === 0) {
      res.json({ message: 'No cryptocurrencies found.' });
    } else {
      res.json(cryptoData); // Return found crypto data
    }
  } catch (err) {
    console.error('Error searching for cryptocurrency:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to search for news by title or content
router.get('/news/search/:query', async (req, res) => {
  const query = req.params.query.toLowerCase(); // Case-insensitive search

  try {
    const collection = await newsCollectionData();  // Get the newsCollectionData collection
    const newsData = await collection.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    }).toArray();

    if (newsData.length === 0) {
      res.json({ message: 'No news articles found.' });
    } else {
      res.json(newsData); // Return found news data
    }
  } catch (err) {
    console.error('Error searching for news:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const query = req.query.query || '';

  try {
    const cryptoCollection = await cryptoRatings();
    const newsCollection = await newsCollectionData();

    // Search for cryptocurrency data
    const cryptos = await cryptoCollection.find({ name: { $regex: query, $options: 'i' } }).toArray();
    
    // Search for news data
    const news = await newsCollection.find({ title: { $regex: query, $options: 'i' } }).toArray();

    // Render the results to the Handlebars template
    res.render('cryptoDetailsX', {
      cryptos: cryptos.map(crypto => ({
        name: crypto.name,
        score: crypto.sustainabilityScore,
        description: crypto.description
      })),
      news: news.map(newsItem => ({
        title: newsItem.title,
        date: newsItem.date,
        source: newsItem.source,
        link: newsItem.link
      })),
      query
    });
  } catch (err) {
    console.error('Error in search route:', err);
    res.status(500).send('Server error during search');
  }
});


export default router;
