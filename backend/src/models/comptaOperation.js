const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ComptaCategory = require('./comptaCategory');
const Culture = require('./culture');
const Recolte = require('./recolte');
const Intrant = require('./intrant');

const ComptaOperation = sequelize.define('comptaOperation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['RECETTE', 'DEPENSE']]
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categorie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ComptaCategory,
      key: 'id'
    }
  },
  mode_paiement: {
    type: DataTypes.STRING,
    allowNull: true
  },
  culture_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Culture,
      key: 'id'
    }
  },
  culture_nom: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recolte_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Recolte,
      key: 'id'
    }
  },
  recolte_nom: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  intrant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Intrant,
      key: 'id'
    }
  },
  intrant_nom: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'operations_comptables',
  timestamps: true
});

// Associations
ComptaOperation.belongsTo(ComptaCategory, { foreignKey: 'categorie_id' });
ComptaOperation.belongsTo(Culture, { foreignKey: 'culture_id', allowNull: true });
ComptaOperation.belongsTo(Recolte, { foreignKey: 'recolte_id', allowNull: true });
ComptaOperation.belongsTo(Intrant, { foreignKey: 'intrant_id', allowNull: true });

module.exports = ComptaOperation;