import { Router } from "express";
import Subscriber from "../models/Subscriber.js";

const router = Router();

// Route POST /api/unsubscribe
router.post("/", async (req, res) => {
  const { email } = req.body;

  // Vérification de base
  if (!email) {
    return res.status(400).json({ error: "Adresse email manquante." });
  }

  try {
    // Tentative de suppression dans MongoDB
    const result = await Subscriber.deleteOne({ email });

    console.log("🔍 Requête reçue :", email);
    console.log("Résultat MongoDB :", result);

    // Si aucune adresse n'a été supprimée
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Email non trouvé dans la base." });
    }

    // Réponse en cas de succès
    res.status(200).json({ message: "Désinscription réussie." });
  } catch (error) {
    console.error("❌ Erreur lors de la désinscription :", error);
    res.status(500).json({ error: "Erreur serveur interne." });
  }
});

export default router;
