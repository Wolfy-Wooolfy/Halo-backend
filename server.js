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

app.use("/api/chat", chatRouter); // Adjusted to be explicit based on previous structure implicit in router
// Note: In original file it was app.use("/api", chatRouter) where chatRouter had /chat inside it.
// To keep architecture clean, we will mount them specifically if possible, 
// BUT to respect existing `src/routes/chat.js` which has `router.post("/chat", ...)`:
// We must keep using /api for chatRouter to avoid /api/chat/chat.
// However, for mindscan, we defined it as router.post("/", ...) inside `src/routes/mindscan.js`
// So we mount it at /api/mindscan.

app.use("/api", chatRouter); // Keeps /api/chat working as before
app.use("/api/mindscan", mindscanRouter); // Exposes /api/mindscan

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