import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// Simulation de webhook HelloAsso
router.post("/helloasso-simulation", async (req, res) => {
  const { amount, email, firstName, lastName } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ message: "Montant et email requis." });
  }

  try {
    const nouveauDon = new Donation({
      nomDonateur: `${firstName} ${lastName}`,
      montant: amount,
      message: "Don via HelloAsso (simulation)",
    });

    await nouveauDon.save();

    res.status(201).json({ message: "Don HelloAsso simulé enregistré ✅" });
  } catch (error) {
    console.error("Erreur simulation HelloAsso :", error);
    res.status(500).json({ message: "Erreur serveur", erreur: error.message });
  }
});

export default router;