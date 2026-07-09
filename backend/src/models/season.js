const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Season = sequelize.define('season', {
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'seasons'
});


module.exports = Season;