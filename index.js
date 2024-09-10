// index.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Database setup (for SQLite example)
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE expenses (id INTEGER PRIMARY KEY, description TEXT, amount REAL)"
  );
});

// Routes
app.get("/", (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render("index", { expenses: rows });
  });
});

app.post("/add", (req, res) => {
  const { description, amount } = req.body;
  db.run(
    "INSERT INTO expenses (description, amount) VALUES (?, ?)",
    [description, amount],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      res.redirect("/");
    }
  );
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  db.run("DELETE FROM expenses WHERE id = ?", [id], function (err) {
    if (err) {
      return console.log(err.message);
    }
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
