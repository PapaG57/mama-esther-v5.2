import express from "express";
import Newsletter from "../models/Newsletter.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import multer from "multer";
import { Op } from "sequelize";
import { generateNewsletterPdf } from "../utils/pdf-generator.js";
import Subscriber from "../models/Subscriber.js";
import { sendNewsletterToSubscriber } from "../utils/send-email.js";

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
    const newsletters = await Newsletter.findAll({ 
      where: { isPublished: true },
      order: [['newsletterNumber', 'DESC']] 
    });
    res.json(newsletters);
  } catch (err) {
    logger.error("Erreur listing newsletters:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 2. 🔍 RÉCUPÉRER UNE NEWSLETTER PAR NUMÉRO OU ID (PUBLIQUE)
router.get("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const isNumeric = !isNaN(idParam);
    
    let newsletter;
    if (isNumeric) {
      const num = parseInt(idParam);
      newsletter = await Newsletter.findOne({
        where: {
          [Op.or]: [
            { id: num },
            { newsletterNumber: num }
          ]
        }
      });
    } else {
      // Si ce n'est pas un nombre, on ne cherche que par ID (si c'était un UUID par exemple)
      // Mais ici nos IDs sont des entiers, donc si c'est pas numérique, ça n'existe pas.
      return res.status(404).json({ error: "Newsletter non trouvée (ID invalide)" });
    }

    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });
    res.json(newsletter);
  } catch (err) {
    logger.error("Erreur récupération newsletter:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 3. ✍️ CRÉER UNE NEWSLETTER (ADMIN SEULEMENT)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const lastNews = await Newsletter.findOne({
      order: [['newsletterNumber', 'DESC']]
    });
    const nextNumber = lastNews ? lastNews.newsletterNumber + 1 : 1;
    
    const newNews = await Newsletter.create({
      ...req.body,
      newsletterNumber: nextNumber
    });
    
    // Génération automatique du PDF en arrière-plan
    (async () => {
      try {
        const pdfUrl = await generateNewsletterPdf(newNews.id, nextNumber, newNews.date);
        await Newsletter.update({ pdfPath: pdfUrl }, { where: { id: newNews.id } });
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
    const idParam = req.params.id;
    const isNumeric = !isNaN(idParam);
    
    if (!isNumeric) return res.status(400).json({ error: "ID invalide" });
    const num = parseInt(idParam);

    const [affectedCount] = await Newsletter.update(req.body, {
      where: {
        [Op.or]: [
          { id: num },
          { newsletterNumber: num }
        ]
      }
    });

    if (affectedCount === 0) return res.status(404).json({ error: "Newsletter non trouvée" });

    const updatedNews = await Newsletter.findOne({
      where: {
        [Op.or]: [
          { id: num },
          { newsletterNumber: num }
        ]
      }
    });

    // Régénération automatique du PDF en arrière-plan
    (async () => {
      try {
        const pdfUrl = await generateNewsletterPdf(updatedNews.id, updatedNews.newsletterNumber, updatedNews.date);
        await Newsletter.update({ pdfPath: pdfUrl }, { where: { id: updatedNews.id } });
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
    const idParam = req.params.id;
    if (isNaN(idParam)) return res.status(400).json({ error: "ID invalide" });
    const num = parseInt(idParam);

    const deleted = await Newsletter.destroy({ 
      where: {
        [Op.or]: [
          { id: num },
          { newsletterNumber: num }
        ]
      }
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
    const idParam = req.params.id;
    if (isNaN(idParam)) return res.status(400).json({ error: "ID invalide" });
    const num = parseInt(idParam);

    const newsletter = await Newsletter.findOne({ 
      where: {
        [Op.or]: [
          { id: num },
          { newsletterNumber: num }
        ]
      }
    });
    
    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });
    
    const pdfUrl = await generateNewsletterPdf(newsletter.id, newsletter.newsletterNumber, newsletter.date);
    await Newsletter.update({ pdfPath: pdfUrl }, { where: { id: newsletter.id } });
    
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
    
    const idParam = req.params.id;
    if (isNaN(idParam)) return res.status(400).json({ error: "ID invalide" });
    const num = parseInt(idParam);

    const pdfUrl = `/uploads/pdf/${req.file.filename}`;
    const [affectedCount] = await Newsletter.update(
      { pdfPath: pdfUrl },
      { where: {
          [Op.or]: [
            { id: num },
            { newsletterNumber: num }
          ]
        }
      }
    );
    
    if (affectedCount === 0) return res.status(404).json({ error: "Newsletter non trouvée" });
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Tu es le rédacteur web de l'ONG Mama Esther. Rédige un article captivant, sérieux et humain en français sur le sujet suivant : "${prompt}". N'ajoute pas de titre ou de préambule hors-sujet, renvoie directement le corps du texte rédigé.` }]
          }]
        })
      });
      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return res.json({ 
          message: "L'IA a généré le contenu avec succès.",
          content: generatedText.trim() 
        });
      }
    }

    // Génération fallback humanisée ONG si aucune clé API Gemini n'est configurée dans .env
    const subject = prompt && prompt.length > 5 ? prompt : "les actions humanitaires et éducatives sur le terrain";
    res.json({ 
      message: "Contenu rédigé pour l'association.",
      content: `Chaque jour sur le terrain, l'Association Mama Esther intensifie ses efforts concernant ${subject}. Grâce au dévouement de nos équipes et à la solidarité de nos soutiens, nous bâtissons des solutions pérennes pour offrir un avenir meilleur et redonner espoir aux familles accompagnées.` 
    });
  } catch (err) {
    logger.error("Erreur lors de la génération IA:", err);
    res.status(500).json({ error: "Échec de la génération par l'IA." });
  }
});

// 5. 🚀 ROUTE DE DIFFUSION (MASS MAILING)
router.post("/:id/broadcast", verifyAdmin, async (req, res) => {
  try {
    const newsletter = await Newsletter.findByPk(req.params.id);
    if (!newsletter) return res.status(404).json({ error: "Newsletter non trouvée" });

    const subscribers = await Subscriber.findAll();
    if (subscribers.length === 0) return res.status(400).json({ message: "Aucun abonné à qui envoyer la newsletter." });

    logger.info(`📢 Lancement de la diffusion de la newsletter ${newsletter.newsletterNumber} à ${subscribers.length} abonnés.`);

    // On lance l'envoi en arrière-plan pour ne pas bloquer l'admin
    (async () => {
      let successCount = 0;
      let failCount = 0;

      for (const subscriber of subscribers) {
        try {
          await sendNewsletterToSubscriber(subscriber.email, newsletter);
          successCount++;
          // Petit délai de 200ms pour éviter de saturer le serveur SMTP (Outlook/LWS)
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (sendErr) {
          failCount++;
          logger.error(`❌ Échec envoi newsletter à ${subscriber.email}:`, sendErr);
        }
      }

      logger.info(`✅ Diffusion terminée. Succès: ${successCount}, Échecs: ${failCount}`);
    })();

    res.json({ 
      message: `La diffusion à ${subscribers.length} abonnés a commencé en arrière-plan.`,
      subscriberCount: subscribers.length 
    });
  } catch (err) {
    logger.error("Erreur lors de la diffusion de la newsletter:", err);
    res.status(500).json({ error: "Erreur serveur lors de la diffusion" });
  }
});

export default router;
