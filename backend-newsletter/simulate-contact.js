import axios from "axios";

const testData = {
  name: "Test User",
  email: "test@example.com",
  subject: "donation",
  message: "Ceci est une simulation pour voir pourquoi la connexion échoue."
};

async function run() {
  console.log("🚀 Envoi d'une requête POST à /api/contact...");
  try {
    const response = await axios.post("http://localhost:5000/api/contact", testData);
    console.log("✅ Succès :", response.data);
  } catch (error) {
    if (error.response) {
      console.log("❌ Échec (Statut", error.response.status, ") :");
      console.log("Message :", error.response.data.message);
      console.log("Détails :", error.response.data.error || "Aucun détail");
    } else {
      console.log("❌ Erreur de connexion au serveur :", error.message);
    }
  }
}

run();
