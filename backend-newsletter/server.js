import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

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

dotenv.config();

const app = express();

// 🔧 Middlewares
app.use(
  cors({
    origin: process.env.FRONT_URL || "http://localhost:5173", // configurable via .env
    credentials: true,
  }),
);
app.use(express.json());

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
  console.error("❌ Erreur serveur :", err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Connexion MongoDB + démarrage serveur
console.log("🧪 Tentative de connexion à MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, { dbName: "newsletter_db" })
  .then(() => {
    console.log("✅ Connexion MongoDB OK");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en route sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur connexion MongoDB :", err);
  });
