const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HALO Backend',
    timestamp: new Date().toISOString()
  });
});

const chatRoute = require('../routes/chat');
app.use('/api', chatRoute);

module.exports = app;
