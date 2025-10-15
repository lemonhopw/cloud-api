// Existing imports
const express = require("express");
const { Pool } = require("pg");
const pkg = require("./package.json");

const app = express();
app.use(express.json()); // allows Express to read JSON request bodies

const PORT = process.env.PORT || 3000;

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Serve static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.send("Hello from the Cloud"));

// Time route
app.get("/time", (req, res) => {
  const now = new Date();
  res.json({
    time: now.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

// Version route
app.get("/version", (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description
  });
});

// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages route (fetch data from your new table)
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new message
app.post("/messages", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (content) VALUES ($1) RETURNING *",
      [content]
    );
    res.status(201).json(result.rows[0]); // return the new message
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "Failed to insert message" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
