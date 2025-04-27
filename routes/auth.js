// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import { users } from '../config/mongoCollections.js';
import { registerUser, loginUser } from '../data/users.js';
import { sanitizeInput } from '../validation/sanitization.js';

const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.render('alreadyLoggedIn', { username: req.session.user.username });
  }
  res.render('login', { title: 'Login' });
});

// GET /register
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.render('alreadyLoggedIn', { username: req.session.user.username });
  }
  res.render('register', { title: 'Register' });
});

// POST /register
router.post('/register', async (req, res) => {
  try {  
    let { username, password } = req.body;

    // ✅ sanitize and normalize input
    username = sanitizeInput(username?.trim().toLowerCase());
    password = sanitizeInput(password?.trim());

    //const username = req.body.username?.trim().toLowerCase();
    //const password = req.body.password;
  
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
      watchlist: [],
      role: 'user'            //  default role for new signups 
    });
  
    req.session.user = { _id: insertResult.insertedId, username, role: 'user' };
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).render('register', { error: 'Internal server error' });
  }
  });

// POST /login
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    // ✅ sanitize and normalize input
    username = sanitizeInput(username?.trim().toLowerCase());
    password = sanitizeInput(password?.trim());

  //const { username, password } = req.body;
  const userCollection = await users();
  const user = await userCollection.findOne({ username });

  if (!user) return res.status(400).render('login', { error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).render('login', { error: 'Invalid credentials' });
  req.session.user = { _id: user._id, username: user.username, role: user.role };//  carry the role into session
  res.redirect('/');
} catch (e) {
  console.error(e);
  res.status(500).render('login', { error: 'Internal server error' });
}
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
