import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import configRoutes from "./routes/index.js";
<<<<<<< HEAD
import * as helpers from './util/helpers.js';
=======
import authRoutes from './routes/auth.js';
import session from "express-session";
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)

const app = express();
const PORT = 3000;

<<<<<<< HEAD
// Middleware to serve static files
=======
// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(session({
  name: 'AuthState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}));

// Middleware to serve static files
<<<<<<< Updated upstream
//app.use("/public", express.static(path.resolve("public")));
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
=======
>>>>>>> Stashed changes
app.use(express.static(path.resolve("public")));

// Set Handlebars as the templating engine
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "home",
    extname: "hbs",
    layoutsDir: path.resolve("views/layouts"),
<<<<<<< HEAD
    helpers
=======
>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
  })
);
app.set("view engine", "hbs");

// Set views directory
app.set("views", path.resolve("views"));

<<<<<<< HEAD
=======
//register the auth routes
app.use('/', authRoutes);

>>>>>>> 719f7b3d (Updated local code with Watchlist, Register features, and bug fixes)
// Use routes
configRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
