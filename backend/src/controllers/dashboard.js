const Culture = require('../models/culture');
const Recolte = require('../models/recolte');
const Intrant = require('../models/intrant');

const getDashboard = async (req, res) => {
  try {
    // 1) Nombre total de cultures
    const allCultures = await Culture.findAll();
    const totalCultures = allCultures.length;

    // 2) Volume total récolté ce mois-ci
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const recoltesMois = await Recolte.findAll({
      where: {
        date_recolte: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    });

    let totalRecoltesCeMois = 0;
    for (const r of recoltesMois) {
      const q = parseFloat(r.quantite);
      totalRecoltesCeMois += q;
    }

    // 3) Intrants en alerte / critique
    const intrants = await Intrant.findAll();

    let intrantsAlerte = 0;
    let intrantsCritique = 0;

    for (const i of intrants) {
      const stock = parseFloat(i.stock_actuel);
      const seuil = parseFloat(i.seuil_alerte);

      if (stock === 0 || stock <= seuil * 0.5) {
        intrantsCritique++;
      } else if (stock <= seuil) {
        intrantsAlerte++;
      }
    }

    // 4) Dernières récoltes (10 max)
    const dernieresRecoltes = await Recolte.findAll({
      order: [['date_recolte', 'DESC']],
      limit: 10,
      include: [
        {
          model: Culture,
          as: 'culture',
          attributes: ['name']
        }
      ]
    });

    const result = dernieresRecoltes.map((r) => {
      const cultureNom = r.culture ? r.culture.name : 'Inconnue';
      return {
        id: r.id,
        culture_nom: cultureNom,
        quantite: r.quantite,
        unite: r.unite,
        date_recolte: r.date_recolte,
        notes: r.notes
      };
    });

    return res.json({
      totalCultures,
      totalRecoltesCeMois,
      intrantsAlerte,
      intrantsCritique,
      dernieresRecoltes: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord' });
  }
};

module.exports = { getDashboard };