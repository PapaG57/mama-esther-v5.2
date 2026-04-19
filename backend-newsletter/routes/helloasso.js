import express from "express";
import Donation from "../models/Donation.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * WEBHOOK OFFICIEL HELLOASSO
 * Cette route reçoit les notifications de paiement de HelloAsso
 * Doc: https://api.helloasso.com/v5/swagger/ui/index.html#/Webhooks
 */
router.post("/webhook", async (req, res) => {
  const notification = req.body;
  
  logger.info("📩 Webhook HelloAsso reçu :", JSON.stringify(notification));

  try {
    // HelloAsso envoie les données dans notification.data
    const data = notification.data;
    const eventType = notification.eventType;

    // On ne traite que les commandes (Order) ou les paiements réussis
    if (eventType === "Order" || eventType === "Payment") {
      
      // Extraction des infos (le format dépend de HelloAsso V5)
      const montantCents = data.amount || data.totalAmount || 0;
      const montantEuro = montantCents / 100; // HelloAsso envoie souvent en centimes
      
      const email = data.payer?.email || data.email || "anonyme@helloasso.com";
      const firstName = data.payer?.firstName || "";
      const lastName = data.payer?.lastName || "Donateur HelloAsso";
      const nomDonateur = `${firstName} ${lastName}`.trim();

      // On vérifie si on a un montant
      if (montantEuro > 0) {
        const nouveauDon = await Donation.create({
          nomDonateur: nomDonateur,
          email: email,
          montant: montantEuro,
          source: "HelloAsso",
          commentaires: `Don via Webhook HelloAsso (${eventType})`,
          date: new Date(),
        });

        logger.info(`✅ Don HelloAsso de ${montantEuro}€ enregistré pour ${nomDonateur}`);
      }
    }

    // Toujours répondre 200 à HelloAsso pour confirmer la réception
    res.status(200).send("OK");
  } catch (error) {
    logger.error("❌ Erreur traitement Webhook HelloAsso :", error);
    // On répond quand même 200 pour éviter que HelloAsso ne renvoie la notification en boucle,
    // sauf si on veut vraiment qu'ils réessaient.
    res.status(200).send("Error logged but handled");
  }
});

// Route de simulation (gardée pour tes tests manuels)
router.post("/helloasso-simulation", async (req, res) => {
  const amount = req.body.amount || req.body.montant;
  const email = req.body.email;
  const { firstName, lastName } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ message: "Montant (ou amount) et email requis." });
  }

  try {
    const nouveauDon = await Donation.create({
      nomDonateur: `${firstName} ${lastName}`,
      email: email,
      montant: amount,
      source: "HelloAsso",
      commentaires: "Don via HelloAsso (simulation)",
    });

    res.status(201).json({ message: "Don HelloAsso simulé enregistré ✅", don: nouveauDon });
  } catch (error) {
    console.error("Erreur simulation HelloAsso :", error);
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
});

export default router;
