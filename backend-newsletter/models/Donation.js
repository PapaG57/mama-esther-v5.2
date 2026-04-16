import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Donation = sequelize.define('Donation', {
  nomDonateur: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'HelloAsso',
  },
  commentaires: {
    type: DataTypes.TEXT,
  },
  campagne: {
    type: DataTypes.STRING,
  },
  admin: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'donations',
  timestamps: false,
});

export default Donation;
