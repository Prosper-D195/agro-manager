const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createRecolte,
  getRecoltes,
  updateRecolte,
  deleteRecolte
} = require('../models/recoltes');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const recoltes = await getRecoltes();
    res.json({ recoltes });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des récoltes', error: err.message });
  }
});

router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { culture_id, date_recolte, quantite, unite, notes } = req.body;
    if (!culture_id || !date_recolte || !quantite || !unite) {
      return res.status(400).json({ message: 'culture_id, date_recolte, quantite et unite sont obligatoires' });
    }
    const recolte = await createRecolte({ culture_id, date_recolte, quantite, unite, notes });
    res.status(201).json({ recolte });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la récolte', error: err.message });
  }
});

router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { culture_id, date_recolte, quantite, unite, notes } = req.body;
    if (!culture_id || !date_recolte || !quantite || !unite) {
      return res.status(400).json({ message: 'culture_id, date_recolte, quantite et unite sont obligatoires' });
    }
    const recolte = await updateRecolte(id, { culture_id, date_recolte, quantite, unite, notes });
    if (!recolte) {
      return res.status(404).json({ message: 'Récolte non trouvée' });
    }
    res.json({ recolte });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de la récolte', error: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const recolte = await deleteRecolte(id);
    if (!recolte) {
      return res.status(404).json({ message: 'Récolte non trouvée' });
    }
    res.json({ message: 'Récolte supprimée', recolte });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la récolte', error: err.message });
  }
});

module.exports = router;