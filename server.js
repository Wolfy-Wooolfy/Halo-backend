require('dotenv').config();
const app = require('./src/core/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`HALO backend running on port ${PORT}`);
});
