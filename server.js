const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true
});

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes Imports
const chatRouter = require("./src/routes/chat");
const mindscanRouter = require("./src/routes/mindscan");

// Routes Mounting
// 1. Chat Route (Core Reasoning)
// Mounts to /api because chatRouter defines /chat internally (router.post("/chat", ...))
app.use("/api", chatRouter); 

// 2. MindScan Route (Daily Ritual)
// Mounts to /api/mindscan directly
app.use("/api/mindscan", mindscanRouter);

// Health Check
app.get("/health", (req, res) => {
  return res.status(200).json({
    ok: true,
    status: "up"
  });
});

// Start Server (Only if not in test mode)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`HALO backend running on port ${PORT}`);
  });
}

module.exports = app;