const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Culture = require('../models/culture');

const Recolte = sequelize.define('recolte', {
  culture_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date_recolte: {
    type: Sequelize.DATE,
    allowNull: false
  },
  quantite: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  unite: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'recoltes',
  // Utiliser culture_id comme clé externe
  foreignKey: 'culture_id'
});

Recolte.belongsTo(Culture, {
  foreignKey: 'culture_id',
  as: 'culture'
});

module.exports = Recolte;