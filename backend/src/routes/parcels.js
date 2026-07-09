const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const Parcel = require('../models/parcel');

const router = express.Router();


// Tous les utilisateurs authentifiés peuvent voir les parcelles
router.get('/', authenticate, async (req, res) => {
  try {
    const parcels = await Parcel.findAll();
    res.json({ parcels });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des parcelles', error: err.message });
  }
});


// admin / gestionnaire peuvent créer une parcelle
router.post('/', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { name, area_ha, location, soil_type } = req.body;

    if (!name || !area_ha) {
      return res.status(400).json({ message: 'name et area_ha sont obligatoires' });
    }

    const parcel = await Parcel.create({
      name,
      area_ha,
      location: location || null,
      soil_type: soil_type || null
    });

    res.status(201).json({ parcel });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de la parcelle', error: err.message });
  }
});


// admin / gestionnaire peuvent modifier une parcelle
router.put('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, area_ha, location, soil_type } = req.body;

    if (!name || !area_ha) {
      return res.status(400).json({ message: 'name et area_ha sont obligatoires' });
    }

    const parcel = await Parcel.findByPk(id);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcelle non trouvée' });
    }

    await parcel.update({
      name,
      area_ha,
      location: location || null,
      soil_type: soil_type || null
    });

    res.json({ parcel });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de la parcelle', error: err.message });
  }
});


// admin / gestionnaire peuvent supprimer une parcelle
router.delete('/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findByPk(id);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcelle non trouvée' });
    }
    await parcel.destroy();
    res.json({ message: 'Parcelle supprimée', parcel });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la parcelle', error: err.message });
  }
});


module.exports = router;