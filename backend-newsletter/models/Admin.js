import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Admin = sequelize.define('Admin', {
  identifiant: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  crééLe: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'admins',
  timestamps: false, // On utilise crééLe manuellement
});

export default Admin;
