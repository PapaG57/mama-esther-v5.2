import React from "react";
import { newsletters } from "../data/newsletters";
import "../styles/components/NewsletterGallery.css";
import { useTranslation } from "react-i18next";

function NewsletterGallery() {
  const { t } = useTranslation();
  return (
    <section className="newsletter-gallery">
      <h2>{t("newsletters.titleGallery")}</h2>
      <p>{t("newsletters.subtitleGallery")}</p>
      <ul className="newsletter-list">
        {newsletters.map((nl) => (
          <li key={nl.id} className="newsletter-item">
            <h3>{t(nl.titleKey)}</h3>
            <div className="newsletter-links">
              <a href={nl.htmlPath} target="_blank" rel="noopener noreferrer">
                {t("newsletters.webVersion")}
              </a>
              <a href={nl.pdfPath} target="_blank" rel="noopener noreferrer">
                {t("newsletters.downloadPdf")}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NewsletterGallery;
