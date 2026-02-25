import express from "express";
import { sendDonConfirmationEmail } from "../utils/send-email.js";
import { sendAdminNotificationEmail } from "../utils/send-email.js";

const router = express.Router();

// Simulation de réception d’un don
router.post("/", async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ message: "Email et montant requis." });
  }

  try {
    await sendDonConfirmationEmail(email, amount); // Envoi de l’email au donateur
    await sendAdminNotificationEmail(email, amount); // Notification admin

    // (Optionnel) mise à jour MongoDB avec total annuel…

    res.status(200).json({ message: "Don enregistré, emails envoyés." });
  } catch (err) {
    console.error("Erreur lors de l’enregistrement du don :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

export default router;
