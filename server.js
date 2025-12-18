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

// Mounting Routes correctly to avoid duplication
// chatRouter defines '/chat', so mounting at '/api' results in '/api/chat'
app.use("/api", chatRouter);

// mindscanRouter defines '/', so mounting at '/api/mindscan' results in '/api/mindscan'
app.use("/api/mindscan", mindscanRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`HALO Backend running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || "development"}`);
});