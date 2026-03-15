import express from "express";
import Newsletter from "../models/Newsletter.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { generateNewsletterPdf } from "../utils/pdf-generator.js";

dotenv.config();

const router = express.Router();

// Configuration Multer pour les PDF manuels
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdf/");
  },
  filename: (req, file, cb) => {
    cb(null, `newsletter-${Date.now()}.pdf`);
  },
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont autorisés"));
    }
  }
});

// 1. 📜 LISTER TOUTES LES NEWSLETTERS (PUBLIQUE)
router.get("/", async (req, res) => {
  try {
    const newsletters = await Newsletter.find({ isPublished: true }).sort({ newsletterNumber: -1 });
    res.json(newsletters);
  } catch (err) {
    logger.error("Erreur listing newsletters:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 2. 🔍 RÉCUPÉRER UNE NEWSLETTER PAR NUMÉRO OU ID (PUBLIQUE)
router.get("/:id", async (req, res) => {
  try {
    const isNumeric = !isNaN(req.params.id);
    let query = { _id: req.params.id };
    
    if (isNumeric) {
      query = { $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] };
    }

    const newsletter = await Newsletter.findOne(query);
    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });
    res.json(newsletter);
  } catch (err) {
    // Si l'ID n'est pas un ObjectId valide mais qu'on a un numéro, on tente par numéro
    if (!isNaN(req.params.id)) {
      try {
        const newsletterByNum = await Newsletter.findOne({ newsletterNumber: parseInt(req.params.id) });
        if (newsletterByNum) return res.json(newsletterByNum);
      } catch (e) { /* ignore */ }
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 3. ✍️ CRÉER UNE NEWSLETTER (ADMIN SEULEMENT)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const lastNews = await Newsletter.findOne().sort({ newsletterNumber: -1 });
    const nextNumber = lastNews ? lastNews.newsletterNumber + 1 : 1;
    
    const newNews = new Newsletter({
      ...req.body,
      newsletterNumber: nextNumber
    });
    
    await newNews.save();
    
    // Génération automatique du PDF en arrière-plan
    (async () => {
      try {
        const pdfUrl = await generateNewsletterPdf(newNews._id, nextNumber, newNews.date);
        await Newsletter.findByIdAndUpdate(newNews._id, { $set: { pdfPath: pdfUrl } });
        logger.info(`PDF auto-généré pour la newsletter ${nextNumber}`);
      } catch (pdfErr) {
        logger.error(`Erreur lors de la génération automatique du PDF pour ${nextNumber}:`, pdfErr);
      }
    })();

    res.status(201).json(newNews);
  } catch (err) {
    logger.error("Erreur création newsletter:", err);
    res.status(400).json({ error: err.message });
  }
});

// 3bis. 📝 MODIFIER UNE NEWSLETTER (ADMIN SEULEMENT)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedNews = await Newsletter.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedNews) return res.status(404).json({ error: "Newsletter non trouvée" });

    // Régénération automatique du PDF en arrière-plan
    (async () => {
      try {
        const pdfUrl = await generateNewsletterPdf(updatedNews._id, updatedNews.newsletterNumber, updatedNews.date);
        await Newsletter.findByIdAndUpdate(updatedNews._id, { $set: { pdfPath: pdfUrl } });
        logger.info(`PDF auto-régénéré pour la newsletter ${updatedNews.newsletterNumber}`);
      } catch (pdfErr) {
        logger.error(`Erreur lors de la régénération automatique du PDF pour ${updatedNews.newsletterNumber}:`, pdfErr);
      }
    })();

    res.json(updatedNews);
  } catch (err) {
    logger.error("Erreur modification newsletter:", err);
    res.status(400).json({ error: err.message });
  }
});

// 3ter. 🗑️ SUPPRIMER UNE NEWSLETTER (ADMIN SEULEMENT)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Newsletter.findOneAndDelete({ 
      $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] 
    });
    if (!deleted) return res.status(404).json({ error: "Newsletter non trouvée" });
    res.json({ message: "Newsletter supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 3quater. 📁 RÉGÉNÉRER PDF (ADMIN SEULEMENT)
router.post("/:id/generate-pdf", verifyAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne({ 
      $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] 
    });
    
    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });
    
    const pdfUrl = await generateNewsletterPdf(newsletter._id, newsletter.newsletterNumber, newsletter.date);
    await Newsletter.findByIdAndUpdate(newsletter._id, { $set: { pdfPath: pdfUrl } });
    
    res.json({ message: "PDF généré avec succès", pdfPath: pdfUrl });
  } catch (err) {
    logger.error("Erreur lors de la régénération manuelle du PDF:", err);
    res.status(500).json({ error: "Échec de la génération du PDF" });
  }
});

// 3quinquies. 📁 UPLOAD PDF MANUEL (ADMIN SEULEMENT)
router.post("/:id/upload-pdf", verifyAdmin, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier PDF envoyé" });
    
    const pdfUrl = `/uploads/pdf/${req.file.filename}`;
    const updatedNews = await Newsletter.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] },
      { $set: { pdfPath: pdfUrl } },
      { new: true }
    );
    
    if (!updatedNews) return res.status(404).json({ error: "Newsletter non trouvée" });
    res.json({ message: "PDF mis à jour avec succès", pdfPath: pdfUrl });
  } catch (err) {
    logger.error("Erreur upload PDF:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 4. 🤖 ROUTE IA : GÉNÉRER DU CONTENU (ADMIN SEULEMENT)
router.post("/ai-generate", verifyAdmin, async (req, res) => {
  const { prompt, action } = req.body; 
  try {
    res.json({ 
      message: "L'IA a généré le contenu avec succès.",
      content: `[Génération IA pour ${action}] : ${prompt} ... (Texte généré ici)` 
    });
  } catch (err) {
    res.status(500).json({ error: "Échec de l'IA" });
  }
});

export default router;
