const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Cultivation = require('../models/cultivation');

const router = express.Router();


// Tous les utilisateurs authentifiés peuvent voir les cultivations
router.get('/', authenticate, async (req, res) => {
  try {
    const cultivations = await Cultivation.findAll({
      include: [
        { model: require('../models/parcel'), as: 'parcel', attributes: ['id', 'name'] },
        { model: require('../models/culture'), as: 'culture', attributes: ['id', 'name', 'category'] },
        { model: require('../models/season'), as: 'season', attributes: ['id', 'name', 'start_date', 'end_date'] }
      ]
    });
    res.json({ cultivations });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des cultivations', error: err.message });
  }
});


// admin / gestionnaire peuvent créer une cultivation
router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { parcel_id, culture_id, season_id, density_per_ha, planting_date, expected_yield_kg_per_ha } = req.body;

    if (!parcel_id || !culture_id) {
      return res.status(400).json({ message: 'parcel_id et culture_id sont obligatoires' });
    }

    const cultivation = await Cultivation.create({
      parcel_id,
      culture_id,
      season_id: season_id || null,
      density_per_ha: density_per_ha || null,
      planting_date: planting_date || null,
      expected_yield_kg_per_ha: expected_yield_kg_per_ha || null
    });

    res.status(201).json({ cultivation });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la cultivation', error: err.message });
  }
});


// admin / gestionnaire peuvent modifier une cultivation
router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { parcel_id, culture_id, season_id, density_per_ha, planting_date, expected_yield_kg_per_ha } = req.body;

    if (!parcel_id || !culture_id) {
      return res.status(400).json({ message: 'parcel_id et culture_id sont obligatoires' });
    }

    const cultivation = await Cultivation.findByPk(id);
    if (!cultivation) {
      return res.status(404).json({ message: 'Cultivation non trouvée' });
    }

    await cultivation.update({
      parcel_id,
      culture_id,
      season_id: season_id || null,
      density_per_ha: density_per_ha || null,
      planting_date: planting_date || null,
      expected_yield_kg_per_ha: expected_yield_kg_per_ha || null
    });

    res.json({ cultivation });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de la cultivation', error: err.message });
  }
});


// admin / gestionnaire peuvent supprimer une cultivation
router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const cultivation = await Cultivation.findByPk(id);
    if (!cultivation) {
      return res.status(404).json({ message: 'Cultivation non trouvée' });
    }
    await cultivation.destroy();
    res.json({ message: 'Cultivation supprimée', cultivation });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la cultivation', error: err.message });
  }
});


module.exports = router;