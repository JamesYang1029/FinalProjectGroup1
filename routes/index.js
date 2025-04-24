import cryptoRoutes from './cryptos.js';
import adminRoutes from './admin.js';
<<<<<<< Updated upstream
<<<<<<< HEAD
import scannerRoutes from './scanner.js';
=======
import { getAllCryptoData } from '../data/cryptos.js'; // make sure this path is correct
>>>>>>> Stashed changes
import path from 'path';
import { static as staticDir } from 'express';
import cryptoDetailsRoute from './cryptoDetails.js';

=======
import path from 'path';
import { static as staticDir } from 'express';
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

const constructorMethod = (app) => {
  // Crypto-related routes
  app.use('/cryptos', cryptoRoutes);

  // Admin-related routes
  app.use('/admin', adminRoutes);

  // News Route
  app.get('/news', (req, res) => {
    res.render('news', { title: 'Crypto News' });
  });
<<<<<<< HEAD
  
  app.use('/crypto-details', cryptoDetailsRoute);
=======
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

  // Crypto Research Route
  app.get('/crypto-research', (req, res) => {
    res.render('cryptoResearch', { title: 'Crypto Research' });
  });

<<<<<<< Updated upstream
  app.get('/crypto-details', (req, res) => {
    res.render('crypto-details', { title: 'Crypto Details' });
  });

  // Screener Route
<<<<<<< HEAD
  app.use('/scanner', scannerRoutes);
=======
  app.get('/scanner', (req, res) => {
    res.render('scanner', { title: 'Screener' });
=======
  // ✅ Screener Route - now pulls from DB
  app.get('/scanner', async (req, res) => {
    try {
      const cryptos = await getAllCryptoData();
      res.render('scanner', {
        title: 'Screener',
        cryptos
      });
    } catch (e) {
      res.status(500).render('error', { title: 'Error', error: e.message });
    }
>>>>>>> Stashed changes
  });
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

  // Paper Trading Route
  app.get('/paper-trading', (req, res) => {
    res.render('paperTrading', { title: 'Paper Trading' });
  });

  app.get('/about', (req, res) => {
    res.render('about', { title: 'about' });
  });

  // Admin Panel
  app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Panel' });
  });

  // Login Route
  app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
  });

  // Static public directory
  app.use('/public', staticDir('public'));

  // Home Route (redirects to /cryptos by default)
  app.get('/', (req, res) => {
    res.render('home', { title: 'Home - Terrabase' });
  });

  // 404 Page for undefined routes
  app.use('*', (req, res) => {
    res.status(404).render('404', { title: '404 - Not Found' });
  });
};

export default constructorMethod;
