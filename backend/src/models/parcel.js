const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Parcel = sequelize.define('parcel', {
  name: {
    type: Sequelize.STRING(150),
    allowNull: false
  },
  area_ha: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  soil_type: {
    type: Sequelize.STRING(100),
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'parcels'
});


module.exports = Parcel;