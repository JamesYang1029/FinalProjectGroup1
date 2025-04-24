import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import configRoutes from "./routes/index.js";
import * as helpers from './util/helpers.js';
import authRoutes from './routes/auth.js';
import session from "express-session";

const app = express();
const PORT = 3000;

// Setup session middleware
app.use(session({
  name: 'AuthState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}));
// Middleware to serve static files
app.use(express.static(path.resolve("public")));


// Set Handlebars as the templating engine
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "home",
    extname: "hbs",
    layoutsDir: path.resolve("views/layouts"),
    helpers
  })
);
app.set("view engine", "hbs");

// Set views directory
app.set("views", path.resolve("views"));

//register the auth routes
app.use('/', authRoutes);

// Use routes
configRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
