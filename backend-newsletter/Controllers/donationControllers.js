import Donation from "../models/Donation.js";
import { sendDonConfirmationEmail, sendAdminNotificationEmail } from "../utils/send-email.js";

export const creerDon = async (req, res) => {
  try {
    const { nomDonateur, montant, email, commentaires, campagne, source } = req.body;

    // Validation des champs obligatoires
    if (!nomDonateur || !montant) {
      return res.status(400).json({ message: "Le nom du donateur et le montant sont requis." });
    }

    // Sécurité : vérifier que le montant est un nombre valide
    if (isNaN(montant) || Number(montant) <= 0) {
      return res.status(400).json({ message: "Le montant du don doit être valide." });
    }

    // Enregistrement dans MongoDB
    const nouveauDon = await Donation.create({
      nomDonateur: nomDonateur.trim(),
      email: email ? email.trim() : null,
      montant: Number(montant),
      source: source ? source.trim() : "formulaire",
      commentaires: commentaires ? commentaires.trim() : null,
      campagne: campagne ? campagne.trim() : null,
      date: new Date(),
    });

    // Envoi des emails en arrière-plan
    if (email) {
      sendDonConfirmationEmail(email, montant).catch((err) => console.error("❌ Échec envoi email confirmation don :", err));
    }

    sendAdminNotificationEmail(email || nomDonateur, montant).catch((err) => console.error("❌ Échec envoi notification admin don :", err));

    return res.status(201).json({
      message: "Don enregistré avec succès et e-mails pris en compte 🙏",
      don: nouveauDon,
    });
  } catch (error) {
    console.error("💥 Erreur lors de la création du don :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création du don",
      erreur: error.message,
    });
  }
};
