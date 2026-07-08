require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = require('./server/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});