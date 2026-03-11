import express from "express";
import Newsletter from "../models/Newsletter.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 1. 🌐 LISTER TOUTES LES NEWSLETTERS (PUBLIQUE)
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
    const newsletter = await Newsletter.findOne({ 
      $or: [{ _id: req.params.id }, { newsletterNumber: parseInt(req.params.id) }] 
    });
    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });
    res.json(newsletter);
  } catch (err) {
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
    res.status(201).json(newNews);
  } catch (err) {
    logger.error("Erreur création newsletter:", err);
    res.status(400).json({ error: err.message });
  }
});

// 4. 🤖 ROUTE IA : GÉNÉRER DU CONTENU (ADMIN SEULEMENT)
// Cette route servira de pont vers l'IA (Gemini/OpenAI)
router.post("/ai-generate", verifyAdmin, async (req, res) => {
  const { prompt, action } = req.body; 
  // action peut être: 'draft', 'translate', 'summarize'
  
  try {
    // Ici on appellera l'API Gemini plus tard
    // Pour l'instant on simule une réponse
    res.json({ 
      message: "L'IA a généré le contenu avec succès.",
      content: `[Génération IA pour ${action}] : ${prompt} ... (Texte généré ici)` 
    });
  } catch (err) {
    res.status(500).json({ error: "Échec de l'IA" });
  }
});

export default router;
