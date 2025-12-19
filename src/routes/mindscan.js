const express = require("express");
const router = express.Router();
const { handleMindScan, getMindScanPrompt } = require("../core/mindscanController");

// GET /api/mindscan?user_id=...
// Returns the personalized "Question of the Day" based on memory
router.get("/", getMindScanPrompt);

// POST /api/mindscan
// Input: { "user_id": "...", "word": "..." }
// Logs the word and updates memory
router.post("/", handleMindScan);

module.exports = router;