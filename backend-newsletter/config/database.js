import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.POSTGRES_URI;

if (!uri) {
  console.error("❌ ERREUR CRITIQUE : La variable d'environnement POSTGRES_URI est manquante !");
  // En production, on veut que le processus s'arrête avec une erreur claire
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
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
