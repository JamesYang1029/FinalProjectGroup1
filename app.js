// app.js
import express from "express";
import bodyParser from "body-parser";
import settings from "./config/settings.js";

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Import routes
import indexRoutes from "./routes/index.js";
import cryptoRoutes from "./routes/cryptos.js";
import newsRoutes from "./routes/news.js";

// Mount routes
app.use("/", indexRoutes);
app.use("/api/cryptos", cryptoRoutes);
app.use("/api/news", newsRoutes);

// Optional: Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(settings.port, () => {
  console.log(`Server is running on port ${settings.port}`);
});

