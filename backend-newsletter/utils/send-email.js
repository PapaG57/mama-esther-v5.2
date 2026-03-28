import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction d’envoi d'email de confirmation après inscription
async function sendConfirmationEmail(email) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "✅ Confirmation d'inscription",
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
      attachments: [
        {
          filename: "banniere.png",
          path: path.join(__dirname, "..", "assets", "banniere.png"),
          cid: "banniereHeader",
        },
        {
          filename: "photoMama.jpg",
          path: path.join(__dirname, "..", "assets", "photoMama.jpg"),
          cid: "photoIntro",
        },
        {
          filename: "logoMama.png",
          path: path.join(__dirname, "..", "assets", "logoMama.png"),
          cid: "logoFooter",
        },
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
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Désinscription confirmée",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Votre désinscription a été prise en compte 💚</h2>
          <p>Vous ne recevrez plus nos prochaines newsletters.</p>
          <hr />
          <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
        </div>
      `,
      attachments: [
        {
          filename: "logoMama.png",
          path: path.join(__dirname, "..", "assets", "logoMama.png"),
          cid: "logoFooter",
        },
      ],
    });

    console.log("✉️ Mail de désinscription envoyé !");
  } catch (err) {
    console.error("❌ Échec envoi mail désinscription :", err);
    throw err;
  }
}

// Fonction d’envoi d'email de notification à l’admin
async function sendAdminNotificationEmail(email, amount) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"Système Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "📥 Nouveau don reçu",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>Nouveau don enregistré</h3>
          <p><strong>Email du donateur :</strong> ${email}</p>
          <p><strong>Montant :</strong> ${amount} €</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("❌ Échec envoi notification admin :", err);
  }
}

// Fonction d’envoi d'email de confirmation après un don
async function sendDonConfirmationEmail(email, amount) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"Association Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Merci pour votre don 💚",
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #fdfdfd; padding: 20px;">
      <img src="cid:banniereHeader" alt="Bannière" style="width:100%; max-width:600px; border-radius:10px; margin-bottom:20px;" />

      <h2 style="color:#007a5e;">🙏 Merci infiniment !</h2>
      <p>Nous avons bien reçu votre don de <strong>${amount} €</strong>.</p>
      <p>Grâce à vous, L'association Mama Esther poursuit sa mission d’amour et de solidarité.</p>

      <blockquote style="font-style: italic; background-color: #e6f9ef; padding: 20px; border-radius: 10px; margin: 30px 0; color: #007a5e;">
        “C’est dans les petites attentions que nous bâtissons les plus grands espoirs.”
      </blockquote>

      <hr style="margin:30px 0;" />
      <img src="cid:logoFooter" alt="Logo Mama Esther" style="max-width:80px;" />
      <p style="font-size:0.85rem; color:#555;">Association Mama Esther – Ensemble pour le bien 💚</p>
    </div>
  `,
      attachments: [
        {
          filename: "banniere.png",
          path: path.join(__dirname, "..", "assets", "banniere.png"),
          cid: "banniereHeader",
        },
        {
          filename: "logoMama.png",
          path: path.join(__dirname, "..", "assets", "logoMama.png"),
          cid: "logoFooter",
        },
      ],
    });
  } catch (err) {
    console.error("❌ Échec envoi mail confirmation don :", err);
  }
}

// Fonction d’envoi d'email d'alerte en cas d'erreur critique
async function sendErrorAlertEmail(error) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // false pour le port 587
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"Alerte Système Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_SENDER,
      subject: "🚨 Erreur critique sur le serveur",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #ce1126; border-radius: 10px;">
          <h2 style="color: #ce1126;">⚠️ Une erreur critique est survenue</h2>
          <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Message :</strong> ${error.message}</p>
          <p><strong>Stack Trace :</strong></p>
          <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto;">
            ${error.stack}
          </pre>
        </div>
      `,
    });
    console.log("📢 Email d'alerte envoyé à l'administrateur.");
  } catch (err) {
    console.error("❌ Impossible d'envoyer l'email d'alerte :", err);
  }
}

// Fonction d’envoi d'une newsletter à un abonné
async function sendNewsletterToSubscriber(email, newsletter) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Construction du lien de désinscription
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
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              ${newsletter.summary.fr}
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://mamaesther.org/newsletter/view/${newsletter._id}" 
                 style="background-color: #fcd116; color: #ce1126; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
                Lire la version complète en ligne 💚
              </a>
            </div>

            <p style="font-size: 14px; color: #888; border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px;">
              Vous recevez cet e-mail car vous êtes inscrit à la newsletter de l'Association Mama Esther.
              <br /><br />
              <a href="${unsubscribeLink}" style="color: #ce1126; text-decoration: underline;">Se désinscrire</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "logoMama.png",
          path: path.join(__dirname, "..", "assets", "logoMama.png"),
          cid: "logoFooter",
        },
      ],
    });
  } catch (err) {
    console.error(`❌ Échec envoi newsletter à ${email} :`, err);
    throw err;
  }
}

// Export des fonctions
export {
  sendConfirmationEmail,
  sendUnsubscribeEmail,
  sendDonConfirmationEmail,
  sendAdminNotificationEmail,
  sendErrorAlertEmail,
  sendNewsletterToSubscriber,
};


