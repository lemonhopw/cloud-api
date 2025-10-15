const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const pkg = require("./package.json");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from the Cloud");
});

app.get("/time", (req, res) => {
  const now = new Date();
  res.json({
    time: now.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

app.get("/version", (req, res) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});

// Example route: test the connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});