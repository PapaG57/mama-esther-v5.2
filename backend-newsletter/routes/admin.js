import express from "express";
import { hash as _hash, compare as _compare } from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Donation from "../models/Donation.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { validateDonation } from "../middlewares/validation.js";

const { sign } = jwt;
const router = express.Router();

// 🔐 Route pour créer un compte administrateur
router.post("/register", async (req, res) => {
  try {
    const { identifiant, motDePasse } = req.body;

    const adminExistant = await Admin.findOne({ identifiant });
    if (adminExistant) {
      return res.status(400).json({ error: "Identifiant déjà utilisé" });
    }

    const hash = await _hash(motDePasse, 10);

    const nouvelAdmin = new Admin({
      identifiant,
      motDePasse: hash,
    });

    await nouvelAdmin.save();
    res.status(201).json({ message: "Administrateur créé avec succès" });
  } catch (err) {
    console.error("Erreur création admin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔑 Route de connexion administrateur
router.post("/login", async (req, res) => {
  try {
    const { identifiant, motDePasse } = req.body;

    const admin = await Admin.findOne({ identifiant });
    if (!admin) {
      return res.status(401).json({ error: "Identifiant incorrect" });
    }

    const isValid = await _compare(motDePasse, admin.motDePasse);
    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = sign(
      { id: admin._id, identifiant: admin.identifiant },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Erreur de connexion admin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ➕ Route pour ajouter un don manuel
router.post("/manual-donation", verifyAdmin, validateDonation, async (req, res) => {
  try {
    const { nomDonateur, montant, message, source } = req.body;

    const don = new Donation({
      nomDonateur,
      montant,
      message,
      source,
    });

    await don.save();
    res.status(201).json({ message: "Don manuel ajouté avec succès" });
  } catch (err) {
    console.error("Erreur ajout don manuel :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔒 Route protégée : accès aux dons
router.get("/dons", verifyAdmin, async (req, res) => {
  try {
    const dons = await Donation.find().sort({ date: -1 });
    res.json(dons);
  } catch (err) {
    console.error("Erreur récupération dons :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔥 Route DELETE pour supprimer un don (protégée)
router.delete("/dons/:id", verifyAdmin, async (req, res) => {
  console.log("ID reçu pour suppression:", req.params.id);
  try {
    const don = await Donation.findByIdAndDelete(req.params.id);
    if (!don) {
      return res.status(404).json({ error: "Don introuvable" });
    }
    res.status(204).send(); // ou res.json({ message: "Don supprimé" });
  } catch (err) {
    console.error("Erreur suppression:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
