import { Router } from "express";
import Subscriber from "../models/Subscriber.js";
import { sendConfirmationEmail } from "../utils/send-email.js";
import { validateSubscription } from "../middlewares/validation.js";

const router = Router();

router.post("/", validateSubscription, async (req, res) => {
  const { email, extraField } = req.body;

  console.log("📥 Requête reçue pour :", req.body.email);

  // Vérification anti-bot
  if (extraField && extraField.trim() !== "") {
    return res.status(400).json({ message: "Bot détecté" });
  }

  try {
    const exists = await Subscriber.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email déjà inscrit" });
    }

    await Subscriber.create({ email });

    // Envoi de l'email de confirmation (non bloquant)
    sendConfirmationEmail(email).catch(err => 
      console.error("📧 Erreur asynchrone mail confirmation :", err)
    );

    res.status(201).json({ message: "Inscription réussie 💚" });
  } catch (err) {
    console.error("❌ Erreur complète inscription :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
