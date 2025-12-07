const express = require('express');
const { normalizeMessage } = require('../engines/messageNormalizer');
const { classifyMessage } = require('../engines/contextClassifier');
const { detectLanguage } = require('../engines/languageDetector');

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'No message provided'
    });
  }

  const normalized = normalizeMessage(message);
  const classification = classifyMessage(normalized);
  const language = detectLanguage(normalized);

  return res.json({
    reply: `HALO received: ${normalized}`,
    classification,
    language,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
