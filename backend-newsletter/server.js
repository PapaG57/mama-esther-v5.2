import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import logger from "./utils/logger.js";

// 🔧 Fix DNS pour MongoDB Atlas (Windows + Node)
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Import des routeurs
import subscriptionRouter from "./routes/Subscription.js";
import contactRouter from "./routes/Contact.js";
import unsubscribeRouter from "./routes/unsubscribe.js";
import donRouter from "./routes/Don.js";
import donationRoutes from "./routes/Donations.js";
import helloassoRoutes from "./routes/helloasso.js";
import adminRoutes from "./routes/admin.js";
import { sendErrorAlertEmail } from "./utils/send-email.js";

dotenv.config();

const app = express();

// 🛡️ SECURITY MIDDLEWARES
app.use(helmet()); // Secure headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes effectuées, réessayez plus tard.",
});
app.use("/api/", limiter); // Apply rate limiting to all API routes

// 🔧 Middlewares
app.use(
  cors({
    origin: process.env.FRONT_URL || "http://localhost:5173", // configurable via .env
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DOS

// Montage des routeurs
app.use("/api/subscribe", subscriptionRouter);
app.use("/api/contact", contactRouter);
app.use("/api/unsubscribe", unsubscribeRouter);
app.use("/api/don", donRouter);
app.use("/api/donations", donationRoutes);
app.use("/api/helloasso", helloassoRoutes);
app.use("/api/admin", adminRoutes);

// Route racine
app.get("/", (req, res) => {
  res.send("🟢 Serveur opérationnel !");
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error("❌ Erreur serveur :", { message: err.message, stack: err.stack });

  // Alerte admin pour les erreurs critiques en production
  if (process.env.NODE_ENV === "production") {
    sendErrorAlertEmail(err).catch(e => logger.error("Échec envoi alerte mail", e));
  }

  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Connexion MongoDB + démarrage serveur
logger.info("🧪 Tentative de connexion à MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, { dbName: "newsletter_db" })
  .then(() => {
    logger.info("✅ Connexion MongoDB OK");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur en route sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Erreur connexion MongoDB :", err);
  });
