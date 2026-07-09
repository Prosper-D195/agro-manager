const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('../src/config/database');

const authRoutes = require('../src/routes/auth');
const culturesRoutes = require('../src/routes/cultures');
const recoltesRoutes = require('../src/routes/recoltes');
const intrantsRoutes = require('../src/routes/intrants');
const dashboardRoutes = require('../src/routes/dashboard');
const usersRoutes = require('./routes/users');

const { authenticate } = require('../src/middleware/auth');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Middleware d’authentification pour toutes les routes /api sauf /api/auth
app.use('/api', (req, res, next) => {
  // Si c’est déjà passé par api/auth, on ne veut pas forcer authenticate
  if (req.path.startsWith('/api/auth')) {
    return next();
  }
  authenticate(req, res, next);
});

app.use('/api/cultures', culturesRoutes);
app.use('/api/recoltes', recoltesRoutes);
app.use('/api/intrants', intrantsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', usersRoutes);

// Test connexion DB
app.get('/api/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;