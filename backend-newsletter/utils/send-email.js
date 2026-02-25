import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Fonction d’envoi d'email de confirmation après inscription
async function sendConfirmationEmail(email) {
  console.log("📦 Tentative de connexion SMTP...");
  console.log("📧 Expéditeur :", process.env.EMAIL_SENDER);
  console.log(
    "🔑 Mot de passe (raccourci) :",
    process.env.EMAIL_PASSWORD?.slice(0, 4) + "..."
  );

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify((err) => {
    if (err) {
      console.error("❌ Vérification SMTP échouée :", err);
    } else {
      console.log("✅ Transport SMTP prêt à envoyer !");
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
          path: path.resolve("assets/banniere.png"),
          cid: "banniereHeader",
        },
        {
          filename: "photoMama.jpg",
          path: path.resolve("assets/photoMama.jpg"),
          cid: "photoIntro",
        },
        {
          filename: "logoMama.png",
          path: path.resolve("assets/logoMama.png"),
          cid: "logoFooter",
        },
      ],
    });

    console.log("✉️ Mail envoyé !");
    console.log("📤 Mail accepté :", info.accepted);
    console.log("📪 Mail rejeté :", info.rejected);
    console.log("📄 Réponse SMTP :", info.response);
  } catch (err) {
    console.error("❌ Envoi mail échoué :", err);
    if (err.response) {
  console.error("📄 Réponse SMTP :", err.response);
}
if (err.code) {
  console.error("📛 Code erreur :", err.code);
}
    throw err;
  }
}

// Fonction d’envoi d'email de confirmation après désinscription
async function sendUnsubscribeEmail(email) {
  console.log("📦 Préparation du mail de désinscription...");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Mama Esther" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "✅ Confirmation d'inscription",
      html: `...`,
      attachments: [
        {
          filename: "logoMama.png",
          path: path.resolve("assets/logoMama.png"),
          cid: "logoFooter",
        },
      ],
    });

    console.log("✉️ Mail de désinscription envoyé !");
    console.log("📤 Mail accepté :", info.accepted);
    console.log("📪 Mail rejeté :", info.rejected);
    console.log("📄 Réponse SMTP :", info.response);
  } catch (err) {
    console.error("❌ Échec envoi mail désinscription :", err);
    throw err;
  }
}

// Fonction d’envoi d'email de notification à l’admin
async function sendAdminNotificationEmail(email, amount) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
}

// Fonction d’envoi d'email de confirmation après un don
async function sendDonConfirmationEmail(email, amount) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
        path: path.resolve("assets/banniere.png"),
        cid: "banniereHeader",
      },
      {
        filename: "logoMama.png",
        path: path.resolve("assets/logoMama.png"),
        cid: "logoFooter",
      },
    ],
  });
}

// Export des deux fonctions (nommés)
export {
  sendConfirmationEmail,
  sendUnsubscribeEmail,
  sendDonConfirmationEmail,
  sendAdminNotificationEmail,
};
