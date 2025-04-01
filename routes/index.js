import cryptoRoutes from './cryptos.js';
import adminRoutes from './admin.js';
import path from 'path';
import { static as staticDir } from 'express';

const constructorMethod = (app) => {
  // Crypto-related routes
  app.use('/cryptos', cryptoRoutes);

  // Admin-related routes
  app.use('/admin', adminRoutes);

  // News Route
  app.get('/news', (req, res) => {
    res.render('news', { title: 'Crypto News' });
  });

  // Crypto Research Route
  app.get('/crypto-research', (req, res) => {
    res.render('cryptoResearch', { title: 'Crypto Research' });
  });

  // Screener Route
  app.get('/scanner', (req, res) => {
    res.render('scanner', { title: 'Screener' });
  });

  // Paper Trading Route
  app.get('/paper-trading', (req, res) => {
    res.render('paperTrading', { title: 'Paper Trading' });
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
