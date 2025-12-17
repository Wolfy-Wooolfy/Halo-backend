const express = require("express");
const router = express.Router();
const { handleChat } = require("../core/chatController");

router.post("/chat", handleChat);

module.exports = router;
