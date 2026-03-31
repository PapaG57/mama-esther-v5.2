import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilitaire pour créer le transporteur SMTP de manière centralisée
const createTransporter = () => {
  const port = Number(process.env.EMAIL_PORT) || 587;
  const isSecure = port === 465;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

// Fonction d’envoi d'email de confirmation après inscription
async function sendConfirmationEmail(email) {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: `"Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "✅ Confirmation d'inscription",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #fdfdfd; padding: 20px;">
          <img src="cid:banniereHeader" alt="Bannière" style="width:100%; max-width:600px; border-radius:10px; margin-bottom:20px;" />
          <h2 style="color:#007a5e;">Bienvenue chez Mama Esther 💚</h2>
          <p>Merci pour votre inscription à notre newsletter !</p>
          <hr style="margin:30px 0;" />
          <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
        </div>
      `,
      attachments: [
        { filename: "banniere.png", path: path.join(__dirname, "..", "assets", "banniere.png"), cid: "banniereHeader" },
        { filename: "logoMama.png", path: path.join(__dirname, "..", "assets", "logoMama.png"), cid: "logoFooter" },
      ],
    });
    console.log("✉️ Mail de confirmation envoyé !");
  } catch (err) {
    console.error("❌ Envoi mail confirmation échoué :", err);
    throw err;
  }
}

// Fonction d’envoi d'email de confirmation après désinscription
async function sendUnsubscribeEmail(email) {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: `"Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Désinscription confirmée",
      html: `<div style="text-align: center;"><h2>Désinscription réussie 💚</h2><img src="cid:logoFooter" alt="Logo" style="max-width:80px;" /></div>`,
      attachments: [{ filename: "logoMama.png", path: path.join(__dirname, "..", "assets", "logoMama.png"), cid: "logoFooter" }],
    });
  } catch (err) {
    console.error("❌ Échec désinscription :", err);
    throw err;
  }
}

// Fonction d’envoi d'email de notification à l’admin
async function sendAdminNotificationEmail(email, amount) {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: `"Système Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📥 Nouveau don reçu",
      html: `<h3>Nouveau don enregistré</h3><p><strong>Email :</strong> ${email}</p><p><strong>Montant :</strong> ${amount} €</p>`,
    });
  } catch (err) {
    console.error("❌ Échec notification admin :", err);
  }
}

// Fonction d’envoi d'email de confirmation après un don
async function sendDonConfirmationEmail(email, amount) {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: `"Association Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Merci pour votre don 💚",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <img src="cid:banniereHeader" alt="Bannière" style="width:100%; max-width:600px; border-radius:10px;" />
          <h2 style="color:#007a5e;">🙏 Merci infiniment !</h2>
          <p>Nous avons bien reçu votre don de <strong>${amount} €</strong>.</p>
          <hr />
          <img src="cid:logoFooter" alt="Logo" style="max-width:80px;" />
        </div>
      `,
      attachments: [
        { filename: "banniere.png", path: path.join(__dirname, "..", "assets", "banniere.png"), cid: "banniereHeader" },
        { filename: "logoMama.png", path: path.join(__dirname, "..", "assets", "logoMama.png"), cid: "logoFooter" },
      ],
    });
  } catch (err) {
    console.error("❌ Échec confirmation don :", err);
  }
}

// Fonction d’envoi d'une newsletter à un abonné
async function sendNewsletterToSubscriber(email, newsletter) {
  const transporter = createTransporter();
  const unsubscribeLink = `https://mamaesther.org/unsubscribe?email=${encodeURIComponent(email)}`;
  try {
    await transporter.sendMail({
      from: `"Mama Esther Newsletter" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: `📰 Mama Esther : ${newsletter.title.fr}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
          <div style="background-color: #007a5e; padding: 20px; text-align: center;">
            <img src="cid:logoFooter" alt="Mama Esther" style="max-width: 100px;" />
          </div>
          <div style="padding: 30px;">
            <h1 style="color: #007a5e; font-size: 24px;">${newsletter.title.fr}</h1>
            <p style="color: #555; line-height: 1.6;">${newsletter.summary.fr}</p>
            <p style="font-size: 12px; color: #aaa; margin-top: 20px;"><a href="${unsubscribeLink}">Se désinscrire</a></p>
          </div>
        </div>
      `,
      attachments: [{ filename: "logoMama.png", path: path.join(__dirname, "..", "assets", "logoMama.png"), cid: "logoFooter" }],
    });
  } catch (err) {
    console.error(`❌ Échec newsletter ${email} :`, err);
    throw err;
  }
}

// Fonction d’envoi d'email d'alerte en cas d'erreur critique
async function sendErrorAlertEmail(error) {
  const transporter = createTransporter();
  try {
    await transporter.sendMail({
      from: `"Alerte Système" <${process.env.EMAIL_SENDER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_SENDER,
      subject: "🚨 Erreur critique",
      html: `<h2>Erreur survenue</h2><p>${error.message}</p><pre>${error.stack}</pre>`,
    });
  } catch (err) {
    console.error("❌ Échec mail alerte :", err);
  }
}

export {
  sendConfirmationEmail,
  sendUnsubscribeEmail,
  sendDonConfirmationEmail,
  sendAdminNotificationEmail,
  sendErrorAlertEmail,
  sendNewsletterToSubscriber,
};
