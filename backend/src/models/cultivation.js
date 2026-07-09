const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Cultivation = sequelize.define('cultivation', {
  parcel_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  culture_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  season_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'cultivations'
});


// Associations
const Parcel = require('./parcel');
const Culture = require('./culture');
const Season = require('./season');

Cultivation.belongsTo(Parcel, { foreignKey: 'parcel_id', as: 'parcel' });
Cultivation.belongsTo(Culture, { foreignKey: 'culture_id', as: 'culture' });
Cultivation.belongsTo(Season, { foreignKey: 'season_id', as: 'season' });


module.exports = Cultivation;