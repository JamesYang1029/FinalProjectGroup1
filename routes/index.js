import cryptoRoutes from './cryptos.js';
import adminRoutes from './admin.js';
import scannerRoutes from './scanner.js';
import path from 'path';
import { static as staticDir } from 'express';
import cryptoDetailsRoute from './cryptoDetails.js';


const constructorMethod = (app) => {
  // Crypto-related routes
  app.use('/cryptos', cryptoRoutes);

  // Admin-related routes
  app.use('/admin', adminRoutes);

  // News Route
  app.get('/news', (req, res) => {
    res.render('news', { title: 'Crypto News' });
  });
  
  app.use('/crypto-details', cryptoDetailsRoute);

  // Crypto Research Route
  app.get('/crypto-research', (req, res) => {
    res.render('cryptoResearch', { title: 'Crypto Research' });
  });

  app.get('/crypto-details', (req, res) => {
    res.render('crypto-details', { title: 'Crypto Details' });
  });

  // Screener Route
  app.use('/scanner', scannerRoutes);

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
