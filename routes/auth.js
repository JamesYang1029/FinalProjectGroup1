// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// GET /register
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// POST /register
router.post('/register', async (req, res) => {
    const username = req.body.username?.trim().toLowerCase();
    const password = req.body.password;
  
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).render('register', { error: 'All fields are required and must be valid.' });
    }
  
    if (username.length < 3 || password.length < 6) {
      return res.status(400).render('register', { error: 'Username must be at least 3 characters, password at least 6.' });
    }
  
    const userCollection = await users();
    const existing = await userCollection.findOne({ username });
    if (existing) return res.status(400).render('register', { error: 'Username already exists' });
  
    const hashed = await bcrypt.hash(password, 10);
    const insertResult = await userCollection.insertOne({
      username,
      password: hashed,
      watchlist: [] // initialize empty watchlist
    });
  
    req.session.user = { _id: insertResult.insertedId, username };
    res.redirect('/');
  });

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userCollection = await users();
  const user = await userCollection.findOne({ username });

  if (!user) return res.status(400).render('login', { error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).render('login', { error: 'Invalid credentials' });
  req.session.user = { _id: user._id, username: user.username };
  res.redirect('/');
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
