import express from "express";
import { Op } from "sequelize";
import Donation from "../models/Donation.js";
import { sendDonConfirmationEmail, sendAdminNotificationEmail } from "../utils/send-email.js";

const router = express.Router();

// 1. POST : Créer un don
router.post("/", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Corps de requête vide." });
    }

    const { nomDonateur, montant, email, commentaires, campagne, source } = req.body;

    if (!nomDonateur || !montant) {
      return res.status(400).json({ message: "Le nom du donateur et le montant sont requis." });
    }

    const parsedMontant = Number(montant);
    if (isNaN(parsedMontant) || parsedMontant <= 0) {
      return res.status(400).json({ message: "Le montant doit être un nombre valide supérieur à 0." });
    }

    const don = await Donation.create({
      nomDonateur: nomDonateur.trim(),
      email: email ? email.trim() : null,
      montant: parsedMontant,
      source: source ? source.trim() : "formulaire",
      commentaires: commentaires ? commentaires.trim() : null,
      campagne: campagne ? campagne.trim() : null,
      date: new Date(),
    });

    if (email) {
      sendDonConfirmationEmail(email, parsedMontant).catch((err) => console.error("❌ Échec envoi email confirmation don :", err));
    }

    sendAdminNotificationEmail(email || nomDonateur, parsedMontant).catch((err) => console.error("❌ Échec envoi notification admin don :", err));

    return res.status(201).json({
      message: "Don enregistré avec succès et e-mails pris en compte 🙏",
      don,
    });
  } catch (error) {
    console.error("Erreur critique création don :", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création du don",
      erreur: error.message,
    });
  }
});

// 2. GET : Récupérer tous les dons
router.get("/", async (req, res) => {
  try {
    const dons = await Donation.findAll({
      order: [["date", "DESC"]],
    });
    return res.status(200).json(dons);
  } catch (error) {
    console.error("Erreur lors de la récupération des dons :", error);
    return res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
});

// 3. GET : Total général récolté (/count)
router.get("/count", async (req, res) => {
  try {
    const total = (await Donation.sum("montant")) || 0;
    // Format objet JSON pour le front-end
    return res.status(200).json({ total, count: total, totalGlobal: total });
  } catch (error) {
    console.error("Erreur count :", error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. GET : Total récolté pour l'année en cours (/annee)
router.get("/annee", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

    const totalAnnee =
      (await Donation.sum("montant", {
        where: {
          date: {
            [Op.between]: [startOfYear, endOfYear],
          },
        },
      })) || 0;

    return res.status(200).json({ total: totalAnnee, totalAnnee });
  } catch (error) {
    console.error("Erreur annee :", error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. GET : Total récolté ce mois-ci (/mois)
router.get("/mois", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const totalMois =
      (await Donation.sum("montant", {
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      })) || 0;

    return res.status(200).json({ total: totalMois, totalMois });
  } catch (error) {
    console.error("Erreur mois :", error);
    return res.status(500).json({ error: error.message });
  }
});

// 6. GET : Nombre total de donateurs (/donors/count)
router.get("/donors/count", async (req, res) => {
  try {
    const count = await Donation.count();
    return res.status(200).json({ count, totalDonors: count });
  } catch (error) {
    console.error("Erreur donors/count :", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
