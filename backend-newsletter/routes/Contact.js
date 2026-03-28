// backend-newsletter/routes/Contact.js
import { Router } from "express";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
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
  console.log("📨 --- DIAGNOSTIC ENVIRONNEMENT ---");
  console.log("📂 Dossier actuel :", process.cwd());
  console.log("🔑 Clés détectées :", Object.keys(process.env).filter(k => k.includes("EMAIL") || k.includes("ADMIN")));
  console.log("📨 Tentative d'envoi d'email SMTP...");

  
  // 🛡️ Nettoyage des variables (au cas où il y aurait des espaces invisibles)
  const user = process.env.EMAIL_SENDER ? process.env.EMAIL_SENDER.trim() : "";
  const pass = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.trim() : "";
  const host = process.env.EMAIL_HOST ? process.env.EMAIL_HOST.trim() : "";
  const port = Number(process.env.EMAIL_PORT) || 587;

  console.log(`👤 Login : [${user}]`);
  console.log(`🔑 MDP : [${pass.length} caractères]`);

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true pour 465, false pour 587 (STARTTLS)
    auth: {
      user: user,
      pass: pass,
    },
    authMethod: 'LOGIN',
    tls: {
      rejectUnauthorized: false, // Important pour LWS
      minVersion: 'TLSv1.2'
    }
  });



  // Vérification de l'existence de l'image
  const logoPath = path.join(__dirname, "..", "assets", "logoMama.png");
  
  if (!fs.existsSync(logoPath)) {
    console.error("❌ ERREUR : Le logo est introuvable au chemin :", logoPath);
    // On continue sans attachement pour éviter le plantage 500 si possible
  }

  const mailOptions = {
    from: `"Mama Esther Contact" <${process.env.EMAIL_SENDER}>`,
    to: process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.includes('@') ? process.env.ADMIN_EMAIL : process.env.EMAIL_SENDER,
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
  };

  // N'ajouter l'attachement que si le fichier existe
  if (fs.existsSync(logoPath)) {
    mailOptions.attachments = [
      {
        filename: "logoMama.png",
        path: logoPath,
        cid: "logoMama",
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès ! ID:", info.messageId);
  } catch (err) {
    console.error("❌ ERREUR SMTP DÉTAILLÉE :", err);
    throw err;
  }
}

