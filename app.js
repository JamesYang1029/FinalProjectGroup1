import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import configRoutesFunction from './routes/index.js';

const app = express();
const PORT = 3000;

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Serve index.html manually for "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

configRoutesFunction(app);

app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${PORT}`);
});
