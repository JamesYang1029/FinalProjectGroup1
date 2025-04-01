import express from "express";
import exphbs from "express-handlebars";
import path from "path";
import configRoutes from "./routes/index.js";

const app = express();
const PORT = 3000;

// Middleware to serve static files
//app.use("/public", express.static(path.resolve("public")));
app.use(express.static(path.resolve("public")));

// Set Handlebars as the templating engine
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "home",
    extname: "hbs",
    layoutsDir: path.resolve("views/layouts"),
  })
);
app.set("view engine", "hbs");

// Set views directory
app.set("views", path.resolve("views"));

// Use routes
configRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
