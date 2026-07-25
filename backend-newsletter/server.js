import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";
import sequelize from "./config/database.js";

// Import des routeurs
import subscriptionRouter from "./routes/Subscription.js";
import contactRouter from "./routes/Contact.js";
import unsubscribeRouter from "./routes/unsubscribe.js";
import donRouter from "./routes/Don.js";
import donationRoutes from "./routes/Donations.js";
import helloassoRoutes from "./routes/helloasso.js";
import adminRoutes from "./routes/admin.js";
import newsletterRoutes from "./routes/newsletters.js";
import { sendErrorAlertEmail } from "./utils/send-email.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Configuration Multer pour l'explorateur Windows
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Servir les images uploadées comme des fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier envoyé" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// 1. 🛡️ SECURITY & CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://mamaesther.org",
  "https://www.mamaesther.org",
  "https://mama-esther-v5-2.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS non autorisé pour cette origine"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());

// 2. 📦 PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. 🚦 RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes effectuées, réessayez plus tard.",
});

// 🟢 Route de santé / Keep-Alive (pour garder Render et Supabase actifs)
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      db: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "degraded",
      db: "disconnected",
      error: error.message
    });
  }
});

app.use("/api", limiter);

// Montage des routeurs
app.use("/api/subscribe", subscriptionRouter);
app.use("/api/contact", contactRouter);
app.use("/api/unsubscribe", unsubscribeRouter);
app.use("/api/don", donRouter);
app.use("/api/donations", donationRoutes);
app.use("/api/helloasso", helloassoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletters", newsletterRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Serveur opérationnel (PostgreSQL) !");
});

app.use((err, req, res, next) => {
  logger.error("❌ Erreur serveur :", { message: err.message, stack: err.stack });
  if (process.env.NODE_ENV === "production") {
    sendErrorAlertEmail(err).catch(e => logger.error("Échec envoi alerte mail", e));
  }
  res.status(500).json({ error: "Erreur interne du serveur" });
});

logger.info("🧪 Tentative de connexion à PostgreSQL...");
sequelize.sync({ alter: true }) // Synchronise les modèles avec la base
  .then(() => {
    logger.info("✅ Connexion PostgreSQL OK & Tables synchronisées");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur en route sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Erreur connexion PostgreSQL :", err);
  });
