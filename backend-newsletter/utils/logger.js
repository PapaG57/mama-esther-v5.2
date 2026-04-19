import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Toujours ajouter la console en production pour Render
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  ],
});

// En local uniquement, on peut écrire dans des fichiers si on veut
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
  logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
}

export default logger;
