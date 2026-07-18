const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Cultivation = require('../models/cultivation');

const router = express.Router();

// GET /api/cultivations
router.get('/', authenticate, async (req, res) => {
  try {
    const cultivations = await Cultivation.findAll({
      order: [['id', 'DESC']]
    });
    return res.json({ cultivations });
  } catch (err) {
    console.error('Erreur lors de la récupération des cultivations', err);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des cultivations',
      error: err.message
    });
  }
});

// POST /api/cultivations
router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const {
      parcel_name,
      culture_name,
      season_name,
      density_per_ha,
      planting_date,
      expected_yield_kg_per_ha
    } = req.body;

    if (!parcel_name || !culture_name) {
      return res.status(400).json({
        message: 'parcel_name et culture_name sont obligatoires'
      });
    }

    const cultivation = await Cultivation.create({
      parcel_name: parcel_name ?? null,
      culture_name: culture_name ?? null,
      season_name: season_name ?? null,
      density_per_ha: density_per_ha ?? null,
      planting_date: planting_date ?? null,
      expected_yield_kg_per_ha: expected_yield_kg_per_ha ?? null
    });

    return res.status(201).json({ cultivation });
  } catch (err) {
    console.error('Erreur lors de la création de la cultivation', err);
    return res.status(500).json({
      message: 'Erreur lors de la création de la cultivation',
      error: err.message
    });
  }
});

// PUT /api/cultivations/:id
router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      parcel_name,
      culture_name,
      season_name,
      density_per_ha,
      planting_date,
      expected_yield_kg_per_ha
    } = req.body;

    const cultivation = await Cultivation.findByPk(id);
    if (!cultivation) {
      return res.status(404).json({ message: 'Cultivation non trouvée' });
    }

    await cultivation.update({
      parcel_name: parcel_name ?? cultivation.parcel_name,
      culture_name: culture_name ?? cultivation.culture_name,
      season_name: season_name ?? cultivation.season_name,
      density_per_ha: density_per_ha ?? cultivation.density_per_ha,
      planting_date: planting_date ?? cultivation.planting_date,
      expected_yield_kg_per_ha: expected_yield_kg_per_ha ?? cultivation.expected_yield_kg_per_ha
    });

    return res.json({ cultivation });
  } catch (err) {
    console.error('Erreur lors de la modification de la cultivation', err);
    return res.status(500).json({
      message: 'Erreur lors de la modification de la cultivation',
      error: err.message
    });
  }
});

// DELETE /api/cultivations/:id
router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const cultivation = await Cultivation.findByPk(id);
    if (!cultivation) {
      return res.status(404).json({ message: 'Cultivation non trouvée' });
    }

    await cultivation.destroy();
    return res.json({ message: 'Cultivation supprimée', cultivation });
  } catch (err) {
    console.error('Erreur lors de la suppression de la cultivation', err);
    return res.status(500).json({
      message: 'Erreur lors de la suppression de la cultivation',
      error: err.message
    });
  }
});

module.exports = router;