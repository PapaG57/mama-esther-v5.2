import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL_SENDER?.trim();
const pass = process.env.EMAIL_PASSWORD?.trim();
const host = process.env.EMAIL_HOST?.trim();

console.log("--- TEST ENVOI SMTP (PORT 465) ---");
console.log("👤 Compte utilisé :", user);
console.log("🌐 Host :", host);

async function run() {
  const transporter = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true, // Port 465 utilise SSL/TLS
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: user,
    to: user,
    subject: "Test technique Node.js (Port 465)",
    text: "Test avec le port 465."
  };

  try {
    console.log("🚀 Tentative d'envoi d'un mail de test sur port 465...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ SUCCÈS sur port 465 !");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.log("❌ ÉCHEC sur port 465 :", err.message);
  }
}

run();
