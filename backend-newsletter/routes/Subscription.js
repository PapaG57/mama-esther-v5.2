import { Router } from "express";
import Subscriber from "../models/Subscriber.js";
import { sendConfirmationEmail } from "../utils/send-email.js";

const router = Router();

router.post("/", async (req, res) => {
  const { email, extraField } = req.body;

  console.log("📥 Requête reçue pour :", req.body.email);

  // Vérification anti-bot
  if (extraField && extraField.trim() !== "") {
    return res.status(400).json({ message: "Bot détecté" });
  }

  // Vérification du format d'email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  try {
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email déjà inscrit" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    await sendConfirmationEmail(email); // Envoi de l'email de confirmation

    res.status(201).json({ message: "Inscription réussie 💚" });
  } catch (err) {
    console.error("❌ Erreur complète :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
