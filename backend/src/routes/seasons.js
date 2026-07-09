const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Season = require('../models/season');

const router = express.Router();


// Tous les utilisateurs authentifiés peuvent voir les saisons
router.get('/', authenticate, async (req, res) => {
  try {
    const seasons = await Season.findAll();
    res.json({ seasons });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des saisons', error: err.message });
  }
});


// admin / gestionnaire peuvent créer une saison
router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { name, start_date, end_date, type, year } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ message: 'name, start_date et end_date sont obligatoires' });
    }

    const season = await Season.create({
      name,
      start_date,
      end_date,
      type: type || null,
      year: year || null
    });

    res.status(201).json({ season });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la saison', error: err.message });
  }
});


// admin / gestionnaire peuvent modifier une saison
router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_date, end_date, type, year } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ message: 'name, start_date et end_date sont obligatoires' });
    }

    const season = await Season.findByPk(id);
    if (!season) {
      return res.status(404).json({ message: 'Saison non trouvée' });
    }

    await season.update({
      name,
      start_date,
      end_date,
      type: type || null,
      year: year || null
    });

    res.json({ season });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de la saison', error: err.message });
  }
});


// admin / gestionnaire peuvent supprimer une saison
router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const season = await Season.findByPk(id);
    if (!season) {
      return res.status(404).json({ message: 'Saison non trouvée' });
    }
    await season.destroy();
    res.json({ message: 'Saison supprimée', season });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la saison', error: err.message });
  }
});


module.exports = router;