require("dotenv").config();
const app = require("./src/core/app");

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HALO backend running on port ${PORT}`);
  });
}

module.exports = app;
