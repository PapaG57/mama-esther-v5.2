import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import logger from './logger.js';

/**
 * Génère un PDF à partir d'une URL de newsletter
 * @param {string} id - L'identifiant de la newsletter
 * @param {string} newsletterNumber - Le numéro de la newsletter (pour le nom du fichier)
 * @param {string} date - La date (pour le nom du fichier)
 */
export const generateNewsletterPdf = async (id, newsletterNumber, date) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // On définit l'URL de la vue newsletter du frontend
    // On peut utiliser une variable d'environnement pour l'URL de base
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = `${baseUrl}/newsletter/view/${id}`;

    logger.info(`Génération PDF pour la newsletter ${id} à l'URL : ${url}`);

    // On va sur la page et on attend que le contenu soit chargé
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // On attend un petit peu plus pour être sûr que tout (images, fonts) est rendu
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Définition du chemin de destination dans le dossier public du frontend
    const dateObj = new Date(date);
    const monthNames = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    
    const fileName = `newsletter${newsletterNumber}-${month}-${year}.pdf`;
    const publicPdfDir = path.join(process.cwd(), "..", "public", "assets", "newsletter-pdf", "pdf");
    
    // On s'assure que le dossier existe
    if (!fs.existsSync(publicPdfDir)) {
      fs.mkdirSync(publicPdfDir, { recursive: true });
    }

    const filePath = path.join(publicPdfDir, fileName);

    // On génère le PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    logger.info(`PDF généré avec succès : ${filePath}`);
    
    // On retourne l'URL relative pour la base de données
    return `/assets/newsletter-pdf/pdf/${fileName}`;

  } catch (error) {
    logger.error("Erreur lors de la génération du PDF avec Puppeteer:", error);
    throw error;
  } finally {
    await browser.close();
  }
};
