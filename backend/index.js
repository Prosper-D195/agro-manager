require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./src/routes/auth');
const culturesRoutes = require('./src/routes/cultures');
const recoltesRoutes = require('./src/routes/recoltes');
const intrantsRoutes = require('./src/routes/intrants');
const dashboardRoutes = require('./src/routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/cultures', culturesRoutes);
app.use('/api/recoltes', recoltesRoutes);
app.use('/api/intrants', intrantsRoutes);
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});