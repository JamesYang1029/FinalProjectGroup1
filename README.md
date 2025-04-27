Terrabase – Final Project
=========================

This document explains how to get the Terrabase application up and running locally,
including how to populate (seed) the MongoDB database with all required test data.

─── Prerequisites ──────────────────────────────────────────────────────────────

1. Node.js (v16+)
2. npm
3. MongoDB (community or Atlas)
4. Git


─── 1. Install Dependencies ────────────────────────────────────────────────────

$ npm install

This will install:
  • express
  • express-handlebars
  • mongodb
  • bcrypt
  • axios
  • helmet
  • multer
  • and other support libraries

─── 2. Configure Environment (if needed) ───────────────────────────────────────

By default the app connects to MongoDB on localhost:
  mongodb://localhost:27017
and uses database name:
  terrabaseDB

─── 3. Seed the Database ──────────────────────────────────────────────────────

We provide one script that clears and populates all collections:

  • `cryptoRatings` (market data)
  • `financialData`  (365-day OHLC data) (this step calls api so it may take longer (aroung 30mins))
  • `users`          (20 test users with hashed passwords)

To run it:

$ node initializeDatabase.js

You should see console output:
  • “Seeded test users”
  • “Connected to MongoDB”
  • “Seeded cryptoRatings”
  • “Seeded financialData”
  • “Database initialization complete!”

After running, you can inspect the data in MongoDB Compass or via the mongo shell:

$ mongo
> use terrabaseDB
> db.cryptoRatings.find().pretty()
> db.financialData.count()
> db.users.count()

─── 4. Start the Express Server ───────────────────────────────────────────────

$ node app.js
$ npm start

By default the server listens on port 3000:
  http://localhost:3000

─── 5. Notes ──────────────────────────────────────────────────────────────────

• All usernames are stored lowercase to enforce case-insensitive uniqueness.  
• Inputs are sanitized on register/login to prevent XSS.  
• Handlebars’ `{{variable}}` syntax auto-escapes output.  

Enjoy exploring your sustainable crypto platform!  
If you encounter any issues, please open an issue on GitHub.