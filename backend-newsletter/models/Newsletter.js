import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Newsletter = sequelize.define('Newsletter', {
  newsletterNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.JSONB, // { fr: '...', en: '...' }
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  summary: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pdfPath: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.JSONB, // { fr: [], en: [] }
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'newsletters',
  timestamps: true,
});

export default Newsletter;
