import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Écrit toutes les erreurs dans error.log
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Écrit tous les logs dans combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// En développement, on affiche aussi dans la console avec des couleurs
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
