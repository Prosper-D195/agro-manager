const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboard');
const { authenticate, requireRole } = require('../middleware/auth');
const db = require('../config/database');

router.use(authenticate);

// Seuls admin, gestionnaire, operateur peuvent voir le dashboard
router.get('/', requireRole('admin', 'gestionnaire', 'operateur'), getDashboard);

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    // Nombre de cultures
    const [cultures] = await db.query("SELECT COUNT(*) AS total FROM cultures");

    // Surface totale (ha) : somme de area_ha dans parcels
    const [areas] = await db.query(
      "SELECT SUM(area_ha) AS total FROM parcels"
    );

    // Nombre d’intrants utilisés (dans mouvements_intrants)
    const [inputs] = await db.query(
      "SELECT COUNT(*) AS total FROM mouvements_intrants"
    );

    // Estimation de récolte : somme de quantite dans recoltes
    const [harvest] = await db.query(
      "SELECT SUM(quantite) AS total FROM recoltes"
    );

    res.json({
      totalCrops: cultures[0].total,
      totalArea: areas[0].total || 0,
      totalInputs: inputs[0].total,
      expectedHarvest: harvest[0].total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

module.exports = router;