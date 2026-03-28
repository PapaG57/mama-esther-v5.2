import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL_SENDER?.trim();
const pass = process.env.EMAIL_PASSWORD?.trim();
const host = process.env.EMAIL_HOST?.trim();

console.log("--- TEST ENVOI RÉEL (THÉORIE DE L'EXPÉDITEUR) ---");
console.log("👤 Compte utilisé :", user);

async function run() {
  const transporter = nodemailer.createTransport({
    host: host,
    port: 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: user, // 👈 On force l'expéditeur à être EXACTEMENT le login
    to: user,   // 👈 On s'envoie le mail à soi-même
    subject: "Test technique Node.js",
    text: "Si tu reçois ce mail, c'est que la connexion SMTP est ENFIN réparée !"
  };

  try {
    console.log("🚀 Tentative d'envoi d'un mail de test...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ VICTOIRE ABSOLUE ! Le mail est parti.");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.log("❌ ÉCHEC :", err.message);
    console.log("\n💡 DERNIER RECOURS : Si Outlook marche sur ce même PC, vérifie dans Outlook si tu n'as pas coché 'Mon serveur sortant requiert une authentification' avec des réglages différents (ex: nom d'utilisateur différent de l'adresse mail).");
  }
}

run();
