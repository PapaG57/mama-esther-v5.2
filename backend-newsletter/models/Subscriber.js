import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Subscriber = sequelize.define('Subscriber', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'subscribers',
  timestamps: true,
});

export default Subscriber;
