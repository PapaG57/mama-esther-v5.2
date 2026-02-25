import Donation from "../models/Donation.js";

export const creerDon = async (req, res) => {
  try {
    const nouveauDon = new Donation(req.body);
    await nouveauDon.save();
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
