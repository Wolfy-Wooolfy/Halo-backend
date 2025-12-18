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

// Routes
const chatRouter = require("./src/routes/chat");
const mindscanRouter = require("./src/routes/mindscan");

// Use explicit mounting paths
// chatRouter defines router.post("/chat", ...) internally, so we mount at /api
// Result: POST /api/chat
app.use("/api", chatRouter);

// mindscanRouter defines router.post("/", ...) internally, so we mount at /api/mindscan
// Result: POST /api/mindscan
app.use("/api/mindscan", mindscanRouter);

app.get("/health", (req, res) => {
  return res.status(200).json({
    ok: true,
    status: "up"
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`HALO backend running on port ${PORT}`);
  });
}

module.exports = app;