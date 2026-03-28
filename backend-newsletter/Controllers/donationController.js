import Donation from "../models/Donation.js";
import { sendDonConfirmationEmail, sendAdminNotificationEmail } from "../utils/send-email.js";

export const creerDon = async (req, res) => {
  const { nomDonateur, montant, email } = req.body;

  try {
    const nouveauDon = new Donation(req.body);
    await nouveauDon.save();

    // 📧 Envoi des emails (Confirmation au donateur + Alerte à l'admin)
    if (email) {
      await sendDonConfirmationEmail(email, montant).catch(err => 
        console.error("❌ Échec envoi email confirmation don :", err)
      );
    }

    await sendAdminNotificationEmail(email || "Anonyme", montant).catch(err => 
      console.error("❌ Échec envoi notification admin don :", err)
    );

    res.status(201).json({
      message: "Don enregistré avec succès 🙏",
      don: nouveauDon,
    });
  } catch (error) {
    console.error("💥 Erreur lors de l'enregistrement du don :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la création du don",
      erreur: error.message,
    });
  }
};

