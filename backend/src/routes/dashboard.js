const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboard');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

// Seuls admin, gestionnaire, operateur peuvent voir le dashboard
router.get('/', requireRole('admin', 'gestionnaire', 'operateur'), getDashboard);

module.exports = router;