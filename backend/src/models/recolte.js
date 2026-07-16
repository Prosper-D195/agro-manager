const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Culture = require('../models/culture');

const Recolte = sequelize.define('recolte', {
  cultureId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'culture_id',
    references: {
      model: 'cultures',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  date_recolte: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  quantite: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  unite: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  culture_name: {
    type: Sequelize.STRING(255),
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'recoltes'
});

Recolte.belongsTo(Culture, {
  foreignKey: 'cultureId',
  as: 'culture'
});

module.exports = Recolte;