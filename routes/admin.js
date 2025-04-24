<<<<<<< Updated upstream
import express from 'express';
<<<<<<< HEAD
import multer from 'multer';
import path from 'path';
import { adminData } from '../data/index.js';

const { apiUpdate, manualUpdateFromFile } = adminData;

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.json') {
      return cb(new Error('Only JSON files are allowed'), false);
    }
    cb(null, true);
  }
});

router.get('/', (req, res) => {
  res.render('admin', {
    title: 'Admin Panel'
  });
});

router.post('/', upload.single('jsonFile'), async (req, res) => {
  try {
    const { updateMethod, updateMode } = req.body;

    if (updateMethod === 'manual') {
      if (!req.file) throw 'No file uploaded.';
      const result = await manualUpdateFromFile(req.file.path, updateMode);
      return res.render('admin', {
        title: 'Admin Panel',
        successMessage: `Manual update complete. Processed: ${result.processed}`
      });
    } else if (updateMethod === 'api') {
      const result = await apiUpdate(updateMode);

      if (updateMode === 'full') {
        return res.render('admin', {
          title: 'Admin Panel',
          successMessage: `API update complete. Inserted: ${result.inserted}`
        });
      } else if (updateMode === 'incremental') {
        let message = `API update complete. Updated: ${result.updated}, Skipped: ${result.skipped}`;
        if (result.skipped > 0) {
          message += `. Skipped IDs (not in DB): ${result.skippedIds.join(', ')}`;
        }
        return res.render('admin', {
          title: 'Admin Panel',
          successMessage: message
        });
      } else {
        throw 'Invalid update mode. Must be "full" or "incremental".';
      }
    } else {
      return res.status(400).render('admin', {
        title: 'Admin Panel',
        errorMessage: 'Invalid update method.'
      });
    }
  } catch (err) {
    return res.status(400).render('admin', {
      title: 'Admin Panel',
      errorMessage: `Error: ${err}`
    });
  }
});

=======
import { uploadJsonFile, updateEntireDatabase, incrementalUpdate } from '../data/admin.js';
import multer from 'multer';
import path from 'path';
import { cryptoRatings } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
=======
import express from "express";
import {
  generateDatabase,
  updateDailyData,
  modifyCryptoData,
  getAllCryptoData
} from "../data/admin.js";
>>>>>>> Stashed changes

const router = express.Router();

// Generate the entire database (delete old & fetch new)
router.post("/generate-database", async (req, res) => {
  try {
    await generateDatabase();
    res.json({ success: true, message: "Database successfully generated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Perform daily update
router.post("/update-daily", async (req, res) => {
  try {
    await updateDailyData();
    res.json({ success: true, message: "Daily update completed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Modify a specific crypto entry
router.put("/modify", async (req, res) => {
  try {
    const { id, updates } = req.body;
    if (!id || !updates) {
      return res.status(400).json({ success: false, message: "Missing required parameters." });
    }

    const result = await modifyCryptoData(id, updates);
    res.json({ success: true, message: "Data updated successfully!", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch all stored crypto data (optionally filter by asset name)
router.get("/cryptos", async (req, res) => {
  try {
    const { name } = req.query; // Optional filtering by asset name
    const cryptos = await getAllCryptoData(name);
    res.render("admin", { title: "Admin Panel", cryptos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

export default router;
