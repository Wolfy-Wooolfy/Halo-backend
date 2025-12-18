const express = require("express");
const router = express.Router();
const { handleMindScan } = require("../core/mindscanController");

// POST /api/mindscan
// Input: { "user_id": "...", "word": "..." }
router.post("/", handleMindScan);

module.exports = router;