// backend-newsletter/routes/Contact.js
import { Router } from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { validateContact } from "../middlewares/validation.js";
import Contact from "../models/Contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.post("/", validateContact, async (req, res) => {
  const { name, email, subject, message, extraField } = req.body;

  // 🕵️ Anti-spam invisible (honeypot)
  if (extraField && extraField.trim() !== "") {
    return res.status(400).json({ message: "Bot détecté" });
  }

  try {
    // 💾 Sauvegarde en base de données
    const nouveauMessage = new Contact({ name, email, subject, message });
    await nouveauMessage.save();

    // 📧 Envoi de l'e-mail
    await sendContactEmail({ name, email, subject, message });
    
    res.status(200).json({ message: "Message envoyé avec succès 💚" });
  } catch (error) {
    console.error("❌ Erreur complète route contact :", error);
    res.status(500).json({ 
      message: "Erreur serveur lors de l’envoi.",
      error: error.message 
    });
  }
});

export default router;

async function sendContactEmail({ name, email, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // Doit être false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Construction du chemin absolu vers les assets
  const logoPath = path.join(__dirname, "..", "assets", "logoMama.png");

  await transporter.sendMail({
    from: `"Mama Esther Contact" <${process.env.EMAIL_SENDER}>`,
    to: process.env.EMAIL_SENDER,
    subject: `📬 Nouveau message de ${name}`,
    html: `
      <div style="font-family: Bahnschrift, Arial, sans-serif;">
        <h2 style="color: #007A5E;">💌 Message reçu via la page contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Objet :</strong> ${subject || "Aucun objet précisé"}</p>
        <p><strong>Message :</strong></p>
        <div style="background-color: #f5f5f5; padding: 12px; border-radius: 8px;">
          ${message.replace(/\n/g, "<br />")}
        </div>
        <hr />
        <p style="font-size: 0.9rem; color: #555;">Ce message a été envoyé automatiquement depuis le formulaire contact du site Mama Esther.</p>
      </div>
    `,
    attachments: [
      {
        filename: "logoMama.png",
        path: logoPath,
        cid: "logoMama",
      },
    ],
  });

  console.log(`📩 Mail de contact reçu de ${name}`);
}

