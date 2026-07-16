const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Recolte = require('../models/recolte');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const recoltes = await Recolte.findAll({
      include: ['culture'] // si tu veux avoir les détails de la culture associée
    });
    res.json({ recoltes });
  } catch (err) {
    console.error('Erreur récoltes:', err);
    res.status(500).json({
      message: 'Erreur lors de la récupération des récoltes',
      error: err.message
    });
  }
});

router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { cultureId, culture_name, date_recolte, quantite, unite, notes } = req.body;

    if (!date_recolte || !quantite || !unite) {
      return res.status(400).json({
        message: 'date_recolte, quantite et unite sont obligatoires'
      });
    }

    if (!cultureId && !culture_name) {
      return res.status(400).json({
        message: 'cultureId ou culture_name est obligatoire'
      });
    }

    const recolte = await Recolte.create({
      cultureId: cultureId || null,
      culture_name: culture_name || null,
      date_recolte,
      quantite,
      unite,
      notes: notes || null
    });

    res.status(201).json({ recolte });
  } catch (err) {
    console.error('Erreur création récolte:', err);
    res.status(500).json({
      message: 'Erreur lors de la création de la récolte',
      error: err.message
    });
  }
});

router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { cultureId, culture_name, date_recolte, quantite, unite, notes } = req.body;

    if (!date_recolte || !quantite || !unite) {
      return res.status(400).json({
        message: 'date_recolte, quantite et unite sont obligatoires'
      });
    }

    const recolte = await Recolte.findByPk(id);
    if (!recolte) {
      return res.status(404).json({ message: 'Récolte non trouvée' });
    }

    await recolte.update({
      cultureId: cultureId || null,
      culture_name: culture_name || null,
      date_recolte,
      quantite,
      unite,
      notes: notes || null
    });

    res.json({ recolte });
  } catch (err) {
    console.error('Erreur modification récolte:', err);
    res.status(500).json({
      message: 'Erreur lors de la modification de la récolte',
      error: err.message
    });
  }
});

router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const recolte = await Recolte.findByPk(id);
    if (!recolte) {
      return res.status(404).json({ message: 'Récolte non trouvée' });
    }
    await recolte.destroy();
    res.json({ message: 'Récolte supprimée', recolte });
  } catch (err) {
    console.error('Erreur suppression récolte:', err);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la récolte',
      error: err.message
    });
  }
});

module.exports = router;