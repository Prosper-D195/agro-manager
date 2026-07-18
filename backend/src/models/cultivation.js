const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Cultivation = sequelize.define('cultivation', {
  // Champs texte libres
  parcel_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  culture_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  season_name: {
    type: Sequelize.STRING,
    allowNull: true
  },

  // Champs numériques / date
  density_per_ha: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  planting_date: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  expected_yield_kg_per_ha: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true
  }
  // Plus de parcel_id, culture_id, season_id
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'cultivations'
});

// Plus d'associations nécessaires
// const Parcel = require('./parcel');
// const Culture = require('./culture');
// const Season = require('./season');
// Cultivation.belongsTo(Parcel, { foreignKey: 'parcel_id', as: 'parcel' });
// Cultivation.belongsTo(Culture, { foreignKey: 'culture_id', as: 'culture' });
// Cultivation.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });

module.exports = Cultivation;