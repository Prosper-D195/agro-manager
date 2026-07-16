const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');


const Culture = sequelize.define('culture', {
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  category: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  species: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  variety: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  region: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  hectare: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  plantingDate: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  expectedHarvestDate: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cultures',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});


module.exports = Culture;