import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import sequelize from "./config/database.js";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "florent.gerard@mamaesther.org";
const ADMIN_PASS = process.env.EMAIL_PASSWORD || "uC6$Rs26ZHdaPTX";

async function run() {
  try {
    console.log("🧪 Connexion à PostgreSQL via Sequelize...");
    await sequelize.authenticate();
    console.log("✅ Authentification réussie !");
    
    // Synchroniser les modèles (créer les tables si nécessaire)
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronisées !");

    const hash = await bcrypt.hash(ADMIN_PASS, 10);

    // Supprimer les anciens comptes admins s'ils existent
    await Admin.destroy({ where: { identifiant: ADMIN_EMAIL } });
    await Admin.destroy({ where: { identifiant: "admin" } });

    // Créer le compte principal avec l'email
    await Admin.create({
      identifiant: ADMIN_EMAIL,
      motDePasse: hash,
    });

    // Créer l'alias "admin" avec le même mot de passe pour plus de confort
    await Admin.create({
      identifiant: "admin",
      motDePasse: hash,
    });

    console.log("✅ Administrateurs mis à jour avec succès !");
    console.log(`👤 Identifiants autorisés : ${ADMIN_EMAIL} ET admin`);
    console.log(`🔑 Mot de passe : ${ADMIN_PASS}`);

    await sequelize.close();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
}

run();
