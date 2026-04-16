import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: './backend-newsletter/.env' });

const POSTGRES_URI = process.env.POSTGRES_URI;

const testConnection = async () => {
  console.log("🔍 Tentative de connexion à PostgreSQL...");
  console.log("URI utilisée :", POSTGRES_URI ? "DÉFINIE (masquée)" : "VIDE ❌");
  
  if (!POSTGRES_URI) {
    console.error("❌ Erreur : POSTGRES_URI n'est pas définie dans backend-newsletter/.env");
    return;
  }

  const sequelize = new Sequelize(POSTGRES_URI, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    await sequelize.authenticate();
    console.log("✅ CONNEXION RÉUSSIE ! La base de données PostgreSQL est accessible.");
    
    // Test de synchronisation (optionnel pour un simple test)
    // await sequelize.sync();
    // console.log("✅ Synchronisation réussie !");

    await sequelize.close();
  } catch (err) {
    console.error("❌ ÉCHEC DE CONNEXION :");
    console.error(err);
  }
};

testConnection();
