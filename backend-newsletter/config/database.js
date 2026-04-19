import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.POSTGRES_URI;

if (!uri) {
  console.error("❌ ERREUR : La variable POSTGRES_URI est manquante.");
}

const sequelize = new Sequelize(uri || 'postgres://localhost:5432/fallback', {
  dialect: 'postgres',
  logging: false, // Passer à console.log pour le debug
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requis pour Supabase/Render
    }
  }
});

export default sequelize;
