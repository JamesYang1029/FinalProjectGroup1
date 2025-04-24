import express from 'express';
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


export default router;
