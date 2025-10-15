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
