const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Intervention = sequelize.define('intervention', {
  parcel_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  date_intervention: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  quantity: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true
  },
  unit: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
  cost: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'interventions'
});


// Association avec Parcel
const Parcel = require('./parcel');
Intervention.belongsTo(Parcel, { foreignKey: 'parcel_id', as: 'parcel' });


module.exports = Intervention;