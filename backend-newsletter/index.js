import dotenv from 'dotenv';
import sequelize from './config/database.js';

dotenv.config();

console.log("🔍 Tentative de connexion à PostgreSQL...");

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion réussie à PostgreSQL (Supabase) via Sequelize');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion :', err.message);
    process.exit(1);
  });
