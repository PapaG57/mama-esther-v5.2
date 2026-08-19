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

    const adminExistant = await Admin.findOne({ where: { identifiant } });
    if (adminExistant) {
      return res.status(400).json({ error: "Identifiant déjà utilisé" });
    }

    const hash = await _hash(motDePasse, 10);

    await Admin.create({
      identifiant,
      motDePasse: hash,
    });

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

    const admin = await Admin.findOne({ where: { identifiant } });
    if (!admin) {
      return res.status(401).json({ error: "Identifiant incorrect" });
    }

    const isValid = await _compare(motDePasse, admin.motDePasse);
    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const secret = process.env.JWT_SECRET || "uC6$Rs26ZHdaPTX";
    const token = sign({ id: admin.id, identifiant: admin.identifiant }, secret, { expiresIn: "7d" });

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

    await Donation.create({
      nomDonateur,
      montant,
      commentaires: message,
      source,
    });

    res.status(201).json({ message: "Don manuel ajouté avec succès" });
  } catch (err) {
    console.error("Erreur ajout don manuel :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔑 Route pour changer les identifiants (protégée)
router.put("/change-credentials", verifyAdmin, async (req, res) => {
  try {
    const { ancienMotDePasse, nouvelIdentifiant, nouveauMotDePasse } = req.body;

    // Vérifier que l'ancien mot de passe est fourni
    if (!ancienMotDePasse) {
      return res.status(400).json({ message: "L'ancien mot de passe est requis." });
    }

    // Récupérer l'admin par son ID provenant du token JWT
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable." });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await _compare(ancienMotDePasse, admin.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect." });
    }

    // Vérifier l'unicité de l'identifiant (uniquement si modifié)
    if (nouvelIdentifiant && nouvelIdentifiant !== admin.identifiant) {
      const exist = await Admin.findOne({ where: { identifiant: nouvelIdentifiant } });
      if (exist) {
        return res.status(400).json({ message: "Cet identifiant appartient déjà à un autre compte." });
      }
      admin.identifiant = nouvelIdentifiant;
    }

    // Mettre à jour le nouveau mot de passe si fourni
    if (nouveauMotDePasse && nouveauMotDePasse.trim() !== "") {
      admin.motDePasse = await _hash(nouveauMotDePasse.trim(), 10);
    }

    // Sauvegarder les modifications
    await admin.save();

    return res.status(200).json({ message: "Identifiants mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur changement identifiants :", err);
    return res.status(500).json({ message: err.message });
  }
});

// 🔒 Route protégée : accès aux dons
router.get("/dons", verifyAdmin, async (req, res) => {
  try {
    const dons = await Donation.findAll({ order: [["date", "DESC"]] });
    res.json(dons);
  } catch (err) {
    console.error("Erreur récupération dons :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔥 Route DELETE pour supprimer un don (protégée)
router.delete("/dons/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Donation.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: "Don introuvable" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Erreur suppression:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;