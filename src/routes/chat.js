const express = require('express');
const { normalizeMessage } = require('../engines/messageNormalizer');

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'No message provided'
    });
  }

  const normalized = normalizeMessage(message);

  return res.json({
    reply: `HALO received: ${normalized}`,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
