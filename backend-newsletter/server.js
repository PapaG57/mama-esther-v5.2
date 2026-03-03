import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";

// 🔧 Fix DNS pour MongoDB Atlas
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

// 1. 🛡️ SECURITY & CORS
app.use(helmet()); 
app.use(
  cors({
    origin: process.env.FRONT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// 2. 📦 PARSERS
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. 🧹 SANITIZATION (Désactivé temporairement car cause un crash système)
// app.use(mongoSanitize()); 
// app.use(xss()); 

// 4. 🚦 RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes effectuées, réessayez plus tard.",
});
app.use("/api/", limiter);

// Montage des routeurs
app.use("/api/subscribe", subscriptionRouter);
app.use("/api/contact", contactRouter);
app.use("/api/unsubscribe", unsubscribeRouter);
app.use("/api/don", donRouter);
app.use("/api/donations", donationRoutes);
app.use("/api/helloasso", helloassoRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🟢 Serveur opérationnel !");
});

app.use((err, req, res, next) => {
  logger.error("❌ Erreur serveur :", { message: err.message, stack: err.stack });
  if (process.env.NODE_ENV === "production") {
    sendErrorAlertEmail(err).catch(e => logger.error("Échec envoi alerte mail", e));
  }
  res.status(500).json({ error: "Erreur interne du serveur" });
});

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
