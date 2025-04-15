import express from 'express';
import { uploadJsonFile, updateEntireDatabase, incrementalUpdate } from '../data/admin.js';
import multer from 'multer';
import path from 'path';
import { cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

// Initialize router
const router = express.Router();

// Serve the admin page
router.get('/', (req, res) => {
    res.render('admin'); // This should render your admin.hbs template
  });

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// POST route to upload a JSON file to seed the database
router.post('/upload-json', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    await uploadJsonFile(filePath);
    res.status(200).json({ message: 'Database seeded successfully.' });
  } catch (err) {
    console.error('Error uploading JSON:', err);
    res.status(500).json({ error: 'Error uploading JSON file.' });
  }
});

// POST route to update the entire database
router.post('/update-database', async (req, res) => {
  try {
    await updateEntireDatabase();
    res.status(200).json({ message: 'Database updated successfully.' });
  } catch (err) {
    console.error('Error updating database:', err);
    res.status(500).json({ error: 'Error updating database.' });
  }
});

// POST route to perform incremental update
router.post('/incremental-update', async (req, res) => {
  try {
    await incrementalUpdate();
    res.status(200).json({ message: 'Incremental update completed.' });
  } catch (err) {
    console.error('Error during incremental update:', err);
    res.status(500).json({ error: 'Error performing incremental update.' });
  }
});

// Additional Administrator Controls:

// GET form to manually add a new crypto
router.get('/admin/add', async (req, res) => {
  res.render('admin_add_crypto');
});

// POST to create new crypto
router.post('/admin/add', async (req, res) => {
  const { name, symbol, price, score } = req.body;
  const cryptoCollection = await cryptoRatings();
  await cryptoCollection.insertOne({
    name,
    symbol,
    price: parseFloat(price),
    sustainabilityScore: parseFloat(score),
  });
  res.redirect('/');
});

// GET form to edit an existing crypto
router.get('/admin/edit/:id', async (req, res) => {
  const cryptoCollection = await cryptoRatings();
  const crypto = await cryptoCollection.findOne({ _id: new ObjectId(req.params.id) });
  res.render('admin_edit_crypto', { crypto });
});

// POST to update crypto
router.post('/admin/edit/:id', async (req, res) => {
  const { name, symbol, price, score } = req.body;
  const cryptoCollection = await cryptoRatings();
  await cryptoCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { name, symbol, price: parseFloat(price), sustainabilityScore: parseFloat(score) } }
  );
  res.redirect('/');
});

export default router;
