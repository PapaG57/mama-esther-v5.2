import jwt from "jsonwebtoken";
const { verify } = jwt;

export default function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  // Vérifie que le header existe et commence par "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Injecte les infos dans req
    next(); // Autorise l'accès
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    res.status(403).json({ error: "Accès interdit" });
  }
}