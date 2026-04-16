import { Router } from "express";
import { sendContactAdminNotificationEmail, sendContactConfirmationEmail } from "../utils/send-email.js";
import { validateContact } from "../middlewares/validation.js";
import Contact from "../models/Contact.js";

const router = Router();

router.post("/", validateContact, async (req, res) => {
  const { name, email, subject, message, extraField } = req.body;

  // 🕵️ Honeypot anti-spam
  if (extraField && extraField.trim() !== "") {
    console.log("🤖 Bot détecté sur le formulaire contact");
    return res.status(400).json({ message: "Bot détecté" });
  }

  try {
    // 1. Enregistrement en base de données
    await Contact.create({ name, email, subject, message });

    // 2. Notification Admin (Non-bloquant)
    sendContactAdminNotificationEmail({ name, email, subject, message }).catch(err => 
      console.error("📧 Erreur notification admin contact :", err)
    );

    // 3. Confirmation Visiteur (Non-bloquant)
    sendContactConfirmationEmail(name, email).catch(err => 
      console.error("📧 Erreur confirmation visiteur contact :", err)
    );

    res.status(200).json({ message: "Message envoyé avec succès 💚" });
  } catch (error) {
    console.error("❌ Erreur complète contact :", error);
    res.status(500).json({ message: "Erreur serveur lors de l’envoi." });
  }
});

export default router;
