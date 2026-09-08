import express from "express";
import Donation from "../models/Donation.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * WEBHOOK OFFICIEL HELLOASSO
 * Doc V5: https://api.helloasso.com/v5/swagger/ui/index.html#/Webhooks
 */
router.post("/webhook", async (req, res) => {
  const notification = req.body;

  logger.info("📩 Webhook HelloAsso reçu :", JSON.stringify(notification));

  try {
    const data = notification.data;
    const eventType = notification.eventType;

    // On ne traite que les commandes (Order) ou les paiements (Payment)
    if ((eventType === "Order" || eventType === "Payment") && data) {
      // 1. Extraction du montant en centimes (gestion du format objet de l'API V5)
      let montantCents = 0;
      if (typeof data.amount === "number") {
        montantCents = data.amount;
      } else if (data.amount && typeof data.amount.total === "number") {
        montantCents = data.amount.total;
      } else if (typeof data.totalAmount === "number") {
        montantCents = data.totalAmount;
      }

      const montantEuro = montantCents / 100;

      // 2. Extraction robuste des infos du donateur
      const payer = data.payer || {};
      const email = payer.email || data.email || "anonyme@helloasso.com";
      const firstName = payer.firstName || "";
      const lastName = payer.lastName || "Donateur";

      const nomDonateur = `${firstName} ${lastName}`.trim() || "Donateur HelloAsso";

      // 3. Enregistrement si le montant est valide
      if (montantEuro > 0) {
        const nouveauDon = await Donation.create({
          nomDonateur: nomDonateur,
          email: email,
          montant: montantEuro,
          source: "HelloAsso",
          commentaires: `Don automatique via Webhook (${eventType} - ID: ${data.id || "N/A"})`,
          date: new Date(),
        });

        logger.info(`✅ Don HelloAsso de ${montantEuro}€ enregistré avec succès pour ${nomDonateur}`);
      } else {
        logger.warn("⚠️ Webhook reçu mais montant égal à 0 ou non extrait correctement.");
      }
    }

    // Réponse 200 obligatoire pour HelloAsso
    res.status(200).send("OK");
  } catch (error) {
    logger.error("❌ Erreur lors du traitement du Webhook HelloAsso :", error);
    res.status(200).send("Error logged but handled");
  }
});

// Route de simulation (tests manuels)
router.post("/helloasso-simulation", async (req, res) => {
  const amount = req.body.amount || req.body.montant;
  const email = req.body.email;
  const { firstName, lastName } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ message: "Montant et email requis." });
  }

  try {
    const nouveauDon = await Donation.create({
      nomDonateur: `${firstName || ""} ${lastName || ""}`.trim() || "Donateur Simulé",
      email: email,
      montant: amount,
      source: "HelloAsso",
      commentaires: "Don via HelloAsso (simulation)",
      date: new Date(),
    });

    res.status(201).json({ message: "Don HelloAsso simulé enregistré ✅", don: nouveauDon });
  } catch (error) {
    console.error("Erreur simulation HelloAsso :", error);
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
});

export default router;
