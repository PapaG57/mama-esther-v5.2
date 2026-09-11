import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(process.env.RESEND_API_KEY);

// Utilitaire pour charger les images locales en pièces jointes avec CID
const getAssetAttachment = (filename, cid) => {
  const filePath = path.join(__dirname, "..", "assets", filename);
  if (fs.existsSync(filePath)) {
    return {
      filename,
      content: fs.readFileSync(filePath),
      content_id: cid,
    };
  }
  return null;
};

// 1. CONFIRMATION NEWSLETTER (Bilingue + Photo)
async function sendConfirmationEmail(email) {
  try {
    const attachments = [
      getAssetAttachment("banniere.png", "banniereHeader"),
      getAssetAttachment("photoMama.jpg", "photoIntro"),
      getAssetAttachment("logoMama.png", "logoFooter"),
    ].filter(Boolean);

    const { data, error } = await resend.emails.send({
      from: `Mama Esther <onboarding@resend.dev>`,
      to: email,
      subject: "✅ Confirmation d'inscription / Subscription Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #fdfdfd; padding: 20px;">
          <img src="cid:banniereHeader" alt="Bannière" style="width:100%; max-width:600px; border-radius:10px; margin-bottom:20px;" />

          <h2 style="color:#007a5e;">Bienvenue chez Mama Esther 💚</h2>
          <p>Merci pour votre inscription à notre newsletter !</p>

          <h2 style="color:#007a5e; margin-top:40px;">Welcome to Mama Esther 💚</h2>
          <p>Thank you for signing up to our newsletter!</p>

          <img src="cid:photoIntro" alt="Mama Esther" style="margin:30px auto; display:block; max-width:150px; border-radius:50%;" />

          <p style="font-size:0.95rem;">Nous sommes heureux de vous accueillir dans notre communauté.</p>
          <p style="font-size:0.95rem;">We’re thrilled to welcome you to our community.</p>

          <div style="margin:40px 0;">
            <a href="https://mamaesther.org/don" target="_blank" style="background-color:#fcd116; color:#ce1126; font-weight:bold; padding:12px 24px; border-radius:30px; text-decoration:none; font-size:1rem; display:inline-block;">
              Faire un don 💚 / Support us 💚
            </a>
          </div>

          <hr style="margin:30px 0;" />
          <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
          <p style="font-size:0.85rem; color:#555;">Association Mama Esther – Ensemble pour le bien / Together for good 💚</p>
        </div>
      `,
      attachments,
    });

    if (error) throw error;
    console.log("✉️ Mail de confirmation newsletter envoyé ! ID:", data.id);
  } catch (err) {
    console.error("❌ Envoi mail confirmation newsletter échoué :", err);
  }
}

// 2. CONFIRMATION CONTACT (Pour le visiteur)
async function sendContactConfirmationEmail(name, email) {
  try {
    const attachments = [getAssetAttachment("logoMama.png", "logoFooter")].filter(Boolean);

    const { data, error } = await resend.emails.send({
      from: `Mama Esther <onboarding@resend.dev>`,
      to: email,
      subject: "✅ Nous avons bien reçu votre message",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #fdfdfd; padding: 20px;">
          <h2 style="color:#007a5e;">Bonjour ${name} 💚</h2>
          <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous reviendrons vers vous dans les plus brefs délais.</p>
          <p>L'équipe Mama Esther vous souhaite une excellente journée.</p>
          <hr style="margin:30px 0;" />
          <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
        </div>
      `,
      attachments,
    });

    if (error) throw error;
    console.log("✉️ Mail de confirmation contact envoyé au visiteur ! ID:", data.id);
  } catch (err) {
    console.error("❌ Échec envoi confirmation contact :", err);
  }
}

// 3. NOTIFICATION CONTACT (Pour l'admin)
async function sendContactAdminNotificationEmail({ name, email, subject, message }) {
  try {
    const adminAddress = process.env.ADMIN_EMAIL || "florent.gerard@mamaesther.org";

    const { data, error } = await resend.emails.send({
      from: `Mama Esther Contact <onboarding@resend.dev>`,
      to: [adminAddress],
      subject: `📬 Nouveau message de ${name} : ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius:10px;">
          <h2 style="color: #007A5E;">💌 Nouveau message reçu</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Objet :</strong> ${subject || "Aucun objet"}</p>
          <p><strong>Message :</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #007a5e;">
            ${message.replace(/\n/g, "<br />")}
          </div>
        </div>
      `,
    });

    if (error) throw error;
    console.log("✉️ Notification contact envoyée à l'admin ! ID:", data.id);
  } catch (err) {
    console.error("❌ Échec notification admin contact :", err);
  }
}

