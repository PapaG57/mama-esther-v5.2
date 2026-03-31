import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const NEW_IDENTIFIER = "admin";
const NEW_PASSWORD = "adminpassword123"; // À changer par l'utilisateur plus tard

async function run() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI non trouvé dans le .env");
    process.exit(1);
  }

  try {
    console.log("🧪 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI, { dbName: "newsletter_db" });
    console.log("✅ Connecté !");

    const hash = await bcrypt.hash(NEW_PASSWORD, 10);

    // Supprimer l'ancien admin s'il existe
    await Admin.deleteMany({ identifiant: NEW_IDENTIFIER });

    const nouvelAdmin = new Admin({
      identifiant: NEW_IDENTIFIER,
      motDePasse: hash,
    });

    await nouvelAdmin.save();
    console.log("✅ Administrateur réinitialisé !");
    console.log(`👤 Identifiant : ${NEW_IDENTIFIER}`);
    console.log(`🔑 Mot de passe : ${NEW_PASSWORD}`);

    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
}

run();
