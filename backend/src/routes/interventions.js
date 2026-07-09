const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Intervention = require('../models/intervention');

const router = express.Router();


// Tous les utilisateurs authentifiés peuvent voir les interventions
router.get('/', authenticate, async (req, res) => {
  try {
    const interventions = await Intervention.findAll({
      include: [
        { model: require('../models/parcel'), as: 'parcel', attributes: ['id', 'name'] }
      ]
    });
    res.json({ interventions });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des interventions', error: err.message });
  }
});


// admin / gestionnaire peuvent créer une intervention
router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { parcel_id, type, description, date_intervention, quantity, unit, cost } = req.body;

    if (!parcel_id || !type || !date_intervention) {
      return res.status(400).json({ message: 'parcel_id, type et date_intervention sont obligatoires' });
    }

    const intervention = await Intervention.create({
      parcel_id,
      type,
      description: description || null,
      date_intervention,
      quantity: quantity || null,
      unit: unit || null,
      cost: cost || null
    });

    res.status(201).json({ intervention });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'intervention', error: err.message });
  }
});


// admin / gestionnaire peuvent modifier une intervention
router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { parcel_id, type, description, date_intervention, quantity, unit, cost } = req.body;

    if (!parcel_id || !type || !date_intervention) {
      return res.status(400).json({ message: 'parcel_id, type et date_intervention sont obligatoires' });
    }

    const intervention = await Intervention.findByPk(id);
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }

    await intervention.update({
      parcel_id,
      type,
      description: description || null,
      date_intervention,
      quantity: quantity || null,
      unit: unit || null,
      cost: cost || null
    });

    res.json({ intervention });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'intervention', error: err.message });
  }
});


// admin / gestionnaire peuvent supprimer une intervention
router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const intervention = await Intervention.findByPk(id);
    if (!intervention) {
      return res.status(404).json({ message: 'Intervention non trouvée' });
    }
    await intervention.destroy();
    res.json({ message: 'Intervention supprimée', intervention });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'intervention', error: err.message });
  }
});


module.exports = router;