const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Culture = require('../models/culture');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const cultures = await Culture.findAll();
    res.json({ cultures });
  } catch (err) {
    console.error('Erreur cultures:', err);
    res.status(500).json({
      message: 'Erreur lors de la récupération des cultures',
      error: err.message
    });
  }
});

router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const {
      name,
      category,
      species,
      variety,
      region,
      hectare,
      plantingDate,
      expectedHarvestDate,
      status,
      note
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le nom de la culture est obligatoire' });
    }

    const culture = await Culture.create({
      name,
      category,
      species,
      variety,
      region,
      hectare,
      plantingDate,
      expectedHarvestDate,
      status,
      note
    });

    res.status(201).json({ culture });
  } catch (err) {
    console.error('Erreur création culture:', err);
    res.status(500).json({
      message: 'Erreur lors de la création de la culture',
      error: err.message
    });
  }
});

router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      species,
      variety,
      region,
      hectare,
      plantingDate,
      expectedHarvestDate,
      status,
      note
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Le nom de la culture est obligatoire' });
    }

    const culture = await Culture.findByPk(id);
    if (!culture) {
      return res.status(404).json({ message: 'Culture non trouvée' });
    }

    await culture.update({
      name,
      category,
      species,
      variety,
      region,
      hectare,
      plantingDate,
      expectedHarvestDate,
      status,
      note
    });

    res.json({ culture });
  } catch (err) {
    console.error('Erreur modification culture:', err);
    res.status(500).json({
      message: 'Erreur lors de la modification de la culture',
      error: err.message
    });
  }
});

router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const culture = await Culture.findByPk(id);
    if (!culture) {
      return res.status(404).json({ message: 'Culture non trouvée' });
    }

    await culture.destroy();
    res.json({ message: 'Culture supprimée', culture });
  } catch (err) {
    console.error('Erreur suppression culture:', err);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la culture',
      error: err.message
    });
  }
});

module.exports = router;