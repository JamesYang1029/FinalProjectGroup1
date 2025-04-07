import express from 'express';
import { uploadJsonFile, updateEntireDatabase, incrementalUpdate } from '../data/admin.js';
import multer from 'multer';
import path from 'path';

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

export default router;
