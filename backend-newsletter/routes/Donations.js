import express from "express";
import { creerDon } from "../Controllers/donationController.js";
import Donation from "../models/Donation.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Route pour créer un don via formulaire
router.post("/", creerDon);

// Route pour ajouter un don manuel
router.post("/manual", async (req, res) => {
  const { nomDonateur, montant, commentaires, admin, campagne, source } =
    req.body;

  if (!nomDonateur || !montant) {
    return res.status(400).json({ message: "Nom et montant requis." });
  }

  try {
    const don = new Donation({
      nomDonateur,
      montant,
      source: source || "manuel",
      commentaires: commentaires || "Don manuel (virement, espèces, etc.)",
      admin: admin || "admin inconnu",
      campagne: campagne || null,
      date: new Date(),
    });

    await don.save();
    res.status(201).json({ message: "Don manuel enregistré", don });
  } catch (error) {
    console.error("Erreur ajout don manuel :", error);
    res.status(500).json({
      message: "Erreur serveur lors de l’ajout du don manuel",
      erreur: error.message,
    });
  }
});

// Route pour total cumulé
router.get("/count", async (req, res) => {
  try {
    const result = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]);
    const total = result[0]?.total || 0;
    res.json({ total });
  } catch (error) {
    console.error("Erreur lors du calcul du montant total :", error);
    res.status(500).json({
      message: "Erreur serveur lors du calcul du montant total",
      erreur: error.message,
    });
  }
});

// Route pour total d’une campagne
router.get("/campagne/:nom", async (req, res) => {
  const nomCampagne = req.params.nom;

  try {
    const result = await Donation.aggregate([
      { $match: { campagne: nomCampagne } },
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]);
    const total = result[0]?.total || 0;
    res.json({ campagne: nomCampagne, total });
  } catch (error) {
    console.error("Erreur calcul campagne :", error);
    res.status(500).json({
      message: "Erreur serveur lors du calcul de la campagne",
      erreur: error.message,
    });
  }
});

// Liste complète des dons
router.get("/", async (req, res) => {
  try {
    const dons = await Donation.find().sort({ date: -1 });
    res.json(dons);
  } catch (error) {
    console.error("Erreur récupération dons :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des dons",
      erreur: error.message,
    });
  }
});

// Total des dons de l’année en cours
router.get("/annee", async (req, res) => {
  const anneeActuelle = new Date().getFullYear();
  const debut = new Date(`${anneeActuelle}-01-01T00:00:00.000Z`);
  const fin = new Date(`${anneeActuelle}-12-31T23:59:59.999Z`);

  try {
    const result = await Donation.aggregate([
      { $match: { date: { $gte: debut, $lte: fin } } },
      { $group: { _id: null, total: { $sum: "$montant" } } },
    ]);
    const total = result[0]?.total || 0;
    res.json({ annee: anneeActuelle, total });
  } catch (error) {
    console.error("Erreur calcul dons année :", error);
    res.status(500).json({
      message: "Erreur serveur lors du calcul des dons de l’année",
      erreur: error.message,
    });
  }
});

// Dons mensuels pour l’année en cours
router.get("/mois", async (req, res) => {
  const anneeActuelle = new Date().getFullYear();
  const debut = new Date(`${anneeActuelle}-01-01T00:00:00.000Z`);
  const fin = new Date(`${anneeActuelle}-12-31T23:59:59.999Z`);

  try {
    const result = await Donation.aggregate([
      { $match: { date: { $gte: debut, $lte: fin } } },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$montant" } } },
      { $sort: { _id: 1 } },
    ]);

    const donsParMois = Array.from({ length: 12 }, (_, i) => {
      const moisTrouvé = result.find((r) => r._id === i + 1);
      return { mois: i + 1, total: moisTrouvé ? moisTrouvé.total : 0 };
    });

    res.json({ annee: anneeActuelle, donsParMois });
  } catch (error) {
    console.error("Erreur calcul dons par mois :", error);
    res.status(500).json({
      message: "Erreur serveur lors du calcul des dons mensuels",
      erreur: error.message,
    });
  }
});

// Export PDF stylisé
router.get("/mois/pdf", async (req, res) => {
  const anneeActuelle = new Date().getFullYear();
  const debut = new Date(`${anneeActuelle}-01-01T00:00:00.000Z`);
  const fin = new Date(`${anneeActuelle}-12-31T23:59:59.999Z`);

  try {
    const result = await Donation.aggregate([
      { $match: { date: { $gte: debut, $lte: fin } } },
      { $group: { _id: { $month: "$date" }, total: { $sum: "$montant" } } },
      { $sort: { _id: 1 } },
    ]);

    const donsParMois = Array.from({ length: 12 }, (_, i) => {
      const moisTrouvé = result.find((r) => r._id === i + 1);
      return {
        mois: new Date(anneeActuelle, i).toLocaleString("fr-FR", {
          month: "long",
        }),
        total: moisTrouvé ? moisTrouvé.total : 0,
      };
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=dons.pdf");
    doc.pipe(res);

    doc
      .fillColor("#e60026") /* rouge drapeau Cameroun */
      .fontSize(20)
      .text("Association Mama Esther", { align: "center" })
      .moveDown(0.5)
      .fillColor("#007a3d") /* vert drapeau Cameroun */
      .fontSize(16)
      .text(`Dons mensuels pour l’année ${anneeActuelle}`, { align: "center" })
      .moveDown(1.5);

    const colWidths = [100, 100];
    const tableWidth = colWidths[0] + colWidths[1];
    const startX = (doc.page.width - tableWidth) / 2;
    const startY = doc.y;
    const rowHeight = 20;

    doc.font("Helvetica-Bold").fontSize(12);
    doc.rect(startX, startY, colWidths[0], rowHeight).stroke();
    doc.rect(startX + colWidths[0], startY, colWidths[1], rowHeight).stroke();
    doc.text("Mois", startX + 5, startY + 5);
    doc.text("Total (€)", startX + colWidths[0] + 5, startY + 5);

    doc.font("Helvetica").fontSize(12);
    donsParMois.forEach((d, i) => {
      const y = startY + rowHeight * (i + 1);
      doc.rect(startX, y, colWidths[0], rowHeight).stroke();
      doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight).stroke();
      doc.text(
        d.mois.charAt(0).toUpperCase() + d.mois.slice(1),
        startX + 5,
        y + 5
      );
      doc.text(`${d.total}`, startX + colWidths[0] + 5, y + 5);
    });

    doc
      .moveDown(2)
      .fillColor("#007a3d") /* vert drapeau Cameroun */
      .fontSize(12)
      .font("Helvetica-Oblique")
      .text("Merci pour votre générosité", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Erreur export PDF :", error);
    res.status(500).json({
      message: "Erreur serveur lors de l'export PDF",
      erreur: error.message,
    });
  }
});

export default router;
