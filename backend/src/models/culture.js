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
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'cultures'
});

module.exports = Culture;