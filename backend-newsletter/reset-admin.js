import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import sequelize from "./config/database.js";

dotenv.config();

const NEW_IDENTIFIER = "admin";
const NEW_PASSWORD = "adminpassword123"; // À changer par l'utilisateur plus tard

async function run() {
  try {
    console.log("🧪 Connexion à PostgreSQL via Sequelize...");
    await sequelize.authenticate();
    console.log("✅ Authentification réussie !");
    
    // Synchroniser les modèles (créer les tables si nécessaire)
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronisées !");

    const hash = await bcrypt.hash(NEW_PASSWORD, 10);

    // Supprimer l'ancien admin s'il existe
    await Admin.destroy({ where: { identifiant: NEW_IDENTIFIER } });

    await Admin.create({
      identifiant: NEW_IDENTIFIER,
      motDePasse: hash,
    });

    console.log("✅ Administrateur réinitialisé !");
    console.log(`👤 Identifiant : ${NEW_IDENTIFIER}`);
    console.log(`🔑 Mot de passe : ${NEW_PASSWORD}`);

    await sequelize.close();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
}

run();
