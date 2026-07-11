const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComptaCategory = sequelize.define('comptaCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['PRODUIT', 'CHARGE']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories_comptables',
  timestamps: true
});

module.exports = ComptaCategory;