// 4. MERCI POUR LE DON (Pour le donateur)
async function sendDonConfirmationEmail(email, amount) {
  try {
    const attachments = [getAssetAttachment("banniere.png", "banniereHeader"), getAssetAttachment("logoMama.png", "logoFooter")].filter(Boolean);

    const { data, error } = await resend.emails.send({
      from: `Association Mama Esther <onboarding@resend.dev>`,
      to: email,
      subject: "Merci pour votre don 💚 / Thank you for your donation",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #fdfdfd; padding: 20px;">
          <img src="cid:banniereHeader" alt="Bannière" style="width:100%; max-width:600px; border-radius:10px; margin-bottom:20px;" />
          <h2 style="color:#007a5e;">🙏 Merci infiniment !</h2>
          <p>Nous avons bien reçu votre don de <strong>${amount} €</strong>.</p>
          <p>Grâce à vous, l'association Mama Esther poursuit sa mission d’amour et de solidarité.</p>
          <blockquote style="font-style: italic; background-color: #e6f9ef; padding: 20px; border-radius: 10px; margin: 30px 0; color: #007a5e;">
            “C’est dans les petites attentions que nous bâtissons les plus grands espoirs.”
          </blockquote>
          <hr style="margin:30px 0;" />
          <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
          <p style="font-size:0.85rem; color:#555;">Association Mama Esther – Ensemble pour le bien 💚</p>
        </div>
      `,
      attachments,
    });

    if (error) throw error;
    console.log("✉️ Mail de remerciement don envoyé ! ID:", data.id);
  } catch (err) {
    console.error("❌ Échec envoi remerciement don :", err);
  }
}

// 5. NOTIFICATION DON (Pour l'admin)
async function sendAdminNotificationEmail(email, amount) {
  try {
    const adminAddress = process.env.ADMIN_EMAIL || "florent.gerard@mamaesther.org";

    const { data, error } = await resend.emails.send({
      from: `Système Mama Esther <onboarding@resend.dev>`,
      to: [adminAddress],
      subject: "📥 Nouveau don reçu",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#007a5e;">💰 Nouveau don enregistré</h2>
          <p><strong>Email du donateur :</strong> ${email}</p>
          <p><strong>Montant :</strong> ${amount} €</p>
          <p>Vérifiez votre tableau de bord admin pour plus de détails.</p>
        </div>
      `,
    });

    if (error) throw error;
    console.log("✉️ Notification don envoyée à l'admin ! ID:", data.id);
  } catch (err) {
    console.error("❌ Échec notification admin don :", err);
  }
}

// 6. DÉSINCRIPTION
async function sendUnsubscribeEmail(email) {
  try {
    const attachments = [getAssetAttachment("logoMama.png", "logoFooter")].filter(Boolean);

    await resend.emails.send({
      from: `Mama Esther <onboarding@resend.dev>`,
      to: email,
      subject: "Désinscription confirmée",
      html: `<div style="text-align: center; font-family: Arial;"><h2>Désinscription réussie 💚</h2><p>Nous sommes désolés de vous voir partir.</p><img src="cid:logoFooter" alt="Logo" style="max-width:80px;" /></div>`,
      attachments,
    });
    console.log("✉️ Mail de désinscription envoyé !");
  } catch (err) {
    console.error("❌ Échec désinscription :", err);
  }
}

// 7. NEWSLETTER BROADCAST
async function sendNewsletterToSubscriber(email, newsletter) {
  const unsubscribeLink = `https://mamaesther.org/unsubscribe?email=${encodeURIComponent(email)}`;
  try {
    const attachments = [getAssetAttachment("logoMama.png", "logoFooter")].filter(Boolean);

    await resend.emails.send({
      from: `Mama Esther Newsletter <onboarding@resend.dev>`,
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
            <hr style="margin: 20px 0;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              <a href="${unsubscribeLink}" style="color: #007a5e;">Se désinscrire / Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
      attachments,
    });
  } catch (err) {
    console.error(`❌ Échec newsletter broadcast pour ${email} :`, err);
  }
}

// 8. ALERTE ERREUR
async function sendErrorAlertEmail(error) {
  try {
    const adminAddress = process.env.ADMIN_EMAIL || "florent.gerard@mamaesther.org";

    await resend.emails.send({
      from: `Alerte Système <onboarding@resend.dev>`,
      to: [adminAddress],
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
  sendContactConfirmationEmail,
  sendContactAdminNotificationEmail,
  sendErrorAlertEmail,
  sendNewsletterToSubscriber,
};
