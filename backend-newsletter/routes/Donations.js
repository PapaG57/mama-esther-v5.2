import Donation from "../models/Donation.js";
import { sendDonConfirmationEmail, sendAdminNotificationEmail } from "../utils/send-email.js";

export const creerDon = async (req, res) => {
  const { nomDonateur, montant, email, commentaires, campagne, source } = req.body;

  if (!nomDonateur || !montant) {
    return res.status(400).json({ message: "Nom et montant requis." });
  }

  try {
    const don = await Donation.create({
      nomDonateur,
      email: email || null,
      montant,
      source: source || "formulaire",
      commentaires: commentaires || null,
      campagne: campagne || null,
      date: new Date(),
    });

    // 📧 Envoi des e-mails (Remerciement + Notification Admin)
    if (email) {
      await sendDonConfirmationEmail(email, montant).catch((err) => console.error("❌ Échec envoi email confirmation don :", err));
    }

    await sendAdminNotificationEmail(email || nomDonateur, montant).catch((err) => console.error("❌ Échec envoi notification admin don :", err));

    res.status(201).json({ message: "Don enregistré avec succès et e-mails envoyés", don });
  } catch (error) {
    console.error("Erreur création don :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la création du don",
      erreur: error.message,
    });
  }
};

export default creerDon;
