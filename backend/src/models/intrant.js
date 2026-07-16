const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Intrant = sequelize.define('intrant', {
  nom: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Engrais', 'Traitement', 'Outil', 'Autre']]
    }
  },
  culture_cible: {
    type: Sequelize.STRING(150),
    defaultValue: 'universel'
  },
  stock_actuel: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  seuil_alerte: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  unite_stock: {
    type: Sequelize.STRING(50),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'intrants'
});

module.exports = Intrant;