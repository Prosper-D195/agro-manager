const Intrant = require('../models/intrant');

const computeStatus = (stock, seuil) => {
  if (stock === 0 || stock <= seuil * 0.5) return 'critique';
  if (stock <= seuil) return 'alerte';
  return 'OK';
};

const getAll = async (req, res) => {
  try {
    const intrants = await Intrant.findAll();

    const withStatus = intrants.map((i) => {
      const stock = parseFloat(i.stock_actuel);
      const seuil = parseFloat(i.seuil_alerte);

      return {
        id: i.id,
        nom: i.nom,
        type: i.type,
        culture_cible: i.culture_cible,
        stock_actuel: i.stock_actuel,
        seuil_alerte: i.seuil_alerte,
        unite_stock: i.unite_stock,
        created_at: i.created_at,
        updated_at: i.updated_at,
        status: computeStatus(stock, seuil)
      };
    });

    return res.json(withStatus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération des intrants' });
  }
};

const getById = async (req, res) => {
  try {
    const intrant = await Intrant.findByPk(req.params.id);
    if (!intrant) {
      return res.status(404).json({ message: 'Intrant non trouvé' });
    }

    const stock = parseFloat(intrant.stock_actuel);
    const seuil = parseFloat(intrant.seuil_alerte);

    return res.json({
      id: intrant.id,
      nom: intrant.nom,
      type: intrant.type,
      culture_cible: intrant.culture_cible,
      stock_actuel: intrant.stock_actuel,
      seuil_alerte: intrant.seuil_alerte,
      unite_stock: intrant.unite_stock,
      created_at: intrant.created_at,
      updated_at: intrant.updated_at,
      status: computeStatus(stock, seuil)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération de l’intrant' });
  }
};

const create = async (req, res) => {
  try {
    const {
      nom,
      type,
      culture_cible,
      stock_actuel,
      seuil_alerte,
      unite_stock
    } = req.body;

    if (!nom || !type || !unite_stock) {
      return res.status(400).json({ message: 'Nom, type et unite_stock sont obligatoires' });
    }

    const intrant = await Intrant.create({
      nom,
      type,
      culture_cible: culture_cible || 'universel',
      stock_actuel: stock_actuel || 0,
      seuil_alerte: seuil_alerte || 0,
      unite_stock
    });

    return res.status(201).json({ intrant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la création de l’intrant' });
  }
};

const update = async (req, res) => {
  try {
    const intrant = await Intrant.findByPk(req.params.id);
    if (!intrant) {
      return res.status(404).json({ message: 'Intrant non trouvé' });
    }

    const {
      nom,
      type,
      culture_cible,
      stock_actuel,
      seuil_alerte,
      unite_stock
    } = req.body;

    await intrant.update({
      nom: nom ?? intrant.nom,
      type: type ?? intrant.type,
      culture_cible: culture_cible ?? intrant.culture_cible,
      stock_actuel: stock_actuel ?? intrant.stock_actuel,
      seuil_alerte: seuil_alerte ?? intrant.seuil_alerte,
      unite_stock: unite_stock ?? intrant.unite_stock
    });

    return res.json({ intrant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la modification de l’intrant' });
  }
};

const deleteOne = async (req, res) => {
  try {
    const intrant = await Intrant.findByPk(req.params.id);
    if (!intrant) {
      return res.status(404).json({ message: 'Intrant non trouvé' });
    }

    await intrant.destroy();
    return res.json({ message: 'Intrant supprimé' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l’intrant' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteOne
};